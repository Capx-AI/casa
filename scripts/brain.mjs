#!/usr/bin/env node
// Company-brain state engine. Performs the deterministic self-update of the
// company workspace: derives the current level, writes build-map.json + NOW.md,
// and rewrites the CLAUDE.md AUTO blocks (T1-T5) safely (inside markers only).
//
//   node scripts/brain.mjs init     <brainDir>
//   node scripts/brain.mjs sync     <brainDir>
//   node scripts/brain.mjs complete <brainDir> <playbook-id> [<id> ...]
//   node scripts/brain.mjs waiting  <brainDir> <playbook-id> <reason...>
//   node scripts/brain.mjs unwait   <brainDir> <playbook-id>
//   node scripts/brain.mjs grade    <brainDir> <playbook-id> <score> <true|false> '<gapsJson>'
//   node scripts/brain.mjs attest   <brainDir>
//
// progress lives in <brainDir>/state.json { completed: [...] }; everything else
// (build-map.json, NOW.md, CLAUDE.md blocks) is rendered from it + profile.json.

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildMap, nextActions, select, unknownDepartments, gatesLevel } from "./router.mjs";
import { northStar } from "./northstar.mjs";
import { appendEvent } from "./ledger.mjs";
import { checkLegality } from "./caf/legality.mjs";
import { attest } from "./attest.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
const TEMPLATE = join(repo, "templates", "company-brain");
const LEVEL_NAMES = {
  "always-on": "Foundations", 0: "Ideation and Validation", 1: "Commit and Incorporate",
  2: "Product and Infra Foundation", 3: "Build and Pre-launch", 4: "Launch",
  5: "First Customers and PMF", 6: "Scale Acquisition", 7: "Enterprise Sales",
  8: "Growth Finance and Fundraise",
};
const levelKey = (l) => (l === "always-on" ? -1 : Number(l));
const today = () => new Date().toISOString().slice(0, 10);

// Fail-loud floor: when the founder named NO binding constraint, the ranking is generic and the
// Console must say so. A type-default lead lane is offered as an honestly-labeled guess, never as a
// diagnosis. This is a floor, not a substitute for running the constraint step of /casa-start.
const DEFAULT_LEAD_BY_TYPE = {
  saas: "Product", marketplace: "Growth", ecommerce: "Growth", hardware: "Engineering",
  crypto: "Engineering", fintech: "Finance", services: "Operations", consumer: "Growth",
  devtool: "Engineering", content: "Growth", hardware_devtool: "Engineering",
};
const defaultLead = (profile) => DEFAULT_LEAD_BY_TYPE[profile.primary_type] || "Strategy";
const playbooks = () => JSON.parse(readFileSync(join(repo, "playbooks", "_index.json"), "utf8")).playbooks;
const titleOf = (pb) => new Map(pb.map((p) => [p.id, p.title]));

const daysSince = (d) => (d ? Math.floor((Date.now() - new Date(d).getTime()) / 86400000) : Infinity);
function loadLoops(dir) {
  const f = existsSync(join(dir, "loops.json")) ? join(dir, "loops.json") : join(TEMPLATE, "loops.json");
  return existsSync(f) ? (JSON.parse(readFileSync(f, "utf8")).loops || []) : [];
}
function dueLoops(dir, profile, level, state) {
  const traits = new Set(profile.traits || []);
  const ran = state.loops || {};
  return loadLoops(dir).filter((l) => {
    if (level < (l.min_level ?? 0)) return false;
    if (l.applies_when && !l.applies_when.every((t) => traits.has(t))) return false;
    if (!l.cadence_days) return false;
    return daysSince(ran[l.id]) >= l.cadence_days;
  }).map((l) => ({ id: l.id, title: l.title, runs: l.runs }));
}

// External payment tools may write receipts here (amountMicros in micro-dollars,
// status 'settled' | 'dry-run' | 'failed'). Casa only reads them and never writes
// charges. 1 USD = 1_000_000 micros.
function readSpend(dir) {
  const f = join(dir, "finance", "receipts.jsonl");
  if (!existsSync(f)) return 0;
  let micros = 0;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const s = line.trim(); if (!s) continue;
    try { const r = JSON.parse(s); if (r.status === "settled") micros += Number(r.amountMicros || 0); }
    catch { /* skip malformed line */ }
  }
  return Math.round((micros / 1_000_000) * 100) / 100; // micros -> USD
}

function readProfile(dir) {
  const f = join(dir, "profile.json");
  if (!existsSync(f)) throw new Error(`no profile.json in ${dir} (run casa-start)`);
  return JSON.parse(readFileSync(f, "utf8"));
}
function readState(dir) {
  const f = join(dir, "state.json");
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) || { completed: [] } : { completed: [] };
}
function writeState(dir, s) { writeFileSync(join(dir, "state.json"), JSON.stringify(s, null, 2)); }

// current level = first level whose non-recurring members are not all completed.
// Phase 0 distribution plays are excluded (gatesLevel): they are catch-up, not a
// ladder pin, so an existing brain stays usable if they are still open.
function deriveLevel(pb, profile, completed) {
  const { members } = select(pb, profile);
  const done = new Set(completed);
  const levels = [...new Set(members.map((m) => m.level))].filter((l) => l !== "always-on").sort((a, b) => levelKey(a) - levelKey(b));
  for (const L of levels) {
    const nonRec = members.filter((m) => m.level === L && !m.recurring && gatesLevel(m));
    if (!nonRec.length || nonRec.every((m) => done.has(m.id))) continue;
    // Incomplete. But is there any work here the company can actually DO at this level?
    // A level whose remaining members are all blocked by a milestone flag that only a
    // HIGHER level grants is a deadlock: the company can never finish it, so it can
    // never leave it. Real case: the level-1 play `category-design-decision` excludes
    // `pre_product_pre_customer`, which router.mjs grants to every company below level
    // 5, so a greenfield company could never pass level 1. The bug stayed invisible
    // because evaluated companies were seeded with start_level and currentLevel()
    // floors on that. If nothing here is ready, this level cannot progress. Move on.
    const map = buildMap(pb, profile, { completed, level: Number(L) });
    const entry = map.levels.find((x) => String(x.level) === String(L));
    if (entry?.nodes.some((n) => n.status === "ready" && !n.recurring && gatesLevel(n))) return Number(L);
  }
  return 8;
}

// The displayed level never drops below the floor the founder started at
// (state.start_level, set by the stage seed). A lower-level gap therefore surfaces
// as a ready catch-up item at the current level instead of regressing the company.
function currentLevel(pb, profile, state) {
  const derived = deriveLevel(pb, profile, state.completed || []);
  return Math.max(derived, Number(state.start_level || 0));
}

function setBlock(text, section, inner) {
  const re = new RegExp(`(<!-- CASA:AUTO:${section} -->)[\\s\\S]*?(<!-- /CASA:AUTO:${section} -->)`);
  return re.test(text) ? text.replace(re, (_m, open, close) => `${open}\n${inner}\n${close}`) : text;
}

// Plain-language labels for the constraint archetypes (founder-facing; the ids stay canonical).
const CONSTRAINT_LABELS = {
  no_users: "no users yet", no_revenue: "no revenue yet", runway_burn: "runway",
  regulatory_legal: "regulatory clearance", tech_scale: "reliability at scale", hiring_capacity: "capacity",
};

function nowText(profile, actions, level, due = [], spend = 0, ns = null, bc = null, waiting = [], titles = null) {
  const top = actions[0];
  const out = [`# Now`, ``, `Company: ${profile.company_name || profile.one_liner || "(unnamed)"}`,
    `Level ${level}: ${LEVEL_NAMES[level] || level}`];
  if (ns) out.push(`North star now: ${ns.label}${ns.band === "scale" ? "" : ` (heading toward ${ns.mature_growth_label})`}`);
  if (bc?.archetype) {
    const leads = (bc.lead_departments || []).join(", ");
    out.push(`Do-or-die constraint: ${CONSTRAINT_LABELS[bc.archetype] || bc.archetype}${leads ? ` (${leads} lead)` : ""}`);
  }
  if (spend > 0) out.push(`Recorded spend to date: $${spend}`);
  out.push(``, `## Next action`);
  if (!top) out.push(`- Nothing ready at this level. Run /casa-map or advance the level.`);
  else {
    out.push(`- ${top.title}  (${top.id})${top.human_gate ? "  [needs your approval]" : ""}`);
    const par = actions.slice(1, 4); // next-highest ready actions, any level (all are startable now)
    if (par.length) { out.push(``, `## You can also start now`); for (const p of par) out.push(`- ${p.title}  (${p.id})`); }
  }
  if (waiting.length) {
    out.push(``, `## Waiting on you`);
    for (const [id, reason] of waiting) out.push(`- ${titles?.get(id) || id}: ${reason}`);
  }
  if (due.length) { out.push(``, `## Loops due now`); for (const l of due) out.push(`- ${l.title}  (loop: ${l.id})`); }
  out.push(``, `This file is kept current by the router. Do not hand-edit.`);
  return out.join("\n") + "\n";
}

function sync(dir) {
  const pb = playbooks();
  const profile = readProfile(dir);
  const state = readState(dir);
  const completed = state.completed || [];
  const level = currentLevel(pb, profile, state);
  const pulse = existsSync(join(dir, "pulse.json")) ? JSON.parse(readFileSync(join(dir, "pulse.json"), "utf8")) : null;
  const weights = pulse?.weights || null;
  // Known aliases (Marketing/Design/Support) are normalized by the engine; a truly unknown
  // department key would silently weight nothing, so surface it rather than drop it.
  const unknownDepts = unknownDepartments(weights);
  if (unknownDepts.length) {
    console.warn(`warning: pulse.json weights.byDepartment has unrecognized department(s): ${unknownDepts.join(", ")}. ` +
      `Use the canonical 11 (Strategy, Brand, Product, Engineering, Data, Growth, Sales, Success, Finance, Legal, Operations); these keys will not affect ranking.`);
  }
  // The binding constraint is read from state and passed DIRECTLY to the engine (not laundered
  // through pulse.json). Its absence is surfaced loudly so the Console never presents generic
  // ranking as if it were diagnosed.
  const binding_constraint = state.binding_constraint || null;
  const map = buildMap(pb, profile, { completed, level });
  const actions = nextActions(pb, profile, { completed, level, weights, binding_constraint });
  const due = dueLoops(dir, profile, level, state);
  const spend = readSpend(dir);
  const titles = titleOf(pb);
  const ns = northStar(profile, level);

  writeFileSync(join(dir, "build-map.json"), JSON.stringify({
    business_profile: profile, current_level: level, active_north_star: ns, mature_north_star: profile.north_star || null,
    binding_constraint, constraint_missing: !binding_constraint,
    default_lead: binding_constraint ? null : defaultLead(profile),
    ...map,
  }, null, 2));
  const waiting = Object.entries(state.waiting || {});
  writeFileSync(join(dir, "NOW.md"), nowText(profile, actions, level, due, spend, ns, binding_constraint, waiting, titles));

  // self-update the CLAUDE.md AUTO blocks (T1-T5)
  const cmPath = join(dir, "CLAUDE.md");
  if (existsSync(cmPath)) {
    let cm = readFileSync(cmPath, "utf8").replaceAll("{{COMPANY_NAME}}", profile.company_name || "your company");
    const types = [profile.primary_type, profile.secondary_type].filter(Boolean).join(" + ");
    cm = setBlock(cm, "profile", [
      `- Name: ${profile.company_name || "(unnamed)"}`,
      `- One-liner: ${profile.one_liner || ""}`,
      `- Type: ${types}`,
      `- Traits: ${(profile.traits || []).join(", ")}`,
      `- ICP: ${profile.icp || ""}`,
      `- Monetization: ${profile.monetization || ""}`,
      `- North star now: ${ns.label}`,
      `- Heading toward: ${ns.mature_growth_label} (retention via ${ns.mature_retention_label})`,
    ].join("\n"));
    cm = setBlock(cm, "selected-levels", `Selected ${map.member_count} playbooks across ` +
      map.levels.map((l) => `L${l.level} (${l.nodes.length})`).join(", ") + ".");
    cm = setBlock(cm, "current-level", `Level ${level}: ${LEVEL_NAMES[level] || level}.`);
    const top = actions[0];
    const nextInner = top
      ? [`Next: ${top.title} (${top.id})${top.human_gate ? " [needs approval]" : ""}`,
         ...actions.slice(1, 3).map((p) => `Parallel: ${p.title} (${p.id})`)].join("\n")
      : `Next: nothing ready at level ${level}.`;
    cm = setBlock(cm, "next", nextInner);
    const doneTitles = completed.slice(-10).map((id) => `- ${titles.get(id) || id}`);
    cm = setBlock(cm, "done", doneTitles.length ? doneTitles.join("\n") : "Nothing completed yet.");
    cm = setBlock(cm, "state", `${completed.length} playbooks done. Level ${level}.${spend > 0 ? ` Recorded spend to date: $${spend}.` : ""} Updated ${today()}.`);
    writeFileSync(cmPath, cm);
  }

  // Self-check: replay the ledger against the router. A founder using Casa honestly
  // never trips this, because the router cannot surface an illegal move. If it fires,
  // something is genuinely wrong with the brain, and they want to know before they
  // publish an attestation of it rather than after.
  try {
    const lg = checkLegality(dir);
    if (lg.total_violations) {
      console.warn(`\nlegality: ${lg.total_violations} violation(s) replaying ledger.jsonl against the router.`);
      for (const v of lg.violations.slice(0, 5)) console.warn(`  ${v.kind}: ${v.node_id || v.event} - ${v.detail}`);
      if (lg.violations.length > 5) console.warn(`  ... and ${lg.violations.length - 5} more (node scripts/caf/legality.mjs ${dir})`);
    }
  } catch { /* a brain with no ledger yet is not a violation */ }

  return { level, completed: completed.length, member_count: map.member_count, top: actions[0] };
}

function init(dir) {
  // Refuse to clobber a populated brain. cpSync would overwrite profile.json (the core),
  // dials.json (the founder's autonomy settings), and the rendered files with empty template
  // versions, silently destroying real work. A fresh or empty dir is fine (the template's own
  // empty profile.json does not exist yet at this point).
  if (existsSync(join(dir, "profile.json")) || existsSync(join(dir, "state.json"))) {
    console.error(`a company brain already exists at ${dir}; init would overwrite it. Nothing changed. ` +
      `Run 'brain.mjs sync ${dir}' to re-render, or delete the directory first to start over.`);
    process.exit(2);
  }
  mkdirSync(dir, { recursive: true });
  cpSync(TEMPLATE, dir, { recursive: true });
  if (!existsSync(join(dir, "state.json"))) writeState(dir, { completed: [] });
  console.log(`initialized company brain at ${dir}`);

  // The company's public identity. `company_pubkey` stays null until the founder runs
  // `caf/keygen.mjs`; Casa records only the public half and never sees a private key.
  const idf = join(dir, "identity.json");
  if (existsSync(idf)) {
    const id = JSON.parse(readFileSync(idf, "utf8"));
    if (!id.created_at) id.created_at = new Date().toISOString();
    // Record which agent harness is driving this brain (CAF 1.1.0 subject.driver_harness).
    // Detection happens HERE, once, so attest stays a pure function of brain state: it
    // reads identity.json and never sniffs the environment. CASA_DRIVER overrides for
    // harnesses that expose no marker of their own; Claude Code is detected by the
    // plugin-root variable it always sets. Absent both, the field stays null and the
    // envelope simply omits it.
    if (!id.driver_harness) {
      if (typeof process.env.CASA_DRIVER === "string" && process.env.CASA_DRIVER.trim()) {
        id.driver_harness = { name: process.env.CASA_DRIVER.trim() };
      } else if (process.env.CLAUDE_PLUGIN_ROOT) {
        id.driver_harness = { name: "claude-code" };
      }
    }
    writeFileSync(idf, JSON.stringify(id, null, 2) + "\n");
  }
}

function complete(dir, ids) {
  const state = readState(dir);
  const known = new Map(playbooks().map((p) => [p.id, p]));
  const unknown = ids.filter((id) => !known.has(id));
  if (unknown.length) { console.error(`complete: unknown playbook id(s): ${unknown.join(", ")}`); process.exit(2); }

  const fresh = ids.filter((id) => !(state.completed || []).includes(id));
  state.completed = [...new Set([...(state.completed || []), ...ids])];
  // Completing a play clears its waiting-on-founder flag.
  for (const id of ids) if (state.waiting?.[id]) delete state.waiting[id];
  writeState(dir, state);

  // Leave a timestamped, ordered record. state.json says WHICH nodes are done;
  // only the ledger says in what order and when, which is what a legality check
  // and an attestation both replay.
  for (const id of fresh) {
    const p = known.get(id);
    const outputs = join("outputs", id);
    const artifact = existsSync(join(dir, outputs, "README.md")) ? join(outputs, "README.md") : undefined;
    appendEvent(dir, { kind: "playbook", node_id: id, task: p.title, status: "done", dept: p.department, artifact });
  }

  const r = sync(dir);
  console.log(`marked done: ${ids.join(", ")}`);
  // Honesty nudge, not a gate: done work should leave a record behind.
  const noArtifact = ids.filter((id) => !existsSync(join(dir, "outputs", id)));
  if (noArtifact.length) console.log(`note: no artifact recorded at outputs/ for: ${noArtifact.join(", ")}. Done work should leave its deliverable in company-brain/outputs/<id>/.`);
  console.log(`now level ${r.level}, ${r.completed} done. Next: ${r.top ? r.top.title : "(none)"}`);
}

function setWaiting(dir, id, reason) {
  if (!playbooks().some((p) => p.id === id)) { console.error(`unknown playbook id "${id}"`); process.exit(2); }
  const state = readState(dir);
  state.waiting = state.waiting || {};
  state.waiting[id] = reason;
  writeState(dir, state);
  sync(dir);
  console.log(`marked waiting on you: ${id} (${reason})`);
}

function unwait(dir, id) {
  const state = readState(dir);
  if (!state.waiting?.[id]) { console.error(`${id} is not marked waiting`); process.exit(2); }
  delete state.waiting[id];
  writeState(dir, state);
  sync(dir);
  console.log(`cleared waiting: ${id}`);
}

// Persist an advisor grade. The advisor (casa-review) judges; the ENGINE writes.
// This used to be a `node -e` one-liner inside skills/casa-review/SKILL.md, which
// meant the graded model wrote its own grade straight into brain state, bypassing
// the sole-writer rule. Validation lives here because a score for a playbook that
// does not exist, or a score outside 0-100, is not a grade -- it is corruption.
function grade(dir, nodeId, scoreArg, passArg, gapsArg) {
  const known = new Set(playbooks().map((p) => p.id));
  if (!known.has(nodeId)) throw new Error(`grade: unknown playbook id "${nodeId}"`);

  const score = Number(scoreArg);
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new Error(`grade: score must be an integer 0-100, got "${scoreArg}"`);
  }
  if (passArg !== "true" && passArg !== "false") {
    throw new Error(`grade: pass must be "true" or "false", got "${passArg}"`);
  }

  let gaps;
  try { gaps = JSON.parse(gapsArg ?? "[]"); }
  catch { throw new Error(`grade: gaps must be a JSON array, got "${gapsArg}"`); }
  if (!Array.isArray(gaps) || gaps.some((g) => typeof g !== "string")) {
    throw new Error("grade: gaps must be a JSON array of strings");
  }

  const rec = { nodeId, score, pass: passArg === "true", gaps, ts: new Date().toISOString() };
  appendFileSync(join(dir, "scores.jsonl"), JSON.stringify(rec) + "\n");
  return rec;
}

const [cmd, dir, ...rest] = process.argv.slice(2);
if (!cmd || !dir) { console.error("usage: brain.mjs init|sync|complete|waiting|unwait|loop-ran|priority-ran|experiment|grade|attest|due <brainDir> [args...]"); process.exit(2); }
if (cmd === "init") init(dir);
else if (cmd === "sync") { const r = sync(dir); console.log(`synced: level ${r.level}, ${r.completed} done, ${r.member_count} playbooks. Next: ${r.top ? r.top.title : "(none)"}`); }
else if (cmd === "complete") { if (!rest.length) { console.error("complete needs at least one playbook id"); process.exit(2); } complete(dir, rest); }
else if (cmd === "loop-ran") { if (!rest.length) { console.error("loop-ran needs a loop id"); process.exit(2); } const s = readState(dir); s.loops = s.loops || {}; s.loops[rest[0]] = today(); writeState(dir, s); sync(dir); console.log(`loop ${rest[0]} marked run ${today()}`); }
else if (cmd === "priority-ran") { const s = readState(dir); s.last_priority = today(); writeState(dir, s); sync(dir); console.log(`priority re-evaluated ${today()}`); }
else if (cmd === "experiment") { if (!rest.length) { console.error("experiment needs a JSON record"); process.exit(2); } const rec = JSON.parse(rest.join(" ")); rec.logged = today(); appendFileSync(join(dir, "experiments.jsonl"), JSON.stringify(rec) + "\n"); console.log(`logged experiment ${rec.id || "(unnamed)"} ${today()}`); }
else if (cmd === "grade") {
  if (rest.length < 3) { console.error("grade needs <playbook-id> <score> <true|false> ['<gapsJson>']"); process.exit(2); }
  try { const r = grade(dir, rest[0], rest[1], rest[2], rest[3]); console.log(`graded ${r.nodeId}: ${r.score}/100 ${r.pass ? "pass" : "fail"}${r.gaps.length ? `, ${r.gaps.length} gap(s)` : ""}`); }
  catch (e) { console.error(e.message); process.exit(2); }
}
else if (cmd === "attest") {
  try {
    const r = attest(dir);
    console.log(`attestation ${r.envelope.sequence} rendered to ${r.out}`);
    console.log(`  window ${r.envelope.window.from_ts} .. ${r.envelope.window.to_ts}  (${r.events} events)`);
    console.log(`  brain root ${r.envelope.roots.brain_root.slice(0, 16)}...  envelope ${r.envelope_hash.slice(0, 16)}...`);
    console.log(`  UNSIGNED. Casa holds no keys. Sign it with: node caf/sign.mjs ${dir}`);
  } catch (e) { console.error(e.message); process.exit(2); }
}
else if (cmd === "due") { const pb = playbooks(); const profile = readProfile(dir); const state = readState(dir); const level = currentLevel(pb, profile, state); console.log(JSON.stringify(dueLoops(dir, profile, level, state))); }
else if (cmd === "waiting") { if (rest.length < 2) { console.error("waiting needs a playbook id and a reason"); process.exit(2); } setWaiting(dir, rest[0], rest.slice(1).join(" ")); }
else if (cmd === "unwait") { if (!rest.length) { console.error("unwait needs a playbook id"); process.exit(2); } unwait(dir, rest[0]); }
else { console.error(`unknown command: ${cmd}`); process.exit(2); }

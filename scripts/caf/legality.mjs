// Legality: replay a company's ledger and ask, for every playbook it claims to have
// completed, whether that playbook was actually READY at the moment it was claimed.
//
// This is the cheapest fraud detector in the whole design and it costs zero tokens.
// The playbook library is a public 173-node graph with declared dependencies, an
// artifact dataflow, and level gates. A forger writing plausible-looking JSON produces
// an illegal traversal almost immediately, because the router cannot generate one.
//
// THE RULE: decide readiness with the router's own `ready()`, never a reimplementation.
// The router mints artifacts from milestone flags, ignores non-member dependencies,
// counts a reached recurring loop as satisfied, and lets an unproducible input pass.
// A hand-rolled depends_on/consumes walk reports 11 violations on the golden fixture,
// which the router itself produced. Of those, 9 are explained by the first three rules
// and 2 only by artifact minting. So: the engine decides. This module only CLASSIFIES,
// after the fact, why the engine said no.
//
// A founder using Casa honestly never trips this, because the router cannot surface an
// illegal move. If `brain.mjs sync` ever reports a violation, something is genuinely
// wrong with the brain and they want to know before they publish it.
//
// Zero dependencies (node: builtins + relative only).

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { select, buildMap, readinessCtx, ready, achievedFlags, levelKey, STATE_FLAGS, gatesLevel } from "../router.mjs";
import { digest } from "./digest.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(dirname(here));
const arr = (x) => (Array.isArray(x) ? x : []);

export const VIOLATIONS = [
  "already_complete",    // the same playbook claimed done twice
  "unknown_node",        // node_id is not in the playbook catalog at all
  "non_member",          // a real playbook, but not selected for this company's profile
  "level_gate",          // completed above the company's level at the time
  "dependency",          // a member dependency was not complete
  "dataflow",            // a consumed artifact no member had produced yet
  "state_flag",          // required/excluded milestone flag not satisfied
  "unclassified",        // the engine said no and none of the above explains it
  "duplicate_artifact",  // two different playbooks claim the same bytes
  "rubric_drift",        // rubric_sha256 does not match the pinned catalog
  "replayed_event",      // the same event id appears twice
];

function catalog() {
  const raw = JSON.parse(readFileSync(join(repo, "playbooks", "_index.json"), "utf8"));
  return { playbooks: raw.playbooks, index_sha256: raw.index_sha256, byId: new Map(raw.playbooks.map((p) => [p.id, p])) };
}

function readJsonl(f) {
  if (!existsSync(f)) return [];
  return readFileSync(f, "utf8").split("\n").map((l) => l.trim()).filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

// The level the engine would derive from a given completed set. Mirrors brain.mjs
// deriveLevel, including the deadlock escape: a level with no ready non-recurring work
// cannot progress, so the company advances past it rather than being pinned forever.
function levelFor(playbooks, profile, completed) {
  const { members } = select(playbooks, profile);
  const done = new Set(completed);
  const levels = [...new Set(members.map((m) => m.level))]
    .filter((l) => l !== "always-on").sort((a, b) => levelKey(a) - levelKey(b));
  for (const L of levels) {
    const nonRec = members.filter((m) => m.level === L && !m.recurring && gatesLevel(m));
    if (!nonRec.length || nonRec.every((m) => done.has(m.id))) continue;
    const map = buildMap(playbooks, profile, { completed, level: Number(L) });
    const entry = map.levels.find((x) => String(x.level) === String(L));
    if (entry?.nodes.some((n) => n.status === "ready" && !n.recurring && gatesLevel(n))) return Number(L);
  }
  return 8;
}

// Ask the engine why. Runs the same clauses ready() runs, in the same order, against the
// same ctx, so the classification can never disagree with the decision.
function classify(pb, ctx) {
  // ready() returns false for an already-completed node before it checks anything else.
  // Without this clause a replayed completion lands in "unclassified", which reads like a
  // checker bug rather than the double-claim it actually is.
  if (ctx.completedSet.has(pb.id)) {
    return { kind: "already_complete", detail: `"${pb.id}" was already completed earlier in the ledger` };
  }
  const lift = ctx.flags.has("runs_paid_media") && pb.department === "Growth" ? 1 : 0;
  if (levelKey(pb.level) > ctx.currentLevel + lift) {
    return { kind: "level_gate", detail: `level ${pb.level} claimed while the company was at level ${ctx.currentLevel}` };
  }
  const depOk = (d) => {
    if (ctx.completedSet.has(d)) return true;
    const dep = ctx.byId.get(d);
    return !!dep && dep.recurring && levelKey(dep.level) <= ctx.currentLevel;
  };
  const badDep = arr(pb.depends_on).find((d) => ctx.byId.has(d) && !depOk(d));
  if (badDep) return { kind: "dependency", detail: `depends on "${badDep}", which was not complete` };

  const badIn = arr(pb.consumes).find((c) => !ctx.producedSet.has(c) && ctx.producibleSet.has(c));
  if (badIn) return { kind: "dataflow", detail: `consumes "${badIn}", which nothing had produced yet` };

  const missing = pb.applies_to.requires_traits.find((r) => STATE_FLAGS.has(r) && !ctx.flags.has(r));
  if (missing) return { kind: "state_flag", detail: `requires the milestone flag "${missing}"` };
  const excluded = pb.applies_to.excluded_traits.find((x) => STATE_FLAGS.has(x) && ctx.flags.has(x));
  if (excluded) return { kind: "state_flag", detail: `excluded while the company carries "${excluded}"` };

  return { kind: "unclassified", detail: "the engine reported not-ready and no single clause explains it" };
}

export function checkLegality(brainDir) {
  const { playbooks, index_sha256, byId } = catalog();
  const profile = JSON.parse(readFileSync(join(brainDir, "profile.json"), "utf8"));
  const events = readJsonl(join(brainDir, "ledger.jsonl"));
  const { members } = select(playbooks, profile);
  const memberIds = new Set(members.map((m) => m.id));

  const violations = [];
  const add = (kind, event, detail) => violations.push({ kind, event: event.id, node_id: event.node_id || null, ts: event.ts, detail });

  const doneEvents = events.filter((e) => e.status === "done");
  const playbookEvents = doneEvents.filter((e) => e.kind === "playbook")
    .sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));

  const seenIds = new Set();
  for (const e of events) {
    if (seenIds.has(e.id)) add("replayed_event", e, `event id "${e.id}" appears more than once`);
    seenIds.add(e.id);
  }

  // Two playbooks claiming identical bytes is either a copy-paste or a fabrication.
  const byDigest = new Map();
  for (const e of playbookEvents) {
    if (!e.artifact_sha256) continue;
    const prior = byDigest.get(e.artifact_sha256);
    if (prior && prior !== e.node_id) add("duplicate_artifact", e, `shares artifact bytes with "${prior}"`);
    else byDigest.set(e.artifact_sha256, e.node_id);
  }

  const completed = [];
  for (const e of playbookEvents) {
    const pb = byId.get(e.node_id);
    if (!pb) { add("unknown_node", e, `"${e.node_id}" is not in the catalog (index ${String(index_sha256).slice(0, 12)})`); continue; }
    if (!memberIds.has(e.node_id)) { add("non_member", e, `"${e.node_id}" is not selected for this company's profile`); continue; }

    if (pb.rubric && e.rubric_sha256 && e.rubric_sha256 !== digest(pb.rubric)) {
      add("rubric_drift", e, "rubric_sha256 does not match the pinned catalog rubric");
    }

    const level = levelFor(playbooks, profile, completed);
    const flags = achievedFlags(profile, completed, level);
    const ctx = readinessCtx(playbooks, members, new Set(completed), flags, level);
    if (!ready(pb, ctx)) {
      const { kind, detail } = classify(pb, ctx);
      add(kind, e, detail);
    }
    completed.push(e.node_id);
  }

  // An emitter that never says WHICH node it completed cannot be graph-checked at all.
  // Publish the coverage so a claim with no node_ids is visibly weaker, not silently equal.
  const coverage = doneEvents.length ? playbookEvents.length / doneEvents.length : 1;

  const count = (k) => violations.filter((v) => v.kind === k).length;
  return {
    index_sha256,
    events: events.length,
    playbook_events: playbookEvents.length,
    node_id_coverage_bp: Math.round(coverage * 10_000), // basis points: CCJ is integers only
    dag_violations: count("dependency"),
    dataflow_violations: count("dataflow"),
    level_violations: count("level_gate"),
    other_violations: violations.length - count("dependency") - count("dataflow") - count("level_gate"),
    total_violations: violations.length,
    violations,
  };
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) { console.error("usage: legality.mjs <brainDir>"); process.exit(2); }
  const r = checkLegality(dir);
  console.log(`${r.playbook_events} playbook completions replayed against the router`);
  console.log(`  dependency: ${r.dag_violations}   dataflow: ${r.dataflow_violations}   level gate: ${r.level_violations}   other: ${r.other_violations}`);
  console.log(`  node_id coverage: ${(r.node_id_coverage_bp / 100).toFixed(2)}% of done events`);
  for (const v of r.violations) console.log(`  ${v.kind.padEnd(20)} ${String(v.node_id || v.event).padEnd(34)} ${v.detail}`);
  process.exit(r.total_violations ? 1 : 0);
}

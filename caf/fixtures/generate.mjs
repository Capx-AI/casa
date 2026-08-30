#!/usr/bin/env node
// Golden-fixture generator. Drives the REAL router to produce a legal company
// brain, day by day, so fixtures cannot drift from the schema the engine emits.
//
// Hand-written fixtures rot the moment the engine changes. Engine-generated ones
// are wrong only when the engine is wrong, which is the failure you want to see.
//
//   node caf/fixtures/generate.mjs --out caf/fixtures/golden/supl --days 90
//
// Determinism is a hard requirement: same flags, byte-identical brain. That means
// a seeded PRNG and an explicit start date. No Date.now(), no Math.random().
//
// Zero dependencies (node: builtins + relative only).

import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildMap, gatesLevel } from "../../scripts/router.mjs";
import { appendEvent } from "../../scripts/ledger.mjs";
import { digest } from "../../scripts/caf/digest.mjs";
import { canon } from "../../scripts/caf/canon.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(dirname(here));
const CATALOG = JSON.parse(readFileSync(join(repo, "playbooks", "_index.json"), "utf8"));
const PLAYBOOKS = CATALOG.playbooks;
const byId = new Map(PLAYBOOKS.map((p) => [p.id, p]));

// --- determinism -------------------------------------------------------------
// mulberry32. Fast, tiny, and identical across engines, which is the only property
// that matters here.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const ONE_DAY = 86_400_000;
const at = (startMs, day, hour, minute) =>
  new Date(startMs + day * ONE_DAY + hour * 3_600_000 + minute * 60_000).toISOString();

// --- the company -------------------------------------------------------------
// Restaurant supply forecaster, matching the Capx Terminal demo so the fixture and
// the demo describe the same company.
export const PROFILE = {
  company_name: "Restaurant supply forecaster",
  confirmed: true,
  primary_type: "saas",
  secondary_type: "",
  traits: [
    "builds_software", "b2b", "low_acv", "recurring_revenue",
    "self_serve_only", "collects_user_data", "takes_payments", "pre_idea_only",
  ],
  icp: "Independent restaurant operators over ordering perishables",
  monetization: "subscription",
  one_liner: "Forecast weekly orders for independent restaurants so they stop over ordering perishables",
  north_star: { growth: "mrr", retention: "sub_retention", guardrails: ["ltv_cac", "gross_margin"] },
};

const BINDING_CONSTRAINT = {
  archetype: "no_users",
  surface_ids: ["first-users-traction", "beachhead-selection", "landing-page-cro"],
  lead_departments: ["Growth", "Sales"],
  win_definition: { metric_id: "paying_customers", current_value: 63, target_value: 100, deadline: "2026-08-19" },
  win_gap: 37,
};

// Runtime event ids are random (many terminals append concurrently). A fixture must
// be byte-reproducible, so here the id is content-addressed: same event, same id.
const eventId = (e) => `evt_${digest(canon(e)).slice(0, 24)}`;

// --- artifacts ---------------------------------------------------------------
// A deliverable that mirrors the playbook's own declared sections. Deterministic:
// derived from the node id, never from a clock or a random draw.
function artifactFor(p) {
  const sections = p.deliverable?.sections || [];
  const lines = [`# ${p.title}`, "", `Department: ${p.department}. Criticality: ${p.criticality}.`, ""];
  if (sections.length) {
    for (const s of sections) lines.push(`## ${s}`, "", `Recorded for ${p.id}.`, "");
  } else {
    lines.push("## Summary", "", `Recorded for ${p.id}.`, "");
  }
  return lines.join("\n");
}

// --- the walk ----------------------------------------------------------------
// Each day: ask the REAL router which nodes are ready, take the first k in the
// router's own order, and complete them. The ledger's ordering is therefore a
// legal traversal by construction, which is exactly what the legality checker
// must find when it replays it.
function readyIds(completed, level) {
  const map = buildMap(PLAYBOOKS, PROFILE, { completed, level });
  const nodes = map.levels.flatMap((L) => L.nodes);
  // Phase 0 does not participate in the historical 90-day walk. Completing those
  // nodes here would rewrite the golden ledger. They stay open as catch-up.
  return nodes.filter((n) => n.status === "ready" && gatesLevel(n)).map((n) => n.id);
}

// current level = first level whose non-recurring members are not all done.
// Mirrors brain.mjs deriveLevel; duplicated here so the generator never mutates
// state through a path the engine does not own.
function levelOf(completed) {
  const map = buildMap(PLAYBOOKS, PROFILE, { completed, level: 0 });
  const levels = map.levels.map((x) => Number(x.level)).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b);
  const done = new Set(completed);
  for (const L of levels) {
    const entry = map.levels.find((x) => Number(x.level) === L);
    if (!entry) continue;
    const nonRec = entry.nodes.filter((n) => !n.recurring && gatesLevel(n));
    if (!nonRec.length || nonRec.every((n) => done.has(n.id))) continue;
    // Mirrors brain.mjs deriveLevel: a level with no ready work cannot progress.
    const at = buildMap(PLAYBOOKS, PROFILE, { completed, level: L });
    const e2 = at.levels.find((x) => Number(x.level) === L);
    if (e2?.nodes.some((n) => n.status === "ready" && !n.recurring && gatesLevel(n))) return L;
  }
  return 8;
}

export function generate({ out, days = 90, seed = 20260709, start = "2026-04-10T09:00:00.000Z" }) {
  const brain = join(out, "company-brain");
  if (existsSync(out)) rmSync(out, { recursive: true, force: true });
  mkdirSync(join(brain, "outputs"), { recursive: true });
  mkdirSync(join(brain, "finance"), { recursive: true });

  const r = rng(seed);
  const startMs = Date.parse(start);
  const completed = [];
  const scores = [];

  for (let day = 0; day < days; day++) {
    const level = levelOf(completed);
    const ready = readyIds(completed, level);
    if (!ready.length) continue;

    // 0 to 3 nodes a day, weighted low. Agents do not take weekends, so there is
    // deliberately no weekly dip: an unnaturally regular cadence is the honest
    // signature of an agent-run company.
    const k = Math.min(ready.length, Math.floor(r() * 2.4));
    for (let i = 0; i < k; i++) {
      const id = ready[i];
      const p = byId.get(id);
      const rel = join("outputs", id, "README.md");
      mkdirSync(join(brain, "outputs", id), { recursive: true });
      writeFileSync(join(brain, rel), artifactFor(p));

      const ev = {
        ts: at(startMs, day, 9 + i * 2, Math.floor(r() * 60)),
        kind: "playbook", node_id: id, task: p.title, status: "done",
        dept: p.department, agent: `casa-${p.department.toLowerCase()}`, artifact: rel,
      };
      appendEvent(brain, { ...ev, id: eventId(ev) });
      completed.push(id);

      // Advisors grade most, but not all, completed work. 70-96, pass at 70.
      if (r() < 0.75) {
        const score = 70 + Math.floor(r() * 27);
        scores.push({
          nodeId: id, score, pass: score >= 70,
          gaps: score < 80 ? [`thin evidence in ${p.department.toLowerCase()} section`] : [],
          ts: at(startMs, day, 18, Math.floor(r() * 60)),
        });
      }
    }
  }

  // Non-playbook worker chatter, so the fixture exercises kind:"task" too.
  for (let day = 0; day < days; day += 7) {
    const ev = { ts: at(startMs, day, 14, 0), task: "Weekly ledger digest", status: "done", terminal: "eng", dept: "Operations" };
    appendEvent(brain, { ...ev, id: eventId(ev) });
  }

  const level = levelOf(completed);
  writeFileSync(join(brain, "profile.json"), JSON.stringify(PROFILE, null, 2) + "\n");
  writeFileSync(join(brain, "state.json"), JSON.stringify({
    completed, start_level: 0, binding_constraint: BINDING_CONSTRAINT,
  }, null, 2) + "\n");
  writeFileSync(join(brain, "scores.jsonl"), scores.map((s) => JSON.stringify(s)).join("\n") + "\n");
  writeFileSync(join(brain, "finance", "receipts.jsonl"), "");
  writeFileSync(join(brain, "identity.json"), JSON.stringify({
    caf_version: "1.0.0",
    company_pubkey: null,
    harness: { name: "capx-casa", version: "4.1.0" },
    brain_schema_version: "2026-07-09",
    playbook_index_sha256: CATALOG.index_sha256,
    created_at: start,
  }, null, 2) + "\n");

  return { brain, days, completed: completed.length, level, scores: scores.length };
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
  const out = arg("--out", join(here, "golden", "supl"));
  const r = generate({ out, days: Number(arg("--days", 90)), seed: Number(arg("--seed", 20260709)) });
  const ledger = readFileSync(join(r.brain, "ledger.jsonl"), "utf8").trim().split("\n").length;
  console.log(`generated ${r.brain}`);
  console.log(`  ${r.days} days, level ${r.level}, ${r.completed} playbooks done, ${ledger} ledger events, ${r.scores} graded`);
  console.log(`  catalog pinned at ${String(CATALOG.index_sha256).slice(0, 16)}...`);
  console.log(`  ledger digest ${digest(readFileSync(join(r.brain, "ledger.jsonl"))).slice(0, 16)}...`);
}

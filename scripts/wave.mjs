#!/usr/bin/env node
// The WAVE planner (v2 Phase 4). Deterministic, zero-dependency. Computes which ready nodes can be
// DRAFTED CONCURRENTLY this cycle without one invalidating another, concentrated on the binding
// constraint's lead lanes. The casa-board / casa-department skills call this, then fan out ONE
// in-session subagent per wave node. brain.mjs stays the
// SOLE serial writer: concurrency is in drafting, serialization is in committing.
//
//   node scripts/wave.mjs <brainDir> [--department X] [--k N]
//
// Library export computeWave(playbooks, profile, opts) is importable for tests.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { nextActions } from "./router.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const loadIndex = () => JSON.parse(readFileSync(join(repo, "playbooks", "_index.json"), "utf8")).playbooks;

// Two ready nodes are INDEPENDENT if neither depends on the other and they touch no shared artifact
// (one produces what the other consumes, or both produce the same thing). Drafting independent nodes
// in parallel cannot have one wave member invalidate another's preconditions mid-wave.
export function independent(a, b) {
  if (arr(a.depends_on).includes(b.id) || arr(b.depends_on).includes(a.id)) return false;
  const aProd = new Set(arr(a.produces)), aCons = new Set(arr(a.consumes));
  const bProd = arr(b.produces), bCons = arr(b.consumes);
  for (const x of bCons) if (aProd.has(x)) return false;
  for (const x of bProd) if (aCons.has(x) || aProd.has(x)) return false;
  return true;
}

export function computeWave(playbooks, profile, opts = {}) {
  const { completed = [], level = 0, weights = null, binding_constraint = null, department = null, k = 3 } = opts;
  const ranked = nextActions(playbooks, profile, { completed, level, weights, binding_constraint });
  const byId = new Map(playbooks.map((p) => [p.id, p]));
  const leadSet = new Set(arr(binding_constraint?.lead_departments));
  // Candidate order: an explicit department filter wins; otherwise concentrate on the lead lanes
  // first, preserving the constraint-aware rank within each group (a stable partition, not a re-rank).
  let candidates = ranked;
  if (department) candidates = ranked.filter((a) => a.department === department);
  else if (leadSet.size) candidates = [...ranked.filter((a) => leadSet.has(a.department)), ...ranked.filter((a) => !leadSet.has(a.department))];
  // Greedily pick a maximal independent set in candidate order, bounded by k (the founder's review
  // capacity / rate budget), so a wave is drafts a single founder can actually review together.
  const chosen = [];
  for (const a of candidates) {
    if (chosen.length >= k) break;
    const pb = byId.get(a.id);
    if (chosen.every((cid) => independent(pb, byId.get(cid)))) chosen.push(a.id);
  }
  return {
    wave: chosen,
    lead_departments: [...leadSet],
    department: department || null,
    frontier_width: chosen.length,
    k,
    // Below 2 independent drafts, a wave's coordination overhead exceeds a plain /casa-next. Say so,
    // so the skill falls back instead of pretending a 1-node "wave" is faster.
    fallback_to_next: chosen.length < 2,
    ready_count: ranked.length,
  };
}

// ---- CLI: read the synced brain and print the wave ----
function readJson(p, fb) { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return fb; } }
function main() {
  const args = process.argv.slice(2);
  const dir = args.find((a) => !a.startsWith("--"));
  const di = args.indexOf("--department"); const department = di !== -1 ? args[di + 1] : null;
  const ki = args.indexOf("--k"); const k = ki !== -1 ? Number(args[ki + 1]) : 3;
  if (!dir) { console.error("usage: wave.mjs <brainDir> [--department X] [--k N]"); process.exit(2); }
  // Fail loud on a missing brain: a fabricated default wave for a nonexistent company is worse
  // than an error.
  if (!existsSync(join(dir, "profile.json"))) {
    console.error(`no company brain at ${dir} (run /casa-start first)`);
    process.exit(2);
  }
  const profile = readJson(join(dir, "profile.json"), {});
  const map = readJson(join(dir, "build-map.json"), {});
  const state = readJson(join(dir, "state.json"), {});
  const pulse = readJson(join(dir, "pulse.json"), {});
  const level = map.current_level ?? 0;
  const binding_constraint = state.binding_constraint || map.binding_constraint || null;
  const w = computeWave(loadIndex(), profile, { completed: state.completed || [], level, weights: pulse.weights || null, binding_constraint, department, k });
  console.log(JSON.stringify(w, null, 2));
}
if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) main();

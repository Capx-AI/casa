// Guards for the wave planner (scripts/wave.mjs): the deterministic core of the Phase 4 subagent
// fan-out. A wave must be a set of READY nodes that are pairwise DAG-independent (safe to draft in
// parallel), bounded by k, concentrated on the constraint's lead lanes, and honest about falling
// back to /casa-next when the frontier is too narrow to be worth the coordination overhead.

import { test } from "node:test";
import assert from "node:assert/strict";
import { computeWave, independent } from "../scripts/wave.mjs";
import { nextActions } from "../scripts/router.mjs";
import { deriveBindingConstraint } from "../scripts/stage.mjs";
import { INDEX, loadJson } from "./helpers.mjs";

const PROBE = loadJson("examples/profile-b2b-devtool.json");
const MEME = loadJson("examples/profile-solana-analytics.json");
const byId = new Map(INDEX.map((p) => [p.id, p]));

test("wave: members are READY, pairwise independent, and bounded by k", () => {
  for (const profile of [PROBE, MEME]) {
    for (const level of [2, 4, 6]) {
      const ready = new Set(nextActions(INDEX, profile, { level }).map((a) => a.id));
      const w = computeWave(INDEX, profile, { level, k: 3 });
      assert.ok(w.wave.length <= 3, "bounded by k");
      for (const id of w.wave) assert.ok(ready.has(id), `${id} is in the ready set`);
      for (let i = 0; i < w.wave.length; i++)
        for (let j = i + 1; j < w.wave.length; j++)
          assert.ok(independent(byId.get(w.wave[i]), byId.get(w.wave[j])), `${w.wave[i]} and ${w.wave[j]} must be independent`);
      assert.equal(w.fallback_to_next, w.wave.length < 2);
    }
  }
});

test("wave: --department restricts the wave to that lane only", () => {
  const all = nextActions(INDEX, MEME, { level: 4 });
  const dept = all.find((a) => a.tier < 2)?.department || all[0].department;
  const w = computeWave(INDEX, MEME, { level: 4, department: dept });
  for (const id of w.wave) assert.equal(byId.get(id).department, dept);
  assert.equal(w.department, dept);
});

test("wave: concentrates on the lead lanes when a constraint is present", () => {
  const ids = new Set(INDEX.map((p) => p.id));
  const bc = deriveBindingConstraint({ constraint_archetype: "no_users" }, INDEX, ids); // leads: Growth, Strategy
  const w = computeWave(INDEX, MEME, { level: 4, binding_constraint: bc, k: 3 });
  const lead = new Set(bc.lead_departments);
  // if any ready node is in a lead lane, the FIRST wave node is from a lead lane (allocator concentration)
  const ready = nextActions(INDEX, MEME, { level: 4, binding_constraint: bc });
  if (ready.some((a) => lead.has(a.department)) && w.wave.length) {
    assert.ok(lead.has(byId.get(w.wave[0]).department), "the wave leads with the constraint owner");
  }
});

test("independent: shared produces/consumes or a direct dependency is NOT independent", () => {
  const a = { id: "a", depends_on: [], produces: ["x"], consumes: [] };
  const b = { id: "b", depends_on: [], produces: [], consumes: ["x"] }; // consumes a's output
  const c = { id: "c", depends_on: ["a"], produces: [], consumes: [] }; // depends on a
  const d = { id: "d", depends_on: [], produces: ["y"], consumes: [] }; // unrelated
  assert.equal(independent(a, b), false);
  assert.equal(independent(a, c), false);
  assert.equal(independent(a, d), true);
});

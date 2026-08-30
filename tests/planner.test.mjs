import { test } from "node:test";
import assert from "node:assert/strict";
import { planFanout } from "../scripts/planner.mjs";

// S1: big, even, independent -> the sweet spot (parallel, high speedup, one wave).
test("big even independent work fans out with a high modeled speedup", () => {
  const p = planFanout([
    { id: "a", effort: 10 }, { id: "b", effort: 10 }, { id: "c", effort: 10 },
    { id: "d", effort: 10 }, { id: "e", effort: 10 },
  ]);
  assert.equal(p.mode, "parallel");
  assert.equal(p.waves.length, 1);
  assert.equal(p.width, 5);
  assert.ok(p.estSpeedup >= 4, `expected ~4.5x, got ${p.estSpeedup}`);
  assert.equal(p.warnings.length, 0);
});

// Round-1 lesson: tiny chunks are not worth a worker -> stay serial.
test("tiny chunks are gated to serial", () => {
  const p = planFanout([{ id: "a", effort: 1 }, { id: "b", effort: 1 }, { id: "c", effort: 1 }]);
  assert.equal(p.mode, "serial");
  assert.match(p.reason, /too small/);
});

// S2 lesson: a lopsided split still runs but is flagged, because the big chunk caps it.
test("lopsided independent work parallelizes but warns to split the big chunk", () => {
  const p = planFanout([
    { id: "engine", effort: 10 }, { id: "catalog", effort: 2 },
    { id: "tests", effort: 2 }, { id: "console", effort: 2 }, { id: "plugin", effort: 2 },
  ]);
  assert.equal(p.mode, "parallel");
  assert.ok(p.warnings.some((w) => /imbalanced/.test(w) && /engine/.test(w)));
});

// S5 lesson: independent front parallelizes, dependent tail is serial (Amdahl).
test("mixed dependency work parallelizes the front and serializes the tail", () => {
  const p = planFanout([
    { id: "icp", effort: 8 }, { id: "channels", effort: 8 },
    { id: "pricing", effort: 8 }, { id: "positioning", effort: 8 },
    { id: "synthesis", effort: 8, deps: ["icp", "channels", "pricing", "positioning"] },
  ]);
  assert.equal(p.mode, "parallel");
  assert.equal(p.waves.length, 2, "front wave + serial tail");
  assert.deepEqual(p.waves[1], ["synthesis"]);
  assert.ok(p.warnings.some((w) => /tail is serial/.test(w)));
});

// A pure dependency chain has nothing to parallelize.
test("a dependency chain stays serial", () => {
  const p = planFanout([
    { id: "a", effort: 5 }, { id: "b", effort: 5, deps: ["a"] },
    { id: "c", effort: 5, deps: ["b"] }, { id: "d", effort: 5, deps: ["c"] },
  ]);
  assert.equal(p.mode, "serial");
  assert.match(p.reason, /dependency chain/);
});

// Even when work IS independent, a merge cost that eats the savings keeps it serial.
test("speedup floor blocks fan-out when the merge cost dominates", () => {
  const p = planFanout([{ id: "a", effort: 3 }, { id: "b", effort: 3 }], { mergeCost: 5 });
  assert.equal(p.mode, "serial");
  assert.match(p.reason, /below floor/);
});

// Fan-out width is capped to the concurrency ceiling, and waves stay effort-balanced.
test("width is capped to k and the layer is split into balanced waves", () => {
  const tasks = Array.from({ length: 10 }, (_, i) => ({ id: `t${i}`, effort: 5 }));
  const p = planFanout(tasks, { k: 4 });
  assert.equal(p.mode, "parallel");
  assert.ok(p.width <= 4, `width ${p.width} should be <= 4`);
  assert.equal(p.waves.flat().length, 10, "every task is scheduled exactly once");
  assert.equal(new Set(p.waves.flat()).size, 10, "no duplicates");
});

test("single task and empty input are serial; cycles and bad deps throw", () => {
  assert.equal(planFanout([{ id: "solo", effort: 9 }]).mode, "serial");
  assert.equal(planFanout([]).mode, "serial");
  assert.throws(() => planFanout([{ id: "a", deps: ["b"] }, { id: "b", deps: ["a"] }]), /cycle/);
  assert.throws(() => planFanout([{ id: "a", deps: ["ghost"] }]), /unknown/);
});

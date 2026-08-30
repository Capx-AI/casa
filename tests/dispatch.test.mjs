import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runWaves } from "../scripts/dispatch.mjs";
import { planFanout } from "../scripts/planner.mjs";
import { inFlight, aggregateByStatus, decisions } from "../scripts/ledger.mjs";

const tmp = () => mkdtempSync(join(tmpdir(), "casa-dispatch-"));
const specsFor = (ids) => Object.fromEntries(ids.map((id) => [id, { id, dept: "engineering", agent: "casa-engineer" }]));

test("waves run in dependency order, concurrent within a wave", async () => {
  const plan = planFanout([
    { id: "a", effort: 8 }, { id: "b", effort: 8 },
    { id: "c", effort: 8, deps: ["a", "b"] },
  ]);
  assert.equal(plan.mode, "parallel");
  const runner = async (spec) => ({ ok: true, artifact: `/out/${spec.id}.md` });
  const { log } = await runWaves(plan, specsFor(["a", "b", "c"]), { runner });

  // both front-wave tasks start before either finishes (concurrency), and c starts only after the barrier
  assert.equal(log[0].phase, "start");
  assert.equal(log[1].phase, "start");
  const cStart = log.findIndex((e) => e.phase === "start" && e.id === "c");
  const aEnd = log.findIndex((e) => e.phase === "end" && e.id === "a");
  const bEnd = log.findIndex((e) => e.phase === "end" && e.id === "b");
  assert.ok(cStart > aEnd && cStart > bEnd, "dependent tail waits for its front");
});

test("every worker is recorded to the ledger and ends out of flight", async () => {
  const dir = tmp();
  const plan = planFanout([{ id: "x", effort: 8 }, { id: "y", effort: 8 }]);
  const runner = async (spec) => ({ ok: true, artifact: `/o/${spec.id}`, decision: `did ${spec.id}` });
  await runWaves(plan, specsFor(["x", "y"]), { runner, ledgerDir: dir });
  assert.equal(inFlight(dir).length, 0, "all tasks resolved");
  assert.equal(aggregateByStatus(dir).done, 2);
  assert.equal(decisions(dir).length, 2);
  rmSync(dir, { recursive: true, force: true });
});

test("a failing worker is captured without sinking its siblings, and verify still runs", async () => {
  const dir = tmp();
  const plan = planFanout([{ id: "ok1", effort: 8 }, { id: "bad", effort: 8 }, { id: "ok2", effort: 8 }]);
  const runner = async (spec) => spec.id === "bad" ? { ok: false, error: "boom" } : { ok: true };
  let verifyArgs = null;
  const verify = async (results, meta) => { verifyArgs = { results, meta }; return { ok: true, report: "merged surviving outputs" }; };
  const out = await runWaves(plan, specsFor(["ok1", "bad", "ok2"]), { runner, verify, ledgerDir: dir });

  assert.deepEqual(out.failures, ["bad"]);
  assert.equal(out.results.ok1.ok, true);
  assert.equal(out.results.ok2.ok, true);
  assert.ok(verifyArgs, "verify gate ran even though a worker failed");
  assert.deepEqual(verifyArgs.meta.failures, ["bad"]);
  assert.equal(aggregateByStatus(dir).failed, 1);
  assert.equal(aggregateByStatus(dir).merged, 1); // the merge-verify event
  rmSync(dir, { recursive: true, force: true });
});

test("a runner that throws is contained, not fatal", async () => {
  const plan = planFanout([{ id: "a", effort: 8 }, { id: "boom", effort: 8 }]);
  const runner = async (spec) => { if (spec.id === "boom") throw new Error("kaboom"); return { ok: true }; };
  const out = await runWaves(plan, specsFor(["a", "boom"]), { runner });
  assert.deepEqual(out.failures, ["boom"]);
  assert.match(out.results.boom.error, /kaboom/);
});

test("serial plans run one at a time, in order", async () => {
  const plan = planFanout([{ id: "a", effort: 1 }, { id: "b", effort: 1 }]); // tiny -> serial
  assert.equal(plan.mode, "serial");
  const order = [];
  const runner = async (spec) => { order.push(`start:${spec.id}`); await Promise.resolve(); order.push(`end:${spec.id}`); return { ok: true }; };
  await runWaves(plan, specsFor(["a", "b"]), { runner });
  assert.deepEqual(order, ["start:a", "end:a", "start:b", "end:b"], "no overlap in serial mode");
});

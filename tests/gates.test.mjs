import { test } from "node:test";
import assert from "node:assert/strict";
import { triggeredGates, gateDecision, ALWAYS_ASK } from "../scripts/gates.mjs";

const dials = { default: "approve_first", departments: { Engineering: "auto" }, always_ask: ALWAYS_ASK };

test("triggeredGates reads explicit flags and playbook fields", () => {
  assert.deepEqual(triggeredGates({ spends_money: true }), ["spend_money"]);
  assert.deepEqual(triggeredGates({ human_gate: true }), ["human_gate"]);
  assert.deepEqual(triggeredGates({ reversibility: "hard" }), ["irreversible"]);
  assert.deepEqual(triggeredGates({ reversibility: "easy" }), []);
  assert.deepEqual(triggeredGates({ gates: ["go_public"], merges: true }).sort(), ["go_public", "merge_to_main"]);
});

test("a gate blocks even when the department is on auto", () => {
  const d = gateDecision({ department: "Engineering", merge_to_main: true }, dials);
  assert.equal(d.decision, "block");
  assert.deepEqual(d.reasons, ["merge_to_main"]);
  assert.equal(d.autonomy, "auto"); // the department is auto, but the gate still wins
});

test("reversible work follows the department dial", () => {
  assert.equal(gateDecision({ department: "Engineering" }, dials).decision, "auto");
  assert.equal(gateDecision({ department: "Finance" }, dials).decision, "propose"); // default approve_first
});

test("human_gate work always blocks, even in an auto department", () => {
  assert.equal(gateDecision({ department: "Engineering", human_gate: true }, dials).decision, "block");
});

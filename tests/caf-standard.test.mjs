// CAF as a standard, not a Casa export.
//
// If only Casa can emit a valid attestation, the format is a vendor lock-in with extra
// steps. These tests keep the reference emitter honest: it shares no code with Casa, and
// its output must satisfy Casa's own linter and verifier.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canon } from "../scripts/caf/canon.mjs";
import { emit } from "../examples/caf-emit-minimal/emit.mjs";
import { lint, validate } from "../caf/lint.mjs";
import { check } from "../caf/check.mjs";
import { attest } from "../scripts/attest.mjs";
import { generate } from "../caf/fixtures/generate.mjs";

const IDENTITY = { caf_version: "1.0.0", company_pubkey: null, harness: { name: "hand-rolled", version: "0.1.0" }, brain_schema_version: "2026-07-09", created_at: "2026-07-01T00:00:00.000Z" };
const EVENTS = [
  { ts: "2026-07-01T09:00:00.000Z", id: "evt_a", task: "Wrote the landing page", status: "done", kind: "task" },
  { ts: "2026-07-02T09:00:00.000Z", id: "evt_b", task: "Interviewed five operators", status: "done", kind: "task" },
];

function handRolledBrain() {
  const dir = mkdtempSync(join(tmpdir(), "caf-min-"));
  writeFileSync(join(dir, "identity.json"), JSON.stringify(IDENTITY));
  writeFileSync(join(dir, "ledger.jsonl"), EVENTS.map((e) => JSON.stringify(e)).join("\n") + "\n");
  return dir;
}

test("a brain with no Casa, no profile and no playbooks emits a valid attestation", () => {
  const dir = handRolledBrain();
  try {
    const { envelope } = emit(dir);
    assert.equal(envelope.sequence, 0);
    assert.deepEqual(lint(dir), [], "Casa's own linter must accept a foreign emitter's output");

    const r = check(dir);
    assert.deepEqual(r.fail, []);
    assert.equal(r.ok, true);
    assert.equal(r.legality, null, "no profile means legality is unverifiable, not zero");
    assert.ok(r.note.some((n) => /nothing here can be graph-checked/.test(n)), "and it says so");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("the reference emitter's canonical JSON agrees with Casa's, byte for byte", () => {
  const dir = handRolledBrain();
  try {
    emit(dir);
    const onDisk = readFileSync(join(dir, "attest", "attestation.json"), "utf8").trim();
    const reparsed = JSON.parse(onDisk);
    assert.equal(canon(reparsed), onDisk, "two independent CCJ implementations must produce identical bytes");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("naming no playbooks is legal, and visibly collapses node_id coverage to zero", () => {
  const dir = handRolledBrain();
  try {
    emit(dir);
    const claims = JSON.parse(readFileSync(join(dir, "attest", "claims.json"), "utf8"));
    assert.equal(claims.work.node_id_coverage_bp, 0);
    assert.equal(claims.work.tasks_done_window, 2);
    assert.equal(claims.spend.pay_attested, false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("lint accepts Casa's own output (the reference implementation conforms)", () => {
  const root = mkdtempSync(join(tmpdir(), "caf-lint-"));
  const brain = generate({ out: root }).brain;
  try {
    attest(brain);
    assert.deepEqual(lint(brain), []);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("lint catches the cross-field rules no JSON Schema keyword expresses", () => {
  assert.deepEqual(validate({ kind: "playbook" }, { properties: { kind: { enum: ["task", "playbook"] } } }), []);
  assert.ok(validate({ score: 82.5 }, { properties: { score: { type: "integer" } } }).length, "a float is not an integer");
  assert.ok(validate({ x: "nope" }, { properties: { x: { pattern: "^[0-9a-f]{64}$" } } }).length);
  assert.ok(validate({ a: 1, b: 2 }, { additionalProperties: false, properties: { a: {} } }).length, "unexpected property");
  assert.ok(validate({}, { required: ["a"] }).length, "missing required");
});

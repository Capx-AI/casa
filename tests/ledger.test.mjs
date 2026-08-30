import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  normalize, appendEvent, readEvents, tail,
  inFlight, blocked, aggregateByStatus, decisions, compact, MAX_EVENT_BYTES,
} from "../scripts/ledger.mjs";

const tmp = () => mkdtempSync(join(tmpdir(), "casa-ledger-"));

test("normalize fills defaults and enforces the minimal shape", () => {
  const e = normalize({ task: "t1" });
  assert.ok(e.id && e.ts);
  assert.equal(e.status, "started");
  assert.equal(e.terminal, "main");
  assert.throws(() => normalize({}), /needs a task/);
  assert.throws(() => normalize({ task: "t", status: "weird" }), /unknown status/);
});

test("append + read round-trips and skips a torn line", () => {
  const d = tmp();
  appendEvent(d, { task: "t1", status: "started", terminal: "eng" });
  appendEvent(d, { task: "t1", status: "done", terminal: "eng", artifact: "/x.ts" });
  appendFileSync(join(d, "ledger.jsonl"), "{ this is not json\n"); // a partial/torn write
  const all = readEvents(d);
  assert.equal(all.length, 2, "malformed line is skipped, not fatal");
  assert.equal(all[1].artifact, "/x.ts");
  rmSync(d, { recursive: true, force: true });
});

test("a task's state is its latest event (drives in_flight / blocked)", () => {
  const d = tmp();
  appendEvent(d, { task: "a", status: "started" });
  appendEvent(d, { task: "a", status: "running" });
  appendEvent(d, { task: "b", status: "blocked" });
  appendEvent(d, { task: "c", status: "started" });
  appendEvent(d, { task: "c", status: "done" });
  assert.deepEqual(inFlight(d).map((e) => e.task).sort(), ["a", "b"]);
  assert.deepEqual(blocked(d).map((e) => e.task), ["b"]);
  const counts = aggregateByStatus(d);
  assert.deepEqual(counts, { running: 1, blocked: 1, done: 1 });
  rmSync(d, { recursive: true, force: true });
});

test("decisions surface, and compact builds a digest", () => {
  const d = tmp();
  appendEvent(d, { task: "a", status: "done", decision: "chose Postgres", dept: "engineering", artifact: "/a.md" });
  appendEvent(d, { task: "b", status: "running", agent: "casa-marketer", dept: "marketing" });
  assert.equal(decisions(d).length, 1);
  const dg = compact(d);
  assert.match(dg, /chose Postgres/);
  assert.match(dg, /In flight \(1\)/);
  assert.match(dg, /Completed \(1\)/);
  rmSync(d, { recursive: true, force: true });
});

test("oversized events are rejected to keep single-line appends atomic", () => {
  const d = tmp();
  const huge = "x".repeat(MAX_EVENT_BYTES + 1);
  assert.throws(() => appendEvent(d, { task: "big", note: huge }), /too large/);
  assert.equal(readEvents(d).length, 0, "nothing was written");
  rmSync(d, { recursive: true, force: true });
});

test("tail returns the last n, and many appends all land intact", () => {
  const d = tmp();
  for (let i = 0; i < 50; i++) appendEvent(d, { task: "bulk", status: "running", note: String(i) });
  assert.equal(readEvents(d).length, 50, "every append is a complete line");
  assert.equal(tail(d, 5).length, 5);
  assert.equal(tail(d, 5).at(-1).note, "49");
  rmSync(d, { recursive: true, force: true });
});

// --- attestation fields (2026-07-09) -----------------------------------------
// A ledger is a claim about work. kind/node_id/artifact_sha256/rubric_sha256 are
// what make the claim checkable by someone who was not there.

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync as _wf } from "node:fs";
import { join as _join } from "node:path";
import { INDEX } from "./helpers.mjs";

const sha = (s) => createHash("sha256").update(s).digest("hex");

test("kind defaults to task; a node_id promotes the event to a playbook", () => {
  assert.equal(normalize({ task: "refactor the router" }).kind, "task");
  const e = normalize({ task: "Opportunity Scan", node_id: "opportunity-scan" });
  assert.equal(e.kind, "playbook");
});

test('a kind:"playbook" event without a node_id is rejected', () => {
  assert.throws(() => normalize({ task: "x", kind: "playbook" }), /needs a node_id/);
});

test("an unknown node_id is rejected against the real 173-node catalog", () => {
  assert.throws(() => normalize({ task: "x", node_id: "not-a-playbook" }), /unknown playbook node_id/);
});

test('node_id on a kind:"task" event is rejected rather than silently ignored', () => {
  assert.throws(
    () => normalize({ task: "x", kind: "task", node_id: "opportunity-scan" }),
    /only meaningful on a kind:"playbook" event/,
  );
});

test("an unknown kind is rejected", () => {
  assert.throws(() => normalize({ task: "x", kind: "epic" }), /unknown kind/);
});

test("artifact_sha256 is computed from the bytes on disk, never taken from the caller", () => {
  const d = tmp();
  try {
    mkdirSync(_join(d, "outputs"), { recursive: true });
    _wf(_join(d, "outputs", "brief.md"), "# Opportunity brief\n");
    const e = appendEvent(d, {
      task: "Opportunity Scan", node_id: "opportunity-scan", status: "done",
      artifact: "outputs/brief.md",
      artifact_sha256: "0".repeat(64), // a caller trying to commit to bytes it never wrote
    });
    assert.equal(e.artifact_sha256, sha("# Opportunity brief\n"), "the caller's digest is overwritten");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("artifact_sha256 is omitted when the referenced file does not exist", () => {
  const d = tmp();
  try {
    const e = appendEvent(d, { task: "t", artifact: "outputs/ghost.md" });
    assert.equal(e.artifact_sha256, undefined, "a missing artifact is a fact to record, not a crash");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("rubric_sha256 pins the grading contract that was in force at completion", () => {
  const d = tmp();
  try {
    const e = appendEvent(d, { task: "Opportunity Scan", node_id: "opportunity-scan", status: "done" });
    const rubric = INDEX.find((p) => p.id === "opportunity-scan").rubric;
    assert.equal(e.rubric_sha256, sha(rubric));
    assert.match(e.rubric_sha256, /^[0-9a-f]{64}$/);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("event ids carry 64 bits of entropy and stay unique in bulk", () => {
  const ids = new Set();
  for (let i = 0; i < 20_000; i++) ids.add(normalize({ task: "t" }).id);
  assert.equal(ids.size, 20_000, "no collisions across 20k ids minted in the same millisecond");
  assert.match(normalize({ task: "t" }).id, /^evt_[0-9a-z]+[0-9a-f]{16}$/);
});

test("ts is RFC 3339 with a Z suffix, so a lexical sort is chronological", () => {
  const e = normalize({ task: "t" });
  assert.match(e.ts, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  const sorted = ["2026-07-09T10:00:00.000Z", "2026-01-02T23:59:59.999Z"].sort();
  assert.equal(sorted[0], "2026-01-02T23:59:59.999Z");
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { appendEvent, aggregateByStatus } from "../scripts/ledger.mjs";
import { pending, approve, reject } from "../scripts/approvals.mjs";

const tmp = () => mkdtempSync(join(tmpdir(), "casa-appr-"));

test("a blocked task is pending until the founder approves it", () => {
  const d = tmp();
  appendEvent(d, { task: "run-ads", dept: "Growth", status: "blocked", note: "needs $500" });
  assert.deepEqual(pending(d).map((e) => e.task), ["run-ads"]);
  approve(d, "run-ads", { note: "ok up to $500" });
  assert.equal(pending(d).length, 0, "approved task left the queue");
  assert.equal(aggregateByStatus(d).running, 1, "it is now running so the worker resumes");
  rmSync(d, { recursive: true, force: true });
});

test("a rejected task leaves the queue cancelled, not running", () => {
  const d = tmp();
  appendEvent(d, { task: "risky", status: "blocked" });
  reject(d, "risky", { reason: "too risky" });
  assert.equal(pending(d).length, 0);
  assert.equal(aggregateByStatus(d).cancelled, 1);
  rmSync(d, { recursive: true, force: true });
});

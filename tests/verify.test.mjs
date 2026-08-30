import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTestOutput, verifyDir } from "../scripts/verify.mjs";

test("parses a green node:test summary", () => {
  const r = parseTestOutput("# tests 142\n# pass 142\n# fail 0\n");
  assert.equal(r.framework, "node:test");
  assert.equal(r.passed, 142);
  assert.equal(r.failed, 0);
  assert.equal(r.ok, true);
});

test("parses a failing node:test summary", () => {
  const r = parseTestOutput("# pass 10\n# fail 3\n");
  assert.equal(r.ok, false);
  assert.equal(r.failed, 3);
});

test("parses vitest summaries, pass and fail", () => {
  assert.deepEqual(
    (({ ok, passed, failed }) => ({ ok, passed, failed }))(parseTestOutput("Tests  36 passed (36)")),
    { ok: true, passed: 36, failed: 0 },
  );
  const f = parseTestOutput("Tests  34 passed | 2 failed (36)");
  assert.equal(f.ok, false);
  assert.equal(f.failed, 2);
});

test("unknown output is treated as not-ok (fail closed)", () => {
  assert.equal(parseTestOutput("some noise with no summary").ok, false);
});

test("verifyDir runs the injected command and reports the parsed result", () => {
  let invoked;
  const green = verifyDir("/x", { exec: (cmd) => { invoked = cmd; return "# pass 5\n# fail 0\n"; } });
  assert.equal(green.ok, true);
  assert.match(green.report, /5 passed/);
  assert.deepEqual(invoked.slice(1), ["test", "--silent"]);
  assert.equal(invoked.some((part) => part === "npx" || part === "vitest"), false);

  const red = verifyDir("/x", { exec: () => "Tests  1 passed | 2 failed (3)" });
  assert.equal(red.ok, false);
  assert.match(red.report, /2 failed/);
});

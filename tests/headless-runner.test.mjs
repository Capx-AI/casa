import { test } from "node:test";
import assert from "node:assert/strict";
import { assertHeadlessAllowed, makeClaudeRunner } from "../scripts/headless-runner.mjs";

const goodEnv = { ANTHROPIC_API_KEY: "sk-ant-api03-real-key", CASA_OPERATE: "1" };

test("the ToS guard refuses a subscription / missing opt-in", () => {
  assert.throws(() => assertHeadlessAllowed({}), /ANTHROPIC_API_KEY/);
  assert.throws(() => assertHeadlessAllowed({ ANTHROPIC_API_KEY: "sk-ant-sid-session" }), /session token/);
  assert.throws(() => assertHeadlessAllowed({ ANTHROPIC_API_KEY: "sk-ant-api03-real-key" }), /CASA_OPERATE/);
  assert.equal(assertHeadlessAllowed(goodEnv), true);
});

test("makeClaudeRunner will not build without passing the guard", () => {
  assert.throws(() => makeClaudeRunner({ env: {} }), /ANTHROPIC_API_KEY/);
});

test("the built runner is dispatch-compatible and uses the injected exec", async () => {
  const calls = [];
  const runner = makeClaudeRunner({ env: goodEnv, exec: (p) => { calls.push(p); return "done: " + p; } });
  const r = await runner({ id: "t1", prompt: "do the thing", artifact: "/o/t1.md" });
  assert.equal(r.ok, true);
  assert.match(r.output, /do the thing/);
  assert.equal(r.artifact, "/o/t1.md");
  assert.deepEqual(calls, ["do the thing"]);
});

test("a failing worker is contained as a not-ok result", async () => {
  const runner = makeClaudeRunner({ env: goodEnv, exec: () => { throw new Error("worker died"); } });
  const r = await runner({ id: "t", prompt: "x" });
  assert.equal(r.ok, false);
  assert.match(r.error, /worker died/);
});

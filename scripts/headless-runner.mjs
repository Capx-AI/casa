// Casa v4 - headless runner: the cross-terminal / multi-account fan-out path for
// dispatch.mjs. A worker is a `claude -p` process, so more accounts raise the concurrency
// ceiling (the validated path past ~3x).
//
// Unattended execution requires the founder's own API key, metered billing, and an
// explicit opt-in. Users must confirm their setup complies with the provider's current
// terms. In-session subagents remain the default interactive path.

import { execFileSync } from "node:child_process";

// Throws unless headless execution is allowed. Returns true when it is.
export function assertHeadlessAllowed(env = process.env) {
  const key = env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("headless dispatch needs your own ANTHROPIC_API_KEY with metered billing");
  }
  if (/sid|session/i.test(key)) {
    throw new Error("that looks like a session token, not a console.anthropic.com API key; headless needs a metered console key");
  }
  if (env.CASA_OPERATE !== "1") {
    throw new Error("set CASA_OPERATE=1 to confirm you accept metered API billing for headless runs");
  }
  return true;
}

// Build a dispatch.mjs-compatible runner that executes each subtask as a `claude -p` worker.
// `exec` is injectable for tests; the default shells out exactly like operate.mjs.
export function makeClaudeRunner({ env = process.env, exec } = {}) {
  assertHeadlessAllowed(env);
  const run = exec || ((prompt) =>
    execFileSync("claude", ["-p", prompt, "--permission-mode", "acceptEdits"], { encoding: "utf8", env }));
  return async (spec) => {
    try {
      const output = run(spec.prompt || spec.title || spec.id);
      return { ok: true, output, artifact: spec.artifact };
    } catch (e) {
      return { ok: false, error: String(e?.message ?? e) };
    }
  };
}

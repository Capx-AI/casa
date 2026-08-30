// Casa v4 - verify gate: run the merged code's tests and report pass/fail.
//
// This is the auto-merge safety net for code fan-out. The round-2 benchmark caught a
// worker that silently redefined a shared type; its own MOCKED unit test stayed green
// and hid the bug, which only surfaced under a real, unmocked integration run. So the
// gate's job is to execute the real suite over the assembled modules, not to trust each
// worker's self-report. It parses both `node --test` and vitest summaries.

import { execFileSync } from "node:child_process";

export function parseTestOutput(text) {
  const s = String(text);
  // node:test TAP-ish summary
  const np = s.match(/^#\s*pass\s+(\d+)/m);
  const nf = s.match(/^#\s*fail\s+(\d+)/m);
  if (np || nf) {
    const passed = np ? Number(np[1]) : 0;
    const failed = nf ? Number(nf[1]) : 0;
    return { framework: "node:test", passed, failed, ok: failed === 0 && (passed > 0 || !!np) };
  }
  // vitest summary ("Tests  34 passed | 2 failed (36)" - order varies)
  const vp = s.match(/(\d+)\s+passed/);
  const vf = s.match(/(\d+)\s+failed/);
  if (vp || vf) {
    const passed = vp ? Number(vp[1]) : 0;
    const failed = vf ? Number(vf[1]) : 0;
    return { framework: "vitest", passed, failed, ok: failed === 0 && passed > 0 };
  }
  return { framework: "unknown", passed: 0, failed: 0, ok: false };
}

// Run the suite in `dir` and report. `exec` is injectable for tests; by default it
// shells out and captures combined stdout+stderr (test runners exit non-zero on failure,
// which execFileSync throws on - we still parse the captured output).
export function verifyDir(dir, opts = {}) {
  // Run the project's declared test script. This never asks npx to resolve or
  // download an undeclared package. Callers with a different test contract can
  // pass an explicit argv array through opts.cmd.
  const { cmd = [process.platform === "win32" ? "npm.cmd" : "npm", "test", "--silent"], exec } = opts;
  const run = exec || ((c, dd) => {
    try {
      return execFileSync(c[0], c.slice(1), { cwd: dd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch (e) {
      return `${e.stdout || ""}\n${e.stderr || ""}`; // failures still carry a summary
    }
  });
  const out = run(cmd, dir);
  const res = parseTestOutput(out);
  return {
    ok: res.ok,
    passed: res.passed,
    failed: res.failed,
    report: res.ok
      ? `verify: ${res.passed} passed (${res.framework})`
      : `verify: ${res.failed} failed / ${res.passed} passed (${res.framework})`,
    raw: out,
  };
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2] || ".";
  const r = verifyDir(dir);
  console.log(r.report);
  process.exit(r.ok ? 0 : 1);
}

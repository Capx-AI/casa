// Shared test helpers. Zero-dependency: only node: builtins.
// Tests run on Node's built-in runner (node --test), matching the repo's
// zero-dependency runtime philosophy. No test framework is installed.

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
export const REPO = dirname(here);

// The real playbook catalog and the shipped example profiles, loaded once.
export const INDEX = JSON.parse(
  readFileSync(join(REPO, "playbooks", "_index.json"), "utf8"),
).playbooks;
export const loadJson = (rel) => JSON.parse(readFileSync(join(REPO, rel), "utf8"));

// Mirror router.mjs's level ordering (always-on sorts before level 0).
export const levelKey = (l) => (l === "always-on" ? -1 : Number(l));

export function tmpBrain() {
  return mkdtempSync(join(tmpdir(), "casa-test-"));
}
export function cleanup(dir) {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
}

// Run a repo script with a HERMETIC env. We pass only PATH and HOME so a real
// ANTHROPIC_API_KEY in the runner's environment can never leak into the operate
// guardrail tests. Per-test env (keys, opt-in flags) is layered on top.
export function runScript(rel, args = [], env = {}) {
  const base = { PATH: process.env.PATH, HOME: process.env.HOME };
  const r = spawnSync(process.execPath, [join(REPO, "scripts", rel), ...args], {
    encoding: "utf8",
    env: { ...base, ...env },
  });
  return { code: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}

// Harness portability, as a contract.
//
// Casa's experience layer is written for Claude Code, but the repo promises that any
// harness with a shell can drive it (AGENTS.md, docs/HARNESSES.md). These tests keep
// that promise from regressing: path references in skills and agents must resolve both
// inside Claude Code (CLAUDE_PLUGIN_ROOT) and outside it (CASA_ROOT), and the
// harness-neutral entry documents must exist and point at each other.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "./helpers.mjs";

const NEUTRAL_FORM = "${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}";

function markdownFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) out.push(...markdownFiles(abs));
    else if (name.endsWith(".md")) out.push(abs);
  }
  return out;
}

test("every plugin-root reference in skills/ and agents/ carries the CASA_ROOT fallback", () => {
  const files = [...markdownFiles(join(REPO, "skills")), ...markdownFiles(join(REPO, "agents"))];
  const offenders = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    // Strip every neutral-form occurrence; any CLAUDE_PLUGIN_ROOT left is a bare
    // reference that would not resolve outside Claude Code.
    const residue = text.split(NEUTRAL_FORM).join("");
    if (residue.includes("CLAUDE_PLUGIN_ROOT")) offenders.push(f.slice(REPO.length + 1));
  }
  assert.deepEqual(offenders, [], `bare CLAUDE_PLUGIN_ROOT (use ${NEUTRAL_FORM}): ${offenders.join(", ")}`);
});

test("hooks.json keeps the bare Claude Code form (the harness expands it there)", () => {
  const hooks = readFileSync(join(REPO, "hooks", "hooks.json"), "utf8");
  assert.ok(hooks.includes("${CLAUDE_PLUGIN_ROOT}"));
  assert.ok(!hooks.includes("CASA_ROOT"), "hooks.json is read by Claude Code only; keep it bare");
});

test("AGENTS.md exists and wires the non-Claude path", () => {
  const p = join(REPO, "AGENTS.md");
  assert.ok(existsSync(p), "AGENTS.md missing at repo root");
  const text = readFileSync(p, "utf8");
  for (const needle of ["CASA_ROOT", "docs/HARNESSES.md", "brain.mjs", "NOW.md", "caf/check.mjs"]) {
    assert.ok(text.includes(needle), `AGENTS.md does not mention ${needle}`);
  }
});

test("the harness guide and the CAF spec exist and cross-reference", () => {
  const harnesses = readFileSync(join(REPO, "docs", "HARNESSES.md"), "utf8");
  const spec = readFileSync(join(REPO, "docs", "CAF-SPEC.md"), "utf8");
  assert.ok(harnesses.includes("CAF-SPEC.md"));
  assert.ok(harnesses.includes(NEUTRAL_FORM));
  assert.ok(spec.includes("caf-emit-minimal"), "spec must point at the no-Casa reference emitter");
  assert.ok(spec.includes("scripts/caf/merkle.mjs"), "spec must anchor to the implementation");
});

test("merkle.mjs cites the spec at its real path", () => {
  const src = readFileSync(join(REPO, "scripts", "caf", "merkle.mjs"), "utf8");
  assert.ok(src.includes("docs/CAF-SPEC.md"), "merkle.mjs references a spec location that does not exist");
});

test("founder-facing harness docs obey the copy canon (no em-dashes, no emojis)", () => {
  for (const rel of ["AGENTS.md", "docs/HARNESSES.md", "docs/CAF-SPEC.md"]) {
    const text = readFileSync(join(REPO, rel), "utf8");
    assert.ok(!text.includes("—"), `${rel} contains an em-dash`);
    assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text), `${rel} contains an emoji`);
  }
});

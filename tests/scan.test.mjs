// Tests for the deterministic project scanner (scripts/scan.mjs): the existing-vs-empty
// detection that picks the casa-start branch, and the signal sweep the project-scanner
// agent reads as grounded facts.

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deriveSignals, scanDir } from "../scripts/scan.mjs";

// ---- deriveSignals (pure) ----

test("deriveSignals: a billed, authed, instrumented web app surfaces its signals", () => {
  const inv = {
    files: ["package.json", "src/app.ts", "Dockerfile"],
    hasGit: true,
    packageJson: { dependencies: { next: "14", stripe: "15", "next-auth": "4", posthog: "1" } },
  };
  const s = deriveSignals(inv);
  assert.equal(s.type_hint, "saas");
  for (const sig of ["has_repo", "builds_software", "has_deployed_app", "takes_payments", "has_user_accounts", "analytics"]) {
    assert.ok(s.signals.includes(sig), `expected signal ${sig}`);
  }
});

test("deriveSignals: an onchain dependency hints crypto", () => {
  const s = deriveSignals({ files: ["package.json"], hasGit: false, packageJson: { dependencies: { "@solana/web3.js": "1" } } });
  assert.equal(s.type_hint, "crypto");
});

test("deriveSignals: nothing in, nothing out", () => {
  const s = deriveSignals({ files: [], hasGit: false, packageJson: null });
  assert.equal(s.type_hint, null);
  assert.deepEqual(s.signals, []);
});

// ---- scanDir (filesystem) ----

function tmp() { return mkdtempSync(join(tmpdir(), "casa-scan-")); }

test("scanDir: an empty folder is greenfield", () => {
  const d = tmp();
  try {
    assert.equal(scanDir(d).is_existing_project, false);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("scanDir: a folder with only company-brain still reads as greenfield", () => {
  const d = tmp();
  try {
    mkdirSync(join(d, "company-brain"));
    writeFileSync(join(d, "company-brain", "state.json"), "{}");
    assert.equal(scanDir(d).is_existing_project, false, "company-brain must be excluded from detection");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("scanDir: secret-shaped files are neither inventoried nor surfaced", () => {
  const d = tmp();
  try {
    writeFileSync(join(d, ".env"), "PRIVATE_TOKEN=do-not-read\n");
    writeFileSync(join(d, "signing.key"), "do-not-read\n");
    const r = scanDir(d);
    assert.equal(r.is_existing_project, false);
    assert.equal(r.file_count, 0);
    assert.deepEqual(r.key_files, []);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("scanDir: a folder with project files reads as existing and detects build signals", () => {
  const d = tmp();
  try {
    writeFileSync(join(d, "package.json"), JSON.stringify({ dependencies: { react: "18" } }));
    mkdirSync(join(d, "src"));
    writeFileSync(join(d, "src", "index.ts"), "export const x = 1;");
    writeFileSync(join(d, "CLAUDE.md"), "# project");
    const r = scanDir(d);
    assert.equal(r.is_existing_project, true);
    assert.equal(r.has_claude_md, true);
    assert.ok(r.signals.signals.includes("builds_software"));
    assert.ok(r.key_files.includes("package.json"));
  } finally { rmSync(d, { recursive: true, force: true }); }
});

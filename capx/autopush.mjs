#!/usr/bin/env node
// Bound-brain auto attest. Lives in capx/ so scripts/ never grows a network path.
// Spawns brain.mjs / caf/sign.mjs / capx/register.mjs as child processes.
//
//   node capx/autopush.mjs <brainDir>
//
// Unbound, empty ledger, or nothing new: exit 0 with no output.
// Offline / network fail: print to stderr, exit 0.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function quietFail(msg) {
  if (msg) console.error(String(msg).trimEnd());
  process.exit(0);
}

function run(rel, args) {
  return execFileSync(process.execPath, [join(ROOT, rel), ...args], {
    encoding: "utf8",
    env: process.env,
  });
}

function childErr(e) {
  const stderr = e && e.stderr != null ? String(e.stderr) : "";
  const stdout = e && e.stdout != null ? String(e.stdout) : "";
  const msg = e && e.message ? String(e.message) : "";
  return (stderr || stdout || msg).trim();
}

function main() {
  const brainDir = process.argv[2];
  if (!brainDir) {
    console.error("usage: capx/autopush.mjs <brainDir>");
    process.exit(2);
  }

  const bindPath = join(brainDir, "capx-bind.json");
  if (!existsSync(bindPath)) process.exit(0);

  let bind;
  try {
    bind = JSON.parse(readFileSync(bindPath, "utf8"));
  } catch {
    quietFail(`autopush: unreadable ${bindPath}`);
  }

  const ledgerPath = join(brainDir, "ledger.jsonl");
  if (!existsSync(ledgerPath) || !readFileSync(ledgerPath, "utf8").trim()) process.exit(0);

  try {
    run("scripts/brain.mjs", ["attest", brainDir]);
  } catch (e) {
    const err = childErr(e);
    if (/nothing new|nothing to attest/i.test(err)) process.exit(0);
    quietFail(err || "autopush: attest failed");
  }

  try {
    run("caf/sign.mjs", [brainDir]);
  } catch (e) {
    quietFail(childErr(e) || "autopush: sign failed");
  }

  const pushArgs = ["push", "--brain", brainDir];
  if (typeof bind.api === "string" && bind.api.length) pushArgs.push("--api", bind.api);

  try {
    const out = run("capx/register.mjs", pushArgs);
    if (out && out.trim()) process.stdout.write(out.endsWith("\n") ? out : out + "\n");
  } catch (e) {
    quietFail(childErr(e) || "autopush: push failed");
  }
  // The company face (scripts/face.mjs) rides along whenever it exists, so later playbook completions update the page.
  if (existsSync(join(brainDir, "face.json"))) {
    try {
      run("capx/publish.mjs", ["face", "--brain", brainDir, ...(typeof bind.api === "string" && bind.api.length ? ["--api", bind.api] : [])]);
    } catch (e) {
      quietFail(childErr(e) || "autopush: face push failed");
    }
  }
}

main();

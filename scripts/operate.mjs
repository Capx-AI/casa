#!/usr/bin/env node
// Operate mode: run due loops headlessly with an explicit API key and opt-in.
// Dry-run by default; --run executes. Users are responsible for confirming that
// their account, billing setup, and use comply with the provider's current terms.
//
//   ANTHROPIC_API_KEY=sk-ant-... CASA_OPERATE=1 node scripts/operate.mjs <brainDir> [--run]

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const brainCli = join(here, "brain.mjs");
const dir = process.argv[2];
const run = process.argv.includes("--run");
if (!dir || dir.startsWith("--")) { console.error("usage: operate.mjs <brainDir> [--run]"); process.exit(2); }

// --- billing and unattended-use guardrails ---
const key = process.env.ANTHROPIC_API_KEY;
if (!key) {
  console.error("Operate mode is unattended automation and requires an ANTHROPIC_API_KEY with metered billing.");
  console.error("Set the key only after confirming your account and use comply with Anthropic's current terms. Aborting.");
  process.exit(1);
}
if (key.includes("oat") || key.startsWith("sk-ant-sid")) {
  console.error("That looks like a subscription/session token, not a console API key. Operate mode needs a console.anthropic.com API key. Aborting.");
  process.exit(1);
}
if (process.env.CASA_OPERATE !== "1") {
  console.error("Set CASA_OPERATE=1 to confirm you accept metered API billing for headless runs. Aborting.");
  process.exit(1);
}

execFileSync(process.execPath, [brainCli, "sync", dir], { stdio: "ignore" });
const due = JSON.parse(execFileSync(process.execPath, [brainCli, "due", dir], { encoding: "utf8" }));
if (!due.length) { console.log("No loops due. Nothing to operate."); process.exit(0); }

console.log(`${due.length} loop(s) due${run ? "" : " (dry-run; pass --run to execute)"}:`);
for (const l of due) {
  if (!l || typeof l.id !== "string" || !/^[a-z0-9][a-z0-9._:-]{0,127}$/i.test(l.id)) {
    console.error("Operate mode refused an invalid loop id from loops.json.");
    process.exit(1);
  }
  const prompt = `You are operating Capx Casa for the company in ${dir}. Run the recurring loop "${l.id}" (${l.runs}). Read company-brain first, do the loop, write outputs to the brain, then run: node ${brainCli} loop-ran ${dir} ${l.id}`;
  const args = ["-p", prompt, "--permission-mode", "acceptEdits"];
  if (run) {
    console.log(`[run] ${l.id}`);
    execFileSync("claude", args, { stdio: "inherit", env: process.env });
  } else {
    console.log(`\n[${l.id}] would execute claude with arguments:\n  ${JSON.stringify(args)}`);
  }
}

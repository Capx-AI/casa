// Casa v4 - autonomy gates: decide whether an action runs auto, needs a proposal, or must
// stop for human approval. This is the enforcement half of the autonomy dials (cos.mjs
// reads the dials to BRIEF; this decides at EXECUTION time).
//
// Two independent rules:
//   1. The always-ask line is per-ACTION and absolute: spending money, going public,
//      merging to main, anything destructive or irreversible or human_gate -> BLOCK,
//      no matter how autonomous the department is set.
//   2. Otherwise the department dial decides: `auto` runs, `approve_first` proposes.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { autonomyFor } from "./cos.mjs";

export const ALWAYS_ASK = ["spend_money", "go_public", "merge_to_main", "destructive"];

// Which always-ask reasons an action triggers, from its flags (usually lifted from the
// playbook frontmatter: human_gate, reversibility) or an explicit `gates` array.
export function triggeredGates(action = {}) {
  const g = new Set(Array.isArray(action.gates) ? action.gates : []);
  if (action.spends_money) g.add("spend_money");
  if (action.publishes || action.go_public) g.add("go_public");
  if (action.merges || action.merge_to_main) g.add("merge_to_main");
  if (action.destructive) g.add("destructive");
  if (action.human_gate) g.add("human_gate");
  if (action.reversibility === "hard") g.add("irreversible");
  return [...g];
}

// decision: "block" (needs the founder) | "auto" (dispatch) | "propose" (ask first).
export function gateDecision(action = {}, dials = {}) {
  const autonomy = autonomyFor(action.department, dials);
  const reasons = triggeredGates(action);
  if (reasons.length) return { decision: "block", reasons, autonomy };
  return { decision: autonomy === "auto" ? "auto" : "propose", reasons: [], autonomy };
}

const DEPARTMENTS = ["Strategy", "Brand", "Product", "Engineering", "Data", "Growth", "Sales", "Success", "Finance", "Legal", "Operations"];

// Set a per-department autonomy dial in <brainDir>/dials.json. The always_ask line is
// deliberately NOT settable here: no dial may cross it.
export function setDial(brainDir, department, mode) {
  const dep = DEPARTMENTS.find((d) => d.toLowerCase() === String(department).toLowerCase());
  if (!dep) throw new Error(`unknown department "${department}" (expected one of ${DEPARTMENTS.join(", ")})`);
  if (!["auto", "approve_first"].includes(mode)) throw new Error(`unknown mode "${mode}" (expected auto or approve_first)`);
  const p = join(brainDir, "dials.json");
  if (!existsSync(p)) throw new Error(`no dials.json at ${p} (run /casa-start first)`);
  const dials = JSON.parse(readFileSync(p, "utf8"));
  dials.departments = dials.departments || {};
  dials.departments[dep] = mode;
  writeFileSync(p, JSON.stringify(dials, null, 2));
  return { department: dep, mode };
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error("usage: gates.mjs decide '<action json>' ['<dials json>'] | gates.mjs dial <brainDir> <Department> <auto|approve_first>");
    process.exit(2);
  }
  if (args[0] === "dial") {
    const [, brainDir, department, mode] = args;
    if (!brainDir || !department || !mode) { console.error("usage: gates.mjs dial <brainDir> <Department> <auto|approve_first>"); process.exit(2); }
    try {
      const r = setDial(brainDir, department, mode);
      console.log(`${r.department} is now ${r.mode === "auto" ? "auto (reversible work runs without asking)" : "approve first (Casa proposes and waits)"}. The always-ask line still applies: ${ALWAYS_ASK.join(", ")}.`);
    } catch (e) { console.error(e.message); process.exit(2); }
  } else {
    const action = args[0] === "decide" ? (args[1] ? JSON.parse(args[1]) : {}) : JSON.parse(args[0]);
    const dialsArg = args[0] === "decide" ? args[2] : args[1];
    const dials = dialsArg ? JSON.parse(dialsArg) : {};
    console.log(JSON.stringify(gateDecision(action, dials), null, 2));
  }
}

// Casa v4 - approvals queue: the founder's side of the always-ask line.
//
// When a worker hits a gate it records a `blocked` event (gates.mjs decides that). Those
// blocked tasks ARE the approvals queue. The founder approves or rejects from the main
// terminal; the decision goes back on the ledger so the waiting worker (this terminal or
// another) can resume or stop. Approval is just another ledger event - latest status wins.

import { appendEvent, blocked } from "./ledger.mjs";

// Tasks currently blocked, awaiting the founder.
export function pending(dir) {
  return blocked(dir);
}

// Approve a blocked task: it returns to running so its operator can proceed.
export function approve(dir, task, { by = "founder", note } = {}) {
  return appendEvent(dir, { task, status: "running", decision: `approved by ${by}`, note });
}

// Reject a blocked task: it is cancelled, not silently dropped.
export function reject(dir, task, { by = "founder", reason } = {}) {
  return appendEvent(dir, { task, status: "cancelled", decision: `rejected by ${by}`, note: reason });
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) {
  const [, , cmd, dir, task, ...rest] = process.argv;
  if (!cmd || !dir) { console.error("usage: approvals.mjs pending|approve|reject <brainDir> [task] [note/reason]"); process.exit(2); }
  if (cmd === "pending") {
    console.log(JSON.stringify(pending(dir), null, 2));
  } else if (cmd === "approve") {
    if (!task) { console.error("approve needs a task"); process.exit(2); }
    console.log(approve(dir, task, { note: rest.join(" ") || undefined }).id);
  } else if (cmd === "reject") {
    if (!task) { console.error("reject needs a task"); process.exit(2); }
    console.log(reject(dir, task, { reason: rest.join(" ") || undefined }).id);
  } else {
    console.error(`approvals: unknown command "${cmd}"`); process.exit(2);
  }
}

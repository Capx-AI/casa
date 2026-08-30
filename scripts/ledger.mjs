// Casa v4 - task ledger: the append-only, cross-terminal activity log.
//
// Every terminal / agent appends ONE JSON line per event to <brainDir>/ledger.jsonl.
// Append-only is the whole point: many terminals (and later many accounts) can write
// concurrently with no coordination, because each appendFileSync of a single line is
// atomic on POSIX (O_APPEND). The Chief of Staff reads this to know what is in flight,
// what is blocked (needs approval), and what was decided - without reading transcripts.
//
// usage:
//   node scripts/ledger.mjs append <brainDir> '<json-event>'
//   node scripts/ledger.mjs tail   <brainDir> [n]
//   node scripts/ledger.mjs status <brainDir>
//   node scripts/ledger.mjs digest <brainDir>
//
// event shape (only `task` is required; everything else is filled / optional):
//   { ts, id, terminal, kind, dept, agent, task, status, node_id, artifact,
//     artifact_sha256, rubric_sha256, decision, parent, note }
//   status in: started | running | blocked | done | merged | failed | cancelled
//   kind   in: task (default) | playbook
//   - artifact: a PATH to a produced file, never its contents (keeps the ledger thin)
//   - decision: a short distilled outcome, surfaced to the CoS and compacted to memory
//
// Attestation fields (added 2026-07-09). A ledger is a claim about work. These
// three make the claim CHECKABLE by someone who was not there:
//   - kind:"playbook" marks the event as completing a build-map node, and then
//     `node_id` is REQUIRED. Ordinary worker tasks stay kind:"task" and are not
//     graph-checked, because they do not map onto the playbook DAG.
//   - artifact_sha256 pins WHICH bytes were produced, so the same file cannot be
//     re-claimed under fifty different task names, and so a reveal challenge has
//     something to challenge.
//   - rubric_sha256 pins the GRADING CONTRACT that was in force when the node was
//     completed. The rubric was public and hashed before the work started, so a
//     later grader cannot be accused of moving the goalposts.
// Both digests are computed HERE, never accepted from the caller.

import { appendFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { digest, digestFile } from "./caf/digest.mjs";

export const TERMINAL_STATUSES = new Set(["done", "merged", "failed", "cancelled"]);
export const OPEN_STATUSES = new Set(["started", "running", "blocked"]);
const ALL_STATUSES = new Set([...TERMINAL_STATUSES, ...OPEN_STATUSES]);
export const KINDS = new Set(["task", "playbook"]);

const ledgerPath = (dir) => join(dir, "ledger.jsonl");

const here = dirname(fileURLToPath(import.meta.url));
let _index = null;
// The playbook catalog, loaded once. Used to validate node_id and to pin the rubric.
function catalog() {
  if (!_index) {
    const raw = JSON.parse(readFileSync(join(dirname(here), "playbooks", "_index.json"), "utf8"));
    _index = new Map(raw.playbooks.map((p) => [p.id, p]));
  }
  return _index;
}

// 64 bits of entropy, not 20. The ledger is explicitly designed for concurrent
// appends from many terminals, and a verifier rejects a chain with duplicate ids,
// so a birthday collision is a production failure rather than a curiosity.
function genId() {
  return `evt_${Date.now().toString(36)}${randomBytes(8).toString("hex")}`;
}

// Fill defaults and validate the minimal shape. Throws on a missing task or bad status.
export function normalize(event = {}) {
  const e = { ...event };
  if (!e.task) throw new Error("ledger: event needs a task");
  if (!e.ts) e.ts = new Date().toISOString();
  if (!e.id) e.id = genId();
  if (!e.status) e.status = "started";
  if (!ALL_STATUSES.has(e.status)) throw new Error(`ledger: unknown status "${e.status}"`);
  if (!e.terminal) e.terminal = "main";
  if (!e.kind) e.kind = e.node_id ? "playbook" : "task";
  if (!KINDS.has(e.kind)) throw new Error(`ledger: unknown kind "${e.kind}"`);

  if (e.kind === "playbook") {
    if (!e.node_id) throw new Error('ledger: a kind:"playbook" event needs a node_id');
    if (!catalog().has(e.node_id)) throw new Error(`ledger: unknown playbook node_id "${e.node_id}"`);
  } else if (e.node_id) {
    throw new Error('ledger: node_id is only meaningful on a kind:"playbook" event');
  }
  return e;
}

// Digests are computed from the brain on disk, never taken from the caller. An
// emitter that could supply its own artifact_sha256 could commit to bytes it never
// wrote, which is exactly the fabrication the digest exists to prevent.
function stamp(dir, e) {
  if (e.artifact) {
    const abs = resolve(dir, e.artifact);
    const d = digestFile(abs);
    if (d) e.artifact_sha256 = d;
  }
  if (e.kind === "playbook") {
    const rubric = catalog().get(e.node_id)?.rubric;
    if (rubric) e.rubric_sha256 = digest(rubric);
  }
  return e;
}

// Keep events thin: a single-line append is only atomic for a modest write. Large
// blobs belong in a file referenced by `artifact`, not inlined into the ledger.
export const MAX_EVENT_BYTES = 16384;

export function appendEvent(dir, event) {
  const e = stamp(dir, normalize(event));
  const line = JSON.stringify(e) + "\n";
  const bytes = Buffer.byteLength(line, "utf8");
  if (bytes > MAX_EVENT_BYTES) {
    throw new Error(
      `ledger: event too large (${bytes}B > ${MAX_EVENT_BYTES}B). ` +
      "Put big content in a file and pass its path as `artifact`, not inline."
    );
  }
  appendFileSync(ledgerPath(dir), line);
  return e;
}

export function readEvents(dir) {
  const p = ledgerPath(dir);
  if (!existsSync(p)) return [];
  const out = [];
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const s = line.trim();
    if (!s) continue;
    try { out.push(JSON.parse(s)); } catch { /* skip a torn/partial line */ }
  }
  return out;
}

export function tail(dir, n = 20) {
  const all = readEvents(dir);
  return all.slice(Math.max(0, all.length - n));
}

// Latest event per task, in append order (a task's state is its most recent event).
export function byTask(dir, events = readEvents(dir)) {
  const m = new Map();
  for (const e of events) if (e.task) m.set(e.task, e);
  return m;
}

export function inFlight(dir) {
  return [...byTask(dir).values()].filter((e) => OPEN_STATUSES.has(e.status));
}

export function blocked(dir) {
  return [...byTask(dir).values()].filter((e) => e.status === "blocked");
}

export function aggregateByStatus(dir) {
  const counts = {};
  for (const e of byTask(dir).values()) counts[e.status] = (counts[e.status] || 0) + 1;
  return counts;
}

export function decisions(dir, n = 50) {
  const ds = readEvents(dir).filter((e) => e.decision);
  return ds.slice(Math.max(0, ds.length - n));
}

// Distill the ledger into a short markdown digest - the input to durable-memory compaction.
export function compact(dir) {
  const events = readEvents(dir);
  const tasks = byTask(dir, events);
  const done = [...tasks.values()].filter((e) => e.status === "done" || e.status === "merged");
  const open = [...tasks.values()].filter((e) => OPEN_STATUSES.has(e.status));
  const ds = events.filter((e) => e.decision);
  const lines = [];
  lines.push(`# Ledger digest (${events.length} events, ${tasks.size} tasks)`);
  lines.push("");
  lines.push(`## Decisions (${ds.length})`);
  for (const e of ds) lines.push(`- [${e.dept || e.terminal}] ${e.decision} (${e.task})`);
  lines.push("");
  lines.push(`## In flight (${open.length})`);
  for (const e of open) lines.push(`- ${e.status.toUpperCase()} ${e.task} - ${e.agent || e.terminal}${e.dept ? " / " + e.dept : ""}`);
  lines.push("");
  lines.push(`## Completed (${done.length})`);
  for (const e of done) lines.push(`- ${e.task}${e.artifact ? " -> " + e.artifact : ""}`);
  return lines.join("\n") + "\n";
}

// --- CLI (only runs when invoked directly, so tests can import the API safely) ---
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , cmd, dir, ...rest] = process.argv;
  if (!cmd || !dir) {
    console.error("usage: ledger.mjs append|tail|status|digest <brainDir> [...]");
    process.exit(2);
  }
  if (cmd === "append") {
    const e = appendEvent(dir, JSON.parse(rest.join(" ") || "{}"));
    console.log(e.id);
  } else if (cmd === "tail") {
    console.log(JSON.stringify(tail(dir, Number(rest[0]) || 20), null, 2));
  } else if (cmd === "status") {
    console.log(JSON.stringify({ counts: aggregateByStatus(dir), in_flight: inFlight(dir), blocked: blocked(dir) }, null, 2));
  } else if (cmd === "digest") {
    process.stdout.write(compact(dir));
  } else {
    console.error(`ledger: unknown command "${cmd}"`);
    process.exit(2);
  }
}

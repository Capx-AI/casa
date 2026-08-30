#!/usr/bin/env node
// A conforming CAF emitter in about a hundred lines, with NO dependency on Capx Casa.
//
//   node examples/caf-emit-minimal/emit.mjs <brainDir>
//
// This exists to prove the format is a standard, not a Casa export. A founder building on
// Codex, Hermes, OpenClaw, grok-build, or a text editor and a cron job can publish an
// attestation that `caf/check.mjs` accepts. Casa's only advantage is that it emits a
// HIGH-SCORING one as a side effect of being used.
//
// What you must implement, and nothing else:
//   1. Canonical JSON  sorted keys, no whitespace, INTEGERS ONLY
//   2. SHA-256
//   3. A Merkle tree with domain-separated leaves
//   4. An envelope that chains to its predecessor
//
// Everything Casa-specific (the playbook DAG, rubrics, legality) is optional. Omit it and
// your attestation is valid but weaker: `node_id_coverage_bp` collapses to zero and
// nothing you claim can be graph-checked. That is the honest trade, and it is visible.
//
// Zero dependencies (node: builtins only).

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, appendFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

// --- 1. Canonical JSON -------------------------------------------------------
function canon(v) {
  if (v === null) return "null";
  if (typeof v === "boolean") return String(v);
  if (typeof v === "number") {
    if (!Number.isInteger(v)) throw new TypeError(`CAF is integers only; got ${v}. Use micro-dollars or basis points.`);
    return String(Object.is(v, -0) ? 0 : v);
  }
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canon).join(",")}]`;
  if (Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) {
    throw new TypeError("CAF rejects Dates, Maps and class instances: they serialize to {} and vanish silently.");
  }
  // Sort by Unicode CODE POINT. Naive .sort() compares UTF-16 code units, which diverges
  // for astral characters, and comparing stringified arrays is worse still ("1,2" < "1,10").
  const cmp = (a, b) => {
    const A = [...a], B = [...b];
    for (let i = 0; i < Math.min(A.length, B.length); i++) {
      const d = A[i].codePointAt(0) - B[i].codePointAt(0);
      if (d) return d < 0 ? -1 : 1;
    }
    return A.length - B.length;
  };
  const keys = Object.keys(v).filter((k) => v[k] !== undefined).sort(cmp);
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;
}

// --- 2. Digests --------------------------------------------------------------
const sha = (b) => createHash("sha256").update(typeof b === "string" ? Buffer.from(b, "utf8") : b).digest();
const hex = (b) => sha(b).toString("hex");

// --- 3. Merkle ---------------------------------------------------------------
function uvarint(n) { const o = []; while (n >= 0x80) { o.push((n & 0x7f) | 0x80); n = Math.floor(n / 128); } o.push(n); return Buffer.from(o); }
function leaf(path, content) {
  const p = Buffer.from(path, "utf8");
  const c = typeof content === "string" ? Buffer.from(content, "utf8") : content;
  return sha(Buffer.concat([Buffer.from([0x00]), uvarint(p.length), p, sha(c)])); // 0x00 = leaf domain
}
function node(l, r) { return sha(Buffer.concat([Buffer.from([0x01]), l, r])); }   // 0x01 = internal domain
function merkleRoot(entries) {
  if (!entries.length) return sha(Buffer.from([0x00])).toString("hex");
  const sorted = [...entries].sort((a, b) => Buffer.compare(Buffer.from(a.path), Buffer.from(b.path)));
  let level = sorted.map((e) => leaf(e.path, e.content));
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) next.push(node(level[i], i + 1 < level.length ? level[i + 1] : level[i]));
    level = next;
  }
  return level[0].toString("hex");
}

// --- 4. Emit -----------------------------------------------------------------
const files = (dir, base = dir) => readdirSync(dir).sort().flatMap((n) => {
  const abs = join(dir, n);
  const rel = relative(base, abs).split(sep).join("/");
  if (rel === "attest" || rel.startsWith("attest/")) return [];
  return statSync(abs).isDirectory() ? files(abs, base) : [{ path: rel, content: readFileSync(abs) }];
});

const readJsonl = (f) => (!existsSync(f) ? [] : readFileSync(f, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)));

export function emit(brainDir) {
  const identity = JSON.parse(readFileSync(join(brainDir, "identity.json"), "utf8"));
  const events = readJsonl(join(brainDir, "ledger.jsonl")).sort((a, b) => (a.ts < b.ts ? -1 : 1));
  if (!events.length) throw new Error("nothing to attest: ledger.jsonl is empty");

  const A = join(brainDir, "attest");
  mkdirSync(A, { recursive: true });
  const chain = readJsonl(join(A, "chain.jsonl"));
  const tip = chain[chain.length - 1] || null;

  const from = tip ? tip.to_ts : events[0].ts;
  const delta = tip ? events.filter((e) => e.ts > from) : events;
  if (!delta.length) throw new Error(`nothing new since attestation ${tip.sequence}`);
  const to = delta[delta.length - 1].ts;

  const done = delta.filter((e) => e.status === "done");
  const donePb = delta.filter((e) => e.kind === "playbook" && e.status === "done");
  const claims = {
    state: { level: 0 },
    buildmap: { total: 0, done: donePb.length, ready: 0, blocked: 0, done_nodes: donePb.map((e) => ({ node_id: e.node_id })) },
    work: {
      tasks_done_window: done.length,
      tasks_done_total: events.filter((e) => e.status === "done").length,
      // Naming no nodes is legal and visibly weak: nothing can be graph-checked.
      node_id_coverage_bp: done.length ? Math.round((donePb.length / done.length) * 10000) : 0,
    },
    quality: { self_score_mean: 0 },
    spend: { settled_micros_window: 0, settled_micros_total: 0, receipt_count_window: 0, pay_attested: false },
    self_check: { index_sha256: identity.playbook_index_sha256 || "0".repeat(64), dag_violations: 0 },
  };

  // A hand-rolled brain may have no profile. Disclose an empty one so the disclosed-root
  // formula is the same everywhere, and so a registry can tell "no plan" from "hidden plan".
  const profileText = existsSync(join(brainDir, "profile.json")) ? readFileSync(join(brainDir, "profile.json"), "utf8") : "";

  const claimsText = canon(claims) + "\n";
  const deltaText = delta.map((e) => canon(e)).join("\n") + "\n";
  const receiptsText = "";
  writeFileSync(join(A, "profile.json"), profileText);
  writeFileSync(join(A, "claims.json"), claimsText);
  writeFileSync(join(A, "ledger.delta.jsonl"), deltaText);
  writeFileSync(join(A, "receipts.window.jsonl"), receiptsText);

  const brain_root = merkleRoot(files(brainDir));
  const disclosed_root = merkleRoot([
    { path: "profile.json", content: profileText },
    { path: "claims.json", content: claimsText },
    { path: "ledger.delta.jsonl", content: deltaText },
    { path: "receipts.window.jsonl", content: receiptsText },
  ]);
  const merkleText = canon({ brain_root, disclosed_root, leaf_count: files(brainDir).length, artifact_proofs: [] }) + "\n";
  writeFileSync(join(A, "merkle.json"), merkleText);

  const envelope = {
    caf_version: "1.0.0",
    sequence: tip ? tip.sequence + 1 : 0,
    prev_envelope_hash: tip ? tip.envelope_hash : null,
    subject: {
      company_pubkey: identity.company_pubkey ?? null,
      harness: identity.harness,
      brain_schema_version: identity.brain_schema_version,
      playbook_index_sha256: identity.playbook_index_sha256 || "0".repeat(64),
    },
    window: { from_ts: from, to_ts: to },
    roots: { brain_root, disclosed_root },
    digests: { profile: hex(profileText), claims: hex(claimsText), ledger_delta: hex(deltaText), receipts_window: hex(receiptsText), merkle: hex(merkleText) },
    produced_at: to, // the last event's clock, never Date.now(): the same brain must render the same bytes
  };
  const envelope_hash = hex(canon(envelope));
  writeFileSync(join(A, "attestation.json"), canon(envelope) + "\n");
  appendFileSync(join(A, "chain.jsonl"), canon({ sequence: envelope.sequence, envelope_hash, from_ts: from, to_ts: to, events: delta.length }) + "\n");
  return { envelope, envelope_hash };
}

if (process.argv[1]?.endsWith("emit.mjs")) {
  const dir = process.argv[2];
  if (!dir) { console.error("usage: emit.mjs <brainDir>"); process.exit(2); }
  const { envelope, envelope_hash } = emit(dir);
  console.log(`attestation ${envelope.sequence} emitted with no Casa dependency`);
  console.log(`  envelope ${envelope_hash.slice(0, 16)}...  brain root ${envelope.roots.brain_root.slice(0, 16)}...`);
}

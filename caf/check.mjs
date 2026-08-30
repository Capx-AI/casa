#!/usr/bin/env node
// caf check: verify an attestation, offline, with no registry and no network.
//
//   node caf/check.mjs <brainDir>
//
// Three deterministic tiers. All free, all reproducible by anyone holding the pinned
// catalog. Exit code is non-zero on any failure.
//
//   Tier 0  structure  signature, chain, canonical re-serialization, digests, roots
//   Tier 1  arithmetic claims agree with the delta, the receipts, and the merkle proofs
//   Tier 2  legality   every claimed completion was READY, per the router itself
//
// THIS IS NOT A VERDICT. Passing means the record is internally coherent and structurally
// legal. It does not mean the record is TRUE. Only a registry, observing over time and
// issuing reveal challenges, can say anything about truth. Casa can only say that a
// company has not contradicted itself.
//
// Zero dependencies (node: builtins + relative only).

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { canon } from "../scripts/caf/canon.mjs";
import { digest } from "../scripts/caf/digest.mjs";
import { merkleRoot, verifyInclusion } from "../scripts/caf/merkle.mjs";
import { verifyEnvelope } from "./sign.mjs";

// Tier 2 needs the Casa router (a 34KB engine legality.mjs pulls in). A standalone
// distribution of this verifier may ship only the primitives; degrade to an honest note
// instead of refusing to load. Top-level await keeps check() itself synchronous.
let checkLegality = null;
try { ({ checkLegality } = await import("../scripts/caf/legality.mjs")); } catch { /* not shipped standalone */ }

const readJson = (f) => JSON.parse(readFileSync(f, "utf8"));
const readJsonl = (f) =>
  !existsSync(f) ? [] : readFileSync(f, "utf8").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => JSON.parse(l));

function brainFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const abs = join(dir, name);
    const rel = relative(base, abs).split(sep).join("/");
    if (rel === "attest" || rel.startsWith("attest/")) continue;
    if (statSync(abs).isDirectory()) out.push(...brainFiles(abs, base));
    else out.push({ path: rel, content: readFileSync(abs) });
  }
  return out;
}

export function check(brainDir) {
  const A = join(brainDir, "attest");
  const fail = [];
  const note = [];
  const t = (tier, ok, msg) => { if (!ok) fail.push(`[tier ${tier}] ${msg}`); };

  if (!existsSync(join(A, "attestation.json"))) return { ok: false, fail: ["no attest/ directory. Run: node scripts/brain.mjs attest <brainDir>"], note };

  const envelope = readJson(join(A, "attestation.json"));
  const profileText = existsSync(join(A, "profile.json")) ? readFileSync(join(A, "profile.json"), "utf8") : "";
  const claimsText = readFileSync(join(A, "claims.json"), "utf8");
  const deltaText = readFileSync(join(A, "ledger.delta.jsonl"), "utf8");
  const receiptsText = existsSync(join(A, "receipts.window.jsonl")) ? readFileSync(join(A, "receipts.window.jsonl"), "utf8") : "";
  const merkleText = readFileSync(join(A, "merkle.json"), "utf8");
  const claims = JSON.parse(claimsText);
  const merkle = JSON.parse(merkleText);
  const delta = readJsonl(join(A, "ledger.delta.jsonl"));
  const receipts = readJsonl(join(A, "receipts.window.jsonl"));

  // ---- Tier 0: structure -----------------------------------------------------
  t(0, envelope.caf_version?.split(".")[0] === "1", `unsupported caf_version "${envelope.caf_version}"`);

  const { signature, ...unsigned } = envelope;
  t(0, canon(unsigned) === canon(JSON.parse(canon(unsigned))), "envelope does not round-trip through canonical JSON");

  if (signature) {
    const pk = envelope.subject.company_pubkey;
    t(0, !!pk, "signed envelope names no company_pubkey");
    if (pk) t(0, verifyEnvelope(envelope, pk), "signature does not verify against subject.company_pubkey");
  } else {
    note.push("UNSIGNED. Chain integrity holds, but nothing binds this record to an identity.");
  }

  t(0, envelope.digests.profile === digest(profileText), "digests.profile does not match profile.json");
  t(0, envelope.digests.claims === digest(claimsText), "digests.claims does not match claims.json");
  t(0, envelope.digests.ledger_delta === digest(deltaText), "digests.ledger_delta does not match ledger.delta.jsonl");
  t(0, envelope.digests.receipts_window === digest(receiptsText), "digests.receipts_window does not match receipts.window.jsonl");
  t(0, envelope.digests.merkle === digest(merkleText), "digests.merkle does not match merkle.json");

  const disclosed = merkleRoot([
    { path: "profile.json", content: profileText },
    { path: "claims.json", content: claimsText },
    { path: "ledger.delta.jsonl", content: deltaText },
    { path: "receipts.window.jsonl", content: receiptsText },
  ]);
  t(0, envelope.roots.disclosed_root === disclosed, "disclosed_root does not recompute from the published files");
  t(0, merkle.disclosed_root === disclosed, "merkle.json disclosed_root disagrees with the published files");

  // The brain is present here, so the full commitment is checkable too. A registry that
  // only ever sees attest/ can check everything above, but not this.
  const files = brainFiles(brainDir);
  t(0, envelope.roots.brain_root === merkleRoot(files), "brain_root does not match the brain on disk");

  // Chain: sequence and prev must agree with the founder's own chain.jsonl.
  const chain = readJsonl(join(A, "chain.jsonl"));
  const tip = chain[chain.length - 1];
  t(0, !!tip, "no chain.jsonl entry for this attestation");
  if (tip) {
    t(0, tip.sequence === envelope.sequence, `chain tip sequence ${tip.sequence} != envelope ${envelope.sequence}`);
    t(0, tip.envelope_hash === digest(canon(unsigned)), "chain tip envelope_hash does not match the signing preimage");
    const prior = chain[chain.length - 2];
    t(0, envelope.sequence === 0 ? envelope.prev_envelope_hash === null : envelope.prev_envelope_hash === prior?.envelope_hash,
      "prev_envelope_hash does not chain to the previous attestation");
    for (let i = 1; i < chain.length; i++) {
      t(0, chain[i].sequence === chain[i - 1].sequence + 1, `chain sequence jumps at ${chain[i].sequence}`);
      t(0, chain[i].from_ts === chain[i - 1].to_ts, `chain window gap at sequence ${chain[i].sequence}`);
    }
  }

  // ---- Tier 1: arithmetic ----------------------------------------------------
  const doneInDelta = delta.filter((e) => e.status === "done").length;
  t(1, claims.work.tasks_done_window === doneInDelta, `claims say ${claims.work.tasks_done_window} done this window, the delta has ${doneInDelta}`);

  const settled = receipts.filter((r) => r.status === "settled").reduce((a, r) => a + Number(r.amountMicros || 0), 0);
  t(1, claims.spend.settled_micros_window === settled, "claims.spend disagrees with the receipts in the window");

  const w = claims.constraint?.win_definition;
  if (w && Number.isInteger(w.target_value) && Number.isInteger(w.current_value)) {
    t(1, claims.constraint.win_gap === w.target_value - w.current_value, "win_gap is not target minus current");
  }

  const ids = new Set();
  for (const e of delta) {
    t(1, !ids.has(e.id), `event id "${e.id}" appears twice in the delta`);
    ids.add(e.id);
    t(1, e.ts >= envelope.window.from_ts && e.ts <= envelope.window.to_ts, `event ${e.id} falls outside the declared window`);
  }

  // Every artifact this window claims must prove against the committed brain root.
  const proofs = new Map(merkle.artifact_proofs.map((p) => [p.path, p]));
  const byPath = new Map(files.map((f) => [f.path, f.content]));
  for (const e of delta) {
    if (!e.artifact || !e.artifact_sha256) continue;
    const proof = proofs.get(e.artifact);
    t(1, !!proof, `no inclusion proof for claimed artifact "${e.artifact}"`);
    if (!proof) continue;
    const bytes = byPath.get(e.artifact);
    t(1, !!bytes, `claimed artifact "${e.artifact}" is not in the brain`);
    if (!bytes) continue;
    t(1, digest(bytes) === e.artifact_sha256, `artifact_sha256 for "${e.artifact}" does not match its bytes`);
    t(1, verifyInclusion(envelope.roots.brain_root, e.artifact, bytes, proof), `inclusion proof for "${e.artifact}" does not verify`);
  }

  // ---- Tier 2: legality ------------------------------------------------------
  // A brain with no profile.json declares no playbook plan. That is legal: CAF is
  // harness-agnostic and a hand-rolled emitter has no DAG to be checked against. It is
  // also visibly weaker, and saying so is the point. Do not crash, and do not pretend.
  let lg = null;
  if (!existsSync(join(brainDir, "profile.json"))) {
    note.push("no profile.json: this brain declares no playbook plan, so nothing here can be graph-checked. Structure verified, legality unverifiable.");
  } else if (!checkLegality) {
    note.push("legality module not shipped with this verifier: tiers 0 and 1 verified, tier 2 skipped. Run the full Casa checkout for the graph check.");
  } else {
    lg = checkLegality(brainDir);
    t(2, lg.index_sha256 === envelope.subject.playbook_index_sha256,
      "the catalog on disk is not the one this attestation was made against");
    t(2, lg.total_violations === 0, `${lg.total_violations} legality violation(s): ${lg.violations.slice(0, 3).map((v) => v.kind).join(", ")}`);
    if (lg.node_id_coverage_bp < 5000) {
      note.push(`node_id coverage is ${(lg.node_id_coverage_bp / 100).toFixed(1)}%. Most done work names no playbook, so most of it cannot be graph-checked.`);
    }
  }

  return { ok: fail.length === 0, fail, note, sequence: envelope.sequence, signed: !!signature, legality: lg };
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) { console.error("usage: check.mjs <brainDir>"); process.exit(2); }
  const r = check(dir);
  for (const n of r.note) console.log(`  note: ${n}`);
  for (const f of r.fail) console.log(`  FAIL  ${f}`);
  console.log(r.ok
    ? `\nattestation ${r.sequence} is coherent and legal${r.signed ? " and signed" : " (unsigned)"}.\nThis is a self-check, not a verdict. Only a registry can speak to truth.`
    : `\n${r.fail.length} failure(s).`);
  process.exit(r.ok ? 0 : 1);
}

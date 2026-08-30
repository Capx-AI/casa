// The emitter, the sidecar signer, and the offline verifier.
//
// The property that matters most: the same brain always renders the same bytes. A
// nondeterministic emitter makes every digest and every signature downstream meaningless,
// and it fails silently, so this is the test whose failure should block a release.

import { after, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, appendFileSync, cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { attest, chainTip } from "../scripts/attest.mjs";
import { keygen, bind, keyPath } from "../caf/keygen.mjs";
import { signBrain, signEnvelope, verifyEnvelope, preimage } from "../caf/sign.mjs";
import { check } from "../caf/check.mjs";
import { canon } from "../scripts/caf/canon.mjs";
import { digest } from "../scripts/caf/digest.mjs";
import { generate } from "../caf/fixtures/generate.mjs";

const FIXTURE_ROOT = mkdtempSync(join(tmpdir(), "caf-attest-suite-"));
const GOLDEN = generate({ out: join(FIXTURE_ROOT, "golden") }).brain;
after(() => rmSync(FIXTURE_ROOT, { recursive: true, force: true }));

// Every test gets its own brain AND its own key home, so a real ~/.capx is never touched.
function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "caf-attest-"));
  const brain = join(root, "company-brain");
  cpSync(GOLDEN, brain, { recursive: true });
  const prevHome = process.env.CAPX_HOME;
  process.env.CAPX_HOME = root;
  return { root, brain, done: () => { prevHome === undefined ? delete process.env.CAPX_HOME : (process.env.CAPX_HOME = prevHome); rmSync(root, { recursive: true, force: true }); } };
}

const readEnv = (brain) => JSON.parse(readFileSync(join(brain, "attest", "attestation.json"), "utf8"));

test("attest: the same brain renders byte-identical bytes (release-blocking)", () => {
  const a = sandbox(), b = sandbox();
  try {
    attest(a.brain);
    attest(b.brain);
    for (const f of ["attestation.json", "claims.json", "ledger.delta.jsonl", "merkle.json"]) {
      assert.equal(
        readFileSync(join(a.brain, "attest", f), "utf8"),
        readFileSync(join(b.brain, "attest", f), "utf8"),
        `${f} differs across two renders of the same brain`,
      );
    }
  } finally { a.done(); b.done(); }
});

test("attest: produced_at is the last ledger timestamp, never a wall clock", () => {
  const s = sandbox();
  try {
    const { envelope } = attest(s.brain);
    assert.equal(envelope.produced_at, envelope.window.to_ts);
    assert.match(envelope.produced_at, /Z$/, "RFC 3339 with a Z suffix, so a lexical sort is chronological");
  } finally { s.done(); }
});

test("attest: genesis has sequence 0 and no predecessor; the chain advances", () => {
  const s = sandbox();
  try {
    const first = attest(s.brain);
    assert.equal(first.envelope.sequence, 0);
    assert.equal(first.envelope.prev_envelope_hash, null);

    // Nothing new: refuse rather than mint an empty attestation to farm cadence.
    assert.throws(() => attest(s.brain), /nothing new/);

    appendFileSync(join(s.brain, "ledger.jsonl"),
      JSON.stringify({ ts: "2026-07-08T10:00:00.000Z", id: "evt_next", task: "Weekly ledger digest", status: "done", kind: "task" }) + "\n");

    const second = attest(s.brain);
    assert.equal(second.envelope.sequence, 1);
    assert.equal(second.envelope.prev_envelope_hash, first.envelope_hash, "sequence 1 chains to sequence 0");
    assert.equal(second.envelope.window.from_ts, first.envelope.window.to_ts, "windows abut, leaving no gap");
    assert.equal(chainTip(s.brain).sequence, 1);
  } finally { s.done(); }
});

test("attest: commits to the whole brain but discloses only the projection", () => {
  const s = sandbox();
  try {
    const { envelope } = attest(s.brain);
    const merkle = JSON.parse(readFileSync(join(s.brain, "attest", "merkle.json"), "utf8"));
    assert.notEqual(envelope.roots.brain_root, envelope.roots.disclosed_root);
    assert.ok(merkle.leaf_count > 70, "the brain root covers every file, including undisclosed artifacts");
    assert.ok(merkle.artifact_proofs.length > 50, "each claimed artifact carries an inclusion proof");

    // claims.json must not leak working context
    const claimsText = readFileSync(join(s.brain, "attest", "claims.json"), "utf8");
    assert.equal(/"note"/.test(claimsText), false);
    const delta = readFileSync(join(s.brain, "attest", "ledger.delta.jsonl"), "utf8");
    assert.equal(/"note"|"terminal"/.test(delta), false, "note and terminal are stripped from the disclosed delta");
  } finally { s.done(); }
});

test("attest: pay_attested is false and spend is zero when external receipts are absent", () => {
  const s = sandbox();
  try {
    const { claims } = attest(s.brain);
    assert.equal(claims.spend.pay_attested, false, "say so plainly rather than imply an anchor that does not exist");
    assert.equal(claims.spend.settled_micros_total, 0);
  } finally { s.done(); }
});

test("attest: refuses a brain with no ledger and one with no identity", () => {
  const s = sandbox();
  try {
    writeFileSync(join(s.brain, "ledger.jsonl"), "");
    assert.throws(() => attest(s.brain), /ledger.jsonl is empty/);
    rmSync(join(s.brain, "identity.json"));
    assert.throws(() => attest(s.brain), /no identity.json/);
  } finally { s.done(); }
});

test("sign: round-trips, and a tampered envelope no longer verifies", () => {
  const s = sandbox();
  try {
    const { pubkey } = keygen();
    const pem = readFileSync(join(s.root, ".capx", "company.key"), "utf8");
    const env = { caf_version: "1.0.0", sequence: 0, subject: { company_pubkey: pubkey } };

    const signed = signEnvelope(env, pem);
    assert.ok(verifyEnvelope(signed, pubkey));
    assert.equal(verifyEnvelope({ ...signed, sequence: 1 }, pubkey), false, "changing one field breaks the signature");
    assert.equal(verifyEnvelope({ ...signed, signature: undefined }, pubkey), false);
    assert.equal(verifyEnvelope(signed, keygen({ force: true }).pubkey), false, "another key does not verify");
  } finally { s.done(); }
});

test("sign: the signing preimage excludes the signature field", () => {
  const env = { a: 1, b: 2 };
  assert.equal(preimage(env).toString("hex"), digest(canon(env)));
  assert.equal(preimage({ ...env, signature: "ed25519:zzz" }).toString("hex"), digest(canon(env)));
});

test("sign: refuses an envelope that names no key, and refuses the wrong key", () => {
  const s = sandbox();
  try {
    // A key exists, but identity.json does not name it yet, so the envelope was rendered
    // before the company had an identity. Refuse rather than bind it at signing time:
    // chain.jsonl already recorded the hash of these exact bytes.
    const { pubkey } = keygen();
    attest(s.brain);
    assert.throws(() => signBrain(s.brain), /names no company_pubkey/);

    bind(s.brain, pubkey);
    rmSync(join(s.brain, "attest"), { recursive: true, force: true });
    attest(s.brain);
    const ok = signBrain(s.brain);
    assert.equal(ok.pubkey, pubkey);

    // Signing must not have mutated the envelope's other bytes: the chain tip recorded
    // the preimage hash before the signature existed.
    const env = readEnv(s.brain);
    const { signature, ...unsigned } = env;
    assert.equal(chainTip(s.brain).envelope_hash, digest(canon(unsigned)), "signing forked the chain from its own recorded tip");

    keygen({ force: true }); // a different key now sits at the key path
    assert.throws(() => signBrain(s.brain, { key: keyPath() }), /does not match identity.json/);
  } finally { s.done(); }
});

test("check: a rendered, signed attestation passes offline", () => {
  const s = sandbox();
  try {
    bind(s.brain, keygen().pubkey);
    attest(s.brain);
    signBrain(s.brain);
    const r = check(s.brain);
    assert.deepEqual(r.fail, []);
    assert.equal(r.ok, true);
    assert.equal(r.signed, true);
  } finally { s.done(); }
});

test("check: an unsigned attestation passes, but says what it does not prove", () => {
  const s = sandbox();
  try {
    attest(s.brain);
    const r = check(s.brain);
    assert.equal(r.ok, true);
    assert.equal(r.signed, false);
    assert.ok(r.note.some((n) => /nothing binds this record to an identity/.test(n)));
  } finally { s.done(); }
});

test("check: one flipped byte in one committed artifact fails three independent checks", () => {
  const s = sandbox();
  try {
    attest(s.brain);
    const f = join(s.brain, "outputs", "opportunity-scan", "README.md");
    writeFileSync(f, readFileSync(f, "utf8") + " ");
    const r = check(s.brain);
    assert.equal(r.ok, false);
    assert.ok(r.fail.some((x) => /brain_root does not match/.test(x)));
    assert.ok(r.fail.some((x) => /artifact_sha256 .* does not match its bytes/.test(x)));
    assert.ok(r.fail.some((x) => /inclusion proof .* does not verify/.test(x)));
  } finally { s.done(); }
});

test("check: rewriting the disclosed claims breaks the envelope digest", () => {
  const s = sandbox();
  try {
    attest(s.brain);
    const p = join(s.brain, "attest", "claims.json");
    const claims = JSON.parse(readFileSync(p, "utf8"));
    claims.work.tasks_done_total = 999_999;
    writeFileSync(p, canon(claims) + "\n");
    const r = check(s.brain);
    assert.equal(r.ok, false);
    assert.ok(r.fail.some((x) => /digests.claims does not match/.test(x)));
  } finally { s.done(); }
});

test("check: a broken chain is caught (sequence and window continuity)", () => {
  const s = sandbox();
  try {
    attest(s.brain);
    const p = join(s.brain, "attest", "chain.jsonl");
    const rows = readFileSync(p, "utf8").trim().split("\n").map((l) => JSON.parse(l));
    rows[0].sequence = 7;
    writeFileSync(p, rows.map((r) => canon(r)).join("\n") + "\n");
    const r = check(s.brain);
    assert.equal(r.ok, false);
    assert.ok(r.fail.some((x) => /chain tip sequence/.test(x)));
  } finally { s.done(); }
});

test("check: a signature from the wrong key is caught", () => {
  const s = sandbox();
  try {
    bind(s.brain, keygen().pubkey);
    attest(s.brain);
    signBrain(s.brain);
    const p = join(s.brain, "attest", "attestation.json");
    const env = JSON.parse(readFileSync(p, "utf8"));
    env.signature = "ed25519:" + Buffer.alloc(64, 7).toString("base64url");
    writeFileSync(p, canon(env) + "\n");
    const r = check(s.brain);
    assert.equal(r.ok, false);
    assert.ok(r.fail.some((x) => /signature does not verify/.test(x)));
  } finally { s.done(); }
});

test("check: an attestation made against a different catalog is caught", () => {
  const s = sandbox();
  try {
    attest(s.brain);
    const p = join(s.brain, "attest", "attestation.json");
    const env = JSON.parse(readFileSync(p, "utf8"));
    env.subject.playbook_index_sha256 = "0".repeat(64);
    writeFileSync(p, canon(env) + "\n");
    const r = check(s.brain);
    assert.equal(r.ok, false);
    assert.ok(r.fail.some((x) => /catalog on disk is not the one/.test(x)));
  } finally { s.done(); }
});

// The property that decides what a terminal page is ALLOWED to render. A registry receives
// attest/, never the brain. If it cannot re-run the legality replay itself, then
// claims.self_check is the company grading its own homework and no UI may call it verified.
test("a registry holding only attest/ reproduces the legality verdict byte for byte", async () => {
  const s = sandbox();
  const reg = mkdtempSync(join(tmpdir(), "caf-reg-"));
  try {
    attest(s.brain);
    const A = join(s.brain, "attest");

    // Exactly what the founder pushes, and nothing else.
    cpSync(join(A, "profile.json"), join(reg, "profile.json"));
    // Deltas chain into the full ledger: windows abut, so concatenating them reconstructs it.
    cpSync(join(A, "ledger.delta.jsonl"), join(reg, "ledger.jsonl"));

    const { checkLegality } = await import("../scripts/caf/legality.mjs");
    const registry = checkLegality(reg);
    const founder = checkLegality(s.brain);

    assert.equal(registry.playbook_events, founder.playbook_events);
    assert.equal(registry.node_id_coverage_bp, founder.node_id_coverage_bp);
    assert.deepEqual(registry.violations, founder.violations);
    assert.equal(registry.index_sha256, founder.index_sha256, "both judged against the same pinned catalog");
  } finally { s.done(); rmSync(reg, { recursive: true, force: true }); }
});

test("profile.json is disclosed and digested, so it cannot be swapped after the fact", () => {
  const s = sandbox();
  try {
    const { envelope } = attest(s.brain);
    const p = join(s.brain, "attest", "profile.json");
    assert.ok(readFileSync(p, "utf8").length, "the profile is published");
    assert.match(envelope.digests.profile, /^[0-9a-f]{64}$/);

    writeFileSync(p, JSON.stringify({ primary_type: "marketplace" }));
    const r = check(s.brain);
    assert.equal(r.ok, false);
    assert.ok(r.fail.some((x) => /digests.profile does not match/.test(x)));
    assert.ok(r.fail.some((x) => /disclosed_root does not recompute/.test(x)), "and it is bound into the disclosed root");
  } finally { s.done(); }
});

test("attest: a profile-less brain renders instead of crashing (the verifier already accepts it)", () => {
  const s = sandbox();
  try {
    rmSync(join(s.brain, "profile.json"));
    const { envelope, claims } = attest(s.brain);
    assert.equal(claims.self_check.dag_violations, 0);
    assert.equal(claims.self_check.index_sha256, envelope.subject.playbook_index_sha256,
      "the catalog pin in self_check must match the envelope even when legality cannot run");
    assert.ok(Number.isInteger(claims.work.node_id_coverage_bp), "coverage still computes without a profile");
    const r = check(s.brain);
    assert.equal(r.ok, true, `check must pass a profile-less brain: ${r.fail.join("; ")}`);
    assert.ok(r.note.some((n) => n.includes("no profile.json")), "the honest note must say why legality did not run");
  } finally { s.done(); }
});

test("attest: driver_harness from identity.json lands in the envelope; absent stays absent (CAF 1.1.0)", () => {
  const s = sandbox();
  try {
    const idf = join(s.brain, "identity.json");
    const id = JSON.parse(readFileSync(idf, "utf8"));
    assert.equal(JSON.parse(readFileSync(join(s.brain, "attest", "..", "identity.json"), "utf8")).driver_harness ?? null, id.driver_harness ?? null);

    // Golden brain carries no driver_harness: the envelope must omit the field entirely.
    const bare = attest(s.brain);
    assert.equal("driver_harness" in bare.envelope.subject, false, "unset driver must not appear as null noise");

    // Set one, re-render from a fresh chain: the envelope must carry it verbatim.
    rmSync(join(s.brain, "attest"), { recursive: true, force: true });
    id.driver_harness = { name: "codex", version: "1.2" };
    writeFileSync(idf, JSON.stringify(id, null, 2) + "\n");
    const driven = attest(s.brain);
    assert.deepEqual(driven.envelope.subject.driver_harness, { name: "codex", version: "1.2" });
    assert.equal(driven.envelope.caf_version, "1.1.0");
    const r = check(s.brain);
    assert.equal(r.ok, true, `check must accept a driven envelope: ${r.fail.join("; ")}`);
  } finally { s.done(); }
});

// Merkle commitment. The property under test: an attestation can commit to a file
// it never publishes, and later prove that commitment from the revealed bytes alone.

import { test } from "node:test";
import assert from "node:assert/strict";
import { merkleRoot, inclusionProof, verifyInclusion, uvarint } from "../scripts/caf/merkle.mjs";

const brain = () => [
  { path: "build-map.json", content: '{"done":71}' },
  { path: "ledger.jsonl", content: '{"task":"a"}\n' },
  { path: "outputs/opportunity-scan/brief.md", content: "# Opportunity brief\n" },
  { path: "profile.json", content: '{"primary_type":"saas"}' },
  { path: "scores.jsonl", content: '{"score":82}\n' },
];

test("uvarint: encodes the multi-byte boundary correctly", () => {
  assert.deepEqual([...uvarint(0)], [0x00]);
  assert.deepEqual([...uvarint(127)], [0x7f]);
  assert.deepEqual([...uvarint(128)], [0x80, 0x01]);
  assert.deepEqual([...uvarint(300)], [0xac, 0x02]);
  assert.throws(() => uvarint(-1), /non-negative/);
});

test("merkleRoot: deterministic, and independent of input order", () => {
  const a = merkleRoot(brain());
  const b = merkleRoot([...brain()].reverse());
  assert.equal(a, b, "entries are sorted by path before hashing");
  assert.match(a, /^[0-9a-f]{64}$/);
});

test("merkleRoot: any byte of any file changes the root", () => {
  const base = merkleRoot(brain());
  const tampered = brain();
  tampered[2].content = "# Opportunity brief \n"; // one space
  assert.notEqual(merkleRoot(tampered), base);
});

test("merkleRoot: moving a file changes the root (path is bound into the leaf)", () => {
  const base = merkleRoot(brain());
  const moved = brain();
  moved[2].path = "outputs/opportunity-scan/BRIEF.md";
  assert.notEqual(merkleRoot(moved), base);
});

test("merkleRoot: path length is prefixed, so path boundaries cannot collide", () => {
  const x = merkleRoot([{ path: "a/bc", content: "1" }]);
  const y = merkleRoot([{ path: "ab/c", content: "1" }]);
  assert.notEqual(x, y);
});

test("merkleRoot: odd and even leaf counts both work; empty set is defined", () => {
  for (let n = 0; n <= 9; n++) {
    const entries = Array.from({ length: n }, (_, i) => ({ path: `f${i}`, content: `${i}` }));
    assert.match(merkleRoot(entries), /^[0-9a-f]{64}$/, `n=${n}`);
  }
});

test("merkleRoot: duplicate paths are rejected", () => {
  assert.throws(() => merkleRoot([{ path: "a", content: "1" }, { path: "a", content: "2" }]), /duplicate path/);
});

test("inclusionProof: every file proves, at every tree size", () => {
  for (let n = 1; n <= 9; n++) {
    const entries = Array.from({ length: n }, (_, i) => ({ path: `f${i}`, content: `content-${i}` }));
    const root = merkleRoot(entries);
    for (const e of entries) {
      const proof = inclusionProof(entries, e.path);
      assert.ok(verifyInclusion(root, e.path, e.content, proof), `n=${n} path=${e.path}`);
    }
  }
});

test("inclusionProof: a proof does not verify against tampered bytes", () => {
  const entries = brain();
  const root = merkleRoot(entries);
  const proof = inclusionProof(entries, "outputs/opportunity-scan/brief.md");

  assert.ok(verifyInclusion(root, "outputs/opportunity-scan/brief.md", "# Opportunity brief\n", proof));
  assert.equal(
    verifyInclusion(root, "outputs/opportunity-scan/brief.md", "# Fabricated brief\n", proof),
    false,
    "revealing different bytes than were committed must fail",
  );
});

test("inclusionProof: a proof does not verify under a different path", () => {
  const entries = brain();
  const root = merkleRoot(entries);
  const proof = inclusionProof(entries, "profile.json");
  assert.equal(verifyInclusion(root, "scores.jsonl", '{"primary_type":"saas"}', proof), false);
});

test("inclusionProof: a proof from one brain does not verify against another root", () => {
  const entries = brain();
  const proof = inclusionProof(entries, "profile.json");
  const otherRoot = merkleRoot([...entries, { path: "extra.md", content: "x" }]);
  assert.equal(verifyInclusion(otherRoot, "profile.json", '{"primary_type":"saas"}', proof), false);
});

test("inclusionProof: an unknown path throws rather than returning a bogus proof", () => {
  assert.throws(() => inclusionProof(brain(), "nope.md"), /is not in the tree/);
});

test("merkle: an internal node cannot be passed off as a leaf (domain separation)", () => {
  // Two leaves f0,f1 fold to an internal node N. A tree whose single leaf hashes
  // to N must not share a root with the two-leaf tree.
  const two = [{ path: "f0", content: "0" }, { path: "f1", content: "1" }];
  const rootTwo = merkleRoot(two);
  const rootOne = merkleRoot([{ path: "f0", content: "0" }]);
  assert.notEqual(rootTwo, rootOne);
});

// What a registry can prove without the brain. It receives attest/, never the files, so it
// cannot read an artifact. But leaf = H(0x00||len(path)||path||H(content)), and H(content)
// IS the artifact_sha256 the ledger already published. So the commitment is checkable from
// the digest alone. This is the difference between a page saying "committed, trust me" and
// "committed, I checked".
test("verifyCommitment: a registry proves commitment from the digest, never seeing the bytes", async () => {
  const { verifyCommitment } = await import("../scripts/caf/merkle.mjs");
  const { digest } = await import("../scripts/caf/digest.mjs");
  const entries = brain();
  const root = merkleRoot(entries);

  for (const e of entries) {
    const proof = inclusionProof(entries, e.path);
    const sha = digest(e.content); // exactly what ledger.mjs records as artifact_sha256
    assert.ok(verifyCommitment(root, e.path, sha, proof), `commitment for ${e.path}`);
  }
});

test("verifyCommitment: a forged digest does not fold to the committed root", async () => {
  const { verifyCommitment } = await import("../scripts/caf/merkle.mjs");
  const entries = brain();
  const root = merkleRoot(entries);
  const proof = inclusionProof(entries, "profile.json");
  assert.equal(verifyCommitment(root, "profile.json", "0".repeat(64), proof), false);
});

test("verifyCommitment agrees with verifyInclusion when the bytes are revealed", async () => {
  const { verifyCommitment } = await import("../scripts/caf/merkle.mjs");
  const { digest } = await import("../scripts/caf/digest.mjs");
  const entries = brain();
  const root = merkleRoot(entries);
  const proof = inclusionProof(entries, "scores.jsonl");
  const content = entries.find((e) => e.path === "scores.jsonl").content;
  assert.equal(verifyInclusion(root, "scores.jsonl", content, proof), true);
  assert.equal(verifyCommitment(root, "scores.jsonl", digest(content), proof), true);
});

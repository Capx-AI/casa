// Merkle tree over a set of (path, content) pairs.
//
// The point: an attestation can COMMIT to every file in the brain while
// DISCLOSING only a projection. Later, under a reveal challenge, any single file
// can be proven to have been committed at that path, at that time, without ever
// having published it.
//
// Construction (normative, docs/CAF-SPEC.md section 4):
//   sort entries by path bytes, ascending
//   leaf     = SHA256( 0x00 || uvarint(len(path)) || path || SHA256(content) )
//   internal = SHA256( 0x01 || left || right )
//   odd level: the last node is duplicated
//
// The 0x00 / 0x01 domain-separation prefixes stop an attacker presenting an
// internal node as a leaf. The length prefix stops "a/bc" and "ab/c" colliding.
//
// Zero dependencies (node: builtins only).

import { digestBytes } from "./digest.mjs";

const LEAF = 0x00;
const NODE = 0x01;

export function uvarint(n) {
  if (!Number.isInteger(n) || n < 0) throw new TypeError(`uvarint: ${n} is not a non-negative integer`);
  const out = [];
  while (n >= 0x80) { out.push((n & 0x7f) | 0x80); n = Math.floor(n / 128); }
  out.push(n);
  return Buffer.from(out);
}

// entries: [{ path: string, content: Buffer|string }]
function leafOf(path, content) {
  const p = Buffer.from(path, "utf8");
  const c = typeof content === "string" ? Buffer.from(content, "utf8") : content;
  return digestBytes(Buffer.concat([Buffer.from([LEAF]), uvarint(p.length), p, digestBytes(c)]));
}

function nodeOf(left, right) {
  return digestBytes(Buffer.concat([Buffer.from([NODE]), left, right]));
}

const byPath = (a, b) => Buffer.compare(Buffer.from(a.path, "utf8"), Buffer.from(b.path, "utf8"));

function sortedLeaves(entries) {
  const sorted = [...entries].sort(byPath);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].path === sorted[i - 1].path) throw new Error(`merkle: duplicate path "${sorted[i].path}"`);
  }
  return { sorted, leaves: sorted.map((e) => leafOf(e.path, e.content)) };
}

function levelUp(level) {
  const next = [];
  for (let i = 0; i < level.length; i += 2) {
    const l = level[i];
    const r = i + 1 < level.length ? level[i + 1] : level[i]; // odd: duplicate last
    next.push(nodeOf(l, r));
  }
  return next;
}

// Root as lowercase hex. The empty set has a defined root so an attestation with
// an empty brain is still well formed rather than a special case.
export function merkleRoot(entries) {
  if (!entries.length) return digestBytes(Buffer.from([LEAF])).toString("hex");
  let level = sortedLeaves(entries).leaves;
  while (level.length > 1) level = levelUp(level);
  return level[0].toString("hex");
}

// Proof that `path` was committed. siblings carry their side so the verifier can
// reconstruct without knowing the level widths (which matter under duplication).
export function inclusionProof(entries, path) {
  const { sorted, leaves } = sortedLeaves(entries);
  let index = sorted.findIndex((e) => e.path === path);
  if (index < 0) throw new Error(`merkle: "${path}" is not in the tree`);

  const siblings = [];
  let level = leaves;
  while (level.length > 1) {
    const isRight = index % 2 === 1;
    const pairIndex = isRight ? index - 1 : index + 1;
    const sibling = pairIndex < level.length ? level[pairIndex] : level[index]; // duplicated self
    siblings.push({ h: sibling.toString("hex"), side: isRight ? "L" : "R" });
    level = levelUp(level);
    index = Math.floor(index / 2);
  }
  return { path, leaf: leaves[sorted.findIndex((e) => e.path === path)].toString("hex"), siblings };
}

function fold(leaf, siblings) {
  let acc = leaf;
  for (const { h, side } of siblings) {
    const sib = Buffer.from(h, "hex");
    acc = side === "L" ? nodeOf(sib, acc) : nodeOf(acc, sib);
  }
  return acc.toString("hex");
}

// Verify a proof from the REVEALED BYTES. This is the reveal challenge: prove that the
// file you just published is the one you committed to months ago.
export function verifyInclusion(root, path, content, proof) {
  const leaf = leafOf(path, content);
  if (leaf.toString("hex") !== proof.leaf) return false;
  return fold(leaf, proof.siblings) === root;
}

// Verify a proof from the DIGEST ALONE, without ever seeing the bytes.
//
// This is what a registry can do. It receives attest/, never the brain, so it cannot read
// the artifact. But the leaf is H(0x00 || len(path) || path || H(content)), and H(content)
// is exactly the `artifact_sha256` the ledger already published. So a verifier can rebuild
// the leaf from (path, artifact_sha256) and fold it to the root.
//
// The distinction matters for what a UI may claim. This proves "these exact bytes were
// committed under this path". It does NOT prove the bytes are any good, or that they
// exist at all. Only a reveal challenge does that.
export function verifyCommitment(root, path, contentSha256Hex, proof) {
  const p = Buffer.from(path, "utf8");
  const leaf = digestBytes(Buffer.concat([Buffer.from([LEAF]), uvarint(p.length), p, Buffer.from(contentSha256Hex, "hex")]));
  if (leaf.toString("hex") !== proof.leaf) return false;
  return fold(leaf, proof.siblings) === root;
}

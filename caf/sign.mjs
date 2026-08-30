#!/usr/bin/env node
// Sign an attestation envelope. A SIDECAR, deliberately outside scripts/.
//
//   node caf/sign.mjs <brainDir> [--key <path>]
//
// The signature covers digest(CCJ(envelope without its signature field)). Ed25519 signs
// the 32 message bytes directly, so there is no second hash and no ambiguity about what
// was signed.
//
// The renderer and signer remain separate so Casa never sees a private key.
//
// Zero dependencies (node: builtins only).

import { sign as edSign, verify as edVerify, createPrivateKey, createPublicKey } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { canon } from "../scripts/caf/canon.mjs";
import { digest } from "../scripts/caf/digest.mjs";
import { keyPath, keyPathFor, publicKeyOf } from "./keygen.mjs";

const PREFIX = "ed25519:";

// The signing preimage: the envelope with `signature` removed. Both signer and verifier
// derive it the same way, so a verifier never has to trust the signer's serialization.
export function preimage(envelope) {
  const { signature, ...rest } = envelope;
  return Buffer.from(digest(canon(rest)), "hex");
}

export function signEnvelope(envelope, privatePem) {
  const key = createPrivateKey(privatePem);
  const sig = edSign(null, preimage(envelope), key);
  return { ...envelope, signature: PREFIX + sig.toString("base64url") };
}

export function verifyEnvelope(envelope, pubkeyB64Url) {
  if (typeof envelope.signature !== "string" || !envelope.signature.startsWith(PREFIX)) return false;
  const sig = Buffer.from(envelope.signature.slice(PREFIX.length), "base64url");
  if (sig.length !== 64) return false;
  const key = createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: pubkeyB64Url }, format: "jwk" });
  return edVerify(null, preimage(envelope), key, sig);
}

function identityPubkey(brainDir) {
  const f = join(brainDir, "identity.json");
  if (!existsSync(f)) return null;
  const id = JSON.parse(readFileSync(f, "utf8"));
  return typeof id.company_pubkey === "string" && id.company_pubkey.length ? id.company_pubkey : null;
}

function resolveSigningKey(brainDir, declared) {
  const want = identityPubkey(brainDir) || declared;
  const ring = keyPathFor(want);
  if (existsSync(ring)) return ring;
  const legacy = keyPath();
  if (existsSync(legacy) && publicKeyOf(readFileSync(legacy, "utf8")) === want) return legacy;
  return ring;
}

export function signBrain(brainDir, { key } = {}) {
  const envPath = join(brainDir, "attest", "attestation.json");
  if (!existsSync(envPath)) throw new Error(`no attest/attestation.json in ${brainDir} (run: node scripts/brain.mjs attest ${brainDir})`);

  const envelope = JSON.parse(readFileSync(envPath, "utf8"));

  // Signing must NOT touch the envelope. chain.jsonl already recorded the hash of the
  // signing preimage; mutating `subject` here would silently fork the chain from its own
  // recorded tip. If the subject names no key, the envelope was rendered too early.
  const declared = envelope.subject.company_pubkey;
  if (!declared) {
    throw new Error(`this envelope names no company_pubkey. Run: node caf/keygen.mjs ${brainDir}, then re-render with brain.mjs attest.`);
  }

  const keyFile = key || resolveSigningKey(brainDir, declared);
  if (!existsSync(keyFile)) throw new Error(`no signing key at ${keyFile} (run: node caf/keygen.mjs ${brainDir})`);

  const pem = readFileSync(keyFile, "utf8");
  const pubkey = publicKeyOf(pem);
  if (declared !== pubkey) {
    throw new Error("this key does not match identity.json company_pubkey. A company's key is its identity; signing with another forks its chain.");
  }

  const signed = signEnvelope(envelope, pem);
  writeFileSync(envPath, canon(signed) + "\n");
  return { pubkey, signature: signed.signature, envelope: signed };
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let key;
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--key") { key = args[++i]; continue; }
    rest.push(args[i]);
  }
  const dir = rest[0];
  if (!dir) { console.error("usage: sign.mjs <brainDir> [--key <path>]"); process.exit(2); }
  try {
    const r = signBrain(dir, key ? { key } : {});
    console.log(`signed attestation ${r.envelope.sequence} as ${r.pubkey}`);
    console.log(`  ${r.signature.slice(0, 32)}...`);
    console.log(`  verify with: node caf/check.mjs ${dir}`);
  } catch (e) { console.error(e.message); process.exit(2); }
}

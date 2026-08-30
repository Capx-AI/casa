#!/usr/bin/env node
// Generate the company signing key. A SIDECAR, deliberately outside scripts/.
//
// Casa renders an attestation. Casa does not sign it, because signing needs a private
// key and Casa holds no keys, no wallet, and no credentials (directive 8). This tool is
// what the founder runs, and nothing under scripts/ may import it. `check-plugin.mjs`
// enforces that.
//
//   node caf/keygen.mjs [<brainDir>] [--force]
//
// The private key lives at ~/.capx/keys/<company_pubkey>.key, mode 0600 (directory
// ~/.capx/keys is 0700). Honors CAPX_HOME. Only the PUBLIC half is ever written into
// the brain, so a leaked brain leaks no signing authority. A legacy ~/.capx/company.key
// is adopted once into the keyring for a pubkey-less brain; after that, each brain
// gets its own key.
//
// Zero dependencies (node: builtins only).

import { generateKeyPairSync, createPublicKey } from "node:crypto";
import { writeFileSync, readFileSync, existsSync, mkdirSync, chmodSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolved lazily, not captured at import: tests redirect it, and a captured constant
// would silently write a real key into the developer's home directory.
export const keyDir = () => join(process.env.CAPX_HOME || homedir(), ".capx");
export const keyPath = () => join(keyDir(), "company.key");

function sanitizePubkey(pubkey) {
  return String(pubkey).replace(/[/\\]/g, "_");
}

export function keyPathFor(pubkey) {
  return join(keyDir(), "keys", `${sanitizePubkey(pubkey)}.key`);
}

// The raw 32-byte Ed25519 public key, base64url. JWK's `x` is exactly that, and it
// avoids pulling in a base58 dependency for a repo that has none.
export function publicKeyOf(privatePem) {
  return createPublicKey(privatePem).export({ format: "jwk" }).x;
}

function ensurePrivateDir(dir) {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  chmodSync(dir, 0o700);
}

function ensureKeysDir() {
  ensurePrivateDir(keyDir());
  ensurePrivateDir(join(keyDir(), "keys"));
}

function writePrivateKey(path, pem) {
  writeFileSync(path, pem, { mode: 0o600 });
  chmodSync(path, 0o600);
}

function generatePem() {
  const { privateKey } = generateKeyPairSync("ed25519");
  return privateKey.export({ type: "pkcs8", format: "pem" });
}

function readIdentity(brainDir) {
  const f = join(brainDir, "identity.json");
  if (!existsSync(f)) throw new Error(`no identity.json in ${brainDir} (run brain.mjs init)`);
  return JSON.parse(readFileSync(f, "utf8"));
}

function identityPubkey(id) {
  return typeof id.company_pubkey === "string" && id.company_pubkey.length ? id.company_pubkey : null;
}

function adoptableLegacy() {
  const legacy = keyPath();
  if (!existsSync(legacy)) return null;
  const pem = readFileSync(legacy, "utf8");
  const pubkey = publicKeyOf(pem);
  if (existsSync(keyPathFor(pubkey))) return null;
  return { pem, pubkey };
}

function installKey(pem, { writeLegacy }) {
  const pubkey = publicKeyOf(pem);
  const path = keyPathFor(pubkey);
  ensureKeysDir();
  writePrivateKey(path, pem);
  if (writeLegacy) writePrivateKey(keyPath(), pem);
  return { path, pubkey };
}

export function keygen({ force = false, brainDir } = {}) {
  const existingPub = brainDir ? identityPubkey(readIdentity(brainDir)) : null;

  if (brainDir && existingPub && force) {
    throw new Error("identity.json already carries a different company_pubkey. A company's key is its identity; rotating it starts a new chain.");
  }

  let result = null;

  if (brainDir && existingPub) {
    const ring = keyPathFor(existingPub);
    if (existsSync(ring)) {
      const pem = readFileSync(ring, "utf8");
      const pubkey = publicKeyOf(pem);
      if (pubkey !== existingPub) {
        throw new Error("this key does not match identity.json company_pubkey. A company's key is its identity; rotating it starts a new chain.");
      }
      result = { path: ring, pubkey, created: false };
    } else {
      const legacy = keyPath();
      if (existsSync(legacy) && publicKeyOf(readFileSync(legacy, "utf8")) === existingPub) {
        const installed = installKey(readFileSync(legacy, "utf8"), { writeLegacy: false });
        result = { ...installed, created: false };
      } else {
        throw new Error(`no signing key at ${ring} (run: node caf/keygen.mjs ${brainDir})`);
      }
    }
  } else if (brainDir && !force) {
    const adopted = adoptableLegacy();
    if (adopted) result = { ...installKey(adopted.pem, { writeLegacy: false }), created: false };
  } else if (!brainDir && !force && existsSync(keyPath())) {
    const pem = readFileSync(keyPath(), "utf8");
    const pubkey = publicKeyOf(pem);
    const path = keyPathFor(pubkey);
    if (!existsSync(path)) {
      ensureKeysDir();
      writePrivateKey(path, pem);
    }
    result = { path, pubkey, created: false };
  }

  if (!result) {
    const writeLegacy = !brainDir || !existsSync(keyPath());
    result = { ...installKey(generatePem(), { writeLegacy }), created: true };
  }

  if (brainDir) bind(brainDir, result.pubkey);
  return result;
}

// Record only the public half in the brain. brain.mjs stays the sole writer of every
// other file; identity.json's pubkey is the one field this sidecar owns.
export function bind(brainDir, pubkey) {
  const f = join(brainDir, "identity.json");
  if (!existsSync(f)) throw new Error(`no identity.json in ${brainDir} (run brain.mjs init)`);
  const id = JSON.parse(readFileSync(f, "utf8"));
  if (id.company_pubkey && id.company_pubkey !== pubkey) {
    throw new Error("identity.json already carries a different company_pubkey. A company's key is its identity; rotating it starts a new chain.");
  }
  id.company_pubkey = pubkey;
  writeFileSync(f, JSON.stringify(id, null, 2) + "\n");
  return id;
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const brainDir = args.find((a) => a !== "--force");
  const r = keygen({ force, brainDir });
  console.log(`${r.created ? "generated" : "using existing"} key at ${r.path} (mode 0600)`);
  console.log(`company_pubkey: ${r.pubkey}`);
  if (brainDir) console.log(`bound into ${join(brainDir, "identity.json")}`);
  else console.log("pass a brainDir to record the public half in identity.json");
}

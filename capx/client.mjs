// Shared Casa HTTP + key helpers for capx/ CLIs.
// Zero npm deps. Nothing under scripts/ may import this file.

import { createPrivateKey, createPublicKey, sign as edSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { canon } from "../scripts/caf/canon.mjs";
import { digest } from "../scripts/caf/digest.mjs";
import * as keygen from "../caf/keygen.mjs";

export const DEFAULT_API = "https://casa.capx.ai";

export const REQUIRED_ATTEST_FILES = [
  "attestation.json",
  "claims.json",
  "ledger.delta.jsonl",
  "merkle.json",
  "chain.jsonl",
];
export const OPTIONAL_ATTEST_FILES = ["receipts.window.jsonl", "profile.json"];

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else args[key] = true;
    } else args._.push(a);
  }
  return args;
}

export function die(msg) {
  console.error(msg);
  process.exit(2);
}

// --api wins, then CASA_API (local compose override), then production.
export function apiBase(args = {}) {
  if (typeof args.api === "string" && args.api.length) return args.api.replace(/\/$/, "");
  const env = process.env.CASA_API;
  if (typeof env === "string" && env.length) return env.replace(/\/$/, "");
  return DEFAULT_API;
}

export function readIdentity(brainDir) {
  const f = join(brainDir, "identity.json");
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null;
}

function capxKeyDir() {
  if (typeof keygen.keyDir === "function") return keygen.keyDir();
  return join(process.env.CAPX_HOME || homedir(), ".capx");
}

function legacyKeyPath() {
  if (typeof keygen.keyPath === "function") return keygen.keyPath();
  return join(capxKeyDir(), "company.key");
}

// Per-brain keys live at ~/.capx/keys/<pubkey>.key. keygen.mjs may export
// keyPathFor after its rewrite; until then we construct the same path.
export function perBrainKeyPath(pubkey) {
  if (typeof keygen.keyPathFor === "function") return keygen.keyPathFor(pubkey);
  return join(capxKeyDir(), "keys", `${pubkey}.key`);
}

export function pubkeyOf(pem) {
  if (typeof keygen.publicKeyOf === "function") return keygen.publicKeyOf(pem);
  return createPublicKey(pem).export({ format: "jwk" }).x;
}

export function resolveKeyPath({ keyArg, brainDir } = {}) {
  if (typeof keyArg === "string" && keyArg.length) return keyArg;

  const identity = brainDir ? readIdentity(brainDir) : null;
  const pubkey = identity?.company_pubkey || null;
  if (pubkey) {
    const named = perBrainKeyPath(pubkey);
    if (existsSync(named)) return named;
    const constructed = join(capxKeyDir(), "keys", `${pubkey}.key`);
    if (existsSync(constructed)) return constructed;
  }

  const legacy = legacyKeyPath();
  if (existsSync(legacy)) return legacy;

  const hint = pubkey ? perBrainKeyPath(pubkey) : legacy;
  throw new Error(`no signing key at ${hint} (generate one: node caf/keygen.mjs ${brainDir || "<brainDir>"})`);
}

export function loadSigner({ keyArg, brainDir } = {}) {
  const path = resolveKeyPath({ keyArg, brainDir });
  if (!existsSync(path)) {
    throw new Error(`no signing key at ${path} (generate one: node caf/keygen.mjs ${brainDir || "<brainDir>"})`);
  }
  const pem = readFileSync(path, "utf8");
  const privateKey = createPrivateKey(pem);
  const pubkey = pubkeyOf(pem);
  const identity = brainDir ? readIdentity(brainDir) : null;
  if (identity?.company_pubkey && identity.company_pubkey !== pubkey) {
    throw new Error(`the key at ${path} does not match identity.json company_pubkey. A company's key is its identity.`);
  }
  return { path, pem, privateKey, pubkey };
}

export function signValue(privateKey, value) {
  return "ed25519:" + edSign(null, Buffer.from(digest(canon(value)), "hex"), privateKey).toString("base64url");
}

export async function requestJson(base, method, path, body) {
  let res;
  try {
    res = await fetch(`${base}${path}`, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error(`network error talking to ${base}${path}: ${e.message}`);
  }
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

export async function postJson(base, path, body) {
  return requestJson(base, "POST", path, body);
}

export async function putJson(base, path, body) {
  return requestJson(base, "PUT", path, body);
}

export async function companyNonce(base, pubkey) {
  const res = await postJson(base, "/v1/companies/nonce", { company_pubkey: pubkey });
  if (res.status !== 200 || typeof res.json?.nonce !== "string") {
    throw new Error(`nonce request failed (${res.status}): ${JSON.stringify(res.json)}`);
  }
  return res.json.nonce;
}

// Sign { company_pubkey, nonce, purpose, ...fields } and POST the same fields
// plus signature. Purpose is not sent in the JSON body.
export async function signedCompanyPost(base, signer, path, purpose, fields = {}) {
  const nonce = await companyNonce(base, signer.pubkey);
  const signed = {
    company_pubkey: signer.pubkey,
    nonce,
    purpose,
    ...fields,
  };
  const body = {
    company_pubkey: signer.pubkey,
    nonce,
    signature: signValue(signer.privateKey, signed),
    ...fields,
  };
  return postJson(base, path, body);
}

export function readAttestFiles(attestDir) {
  const files = {};
  for (const name of REQUIRED_ATTEST_FILES) {
    const f = join(attestDir, name);
    if (!existsSync(f)) {
      throw new Error(
        `no ${name} in ${attestDir} (render: node scripts/brain.mjs attest <brainDir>, sign: node caf/sign.mjs <brainDir>)`,
      );
    }
    files[name] = readFileSync(f, "utf8");
  }
  for (const name of OPTIONAL_ATTEST_FILES) {
    const f = join(attestDir, name);
    files[name] = existsSync(f) ? readFileSync(f, "utf8") : "";
  }
  return files;
}

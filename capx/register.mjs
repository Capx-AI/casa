#!/usr/bin/env node
// Casa attest client. Token-side: talks to casa.capx.ai. Lives in capx/ so
// `rm -rf capx/` leaves a working engine. Envelope signing stays in caf/sign.mjs.
//
//   node capx/register.mjs push [--api <url>] [--key <path>] (--brain <dir> | --attest <dir>)
//
// push: POST /v1/attest/nonce then POST /v1/attest/push with an ed25519 signature
//   over digest(CCJ({company_pubkey, nonce})). Required files: attestation.json,
//   claims.json, ledger.delta.jsonl, merkle.json, chain.jsonl. Optional empty
//   strings: receipts.window.jsonl, profile.json.
//
// `register` is a deprecated alias. Bind replaced it.
// --api overrides. CASA_API overrides the default origin when --api is absent.
// Default origin: https://casa.capx.ai
//
// Zero dependencies (node: builtins + this repo's CAF primitives).

import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_API,
  apiBase,
  die,
  loadSigner,
  parseArgs,
  postJson,
  readAttestFiles,
  signValue,
} from "./client.mjs";

const USAGE =
  "usage:\n" +
  "  capx/register.mjs push [--api <url>] [--key <path>] (--brain <dir> | --attest <dir>)\n" +
  `--api defaults to ${DEFAULT_API} (or CASA_API)`;

export async function pushAttest({ api, keyArg, brainDir, attestDir }) {
  const base = apiBase({ api });
  const signer = loadSigner({ keyArg, brainDir });
  const files = readAttestFiles(attestDir);

  const nonceRes = await postJson(base, "/v1/attest/nonce", { company_pubkey: signer.pubkey });
  if (nonceRes.status === 409) {
    die(
      `nonce request failed (409): create the tokenless profile with capx/profile.mjs or bind a token with capx/bind.mjs\n${JSON.stringify(nonceRes.json)}`,
    );
  }
  if (nonceRes.status !== 200 || typeof nonceRes.json?.nonce !== "string") {
    die(`nonce request failed (${nonceRes.status}): ${JSON.stringify(nonceRes.json)}`);
  }
  const nonce = nonceRes.json.nonce;

  const body = {
    company_pubkey: signer.pubkey,
    nonce,
    signature: signValue(signer.privateKey, { company_pubkey: signer.pubkey, nonce }),
    files,
  };

  const res = await postJson(base, "/v1/attest/push", body);
  if (res.status === 201) {
    console.log("observation recorded:");
    console.log(JSON.stringify(res.json.observation ?? res.json, null, 2));
    const t1 = res.json.tier1;
    if (t1 && t1.pass === false) {
      console.log("note: tier 1 FAILED on this push; the observation records it and the badge will not show attested.");
      const checks = Array.isArray(t1.checks) ? t1.checks.filter((x) => !x.pass) : [];
      for (const c of checks) console.log(`  FAIL ${c.name}: ${c.note ?? ""}`);
    }
    if (res.json.tier2 && res.json.tier2.ran === false) {
      console.log(`note: tier 2 not run (${res.json.tier2.record?.reason ?? res.json.tier2.reason ?? "unspecified"}).`);
    }
    return res.json;
  }
  if (res.status === 409) {
    die(`push failed (409): ${JSON.stringify(res.json)}\ncreate the tokenless profile with capx/profile.mjs or bind a token with capx/bind.mjs`);
  }
  die(`push failed (${res.status}): ${JSON.stringify(res.json)}`);
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const command = args._[0];

  if (command === "register") {
    console.error("bind replaced register; use capx/bind.mjs");
    process.exit(2);
  }

  if (command === "sign-challenge") {
    // Unused leftover. Not the bind path. Bind is capx/bind.mjs.
    const nonce = args.nonce;
    const wallet = args.wallet;
    if (typeof nonce !== "string" || !/^[0-9a-fA-F]+$/.test(nonce)) die("sign-challenge needs --nonce <hex>");
    if (typeof wallet !== "string" || wallet.length === 0) die("sign-challenge needs --wallet <address>");
    const brainDir = typeof args.brain === "string" ? args.brain : null;
    const signer = loadSigner({ keyArg: args.key, brainDir });
    console.error(`company_pubkey: ${signer.pubkey}`);
    console.error(`signing digest(CCJ({company_pubkey, nonce, wallet})) for wallet ${wallet}`);
    console.log(signValue(signer.privateKey, { company_pubkey: signer.pubkey, nonce, wallet }));
    return;
  }

  if (command !== "push") die(USAGE);

  const brainDir = typeof args.brain === "string" ? args.brain : null;
  const attestDir =
    typeof args.attest === "string" ? args.attest
      : brainDir ? join(brainDir, "attest")
        : null;
  if (!attestDir) die("push needs --brain <companyBrainDir> or --attest <attestDir>");

  await pushAttest({
    api: args.api,
    keyArg: args.key,
    brainDir,
    attestDir,
  });
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message || e);
    process.exit(2);
  });
}

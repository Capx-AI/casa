#!/usr/bin/env node
// Issue a 10-minute Terminal registration code for this brain.
// Casa decides PUBLISH (first go-public) or CLAIM (already public).
//
//   node capx/terminal-code.mjs --brain company-brain [--api url] [--key path] [--slug s]
//
// POST /v1/companies/nonce { company_pubkey }
// POST /v1/companies/code  { company_pubkey, nonce, signature, slug? }
// signature = ed25519 over digest(CCJ({ company_pubkey, nonce, purpose: "terminal-code" })).
//
// Prints the code on stdout. Does not print the private key.

import { fileURLToPath } from "node:url";
import {
  DEFAULT_API,
  apiBase,
  die,
  loadSigner,
  parseArgs,
  postJson,
  signValue,
} from "./client.mjs";

const USAGE =
  "usage:\n" +
  "  capx/terminal-code.mjs --brain <dir> [--api url] [--key path] [--slug s]\n" +
  `--api defaults to ${DEFAULT_API} (or CASA_API)`;

const PURPOSE = "terminal-code";

export async function issueTerminalCode({ brainDir, api, keyArg, slug }) {
  if (typeof brainDir !== "string" || !brainDir.length) {
    die("terminal-code needs --brain <companyBrainDir>");
  }

  const base = apiBase({ api });
  const signer = loadSigner({ keyArg, brainDir });

  const nonceRes = await postJson(base, "/v1/companies/nonce", {
    company_pubkey: signer.pubkey,
  });
  if (nonceRes.status !== 200 || typeof nonceRes.json?.nonce !== "string") {
    die(`nonce request failed (${nonceRes.status}): ${JSON.stringify(nonceRes.json)}`);
  }
  const nonce = nonceRes.json.nonce;

  const body = {
    company_pubkey: signer.pubkey,
    nonce,
    signature: signValue(signer.privateKey, {
      company_pubkey: signer.pubkey,
      nonce,
      purpose: PURPOSE,
    }),
  };
  if (typeof slug === "string" && slug.length) body.slug = slug;

  const res = await postJson(base, "/v1/companies/code", body);
  if (res.status !== 201) {
    die(`code issue failed (${res.status}): ${JSON.stringify(res.json)}`);
  }

  const code = res.json?.code;
  if (typeof code !== "string" || !code.startsWith("CASA-")) {
    die(`code issue succeeded (${res.status}) but named no code: ${JSON.stringify(res.json)}`);
  }

  console.log(code);
  console.error(`outcome ${res.json.outcome} slug ${res.json.slug} expires ${res.json.expires_at}`);
  return res.json;
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || args.h) die(USAGE);
  await issueTerminalCode({
    brainDir: args.brain,
    api: args.api,
    keyArg: args.key,
    slug: args.slug,
  });
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message || e);
    process.exit(2);
  });
}

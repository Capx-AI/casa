#!/usr/bin/env node
// Redeem a Launchpad paste code against Casa. Bind is the one-time go-public
// consent for this brain. Writes company-brain/capx-bind.json (public metadata,
// not a key) so autopush knows the brain is bound.
//
//   node capx/bind.mjs --code CASA-xxxx-xxxx-xxxx --brain company-brain
//        [--api url] [--key path] [--rebind] [--yes] [--slug s] [--name n]
//
// POST /v1/bind/redeem { code, company_pubkey, signature, rebind?, slug?, name? }
// signature = ed25519 over digest(CCJ({ code, company_pubkey })).
//
// Zero dependencies (node: builtins + this repo's CAF primitives).

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin, stderr } from "node:process";
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
  "  capx/bind.mjs --code CASA-xxxx-xxxx-xxxx --brain <dir> [--api url] [--rebind] [--yes] [--slug s] [--name n]\n" +
  `--api defaults to ${DEFAULT_API} (or CASA_API)`;

const REBIND_WARNING =
  "This consumes the only rebind allowed for this mint and shows a public continuity break.";

async function confirmRebind(args) {
  console.error(REBIND_WARNING);
  if (args.yes) return;
  if (stdin.isTTY) {
    const rl = createInterface({ input: stdin, output: stderr });
    const answer = await rl.question("Type YES to continue: ");
    rl.close();
    if (answer.trim() !== "YES") die("rebind cancelled");
    return;
  }
  die("rebind on a non-interactive stdin needs --yes");
}

export async function redeem({ code, brainDir, api, keyArg, rebind, slug, name }) {
  if (typeof code !== "string" || !code.startsWith("CASA-")) {
    die("bind needs --code CASA-xxxx-xxxx-xxxx");
  }
  if (typeof brainDir !== "string" || !brainDir.length) die("bind needs --brain <companyBrainDir>");

  const base = apiBase({ api });
  const signer = loadSigner({ keyArg, brainDir });
  const body = {
    code,
    company_pubkey: signer.pubkey,
    signature: signValue(signer.privateKey, { code, company_pubkey: signer.pubkey }),
  };
  if (rebind) body.rebind = true;
  if (typeof slug === "string") body.slug = slug;
  if (typeof name === "string") body.name = name;

  const res = await postJson(base, "/v1/bind/redeem", body);
  if (res.status === 409 && res.json?.error === "REBIND_REQUIRED") {
    die(
      "this mint already has a live binding (409 REBIND_REQUIRED). Re-run with --rebind if you intend to consume the only rebind and show a public continuity break.",
    );
  }
  if (res.status !== 201) {
    die(`bind failed (${res.status}): ${JSON.stringify(res.json)}`);
  }

  const mint = res.json?.mint;
  const bound_at = res.json?.binding?.bound_at ?? res.json?.bound_at ?? null;
  if (typeof mint !== "string" || !mint.length) {
    die(`bind succeeded (${res.status}) but the response named no mint: ${JSON.stringify(res.json)}`);
  }

  const receipt = {
    mint,
    company_pubkey: signer.pubkey,
    bound_at,
    api: base,
  };
  writeFileSync(join(brainDir, "capx-bind.json"), JSON.stringify(receipt, null, 2) + "\n");
  console.log(`bound ${mint} as ${signer.pubkey}`);
  console.log(`wrote ${join(brainDir, "capx-bind.json")}`);
  return { receipt, json: res.json };
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args._.length && args._[0] !== "redeem") die(USAGE);
  if (args.rebind) await confirmRebind(args);
  await redeem({
    code: args.code,
    brainDir: args.brain,
    api: args.api,
    keyArg: args.key,
    rebind: Boolean(args.rebind),
    slug: args.slug,
    name: args.name,
  });
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message || e);
    process.exit(2);
  });
}

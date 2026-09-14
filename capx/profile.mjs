#!/usr/bin/env node
// Create or update the private token-optional Casa company record.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_API,
  apiBase,
  die,
  loadSigner,
  parseArgs,
  signedCompanyPost,
} from "./client.mjs";

const PURPOSE = "company-profile";
const USAGE =
  "usage:\n" +
  "  capx/profile.mjs --brain <dir> --logo <https-url> --category <slug> [--slug s] [--name n] [--description d] [--api url] [--key path]\n" +
  "name and description default to profile.json company_name and one_liner\n" +
  `--api defaults to ${DEFAULT_API} (or CASA_API)`;

function brainProfile(brainDir) {
  try {
    return JSON.parse(readFileSync(join(brainDir, "profile.json"), "utf8"));
  } catch (e) {
    throw new Error(`cannot read ${join(brainDir, "profile.json")}: ${e.message}`);
  }
}

export async function upsertCompanyProfile({ brainDir, api, keyArg, slug, name, description, logo, category }) {
  if (typeof brainDir !== "string" || !brainDir) throw new Error("profile needs --brain <companyBrainDir>");
  const local = brainProfile(brainDir);
  const fields = {
    name: typeof name === "string" && name ? name : local.company_name,
    description: typeof description === "string" && description ? description : local.one_liner,
    logo,
    category,
  };
  if (typeof slug === "string" && slug) fields.slug = slug;
  for (const key of ["name", "description", "logo", "category"]) {
    if (typeof fields[key] !== "string" || !fields[key].trim()) throw new Error(`profile needs --${key} or a ${key} default in profile.json`);
    fields[key] = fields[key].trim();
  }

  const base = apiBase({ api });
  const signer = loadSigner({ keyArg, brainDir });
  const res = await signedCompanyPost(base, signer, "/v1/companies/profile", PURPOSE, fields);
  if (res.status !== 200 || typeof res.json?.company_id !== "string") {
    throw new Error(`profile upsert failed (${res.status}): ${JSON.stringify(res.json)}`);
  }
  return res.json;
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || args.h) die(USAGE);
  const result = await upsertCompanyProfile({
    brainDir: args.brain,
    api: args.api,
    keyArg: args.key,
    slug: args.slug,
    name: args.name,
    description: args.description,
    logo: args.logo,
    category: args.category,
  });
  console.log(`company ${result.company_id}`);
  console.log(`slug ${result.slug}`);
  console.log(`visibility ${result.visibility}`);
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message || e);
    process.exit(2);
  });
}

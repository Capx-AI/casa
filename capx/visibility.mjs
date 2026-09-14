#!/usr/bin/env node
// Hide or show a Casa project or one artifact.
//
//   node capx/visibility.mjs site public|private --brain company-brain
//   node capx/visibility.mjs one-pager private --brain company-brain
//   node capx/visibility.mjs project private --brain company-brain
//
// Hide/show of one artifact does not change the others. Does not print the
// private key.

import { fileURLToPath } from "node:url";
import {
  DEFAULT_API,
  apiBase,
  die,
  loadSigner,
  parseArgs,
  signedCompanyPost,
} from "./client.mjs";
import { normalizeArtifactType } from "./site-manifest.mjs";

const USAGE =
  "usage:\n" +
  "  capx/visibility.mjs <site|one-pager|deck|project> <public|private> --brain <dir> [--api url] [--key path]\n" +
  `--api defaults to ${DEFAULT_API} (or CASA_API)`;

const PURPOSE = "company-visibility";
const TARGET_LABEL = {
  site: "site",
  one_pager: "one-pager",
  deck: "deck",
  project: "project",
};

function normalizeTarget(raw) {
  if (raw === "project") return "project";
  return normalizeArtifactType(raw);
}

export async function setVisibility({ target, visibility, brainDir, api, keyArg }) {
  if (typeof brainDir !== "string" || !brainDir.length) {
    throw new Error("visibility needs --brain <companyBrainDir>");
  }
  const normalized = normalizeTarget(target);
  if (!normalized) {
    throw new Error("target must be site, one-pager, deck, or project");
  }
  if (visibility !== "public" && visibility !== "private") {
    throw new Error("visibility must be public or private");
  }
  const base = apiBase({ api });
  const signer = loadSigner({ keyArg, brainDir });
  const res = await signedCompanyPost(base, signer, "/v1/companies/visibility", PURPOSE, {
    target: normalized,
    visibility,
  });
  if (res.status !== 200 || res.json?.visibility !== visibility) {
    throw new Error(`visibility failed (${res.status}): ${JSON.stringify(res.json)}`);
  }
  return res.json;
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || args.h) die(USAGE);
  const target = args._[0];
  const visibility = args._[1];
  if (!target || !visibility) die(USAGE);
  try {
    const result = await setVisibility({
      target,
      visibility,
      brainDir: args.brain,
      api: args.api,
      keyArg: args.key,
    });
    const label = TARGET_LABEL[result.target] || result.target;
    console.log(`${label} ${result.visibility}`);
  } catch (e) {
    console.error(e.message || e);
    process.exit(2);
  }
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message || e);
    process.exit(2);
  });
}

#!/usr/bin/env node
// List and activate immutable Casa artifact versions.
//
//   node capx/artifacts.mjs list --brain company-brain
//   node capx/artifacts.mjs activate site <version> --brain company-brain
//   node capx/artifacts.mjs rollback site <version> --brain company-brain
//
// Repeated activation of the same version is idempotent. Does not print the
// private key. Failed activate leaves the previous active version unchanged.

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
  "  capx/artifacts.mjs list --brain <dir> [--api url] [--key path]\n" +
  "  capx/artifacts.mjs activate <site|one-pager|deck> <version> --brain <dir> [--api url] [--key path]\n" +
  "  capx/artifacts.mjs rollback <site|one-pager|deck> <version> --brain <dir> [--api url] [--key path]\n" +
  `--api defaults to ${DEFAULT_API} (or CASA_API)`;

const PURPOSE_LIST = "artifact-list";
const PURPOSE_ACTIVATE = "artifact-activate";
const TYPE_LABEL = { site: "site", one_pager: "one-pager", deck: "deck" };

function requireBrain(brainDir) {
  if (typeof brainDir !== "string" || !brainDir.length) {
    die("artifacts needs --brain <companyBrainDir>");
  }
}

function formatList(doc) {
  const lines = [];
  for (const type of ["site", "one_pager", "deck"]) {
    const a = doc.artifacts?.[type] || { visibility: "private", active_version_id: null, versions: [] };
    const label = TYPE_LABEL[type] || type;
    const active = a.active_version_id || "none";
    lines.push(`${label}  ${a.visibility}  active ${active}`);
    for (const v of a.versions || []) {
      const mark = v.version_id === a.active_version_id ? "  active" : "";
      lines.push(`  ${v.version_id}  ${v.created_at}  ${v.file_count} files  ${v.total_bytes} bytes${mark}`);
    }
  }
  return lines.join("\n");
}

export async function listArtifacts({ brainDir, api, keyArg }) {
  requireBrain(brainDir);
  const base = apiBase({ api });
  const signer = loadSigner({ keyArg, brainDir });
  const res = await signedCompanyPost(base, signer, "/v1/companies/artifacts", PURPOSE_LIST);
  if (res.status !== 200 || !res.json?.artifacts) {
    throw new Error(`list failed (${res.status}): ${JSON.stringify(res.json)}`);
  }
  return res.json;
}

export async function activateArtifact({ type, versionId, brainDir, api, keyArg }) {
  requireBrain(brainDir);
  const artifact_type = normalizeArtifactType(type);
  if (!artifact_type) {
    throw new Error("artifact type must be site, one-pager, or deck");
  }
  if (typeof versionId !== "string" || !/^[0-9a-f]{32}$/.test(versionId)) {
    throw new Error("version must be a 32-character hex id");
  }
  const base = apiBase({ api });
  const signer = loadSigner({ keyArg, brainDir });
  const res = await signedCompanyPost(base, signer, "/v1/companies/artifacts/activate", PURPOSE_ACTIVATE, {
    artifact_type,
    version_id: versionId,
  });
  if (res.status !== 200 || res.json?.active_version_id !== versionId) {
    throw new Error(`activate failed (${res.status}): ${JSON.stringify(res.json)}`);
  }
  return res.json;
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || args.h) die(USAGE);
  const cmd = args._[0];
  try {
    if (cmd === "list") {
      const doc = await listArtifacts({
        brainDir: args.brain,
        api: args.api,
        keyArg: args.key,
      });
      console.log(formatList(doc));
      return;
    }
    if (cmd === "activate" || cmd === "rollback") {
      const type = args._[1];
      const versionId = args._[2];
      if (!type || !versionId) die(USAGE);
      const result = await activateArtifact({
        type,
        versionId,
        brainDir: args.brain,
        api: args.api,
        keyArg: args.key,
      });
      const label = TYPE_LABEL[result.artifact_type] || result.artifact_type;
      console.log(`${label} active ${result.active_version_id}`);
      return;
    }
    die(USAGE);
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

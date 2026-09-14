#!/usr/bin/env node
// Publish a local static directory as an immutable Casa artifact version.
//
//   node capx/publish.mjs site --dir ./dist --brain company-brain
//   node capx/publish.mjs one-pager --dir ./one-pager --brain company-brain
//   node capx/publish.mjs deck --dir ./pitch-deck --brain company-brain
//
// Validates locally (traversal, symlinks, secrets, MIME, caps, index.html),
// then signed session -> upload bytes -> finalize -> activate.
// Failed finalize leaves the previous active version unchanged.
// Does not execute user builds. Does not print the private key.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_API,
  apiBase,
  die,
  loadSigner,
  parseArgs,
  postJson,
  putJson,
  signValue,
  signedCompanyPost,
} from "./client.mjs";
import {
  ArtifactError,
  buildManifest,
  collectSiteFiles,
  normalizeArtifactType,
} from "./site-manifest.mjs";

const USAGE =
  "usage:\n" +
  "  capx/publish.mjs <site|one-pager|deck|outputs> --dir <folder> --brain <dir> [--api url] [--key path]\n" +
  "  capx/publish.mjs face --brain <dir> [--api url] [--key path]   (pushes <dir>/face.json, see scripts/face.mjs)\n" +
  "outputs publishes a folder of .md playbook deliverables (served under /outputs/).\n" +
  `--api defaults to ${DEFAULT_API} (or CASA_API)`;

const PURPOSE_SESSION = "artifact-session";
const PURPOSE_FINALIZE = "artifact-finalize";
const PURPOSE_ACTIVATE = "artifact-activate";
const PURPOSE_VISIBILITY = "company-visibility";

async function nonceFor(base, pubkey) {
  const res = await postJson(base, "/v1/companies/nonce", { company_pubkey: pubkey });
  if (res.status !== 200 || typeof res.json?.nonce !== "string") {
    throw new Error(`nonce request failed (${res.status}): ${JSON.stringify(res.json)}`);
  }
  return res.json.nonce;
}

export async function publishArtifact({ type, dir, brainDir, api, keyArg }) {
  const artifact_type = normalizeArtifactType(type);
  if (!artifact_type) {
    throw new ArtifactError("INVALID_FILE", "artifact type must be site, one-pager, deck, or outputs");
  }
  if (typeof dir !== "string" || !dir) {
    throw new ArtifactError("INVALID_PATH", "--dir is required");
  }
  const files = collectSiteFiles(dir, artifact_type);
  const manifest = buildManifest(artifact_type, files);

  if (typeof brainDir !== "string" || !brainDir.length) {
    throw new Error("publish needs --brain <companyBrainDir>");
  }

  const base = apiBase({ api });
  const signer = loadSigner({ keyArg, brainDir });

  const sessionNonce = await nonceFor(base, signer.pubkey);
  const sessionBody = {
    company_pubkey: signer.pubkey,
    nonce: sessionNonce,
    signature: signValue(signer.privateKey, {
      company_pubkey: signer.pubkey,
      nonce: sessionNonce,
      purpose: PURPOSE_SESSION,
      artifact_type,
      file_count: manifest.file_count,
      total_bytes: manifest.total_bytes,
    }),
    artifact_type,
    file_count: manifest.file_count,
    total_bytes: manifest.total_bytes,
  };
  const sessionRes = await postJson(base, "/v1/companies/artifacts/sessions", sessionBody);
  if (sessionRes.status !== 201 || typeof sessionRes.json?.session_id !== "string") {
    throw new Error(`session failed (${sessionRes.status}): ${JSON.stringify(sessionRes.json)}`);
  }
  const session_id = sessionRes.json.session_id;

  for (const f of files) {
    const put = await putJson(base, `/v1/companies/artifacts/sessions/${session_id}/files`, {
      path: f.path,
      content_base64: f.body.toString("base64"),
      sha256: f.sha256,
      content_type: f.content_type,
    });
    if (put.status !== 200) {
      throw new Error(`upload failed for ${f.path} (${put.status}): ${JSON.stringify(put.json)}`);
    }
  }

  const finNonce = await nonceFor(base, signer.pubkey);
  const finRes = await postJson(base, `/v1/companies/artifacts/sessions/${session_id}/finalize`, {
    company_pubkey: signer.pubkey,
    nonce: finNonce,
    signature: signValue(signer.privateKey, {
      company_pubkey: signer.pubkey,
      nonce: finNonce,
      purpose: PURPOSE_FINALIZE,
      session_id,
      manifest,
    }),
    session_id,
    manifest,
  });
  if (finRes.status !== 201 || typeof finRes.json?.version_id !== "string") {
    throw new Error(`finalize failed (${finRes.status}): ${JSON.stringify(finRes.json)}`);
  }
  const version_id = finRes.json.version_id;

  const actNonce = await nonceFor(base, signer.pubkey);
  const actRes = await postJson(base, "/v1/companies/artifacts/activate", {
    company_pubkey: signer.pubkey,
    nonce: actNonce,
    signature: signValue(signer.privateKey, {
      company_pubkey: signer.pubkey,
      nonce: actNonce,
      purpose: PURPOSE_ACTIVATE,
      artifact_type,
      version_id,
    }),
    artifact_type,
    version_id,
  });
  if (actRes.status !== 200 || actRes.json?.active_version_id !== version_id) {
    throw new Error(`activate failed (${actRes.status}): ${JSON.stringify(actRes.json)}`);
  }

  const visNonce = await nonceFor(base, signer.pubkey);
  const visRes = await postJson(base, "/v1/companies/visibility", {
    company_pubkey: signer.pubkey,
    nonce: visNonce,
    signature: signValue(signer.privateKey, {
      company_pubkey: signer.pubkey,
      nonce: visNonce,
      purpose: PURPOSE_VISIBILITY,
      target: artifact_type,
      visibility: "public",
    }),
    target: artifact_type,
    visibility: "public",
  });
  if (visRes.status !== 200) {
    throw new Error(`visibility failed (${visRes.status}): ${JSON.stringify(visRes.json)}`);
  }

  return {
    artifact_type,
    version_id,
    manifest_sha256: finRes.json.manifest_sha256,
    active_version_id: version_id,
    file_count: manifest.file_count,
    total_bytes: manifest.total_bytes,
  };
}

/** Publish the company face manifest built by scripts/face.mjs. The service stores it on the claimed plane. */
export async function publishFace({ brainDir, api, keyArg }) {
  if (typeof brainDir !== "string" || !brainDir) throw new Error("face needs --brain <companyBrainDir>");
  const face = JSON.parse(readFileSync(join(brainDir, "face.json"), "utf8"));
  const res = await signedCompanyPost(apiBase({ api }), loadSigner({ keyArg, brainDir }), "/v1/companies/face", "company-face", { face });
  if (res.status !== 200 || typeof res.json?.slug !== "string") throw new Error(`face publish failed (${res.status}): ${JSON.stringify(res.json)}`);
  return res.json;
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || args.h) die(USAGE);
  const type = args._[0];
  if (type === "face") {
    const r = await publishFace({ brainDir: args.brain, api: args.api, keyArg: args.key }).catch((e) => { console.error(e.message || e); process.exit(2); });
    console.log(`face ${r.slug} ${r.face_updated_at}`);
    return;
  }
  if (!type || args.dir === true) die(USAGE);
  try {
    const result = await publishArtifact({
      type,
      dir: args.dir,
      brainDir: args.brain,
      api: args.api,
      keyArg: args.key,
    });
    console.log(`${result.artifact_type} version ${result.version_id}`);
    console.log(`manifest ${result.manifest_sha256}`);
    console.log(`active ${result.active_version_id}`);
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

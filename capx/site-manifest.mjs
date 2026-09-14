// Shared static-artifact caps and validation for the CLI and Casa service.
// Spec §14.6 / OpenAPI ArtifactSession. Static / JAMstack bytes only.
// Nothing under scripts/ may import this file.

import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { canon } from "../scripts/caf/canon.mjs";
import { digest } from "../scripts/caf/digest.mjs";

export const ARTIFACT_MAX_TOTAL_BYTES = 25 * 1024 * 1024;
export const ARTIFACT_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ARTIFACT_MAX_FILES = 500;
export const ARTIFACT_ENTRY = "index.html";
export const ARTIFACT_PATH_MAX = 240;
export const ARTIFACT_TYPES = ["site", "one_pager", "deck", "outputs"];
export const ARTIFACT_TYPE_ALIASES = {
  site: "site",
  "one-pager": "one_pager",
  one_pager: "one_pager",
  deck: "deck",
  outputs: "outputs",
  output: "outputs",
};

/* outputs is a markdown-only collection (playbook deliverables); it has no
   index.html entry and every file must be .md. */
export function artifactEntryFor(type) {
  return type === "outputs" ? null : ARTIFACT_ENTRY;
}

export function isMarkdownPath(path) {
  return /\.md$/i.test(String(path));
}

// Schema enum. Exact strings only; do not sniff or invent types.
export const ALLOWED_CONTENT_TYPES = Object.freeze([
  "text/html; charset=utf-8",
  "text/css; charset=utf-8",
  "text/javascript; charset=utf-8",
  "application/javascript; charset=utf-8",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "font/woff",
  "font/woff2",
  "font/ttf",
  "font/otf",
  "text/plain; charset=utf-8",
  "application/manifest+json",
]);

const ALLOWED_CONTENT_TYPE_SET = new Set(ALLOWED_CONTENT_TYPES);

const EXT_TO_TYPES = {
  html: ["text/html; charset=utf-8"],
  htm: ["text/html; charset=utf-8"],
  css: ["text/css; charset=utf-8"],
  js: ["text/javascript; charset=utf-8", "application/javascript; charset=utf-8"],
  mjs: ["text/javascript; charset=utf-8", "application/javascript; charset=utf-8"],
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  gif: ["image/gif"],
  webp: ["image/webp"],
  svg: ["image/svg+xml"],
  ico: ["image/x-icon"],
  woff: ["font/woff"],
  woff2: ["font/woff2"],
  ttf: ["font/ttf"],
  otf: ["font/otf"],
  txt: ["text/plain; charset=utf-8"],
  md: ["text/plain; charset=utf-8"],
  webmanifest: ["application/manifest+json"],
};

const EXECUTABLE_EXTS = new Set(["php", "py", "rb", "sh", "exe", "wasm"]);

// Schema path: relative, no leading ./ or /, no .. segments, posix charset.
export const ARTIFACT_PATH_RE = /^(?![./])(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/;

const SECRET_BASENAMES = new Set([
  ".env",
  "id_rsa",
  "id_dsa",
  "id_ecdsa",
  "id_ed25519",
  "mnemonic",
  "wallet.json",
  "credentials",
  "credentials.json",
  "secret",
  "secrets.json",
]);

export class ArtifactError extends Error {
  constructor(code, message, http = 422) {
    super(message);
    this.code = code;
    this.http = http;
    this.name = "ArtifactError";
  }
}

export function normalizeArtifactType(raw) {
  if (typeof raw !== "string") return null;
  return ARTIFACT_TYPE_ALIASES[raw] || null;
}

export function isAllowedContentType(type) {
  return typeof type === "string" && ALLOWED_CONTENT_TYPE_SET.has(type);
}

function lastExtension(path) {
  const base = path.split("/").pop() || "";
  const dot = base.lastIndexOf(".");
  if (dot < 1 || dot === base.length - 1) return "";
  return base.slice(dot + 1).toLowerCase();
}

function basenameOf(path) {
  const parts = String(path).split("/");
  return parts[parts.length - 1] || "";
}

export function isSecretLikeName(path) {
  const segments = String(path).split("/");
  for (const seg of segments) {
    const lower = seg.toLowerCase();
    if (SECRET_BASENAMES.has(lower)) return true;
    if (lower === ".env" || lower.startsWith(".env.")) return true;
    if (lower.endsWith(".pem") || lower.endsWith(".key")) return true;
    if (lower === "id_rsa" || lower.startsWith("id_rsa.")) return true;
    if (lower.includes("mnemonic")) return true;
  }
  return false;
}

export function isExecutableName(path) {
  return EXECUTABLE_EXTS.has(lastExtension(path));
}

export function contentTypesForPath(path) {
  const base = basenameOf(path).toLowerCase();
  if (base === "manifest.json" || base === "manifest.webmanifest") {
    return ["application/manifest+json"];
  }
  const ext = lastExtension(path);
  if (ext === "json") return [];
  return EXT_TO_TYPES[ext] || [];
}

export function contentTypeForPath(path) {
  const types = contentTypesForPath(path);
  return types[0] || null;
}

export function validateArtifactPath(path) {
  if (typeof path !== "string" || !path) {
    return { ok: false, code: "INVALID_PATH", message: "path is required" };
  }
  if (path.includes("\0")) {
    return { ok: false, code: "INVALID_PATH", message: "path contains NUL" };
  }
  if (path.includes("\\")) {
    return { ok: false, code: "INVALID_PATH", message: "path must use posix separators" };
  }
  if (path.length > ARTIFACT_PATH_MAX) {
    return { ok: false, code: "INVALID_PATH", message: "path exceeds 240 characters" };
  }
  if (path.startsWith("/") || /^[a-zA-Z]:/.test(path)) {
    return { ok: false, code: "INVALID_PATH", message: "absolute paths are not allowed" };
  }
  if (isSecretLikeName(path)) {
    return { ok: false, code: "SECRET_FILENAME", message: "secret-like filenames are not allowed" };
  }
  if (path.includes("..") || !ARTIFACT_PATH_RE.test(path)) {
    return { ok: false, code: "INVALID_PATH", message: "path traversal is not allowed" };
  }
  const segments = path.split("/");
  if (segments.some((s) => s === "" || s === "." || s === "..")) {
    return { ok: false, code: "INVALID_PATH", message: "path traversal is not allowed" };
  }
  if (segments.some((s) => s.startsWith("."))) {
    return { ok: false, code: "INVALID_PATH", message: "hidden path segments are not allowed" };
  }
  if (isExecutableName(path)) {
    return { ok: false, code: "EXECUTABLE_REJECTED", message: "server executables are not allowed" };
  }
  if (contentTypesForPath(path).length === 0) {
    return { ok: false, code: "UNSUPPORTED_TYPE", message: "file type is not an allowed static asset" };
  }
  return { ok: true };
}

export function validateFileBytes(bytes) {
  if (!Number.isInteger(bytes) || bytes < 1) {
    return { ok: false, code: "INVALID_FILE", message: "file must be at least 1 byte", http: 422 };
  }
  if (bytes > ARTIFACT_MAX_FILE_BYTES) {
    return {
      ok: false,
      code: "PAYLOAD_TOO_LARGE",
      message: `file exceeds the ${ARTIFACT_MAX_FILE_BYTES} byte cap`,
      http: 413,
    };
  }
  return { ok: true };
}

export function validateDeclaredCaps(file_count, total_bytes) {
  if (!Number.isInteger(file_count) || file_count < 1) {
    return { ok: false, code: "INVALID_FILE", message: "file_count must be an integer from 1 to 500", http: 422 };
  }
  if (file_count > ARTIFACT_MAX_FILES) {
    return { ok: false, code: "PAYLOAD_TOO_LARGE", message: `file_count exceeds ${ARTIFACT_MAX_FILES}`, http: 413 };
  }
  if (!Number.isInteger(total_bytes) || total_bytes < 1) {
    return { ok: false, code: "INVALID_FILE", message: "total_bytes must be an integer of at least 1", http: 422 };
  }
  if (total_bytes > ARTIFACT_MAX_TOTAL_BYTES) {
    return {
      ok: false,
      code: "PAYLOAD_TOO_LARGE",
      message: `total_bytes exceeds the ${ARTIFACT_MAX_TOTAL_BYTES} byte cap`,
      http: 413,
    };
  }
  return { ok: true };
}

export function validateContentType(path, content_type) {
  if (!isAllowedContentType(content_type)) {
    return { ok: false, code: "UNSUPPORTED_TYPE", message: "content_type is not an allowed static type" };
  }
  const allowed = contentTypesForPath(path);
  if (!allowed.includes(content_type)) {
    return { ok: false, code: "UNSUPPORTED_TYPE", message: "content_type does not match the file path" };
  }
  return { ok: true };
}

export function hashBytes(buf) {
  return digest(buf);
}

function relPosix(root, full) {
  return relative(root, full).split(sep).join("/");
}

function underRoot(rootReal, fileReal) {
  if (fileReal === rootReal) return true;
  const prefix = rootReal.endsWith(sep) ? rootReal : rootReal + sep;
  return fileReal.startsWith(prefix);
}

export function collectSiteFiles(dir, artifact_type = "site") {
  const type = normalizeArtifactType(artifact_type) || "site";
  if (typeof dir !== "string" || !dir) {
    throw new ArtifactError("INVALID_PATH", "--dir is required");
  }
  let rootStat;
  try {
    rootStat = lstatSync(dir);
  } catch {
    throw new ArtifactError("INVALID_PATH", `publish directory does not exist: ${dir}`);
  }
  if (rootStat.isSymbolicLink()) {
    throw new ArtifactError("SYMLINK", "publish directory must not be a symlink");
  }
  if (!rootStat.isDirectory()) {
    throw new ArtifactError("INVALID_PATH", `--dir must be a directory: ${dir}`);
  }

  const rootReal = realpathSync(dir);
  const files = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    let names;
    try {
      names = readdirSync(current);
    } catch (e) {
      throw new ArtifactError("INVALID_FILE", `cannot read directory: ${e.message}`);
    }
    for (const name of names) {
      const full = join(current, name);
      let st;
      try {
        st = lstatSync(full);
      } catch (e) {
        throw new ArtifactError("INVALID_FILE", `cannot stat ${relPosix(dir, full)}: ${e.message}`);
      }
      if (st.isSymbolicLink()) {
        throw new ArtifactError("SYMLINK", `symlinks are not allowed: ${relPosix(dir, full)}`);
      }
      if (st.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!st.isFile()) {
        throw new ArtifactError("INVALID_FILE", `not a regular file: ${relPosix(dir, full)}`);
      }
      const real = realpathSync(full);
      if (!underRoot(rootReal, real)) {
        throw new ArtifactError("TRAVERSAL", `file escapes the publish directory: ${relPosix(dir, full)}`);
      }
      const path = relPosix(dir, full);
      const pathCheck = validateArtifactPath(path);
      if (!pathCheck.ok) {
        throw new ArtifactError(pathCheck.code, `${pathCheck.message}: ${path}`);
      }
      const bytes = st.size;
      const sizeCheck = validateFileBytes(bytes);
      if (!sizeCheck.ok) {
        throw new ArtifactError(sizeCheck.code, `${sizeCheck.message}: ${path}`, sizeCheck.http || 422);
      }
      const buf = readFileSync(full);
      if (buf.length !== bytes) {
        throw new ArtifactError("INVALID_FILE", `could not read complete file: ${path}`);
      }
      const content_type = contentTypeForPath(path);
      files.push({
        path,
        bytes: buf.length,
        sha256: hashBytes(buf),
        content_type,
        body: buf,
      });
    }
  }

  if (files.length > ARTIFACT_MAX_FILES) {
    throw new ArtifactError("PAYLOAD_TOO_LARGE", `file_count exceeds ${ARTIFACT_MAX_FILES}`, 413);
  }
  const total = files.reduce((n, f) => n + f.bytes, 0);
  if (total > ARTIFACT_MAX_TOTAL_BYTES) {
    throw new ArtifactError("PAYLOAD_TOO_LARGE", `total bytes exceed ${ARTIFACT_MAX_TOTAL_BYTES}`, 413);
  }
  if (type === "outputs") {
    if (files.length < 1) {
      throw new ArtifactError("MISSING_ENTRY", "at least one .md file is required");
    }
    const nonMd = files.find((f) => !isMarkdownPath(f.path));
    if (nonMd) {
      throw new ArtifactError("UNSUPPORTED_TYPE", `outputs may contain only .md files: ${nonMd.path}`);
    }
    return files;
  }
  if (!files.some((f) => f.path === ARTIFACT_ENTRY)) {
    throw new ArtifactError("MISSING_ENTRY", `${ARTIFACT_ENTRY} is required`);
  }
  if (files.length < 1) {
    throw new ArtifactError("MISSING_ENTRY", `${ARTIFACT_ENTRY} is required`);
  }
  return files;
}

export function manifestBodyOf(artifact_type, files) {
  const sorted = [...files].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return {
    artifact_type,
    entry: artifactEntryFor(artifact_type),
    files: sorted.map((f) => ({
      path: f.path,
      sha256: f.sha256,
      bytes: f.bytes,
      content_type: f.content_type,
    })),
    file_count: sorted.length,
    total_bytes: sorted.reduce((n, f) => n + f.bytes, 0),
  };
}

export function manifestSha256Of(manifest) {
  if (!manifest || typeof manifest !== "object") {
    throw new ArtifactError("MANIFEST_INVALID", "manifest is required");
  }
  const { manifest_sha256: _drop, ...rest } = manifest;
  return digest(canon(rest));
}

export function buildManifest(artifact_type, files) {
  const type = normalizeArtifactType(artifact_type);
  if (!type) throw new ArtifactError("INVALID_FILE", "artifact_type must be site, one_pager, deck, or outputs");
  const body = manifestBodyOf(type, files);
  return { ...body, manifest_sha256: digest(canon(body)) };
}

export function assertCompleteManifest(manifest, uploaded) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new ArtifactError("MANIFEST_INVALID", "manifest must be an object");
  }
  const type = normalizeArtifactType(manifest.artifact_type);
  if (!type) throw new ArtifactError("MANIFEST_INVALID", "artifact_type must be site, one_pager, deck, or outputs");
  if (manifest.entry !== artifactEntryFor(type)) {
    throw new ArtifactError("MISSING_ENTRY", type === "outputs"
      ? "outputs manifests carry a null entry"
      : `${ARTIFACT_ENTRY} is required`);
  }
  if (!Array.isArray(manifest.files)) {
    throw new ArtifactError("MANIFEST_INVALID", "manifest.files must be an array");
  }
  const caps = validateDeclaredCaps(manifest.file_count, manifest.total_bytes);
  if (!caps.ok) throw new ArtifactError(caps.code, caps.message, caps.http || 422);
  if (manifest.file_count !== manifest.files.length) {
    throw new ArtifactError("MANIFEST_INVALID", "file_count does not match files.length");
  }
  const seen = new Set();
  let sum = 0;
  const uploadedMap = uploaded && typeof uploaded === "object" ? uploaded : {};
  for (const f of manifest.files) {
    if (!f || typeof f !== "object") {
      throw new ArtifactError("MANIFEST_INVALID", "manifest file entries must be objects");
    }
    const pathCheck = validateArtifactPath(f.path);
    if (!pathCheck.ok) throw new ArtifactError(pathCheck.code, `${pathCheck.message}: ${f.path}`);
    if (seen.has(f.path)) {
      throw new ArtifactError("MANIFEST_INVALID", `duplicate path in manifest: ${f.path}`);
    }
    seen.add(f.path);
    const sizeCheck = validateFileBytes(f.bytes);
    if (!sizeCheck.ok) throw new ArtifactError(sizeCheck.code, `${sizeCheck.message}: ${f.path}`, sizeCheck.http || 422);
    const typeCheck = validateContentType(f.path, f.content_type);
    if (!typeCheck.ok) throw new ArtifactError(typeCheck.code, `${typeCheck.message}: ${f.path}`);
    if (typeof f.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(f.sha256)) {
      throw new ArtifactError("MANIFEST_INVALID", `sha256 must be 64 lowercase hex: ${f.path}`);
    }
    const got = uploadedMap[f.path];
    if (!got) {
      throw new ArtifactError("PARTIAL_MANIFEST", `manifest lists a file that was not uploaded: ${f.path}`);
    }
    if (got.sha256 !== f.sha256 || got.bytes !== f.bytes || got.content_type !== f.content_type) {
      throw new ArtifactError("HASH_MISMATCH", `uploaded file does not match the manifest: ${f.path}`);
    }
    sum += f.bytes;
  }
  if (sum !== manifest.total_bytes) {
    throw new ArtifactError("MANIFEST_INVALID", "total_bytes does not match the sum of file sizes");
  }
  if (type === "outputs") {
    for (const p of seen) {
      if (!isMarkdownPath(p)) {
        throw new ArtifactError("UNSUPPORTED_TYPE", `outputs may contain only .md files: ${p}`);
      }
    }
  } else if (!seen.has(ARTIFACT_ENTRY)) {
    throw new ArtifactError("MISSING_ENTRY", `${ARTIFACT_ENTRY} is required`);
  }
  const uploadedPaths = Object.keys(uploadedMap);
  if (uploadedPaths.length !== manifest.files.length) {
    throw new ArtifactError("PARTIAL_MANIFEST", "uploaded files do not match the manifest");
  }
  for (const p of uploadedPaths) {
    if (!seen.has(p)) {
      throw new ArtifactError("PARTIAL_MANIFEST", `uploaded file is missing from the manifest: ${p}`);
    }
  }
  const allowedKeys = new Set(["artifact_type", "entry", "files", "file_count", "total_bytes", "manifest_sha256"]);
  for (const k of Object.keys(manifest)) {
    if (!allowedKeys.has(k)) {
      throw new ArtifactError("MANIFEST_INVALID", `unexpected manifest field: ${k}`);
    }
  }
  const { manifest_sha256, ...rest } = manifest;
  const expectedSha = digest(canon(rest));
  if (typeof manifest_sha256 !== "string" || manifest_sha256 !== expectedSha) {
    throw new ArtifactError("HASH_MISMATCH", "manifest_sha256 does not match the canonical manifest");
  }
  return { type, sha256: expectedSha, file_count: manifest.file_count, total_bytes: manifest.total_bytes };
}

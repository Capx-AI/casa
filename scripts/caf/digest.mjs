// SHA-256 helpers. The only hash CAF uses.
//
// digest()      -> lowercase hex of arbitrary bytes or a UTF-8 string
// digestJson()  -> digest of the Canonical CAF JSON of a value
// digestFile()  -> digest of a file's bytes, or null when it does not exist
//
// Zero dependencies (node: builtins only).

import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { canon } from "./canon.mjs";

const toBytes = (b) => (typeof b === "string" ? Buffer.from(b, "utf8") : b);

export function digest(bytes) {
  return createHash("sha256").update(toBytes(bytes)).digest("hex");
}

// Raw digest as bytes, for Merkle internals where rehashing hex would be wrong.
export function digestBytes(bytes) {
  return createHash("sha256").update(toBytes(bytes)).digest();
}

export function digestJson(value) {
  return digest(canon(value));
}

// Returns null (not a throw) for a missing file: a ledger event may reference an
// artifact the founder deleted, and that is a fact to record, not a crash.
export function digestFile(path) {
  if (!existsSync(path)) return null;
  return digest(readFileSync(path));
}

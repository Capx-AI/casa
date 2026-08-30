#!/usr/bin/env node
// caf lint: validate an attest/ directory against the published JSON Schemas.
//
//   node caf/lint.mjs <brainDir>
//
// A deliberately small validator over the subset of JSON Schema the CAF schemas use:
// type, required, properties, additionalProperties, enum, pattern, minimum, maximum,
// items. Pulling in ajv would break the repo's zero-dependency runtime guarantee for a
// job that fits in eighty lines.
//
// lint checks SHAPE. `caf/check.mjs` checks TRUTH-preserving structure (digests, chain,
// signature, legality). A file can lint clean and still be a forgery.
//
// Zero dependencies (node: builtins only).

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const schemaDir = join(here, "schema");
const load = (n) => JSON.parse(readFileSync(join(schemaDir, n), "utf8"));

const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : Number.isInteger(v) ? "integer" : typeof v);

export function validate(value, schema, path = "$") {
  const errs = [];
  const types = schema.type ? (Array.isArray(schema.type) ? schema.type : [schema.type]) : null;
  if (types) {
    const t = typeOf(value);
    const ok = types.some((x) => x === t || (x === "number" && t === "integer"));
    if (!ok) { errs.push(`${path}: expected ${types.join("|")}, got ${t}`); return errs; }
  }
  if (schema.enum && !schema.enum.includes(value)) errs.push(`${path}: "${value}" not in [${schema.enum.join(", ")}]`);
  if (schema.pattern && typeof value === "string" && !new RegExp(schema.pattern).test(value)) {
    errs.push(`${path}: "${String(value).slice(0, 24)}" does not match /${schema.pattern}/`);
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) errs.push(`${path}: ${value} < minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errs.push(`${path}: ${value} > maximum ${schema.maximum}`);
  }
  if (typeOf(value) === "object") {
    for (const r of schema.required || []) if (!(r in value)) errs.push(`${path}: missing required "${r}"`);
    for (const [k, v] of Object.entries(value)) {
      const sub = schema.properties?.[k];
      if (sub) errs.push(...validate(v, sub, `${path}.${k}`));
      else if (schema.additionalProperties === false) errs.push(`${path}: unexpected property "${k}"`);
    }
  }
  if (Array.isArray(value) && schema.items) value.forEach((v, i) => errs.push(...validate(v, schema.items, `${path}[${i}]`)));
  return errs;
}

export function lint(brainDir) {
  const A = join(brainDir, "attest");
  if (!existsSync(A)) return [`no attest/ directory in ${brainDir}`];
  const errs = [];

  const env = JSON.parse(readFileSync(join(A, "attestation.json"), "utf8"));
  errs.push(...validate(env, load("attestation.schema.json"), "attestation.json"));

  const claims = JSON.parse(readFileSync(join(A, "claims.json"), "utf8"));
  errs.push(...validate(claims, load("claims.schema.json"), "claims.json"));

  const eventSchema = load("ledger-event.schema.json");
  const lines = readFileSync(join(A, "ledger.delta.jsonl"), "utf8").split("\n").filter((l) => l.trim());
  lines.forEach((l, i) => {
    let e; try { e = JSON.parse(l); } catch { errs.push(`ledger.delta.jsonl:${i + 1}: not valid JSON`); return; }
    errs.push(...validate(e, eventSchema, `ledger.delta.jsonl:${i + 1}`));
    // A cross-field rule no JSON Schema keyword expresses: naming a node makes it a playbook.
    if (e.kind === "playbook" && !e.node_id) errs.push(`ledger.delta.jsonl:${i + 1}: a playbook event needs a node_id`);
    if (e.kind === "task" && e.node_id) errs.push(`ledger.delta.jsonl:${i + 1}: node_id is only meaningful on a playbook event`);
    if (e.artifact && !e.artifact_sha256) errs.push(`ledger.delta.jsonl:${i + 1}: an artifact must be pinned by its digest`);
  });

  for (const f of ["merkle.json", "chain.jsonl"]) {
    if (!existsSync(join(A, f))) errs.push(`attest/${f} is missing`);
  }
  return errs;
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) { console.error(`usage: lint.mjs <brainDir>   (schemas: ${readdirSync(schemaDir).join(", ")})`); process.exit(2); }
  const errs = lint(dir);
  for (const e of errs) console.log(`  ${e}`);
  console.log(errs.length ? `\n${errs.length} schema error(s).` : "\nattest/ conforms to CAF 1.0.0. Shape only; run caf/check.mjs for structure.");
  process.exit(errs.length ? 1 : 0);
}

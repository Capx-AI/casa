#!/usr/bin/env node
// Dev-only codemod. Applies the reviewed catalog tag map (scripts/catalog-tags.json) to
// every playbook's frontmatter: department (required), criticality, and the optional
// existential_at / model_fit lists. Idempotent: it strips any prior copy of each field
// (scalar, flow, or block list) and re-writes a single flow-style line, inserted right
// after the `relevance:` line. Run once after editing catalog-tags.json:
//   node scripts/retag-catalog.mjs            (apply)
//   node scripts/retag-catalog.mjs --check    (report unmapped/missing, write nothing)
// The frontmatter is the source of truth at runtime; this file only seeds it.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
const checkOnly = process.argv.includes("--check");
const tags = JSON.parse(readFileSync(join(here, "catalog-tags.json"), "utf8"));
const byId = new Map(tags.map((t) => [t.id, t]));

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

// Drop any existing representation of `field` from frontmatter lines: a scalar
// (`field: x`), a flow list (`field: [a, b]`), or a block list (`field:` then `  - a`).
function removeField(lines, field) {
  const out = [];
  const re = new RegExp(`^${field}:(.*)$`);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (m) {
      if (m[1].trim() === "") while (i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1])) i++;
      continue;
    }
    out.push(lines[i]);
  }
  return out;
}

const flow = (a) => `[${a.join(", ")}]`;
const files = walk(join(repo, "playbooks"));
let written = 0;
const problems = [];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const fm = text.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fm) { problems.push(`no frontmatter: ${file}`); continue; }
  const id = basename(file).replace(/\.md$/, "").replace(/^\d+-/, "");
  const tag = byId.get(id);
  if (!tag) { problems.push(`no tag for id "${id}"`); continue; }

  let lines = fm[2].split(/\r?\n/);
  for (const f of ["department", "criticality", "existential_at", "model_fit"]) lines = removeField(lines, f);
  const add = [`department: ${tag.department}`, `criticality: ${tag.criticality}`];
  if (tag.existential_at?.length) add.push(`existential_at: ${flow(tag.existential_at)}`);
  if (tag.model_fit?.length) add.push(`model_fit: ${flow(tag.model_fit)}`);
  const relIdx = lines.findIndex((l) => /^relevance:/.test(l));
  if (relIdx >= 0) lines.splice(relIdx + 1, 0, ...add);
  else lines.push(...add);

  const next = text.replace(fm[0], fm[1] + lines.join("\n") + fm[3]);
  if (next !== text && !checkOnly) { writeFileSync(file, next); written++; }
  else if (next !== text) written++;
}

const mappedIds = new Set(files.map((f) => basename(f).replace(/\.md$/, "").replace(/^\d+-/, "")));
for (const t of tags) if (!mappedIds.has(t.id)) problems.push(`tag map has "${t.id}" with no playbook file`);

console.log(`${checkOnly ? "would update" : "updated"} ${written}/${files.length} playbook frontmatters`);
if (problems.length) { console.log(`PROBLEMS (${problems.length}):`); for (const p of problems) console.log(`  - ${p}`); process.exit(1); }

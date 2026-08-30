#!/usr/bin/env node
// Build playbooks/_index.json from every playbook's frontmatter and lint the
// dependency graph. Run: npm run build:index   (or  npm run lint:playbooks  to
// only check, no write). See docs/PLAYBOOK-SCHEMA.md for the contract.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { canon } from "./caf/canon.mjs";
import { digest } from "./caf/digest.mjs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, basename } from "node:path";
import yaml from "js-yaml";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
const pbDir = join(repo, "playbooks");
const checkOnly = process.argv.includes("--check");

const ALLOWED = {
  relevance: ["core", "recommended", "optional", "conditional"],
  effort: ["S", "M", "L", "XL"],
  leverage: ["low", "med", "high", "critical"],
  reversibility: ["easy", "medium", "hard"],
  department: ["Strategy", "Brand", "Product", "Engineering", "Data", "Growth", "Sales", "Finance", "Legal", "Success", "Operations"],
  criticality: ["existential", "core", "growth", "optional"],
};
const STAGES = ["idea", "landing", "building", "launched", "revenue", "scaling"];
const MODEL_FIT = ["recurring", "transactional", "self_serve", "sales_led", "marketplace", "physical_goods", "local"];
const REQUIRED = [
  "id", "title", "level", "summary", "applies_to", "relevance",
  "selection_hint", "depends_on", "soft_after", "produces", "consumes",
  "effort", "leverage", "reversibility", "human_gate", "blocks_revenue",
  "recurring", "typical_milestone", "department", "criticality",
];

// Deterministic criticality SEED (the survival consequence of skipping the play at its
// stage). A hand-authored `criticality` overrides this; the seed is the floor + a drift
// guard. Order matters: existential is the strongest claim.
const CRIT_ORDER = { existential: 3, core: 2, growth: 1, optional: 0 };
function deriveCriticality(fm) {
  const lev = fm.leverage, rel = fm.relevance;
  if (fm.blocks_revenue && rel === "core" && (lev === "critical" || lev === "high")) return "existential";
  if (rel === "core") return "core";
  if (rel === "optional" || rel === "conditional") return "optional";
  return "growth";
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  return yaml.load(m[1]);
}

const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const slugOf = (file) => basename(file).replace(/\.md$/, "").replace(/^\d+-/, "");
const numOf = (file) => parseInt(basename(file).slice(0, 3), 10) || 9999;

const files = walk(pbDir).sort((a, b) => numOf(a) - numOf(b));
const errors = [];
const warnings = [];
const records = [];
const producedBy = new Map(); // artifact -> [ids]
const idToFile = new Map();
const traits = new Map(); // trait -> count

for (const file of files) {
  const rel = relative(repo, file);
  let fm;
  try {
    fm = frontmatter(readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`${rel}: frontmatter YAML parse error: ${e.message}`);
    continue;
  }
  if (!fm) { errors.push(`${rel}: no frontmatter block`); continue; }

  for (const f of REQUIRED) if (!(f in fm)) errors.push(`${rel}: missing field "${f}"`);

  const slug = slugOf(file);
  if (fm.id && fm.id !== slug) errors.push(`${rel}: id "${fm.id}" does not match file slug "${slug}"`);
  if (fm.id && idToFile.has(fm.id)) errors.push(`duplicate id "${fm.id}" in ${rel} and ${idToFile.get(fm.id)}`);
  if (fm.id) idToFile.set(fm.id, rel);

  for (const k of ["relevance", "effort", "leverage", "reversibility", "department", "criticality"]) {
    if (fm[k] != null && !ALLOWED[k].includes(fm[k])) errors.push(`${rel}: ${k}="${fm[k]}" not in ${ALLOWED[k].join("|")}`);
  }
  for (const s of arr(fm.existential_at)) if (!STAGES.includes(s)) errors.push(`${rel}: existential_at "${s}" not a stage (${STAGES.join("|")})`);
  for (const mf of arr(fm.model_fit)) if (!MODEL_FIT.includes(mf)) errors.push(`${rel}: model_fit "${mf}" not in ${MODEL_FIT.join("|")}`);
  if (fm.selection_hint == null || String(fm.selection_hint).trim() === "") errors.push(`${rel}: selection_hint is required`);

  // Criticality: authored value wins; otherwise the deterministic seed. WARN (non-failing)
  // if the author drifts more than one band from the seed, as a catalog-quality guard.
  const critSeed = deriveCriticality(fm);
  const criticality = fm.criticality || critSeed;
  if (fm.criticality && Math.abs(CRIT_ORDER[fm.criticality] - CRIT_ORDER[critSeed]) > 1) {
    warnings.push(`${rel}: criticality "${fm.criticality}" diverges >1 band from seed "${critSeed}"`);
  }

  for (const a of arr(fm.produces)) {
    if (!producedBy.has(a)) producedBy.set(a, []);
    producedBy.get(a).push(fm.id);
  }
  const ap = fm.applies_to || {};
  for (const t of [...arr(ap.requires_traits), ...arr(ap.excluded_traits)]) traits.set(t, (traits.get(t) || 0) + 1);

  records.push({
    id: fm.id, title: fm.title, level: fm.level, file: rel,
    applies_to: { types: arr(ap.types), requires_traits: arr(ap.requires_traits), excluded_traits: arr(ap.excluded_traits) },
    relevance: fm.relevance, selection_hint: fm.selection_hint,
    depends_on: arr(fm.depends_on), soft_after: arr(fm.soft_after),
    produces: arr(fm.produces), consumes: arr(fm.consumes),
    effort: fm.effort, leverage: fm.leverage, reversibility: fm.reversibility,
    human_gate: !!fm.human_gate, blocks_revenue: !!fm.blocks_revenue,
    recurring: !!fm.recurring, typical_milestone: fm.typical_milestone,
    department: fm.department, // authored + REQUIRED + ALLOWED-validated; no heuristic fallback
    criticality, existential_at: arr(fm.existential_at), model_fit: arr(fm.model_fit),
    // Optional gradeable output spec (the dashboard scores a completed deliverable against these).
    deliverable: fm.deliverable || null, rubric: fm.rubric || null,
  });
  // Light validation of the optional deliverable spec, so a malformed one is caught at build time.
  if (fm.deliverable != null) {
    if (typeof fm.deliverable !== "object" || !Array.isArray(fm.deliverable.sections) || !fm.deliverable.sections.length) {
      errors.push(`${rel}: deliverable must be an object with a non-empty sections list`);
    }
    if (fm.deliverable.max_words != null && typeof fm.deliverable.max_words !== "number") {
      errors.push(`${rel}: deliverable.max_words must be a number`);
    }
  }
  if (fm.rubric != null && String(fm.rubric).trim() === "") errors.push(`${rel}: rubric, if present, must be non-empty`);
}

const ids = new Set(records.map((r) => r.id));

// orphan consumes (no producer anywhere)
const orphans = [];
for (const r of records) for (const c of r.consumes) if (!producedBy.has(c)) orphans.push({ id: r.id, file: r.file, consumes: c });

// dangling dependency references
const dangling = [];
for (const r of records) for (const d of [...r.depends_on, ...r.soft_after]) if (!ids.has(d)) dangling.push({ id: r.id, file: r.file, ref: d });

// cycle detection on depends_on (Kahn)
const indeg = new Map([...ids].map((i) => [i, 0]));
const adj = new Map([...ids].map((i) => [i, []]));
for (const r of records) for (const d of r.depends_on) if (ids.has(d)) { adj.get(d).push(r.id); indeg.set(r.id, indeg.get(r.id) + 1); }
const q = [...ids].filter((i) => indeg.get(i) === 0);
let seen = 0;
while (q.length) { const n = q.shift(); seen++; for (const m of adj.get(n)) { indeg.set(m, indeg.get(m) - 1); if (indeg.get(m) === 0) q.push(m); } }
const hasCycle = seen !== ids.size;

// Pin the library. An attestation claims work against a specific catalog version;
// without a content digest a claim made against library v1 can be checked against
// v2 and will either fail spuriously or pass fraudulently.
const indexSha = digest(canon(records));

// write index
if (!checkOnly) {
  const index = { schema: "docs/PLAYBOOK-SCHEMA.md", count: records.length, index_sha256: indexSha, playbooks: records };
  writeFileSync(join(pbDir, "_index.json"), JSON.stringify(index, null, 2) + "\n");
}

// --check: the committed digest must match the catalog on disk, or _index.json is stale.
let staleIndex = false;
if (checkOnly) {
  const committed = JSON.parse(readFileSync(join(pbDir, "_index.json"), "utf8"));
  if (committed.index_sha256 !== indexSha) {
    staleIndex = true;
    errors.push(`_index.json index_sha256 is stale (committed ${committed.index_sha256 || "(none)"}, computed ${indexSha}). Run: npm run build:index`);
  }
}

// report
console.log(`playbooks: ${records.length}`);
console.log(`distinct produced artifacts: ${producedBy.size}`);
console.log(`distinct traits in use: ${traits.size}`);
console.log(`cycle in depends_on: ${hasCycle ? "YES (FAIL)" : "none"}`);
console.log(`index_sha256: ${indexSha}`);
console.log(`orphan consumes (no producer): ${orphans.length}`);
for (const o of orphans) console.log(`  - ${o.id} consumes "${o.consumes}"  (${o.file})`);
console.log(`dangling dep refs: ${dangling.length}`);
for (const d of dangling) console.log(`  - ${d.id} -> "${d.ref}"  (${d.file})`);
if (warnings.length) { console.log(`\nWARNINGS (${warnings.length}):`); for (const w of warnings) console.log(`  - ${w}`); }
if (errors.length) { console.log(`\nERRORS (${errors.length}):`); for (const e of errors) console.log(`  - ${e}`); }
console.log(`\ntrait vocabulary (count): ${[...traits.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}:${n}`).join("  ")}`);

if (!checkOnly) console.log(`\nwrote playbooks/_index.json (${records.length} entries)`);
const fail = errors.length || orphans.length || dangling.length || hasCycle || staleIndex;
if (checkOnly && fail) process.exit(1);

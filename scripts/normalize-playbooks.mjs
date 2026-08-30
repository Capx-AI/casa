#!/usr/bin/env node
// One-shot reconciliation: fix unquoted colon scalars, normalize frontmatter via
// a YAML round-trip, and apply id/artifact aliases so the dependency graph
// connects across batches. Idempotent. Run: node scripts/normalize-playbooks.mjs

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import yaml from "js-yaml";

const here = dirname(fileURLToPath(import.meta.url));
const pbDir = join(dirname(here), "playbooks");

// depends_on / soft_after: shorthand id -> canonical id
const ID_ALIASES = {
  "event-taxonomy": "event-taxonomy-design",
  "analytics-stack": "analytics-stack-setup",
  "market-sizing": "market-sizing-tam-sam-som",
  "jtbd-extraction": "jobs-to-be-done-extraction",
  "case-study-pipeline": "case-study-testimonial-pipeline",
  "email-deliverability": "email-deliverability-setup",
  "cohort-retention": "cohort-retention-analysis",
};
// produces / consumes: artifact -> canonical producer artifact
const ARTIFACT_ALIASES = {
  hosting_deployment: "hosting",
  packaging_tiers: "pricing_tiers",
  case_studies: "case_study",
};
// consumes with no real producer (founder-provided context, not a playbook output)
const ARTIFACT_DROP = new Set(["data_practices", "win_loss_data", "customer_reviews"]);
// applies_to traits: merge clear audience synonyms into the canonical set
const TRAIT_ALIASES = {
  pure_b2c: "b2c",
  b2c_only: "b2c",
  non_technical_b2c_only: "b2c",
  b2b_only: "b2b",
};

const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const uniq = (a) => [...new Set(a)];
const mapId = (a) => uniq(arr(a).map((x) => ID_ALIASES[x] || x));
const mapArt = (a) => uniq(arr(a).map((x) => ARTIFACT_ALIASES[x] || x));

function walk(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    statSync(p).isDirectory() ? out.push(...walk(p)) : n.endsWith(".md") && out.push(p);
  }
  return out;
}

// quote an unquoted scalar value that contains ": " so YAML can load it
function preQuote(fmText) {
  return fmText.replace(/^(summary|title|selection_hint):[ ]+(?!["'])(.*: .*)$/gm,
    (_, k, v) => `${k}: "${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
}

let changed = 0;
for (const file of walk(pbDir)) {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) { console.warn(`skip (no frontmatter): ${file}`); continue; }
  const fm = yaml.load(preQuote(m[1]));
  const body = m[2];

  fm.depends_on = mapId(fm.depends_on);
  fm.soft_after = mapId(fm.soft_after);
  fm.produces = mapArt(fm.produces);
  fm.consumes = mapArt(fm.consumes).filter((x) => !ARTIFACT_DROP.has(x));
  const mapTrait = (a) => uniq(arr(a).map((x) => TRAIT_ALIASES[x] || x));
  if (fm.applies_to && typeof fm.applies_to === "object") {
    fm.applies_to.requires_traits = mapTrait(fm.applies_to.requires_traits);
    fm.applies_to.excluded_traits = mapTrait(fm.applies_to.excluded_traits);
  }

  const dumped = yaml.dump(fm, { lineWidth: -1, noRefs: true, quotingType: '"' });
  const next = `---\n${dumped}---\n${body.startsWith("\n") ? body.slice(1) : body}`;
  if (next !== raw) { writeFileSync(file, next); changed++; }
}
console.log(`normalized ${changed} playbook files`);

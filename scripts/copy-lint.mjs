#!/usr/bin/env node
// Deterministic canon linter for founder-facing copy. The model drafts; THIS
// enforces the hard rules so they never depend on the model remembering them:
// no em-dashes, no emojis, no placeholder/test company names, and a soft warning
// on founder-bro marketing buzzwords. Zero-dependency (node: builtins only).
//
//   node scripts/copy-lint.mjs <file> [--json]
//   node scripts/copy-lint.mjs --text "some copy" [--json]
//
// Exit code is non-zero when any ERROR-severity rule fires. Library export lint()
// is importable for tests and for casa-write / the brand-copy-critic agent.

import { readFileSync } from "node:fs";

// Em dash (U+2014) and horizontal bar (U+2015). En dash (U+2013) is allowed in
// numeric ranges, so it is intentionally NOT flagged.
const EM_DASH = /[—―]/g;
// A pragmatic emoji range: pictographs, symbols, flags, dingbats, plus the
// variation selector and zero-width joiner that compose them.
const EMOJI =
  /[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{2700}-\u{27BF}\u{FE0F}\u{200D}]/gu;
// Founder-bro buzzwords. Soft (warn): tone guidance, not a hard canon rule.
const BUZZWORDS = [
  "supercharge", "streamline", "seamless", "unlock", "empower", "reimagine",
  "all-in-one", "next-generation", "game-changer", "game changer", "revolutionize",
  "cutting-edge", "best-in-class", "world-class", "paradigm shift", "synerg",
];

const lineOf = (text, index) => text.slice(0, index).split("\n").length;
const excerpt = (text, index, len = 24) =>
  text.slice(Math.max(0, index - len), index + len).replace(/\n/g, " ").trim();

function scan(text, re, rule, severity, findings) {
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    findings.push({ rule, severity, index: m.index, line: lineOf(text, m.index), match: m[0], excerpt: excerpt(text, m.index) });
    if (m.index === re.lastIndex) re.lastIndex++; // guard against zero-width matches
  }
}

// opts.placeholders: company names that must never appear in real copy (canon).
// opts.buzzwords: override the default soft list.
export function lint(text, opts = {}) {
  const findings = [];
  scan(text, EM_DASH, "em_dash", "error", findings);
  scan(text, EMOJI, "emoji", "error", findings);

  for (const name of opts.placeholders || []) {
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    scan(text, re, "placeholder_name", "error", findings);
  }

  for (const word of opts.buzzwords || BUZZWORDS) {
    const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    scan(text, re, "buzzword", "warn", findings);
  }

  findings.sort((a, b) => a.index - b.index);
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warn");
  return { ok: errors.length === 0, errors, warnings, findings };
}

export const DEFAULT_BUZZWORDS = BUZZWORDS;

// ---- CLI ----
function main() {
  const argv = process.argv.slice(2);
  const json = argv.includes("--json");
  const textFlag = argv.indexOf("--text");
  let text, label;
  if (textFlag !== -1) { text = argv[textFlag + 1] || ""; label = "(text)"; }
  else {
    const file = argv.find((a) => !a.startsWith("--"));
    if (!file) { console.error("usage: copy-lint.mjs <file> [--json] | --text \"...\" [--json]"); process.exit(2); }
    text = readFileSync(file, "utf8"); label = file;
  }
  const r = lint(text);
  if (json) { console.log(JSON.stringify(r, null, 2)); }
  else {
    if (r.ok && !r.warnings.length) console.log(`copy-lint: clean (${label})`);
    for (const f of r.findings) {
      console.log(`  ${f.severity === "error" ? "ERROR" : "warn "}  ${f.rule}  line ${f.line}: ...${f.excerpt}...`);
    }
    if (!r.ok) console.log(`copy-lint: ${r.errors.length} error(s), ${r.warnings.length} warning(s) in ${label}`);
  }
  process.exit(r.ok ? 0 : 1);
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) main();

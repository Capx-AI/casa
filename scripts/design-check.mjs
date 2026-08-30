#!/usr/bin/env node
// Deterministic design linter. Keeps the LLM out of checks with an algorithmic
// answer: WCAG contrast ratios and design-token drift against the company's
// design-spec.json. The casa-design-reviewer (designers-eye) agent reads this
// output as grounded facts instead of eyeballing CSS. Zero-dependency.
//
//   node scripts/design-check.mjs <brainDir> <targetDir>   -> JSON report to stdout
//
// Library exports contrastRatio() and analyze() are importable for tests.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

// ---- WCAG contrast (pure arithmetic, from the W3C definition) ----
export function hexToRgb(hex) {
  let h = String(hex).trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function relLuminance([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
export function contrastRatio(hexA, hexB) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  if (!a || !b) return null;
  const la = relLuminance(a), lb = relLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

const norm = (hex) => {
  const rgb = hexToRgb(hex);
  return rgb ? "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("") : null;
};
const dist = (a, b) => {
  const x = hexToRgb(a), y = hexToRgb(b);
  if (!x || !y) return Infinity;
  return Math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2);
};

function specColors(spec) {
  const c = spec.color || {};
  const out = [];
  for (const [k, v] of Object.entries(c)) {
    if (typeof v === "string" && v.startsWith("#")) out.push([`color.${k}`, v]);
    else if (v && typeof v === "object") for (const [k2, v2] of Object.entries(v)) if (typeof v2 === "string") out.push([`color.${k}.${k2}`, v2]);
  }
  return out;
}

// sources: [{ path, text }]. Returns the structured report.
export function analyze(spec, sources) {
  const codeHex = new Set();
  const offgrid = [];
  const scale = new Set((spec.spacing?.scale_px || []).concat(spec.radius_px ? [spec.radius_px] : []));

  for (const { path, text } of sources) {
    for (const m of text.matchAll(/#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g)) {
      const n = norm(m[0]);
      if (n) codeHex.add(n);
    }
    for (const m of text.matchAll(/\b(\d+)px\b/g)) {
      const v = Number(m[1]);
      if (!scale.has(v) && v !== 0) offgrid.push({ value_px: v, file: path });
    }
  }

  // token drift: spec colors absent from the code (within a small tolerance)
  const token_drift = [];
  for (const [token, value] of specColors(spec)) {
    const found = [...codeHex].some((h) => dist(h, value) <= 5);
    if (!found) token_drift.push({ token, expected: norm(value), found_in_code: false });
  }

  // contrast: the foreground/background pairs the spec defines
  const contrast_failures = [];
  const pairs = [
    ["surface_foreground on surface", spec.color?.surface_foreground, spec.color?.surface],
    ["brand_foreground on brand", spec.color?.brand_foreground, spec.color?.brand],
  ];
  for (const [name, fg, bg] of pairs) {
    if (!fg || !bg) continue;
    const ratio = contrastRatio(fg, bg);
    if (ratio !== null && ratio < 4.5) contrast_failures.push({ pair: name, ratio, required: 4.5 });
  }

  return { spec_found: true, token_drift, contrast_failures, spacing_offgrid: offgrid };
}

// ---- file walk + CLI ----
const EXTS = new Set([".css", ".scss", ".sass", ".less", ".js", ".jsx", ".ts", ".tsx", ".html", ".vue", ".svelte"]);
const SKIP = new Set(["node_modules", ".git", "dist", "build", ".next"]);
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name))) out.push(p);
  }
  return out;
}

function main() {
  const [brainDir, targetDir] = process.argv.slice(2);
  if (!brainDir || !targetDir) { console.error("usage: design-check.mjs <brainDir> <targetDir>"); process.exit(2); }
  const specPath = join(brainDir, "design", "design-spec.json");
  if (!existsSync(specPath)) { console.log(JSON.stringify({ spec_found: false }, null, 2)); process.exit(0); }
  const spec = JSON.parse(readFileSync(specPath, "utf8"));
  const sources = walk(targetDir).map((p) => ({ path: p, text: readFileSync(p, "utf8") }));
  console.log(JSON.stringify(analyze(spec, sources), null, 2));
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) main();

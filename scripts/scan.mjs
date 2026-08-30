#!/usr/bin/env node
// Deterministic project scanner. Decides whether casa-start is running inside an
// EXISTING project and sweeps for hard signals that map to business type, traits,
// and stage. The project-scanner agent reads these as grounded facts before its
// deep semantic read; casa-start uses is_existing_project to pick the branch.
// Zero-dependency. The company-brain directory is always excluded, so an
// initialized-but-otherwise-empty folder still reads as greenfield.
//
//   node scripts/scan.mjs [dir]   -> JSON report to stdout
//
// Library exports deriveSignals() and scanDir() are importable for tests.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const IGNORE_DIRS = new Set([
  "company-brain", ".git", "node_modules", "dist", "build", ".next", ".turbo",
  ".vercel", "vendor", "__pycache__", ".venv", "target", ".idea", ".vscode",
]);
const NOISE = new Set([".DS_Store", "Thumbs.db"]);
const SENSITIVE_FILE = /(^|\/)(?:\.env(?:\..*)?|.*\.(?:pem|key|p12|pfx)|id_(?:rsa|dsa|ecdsa|ed25519))$/i;
const DEPLOY_FILES = ["Dockerfile", "vercel.json", "netlify.toml", "fly.toml", "render.yaml", "Procfile", "railway.json", "app.yaml"];
const MANIFESTS = ["package.json", "pyproject.toml", "Cargo.toml", "go.mod", "Gemfile", "composer.json", "requirements.txt", "pom.xml"];
const SOURCE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".rb", ".java", ".php", ".svelte", ".vue", ".sol"]);

// Dependency-name patterns -> a signal name (most map 1:1 to a canonical trait;
// the agent decides the final trait/gap mapping).
const DEP_SIGNALS = [
  { re: /stripe|paddle|lemonsqueez|braintree|chargebee/i, signal: "takes_payments" },
  { re: /next-auth|@clerk|@supabase|lucia-auth|passport|firebase|@auth0|better-auth/i, signal: "has_user_accounts" },
  { re: /posthog|mixpanel|@segment|amplitude|@vercel\/analytics|react-ga|gtag/i, signal: "analytics" },
  { re: /resend|@sendgrid|postmark|nodemailer|mailgun|@react-email/i, signal: "sends_email" },
  { re: /@solana|web3|ethers|wagmi|viem|@coral-xyz|anchor/i, type: "crypto" },
  { re: /shopify|@medusajs|swell|saleor|commerce/i, type: "ecommerce" },
];

const base = (rel) => rel.split("/").pop();

function listFiles(dir, prefix = "", out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const name of entries) {
    if (NOISE.has(name)) continue;
    const rel = prefix ? `${prefix}/${name}` : name;
    if (SENSITIVE_FILE.test(rel)) continue;
    let st; try { st = statSync(join(dir, name)); } catch { continue; }
    if (st.isDirectory()) {
      if (!IGNORE_DIRS.has(name)) listFiles(join(dir, name), rel, out);
    } else out.push(rel);
  }
  return out;
}

// Pure. inv = { files: [relPaths], hasGit: bool, packageJson: obj|null }
export function deriveSignals(inv) {
  const signals = new Set();
  let typeHint = null;
  if (inv.hasGit) signals.add("has_repo");
  if (inv.files.some((f) => SOURCE_EXTS.has(extname(f))) || inv.files.some((f) => MANIFESTS.includes(base(f)))) signals.add("builds_software");
  if (inv.files.some((f) => DEPLOY_FILES.includes(base(f)))) signals.add("has_deployed_app");
  if (inv.files.some((f) => base(f) === "index.html")) signals.add("has_website");

  const deps = inv.packageJson ? { ...(inv.packageJson.dependencies || {}), ...(inv.packageJson.devDependencies || {}) } : {};
  const depNames = Object.keys(deps);
  const depStr = depNames.join(" ");
  const deps_matched = [];
  for (const sig of DEP_SIGNALS) {
    if (sig.re.test(depStr)) {
      if (sig.signal) signals.add(sig.signal);
      if (sig.type && !typeHint) typeHint = sig.type;
      for (const d of depNames) if (sig.re.test(d)) deps_matched.push(d);
    }
  }
  if (!typeHint && /\b(next|react|vue|svelte|@angular|astro|remix|nuxt)\b/i.test(depStr)) typeHint = "saas";

  return { type_hint: typeHint, signals: [...signals], deps_matched };
}

export function scanDir(dir) {
  const files = listFiles(dir);
  const hasGit = existsSync(join(dir, ".git"));
  let packageJson = null;
  const pj = join(dir, "package.json");
  if (existsSync(pj)) { try { packageJson = JSON.parse(readFileSync(pj, "utf8")); } catch { /* ignore */ } }

  const signals = deriveSignals({ files, hasGit, packageJson });
  const key_files = files
    .filter((f) => /(^|\/)(README|readme)|(^|\/)CLAUDE\.md$|(^|\/)package\.json$|(^|\/)pyproject\.toml$|(^|\/)Cargo\.toml$|(^|\/)go\.mod$|(^|\/)docs\//.test(f))
    .slice(0, 40);

  return {
    is_existing_project: files.length > 0, // company-brain and noise already excluded
    file_count: files.length,
    has_claude_md: files.some((f) => base(f) === "CLAUDE.md"),
    has_readme: files.some((f) => /^readme/i.test(base(f))),
    key_files,
    signals,
  };
}

function main() {
  console.log(JSON.stringify(scanDir(process.argv[2] || "."), null, 2));
}
if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) main();

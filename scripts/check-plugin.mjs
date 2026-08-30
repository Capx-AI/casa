#!/usr/bin/env node
// Preflight for publishing/installing Capx Casa as a Claude Code plugin.
// Zero dependencies on purpose (node: builtins only) so it runs on a fresh clone
// with no npm install. Validates structure + the runtime zero-dependency
// guarantee. Run: node scripts/check-plugin.mjs   (exits non-zero on failure)

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

const repo = dirname(dirname(fileURLToPath(import.meta.url)));
const fails = [];
const oks = [];
const ok = (m) => oks.push(m);
const fail = (m) => fails.push(m);

function readJSON(p) { return JSON.parse(readFileSync(p, "utf8")); }
function frontmatter(p) {
  const m = readFileSync(p, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : null;
}
function walk(dir, ext) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const f = join(dir, n);
    statSync(f).isDirectory() ? out.push(...walk(f, ext)) : (ext ? n.endsWith(ext) : true) && out.push(f);
  }
  return out;
}

// 1. plugin + marketplace manifests
try {
  const p = readJSON(join(repo, ".claude-plugin", "plugin.json"));
  p.name ? ok(`plugin.json: ${p.name}@${p.version || "git-sha"}`) : fail("plugin.json missing name");
} catch (e) { fail(`plugin.json: ${e.message}`); }
try { readJSON(join(repo, ".claude-plugin", "marketplace.json")); ok("marketplace.json parses"); }
catch (e) { fail(`marketplace.json: ${e.message}`); }

// 2. skills have name + description frontmatter
for (const dir of readdirSync(join(repo, "skills"))) {
  const f = join(repo, "skills", dir, "SKILL.md");
  if (!existsSync(f)) { fail(`skill ${dir}: no SKILL.md`); continue; }
  const fm = frontmatter(f);
  if (fm && /\bname:\s*\S/.test(fm) && /\bdescription:\s*\S/.test(fm)) ok(`skill ${dir}`);
  else fail(`skill ${dir}: frontmatter needs name + description`);
}

// 3. agents have name + description frontmatter
for (const f of walk(join(repo, "agents"), ".md")) {
  const fm = frontmatter(f);
  if (fm && /\bname:\s*\S/.test(fm) && /\bdescription:\s*\S/.test(fm)) ok(`agent ${relative(repo, f)}`);
  else fail(`agent ${relative(repo, f)}: frontmatter needs name + description`);
}

// 4. hooks.json parses + referenced command exists and is executable
try {
  const hooks = readJSON(join(repo, "hooks", "hooks.json"));
  if (Object.hasOwn(hooks.hooks || {}, "SessionEnd")) {
    fail("hooks.json: SessionEnd hooks are forbidden in the offline core");
  } else {
    ok("hooks.json: no SessionEnd hook");
  }
  const cmds = JSON.stringify(hooks).match(/\$\{CLAUDE_PLUGIN_ROOT\}\/[^"]+/g) || [];
  if (!cmds.length) fail("hooks.json: no ${CLAUDE_PLUGIN_ROOT} command found");
  for (const c of cmds) {
    const f = join(repo, c.replace("${CLAUDE_PLUGIN_ROOT}/", ""));
    if (!existsSync(f)) { fail(`hook command missing: ${c}`); continue; }
    (statSync(f).mode & 0o111) ? ok(`hook ${relative(repo, f)} (executable)`) : fail(`hook ${relative(repo, f)} not executable (chmod +x)`);
  }
} catch (e) { fail(`hooks.json: ${e.message}`); }

// 5. playbook catalog parses + count matches files
try {
  const idx = readJSON(join(repo, "playbooks", "_index.json"));
  const files = walk(join(repo, "playbooks"), ".md").length;
  idx.playbooks.length === files ? ok(`_index.json: ${idx.playbooks.length} playbooks == ${files} files`)
    : fail(`_index.json count ${idx.playbooks.length} != ${files} playbook files (run npm run build:index)`);
} catch (e) { fail(`_index.json: ${e.message}`); }

// 6. RUNTIME ZERO-DEPENDENCY GUARANTEE: the scripts a founder's session invokes
//    must import only node: builtins or relative paths (no node_modules).
//    The walk is transitive so an external dependency cannot hide behind a
//    relative import.
const RUNTIME = [
  "router.mjs", "brain.mjs", "stage.mjs", "northstar.mjs", "wave.mjs",
  "scan.mjs", "copy-lint.mjs", "design-check.mjs", "operate.mjs",
  "headless-runner.mjs", "verify.mjs", "briefs.mjs", "check-plugin.mjs",
];
// Returns null for a file we cannot read, so a dangling relative import is reported as a
// broken import rather than crashing the preflight with a stack trace.
const importsOf = (file) => {
  if (!existsSync(file)) return null;
  return [...readFileSync(file, "utf8").matchAll(/^\s*import\s+[^'"]*from\s+["']([^"']+)["']/gm)].map((m) => m[1]);
};

for (const s of RUNTIME) {
  const seen = new Set();
  const bad = [];
  let edges = 0;
  const walk = (file, chain) => {
    if (seen.has(file)) return;
    seen.add(file);
    const specs = importsOf(file);
    if (specs === null) { bad.push(`unresolved import (via ${chain})`); return; }
    for (const spec of specs) {
      edges++;
      if (spec.startsWith("node:")) continue;
      if (!spec.startsWith(".")) { bad.push(`${spec} (via ${chain})`); continue; }
      walk(resolve(dirname(file), spec), `${chain} -> ${spec}`);
    }
  };
  walk(join(repo, "scripts", s), s);
  bad.length
    ? fail(`${s} has external imports (breaks zero-dep): ${bad.join(", ")}`)
    : ok(`${s} zero-dep (${edges} imports across ${seen.size} files, all node:/relative)`);
}

// 6b. OFFLINE CORE GUARANTEE. The public plugin must not contain hosted-service,
//     deployment, or tracker trees, network clients, or background publishing hooks.
//     Integrations belong in separate, explicit opt-in packages.
{
  const roots = ["scripts", "caf", "hooks"];
  const forbiddenPaths = ["capx", "service", "deployments", "tracker"];
  const offenders = [];
  for (const path of forbiddenPaths) {
    if (existsSync(join(repo, path))) offenders.push(`${path}/ exists`);
  }
  const network = [
    /\bfetch\s*\(/,
    /\b(?:http|https|net|tls|dgram)\s*\.\s*(?:request|connect|createConnection)\s*\(/,
    /from\s+["']node:(?:http|https|net|tls|dgram)["']/,
    /\b(?:curl|wget)\b/,
  ];
  for (const root of roots) {
    const abs = join(repo, root);
    if (!existsSync(abs)) continue;
    for (const f of walk(abs)) {
      if (!/\.(mjs|js|sh)$/.test(f)) continue;
      if (relative(repo, f) === "scripts/check-plugin.mjs") continue;
      const src = readFileSync(f, "utf8");
      if (network.some((re) => re.test(src))) offenders.push(relative(repo, f));
    }
  }
  offenders.length
    ? fail(`offline core contains a hosted/operations surface or network client: ${offenders.join(", ")}`)
    : ok(`offline core: no hosted surfaces or network clients (${roots.length} roots scanned)`);
}

// 7. company-brain template has the JSON state files + contract
for (const f of ["CLAUDE.md", "NOW.md", "profile.json", "build-map.json", "loops.json"]) {
  const p = join(repo, "templates", "company-brain", f);
  if (!existsSync(p)) { fail(`template missing ${f}`); continue; }
  if (f.endsWith(".json")) { try { readJSON(p); ok(`template ${f}`); } catch (e) { fail(`template ${f}: ${e.message}`); } }
  else ok(`template ${f}`);
}

// report
console.log(oks.map((m) => `  ok   ${m}`).join("\n"));
if (fails.length) { console.log("\nFAILURES:"); console.log(fails.map((m) => `  FAIL ${m}`).join("\n")); }
console.log(`\n${fails.length ? "FAIL" : "PASS"}: ${oks.length} ok, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);

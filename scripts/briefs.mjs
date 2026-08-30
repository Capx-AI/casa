#!/usr/bin/env node
// Write an approval-required change brief for website / one-pager / deck refreshes.
// Local only. Never publishes, activates, or makes network requests.
//
//   node scripts/briefs.mjs --brain company-brain
//   node scripts/briefs.mjs --brain company-brain --type site --draft
//   node scripts/briefs.mjs --brain company-brain --reason "Offer changed"
//
// Casa may copy a local draft under outputs/artifact-change-brief/drafts/.
// Going live is a separate founder-controlled process outside this plugin.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  lstatSync,
  copyFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const USAGE =
  "usage:\n" +
  "  scripts/briefs.mjs --brain <dir> [--type site|one-pager|deck] [--draft] [--reason text]\n" +
  "Writes an approval-required change brief. Does not publish or activate.";

const OUTPUT_ID = "artifact-change-brief";
const ARTIFACTS = {
  site: {
    type: "site",
    label: "site",
    local: "outputs/phase0-website",
    playbook: "phase0-website",
  },
  one_pager: {
    type: "one_pager",
    label: "one-pager",
    local: "outputs/phase0-one-pager",
    playbook: "phase0-one-pager",
  },
  deck: {
    type: "deck",
    label: "deck",
    local: "outputs/phase0-pitch-deck",
    playbook: "phase0-pitch-deck",
  },
};
const TYPE_ALIASES = {
  site: "site",
  "one-pager": "one_pager",
  one_pager: "one_pager",
  deck: "deck",
};

function die(msg) {
  console.error(msg);
  process.exit(2);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else args[key] = true;
    } else args._.push(a);
  }
  return args;
}

function normalizeType(raw) {
  if (raw == null || raw === true) return null;
  return TYPE_ALIASES[String(raw)] || null;
}

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function localPresent(brainDir, rel) {
  return existsSync(join(brainDir, rel, "index.html"));
}

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    if (name === "." || name === "..") continue;
    if (name.startsWith(".")) continue;
    const from = join(src, name);
    const to = join(dest, name);
    let st;
    try {
      st = lstatSync(from);
    } catch {
      continue;
    }
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) copyTree(from, to);
    else if (st.isFile()) copyFileSync(from, to);
  }
}

function recommendationFor(spec, present, profile, reason) {
  const name = profile.company_name || "the company";
  const offer = profile.one_liner || "the current offer";
  if (!present) {
    return (
      `No local ${spec.label} at ${spec.local}/index.html. Run the ${spec.playbook} play ` +
      `and keep the files local. Do not publish from this brief.`
    );
  }
  const base =
    `Refresh the local ${spec.label} so the name (${name}) and offer (${offer}) match ` +
    `the current profile. Keep the draft local until the founder accepts a publish.`;
  return reason ? `${base} Founder reason: ${reason}` : base;
}

function selectedSpecs(typeArg) {
  if (!typeArg) return [ARTIFACTS.site, ARTIFACTS.one_pager, ARTIFACTS.deck];
  const id = normalizeType(typeArg);
  if (!id) die("type must be site, one-pager, or deck");
  return [ARTIFACTS[id]];
}

export function writeChangeBrief({ brainDir, type, draft = false, reason = "" } = {}) {
  if (typeof brainDir !== "string" || !brainDir.length) {
    throw new Error("briefs needs --brain <companyBrainDir>");
  }
  if (!existsSync(brainDir)) {
    throw new Error(`no company brain at ${brainDir}`);
  }

  const profile = readJson(join(brainDir, "profile.json")) || {};
  const why = typeof reason === "string" && reason !== "true" ? reason.trim() : "";
  const specs = selectedSpecs(type);
  const artifacts = specs.map((spec) => {
    const present = localPresent(brainDir, spec.local);
    return {
      type: spec.type,
      label: spec.label,
      local_path: spec.local,
      present,
      recommendation: recommendationFor(spec, present, profile, why),
    };
  });

  const drafts = [];
  if (draft) {
    for (const spec of specs) {
      const destRel = `outputs/${OUTPUT_ID}/drafts/${spec.label}`;
      const dest = join(brainDir, destRel);
      const src = join(brainDir, spec.local);
      mkdirSync(dest, { recursive: true });
      if (existsSync(src) && lstatSync(src).isDirectory()) {
        copyTree(src, dest);
      } else {
        writeFileSync(
          join(dest, "README.md"),
          [
            `# Local ${spec.label} draft`,
            ``,
            `Draft the refreshed ${spec.label} here as static HTML.`,
            `This folder is local only. It is not live.`,
            `Publishing is outside Casa. Keep this draft local until the founder chooses a deployment path.`,
            ``,
          ].join("\n"),
        );
      }
      drafts.push({ type: spec.type, label: spec.label, path: destRel });
    }
  }

  const outDir = join(brainDir, "outputs", OUTPUT_ID);
  mkdirSync(outDir, { recursive: true });
  mkdirSync(join(brainDir, "decisions"), { recursive: true });

  const nextStep =
    "Review this brief. If you accept it, edit the local draft and choose a deployment path outside Casa. " +
    "This command did not publish, deploy, or activate anything.";

  const doc = {
    kind: "artifact-change-brief",
    status: "approval_required",
    published: false,
    activated: false,
    company_name: profile.company_name || "",
    one_liner: profile.one_liner || "",
    reason: why,
    artifacts,
    drafts,
    next_step: nextStep,
  };

  const md = renderBrief(doc);
  writeFileSync(join(outDir, "brief.json"), JSON.stringify(doc, null, 2) + "\n");
  writeFileSync(join(outDir, "BRIEF.md"), md);
  writeFileSync(join(brainDir, "decisions", "artifact-change-brief.md"), md);

  return {
    ...doc,
    brief_md: join(outDir, "BRIEF.md"),
    brief_json: join(outDir, "brief.json"),
    decision: join(brainDir, "decisions", "artifact-change-brief.md"),
  };
}

function renderBrief(doc) {
  const lines = [
    `# Artifact change brief`,
    ``,
    `Status: approval required`,
    `Published: no`,
    `Activated: no`,
    ``,
    `Company: ${doc.company_name || "(unnamed)"}`,
    `One-liner: ${doc.one_liner || "(none)"}`,
    ``,
    `This brief recommends local refreshes of the website, one-pager, and deck.`,
    `Casa did not publish or activate any version. Going live still requires an`,
    `explicit founder-controlled deployment outside Casa.`,
    ``,
  ];
  if (doc.reason) {
    lines.push(`## Founder reason`, ``, doc.reason, ``);
  }
  for (const a of doc.artifacts) {
    lines.push(
      `## ${a.label}`,
      ``,
      `Local path: company-brain/${a.local_path}/`,
      `Present: ${a.present ? "yes" : "no"}`,
      `Recommendation: ${a.recommendation}`,
      ``,
    );
  }
  if (doc.drafts.length) {
    lines.push(`## Local drafts`, ``);
    for (const d of doc.drafts) {
      lines.push(`- ${d.label}: company-brain/${d.path}/`);
    }
    lines.push(``, `These files are local only. They are not live.`, ``);
  }
  lines.push(
    `## Approval`,
    ``,
    `Do not run publish or activate until the founder accepts this brief.`,
    `${doc.next_step}`,
    ``,
  );
  return lines.join("\n");
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || args.h) die(USAGE);
  if (!args.brain || args.brain === true) die(USAGE);
  try {
    const result = writeChangeBrief({
      brainDir: args.brain,
      type: args.type === true ? undefined : args.type,
      draft: Boolean(args.draft),
      reason: args.reason === true ? "" : args.reason || "",
    });
    console.log(`wrote ${result.brief_md}`);
    console.log(`status ${result.status}`);
    console.log(`published no`);
    console.log(`activated no`);
    for (const d of result.drafts) {
      console.log(`draft ${d.label} ${d.path}`);
    }
  } catch (e) {
    console.error(e.message || e);
    process.exit(2);
  }
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

#!/usr/bin/env node
// Local company face projection. Source files and engine state remain untouched.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, lstatSync, realpathSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { digest } from "./caf/digest.mjs";

const object = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : {};
const array = (v) => Array.isArray(v) ? v : [];
const records = (v) => array(v).filter((x) => x && typeof x === "object" && !Array.isArray(x));
const parse = (s) => { try { return JSON.parse(s); } catch { return null; } };
const diagramType = /^(flowchart|sequenceDiagram|journey|erDiagram|timeline|C4Context)(?:[ \t]+[^\r\n]*)?\r?$/;
const invalid = (message) => { throw Object.assign(new Error(message), { validation: true }); };

export function buildFace(dir) {
  const sources = {}, mermaid = {};
  const root = realpathSync(dir);
  const read = (path) => {
    let bytes;
    try {
      // Symlinks and anything resolving outside the brain are treated as absent: the face never reads beyond company-brain/.
      if (lstatSync(join(dir, path)).isSymbolicLink() || !realpathSync(join(dir, path)).startsWith(root + "/")) return null;
      bytes = readFileSync(join(dir, path));
    } catch { return null; }
    if (path.endsWith(".mmd") && bytes.length > 20 * 1024) invalid(`${path}: diagram exceeds 20 KB`);
    sources[path] = digest(bytes);
    return bytes.toString("utf8");
  };
  const json = (path) => parse(read(path));
  const output = (play, file) => `outputs/phase0-${play}/${file}`;
  function diagrams(path) {
    let entries;
    try { entries = readdirSync(join(dir, path), { withFileTypes: true }); } catch { return; }
    for (const entry of entries.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const rel = `${path}/${entry.name}`;
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) diagrams(rel);
      else if (entry.isFile() && entry.name.endsWith(".mmd")) {
        const source = read(rel);
        if (source === null) continue;
        if (!diagramType.test(source.split("\n", 1)[0])) invalid(`${rel}: unknown diagram type on first line`);
        mermaid[rel] = source;
      }
    }
  }
  const profile = object(json("profile.json")), binding = json("capx-bind.json");
  const completed = new Set(array(object(json("state.json")).completed));
  const events = records((read("ledger.jsonl") || "").split("\n").map(parse));
  const text = (read(output("company-brief", "brief.md")) || "").replace(/\r\n/g, "\n");
  const chunks = text.split(/^## +(.+)$/m), intro = chunks.shift().trim();
  const sections = [];
  for (let i = 0; i < chunks.length; i += 2) sections.push({ title: chunks[i].trim(), body: chunks[i + 1].trim() });
  diagrams("outputs");
  const roadmap = records(json(output("roadmap", "roadmap.json"))).map((r) => {
    const playbooks = array(r.playbooks), count = playbooks.filter((id) => completed.has(id)).length;
    return { id: r.id ?? "", title: r.title ?? "", target: r.target ?? "", playbooks,
      status: count && count === playbooks.length ? "done" : count ? "in_progress" : r.status ?? "planned" };
  });
  const plan = records(json(output("task-plan", "plan.json"))).map((p) => ({
    id: p.id ?? "", title: p.title ?? "", milestone: p.milestone ?? "", playbook: p.playbook ?? null,
    status: p.playbook && completed.has(p.playbook) ? "done" : p.status ?? "todo",
  }));
  const agents = records(json(output("org-chart", "agents.json"))).map((a) => ({
    name: a.name ?? "", department: a.department ?? "", mandate: a.mandate ?? "", playbooks: array(a.playbooks),
    events: events.filter((e) => a.name && e.agent === a.name).slice(-10).map((e) => ({
      ts: e.ts ?? "", task: e.task ?? "", status: e.status ?? "", node_id: e.node_id ?? null,
    })),
  }));
  const face = {
    face_version: 1,
    generated_at: events.at(-1)?.ts ?? null,
    company: { name: profile.company_name ?? "", one_liner: profile.one_liner ?? "",
      category: profile.primary_type ?? "", website: profile.website ?? null, links: object(profile.links) },
    token: binding === null ? null : { mint: object(binding).mint ?? "", symbol: object(binding).symbol ?? object(binding).ticker ?? "" },
    brief: { summary: intro.split(/\n\s*\n/, 1)[0], sections },
    diagrams: Object.fromEntries(Object.entries({ architecture: ["architecture", "architecture.mmd"],
      product_flow: ["product-flow", "flow.mmd"], data_model: ["data-model", "model.mmd"],
      org_chart: ["org-chart", "org.mmd"], token_flow: ["token-flow", "token-flow.mmd"],
    }).map(([key, [play, file]]) => [key, mermaid[output(play, file)] ?? null])),
    roadmap, plan, agents,
    collateral: { site: read(output("website", "index.html")) !== null,
      one_pager: read(output("one-pager", "index.html")) !== null, deck: read(output("pitch-deck", "index.html")) !== null },
    sources,
  };
  const manifest = JSON.stringify(face, null, 2) + "\n";
  if (Buffer.byteLength(manifest) > 512 * 1024) invalid("manifest exceeds 512 KB");
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, dir, ...extra] = process.argv.slice(2);
  if (!["build", "check"].includes(cmd) || !dir || extra.length) {
    console.error("usage: face.mjs build|check <brainDir>"); process.exit(2);
  }
  try {
    const manifest = buildFace(dir);
    if (cmd === "build") { mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, "face.json"), manifest); }
  } catch (e) { console.error(`face: ${e.message.replace(/[\r\n]+/g, " ")}`); process.exit(e.validation ? 1 : 2); }
}

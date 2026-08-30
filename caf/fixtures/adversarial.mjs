#!/usr/bin/env node
// Adversarial fixtures: the forgeries the format is designed to catch.
//
// These ship in the repo, publicly, on purpose. A verification format earns trust by
// publishing the exact attacks it defeats, and every check here is deterministic and
// open source anyway, so a forger learns nothing from reading them that they could not
// learn from reading the router.
//
// Each mutant takes the golden brain and changes ONE thing. `expect` names the violation
// kind that must fire. If a mutant ever stops firing, the checker has regressed.
//
//   node caf/fixtures/adversarial.mjs            # regenerate all mutants
//
// Zero dependencies (node: builtins + relative only).

import { mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { digest } from "../../scripts/caf/digest.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const GOLDEN = join(here, "golden", "supl", "company-brain");
const OUT = join(here, "adversarial");

// The pinned catalog. Declared after `here`: a const referenced before its own
// initializer is a temporal dead zone error, not a hoisted undefined.
const CATALOG = new Map(
  JSON.parse(readFileSync(join(dirname(dirname(here)), "playbooks", "_index.json"), "utf8"))
    .playbooks.map((p) => [p.id, p]),
);

const readLedger = (dir) => readFileSync(join(dir, "ledger.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const writeLedger = (dir, ev) => writeFileSync(join(dir, "ledger.jsonl"), ev.map((e) => JSON.stringify(e)).join("\n") + "\n");
const playbookEvents = (ev) => ev.filter((e) => e.kind === "playbook");

// A forger cannot simply move an event: ts ordering is what the replay sorts by. So each
// mutation adjusts ts too, exactly as a competent forger would.
const MUTANTS = [
  {
    name: "dependency-out-of-order",
    expect: "dependency",
    why: "A node is claimed before the member dependency it declares. The naive forgery.",
    mutate(dir) {
      const ev = readLedger(dir);
      const pbs = playbookEvents(ev);
      // Find a completion that depends on an EARLIER completion AT THE SAME LEVEL, then
      // move it before its dependency. Same level matters: a cross-level swap would trip
      // the level gate first and this mutant would never exercise the dependency check.
      for (let i = pbs.length - 1; i > 0; i--) {
        const b = CATALOG.get(pbs[i].node_id);
        if (!b) continue;
        for (let j = i - 1; j >= 0; j--) {
          const a = CATALOG.get(pbs[j].node_id);
          if (!a || a.level !== b.level) continue;
          if (!(b.depends_on || []).includes(a.id)) continue;
          pbs[i].ts = new Date(Date.parse(pbs[j].ts) - 60_000).toISOString();
          writeLedger(dir, ev);
          return `${b.id} before ${a.id}`;
        }
      }
      throw new Error("no same-level dependency pair found in the golden ledger");
    },
  },
  {
    name: "level-gate-jump",
    expect: "level_gate",
    why: "A level-5 playbook claimed on day one, when the company was at level 0.",
    mutate(dir) {
      const ev = readLedger(dir);
      const pbs = playbookEvents(ev);
      const late = [...pbs].reverse().find((e) => e.node_id);
      late.ts = new Date(Date.parse(pbs[0].ts) - 7_200_000).toISOString();
      writeLedger(dir, ev);
      return late.node_id;
    },
  },
  {
    name: "unknown-node",
    expect: "unknown_node",
    why: "A node_id that is not in the catalog. Invented work.",
    mutate(dir) {
      const ev = readLedger(dir);
      playbookEvents(ev)[5].node_id = "ship-the-whole-company";
      writeLedger(dir, ev);
      return "ship-the-whole-company";
    },
  },
  {
    name: "non-member-node",
    expect: "non_member",
    why: "A real playbook, but one the router never selected for this company's profile.",
    mutate(dir) {
      const ev = readLedger(dir);
      // tiktok-growth is a real catalog playbook that the router does not select for a
      // low-ACV self-serve b2b saas. Claiming it is a plausible-looking lie.
      playbookEvents(ev)[6].node_id = "tiktok-growth";
      writeLedger(dir, ev);
      return "tiktok-growth";
    },
  },
  {
    name: "duplicate-artifact",
    expect: "duplicate_artifact",
    why: "Fifty tasks, one file. The laziest way to manufacture a work history.",
    mutate(dir) {
      const ev = readLedger(dir);
      const pbs = playbookEvents(ev);
      pbs[10].artifact_sha256 = pbs[3].artifact_sha256;
      writeLedger(dir, ev);
      return pbs[10].node_id;
    },
  },
  {
    name: "rubric-drift",
    expect: "rubric_drift",
    why: "The pinned grading contract does not match the catalog. Moving the goalposts.",
    mutate(dir) {
      const ev = readLedger(dir);
      const victim = playbookEvents(ev).find((e) => e.rubric_sha256);
      victim.rubric_sha256 = digest("a rubric that is easier to pass");
      writeLedger(dir, ev);
      return victim.node_id;
    },
  },
  {
    name: "replayed-event",
    expect: "replayed_event",
    why: "The same event id appears twice, padding the work count.",
    mutate(dir) {
      const ev = readLedger(dir);
      const pbs = playbookEvents(ev);
      ev.push({ ...pbs[2], ts: new Date(Date.parse(pbs[2].ts) + 60_000).toISOString() });
      writeLedger(dir, ev);
      return pbs[2].node_id;
    },
  },
  {
    name: "no-node-id-coverage",
    expect: null, // not a violation: it is a COVERAGE collapse, which is the point
    why: "The unfalsifiable attestation. Claim 2,000 done tasks and never say which node, "
       + "so nothing can be graph-checked. Legality reports zero violations and near-zero coverage.",
    mutate(dir) {
      const ev = readLedger(dir);
      for (const e of ev) {
        if (e.kind !== "playbook") continue;
        e.kind = "task";
        delete e.node_id; delete e.rubric_sha256;
      }
      writeLedger(dir, ev);
      return null;
    },
  },
];

export function build({ golden = GOLDEN, out = OUT } = {}) {
  if (!existsSync(golden)) throw new Error("generate a golden fixture before building adversarial fixtures");
  if (existsSync(out)) rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const manifest = [];
  for (const m of MUTANTS) {
    const dir = join(out, m.name, "company-brain");
    mkdirSync(dirname(dir), { recursive: true });
    cpSync(golden, dir, { recursive: true });
    const target = m.mutate(dir);
    manifest.push({ name: m.name, expect: m.expect, target, why: m.why });
  }
  writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const m of build()) console.log(`  ${m.name.padEnd(26)} expect=${String(m.expect).padEnd(20)} ${m.target || ""}`);
  console.log(`\nwrote ${OUT}`);
}

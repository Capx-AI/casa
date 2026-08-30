// The golden fixture. Everything downstream (legality, the emitter, caf check) is
// tested against it, so two properties must hold or the whole chain is untrustworthy:
//   1. it is byte-reproducible from a clean run
//   2. it is a LEGAL traversal, judged by the router's own readiness function

import { after, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, rmSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildMap, gatesLevel } from "../scripts/router.mjs";
import { INDEX } from "./helpers.mjs";
import { generate, PROFILE } from "../caf/fixtures/generate.mjs";

const FIXTURE_ROOT = mkdtempSync(join(tmpdir(), "caf-fixture-suite-"));
const GOLDEN = generate({ out: join(FIXTURE_ROOT, "golden") }).brain;
after(() => rmSync(FIXTURE_ROOT, { recursive: true, force: true }));
const readLedger = (dir) =>
  readFileSync(join(dir, "ledger.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));

test("generated golden fixture is shaped as expected", () => {
  assert.ok(existsSync(GOLDEN));
  const ev = readLedger(GOLDEN);
  const playbooks = ev.filter((e) => e.kind === "playbook");
  const tasks = ev.filter((e) => e.kind === "task");
  assert.ok(playbooks.length > 50, "a 90-day company completes a meaningful number of playbooks");
  assert.ok(tasks.length > 0, "the fixture exercises kind:task worker events too");
  assert.equal(playbooks.every((e) => e.node_id && e.artifact_sha256), true, "every playbook event pins its node and its bytes");
  assert.ok(playbooks.some((e) => e.rubric_sha256), "playbooks that declare a rubric pin it");
});

test("golden fixture regenerates byte-identically (the release-blocking property)", () => {
  const out = mkdtempSync(join(tmpdir(), "caf-fix-"));
  try {
    generate({ out });
    const a = readFileSync(join(GOLDEN, "ledger.jsonl"), "utf8");
    const b = readFileSync(join(out, "company-brain", "ledger.jsonl"), "utf8");
    assert.equal(b, a, "a nondeterministic generator makes every downstream digest meaningless");
    assert.equal(
      readFileSync(join(out, "company-brain", "state.json"), "utf8"),
      readFileSync(join(GOLDEN, "state.json"), "utf8"),
    );
  } finally { rmSync(out, { recursive: true, force: true }); }
});

// This is the load-bearing one. A legality checker MUST replay through the router,
// not reimplement the DAG rules: the router mints artifacts from milestone flags
// (reaching a level grants `unit_economics` without `unit-economics` being done), so
// a naive depends_on/consumes replay reports violations on a perfectly honest brain.
test("every playbook completion was READY at the moment it was claimed, per the router", () => {
  const ev = readLedger(GOLDEN).filter((e) => e.kind === "playbook");
  const completed = [];
  const violations = [];

  for (const e of ev) {
    // Level as the engine would derive it from the state just before this event.
    let level = 0;
    for (let L = 0; L <= 8; L++) {
      const m = buildMap(INDEX, PROFILE, { completed, level: L });
      const entry = m.levels.find((x) => Number(x.level) === L);
      if (!entry) continue;
      const nonRec = entry.nodes.filter((n) => !n.recurring && gatesLevel(n));
      if (!nonRec.length || nonRec.every((n) => completed.includes(n.id))) continue;
      if (entry.nodes.some((n) => n.status === "ready" && !n.recurring && gatesLevel(n))) { level = L; break; }
    }
    const map = buildMap(INDEX, PROFILE, { completed, level });
    const node = map.levels.flatMap((L) => L.nodes).find((n) => n.id === e.node_id);
    if (!node || node.status !== "ready") violations.push(`${e.node_id} was "${node?.status}" at level ${level}`);
    completed.push(e.node_id);
  }

  assert.deepEqual(violations, [], "the fixture is a legal traversal by construction");
});

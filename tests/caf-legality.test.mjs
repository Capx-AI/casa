// Legality: replay the ledger against the ROUTER and ask whether each claimed
// completion was actually ready at the time. Zero tokens, and it is the check that
// makes a naive forgery uneconomic.
//
// Two properties, and both matter equally:
//   1. the golden brain (which the router itself produced) reports ZERO violations
//   2. every published forgery is caught, by the specific check it was designed to trip
//
// Property 1 is the hard one. A hand-rolled depends_on/consumes walk reports 11
// violations on the golden brain, because the router mints artifacts from milestone
// flags, ignores non-member deps, counts reached recurring loops as satisfied, and lets
// unproducible inputs pass. A checker that fails honest brains is worse than no checker.

import { after, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkLegality, VIOLATIONS } from "../scripts/caf/legality.mjs";
import { generate } from "../caf/fixtures/generate.mjs";
import { build } from "../caf/fixtures/adversarial.mjs";

const FIXTURE_ROOT = mkdtempSync(join(tmpdir(), "caf-legality-suite-"));
const GOLDEN = generate({ out: join(FIXTURE_ROOT, "golden") }).brain;
const ADVERSARIAL = join(FIXTURE_ROOT, "adversarial");
build({ golden: GOLDEN, out: ADVERSARIAL });
const brainOf = (name) => name === "golden" ? GOLDEN : join(ADVERSARIAL, name, "company-brain");
const MANIFEST = JSON.parse(readFileSync(join(ADVERSARIAL, "manifest.json"), "utf8"));
after(() => rmSync(FIXTURE_ROOT, { recursive: true, force: true }));

test("golden brain: zero violations (the checker must not fail honest work)", () => {
  const r = checkLegality(brainOf("golden"));
  assert.equal(r.total_violations, 0, JSON.stringify(r.violations, null, 2));
  assert.equal(r.dag_violations, 0);
  assert.equal(r.dataflow_violations, 0);
  assert.equal(r.level_violations, 0);
  assert.ok(r.playbook_events > 50);
  assert.ok(r.index_sha256, "the verdict names the catalog version it judged against");
});

test("golden brain: node_id coverage is high, and reported in basis points", () => {
  const r = checkLegality(brainOf("golden"));
  assert.ok(r.node_id_coverage_bp > 8000, `coverage ${r.node_id_coverage_bp}bp`);
  assert.equal(Number.isInteger(r.node_id_coverage_bp), true, "CCJ is integers only, so no float ratios");
});

test("every published forgery is caught by the check it was designed to trip", () => {
  const expected = MANIFEST.filter((m) => m.expect);
  assert.ok(expected.length >= 7, "the adversarial corpus must not silently shrink");

  for (const m of expected) {
    const r = checkLegality(brainOf(m.name));
    const kinds = [...new Set(r.violations.map((v) => v.kind))];
    assert.ok(kinds.includes(m.expect), `${m.name}: expected "${m.expect}", got [${kinds}]`);
    assert.ok(VIOLATIONS.includes(m.expect), `${m.name}: "${m.expect}" is not a declared violation kind`);
  }
});

test("no forgery lands in 'unclassified' (the engine said no and we could not say why)", () => {
  for (const m of MANIFEST.filter((x) => x.expect)) {
    const r = checkLegality(brainOf(m.name));
    const un = r.violations.filter((v) => v.kind === "unclassified");
    assert.deepEqual(un, [], `${m.name} produced unclassified violations: ${JSON.stringify(un)}`);
  }
});

// The one that is not a "violation" at all, and is the most dangerous.
test("the unfalsifiable attestation: no node_ids means no violations and no coverage", () => {
  const r = checkLegality(brainOf("no-node-id-coverage"));
  assert.equal(r.total_violations, 0, "an emitter that names no nodes cannot be graph-checked");
  assert.equal(r.node_id_coverage_bp, 0, "so coverage collapses to zero, which is the signal");
  assert.equal(r.playbook_events, 0);
});

test("a dependency violation is reported as a dependency, not swallowed by the level gate", () => {
  const r = checkLegality(brainOf("dependency-out-of-order"));
  assert.equal(r.dag_violations, 1);
  assert.equal(r.level_violations, 0, "a same-level swap must exercise the dependency clause");
  assert.match(r.violations[0].detail, /depends on/);
});

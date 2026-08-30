// Tests for the stage engine (scripts/stage.mjs): the interview-answers -> profile,
// start level, and seed mapping, plus the brain level-floor it relies on. Unit tests
// hit deriveStage directly; integration tests drive `stage apply` + `brain sync` over
// a temp brain to prove the seed lands the company at the right level and that a
// backfilled gap surfaces as a catch-up item instead of regressing the level.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deriveStage, validateAnswers, deriveInitialPulse } from "../scripts/stage.mjs";
import { INDEX, REPO, tmpBrain, cleanup, runScript, levelKey } from "./helpers.mjs";

const BY_ID = new Map(INDEX.map((p) => [p.id, p]));

// A realistic b2c profile (Memescope-like). `tier` is overridden per test.
function answers(tier, gaps = []) {
  return {
    type: "saas",
    secondary_type: "crypto",
    company_name: "Memescope",
    one_liner: "Analytics dashboards for Solana memecoin traders",
    icp: "Solana traders",
    monetization: "subscription",
    traits: ["b2c", "self_serve_only", "low_acv", "takes_payments", "recurring_revenue", "builds_software", "technical_audience", "bootstrapped_only"],
    tier,
    gaps,
  };
}

// ---- deriveStage ----

test("deriveStage: idea tier starts at level 0 with an empty seed", () => {
  const { start_level, completed_seed, profile } = deriveStage(answers("idea"), INDEX);
  assert.equal(start_level, 0);
  assert.deepEqual(completed_seed, []);
  assert.ok(profile.traits.includes("pre_idea_only"));
  assert.ok(profile.confirmed === true);
});

test("deriveStage: revenue tier starts at level 5 and seeds only earlier non-recurring work", () => {
  const { start_level, completed_seed, profile } = deriveStage(answers("revenue"), INDEX);
  assert.equal(start_level, 5);
  assert.ok(completed_seed.length > 0);
  for (const id of completed_seed) {
    const pb = BY_ID.get(id);
    assert.ok(pb, `${id} is a real playbook`);
    assert.ok(levelKey(pb.level) < 5, `${id} is below the start level`);
    assert.ok(!pb.recurring, `${id} is not a loop`);
  }
  // cumulative milestone flags, plus this tier's own
  for (const f of ["has_revenue", "has_paying_customers", "has_website", "has_repo"]) {
    assert.ok(profile.traits.includes(f), `expected trait ${f}`);
  }
  assert.ok(!profile.traits.includes("pre_idea_only"), "shipped companies are not pre-idea");
});

test("deriveStage: milestone flags accumulate upward but not beyond the tier", () => {
  const { profile } = deriveStage(answers("building"), INDEX);
  assert.ok(profile.traits.includes("has_repo"), "building tier sets has_repo");
  assert.ok(profile.traits.includes("has_website"), "and inherits the landing tier's flags");
  assert.ok(!profile.traits.includes("has_revenue"), "but not flags from tiers above it");
});

test("deriveStage: Phase 0 distribution plays are never auto-seeded", () => {
  const PHASE0 = ["phase0-website", "phase0-one-pager", "phase0-pitch-deck", "phase0-publish-readiness"];
  for (const tier of ["landing", "building", "launched", "revenue", "scaling"]) {
    const { completed_seed } = deriveStage(answers(tier), INDEX);
    for (const id of PHASE0) {
      assert.ok(!completed_seed.includes(id), `${id} must not be seeded at ${tier}`);
    }
    assert.ok(
      !completed_seed.includes("artifact-change-brief"),
      `artifact-change-brief must not be seeded at ${tier}`,
    );
  }
});

test("deriveStage: a named gap is excluded from the seed", () => {
  const full = deriveStage(answers("revenue"), INDEX).completed_seed;
  assert.ok(full.includes("entity-formation"), "entity-formation is seeded by default at revenue tier");
  const withGap = deriveStage(answers("revenue", ["entity-formation"]), INDEX).completed_seed;
  assert.ok(!withGap.includes("entity-formation"), "and dropped once named as a gap");
  assert.equal(withGap.length, full.length - 1);
});

// ---- validateAnswers ----

test("validateAnswers: rejects an unknown stage tier", () => {
  assert.throws(() => validateAnswers(answers("growth-hacking"), INDEX), /unknown stage tier/);
});

test("validateAnswers: rejects a trait outside the catalog vocabulary", () => {
  const a = answers("idea");
  a.traits = [...a.traits, "web4_native"];
  assert.throws(() => validateAnswers(a, INDEX), /unknown trait/);
});

test("validateAnswers: rejects a gap that is not a real playbook id", () => {
  assert.throws(() => validateAnswers(answers("revenue", ["make-it-rain"]), INDEX), /not a known playbook id/);
});

// ---- integration: stage apply + brain sync ----

function applyAndSync(tier, gaps = []) {
  const dir = tmpBrain();
  assert.equal(runScript("brain.mjs", ["init", dir]).code, 0);
  const answersPath = join(dir, "answers.json");
  writeFileSync(answersPath, JSON.stringify(answers(tier, gaps)));
  assert.equal(runScript("stage.mjs", ["apply", answersPath, dir]).code, 0);
  assert.equal(runScript("brain.mjs", ["sync", dir]).code, 0);
  return { dir, map: JSON.parse(readFileSync(join(dir, "build-map.json"), "utf8")) };
}

test("seed round-trip: a revenue-stage founder lands at level 5", () => {
  const { dir, map } = applyAndSync("revenue");
  try {
    assert.equal(map.current_level, 5, "the seed advances deriveLevel to the start level");
  } finally {
    cleanup(dir);
  }
});

test("level floor: unseeded Phase 0 is catch-up without regressing the level", () => {
  const { dir, map } = applyAndSync("revenue");
  try {
    assert.equal(map.current_level, 5, "floor holds while Phase 0 is still open");
    const node = map.levels.flatMap((l) => l.nodes).find((n) => n.id === "phase0-website");
    assert.ok(node, "phase0-website stays in the build map");
    assert.equal(node.status, "ready", "and surfaces as catch-up, not assumed done");
  } finally {
    cleanup(dir);
  }
});

test("level floor: a backfilled lower-level gap surfaces as ready without regressing the level", () => {
  const { dir, map } = applyAndSync("revenue", ["entity-formation"]);
  try {
    assert.equal(map.current_level, 5, "floor holds despite an open L1 gap");
    const node = map.levels.flatMap((l) => l.nodes).find((n) => n.id === "entity-formation");
    assert.ok(node, "the gap is still in the build map");
    assert.equal(node.status, "ready", "and is surfaced as a catch-up item to do now");
  } finally {
    cleanup(dir);
  }
});

test("deriveInitialPulse: a retention archetype promotes the retention plays and gently tilts Success", () => {
  const p = deriveInitialPulse({ north_star_archetype: "engagement_retention", constraint_archetype: "runway_burn" }, INDEX);
  // the headline-mover: the specific north-star plays are promoted so retention actually leads
  assert.ok(p.weights.promote_ids.includes("cohort-retention-analysis"), "retention play promoted");
  assert.ok(p.weights.promote_ids.includes("churn-diagnosis-winback"), "churn play promoted");
  // the department tilt is mild now (the promotes carry the headline) and stays below the leapfrog line
  assert.ok(p.weights.byDepartment.Success > 1.0 && p.weights.byDepartment.Success <= 1.4, "gentle Success tilt");
  assert.ok(p.weights.byDepartment.Finance > 1.0, "runway_burn constraint adds Finance");
  assert.equal(p.north_star_archetype, "engagement_retention");
});

test("deriveInitialPulse: no archetype yields a neutral pulse (unchanged behavior)", () => {
  const p = deriveInitialPulse({}, INDEX);
  assert.deepEqual(p.weights, { default: 1 }, "no archetype => default-1 weights, no department tilt");
});

test("deriveInitialPulse: anti-priorities that name real playbooks become demotes", () => {
  const p = deriveInitialPulse({ anti_priorities: ["podcast-tour", "not-a-real-id"] }, INDEX);
  assert.deepEqual(p.weights.demote_ids, ["podcast-tour"], "only real playbook ids are demoted");
});

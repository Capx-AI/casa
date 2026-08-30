// Tests for the unified fitness score: stageFit discount, model_fit tilt, criticality as a
// bounded multiplier (not a rigid band), the stageOf/TIER_START sync with stage.mjs, and
// backward compatibility when the optional fit arg is absent.

import { test } from "node:test";
import assert from "node:assert/strict";
import { score, nextActions, select, stageOf, modelSet, effectiveCriticality } from "../scripts/router.mjs";
import { deriveStage } from "../scripts/stage.mjs";
import { INDEX } from "./helpers.mjs";

const flags = new Set();
const find = (id) => INDEX.find((p) => p.id === id);

// A revenue-stage subscription consumer app: the canonical case the fix targets.
const SUB = deriveStage({ type: "consumer", traits: ["b2c", "builds_software", "takes_payments", "recurring_revenue", "sends_email"], tier: "revenue", gaps: [] }, INDEX);
const SUB_STATE = { completed: SUB.completed_seed, level: SUB.start_level };

test("score: backward compatible when fit is absent (no behavior change for existing callers)", () => {
  const pb = find("north-star-metric");
  // identical inputs, with and without the 5th arg omitted, are equal and deterministic
  assert.equal(score(pb, 0, flags, null), score(pb, 0, flags, null, undefined));
  // the pre-fit formula: lev * urgency * rev / eff (computed from the playbook's own fields so the
  // assertion does not break when a playbook is re-tuned; north-star-metric is not revenue-blocking)
  const LEV = { critical: 4, high: 3, med: 2, low: 1 }, EFF = { S: 1, M: 1.3, L: 1.7, XL: 2.2 };
  const expected = Math.round((LEV[pb.leverage] * 1.3 * 1 / EFF[pb.effort]) * 1000) / 1000; // slack 0
  assert.equal(score(pb, 0, flags, null), expected);
});

test("stageFit: a stale low-level loop is discounted below at-stage work", () => {
  // incident-response is L2; at company level 5 it is 3 stages stale -> stageFit 0.7, so it
  // ranks below the revenue-stage retention/revenue work in the default (no-pulse) ranking.
  const acts = nextActions(INDEX, SUB.profile, SUB_STATE);
  const rank = (id) => acts.findIndex((a) => a.id === id);
  assert.ok(rank("incident-response") > rank("unit-economics"), "stale infra ranks below at-stage unit-economics");
  assert.ok(rank("incident-response") > rank("cohort-retention-analysis"), "stale infra ranks below retention");
});

test("model_fit: a recurring business surfaces retention; criticality promotes it to existential at revenue", () => {
  const acts = nextActions(INDEX, SUB.profile, SUB_STATE);
  const top5 = acts.slice(0, 5).map((a) => a.id);
  assert.ok(top5.includes("cohort-retention-analysis"), `retention should be top-5, got ${top5.join(",")}`);
  const cohort = acts.find((a) => a.id === "cohort-retention-analysis");
  assert.equal(cohort.effective_criticality, "existential", "cohort-retention is existential at the revenue stage");
});

test("criticality is a bounded multiplier, not a rigid band: the pulse still crosses it", () => {
  // A promoted growth-tier item must be able to outrank an existential item (the founder's
  // pulse is the outermost multiplier). This is what a lexicographic band would have broken.
  const base = nextActions(INDEX, SUB.profile, SUB_STATE);
  const lowGrowth = [...base].reverse().find((a) => a.effective_criticality === "growth");
  assert.ok(lowGrowth, "need a growth-tier ready action");
  const promoted = nextActions(INDEX, SUB.profile, { ...SUB_STATE, weights: { byId: { [lowGrowth.id]: 100 } } });
  assert.equal(promoted[0].id, lowGrowth.id, "a hard promote lifts a growth item above existential work");
});

test("stageOf stays in sync with stage.mjs TIER_START", () => {
  // The router duplicates the stage ladder; assert it agrees with the canonical mapping.
  const TIER_START = { idea: 0, landing: 1, building: 2, launched: 4, revenue: 5, scaling: 6 };
  for (const [tier, lvl] of Object.entries(TIER_START)) {
    assert.equal(stageOf(lvl), tier, `stageOf(${lvl}) should be ${tier}`);
  }
});

test("modelSet derives the business-model membership from traits", () => {
  const m = modelSet({ primary_type: "ecommerce", traits: ["b2c", "takes_payments"] });
  assert.ok(m.has("transactional") && m.has("physical_goods"));
  assert.ok(!m.has("recurring"));
  const r = modelSet({ primary_type: "saas", traits: ["b2b", "recurring_revenue", "high_acv"] });
  assert.ok(r.has("recurring") && r.has("sales_led") && !r.has("transactional"));
});

test("effectiveCriticality: existential_at promotes within the named stages only", () => {
  const pb = find("unit-economics"); // existential_at [revenue, scaling]
  assert.equal(effectiveCriticality(pb, "building"), "core", "core before the revenue stage");
  assert.equal(effectiveCriticality(pb, "revenue"), "existential", "existential at the revenue stage");
});

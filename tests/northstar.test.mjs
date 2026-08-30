// Unit tests for the business-type north-star derivation (scripts/northstar.mjs).
// Pure functions, no IO; assert the metric map per type/monetization/audience, the band
// cutoffs, the local-service override, and totality over the catalog type vocabulary.

import { test } from "node:test";
import assert from "node:assert/strict";
import { matureNorthStar, band, northStar, METRIC_IDS } from "../scripts/northstar.mjs";

test("matureNorthStar: b2b subscription saas steers by ARR / NRR", () => {
  const ns = matureNorthStar({ primary_type: "saas", monetization: "subscription", traits: ["b2b", "high_acv"] });
  assert.equal(ns.growth, "arr");
  assert.equal(ns.retention, "nrr");
});

test("matureNorthStar: b2c subscription consumer steers by MRR / subscription retention", () => {
  const ns = matureNorthStar({ primary_type: "consumer", monetization: "subscription", traits: ["b2c", "recurring_revenue"] });
  assert.equal(ns.growth, "mrr");
  assert.equal(ns.retention, "sub_retention");
});

test("matureNorthStar: marketplace steers by GMV / match rate", () => {
  const ns = matureNorthStar({ primary_type: "marketplace", traits: ["b2c"] });
  assert.equal(ns.growth, "gmv");
  assert.equal(ns.retention, "match_rate");
});

test("matureNorthStar: transactional ecommerce steers by net revenue / repeat purchase", () => {
  const ns = matureNorthStar({ primary_type: "ecommerce", monetization: "one-time", traits: ["b2c", "takes_payments"] });
  assert.equal(ns.growth, "net_revenue");
  assert.equal(ns.retention, "repeat_purchase_rate");
});

test("matureNorthStar: a local service overrides to bookings / rebooking", () => {
  const ns = matureNorthStar({ primary_type: "b2b-service", traits: ["b2b", "local_service_only"] });
  assert.equal(ns.growth, "bookings");
  assert.equal(ns.retention, "local_rebooking");
});

test("band: validation through scale cutoffs", () => {
  assert.equal(band(0), "validation");
  assert.equal(band(1), "validation");
  assert.equal(band(2), "activation"); // building: past validation, building toward first value
  assert.equal(band(4), "activation");
  assert.equal(band(5), "retention");
  assert.equal(band(6), "scale");
  assert.equal(band(8), "scale");
  assert.equal(band("always-on"), "validation");
});

test("northStar: the active metric tracks the band up the ladder", () => {
  const p = { primary_type: "saas", monetization: "subscription", traits: ["b2b"] };
  assert.equal(northStar(p, 0).metric, "validated_demand");
  assert.equal(northStar(p, 2).metric, "activation_rate"); // building -> activation band
  assert.equal(northStar(p, 5).metric, "nrr"); // mature retention at first customers
  assert.equal(northStar(p, 6).metric, "arr"); // mature growth at scale
});

test("northStar: total over the catalog type vocabulary, always a known labelled metric", () => {
  for (const t of ["saas", "marketplace", "ecommerce", "b2b-service", "crypto", "consumer", "content", "hardware", ""]) {
    const ns = northStar({ primary_type: t, traits: [] }, 5);
    assert.ok(ns.metric && ns.label, `type "${t}" yields a metric and label`);
    assert.ok(METRIC_IDS.has(ns.metric), `metric "${ns.metric}" is in the closed vocabulary`);
    for (const g of ns.guardrails) assert.ok(METRIC_IDS.has(g), `guardrail "${g}" is in the closed vocabulary`);
  }
});

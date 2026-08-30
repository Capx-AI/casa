// Tests for the quality-test fixes: the software-flag gate (#2), the gap-not-applicable
// warning (#7), and the consumes-as-readiness gate (#8 / #4b). The recurring-dependency
// rule (#4b) is also covered by the updated gating test in router.test.mjs.

import { test } from "node:test";
import assert from "node:assert/strict";
import { select, nextActions } from "../scripts/router.mjs";
import { deriveStage } from "../scripts/stage.mjs";
import { INDEX, loadJson } from "./helpers.mjs";

test("deriveStage: a non-software business does not inherit a codebase (#2)", () => {
  const a = { type: "b2b-service", traits: ["b2c", "local_service_only", "takes_payments"], tier: "launched", gaps: [] };
  const { profile } = deriveStage(a, INDEX);
  for (const f of ["has_repo", "has_deployed_app", "has_datastore"]) {
    assert.ok(!profile.traits.includes(f), `non-software business must not get ${f}`);
  }
});

test("deriveStage: a software business still gets the codebase flags", () => {
  const a = { type: "saas", traits: ["b2b", "builds_software"], tier: "building", gaps: [] };
  const { profile } = deriveStage(a, INDEX);
  assert.ok(profile.traits.includes("has_repo"), "software business keeps has_repo");
});

test("deriveStage: a gap that does not apply is flagged, not silently dropped (#7)", () => {
  // hosting-deployment-setup requires builds_software, so it is not a member of a non-software service
  const a = { type: "b2b-service", traits: ["b2c", "local_service_only"], tier: "launched", gaps: ["hosting-deployment-setup"] };
  const { gaps_not_applicable } = deriveStage(a, INDEX);
  assert.ok(gaps_not_applicable.includes("hosting-deployment-setup"));
});

test("nextActions: every ready action's consumed inputs are produced, or not producible at all (#8)", () => {
  // A consumed input gates only when some member can produce it. An input no member
  // produces is ambient (or has no producer for this business type), so it must not
  // block its consumers. Assert that relaxed invariant: produced OR non-producible.
  const profile = loadJson("examples/profile-solana-analytics.json");
  const completed = ["opportunity-scan", "problem-validation-interviews"];
  const completedSet = new Set(completed);
  const { members } = select(INDEX, profile);
  const byId = new Map(members.map((m) => [m.id, m]));
  const produced = new Set(), producible = new Set();
  for (const m of members) {
    for (const c of m.produces || []) producible.add(c);
    if (completedSet.has(m.id) || m.recurring) for (const c of m.produces || []) produced.add(c);
  }
  for (const a of nextActions(INDEX, profile, { completed, level: 0 })) {
    for (const c of byId.get(a.id).consumes || []) {
      assert.ok(produced.has(c) || !producible.has(c), `${a.id} surfaced before its producible input "${c}" exists`);
    }
  }
});

test("membership: software-ops playbooks are not members of a non-software business", () => {
  // observability/backup/security/onboarding/beta require builds_software, so a
  // non-software store never carries them as dead, blocked plan nodes.
  const a = { type: "ecommerce", traits: ["b2c", "takes_payments", "sends_email"], tier: "revenue", gaps: [] };
  const { profile } = deriveStage(a, INDEX);
  const ids = new Set(select(INDEX, profile).members.map((m) => m.id));
  for (const id of ["observability-setup", "data-backup-recovery", "security-baseline", "onboarding-flow-design", "beta-program-management"]) {
    assert.ok(!ids.has(id), `${id} must not be a member of a non-software business`);
  }
});

// Run a from-scratch climb (re-derive every playbook up the ladder) and return the set of
// members that are NEVER ready at any level. Includes recurring loops on purpose: a dead
// loop is still a dead node the founder sees in the build map. opt-in state flags the
// profile carries (e.g. runs_paid_media) are honored, so a loop that is merely conditional
// on a choice the founder HAS made is reachable, not counted dead.
function deadMembers(answers) {
  const { profile } = deriveStage(answers, INDEX);
  const { members } = select(INDEX, profile);
  const byId = new Map(members.map((m) => [m.id, m]));
  const everReady = new Set();
  let completed = [];
  for (let lvl = 0; lvl <= 8; lvl++) for (let pass = 0; pass < 8; pass++) {
    const acts = nextActions(INDEX, profile, { completed, level: lvl });
    for (const x of acts) everReady.add(x.id);
    const newly = acts.map((x) => x.id).filter((id) => !completed.includes(id) && !byId.get(id)?.recurring);
    if (!newly.length) break;
    completed = [...completed, ...newly];
  }
  return members.filter((m) => !everReady.has(m.id)).map((m) => m.id);
}

test("reachability: no member (incl. recurring loops) is permanently unreachable for a full-featured non-software b2c business", () => {
  // The state/artifact reconciliation (flag-minting + producible-bypass + by-level milestone
  // grants + software-ops membership gating) must leave NO member that can never become ready
  // across the full climb, recurring loops included. This was 18-41% dead; the loop residue
  // (mixpanel-reading, incident-response, ab-testing, revenue loops) is now closed too. The
  // profile carries the opt-in flags so conditional loops (attribution needs runs_paid_media)
  // are reachable rather than falsely flagged.
  const a = { type: "ecommerce", traits: ["b2c", "takes_payments", "recurring_revenue", "sends_email", "collects_user_data", "runs_paid_media"], tier: "revenue", gaps: [] };
  assert.deepEqual(deadMembers(a), [], "members never reachable");
});

test("reachability: holds for a full-featured software b2c business too (incl. loops)", () => {
  const a = { type: "consumer", traits: ["b2c", "builds_software", "takes_payments", "recurring_revenue", "sends_email", "collects_user_data", "runs_paid_media"], tier: "revenue", gaps: [] };
  assert.deepEqual(deadMembers(a), [], "members never reachable");
});

test("reachability: an idea-tier company (level-0 start) has no permanently-dead members", () => {
  // pre_idea_only must DROP as the company climbs past idea, or every playbook that excludes it
  // stays permanently un-ready. This was 37 dead (43% of members) on a level-0 start - a gap the
  // earlier reachability tests missed by only ever climbing from revenue/launched tiers.
  const a = { type: "consumer", traits: ["b2c", "builds_software", "sends_email", "collects_user_data", "runs_paid_media"], monetization: "subscription", tier: "idea", gaps: [] };
  assert.deepEqual(deadMembers(a), [], "members never reachable from a level-0 start");
});

test("reachability: milestone flags mint their backing artifact (retention track unblocks)", () => {
  // has_paying_customers (a revenue-tier milestone) mints the paying_customer artifact,
  // so the retention playbooks that consume it become reachable for a b2c business that
  // has no b2b contract-close producer.
  const a = { type: "consumer", traits: ["b2c", "builds_software", "takes_payments", "recurring_revenue"], tier: "revenue", gaps: [] };
  const { profile, start_level } = deriveStage(a, INDEX);
  const ids = new Set(nextActions(INDEX, profile, { completed: [], level: start_level }).map((x) => x.id));
  for (const id of ["referral-program", "nps-csat-program"]) {
    assert.ok(ids.has(id), `${id} should be ready for a b2c revenue business (flag-minted paying_customer)`);
  }
});

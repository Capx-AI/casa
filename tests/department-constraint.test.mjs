// v2 Phase 1 guards: the binding constraint as a first-class router input, the department
// projection, and the --department post-ranking filter. These are the tripwires that prove the
// department reorg did NOT reintroduce the eval's constraint-blind generic ranking, and that the
// constraint-absent path stays byte-identical to the shipped engine (goldens preserved).

import { test } from "node:test";
import assert from "node:assert/strict";
import { select, buildMap, nextActions } from "../scripts/router.mjs";
import { deriveBindingConstraint, leadDepartments, deriveStage, winGap } from "../scripts/stage.mjs";
import { INDEX, loadJson } from "./helpers.mjs";

const PROBE = loadJson("examples/profile-b2b-devtool.json"); // b2b, high_acv
const MEME = loadJson("examples/profile-solana-analytics.json"); // b2c, self_serve_only
const ELEVEN = new Set(["Strategy", "Brand", "Product", "Engineering", "Data", "Growth", "Sales", "Finance", "Legal", "Success", "Operations"]);

// ---- byte-identical when the constraint is absent (the migration-safety invariant) ----

test("nextActions: no binding_constraint is byte-identical to the pre-constraint engine", () => {
  for (const profile of [PROBE, MEME]) {
    for (const level of [0, 1, 4, 6]) {
      const base = nextActions(INDEX, profile, { level });
      assert.deepEqual(nextActions(INDEX, profile, { level, binding_constraint: null }), base);
      assert.deepEqual(nextActions(INDEX, profile, { level, binding_constraint: { archetype: "x", surface_ids: [] } }), base);
    }
  }
});

// ---- the constraint steers ranking DIRECTLY (the anti-regression core) ----

test("nextActions: a binding constraint promotes its surface plays a tier (and they cannot drop)", () => {
  const level = 1;
  const base = nextActions(INDEX, MEME, { level });
  const target = base.find((a) => a.tier < 2); // a ready play not already at the existential tier
  assert.ok(target, "expected a sub-tier-2 ready play to promote");
  const bc = { archetype: "no_users", surface_ids: [target.id], lead_departments: ["Growth"] };
  const withC = nextActions(INDEX, MEME, { level, binding_constraint: bc });
  const after = withC.find((a) => a.id === target.id);
  assert.equal(after.tier, Math.min(target.tier + 1, 3), "surface play is bumped exactly one tier");
  const wasIdx = base.findIndex((a) => a.id === target.id);
  const nowIdx = withC.findIndex((a) => a.id === target.id);
  assert.ok(nowIdx <= wasIdx, "a promoted surface play can only move up, never down");
});

test("nextActions: two same-profile runs with DIFFERENT constraints rank differently", () => {
  const level = 1;
  const base = nextActions(INDEX, MEME, { level });
  const a = base[base.length - 1].id; // promote the lowest-ranked ready play
  const b = base.find((x) => x.tier < 2 && x.id !== a)?.id || base[0].id;
  const ra = nextActions(INDEX, MEME, { level, binding_constraint: { archetype: "p", surface_ids: [a] } }).map((x) => x.id);
  const rb = nextActions(INDEX, MEME, { level, binding_constraint: { archetype: "q", surface_ids: [b] } }).map((x) => x.id);
  assert.notDeepEqual(ra, rb, "different constraints must produce different orderings");
});

// ---- --department is a pure POST-ranking filter (a lane can never be its own ranker) ----

test("nextActions: --department is the global ranking with non-matching ids removed, same order", () => {
  for (const profile of [PROBE, MEME]) {
    const all = nextActions(INDEX, profile, { level: 1 });
    for (const dept of new Set(all.map((a) => a.department))) {
      const filtered = nextActions(INDEX, profile, { level: 1, department: dept });
      assert.deepEqual(filtered, all.filter((a) => a.department === dept));
    }
  }
});

// ---- buildMap department projection ----

test("buildMap: department projection covers every member exactly once over the 11 vocabulary", () => {
  const map = buildMap(INDEX, PROBE, { level: 1 });
  assert.ok(Array.isArray(map.departments));
  const levelIds = map.levels.flatMap((l) => l.nodes.map((n) => n.id)).sort();
  const deptIds = map.departments.flatMap((d) => d.nodes.map((n) => n.id)).sort();
  assert.deepEqual(deptIds, levelIds, "department lanes partition the same node set as the levels");
  assert.equal(new Set(deptIds).size, deptIds.length, "no node appears in two lanes");
  for (const d of map.departments) assert.ok(ELEVEN.has(d.department), `unknown department ${d.department}`);
  // within a lane, nodes are ordered by level then slack
  for (const d of map.departments) {
    const keys = d.nodes.map((n) => (n.level === "always-on" ? -1 : Number(n.level)));
    assert.deepEqual(keys, [...keys].sort((x, y) => x - y), `lane ${d.department} not level-ordered`);
  }
});

// ---- deriveBindingConstraint / leadDepartments ----

test("deriveBindingConstraint: null without an archetype, shaped with one, surface ids are members", () => {
  assert.equal(deriveBindingConstraint({}, INDEX), null);
  const { members } = select(INDEX, PROBE);
  const memberIds = new Set(members.map((m) => m.id));
  const bc = deriveBindingConstraint({ constraint_archetype: "no_revenue", win_definition: "$10k MRR" }, INDEX, memberIds);
  assert.equal(bc.archetype, "no_revenue");
  assert.equal(bc.win_definition, "$10k MRR");
  assert.ok(bc.surface_ids.length > 0 && bc.surface_ids.every((id) => memberIds.has(id)), "surface ids are real members");
  assert.ok(bc.lead_departments.length >= 1 && bc.lead_departments.length <= 4, "1..4 co-leads");
  for (const d of bc.lead_departments) assert.ok(ELEVEN.has(d));
});

test("leadDepartments: every archetype yields at most 4 leads, ordered by tilt strength", () => {
  for (const arch of ["no_users", "no_revenue", "runway_burn", "regulatory_legal", "tech_scale", "hiring_capacity"]) {
    const leads = leadDepartments(arch);
    assert.ok(leads.length >= 1 && leads.length <= 4, `${arch} leads out of [1,4]`);
    for (const d of leads) assert.ok(ELEVEN.has(d), `${arch} lead ${d} not a real department`);
  }
  assert.deepEqual(leadDepartments("nonexistent"), []);
});

// ---- Phase 2: structured win-gap urgency + lead-department tilt (both gated behind constraint) ----

test("winGap: structured win yields a [0,1] distance-to-target; free text or missing yields 0", () => {
  assert.equal(winGap({ current_value: 0, target_value: 1000 }), 1);
  assert.equal(winGap({ current_value: 800, target_value: 1000 }), 0.2);
  assert.equal(winGap({ current_value: 1000, target_value: 1000 }), 0);
  assert.equal(winGap("reach 1000 users"), 0);
  assert.equal(winGap({}), 0);
  assert.equal(winGap(null), 0);
});

test("deriveBindingConstraint: a structured win_definition produces a win_gap the router can use", () => {
  const bc = deriveBindingConstraint(
    { constraint_archetype: "no_users", win_definition: { metric_id: "wau", current_value: 100, target_value: 1000, deadline: "Q3" } },
    INDEX,
  );
  assert.equal(bc.win_gap, 0.9);
});

test("nextActions: a wider win gap raises the constraint surface play's score (instance-specificity)", () => {
  const level = 1;
  const base = nextActions(INDEX, MEME, { level });
  const target = base.find((a) => a.tier < 2) || base[0];
  const low = nextActions(INDEX, MEME, { level, binding_constraint: { archetype: "no_users", surface_ids: [target.id], lead_departments: [], win_gap: 0 } });
  const high = nextActions(INDEX, MEME, { level, binding_constraint: { archetype: "no_users", surface_ids: [target.id], lead_departments: [], win_gap: 1 } });
  const sLow = low.find((a) => a.id === target.id).score;
  const sHigh = high.find((a) => a.id === target.id).score;
  assert.ok(sHigh > sLow, `gap 1 should outscore gap 0 (${sHigh} > ${sLow})`);
  assert.notDeepEqual(high, low); // same archetype + surface, different gap => different ranked output
});

test("nextActions: lead departments get a gentle tilt that never leapfrogs a do-or-die in another lane", () => {
  const level = 1;
  const base = nextActions(INDEX, MEME, { level });
  const baseP = base.find((a) => a.tier < 2);
  assert.ok(baseP, "need a sub-existential ready play to tilt");
  const leadDept = baseP.department;
  const withLead = nextActions(INDEX, MEME, { level, binding_constraint: { archetype: "no_users", surface_ids: [], lead_departments: [leadDept], win_gap: 0 } });
  const leadP = withLead.find((a) => a.id === baseP.id);
  assert.ok(leadP.score > baseP.score, "a lead-department play is tilted up");
  assert.equal(leadP.tier, baseP.tier, "the tilt does not change the tier (cannot cross the existential floor)");
  const ex = withLead.find((a) => a.tier === 2 && a.department !== leadDept);
  if (ex) assert.ok(withLead.indexOf(ex) < withLead.indexOf(leadP), "a non-lead do-or-die still leads a tilted lead play");
});

test("deriveStage: returns a member-scoped binding_constraint end to end", () => {
  const TYPES = [...new Set(INDEX.flatMap((p) => p.applies_to.types))].filter((t) => t !== "*");
  const type = TYPES.includes("saas") ? "saas" : TYPES[0];
  const answers = { type, tier: "building", traits: ["b2b", "builds_software"], monetization: "subscription",
    constraint_archetype: "no_revenue", win_definition: "reach $10k MRR" };
  const res = deriveStage(answers, INDEX);
  assert.ok(res.binding_constraint, "deriveStage surfaces the binding constraint");
  assert.equal(res.binding_constraint.archetype, "no_revenue");
  const { members } = select(INDEX, res.profile);
  const memberIds = new Set(members.map((m) => m.id));
  for (const id of res.binding_constraint.surface_ids) assert.ok(memberIds.has(id), `${id} is a member`);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { autonomyFor, routeAction, assembleBriefing } from "../scripts/cos.mjs";

const dials = { default: "approve_first", departments: { Engineering: "auto", Growth: "approve_first" }, always_ask: ["spend_money"] };

test("autonomyFor uses the department dial, then the default", () => {
  assert.equal(autonomyFor("Engineering", dials), "auto");
  assert.equal(autonomyFor("Growth", dials), "approve_first");
  assert.equal(autonomyFor("Finance", dials), "approve_first"); // falls back to default
  assert.equal(autonomyFor("Finance", {}), "approve_first");    // hard default
});

test("routeAction maps an action's department to its operator and posture", () => {
  const r = routeAction({ id: "ship-api", title: "Ship the API", department: "Engineering" }, dials);
  assert.equal(r.operator, "casa-engineer");
  assert.equal(r.autonomy, "auto");
  const g = routeAction({ id: "paid-ads", title: "Paid acquisition", department: "Growth" }, dials);
  assert.equal(g.operator, "casa-growth");
  assert.equal(g.autonomy, "approve_first");
});

test("assembleBriefing leads with the top move, lists also-ready, and routes each", () => {
  const state = {
    company: { types: ["saas"], level: 3 },
    autonomy: dials,
    in_flight: [{ task: "x", status: "running" }],
    blocked: [{ task: "run-ads", status: "blocked", note: "needs budget" }],
  };
  const actions = [
    { id: "a", title: "Unit economics", department: "Finance" },
    { id: "b", title: "Ship API", department: "Engineering" },
    { id: "c", title: "Pricing page", department: "Growth" },
  ];
  const brief = assembleBriefing(state, actions);
  assert.equal(brief.headline.id, "a");
  assert.equal(brief.headline.operator, "casa-finance");
  assert.equal(brief.also_ready.length, 2);
  assert.equal(brief.in_flight.length, 1);
  assert.equal(brief.approvals[0].task, "run-ads");
});

test("parallelize fires only when >=2 independent department lanes are ready", () => {
  const oneLane = assembleBriefing({ autonomy: dials }, [
    { id: "a", title: "A", department: "Finance" },
    { id: "b", title: "B", department: "Finance" },
  ]);
  assert.deepEqual(oneLane.parallelize, []);

  const manyLanes = assembleBriefing({ autonomy: dials }, [
    { id: "a", title: "A", department: "Finance" },
    { id: "b", title: "B", department: "Engineering" },
    { id: "c", title: "C", department: "Growth" },
  ]);
  assert.deepEqual(manyLanes.parallelize.sort(), ["Engineering", "Finance", "Growth"]);
});

test("an empty ready set yields a null headline, not a crash", () => {
  const brief = assembleBriefing({ autonomy: dials }, []);
  assert.equal(brief.headline, null);
  assert.deepEqual(brief.also_ready, []);
  assert.deepEqual(brief.parallelize, []);
});

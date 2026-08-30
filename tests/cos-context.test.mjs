import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { appendEvent } from "../scripts/ledger.mjs";
import { businessState, dials } from "../scripts/cos-context.mjs";

const tmp = () => mkdtempSync(join(tmpdir(), "casa-cos-"));

test("dials falls back to the shipped template when a company has none", () => {
  const d = tmp();
  const conf = dials(d);
  assert.ok(conf.always_ask.includes("spend_money"));
  assert.ok(conf.always_ask.includes("merge_to_main"));
  rmSync(d, { recursive: true, force: true });
});

test("a local dials.json overrides the template", () => {
  const d = tmp();
  writeFileSync(join(d, "dials.json"), JSON.stringify({ default: "auto", departments: { growth: "auto" }, always_ask: ["spend_money"] }));
  const conf = dials(d);
  assert.equal(conf.default, "auto");
  assert.deepEqual(Object.keys(conf.departments), ["growth"]);
  rmSync(d, { recursive: true, force: true });
});

test("businessState assembles profile + level + ledger + dials", () => {
  const d = tmp();
  writeFileSync(join(d, "profile.json"), JSON.stringify({ primary_type: "b2b_saas", traits: ["sales_led"], binding_constraint: "no_revenue" }));
  writeFileSync(join(d, "build-map.json"), JSON.stringify({ current_level: 2 }));
  appendEvent(d, { task: "spend-ads", status: "blocked", dept: "finance", decision: "needs budget approval" });
  appendEvent(d, { task: "ship-api", status: "running", dept: "engineering", agent: "casa-engineer" });
  const bs = businessState(d);
  assert.deepEqual(bs.company.types, ["b2b_saas"]);
  assert.equal(bs.company.binding_constraint, "no_revenue");
  assert.equal(bs.company.level, 2);
  assert.equal(bs.in_flight.length, 2);
  assert.equal(bs.blocked.length, 1);
  assert.equal(bs.recent_decisions.length, 1);
  assert.ok(bs.autonomy.always_ask.includes("go_public"));
  rmSync(d, { recursive: true, force: true });
});

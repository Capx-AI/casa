import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deriveRoster, allOperators, DEPARTMENTS, operatorsForDepartment, primaryOperator } from "../scripts/roster.mjs";

const repo = dirname(dirname(fileURLToPath(import.meta.url)));
const agentFile = (op) => join(repo, "agents", `${op}.md`);

test("every company gets the base departments", () => {
  const r = deriveRoster({});
  for (const d of ["Strategy", "Brand", "Product", "Engineering"]) assert.ok(r.departments.includes(d));
  assert.deepEqual(r.leads, []);
});

test("B2B SaaS with a no_revenue constraint leads on Finance and Sales", () => {
  const r = deriveRoster({ primary_type: "saas", traits: ["b2b", "recurring_revenue"], binding_constraint: "no_revenue" });
  assert.ok(r.departments.includes("Sales"));
  assert.ok(r.departments.includes("Finance"));
  assert.ok(r.departments.includes("Success"));
  assert.deepEqual(r.leads, ["Finance", "Sales", "Growth"]);
  assert.ok(r.operators.includes("casa-sales"));
  assert.ok(r.operators.includes("casa-finance"));
});

test("a consumer app constrained on users leads on Growth", () => {
  const r = deriveRoster({ primary_type: "consumer", binding_constraint: "no_users" });
  assert.ok(r.departments.includes("Growth"));
  assert.ok(r.departments.includes("Data"));
  assert.ok(r.leads.includes("Growth"));
  assert.ok(r.operators.includes("casa-growth"));
  assert.ok(r.operators.includes("casa-marketer"));
});

test("a crypto project constrained on regulation pulls in Legal as the lead", () => {
  const r = deriveRoster({ primary_type: "crypto", binding_constraint: "regulatory_legal" });
  assert.ok(r.departments.includes("Legal"));
  assert.ok(r.departments.includes("Operations"));
  assert.deepEqual(r.leads, ["Legal"]);
  assert.ok(r.operators.includes("casa-operator"));
});

test("departments come back in canonical order and never duplicate", () => {
  const r = deriveRoster({ primary_type: "saas", binding_constraint: "no_revenue" });
  const idx = r.departments.map((d) => DEPARTMENTS.indexOf(d));
  assert.deepEqual(idx, [...idx].sort((a, b) => a - b));
  assert.equal(new Set(r.departments).size, r.departments.length);
});

test("the engine's computed lead_departments win over the archetype map", () => {
  // stage.mjs writes binding_constraint as an object with lead_departments; roster must honor it.
  const r = deriveRoster({ primary_type: "saas", binding_constraint: "regulatory_legal", lead_departments: ["Legal"] });
  assert.ok(r.departments.includes("Legal"), "Legal department instantiated for a regulatory company");
  assert.deepEqual(r.leads, ["Legal"]);
  assert.ok(r.operators.includes("casa-operator"));
});

test("casa-build routing: a department maps to its operators and a lead", () => {
  assert.deepEqual(operatorsForDepartment("Growth"), ["casa-growth", "casa-marketer", "casa-lifecycle"]);
  assert.equal(primaryOperator("Growth"), "casa-growth");
  assert.equal(primaryOperator("Finance"), "casa-finance");
  assert.equal(primaryOperator("Legal"), "casa-operator");
  assert.equal(primaryOperator("Nope"), null);
});

test("all 14 operator agents exist on disk and match the roster mapping", () => {
  const ops = allOperators();
  assert.equal(ops.length, 14, `expected 14 operators, got ${ops.length}`);
  for (const op of ops) assert.ok(existsSync(agentFile(op)), `missing agent file for ${op}`);
});

test("every operator a derived roster references is a real agent file", () => {
  for (const profile of [
    { primary_type: "saas", binding_constraint: "no_revenue" },
    { primary_type: "crypto", binding_constraint: "regulatory_legal" },
    { primary_type: "marketplace", binding_constraint: "no_users" },
  ]) {
    for (const op of deriveRoster(profile).operators) {
      assert.ok(existsSync(agentFile(op)), `roster references missing agent ${op}`);
    }
  }
});

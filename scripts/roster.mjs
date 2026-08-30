// Casa v4 - roster derivation: which departments and operator agents a company gets.
//
// Departments are NOT a fixed list; they are derived per company at casa-start on two
// axes (the round-2 design): the company TYPE picks the base set of departments, and the
// binding CONSTRAINT picks the LEAD departments (the ones the engine already tilts toward
// via stage.mjs's constraint pulse). The operator roster is then just the agents that
// staff those departments. Founders can override the result.
//
//   deriveRoster({ primary_type, traits, binding_constraint }) -> { departments, leads, operators }

export const DEPARTMENTS = ["Strategy", "Brand", "Product", "Engineering", "Data", "Growth", "Sales", "Success", "Finance", "Operations", "Legal"];

// Every company needs these regardless of type.
const BASE = ["Strategy", "Brand", "Product", "Engineering"];

// Company type -> the departments it additionally needs. Tunable policy table.
const TYPE_DEPARTMENTS = {
  saas: ["Data", "Growth", "Sales", "Success", "Finance"],
  "b2b-service": ["Sales", "Success", "Finance", "Operations"],
  marketplace: ["Growth", "Operations", "Data", "Finance"],
  ecommerce: ["Growth", "Operations", "Finance", "Success"],
  hardware: ["Operations", "Finance", "Growth"],
  content: ["Growth", "Data", "Finance"],
  consumer: ["Growth", "Data", "Finance"],
  crypto: ["Operations", "Finance", "Growth", "Legal"],
};

// Binding constraint -> the LEAD departments. Mirrors stage.mjs CONSTRAINT_PULSE so the
// roster and the engine's ranking tilt point at the same place.
const CONSTRAINT_LEAD = {
  no_users: ["Growth", "Strategy"],
  no_revenue: ["Finance", "Sales", "Growth"],
  runway_burn: ["Finance"],
  regulatory_legal: ["Legal"],
  tech_scale: ["Engineering"],
  hiring_capacity: ["Operations"],
};

// Business-definition traits that pull in a department even if the type did not.
const TRAIT_DEPARTMENTS = {
  b2b: ["Sales"],
  high_acv: ["Sales"],
  recurring_revenue: ["Success"],
  takes_payments: ["Finance"],
  local_service_only: ["Operations"],
};

// Department -> the operator agents that staff it. One agent can serve more than one dept.
export const DEPT_OPERATORS = {
  Strategy: ["casa-strategist", "casa-researcher"],
  Brand: ["casa-brand"],
  Product: ["casa-product"],
  Engineering: ["casa-engineer"],
  Data: ["casa-analyst"],
  Growth: ["casa-growth", "casa-marketer", "casa-lifecycle"],
  Sales: ["casa-sales"],
  Success: ["casa-success"],
  Finance: ["casa-finance"],
  Operations: ["casa-operator", "casa-partnership"],
  Legal: ["casa-operator"],
};

// All operator agents that should exist on disk (the union across departments).
export function allOperators() {
  return [...new Set(Object.values(DEPT_OPERATORS).flat())].sort();
}

// The operators that staff a department, and the lead (first) one casa-build routes to.
export function operatorsForDepartment(dept) { return DEPT_OPERATORS[dept] || []; }
export function primaryOperator(dept) { return (DEPT_OPERATORS[dept] || [])[0] || null; }

export function deriveRoster(profile = {}) {
  const { primary_type, traits = [], binding_constraint, lead_departments } = profile;
  const depts = new Set(BASE);
  for (const d of TYPE_DEPARTMENTS[primary_type] || []) depts.add(d);
  for (const t of traits) for (const d of TRAIT_DEPARTMENTS[t] || []) depts.add(d);

  // Prefer the engine's computed lead departments (stage.mjs writes them onto state.json's
  // binding_constraint object); fall back to the archetype map when only the string is known.
  const leads = (Array.isArray(lead_departments) && lead_departments.length)
    ? lead_departments
    : (CONSTRAINT_LEAD[binding_constraint] || []);
  for (const d of leads) depts.add(d);

  const departments = [...depts].sort((a, b) => DEPARTMENTS.indexOf(a) - DEPARTMENTS.indexOf(b));
  const operators = [...new Set(departments.flatMap((d) => DEPT_OPERATORS[d] || []))].sort();
  return { departments, leads, operators };
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) {
  const { readFileSync, writeFileSync, existsSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");
  const arg = process.argv[2];
  const write = process.argv.includes("--write");
  let profile = {}, brainDir = null;
  if (arg && existsSync(arg) && statSync(arg).isDirectory()) {
    // brainDir: type/traits live in profile.json, binding_constraint in state.json
    brainDir = arg;
    const read = (f) => (existsSync(join(brainDir, f)) ? JSON.parse(readFileSync(join(brainDir, f), "utf8")) : {});
    const p = read("profile.json"), s = read("state.json");
    // state.json's binding_constraint is an object { archetype, lead_departments, ... };
    // tolerate a bare string too.
    const bc = s.binding_constraint ?? p.binding_constraint;
    const archetype = bc && typeof bc === "object" ? bc.archetype : bc;
    const lead_departments = bc && typeof bc === "object" ? bc.lead_departments : undefined;
    profile = { primary_type: p.primary_type, traits: p.traits || [], binding_constraint: archetype, lead_departments };
  } else if (arg) {
    profile = JSON.parse(arg);
  }
  const roster = deriveRoster(profile);
  if (write && brainDir) {
    // Default every department to approve-first: nothing runs unannounced. A founder can
    // dial a department to "auto" later once they trust it for reversible work.
    const departments = Object.fromEntries(roster.departments.map((d) => [d, "approve_first"]));
    const dials = { default: "approve_first", departments, always_ask: ["spend_money", "go_public", "merge_to_main", "destructive"] };
    writeFileSync(join(brainDir, "dials.json"), JSON.stringify(dials, null, 2) + "\n");
    writeFileSync(join(brainDir, "roster.json"), JSON.stringify(roster, null, 2) + "\n");
  }
  console.log(JSON.stringify(roster, null, 2));
}

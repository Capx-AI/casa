// Casa v4 - Chief of Staff briefing logic. Pure and testable.
//
// The CoS is re-instantiated every session. It reads the business-state (cos-context),
// the ranked ready set (router nextActions), and the autonomy dials, then assembles the
// one briefing the founder acts on: the next move and who runs it, what is in flight
// across terminals, what is blocked waiting on the founder, and whether independent lanes
// could run in parallel. The skill (skills/casa-cos) does the IO and the dispatching;
// this module is the decision logic so it can be unit-tested.

import { primaryOperator } from "./roster.mjs";

// The autonomy posture for a department: its own dial, else the company default.
export function autonomyFor(dept, dials = {}) {
  return (dials.departments && dials.departments[dept]) || dials.default || "approve_first";
}

// Route one ranked action to the operator that runs it and the posture it runs under.
// Note: an "auto" department still stops at the always_ask gates - that is per-action,
// enforced at execution time, not here.
export function routeAction(action, dials = {}) {
  const department = action.department || null;
  return {
    id: action.id,
    title: action.title,
    department,
    operator: department ? primaryOperator(department) : null,
    autonomy: department ? autonomyFor(department, dials) : (dials.default || "approve_first"),
  };
}

// Assemble the founder-facing CoS briefing.
//   state   - cos-context businessState() output
//   actions - router nextActions(), ranked, each at least { id, title, department }
export function assembleBriefing(state = {}, actions = []) {
  const dials = state.autonomy || {};
  const routed = actions.map((a) => routeAction(a, dials));
  // Distinct department lanes among the ready set => a real fan-out opportunity.
  const lanes = [...new Set(routed.slice(0, 6).map((r) => r.department).filter(Boolean))];
  return {
    headline: routed[0] || null,          // the #1 move, who runs it, the posture
    also_ready: routed.slice(1, 4),
    in_flight: state.in_flight || [],      // running across every terminal (from the ledger)
    approvals: state.blocked || [],        // blocked on the founder (always-ask gates hit)
    parallelize: lanes.length >= 2 ? lanes : [],
    company: state.company || {},
  };
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) {
  // Demo / glue: node cos.mjs <businessState.json> <nextActions.json>
  const { readFileSync } = await import("node:fs");
  const state = JSON.parse(readFileSync(process.argv[2], "utf8"));
  const actions = process.argv[3] ? JSON.parse(readFileSync(process.argv[3], "utf8")) : [];
  console.log(JSON.stringify(assembleBriefing(state, actions), null, 2));
}

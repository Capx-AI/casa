#!/usr/bin/env node
// The Capx Casa stage engine. Deterministic: turns the answers from the casa-start
// interview into a business profile, a starting level, and the set of playbooks the
// founder has effectively already done (the seed). The LLM conducts the interview
// and maps free text onto the fixed option set; THIS file does the math.
//
//   node scripts/stage.mjs derive <answers.json>            -> prints {profile, start_level, completed_seed}
//   node scripts/stage.mjs apply  <answers.json> <brainDir> -> writes profile.json + state.json (seed) in the brain
//
// Library export deriveStage(answers, playbooks) is importable for tests.
//
// The seed lets an existing business skip work it has already done. Anything the
// founder names as a gap (Pass C of the interview) is left OUT of the seed, so the
// router surfaces it as a ready catch-up item at the current level. The level never
// drops below start_level (the floor is enforced by brain.mjs currentLevel), so a
// lower-level gap does not regress the company.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { select, STATE_FLAGS, PHASE0_IDS } from "./router.mjs";
import { matureNorthStar } from "./northstar.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
const levelKey = (l) => (l === "always-on" ? -1 : Number(l));

// Stage ladder. start_level is the level the founder is currently working in; the
// seed is every non-recurring member at a level BELOW it. Milestone flags are the
// state-flag traits a company at this tier has by definition, accumulated upward.
const TIERS = ["idea", "landing", "building", "launched", "revenue", "scaling"];
const TIER_START = { idea: 0, landing: 1, building: 2, launched: 4, revenue: 5, scaling: 6 };
const TIER_FLAGS = {
  idea: ["pre_idea_only"],
  landing: ["has_website", "has_landing_page"],
  building: ["has_repo", "has_deployed_app", "has_datastore"],
  launched: ["has_user_accounts", "has_live_traffic"],
  revenue: ["has_paying_customers", "has_revenue", "has_live_customers"],
  scaling: ["pmf_achieved", "runs_paid_media"],
};

function loadIndex() {
  return JSON.parse(readFileSync(join(repo, "playbooks", "_index.json"), "utf8")).playbooks;
}

// The do-or-die constraint a founder names maps to the key playbooks that address it. These are
// kept OUT of the seed (surfaced as ready catch-up) so the engine never hides the exact risk the
// founder flagged, and the constraint's pulse weight has a live target. Unknown/absent ids are
// simply ignored (a business that does not select that playbook is unaffected).
const CONSTRAINT_SURFACE = {
  regulatory_legal: ["kyc-aml-program", "tos-and-privacy-policy", "token-and-licensing-strategy", "security-baseline", "hardware-certification-and-compliance"],
  // EARLY money-validation plays lead so a pre-revenue company at building/landing has reachable,
  // promoted revenue work (willingness-to-pay, revenue model, a price smoke test, pre-sales/LOIs)
  // instead of falling through to generic foundation work; the mature pricing/unit-economics plays
  // (stage-gated above) follow for a revenue-stage company.
  no_revenue: ["willingness-to-pay-research", "revenue-model-selection", "pricing-smoke-test", "pre-sales-and-letters-of-intent", "pricing-research", "packaging-tier-design", "unit-economics", "pricing-page-copy-layout", "freemium-trial-decision", "ad-revenue-and-yield"],
  runway_burn: ["revenue-model-selection", "willingness-to-pay-research", "unit-economics", "financial-model-forecast", "pricing-research", "ad-revenue-and-yield"],
  tech_scale: ["observability-setup", "incident-response", "data-backup-recovery", "security-baseline"],
  // Forward-looking acquisition work, not backward L0 validation. The EARLY plays (first-users-
  // traction, beachhead) lead the list so a building/landing company with no users actually has
  // ready, promoted user-getting work instead of having it seeded-done beneath its stage.
  no_users: ["first-users-traction", "beachhead-selection", "landing-page-cro", "funnel-analysis", "marketplace-supply-acquisition", "hardware-preorder-demand-validation", "referral-and-virality-loops"],
  hiring_capacity: ["hiring-and-org-scaling", "services-delivery-and-utilization"],
};

// Work a company has effectively DONE by reaching a stage, even though the play sits AT its current
// level (so the level < start rule below does not catch it). A building company has chosen its stack
// and deployed; a launched company has run its launch. Seeding these kills the leakage where Casa
// tells a mid-build founder to "select a tech stack" or a live company to "plan a T-90 launch".
const STAGE_SEED = {
  building: ["tech-stack-selection", "hosting-deployment-setup"],
  launched: ["launch-plan-t90", "product-hunt-launch", "beta-program-management", "pr-press-launch"],
};

// Phase 0 distribution artifacts are local work the harness must actually produce.
// Never auto-complete them from a stage tier: Terminal publication will later check
// these nodes, and an assumed-done website would let a company skip the gate.
const NEVER_SEED = PHASE0_IDS;
function stageSeededIds(tier) {
  const out = new Set();
  const upto = TIERS.indexOf(tier);
  for (let i = 0; i <= upto; i++) for (const id of STAGE_SEED[TIERS[i]] || []) out.add(id);
  return out;
}

// Cumulative milestone flags for a tier. "idea" is exclusive (nothing shipped yet);
// every other tier inherits the flags of the tiers beneath it.
function milestoneFlags(tier) {
  if (tier === "idea") return [...TIER_FLAGS.idea];
  const upto = TIERS.indexOf(tier);
  const flags = new Set();
  for (let i = 1; i <= upto; i++) for (const f of TIER_FLAGS[TIERS[i]]) flags.add(f);
  return [...flags];
}

// The canonical vocabulary the catalog actually understands. Used to reject answers
// that drift from the real trait/type set (an interview or mapping bug).
function canonical(playbooks) {
  const traits = new Set(), types = new Set();
  for (const p of playbooks) {
    for (const t of p.applies_to?.requires_traits || []) traits.add(t);
    for (const t of p.applies_to?.excluded_traits || []) traits.add(t);
    for (const t of p.applies_to?.types || []) if (t !== "*") types.add(t);
  }
  return { traits, types };
}

// The types the interview offers and every downstream layer (northstar.mjs, roster.mjs)
// understands. Deliberately NOT the catalog's applies_to union: the catalog also matches on
// audience words like "b2b", and accepting those here silently mis-derives the north star.
export const CANONICAL_TYPES = ["saas", "marketplace", "ecommerce", "b2b-service", "crypto", "consumer", "content", "hardware"];
const CONSTRAINT_ARCHETYPES = ["no_users", "no_revenue", "runway_burn", "regulatory_legal", "tech_scale", "hiring_capacity"];

export function validateAnswers(answers, playbooks) {
  if (!answers || typeof answers !== "object") throw new Error("answers must be an object");
  if (!TIERS.includes(answers.tier)) {
    throw new Error(`unknown stage tier "${answers.tier}" (expected one of ${TIERS.join(", ")})`);
  }
  if (answers.type && !CANONICAL_TYPES.includes(answers.type)) {
    throw new Error(`unknown business type "${answers.type}" (expected one of ${CANONICAL_TYPES.join(", ")})`);
  }
  if (answers.secondary_type && !CANONICAL_TYPES.includes(answers.secondary_type)) {
    throw new Error(`unknown secondary type "${answers.secondary_type}" (expected one of ${CANONICAL_TYPES.join(", ")}, or empty)`);
  }
  if (answers.north_star_archetype && !(answers.north_star_archetype in NS_PROMOTE)) {
    throw new Error(`unknown north_star_archetype "${answers.north_star_archetype}" (expected one of ${Object.keys(NS_PROMOTE).join(", ")})`);
  }
  if (answers.constraint_archetype && !CONSTRAINT_ARCHETYPES.includes(answers.constraint_archetype)) {
    throw new Error(`unknown constraint_archetype "${answers.constraint_archetype}" (expected one of ${CONSTRAINT_ARCHETYPES.join(", ")})`);
  }
  const { traits } = canonical(playbooks);
  for (const t of answers.traits || []) {
    if (!traits.has(t)) throw new Error(`unknown trait "${t}" (not in the catalog vocabulary)`);
  }
  for (const g of answers.gaps || []) {
    if (!playbooks.some((p) => p.id === g)) {
      const near = playbooks.filter((p) => p.id.includes(g) || g.includes(p.id)).map((p) => p.id).slice(0, 3);
      const hint = near.length ? ` Did you mean: ${near.join(", ")}?` : " Gap values must be playbook ids from playbooks/_index.json.";
      throw new Error(`gap "${g}" is not a known playbook id.${hint}`);
    }
  }
}

// answers: {
//   type, secondary_type?, company_name?, one_liner?, icp?, monetization?,
//   traits: [business-definition traits], tier, gaps?: [playbook ids NOT done]
// }
export function deriveStage(answers, playbooks) {
  validateAnswers(answers, playbooks);
  const start_level = TIER_START[answers.tier];
  // Software milestone flags imply a codebase, so only a software business inherits
  // has_repo / has_deployed_app / has_datastore. A non-software business does not.
  const builds = (answers.traits || []).includes("builds_software");
  // Monetization implies payment traits even if the trait list omitted them: a subscription
  // business takes payments and has recurring revenue; a one-time or take-rate business takes
  // payments. Without this, a "subscription" SaaS whose answers lacked takes_payments lost its
  // entire pricing / unit-economics / churn track (all gated on takes_payments).
  const mon = answers.monetization;
  const monTraits = mon === "subscription" ? ["takes_payments", "recurring_revenue"]
    : (mon === "one-time" || mon === "transaction-fee") ? ["takes_payments"]
    : mon === "ads" ? ["ad_supported"] : [];
  const traitSet = new Set([...(answers.traits || []), ...monTraits, ...milestoneFlags(answers.tier)]);
  // Only the flags that imply an actual codebase are software-exclusive. has_user_accounts
  // and has_live_traffic are NOT: a launched store or local business genuinely has customer
  // accounts and live traffic, so stripping them wrongly dead-ended traffic/account-gated
  // loops (ab-testing) for non-software businesses.
  if (!builds) for (const f of ["has_repo", "has_deployed_app", "has_datastore"]) traitSet.delete(f);
  const traits = [...traitSet];

  const profile = {
    company_name: answers.company_name || "",
    confirmed: true,
    primary_type: answers.type || "",
    secondary_type: answers.secondary_type || "",
    traits,
    icp: answers.icp || "",
    monetization: answers.monetization || "",
    one_liner: answers.one_liner || "",
  };
  // The mature north star this business steers by (display + initial-pulse seeding only).
  profile.north_star = matureNorthStar(profile);

  const gaps = new Set(answers.gaps || []);
  // The founder's do-or-die constraint surfaces its key work: never silently pre-complete the
  // exact risk the founder named (e.g. a crypto company that flagged regulatory_legal must SEE its
  // KYC/licensing work, not have the seed mark it done). These ids are excluded from the seed like
  // a named gap, so they surface as ready catch-up items and the constraint's pulse weight has a
  // live target to lift instead of scaling nothing.
  const surface = new Set(CONSTRAINT_SURFACE[answers.constraint_archetype] || []);
  const { members } = select(playbooks, profile);
  const memberIds = new Set(members.map((m) => m.id));
  // Gaps the founder named that do not apply to this business (wrong type or trait): they
  // would be neither seeded nor surfaced, so flag them rather than dropping them silently.
  const gaps_not_applicable = [...gaps].filter((g) => !memberIds.has(g));
  const stageDone = stageSeededIds(answers.tier);
  const completed_seed = members
    .filter(
      (m) =>
        m.level !== "always-on" && // Foundations gates are never auto-completed
        !m.recurring && // loops are never "done", they come due
        (levelKey(m.level) < start_level || stageDone.has(m.id)) && // below stage, or done-by-reaching-stage
        !gaps.has(m.id) && // a named gap stays open as a catch-up item
        !surface.has(m.id) && // the founder's do-or-die constraint work stays visible
        !NEVER_SEED.has(m.id) && // Phase 0 local artifacts are never assumed done
        // only mark done what the business could actually have done: its state-flag
        // requirements must be met (do not seed security work for a company with no
        // repo, or onboarding for one with no user accounts).
        (m.applies_to.requires_traits || []).every((r) => !STATE_FLAGS.has(r) || traitSet.has(r)),
    )
    .map((m) => m.id);
  // Answers can PROVE a play done even when the constraint surface would keep it visible: a
  // business with LIVE revenue that told us how it charges has selected its revenue model, so
  // never headline "Revenue Model Selection" at a company already earning subscription revenue.
  // Live revenue is the proof; a pre-revenue declaration keeps the play open (the model is a
  // hypothesis until someone pays). Proof beats the surface exclusion, never a named gap.
  if (["revenue", "scaling"].includes(answers.tier) && ["subscription", "one-time", "transaction-fee", "ads"].includes(answers.monetization)) {
    for (const id of ["revenue-model-selection"]) {
      if (memberIds.has(id) && !gaps.has(id) && !completed_seed.includes(id)) completed_seed.push(id);
    }
  }

  const binding_constraint = deriveBindingConstraint(answers, playbooks, memberIds);
  return { profile, start_level, completed_seed, gaps_not_applicable, binding_constraint };
}

// The INITIAL pulse, derived from the Core-pass intake answers, so the very first build map
// is business-aware (a retention-focused founder sees retention work lead) before any manual
// pulse cascade. Pure and table-driven; byDepartment keys use the 11-department vocabulary so
// the weights actually bite. With no archetype/constraint it returns a neutral pulse.
// Department tilts are kept GENTLE (<= ~1.4) on purpose: a broad department boost must not
// leapfrog a do-or-die (existential) play in another department. The criticality fitFactor
// (existential 1.5) plus a gentle tilt keeps the do-or-die work on top while still steering
// toward the founder's north-star department. A founder's EXPLICIT pulse can go stronger.
// The specific plays that MOVE each north star. These are promoted (the strong promote weight) so
// the founder's declared focus actually headlines, instead of a blunt whole-department boost that
// floods the queue with every content loop. A promoted existential play clearly leads; a promoted
// non-existential one rises near the top without burying do-or-die work.
// Each archetype lists the mature plays that move its metric AND a couple of early-stage precursors,
// so a pre-launch founder who declares the focus still sees a promoted, reachable proxy (the mature
// metric play is stage-gated above them). A promoted play that is seeded-done or above level simply
// does not surface, so the extra precursors are harmless at mature stages.
const NS_PROMOTE = {
  activation: ["activation-rate-optimization", "first-run-aha-experience", "onboarding-flow-design", "prd-drafting", "mvp-scoping"],
  engagement_retention: ["cohort-retention-analysis", "churn-diagnosis-winback", "nps-csat-program"],
  revenue_mrr: ["unit-economics", "account-expansion-and-upsell", "pricing-research"],
  acquisition_growth: ["funnel-analysis", "landing-page-cro", "creative-testing", "beachhead-selection", "positioning-canvas"],
  conversion: ["landing-page-cro", "activation-rate-optimization", "pricing-page-copy-layout"],
  gmv_liquidity: ["marketplace-liquidity-balancing", "marketplace-supply-acquisition", "marketplace-trust-and-safety"],
  efficiency_unit_econ: ["unit-economics", "financial-model-forecast", "pricing-research"],
  local_reputation: ["local-reviews-reputation", "local-google-business-profile"],
};
// A MILD department tilt now (the promotes carry the headline), so related work gets texture without
// the whole department flooding the top.
const NS_DEPT = {
  activation: { Product: 1.2, Data: 1.15 },
  engagement_retention: { Success: 1.2, Data: 1.2 },
  revenue_mrr: { Finance: 1.2, Success: 1.15 },
  acquisition_growth: { Growth: 1.2, Data: 1.1 },
  conversion: { Growth: 1.15, Product: 1.2 },
  gmv_liquidity: { Operations: 1.2, Growth: 1.15 },
  efficiency_unit_econ: { Finance: 1.2, Data: 1.15 },
  local_reputation: { Success: 1.2, Growth: 1.15 },
};
const CONSTRAINT_DELTA = {
  no_users: { Growth: 0.2, Strategy: 0.2 },
  no_revenue: { Finance: 0.2, Sales: 0.15, Growth: 0.15 },
  runway_burn: { Finance: 0.25 },
  regulatory_legal: { Legal: 0.4 },
  tech_scale: { Engineering: 0.3 },
  hiring_capacity: { Operations: 0.3 },
};
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

// The constraint's lead departments: the ones its pulse delta already tilts, strongest first,
// CAPPED AT 4 (co-leading is honest -- early companies are multi-headed -- but a "lead set" of
// every department is no lead at all). Derived from CONSTRAINT_DELTA so there is one source of
// truth for which functions a constraint mobilizes. Unknown archetype => no leads.
export function leadDepartments(archetype) {
  const d = CONSTRAINT_DELTA[archetype];
  if (!d) return [];
  return Object.entries(d).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([dept]) => dept);
}

// The win gap (Phase 2): how far the company is from its target on the constraint metric, in [0,1].
// A STRUCTURED win_definition {metric_id, current_value, target_value, deadline} yields a real gap
// (1 = nothing done yet, 0 = already at target); a free-text or missing win yields 0 (no urgency,
// so the ranking stays byte-identical to a constraint with no gap). This is what makes two companies
// with the same archetype but different distance-to-target rank their surface work differently.
export function winGap(win) {
  if (!win || typeof win !== "object") return 0;
  const c = Number(win.current_value), t = Number(win.target_value);
  if (!Number.isFinite(c) || !Number.isFinite(t) || t <= 0) return 0;
  return Math.min(Math.max((t - c) / t, 0), 1);
}

// The BINDING CONSTRAINT as first-class state (v2). Read DIRECTLY by router.nextActions so the
// constraint keeps steering even if pulse.json is deleted or regenerated. surface_ids are the
// constraint's key plays that are MEMBERS of this company's build (so the list is real work, not a
// generic label). win_definition is carried through as given (a structured object or a string);
// win_gap is the derived [0,1] distance-to-target the router uses as a surface-play urgency. Returns
// null when the founder named no constraint -- the caller must then fail loud, never serve generic.
export function deriveBindingConstraint(answers, playbooks, memberIds) {
  const archetype = answers.constraint_archetype || null;
  if (!archetype) return null;
  const members = memberIds || new Set(playbooks.map((p) => p.id));
  const surface_ids = (CONSTRAINT_SURFACE[archetype] || []).filter((id) => members.has(id));
  return {
    archetype,
    surface_ids,
    lead_departments: leadDepartments(archetype),
    win_definition: answers.win_definition || "",
    win_gap: winGap(answers.win_definition),
  };
}

export function deriveInitialPulse(answers, playbooks) {
  const byDepartment = {};
  const nsa = answers.north_star_archetype;
  if (nsa && NS_DEPT[nsa]) for (const [d, w] of Object.entries(NS_DEPT[nsa])) byDepartment[d] = w;
  const con = answers.constraint_archetype;
  if (con && CONSTRAINT_DELTA[con]) for (const [d, delta] of Object.entries(CONSTRAINT_DELTA[con])) byDepartment[d] = (byDepartment[d] ?? 1) + delta;
  // Clamp the AUTO department tilt to 1.4 so a constraint delta can never push a department high
  // enough for a core play to leapfrog an existential one. A founder's EXPLICIT pulse is not bound.
  for (const d of Object.keys(byDepartment)) byDepartment[d] = clamp(byDepartment[d], 0.25, 1.4);
  const ids = new Set(playbooks.map((p) => p.id));
  // The archetype's specific north-star plays are PROMOTED so the founder's declared focus actually
  // headlines (the department tilt alone could not cross the existential floor and the headline never
  // moved). Only real, member-eligible ids are kept.
  const nsPromote = (nsa && NS_PROMOTE[nsa] ? NS_PROMOTE[nsa] : []).filter((id) => ids.has(id));
  // The BINDING CONSTRAINT promotes its own key plays too, not just a faint department tilt. This is
  // the fix for the eval's #1 finding ("the constraint is decorative, not a sort key"): a no_users
  // company headlines first-users/beachhead; a regulatory_legal company headlines KYC/licensing; a
  // no_revenue company headlines pricing. The constraint plays lead the list (CONSTRAINT_SURFACE is
  // already kept out of the seed), so the founder's do-or-die risk is the work, not a label.
  const conPlays = (con && CONSTRAINT_SURFACE[con] ? CONSTRAINT_SURFACE[con] : []).filter((id) => ids.has(id));
  const promote_ids = [...new Set([...conPlays, ...nsPromote])];
  const demote_ids = (answers.anti_priorities || []).filter((ap) => ids.has(ap));
  const weights = { default: 1 };
  if (Object.keys(byDepartment).length) weights.byDepartment = byDepartment;
  if (promote_ids.length) weights.promote_ids = promote_ids;
  if (demote_ids.length) weights.demote_ids = demote_ids;
  return { weights, north_star_archetype: nsa || null, constraint: con || null, win: answers.win_definition || "" };
}

// ---- CLI ----
function main() {
  const [cmd, answersFile, brainDir] = process.argv.slice(2);
  if (!cmd || !answersFile) {
    console.error("usage: stage.mjs derive <answers.json> | apply <answers.json> <brainDir>");
    process.exit(2);
  }
  const playbooks = loadIndex();
  const answers = JSON.parse(readFileSync(answersFile, "utf8"));
  const result = deriveStage(answers, playbooks);

  if (cmd === "derive") {
    console.log(JSON.stringify(result, null, 2));
  } else if (cmd === "apply") {
    if (!brainDir) {
      console.error("apply needs a brain directory");
      process.exit(2);
    }
    writeFileSync(join(brainDir, "profile.json"), JSON.stringify(result.profile, null, 2));
    // Preserve any loop history already recorded; set the seed and the level floor.
    const statePath = join(brainDir, "state.json");
    const prev = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) || {} : {};
    const state = { ...prev, completed: result.completed_seed, start_level: result.start_level };
    // The binding constraint is first-class state, read directly by the router (survives pulse.json
    // regeneration). Only written when the founder named one; its absence is what triggers fail-loud.
    if (result.binding_constraint) state.binding_constraint = result.binding_constraint;
    // Start every recurring loop's cadence at onboarding day. Without this, a brand-new company
    // opens its first session with every loop "overdue since forever" and the briefing drowns.
    if (!prev.loops) {
      const loopsFile = join(brainDir, "loops.json");
      if (existsSync(loopsFile)) {
        const today = new Date().toISOString().slice(0, 10);
        state.loops = Object.fromEntries(
          (JSON.parse(readFileSync(loopsFile, "utf8")).loops || []).map((l) => [l.id, today]),
        );
      }
    }
    writeFileSync(statePath, JSON.stringify(state, null, 2));
    // Seed the initial business-aware pulse, but never clobber a richer hand-authored one.
    const pulsePath = join(brainDir, "pulse.json");
    if (!existsSync(pulsePath)) writeFileSync(pulsePath, JSON.stringify(deriveInitialPulse(answers, playbooks), null, 2));
    console.log(
      `seeded ${brainDir}: tier ${answers.tier}, start level ${result.start_level}, ` +
        `${result.completed_seed.length} playbooks pre-completed. Run brain.mjs sync next.`,
    );
    if (result.gaps_not_applicable.length) {
      console.warn(
        `note: these named gaps do not apply to this business (wrong type or trait) and were ignored: ` +
          result.gaps_not_applicable.join(", "),
      );
    }
  } else {
    console.error(`unknown command: ${cmd}`);
    process.exit(2);
  }
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) main();

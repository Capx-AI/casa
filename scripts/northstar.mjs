// Business-type north-star derivation. Pure and zero-dependency (no imports). Used for
// founder-facing display (NOW.md, build-map, the company CLAUDE.md block) and to seed the
// initial pulse. It deliberately does NOT feed a score boost: model-awareness in the
// ranking is carried by model_fit + criticality (see router.mjs), so the north star is a
// legibility + onboarding signal, not a fourth scoring channel.
//
//   matureNorthStar(profile) -> { growth, retention, guardrails }   the mature destination
//   band(level)              -> "validation" | "activation" | "retention" | "scale"
//   northStar(profile, level) -> { band, metric, label, mature_growth, mature_retention, guardrails }

// Closed metric vocabulary with human labels (no em-dashes in any label).
const METRIC_LABELS = {
  validated_demand: "validated demand",
  activation_rate: "activation rate",
  arr: "ARR",
  nrr: "net revenue retention",
  mrr: "MRR",
  sub_retention: "subscription retention",
  gmv: "GMV",
  match_rate: "match rate",
  conversion: "conversion rate",
  tpv: "total payment volume",
  net_revenue: "net revenue",
  repeat_purchase_rate: "repeat-purchase rate",
  dau: "daily active users",
  mau: "monthly active users",
  dau_mau: "DAU/MAU stickiness",
  arpu: "ARPU",
  protocol_revenue: "protocol revenue",
  active_wallets: "active wallets",
  wallet_retention: "wallet retention",
  booked_revenue: "booked revenue",
  utilization: "utilization",
  ltv_cac: "LTV to CAC",
  gross_margin: "gross margin",
  logo_churn: "logo churn",
  take_rate: "take rate",
  tvl: "TVL",
  attach_rate: "attach rate",
  repeat_engagement: "repeat engagement",
  bookings: "bookings",
  local_rebooking: "rebooking rate",
  reviews_rating: "reviews rating",
};
const METRIC_IDS = new Set(Object.keys(METRIC_LABELS));
const metricLabel = (id) => METRIC_LABELS[id] || id;

const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const levelKey = (l) => (l === "always-on" ? -1 : Number(l));

// The MATURE north star a modern operator would steer by for this business, by type then
// monetization then audience. Total over the catalog type vocabulary: every fork has a
// default so an unknown/blank type still resolves.
export function matureNorthStar(profile) {
  const type = profile.primary_type || "";
  const traits = new Set(arr(profile.traits));
  const mon = profile.monetization || "";
  const audience = traits.has("b2b") || traits.has("high_acv") ? "b2b" : "b2c";
  const subscription = mon === "subscription" || traits.has("recurring_revenue");
  const takesPayments = traits.has("takes_payments") || mon === "one-time" || mon === "transaction-fee";

  let growth, retention, guardrails;
  switch (type) {
    case "saas":
      if (subscription && audience === "b2b") { growth = "arr"; retention = "nrr"; guardrails = ["logo_churn", "ltv_cac"]; }
      else { growth = "mrr"; retention = "sub_retention"; guardrails = ["ltv_cac", "gross_margin"]; }
      break;
    case "marketplace":
      growth = "gmv"; retention = "match_rate"; guardrails = ["take_rate", "repeat_purchase_rate"];
      break;
    case "b2b-service":
      growth = "booked_revenue"; retention = "utilization"; guardrails = ["gross_margin", "ltv_cac"];
      break;
    case "ecommerce":
    case "hardware":
      if (subscription) { growth = "mrr"; retention = "sub_retention"; guardrails = ["gross_margin", "repeat_purchase_rate"]; }
      else { growth = "net_revenue"; retention = "repeat_purchase_rate"; guardrails = ["gross_margin", "ltv_cac"]; }
      break;
    case "content":
      if (subscription) { growth = "mrr"; retention = "sub_retention"; guardrails = ["arpu", "dau_mau"]; }
      else { growth = "mau"; retention = "dau_mau"; guardrails = ["arpu", "repeat_engagement"]; }
      break;
    case "consumer":
      if (subscription) { growth = "mrr"; retention = "sub_retention"; guardrails = ["ltv_cac", "dau_mau"]; }
      else if (takesPayments) { growth = "net_revenue"; retention = "repeat_purchase_rate"; guardrails = ["ltv_cac", "gross_margin"]; }
      else { growth = "dau"; retention = "dau_mau"; guardrails = ["arpu", "repeat_engagement"]; }
      break;
    case "crypto":
      // A subscription crypto business (e.g. B2B infra/SaaS) steers by recurring revenue, not
      // wallet metrics; only a transactional/consumer protocol steers by wallets/protocol revenue.
      if (subscription && audience === "b2b") { growth = "arr"; retention = "nrr"; guardrails = ["logo_churn", "ltv_cac"]; }
      else if (subscription) { growth = "mrr"; retention = "sub_retention"; guardrails = ["ltv_cac", "active_wallets"]; }
      else if (mon === "transaction-fee") { growth = "protocol_revenue"; retention = "wallet_retention"; guardrails = ["tvl", "active_wallets"]; }
      else { growth = "active_wallets"; retention = "wallet_retention"; guardrails = ["tvl", "repeat_engagement"]; }
      break;
    default:
      growth = "net_revenue"; retention = "repeat_purchase_rate"; guardrails = ["gross_margin", "ltv_cac"];
  }

  // A single-location, in-person service steers by bookings and rebooking, not by software
  // metrics or staffing utilization. local_service_only is a trait on consumer/b2b-service.
  if (traits.has("local_service_only")) {
    growth = "bookings"; retention = "local_rebooking"; guardrails = ["reviews_rating", "repeat_engagement"];
  }
  return { growth, retention, guardrails };
}

// The active north-star band for the current level. Pre-PMF you steer by demand and
// activation (never scale a leaky bucket); at first customers by retention; at scale by
// the mature growth metric. Aligned to the achievedFlags milestone grants.
export function band(level) {
  const k = levelKey(level);
  if (k <= 1) return "validation";   // idea / landing: prove demand exists
  if (k <= 4) return "activation";   // building -> launch: get users to first value
  if (k === 5) return "retention";   // first customers: keep them
  return "scale";                    // scale acquisition / growth
}

// The stage-resolved north star: which one number the founder should watch right now,
// plus the mature destination it is heading toward.
export function northStar(profile, level) {
  const mature = matureNorthStar(profile);
  const b = band(level);
  const type = profile.primary_type || "";
  const traits = new Set(profile.traits || []);
  // The leading metric while pre-PMF is TYPE-AWARE, not a generic SaaS "activation rate": a
  // marketplace watches matched transactions, a services firm utilization, a content/ads business
  // engagement, a local business bookings. Default (saas/consumer/ecommerce/hardware) activates to
  // first value. This is the fix for "a marketplace at building stage is told its metric is activation".
  const mon = profile.monetization || "";
  const activationMetric =
    traits.has("local_service_only") ? "bookings" :
    type === "marketplace" ? "match_rate" :
    type === "b2b-service" ? "utilization" :
    (type === "content" && mon !== "subscription") ? "dau_mau" :
    // A store activates on first purchase (conversion), not SaaS "activation".
    (type === "ecommerce" && mon !== "subscription") ? "conversion" :
    // A payments/fintech business (transaction-fee SaaS) leads on volume flowing through it.
    (type === "saas" && mon === "transaction-fee") ? "tpv" :
    // A transactional protocol leads on assets/usage on-chain, not SaaS activation.
    (type === "crypto" && mon !== "subscription") ? "tvl" :
    "activation_rate";
  const metric =
    b === "validation" ? "validated_demand" :
    b === "activation" ? activationMetric :
    b === "retention" ? mature.retention :
    mature.growth;
  return {
    band: b,
    metric,
    label: metricLabel(metric),
    mature_growth: mature.growth,
    mature_growth_label: metricLabel(mature.growth),
    mature_retention: mature.retention,
    mature_retention_label: metricLabel(mature.retention),
    guardrails: mature.guardrails,
  };
}

// The per-DEPARTMENT north star: a DISPLAY-ONLY projection of the one company north star onto each
// function (the driver tree). It is type-aware where it matters (Product activation, Growth, Success
// retention, Finance guardrails all read the derived mature metric) and fixed where it does not. It
// is NOT fed to any score (the eval proved a per-department metric is itself a static template; only
// the binding constraint sorts), so this is legibility and the board's branch labels, nothing more.
const DEPT_NORTH_STAR = {
  Strategy: () => "binding-constraint burndown",
  Product: (m, ns) => `${ns.band === "scale" ? ns.label : "activation"} to first value`,
  Engineering: () => "ship cadence at green reliability",
  Data: () => "decision instrumentation coverage",
  Growth: (m) => `${metricLabel(m.growth)} via activated acquisition`,
  Sales: () => "pipeline to closed-won",
  Success: (m) => metricLabel(m.retention),
  Finance: (m) => `runway months and ${metricLabel(m.guardrails[0] || "gross_margin")}`,
  Legal: () => "regulatory surface cleared",
  Operations: () => "cost-to-serve and loop hygiene",
  Brand: () => "message resonance",
};
export function deptNorthStar(profile, department, level = 0) {
  const fn = DEPT_NORTH_STAR[department];
  if (!fn) return null;
  return fn(matureNorthStar(profile), northStar(profile, level));
}

export { METRIC_IDS, metricLabel };

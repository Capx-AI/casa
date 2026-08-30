---
id: account-expansion-and-upsell
title: Account Expansion and Upsell
level: 6
summary: Grow net revenue retention on offense through upsell, cross-sell, seat and usage expansion, and QBR-driven account growth in the existing base.
applies_to:
  types:
    - saas
    - marketplace
    - b2b-service
    - crypto
  requires_traits:
    - recurring_revenue
  excluded_traits:
    - pre_idea_only
relevance: core
department: Sales
criticality: core
existential_at: [scaling]
model_fit: [recurring, sales_led]
selection_hint: The offense side of net revenue retention. Run once there is recurring revenue and a retained base; the cheapest revenue is expansion inside accounts the company already serves. Distinct from churn defense.
action: "Segment healthy accounts by headroom, then run a QBR on your top five to surface and agree the next expansion."
depends_on: []
soft_after: []
produces:
  - expansion_motion
consumes:
  - retention_report
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: expansion-motion-live
---
# Account Expansion and Upsell

RECURRING. Net revenue retention has an offense and a defense. Churn work defends
the base; this play grows it. Once a business has recurring revenue and a retained
base, the largest and cheapest revenue is expansion inside accounts the company
already serves: upsell to higher tiers, cross-sell of adjacent products, seat and
usage growth, and account-led growth driven by quarterly business reviews. This is
the motion that pushes net revenue retention above 100 percent.

## Procedure

1. Read the base from `retention_report`. Segment existing accounts by health,
   product usage, and headroom (unused seats, tiers below fit, adjacent needs unmet).
   Expansion targets the healthy, growing accounts, not the at-risk ones, which
   belong to the churn play.
2. Map the expansion paths for the model: tier upgrades, seat expansion, usage-based
   growth, and cross-sell of adjacent products. Quantify the revenue headroom of each
   path so the motion chases the largest pools first.
3. Instrument expansion triggers: usage thresholds, seat saturation, feature
   adoption, and renewal windows that signal readiness. Route each trigger to an
   owner with a play, so expansion is prompted by account signal rather than by a
   calendar guess.
4. Run the QBR motion on the top accounts: review the outcomes delivered against the
   account's goals, surface the next expansion, and agree a joint plan. The QBR is
   where account growth is earned, not pitched.
5. Track net revenue retention, gross retention, and expansion revenue as a cohort,
   and attribute each expansion to its trigger and play so the motion compounds on
   what works. Record the motion, the triggers, and the results in
   `expansion_motion`.

## Output

`expansion_motion`: the account segmentation, the expansion-path map and headroom,
the trigger-to-play routing, the QBR cadence, and the net-revenue-retention and
expansion-revenue tracking, written to the company brain. Cadence: a monthly
expansion review of triggered accounts and a quarterly business review on the top
accounts by revenue and headroom, with an off-cadence motion on a usage-threshold or
renewal trigger. Feeds the revenue forecast and the CEO dashboard.

## Rules

- Expansion is offense; it targets healthy accounts with headroom. At-risk accounts
  go to churn diagnosis, not to an upsell.
- Expand on delivered value. A QBR that cannot show outcomes already delivered has
  not earned the next purchase.
- Net revenue retention above 100 percent is the goal: the existing base grows
  faster than it churns. Measure it as a cohort, not as a blended snapshot.

Deepen this motion as the base grows rather than starting a parallel one per product.
Each new expansion path joins the same tracked motion.

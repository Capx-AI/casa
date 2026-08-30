---
id: meta-ads
title: Meta Ads
level: 6
summary: "Run Meta as a machine-learning platform: consolidated structure, broad targeting, diverse creative supply, and pristine signal post-iOS."
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
selection_hint: Run post-PMF once analytics, event taxonomy, and attribution exist, and Business Manager plus pixel/CAPI (EMQ high) are live. Strong for B2C/DTC volume.
depends_on:
  - analytics-stack-setup
  - event-taxonomy-design
soft_after:
  - growth-loop-design
  - attribution-modeling
  - landing-page-cro
  - creative-testing
produces:
  - meta_ads_program
consumes:
  - analytics_stack
  - event_taxonomy
  - optimized_landing_page
effort: L
leverage: high
reversibility: easy
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: paid-channel-live
---
# Meta Ads

Meta is a machine-learning delivery platform: creative is the new targeting. Abandon
hunting for the right audience via granular interests; feed the machine clean signals,
broad audiences for liquidity, and genuinely distinct creative concepts. The Andromeda
update penalizes near-duplicate ads, so diversity across format, style, angle, and
talent is required to scale.

## Procedure

1. Verify signal first. Business Manager, pixel, and CAPI with event deduplication;
   push for a high Event Match Quality score before spending.
2. Use a two-campaign structure: a Scaling campaign (Advantage+/CBO, 70 to 80% of
   budget, 1 to 3 broad ad sets, graduated winners only) and a Testing campaign (ABO,
   20 to 30%, one ad set per distinct concept, broad-only, 3 to 5 active tests).
3. Cap existing-customer budget on Advantage+ Shopping (5 to 10%) to force new-customer
   acquisition and protect incrementality.
4. Build the creative supply chain across the four forces (format, visual style,
   messaging angle, talent); graduate only proven concepts into Scaling.
5. Optimize: consolidate when campaigns exceed ~5; keep testing budget at 20%+ to
   combat fatigue; measure on incrementality, not just platform ROAS.

## Output

`meta_ads_program`: live consolidated campaign structure with clean signal, a creative
testing engine, and an optimization cadence, recorded in the company brain.

## Rules

- Recurring. Operate continuously; weekly creative and budget review.
- Human gate on spend. Budget commitments and increases escalate per HITL.
- Never run 068 + 069 + 070 before attribution (036) exists; channel collisions make
  it impossible to tell what works.

Full Andromeda detail, structure decision tree, and creative anatomy in the source
draft above. Condense, do not pad.

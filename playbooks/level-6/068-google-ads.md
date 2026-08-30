---
id: google-ads
title: Google Ads
level: 6
summary: Stand up and optimize Google Search and PMax with intent-based structure, conversion tracking, Smart Bidding, and negative keyword hygiene.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
selection_hint: Run post-PMF once analytics, event taxonomy, and attribution exist. Demand capture for categories where buyers already search; needs conversion data to optimize.
depends_on:
  - analytics-stack-setup
  - event-taxonomy-design
soft_after:
  - growth-loop-design
  - attribution-modeling
  - landing-page-cro
produces:
  - google_ads_program
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
# Google Ads

Google Ads is demand capture: reach buyers already searching the category. Modern
structure is intent-based campaign architecture with algorithmic data pooling, not
keyword granularity. The goal of structure is to give the algorithm maximum signal
(at least ~30 conversions/month per campaign to exit the learning phase), not to give
a human maximum control.

## Procedure

1. Verify conversion tracking before any spend. Primary conversion actions active;
   offline conversion import wired from the CRM for B2B (uploads within 48h of stage change).
2. Structure campaigns by intent tier (brand, high-intent non-brand, competitor,
   problem-aware) and objective; organize ad groups by landing page and creative theme.
3. Select bidding. Start with enough budget per campaign to pool 30+ conversions/month;
   move to Smart Bidding (tCPA/tROAS, value-based) once data stabilizes.
4. Manage keywords and negatives. Keep irrelevant-query spend under ~15% by sampling
   the Search Term Report and adding negatives continuously.
5. Run PMax for ecommerce with a clean Merchant Center feed; RSAs at Good/Excellent Ad Strength.
6. Optimize on a weekly/monthly cadence; detect failure modes (learning-phase churn,
   QS decay, budget under/over-utilization).

## Output

`google_ads_program`: live, tracked campaigns with intent-based structure, working
bid strategy, and an optimization cadence, recorded in the company brain.

## Rules

- Recurring. Operate continuously: weekly checks, monthly optimization cycle, re-eval
  on any budget change above 30%.
- Human gate on spend. Budget commitments and increases escalate per HITL.
- Never scale paid before analytics and event taxonomy exist; you would optimize against noise.

Full account architecture debate, bidding rules, and audit checklist in the source
draft above. Condense, do not pad.

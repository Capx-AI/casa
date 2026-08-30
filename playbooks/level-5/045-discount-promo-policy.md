---
id: discount-promo-policy
title: Discount & Promo Policy
level: 5
summary: Set discount guardrails that protect ARPU, treating every discount as a bilateral exchange with a margin floor and a give-to-get.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits: []
relevance: recommended
department: Finance
criticality: growth
selection_hint: Install once a list price and gross margin exist, before the sales motion starts giving discounts. A standing guardrail, not a one-off campaign.
depends_on:
  - pricing-research
  - packaging-tier-design
soft_after:
  - unit-economics
produces:
  - discount_policy
consumes:
  - pricing_tiers
  - unit_economics
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: revenue-engine-tuned
---
# Discount & Promo Policy

A discount is a bilateral transaction, not a unilateral concession. When you cut
price you are buying something: a longer commitment, upfront cash, a reference, or a
competitive displacement. If you cannot name what you are buying, do not discount.
Urgency beats discounts; the best discounts create urgency.

## Procedure

1. Compute the financial impact across three dimensions before approving any
   discount: immediate margin, renewal-baseline erosion, and price realization.
2. Set the Minimum Margin Floor (default 65% gross margin per deal) below which no
   deal proceeds without CEO or CFO override.
3. Define discount tiers with ceilings and the give-to-get required at each (term
   length, prepay, logo or reference, multi-year).
4. Forbid stacking violations and undisclosed concessions; require a documented
   rationale on every approved quote.
5. Tag promotional cohorts and track their churn against full-price baseline.

## Output

`discount_policy`: the margin floor, the discount tier ceilings with required
give-to-gets, the approval and escalation rules, and the cohort-tracking spec,
written to the company brain. Also a per-deal margin-floor check before any quote.

## Rules

- Human gate to set or change the policy and to approve any discount above the tier
  ceiling; this protects ARPU structurally.
- No discount without a commitment exchanged; no stacking; never let a discounted
  price become the silent renewal anchor.
- Flag a promotional cohort if its 90-day churn runs more than 15% above baseline.

Full discount mathematics, benchmarks, and the margin-floor logic in the source draft
above. Condense, do not pad.

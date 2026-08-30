---
id: referral-program
title: Referral Program
level: 5
summary: Design and launch a double-sided referral loop that acquires incremental users below paid CAC without subsidizing organic conversions.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits: []
relevance: optional
department: Growth
criticality: growth
selection_hint: Gated on PMF. Never run before retention proves out; a referral loop on a leaky bucket amplifies churn and burns treasury.
depends_on: []
soft_after:
  - nps-csat-program
  - north-star-metric
produces:
  - referral_program
consumes:
  - activation_event
  - paying_customer
effort: M
leverage: med
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: referral-live
---
# Referral Program

A referral program turns the user base into an acquisition channel by incentivizing
existing users to recruit new ones. The objective is incremental users (who would not
have joined otherwise) below paid CAC, at or above baseline LTV. Referred customers
show ~16% higher LTV and ~37% higher retention. K-factor between 0.15 and 0.4 is
excellent for most SaaS and consumer products.

## Procedure

1. Confirm PMF first. Do not launch on a leaky bucket; it acquires users who churn
   and degrades unit economics.
2. Choose incentive. Default to double-sided (rewards both sides, ~29% more
   participation). Prefer product/credit rewards over cash where possible; make
   incentives asymmetric on two-sided marketplaces.
3. Time the trigger. Prompt after the user hits the aha moment or a positive milestone
   (high NPS, usage streak). For utility SaaS, gate the prompt behind an activation metric.
4. Engineer friction out of both funnels: pre-populated editable share copy, contact
   import, a clear referral dashboard for the sender; a frictionless landing for the recipient.
5. Build anti-abuse: self-referral and fraud detection, payout caps, and a human gate
   on reward payouts.
6. Measure K-factor, incrementality (holdout where possible), and referred-cohort LTV.

## Output

`referral_program`: a live double-sided referral loop with incentive design,
anti-abuse, and instrumentation, recorded in the company brain.

## Rules

- Recurring. Operate and iterate continuously; review monthly.
- Human gate on incentive economics and payouts. Never auto-pay rewards without approval.
- PMF gate is hard. If retention is unproven, do not launch.

Mature/L6 note: at scale, run referral alongside affiliate (074) and influencer (075)
only with clean per-channel attribution, or they collide and burn treasury. Full math,
STEPPS, and anti-abuse detail in the source draft above. Condense, do not pad.

---
id: pricing-packaging-experimentation
title: Pricing and Packaging Experimentation
level: 6
summary: Run a continuous, structured program to test pricing, packaging, and value metrics safely with founder approval gates.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - ecommerce
    - content
    - crypto
  requires_traits:
    - takes_payments
    - has_live_customers
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Finance
criticality: growth
selection_hint: Run when there are live paying customers (about 100+ willingness-to-pay respondents reachable). Highest-leverage profit lever, but every change passes a founder gate.
depends_on: []
soft_after:
  - pricing-research
  - packaging-tier-design
  - unit-economics
produces:
  - pricing_experiment_results
consumes:
  - pricing_research
  - pricing_tiers
  - unit_economics
effort: L
leverage: critical
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: pmf-confirmed
---
# Pricing and Packaging Experimentation

A 1 percent improvement in price realization moves operating profit more than a 1
percent gain in volume or cost. Treat pricing as a continuous experimentation
program, not a one-time decision. Two steps are hard founder-approval gates.

## Procedure

1. Trigger check. Fire on the time trigger (last review over 6 months) or any event
   trigger: ARPU stagnation, win-rate anomaly, feature-delivery gap, competitive
   shift, margin compression, billing confusion, new unmonetized product, churn spike.
2. Confirm or revise the value metric (the unit pricing scales on). It must be
   aligned, understandable, and expandable.
3. Collect willingness-to-pay data. Gate: do not finalize any packaging change until
   at least 20 WTP data points from the target segment are collected.
4. Design the experiment. Keep packaging simple: at most three tiers, five
   differentiating features per tier, two add-ons.
5. HUMAN GATE: founder approves the proposed price points and packaging before any
   live test.
6. Run the test on new cohorts; grandfather existing customers (a trust asset).
7. HUMAN GATE: founder approves the rollout decision before changing live pricing.
8. Monitor post-rollout: conversion, ARPU, churn, support tickets. Log to the brain.

## Output

`pricing_experiment_results`: value-metric decision, tier design, WTP evidence, test
readout, and rollout decision, written to the company brain.

## Rules

- Two hard human gates: price-point approval (step 5) and rollout approval (step 7).
- No packaging change before 20+ WTP data points. Hard gate, not a suggestion.
- Grandfather existing customers; never force-migrate to capture short-term revenue.
- Communicate value before price in every customer-facing message.

Cadence: every 6 to 12 months or on any event trigger. Full WTP methods and rollout
templates are in the source draft.

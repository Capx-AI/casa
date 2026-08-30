---
id: revenue-model-selection
title: Revenue Model Selection
level: 1
summary: >-
  Pick how the business charges (subscription, usage, take-rate, one-time, ads, marketplace fee) and
  write down the reasoning, so pricing, unit economics, and go-to-market all build on one deliberate
  choice instead of a default.
applies_to:
  types:
    - '*'
  requires_traits: []
  excluded_traits: []
relevance: core
department: Finance
criticality: core
selection_hint: >-
  Run once the value proposition is clear and before pricing or financial modeling; surface it early
  so the charging mechanism is chosen, not inherited.
depends_on: []
soft_after:
  - mvp-scoping
produces:
  - revenue_model_choice
  - monetization_rationale
consumes: []
effort: S
leverage: critical
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: building
existential_at:
  - revenue
model_fit:
  - recurring
  - transactional
  - self_serve
  - sales_led
  - marketplace
deliverable:
  artifact: revenue_model_choice
  sections:
    - Chosen model and pricing metric
    - Why this fits the value delivered
    - Rejected alternatives and reasons
    - Unit economics sketch
    - Open risks and revisit trigger
  max_words: 600
rubric: >-
  Passes if it names one primary model with a specific charging metric, ties it to how value is
  delivered and consumed, and shows a per-unit margin sketch that does not lose money at scale.
---

# Revenue Model Selection

## Procedure
1. Write one sentence describing the unit of value the customer receives (a seat, a transaction, a stored gigabyte, a completed job, an audience impression). The charging metric should track this unit, so that paying more means getting more value.
2. List the six candidate models against your product: subscription, usage or metered, transaction take-rate, one-time license, ads, marketplace fee. For each, note who pays, how often, and whether revenue scales with the customer's success or with their cost to serve.
3. Score the top two candidates on five factors: alignment with the value unit, predictability of revenue, willingness-to-pay evidence from discovery, cost-to-serve coverage, and competitive norms in your category. Pick the one model that wins on alignment and margin, not the one that maximizes a single quarter.
4. Sketch unit economics for the chosen model: expected price per unit, variable cost per unit, and the rough volume needed to cover fixed cost. Confirm the per-unit margin stays positive as volume grows; if it inverts, the model is wrong.
5. Document the decision in revenue_model_choice: chosen model, pricing metric, the two rejected alternatives with reasons, the margin sketch, and a named trigger (a metric or date) that forces a revisit.

## Output
A dated revenue_model_choice naming one primary model, its charging metric, and the reasoning, ready to feed pricing and financial modeling.

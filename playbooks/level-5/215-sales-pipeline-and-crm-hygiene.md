---
id: sales-pipeline-and-crm-hygiene
title: Sales Pipeline and CRM Hygiene
level: 5
summary: >-
  Define pipeline stages with explicit entry and exit criteria, then enforce a weekly CRM hygiene
  cadence so forecasts reflect reality instead of optimism.
applies_to:
  types:
    - b2b
    - saas
    - b2b-service
  requires_traits:
    - b2b
  excluded_traits: []
relevance: core
department: Sales
criticality: core
selection_hint: >-
  Select once a B2B team is running multiple live deals and pipeline review is guesswork. Skip for
  pure self-serve or transactional flows with no human selling.
depends_on:
  - icp-target-account-listing
soft_after:
  - pricing-research
produces:
  - pipeline_definition
  - stage_exit_criteria
  - crm_hygiene_cadence
  - weighted_forecast
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: First repeatable B2B sales motion with more than five concurrent deals
model_fit:
  - sales_led
  - recurring
deliverable:
  artifact: pipeline_definition
  sections:
    - Stage list and definitions
    - Entry and exit criteria per stage
    - Probability weighting and forecast method
    - CRM hygiene cadence and rules
  max_words: 600
rubric: >-
  Pass if every stage has a buyer-verifiable exit criterion and a weighted forecast can be produced
  from the CRM without manual guessing.
---

# Sales Pipeline and CRM Hygiene

## Procedure
1. List your stages as buyer actions, not seller hopes. Use five to seven stages such as Identified, Engaged, Discovery Complete, Proposal, Negotiation, Closed Won, Closed Lost. Write a one-line definition for each so anyone reading the CRM means the same thing.
2. Attach an exit criterion to every stage that is verifiable by something the buyer did, not how the rep feels. Examples: Discovery Complete requires a confirmed budget, decision maker, and timeline; Proposal requires the buyer has the pricing in writing. A deal cannot advance until its criterion is true.
3. Assign a default close probability to each stage and define your forecast as the sum of deal value times stage probability, overridden only with a written reason. This produces a weighted_forecast you can defend in a review.
4. Set CRM field requirements per stage: next step with a date, amount, close date, and primary contact. Block stage changes when required fields are empty.
5. Run a weekly thirty-minute hygiene cadence. Every deal must have a future-dated next step; flag any deal with no activity in fourteen days as stalled; move dead deals to Closed Lost with a reason code. Do not let zombie deals inflate the number.
6. Each month, review Closed Lost reason codes and slippage against forecast to recalibrate stage probabilities and tighten exit criteria.

## Output
A written pipeline_definition with stage exit criteria, a repeatable weekly hygiene cadence, and a weighted forecast generated directly from the CRM.

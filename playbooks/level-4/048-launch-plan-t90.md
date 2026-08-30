---
id: launch-plan-t90
title: Launch Plan (T-90)
level: 4
summary: Orchestrate a full T-90 to T+30 launch countdown with tier classification, owners, assets, a war-room runbook, and a metrics dashboard.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Growth
criticality: core
selection_hint: The conductor of the launch level. Run once product, positioning, and pricing are ready; it sequences PH, HN, PR, and podcast plays under one countdown.
depends_on:
  - positioning-canvas
  - packaging-tier-design
  - pricing-page-copy-layout
  - freemium-trial-decision
soft_after:
  - category-design-decision
  - beta-program-management
produces:
  - launch_plan
consumes:
  - positioning
  - pricing_tiers
  - pricing_model
  - pricing_page
  - category_pov
effort: L
leverage: critical
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: launched
deliverable:
  artifact: A T-90 launch plan with a dated countdown, RACI, asset inventory, war-room runbook, and metrics dashboard, written to the company brain.
  sections:
    - Launch tier classification
    - RACI of agent and human owners
    - Week-by-week countdown with real dates
    - Asset inventory
    - War-room runbook and metrics dashboard
  max_words: 1200
rubric: Passes only when the launch is tier-classified to set lead time, every step has a date, an owner, and an asset, the burst sequences Product Hunt then Hacker News then PR across separate days, and the public launch is founder-gated before T-0.
---
# Launch Plan (T-90)

A coordinated countdown from T-90 to T+30. Every instruction is a conditional check
or a concrete action with a date, an owner, and an asset.

## Procedure

1. Confirm trigger and inputs: approved launch, a target date at least 30 days out
   (else run the compressed variant), launch brief with product name, one-sentence
   description, target persona, and channels.
2. Classify the launch tier by market and business impact (T1 company-defining 90+
   days, T2 major feature 45-60 days, T3 incremental 7-14 days, T0 internal).
   Tier sets lead time and cross-functional scope.
3. Build the RACI matrix with agent and human owners.
4. Instantiate the week-by-week countdown with real dates.
5. T-60 to T-30: produce assets in parallel (landing copy, email sequences, social,
   press release, sales enablement kit).
6. T-30 to T-14: warm channels (PH and HN accounts, PR outreach, podcast bookings).
7. T-14 to T-0: pre-flight checks; arm the war-room runbook and the metrics dashboard.
8. T-0 to T+14: the launch burst, then post-launch review.

## Output

`launch_plan`: the dated countdown, RACI, asset inventory, war-room runbook, and a
live metrics dashboard, written to the company brain. Sequences PH, HN, and PR.

## Rules

- Human gate before T-0; a public launch is hard to walk back.
- Burst sequencing: PH then HN then PR across separate days is safer than all-at-once.
- Do not start a launch that depends on email channels without verifying domain
  warmup completed earlier (deliverability needs 30-45 days).

Full tier model, RACI, and runbook templates in the source draft above. Condense, do
not pad.

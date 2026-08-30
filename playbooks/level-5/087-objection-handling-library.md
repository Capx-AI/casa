---
id: objection-handling-library
title: Objection Handling Library
level: 5
summary: A callable library that classifies and responds to prospect resistance at any stage of the sales cycle.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - hardware
    - b2b-service
  requires_traits:
    - b2b
  excluded_traits:
    - b2c
    - self_serve_only
relevance: recommended
department: Sales
criticality: growth
model_fit: [sales_led]
selection_hint: A callable, always-on library invoked by discovery (085), demo (086), and close (088) whenever a prospect resists. Install once a B2B sales motion exists. Not run standalone.
depends_on: []
soft_after:
  - discovery-call-framework
  - demo-script
produces:
  - objection_battlecards
consumes:
  - discovery_notes
effort: M
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: first-pipeline
---
# Objection Handling Library

A callable response library, not a sequential workflow. It activates whenever a
prospect shows resistance, hesitation, or pushback, and is invoked by 085, 086, and
088. Classify before you respond: amplifying urgency on an indecisive buyer makes
them freeze harder.

## Procedure (invoked on a detected objection)

1. Detect the signal type: explicit (stated), implicit/behavioral (ghosting,
   reschedules, vague "send more info"), or systemic (security questionnaire, legal
   redlines, procurement). Systemic objections route to asset delivery, not
   persuasion.
2. Classify the root: status-quo bias (fears the cost of acting) vs customer
   indecision (fears choosing wrong). The diagnostic: has the prospect expressed a
   desire to change?
3. Respond. For status quo: amplify the cost of inaction. For indecision: apply
   JOLT (judge indecision, offer a recommendation, limit exploration, take risk off
   the table with pilots, opt-outs, SLAs).
4. Lead with tactical empathy (label the concern) before deploying any data, to
   deactivate the threat response.
5. Pull the relevant battlecard by persona, stage, and competitor; log the
   objection to the CRM to detect patterns.

## Output

`objection_battlecards` (the maintained library) plus per-deal CRM logs, written to
the company brain.

## Rules

- B2B only. Always classify status-quo vs indecision before responding.
- Recurring / always-on: install once a sales motion exists; called, not scheduled.

Full source (LAER framework, full taxonomy, persona and stage libraries, pseudocode)
at the `source` path.

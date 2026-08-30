---
id: feature-prioritization
title: Feature Prioritization
level: 3
summary: Produce an auditable, politics-resistant ranking of the backlog with RICE plus Kano and WSJF.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - ecommerce
    - content
    - crypto
  requires_traits:
    - builds_software
  excluded_traits: []
relevance: core
department: Product
criticality: core
selection_hint: The standing decision of what to build next. Runs continuously through build and beyond, not once. Full scoring every two weeks; triage daily.
action: "Score the current backlog with RICE, add a Kano tag, and emit a ranked sprint-commitment list for approval."
depends_on: []
soft_after:
  - prd-drafting
produces:
  - prioritized_backlog
  - sprint_commitment
consumes:
  - prd
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: backlog-ranked
---
# Feature Prioritization

Decide what to build next with a reproducible, auditable score rather than the
highest-paid opinion. Every score derives from explicit inputs, so any stakeholder
can interrogate it but no one can override it without changing the underlying data.

## Cadence

Full scoring run every two weeks on the backlog; lightweight triage daily on new
inbound items. This playbook operates continuously and never completes.

## Procedure

1. Pre-filter: confirm each item is buildable, permissible, and directionally
   aligned. Security and compliance-mandated changes bypass scoring entirely.
2. Score with RICE (reach, impact, confidence, effort). Add Kano classification and
   a WSJF tiebreaker for close calls.
3. Apply decision logic and tiebreakers; assign a strategic tier.
4. Emit the ranked backlog and a recommended sprint commitment list for approval.

## Output

`prioritized_backlog` (the ranked, scored, tiered list with audit trail) and a
`sprint_commitment`, written to the company brain.

## Rules

- Do not re-score items already in active development mid-sprint.
- Keep the full audit trail: which inputs produced which score, so any challenge
  resolves against data, not seniority.

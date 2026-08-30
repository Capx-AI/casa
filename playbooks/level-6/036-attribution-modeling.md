---
id: attribution-modeling
title: Attribution Modeling
level: 6
summary: Select and operate an attribution model, then turn its output into defensible budget shifts.
applies_to:
  types:
    - "*"
  requires_traits:
    - runs_paid_media
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Data
criticality: growth
selection_hint: Run before scaling paid spend, once there is meaningful spend history and conversion volume. Attribution is causal inference, not a reporting exercise.
depends_on:
  - analytics-stack-setup
  - event-taxonomy-design
soft_after:
  - growth-loop-design
produces:
  - attribution_model
  - budget_reallocation
  - tracking_audit
consumes:
  - analytics_stack
  - event_taxonomy
effort: L
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: attribution-operating
---
# Attribution Modeling

RECURRING. Select, implement, and operate an attribution model fit to stage, data
volume, and privacy constraints, then translate its output into defensible budget
allocation. The goal is to find which activities caused incremental revenue, not
merely which appeared in the conversion path.

## Procedure

1. Verify inputs: monthly spend by channel (6-12 mo), conversions with timestamps
   (200+ for MTA, 1000+ for data-driven), UTM coverage >90%, revenue/pipeline by
   cohort, privacy constraints, business-model type.
2. Run a tracking audit; remediate UTM gaps until paid-session coverage exceeds 90%.
3. Select a model from the taxonomy (rules-based, data-driven MTA, MMM, or
   incrementality) by stage and data; document the choice in a one-page memo.
4. Produce the channel-level attribution table (attributed revenue, cost, ROAS) and
   a ranked budget-reallocation recommendation with expected ROAS impact.
5. Schedule incrementality tests for the next 90 days; review on a 30-day cadence.

## Output

`attribution_model`, `tracking_audit`, and a `budget_reallocation` recommendation
in the company brain, plus a measurement calendar. Cadence: 30-day model review
plus a running incrementality-test schedule. Enhances the CEO dashboard (037) and
WBR (040).

## Rules

- Do not run multiple paid channels at scale before attribution exists; channel
  collisions make it impossible to tell what works.
- Ground budget decisions in attribution data, never platform-reported ROAS alone.
- Budget reallocations above the discretionary threshold escalate to the founder
  per the human-in-the-loop gates.

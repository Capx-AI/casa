---
id: cohort-retention-analysis
title: Cohort & Retention Analysis
level: 5
summary: Build D1/D7/D30 curves, detect smile vs decline, attribute shifts to interventions.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Data
criticality: core
existential_at: [revenue, scaling]
model_fit: [recurring]
selection_hint: Run once a critical event and a usage interval are definable. Retention is the most leveraged metric; a 10% lift beats a 10% acquisition lift many times over.
action: "Identify the single action most correlated with D30 retention, then build your first D1/D7/D30 cohort table this week."
depends_on:
  - analytics-stack-setup
  - event-taxonomy-design
soft_after:
  - north-star-metric
produces:
  - retention_report
  - cohort_tables
  - critical_event
consumes:
  - analytics_stack
  - event_taxonomy
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: retention-baselined
deliverable:
  artifact: A retention report with cohort tables and the identified critical event, written to the company brain.
  sections:
    - Critical event and usage interval
    - Chosen retention metric type
    - D1/D7/D30/W12 cohort tables classified smile or declining
    - Cohorts segmented by channel and feature use
    - Shifts attributed to interventions
  max_words: 900
rubric: Passes only when the critical event is the value action chosen by retention-delta analysis rather than a generic login proxy, the retention metric type matches the usage pattern, and every curve shift is attributed to a specific intervention or external event via the intervention log.
---
# Cohort & Retention Analysis

RECURRING. Retention is a layered diagnostic, not one number. Build retention
curves, detect smile-curve versus declining-curve behavior, segment cohorts by
channel and feature use, and tie every shift to a specific intervention or
external event.

## Procedure

1. Confirm inputs: event data with stable `user_id`, the critical event (the action
   most correlated with D30 retention, found by correlation analysis), the usage
   interval (80th percentile of time between critical events for D30-retained
   users), and the intervention log.
2. Choose the correct metric type (N-day, unbounded, or bracket) for the usage
   pattern; the wrong type is the top source of misleading data.
3. Build D1/D7/D30/W12 cohort tables; classify each curve as smile (healthy) or
   declining.
4. Segment cohorts by acquisition channel and feature-use pattern to locate which
   users find lasting value.
5. Attribute shifts to interventions via the log; queue recommended actions.

## Output

`retention_report`, `cohort_tables`, and the chosen `critical_event` in the
company brain. Cadence: monthly routine plus on-demand on DAU/MAU drops, D7 drops,
cohort divergence, or Quick-Ratio alerts. Feeds the CEO dashboard (037) and WBR
(040).

## Rules

- The critical event is never a generic proxy like login or app-open; it is the
  value action, chosen by retention-delta analysis.
- Modest churn compounds brutally (2%/mo to ~22%/yr); treat retention as the
  highest-leverage lever.

---
id: event-taxonomy-design
title: Event Taxonomy Design
level: 2
summary: Name, structure, and govern events so cross-event analysis stays reliable as the product grows.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Data
criticality: core
selection_hint: Run right after the analytics stack lands. A disciplined taxonomy is what makes funnels, cohorts, and reads trustworthy; without it tracking drifts into chaos.
action: "Set an Object-Action naming convention and write a tracking plan for your ten most important events this week."
depends_on:
  - analytics-stack-setup
soft_after: []
produces:
  - event_taxonomy
  - tracking_plan
consumes:
  - analytics_stack
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: taxonomy-governed
---
# Event Taxonomy Design

Design the system by which user and system actions are named, structured, and
governed. Prevent the four compounding failures: tracking drift, naming chaos,
orphaned events, and analyst-side chaos.

## Procedure

1. Set a naming convention: a consistent `Object Action` form, fixed casing, and a
   property schema with typed properties. Capture intent, segmentable by property,
   aggregatable without complex filtering.
2. Choose the right level of abstraction. Not too broad (one event for many
   actions), not too specific (one event per button); for example `Sign Up Method
   Selected` with a `source` property over `btn_click_checkout_v2`.
3. Write the tracking plan: each event, its trigger, its properties and types, the
   owner, and the identity-resolution model. The non-technical-user test: can ops
   or support answer a question without an onboarding session?
4. Enforce with schema validation in the pipeline and event versioning for
   schema evolution.
5. Govern continuously: a weekly audit that flags orphaned events (no query in 90+
   days) and drift, plus a changelog for additions and deprecations.

## Output

`event_taxonomy` and `tracking_plan` in the company brain, with schema enforcement
wired into the pipeline. Cadence: ~1 hour/week governance after the initial design.
Feeds funnel (034), cohort (035), Mixpanel reading (039), and attribution (036).

## Rules

- Instrument to separate successful from unsuccessful users (intent and failure
  events), not just success events. Tracking is the means, analysis is the goal.
- Names are for business users, not engineers. Translation-required names fail.
- Mature variant: re-audit naming and schema when event count crosses 100 then 500;
  do not duplicate this file.

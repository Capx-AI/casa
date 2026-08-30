---
id: activation-rate-optimization
title: Activation Rate Optimization
level: 4
summary: Instrument the signup to aha to habit funnel, find where new users drop, and lift the activation rate with attributed interventions.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - content
    - crypto
  requires_traits:
    - builds_software
  excluded_traits: []
relevance: core
department: Data
criticality: core
existential_at: [launched]
model_fit: [self_serve]
selection_hint: The first compounding gate after launch. A launched product lives or dies on whether new users reach value, so this is the metric to watch once signups exist, not top-of-funnel acquisition.
action: "Define the activation rate from your aha milestone, then isolate the single largest signup-to-aha drop-off step to fix."
depends_on:
  - event-taxonomy-design
  - first-run-aha-experience
soft_after:
  - onboarding-flow-design
produces:
  - activation_analysis
consumes:
  - event_taxonomy
  - aha_definition
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: activation-optimized
---
# Activation Rate Optimization

RECURRING. Activation is the first compounding gate a launched product passes
through. Acquisition fills the top of the funnel, but the activation rate (the share
of new signups who reach the aha and form a habit) decides whether any of that
traffic becomes a business. A launched company watches this number, not impressions
or content reach. Measure the signup to aha to habit path, find the single largest
drop, and lift it with changes you can attribute.

## Procedure

1. Define the activation rate precisely from `aha_definition`: the numerator is users
   who reached the activation milestone, the denominator is new signups in the
   cohort, and the window is fixed (for example 7 days). Encode one definition in the
   metrics layer so every read agrees.
2. Validate the funnel against `event_taxonomy`: signup to setup to aha to habit,
   each step a governed event. Confirm no orphaned, duplicated, or mislabeled step
   distorts the rate before drawing any conclusion.
3. Segment activation by acquisition channel, entry surface, device, and persona. A
   blended rate hides the band that is failing; the work is wherever a segment
   under-activates against the rest.
4. Isolate the single largest drop-off step and write one falsifiable hypothesis for
   it (added friction, missing motivation, unclear value, or a technical failure).
5. Ship one change at a time against a held-out control, read the treated cohort, and
   attribute the move to the change rather than to noise or a seasonal swing.
6. Record the baseline, every intervention, and its measured lift in
   `activation_analysis`. Promote winning changes back into the onboarding flow so the
   gain persists.

## Output

`activation_analysis`: the activation-rate baseline, the segment breakdown, the
ranked drop-off steps, and the intervention-to-lift log, written to the company
brain. Cadence: a weekly rate read plus a monthly deep segmentation, with an
off-cadence pass triggered by an activation drop, a new acquisition channel, or a
material onboarding change. Feeds cohort and retention analysis (035) and the CEO
dashboard.

## Rules

- Activation is not signup. Count only users who reached the defined aha milestone,
  never account creation or a page view.
- One change per cohort. Stacked changes make the lift unattributable and the loop
  stops compounding.
- A blended rate is a trap. The channel or persona band that under-activates is where
  the leverage sits; optimize the band, not the average.

Deepen this same analysis over time rather than starting a parallel one when a new
segment or surface comes online.

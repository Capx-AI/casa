---
id: plg-instrumentation-and-pqls
title: PLG Instrumentation and PQL Scoring
level: 4
summary: Instrument the product-led usage signal chain and build a product-qualified-lead model that turns raw events into an activation-to-expansion score the growth and sales motions can act on.
applies_to:
  types:
    - saas
    - consumer
  requires_traits:
    - builds_software
  excluded_traits:
    - pre_idea_only
relevance: core
department: Data
criticality: core
existential_at: [scaling]
model_fit: [self_serve]
selection_hint: Run once events flow and an activation moment is definable. In a self-serve motion the product is the top of the funnel, so the PQL score is the routing signal for in-product prompts, lifecycle, and any human follow-up. Skip if the motion is purely sales-led with no free or trial usage.
action: "Define the activation moment in event terms, then ship a simple weighted 0-to-100 PQL score validated against who converted."
depends_on:
  - analytics-stack-setup
  - event-taxonomy-design
soft_after:
  - first-run-aha-experience
  - activation-rate-optimization
produces:
  - pql_model
consumes:
  - analytics_stack
  - event_taxonomy
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: pql-model-live
---
# PLG Instrumentation and PQL Scoring

RECURRING. In a product-led motion the signup is not the lead. The lead is a
pattern of usage that predicts willingness to pay or expand, and it is invisible
until you instrument for it. A product-qualified lead is an account or user whose
in-product behavior crosses a scored threshold: they reached the activation moment,
they came back, they hit a value milestone, and increasingly they brush against a
limit. This playbook builds the signal chain from raw events to a single PQL score
that downstream systems route on, instead of letting sales chase signups at random
or letting expansion-ready accounts sit unnoticed.

## Procedure

1. Confirm the instrumentation base. Verify the event taxonomy already defines the
   core value events with a stable `user_id` and `account_id`, consistent property
   names, and server-side capture for anything money-adjacent. Audit for the three
   failure modes that poison a PQL model: events that fire on render not on action,
   missing identity stitching across anonymous and logged-in sessions, and silent
   client-side drops. Fix these before scoring anything.
2. Define the activation moment in event terms. Name the single event sequence most
   correlated with week-4 retention (the aha plus first repeat), and instrument the
   funnel to it: signup, setup-complete, first-value-event, second-session. This is
   the spine the score is built on.
3. Assemble the PQL feature set. Pull the behavioral predictors: activation reached
   (yes/no and time-to-activate), usage breadth (distinct value events), usage depth
   (frequency and recency, an RFM-style decay), team signals (seats invited, second
   active user), and intent-to-pay signals (hit a free-tier limit, viewed pricing,
   started but abandoned upgrade). Keep features that are leading, not lagging.
4. Score and threshold. Start with a transparent weighted model (logistic or a
   simple points rubric) trained or calibrated against who actually converted or
   expanded, not a guess. Output a 0-100 PQL score per account plus a tier (cold,
   warm, qualified). Validate that the qualified tier converts materially better
   than baseline before anyone acts on it; a score nobody can trust is worse than
   no score.
5. Wire the activation-to-expansion chain. Route the score: qualified free users
   trigger in-product upgrade prompts and lifecycle messaging; qualified paid
   accounts approaching limits trigger expansion plays; a stalled-after-activation
   segment triggers re-engagement. Define the handoff payload (the events that
   earned the score) so the receiving system or human knows why.
6. Set the refresh cadence and drift watch. Recompute scores on a fixed cadence,
   monitor the qualified-tier conversion rate over time, and recalibrate weights
   when a product or pricing change shifts behavior. A PQL model is a living artifact.

## Output

`pql_model` in the company brain: the activation-moment definition in event terms,
the PQL feature set and weights, the score and tiering rubric with its validated
conversion lift, and the routing rules from score to in-product prompt, lifecycle,
or human follow-up. This artifact feeds the paywall and pricing experiments, the
mobile lifecycle messaging, and any self-serve expansion motion.

## Rules

- The PQL score is built from leading value-usage signals, never from a vanity proxy
  like logins or page views. If a feature does not predict conversion or expansion,
  it does not belong in the score.
- No routing on an unvalidated score. The qualified tier must beat baseline
  conversion before a prompt or a human acts on it.
- Identity stitching is non-negotiable. A model that cannot tie anonymous usage to
  the eventual account is scoring noise.

RECURRING cadence: recompute scores on the chosen interval (commonly weekly) and
recalibrate weights when the product, pricing, or funnel shifts. Deepen this same
model rather than standing up a parallel scoring system.

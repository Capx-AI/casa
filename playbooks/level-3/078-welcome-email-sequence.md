---
id: welcome-email-sequence
title: Welcome Email Sequence
level: 3
summary: Build a milestone-keyed behavioral onboarding email sequence that fires on what a user has or has not done, not on elapsed days.
applies_to:
  types:
    - "*"
  requires_traits:
    - sends_email
  excluded_traits: []
relevance: core
department: Growth
criticality: core
selection_hint: Highest-leverage lifecycle asset. Run once deliverability is warmed and the aha event is instrumented; it escorts new users to activation.
depends_on:
  - email-deliverability-setup
soft_after:
  - onboarding-flow-design
  - event-taxonomy-design
produces:
  - welcome_sequence
consumes:
  - email_deliverability
  - activation_event
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: onboarding-live
---
# Welcome Email Sequence

The first email a new user gets opens 4 to 5x higher than any later campaign.
A behavioral sequence keyed to in-product milestones (not a calendar drip) can lift
activation 20 to 40 points, halve time-to-value, and raise D30 retention 15 to 25%.
Every email is a sales letter for the next action, framing the user as the hero and
the product as the mentor.

## Procedure

1. Define the aha moment. Find the activation event most correlated with D30
   retention (cohort analysis in the analytics stack). This is the sequence's north star.
2. Pre-flight. Confirm SPF/DKIM/DMARC, one-click unsubscribe, human From address,
   suppression list, consent logs, and instrumented milestone events.
3. Map the straight-line path. Label onboarding steps required / defer / remove; the
   sequence escorts the user along the required path and intervenes when they stall.
4. Build the state machine with three trigger types: action-based (milestone hit),
   inaction-based (milestone missed within a window), attribute-based (profile fits a path).
5. Write benefit-led, specific copy per email. Pivot from "get started" to "do more"
   the moment the aha event fires.
6. Instrument and review open/click/activation lift; iterate copy and timing.

## Output

`welcome_sequence`: a live behavioral onboarding state machine with defined triggers,
copy, and the aha event, recorded in the company brain.

## Rules

- Behavioral over calendar. Never send a "Day 3 reminder" to a user who already activated.
- Blocked until deliverability is warmed (082). Sending before warmup lands welcome
  mail in spam.
- No fabricated activation event. If the aha event is not yet identified, run the
  cohort analysis first.

Mature variant: once a CRM, lead scoring, and content library exist, the welcome
sequence feeds the L5 nurture and win-back flows. Full theory and copy templates in
the source draft above. Condense, do not pad.

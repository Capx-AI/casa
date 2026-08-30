---
id: lifecycle-and-retention-email
title: Lifecycle and Retention Email Program
level: 5
summary: >-
  Build a lifecycle messaging program that moves new signups to activation, reinforces the core
  habit loop, and wins back dormant users with triggered, behavior-based email and in-product
  nudges.
applies_to:
  types:
    - '*'
  requires_traits: []
  excluded_traits: []
relevance: core
department: Success
criticality: core
selection_hint: >-
  Select once you have live users and a defined activation event but retention is leaking after
  signup. Skip if you have not yet shipped a product people can return to.
depends_on: []
soft_after:
  - mvp-scoping
produces:
  - lifecycle_retention_program
  - activation_email_sequence
  - dormant_winback_flow
  - lifecycle_trigger_map
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: launched
model_fit:
  - recurring
  - self_serve
  - transactional
deliverable:
  artifact: lifecycle_retention_program
  sections:
    - Activation Path and Aha Event
    - Trigger Map and Segments
    - Message Sequences and Copy
    - Dormant Re-engagement Flow
    - Measurement and Control Group
  max_words: 900
rubric: >-
  Passes if every message is tied to a named trigger event and segment, and an activation rate
  target with a holdout control group is defined.
---

# Lifecycle and Retention Email Program

## Procedure
1. Define the activation event and the core habit loop. Name the single action that predicts retention (for example, completed first project, third login in seven days). Pull current data to find the activation rate and median time to that event. Write these as the program targets.
2. Build the trigger map. List the user states you will message: signed up but inactive, activated, power user, slipping, dormant (no core action in 14 to 30 days). For each state, define the entry trigger, the goal, and the exit condition so no user gets stuck or double-messaged.
3. Write three sequences in your email or messaging tool. Activation: 3 to 4 behavior-triggered nudges over the first 7 days, each pointing to the next concrete step toward the aha event. Habit: a recurring value or progress message tied to real usage. Win-back: a 2 to 3 message dormant flow that leads with a reason to return, not a discount.
4. Instrument and hold out. Tag every send with trigger and segment. Reserve a 10 percent control group that receives no lifecycle messages so you can attribute lift, not just opens. Wire events from your product to the tool.
5. Ship the activation sequence first, then habit, then win-back. Review weekly: activation rate, day-30 retention, reactivation rate, and unsubscribe rate. Cut any message the control group beats or that drives unsubscribes.

## Output
A live lifecycle_retention_program with mapped triggers, three running sequences, and a control group proving retention lift.

---
id: onboarding-flow-design
title: Onboarding Flow Design
level: 3
summary: Engineer the first-run path that moves a new user to the aha moment with minimum friction.
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
model_fit: [self_serve]
selection_hint: The highest-leverage growth surface. Design it once the product core value and signup flow exist; it feeds the beta program.
action: "Map the signup-to-aha flow as states and cut every step until each single-step drop-off stays under 30 percent."
depends_on: []
soft_after:
  - prd-drafting
produces:
  - onboarding_flow
  - activation_event
consumes:
  - prd
  - event_taxonomy
effort: M
leverage: critical
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: activation-instrumented
deliverable:
  artifact: A deployed onboarding flow with recovery messaging and an instrumented activation event, written to the company brain.
  sections:
    - Defined aha moment and core action event
    - Flow modeled as a state machine with triggers and recovery nudges
    - Friction stripped to hold each step drop-off at or below 30 percent
    - Instrumented activation event
  max_words: 700
rubric: Passes only when the flow is oriented around the user's desired outcome rather than the feature list, each single-step drop-off is held at or below 30 percent, and the activation event is instrumented against targets of activation at or above 30 percent within 7 days and week-1 retention at or above 40 percent.
---
# Onboarding Flow Design

Onboarding is a behavioral change mechanism, not a product tour. It is the
engineered path to the user's aha moment and the single most leveraged surface in
the funnel. Design it around the user's desired outcome, not the feature set.

## Procedure

1. Define the aha moment (the instant the user first experiences core value) and
   the core action event that signals habit formation.
2. Model the flow as a state machine: Signed_Up to Setup_Complete to Aha_Reached
   to Habit_Formed to Engaged, each with a trigger, a failure window, and a
   recovery nudge.
3. Strip every step that does not move the user toward the aha moment. Hold each
   single-step drop-off at or below 30 percent.
4. Instrument the activation event and deploy. Target activation at or above 30
   percent within 7 days and week-1 retention at or above 40 percent.

## Output

`onboarding_flow` (the deployed first-run flow with recovery messaging) and the
defined, instrumented `activation_event`, written to the company brain. Feeds beta
program management (024).

## Rules

- Orient the flow around the user's outcome, never the product's feature list.
- A first-run that does not deliver perceived value before cognitive load loses the
  user; you never get a second first impression.

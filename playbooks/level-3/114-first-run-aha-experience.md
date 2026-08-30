---
id: first-run-aha-experience
title: First-Run Aha Experience
level: 3
summary: Define the first-session path to the aha moment and the activation milestone as one shared, measurable destination before any flow is built or optimized.
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
department: Product
criticality: core
model_fit: [self_serve]
selection_hint: Define the destination before building or measuring the path. Run once the PRD and core value are set, so onboarding design, activation optimization, and retention all measure against one aha.
action: "Name the aha as one observable action with a time-to-value target, then validate it with 5 to 8 first-run sessions."
depends_on:
  - prd-drafting
soft_after: []
produces:
  - aha_definition
  - activation_milestone
consumes:
  - prd
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: aha-defined
---
# First-Run Aha Experience

The aha moment is the instant a new user first feels the product's core value. Before
any onboarding flow is engineered or any activation rate is optimized, that moment
must be defined as a concrete, observable event with a time-to-value target. This
play produces the definition every downstream funnel measures against.

This is distinct from onboarding flow design (022): that play engineers the path and
deploys it, while this one defines the destination the path aims at. Define the aha
here; build the flow there. Do not duplicate the build.

## Procedure

1. From the PRD and the core value proposition, name the single user action that
   delivers first perceived value. State it as a concrete, observable action, never a
   feeling, a sentiment, or a vanity page view.
2. Set the activation milestone: the action or short sequence that signals a user has
   crossed from trying the product to committed use, and the window it must happen in
   (for example within the first session, or within 24 hours of signup).
3. Set the time-to-value target: how fast a new user should reach the aha.
   Shorter is better; benchmark against whatever the user does instead today.
4. Sketch the shortest credible first-session path from signup to aha and mark the
   non-negotiable steps versus the removable ones. This is a sketch of the
   destination, not the built flow.
5. Validate the definition with 5 to 8 real first-run sessions or interviews. Confirm
   the named aha is what users actually experience as value, and correct it when the
   team's assumed aha and the user's felt value diverge.
6. Write `aha_definition` and `activation_milestone` so onboarding flow design,
   activation-rate optimization, and retention all measure against one shared
   destination.

## Output

`aha_definition` (the named, observable aha action plus its time-to-value target) and
`activation_milestone` (the committed-use signal and its window), written to the
company brain. These are the single shared destination for onboarding flow design
(022), activation-rate optimization (113), and cohort and retention work (035).

## Rules

- The aha is an observed action, never a feeling or a page view. If it cannot be
  instrumented as an event, it is not yet defined.
- Define the destination before building the path. A flow optimized toward an
  undefined aha optimizes nothing.
- Validate with real users before locking it. The team's assumed aha and the user's
  felt value are often different things.

Revisit only when the core value proposition itself changes; otherwise treat the aha
as a stable anchor the rest of the funnel is held to.

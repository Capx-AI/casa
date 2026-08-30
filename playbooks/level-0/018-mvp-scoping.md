---
id: mvp-scoping
title: MVP Scoping
level: 0
summary: Cut the thinnest slice that delivers the core value, with explicit non-goals.
applies_to:
  types:
    - "*"
  requires_traits:
    - builds_software
  excluded_traits: []
relevance: core
department: Product
criticality: core
selection_hint: Defines the smallest buildable product after the thesis survives red-teaming. Gates tech stack, positioning, and PRD.
action: "Write the thinnest end-to-end slice that delivers core value plus its explicit non-goals, buildable in a few weeks."
depends_on:
  - red-team-thesis
soft_after:
  - beachhead-selection
produces:
  - mvp_scope
  - non_goals
consumes:
  - validated_thesis
effort: M
leverage: critical
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: mvp-scoped
deliverable:
  artifact: An MVP scope defining the thin slice, the non-goals, and the activation event, written to the company brain.
  sections:
    - Single core value the MVP delivers to the beachhead user
    - Minimum capabilities to deliver it end to end
    - Explicit non-goals
    - Activation event and how it is measured
  max_words: 600
rubric: Passes only when the slice is the smallest end-to-end path to the core value (buildable in a few weeks, else cut again), the non-goals are named explicitly so scope cannot creep back, and the activation event is defined with how it is measured, holding off full brand or visual identity.
---
# MVP Scoping

Define the walking skeleton: the smallest end-to-end slice that delivers the core
value to the beachhead user. Kill scope before you build it, not after.

## Procedure

1. State the single core value the MVP must deliver to the beachhead user.
2. List the minimum capabilities required to deliver it end to end.
3. Write explicit non-goals. Everything tempting that is not in the thin slice
   goes here, named, so it does not creep back in.
4. Define the activation event (the moment the user gets the value) and how it is
   measured.

## Output

`mvp_scope` (the thin slice plus the activation event) and `non_goals`, written to
the company brain. Unblocks brand positioning (015), tech stack selection (019),
and PRD drafting (020).

## Rules

- If the slice cannot be built in a few weeks, it is not an MVP. Cut again.
- No full brand or full visual identity at this stage; those are post-PMF.

---
id: tech-stack-selection
title: Tech Stack Selection
level: 2
summary: Choose a production-ready, boring-by-default stack scoped to the MVP and team.
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
department: Engineering
criticality: core
selection_hint: The infra gate. Pick the stack before hosting, observability, or any build can start. Skip only for businesses that ship no software.
action: "Choose a boring default for each stack layer, recording the rationale and rejected alternatives, then route the spec for sign-off."
depends_on:
  - mvp-scoping
soft_after: []
produces:
  - tech_stack
consumes:
  - mvp_scope
effort: M
leverage: high
reversibility: hard
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: stack-chosen
deliverable:
  artifact: A tech stack specification with per-layer choices and rationale, written to the company brain.
  sections:
    - Inputs (product type, scale, compliance, budget)
    - Foundational constraints (boring technology, monolith first, TCO)
    - Per-layer choice with rationale and rejected alternatives
    - Sign-off
  max_words: 800
rubric: Passes only when each layer is chosen by explicit rule with its rejected alternatives recorded, any non-standard choice is justified by a specific measurable problem a boring alternative cannot solve, and a competent open-market hire could be productive on the stack within two weeks.
---
# Tech Stack Selection

Pick the full stack (frontend, backend, database, infra, observability, LLM layer)
using explicit conditional rules, not taste. Optimize for hiring surface area and
total cost of ownership, not novelty. Stack choices are expensive to reverse.

## Procedure

1. Collect inputs: product type, scale assumptions, compliance needs, and budget.
   Any unknown is a blocking unknown; flag and resolve before deciding.
2. Apply the foundational constraints: choose boring technology (count innovation
   tokens), monolith first, treat rewrites with suspicion, and model TCO across
   compute, engineering time, and opportunity cost.
3. Walk the decision tree per layer and record the rationale for each choice and
   each rejected alternative.
4. Write the stack specification document and route it for sign-off.

## Output

`tech_stack` (the signed-off specification with per-layer rationale), written to
the company brain. Unblocks hosting and deployment (026).

## Rules

- A non-standard choice is only justified by a specific, measurable problem a
  boring alternative cannot solve. "Newer" or "want to learn it" is not a reason.
- A competent open-market hire should be productive on the stack within two weeks.

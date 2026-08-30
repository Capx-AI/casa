---
id: prd-drafting
title: PRD Drafting
level: 3
summary: Translate a validated initiative into an unambiguous, testable product requirements document.
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
selection_hint: The source of truth engineering and design agents execute against. Run per initiative once the MVP slice is scoped and validated.
depends_on:
  - mvp-scoping
soft_after: []
produces:
  - prd
consumes:
  - mvp_scope
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: prd-ready
deliverable:
  artifact: A validated, testable product requirements document, written to the company brain.
  sections:
    - Verified prerequisite inputs with any assumption flagged
    - Problem, goals, target user, and success metric in narrative
    - Scope and explicit non-goals
    - Testable acceptance criteria
    - Change log with timestamped rationale
  max_words: 1000
rubric: Passes only when the PRD is built from validated inputs rather than a feature request or opinion, defines the why and the what without specifying the how, and gives acceptance criteria specific enough that an engineering agent needs no clarifying questions.
---
# PRD Drafting

The PRD turns strategic intent into execution instructions specific enough that
engineering agents need no clarifying questions. Write the reasoning in prose;
paragraphs expose the logical gaps that bullet points hide.

## Procedure

1. Verify prerequisites: a validated problem statement, supporting user research,
   strategic alignment, a named audience, market context, and known constraints.
   If two or more inputs are missing, halt. If one is missing, proceed with an
   "ASSUMPTION - UNVALIDATED" flag and schedule validation.
2. Write the why and the what in narrative: problem, goals, target user, success
   metric, and rationale. Leave the how to engineering.
3. Specify scope, explicit non-goals, and testable acceptance criteria.
4. Keep it a living document: timestamp every update with a change rationale when a
   constraint, assumption, or guardrail metric changes.

## Output

`prd` (the validated, testable requirements document), written to the company
brain. Drives engineering execution.

## Rules

- Do not draft a PRD off a feature request, an opinion, or a competitor reaction
  alone. Validated inputs only.
- Define why and what, never how. If it names a database index, it is over-specced.

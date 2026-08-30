---
id: red-team-thesis
title: Red-Team the Thesis
level: 0
summary: Steelman every way the business fails and set explicit, quantitative kill criteria before capital is committed.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Strategy
criticality: existential
selection_hint: The L0 gate. Run before committing capital. Produces the validated thesis and kill criteria that unlock incorporation.
depends_on:
  - problem-validation-interviews
  - market-sizing-tam-sam-som
soft_after:
  - competitive-teardown
  - jobs-to-be-done-extraction
produces:
  - validated_thesis
  - kill_criteria
consumes:
  - problem_evidence
  - market_sizing_model
effort: M
leverage: critical
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: validated-opportunity
deliverable:
  artifact: A red-teamed thesis document with a confidence-rated assumption stack and pre-committed numeric kill criteria, written to the company brain.
  sections:
    - Assumption stack tagged load-bearing or convenient
    - Pre-mortem failure narratives
    - Disconfirming evidence and confidence per load-bearing assumption
    - Quantitative kill criteria
    - Go/No-Go/Pivot decision
  max_words: 1200
rubric: Passes only when every load-bearing assumption carries disconfirming evidence and a confidence rating, the kill criteria are numeric and pre-committed rather than vague, and the thesis survives its own pre-mortem to earn a defensible Go call.
---
# Red-Team the Thesis

Steelman the failure modes before emotional and financial investment makes them
impossible to enforce. Most teams cannot tell load-bearing assumptions from
convenient ones; 42% of startups die from no market need.

## Procedure

1. Decompose the thesis into its assumption stack. Tag each assumption as
   load-bearing (failure collapses the business) or convenient.
2. Run a pre-mortem: assume the business has already failed catastrophically and
   write the specific causal narratives for why. Use prospective hindsight.
3. For each load-bearing assumption, gather disconfirming evidence and rate
   confidence.
4. Define explicit, quantitative kill criteria now: the signals that, if observed,
   end the venture. Issue the Go / No-Go / Pivot call.

## Output

`validated_thesis` (the thesis that survived adversarial review, with confidence
per assumption) and `kill_criteria`, written to the company brain. Required to
enter Level 1 and consumed by MVP scoping (018).

## Rules

- Kill criteria must be numeric and pre-committed, not vibes ("if not enough
  traction"). Define the number.
- A thesis that cannot survive its own pre-mortem is a No-Go, not a "needs more
  optimism."
- This is the L0 exit gate alongside 018; do not advance to L1 without it.

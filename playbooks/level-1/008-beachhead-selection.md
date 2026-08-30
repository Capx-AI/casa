---
id: beachhead-selection
title: Beachhead Selection
level: 1
summary: Pick the narrowest initial wedge with the highest compounding potential and commit to it.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Strategy
criticality: core
selection_hint: The first L1 commit. Choose one wedge so all force concentrates on a single point. Unlocks positioning and naming.
action: "List 10 to 20 candidate segments, score each on urgency and reachability, then commit to one wedge and name the rest out."
depends_on:
  - problem-validation-interviews
  - market-sizing-tam-sam-som
soft_after:
  - jobs-to-be-done-extraction
  - competitive-teardown
produces:
  - beachhead
  - committed_wedge
consumes:
  - problem_evidence
  - jtbd
  - market_sizing_model
effort: M
leverage: critical
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: company-exists
---
# Beachhead Selection

Every monopoly starts by dominating a tiny market. The beachhead is the narrowest
wedge with the highest compounding potential. Targeting a broad market on day one
is the most common cause of early failure (premature scaling).

## Procedure

1. List 10-20 candidate segments from the validation evidence.
2. Score each on Aulet's market validity (urgent need, well-funded, reachable as a
   whole, complementary ecosystem) plus compounding potential into adjacent pins.
3. For networked products, score the atomic-network density: the smallest slice
   where critical mass is achievable first.
4. Select one beachhead. Document the expansion sequence (the bowling-alley pins)
   and commit. Name what you are explicitly not serving yet.

## Output

`beachhead` (the single committed wedge with its expansion map) and the
`committed_wedge` decision, written to the company brain. Unlocks positioning (046)
and naming (009).

## Rules

- One beachhead. Concentrate force; a diffuse go-to-market loses to a focused one.
- Do not skip the lead pin. The expansion sequence must be ordered, not a wishlist.

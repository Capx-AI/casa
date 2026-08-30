---
id: competitive-teardown
title: Competitive Teardown
level: 0
summary: Map direct, indirect, and non-obvious competitors to find defensible whitespace and their vulnerabilities.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Strategy
criticality: core
selection_hint: Run for every business to find defensible whitespace. Not a feature checklist; a strategy and moat diagnosis.
depends_on: []
soft_after:
  - opportunity-scan
produces:
  - competitive_landscape
  - whitespace_map
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: validated-opportunity
---
# Competitive Teardown

Answer one question: where can we build something defensible that competitors
cannot or will not copy without destroying themselves? This is a strategy
operation, not a feature comparison.

## Procedure

1. Define the true competitive set. Ask what a customer would do if the product
   did not exist. Map the Needs Stack (infrastructure to outcome) to surface
   non-obvious alternatives, including spreadsheets, manual process, and doing
   nothing.
2. Diagnose each competitor's moat against the 7 Powers (scale, network,
   counter-positioning, switching costs, branding, cornered resource, process).
   Tag each power as nascent or mature; nascent is a vulnerability.
3. Mine real customer sentiment: reviews, forums, support threads. Extract what
   their own customers hate.
4. Build the whitespace map (Eliminate-Reduce-Raise-Create) and rank the top
   three defensible positions and top three competitor vulnerabilities.

## Output

`competitive_landscape` (competitor matrix plus positioning map) and
`whitespace_map`, written to the company brain, with battlecard drafts.

## Rules

- Defining the competitive set too narrowly is the central failure mode. Always
  include non-software alternatives.
- Every claimed vulnerability must cite evidence (a review, a filing, a pricing
  page), not assertion.

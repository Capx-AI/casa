---
id: willingness-to-pay-research
title: Willingness-to-Pay Research
level: 1
summary: >-
  Run structured buyer interviews to discover the value metric and price band the market will pay
  before you build any pricing or packaging.
applies_to:
  types:
    - '*'
  requires_traits: []
  excluded_traits: []
relevance: core
department: Finance
criticality: core
selection_hint: >-
  Choose before setting any price. Strongest when you have target accounts identified but no revenue
  and no defended price point yet.
depends_on:
  - problem-validation-interviews
  - icp-target-account-listing
soft_after:
  - problem-validation-interviews
produces:
  - wtp_evidence
  - value_metric
  - price_band_estimate
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: true
recurring: false
typical_milestone: pre-revenue pricing readiness
existential_at:
  - landing
  - building
model_fit:
  - recurring
  - transactional
  - self_serve
  - sales_led
deliverable:
  artifact: wtp_evidence
  sections:
    - Value metric and rationale
    - Price band by segment with quotes
    - Budget owner and buying trigger
    - Sensitivity notes and open risks
  max_words: 700
rubric: >-
  Passes if the value metric is named, a defensible price band per segment is supported by at least
  eight buyer quotes, and the budget owner is identified.
---

# Willingness-to-Pay Research

## Procedure
1. Pull 10 to 12 qualified buyers from your target account list. Prioritize people who own a budget line for this problem, not just users who feel the pain. Book 25-minute calls this week.
2. Draft a value-metric hypothesis. List 3 to 4 candidate units you could charge against (per seat, per transaction, per workflow run, per outcome delivered) and the cost or pain each unit currently imposes on the buyer.
3. Run the interviews. Anchor on the status quo: what they spend today on tools, headcount, and workarounds. Then probe price with two framings. Ask a Van Westendorp set ("at what price is this too expensive to consider; expensive but worth it; a clear bargain") and test reaction to one concrete number tied to each candidate value metric. Record exact quotes and the dollar figures.
4. After every 3 calls, tag responses by segment and the value metric that resonated. Stop when two segments show a stable price band and a consistent unit. If bands stay scattered after 10 calls, your segmentation is wrong, not the price.
5. Synthesize into the value metric, a low/expected/high price band per segment, the named budget owner, and the buying trigger. Flag any segment where stated willingness is below your likely cost to serve.

## Output
A wtp_evidence brief naming the value_metric, a price_band_estimate per segment, and the budget owner, ready to feed pricing design.

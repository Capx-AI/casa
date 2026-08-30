---
id: pricing-research
title: Pricing Research
level: 2
summary: Triangulate a defensible price range and value metric using Van Westendorp, Gabor-Granger, conjoint, competitor benchmarks, and WTP interviews.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits: []
relevance: core
department: Finance
criticality: core
selection_hint: Run before any packaging or pricing-page decision, once positioning and an ICP exist. Skip only for permanently-free products.
action: "Pull pricing pages for your top 5 competitors to set the price band, then run one Van Westendorp survey."
depends_on:
  - positioning-canvas
soft_after:
  - competitive-teardown
  - market-sizing-tam-sam-som
produces:
  - pricing_research
consumes:
  - positioning
  - icp
  - competitive_landscape
effort: L
leverage: critical
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: pricing-direction-set
deliverable:
  artifact: A pricing research report with a defensible price range and a recommended value metric, written to the company brain.
  sections:
    - Inputs and competitor benchmark band
    - Van Westendorp perceptual range
    - Gabor-Granger elasticity and revenue point
    - Conjoint trade-offs if sample allows
    - Qualitative WTP findings
    - Synthesized price range and value metric with confidence tags
  max_words: 1200
rubric: Passes only when the price range is triangulated across multiple complementary methods rather than a single survey, competitor benchmarking sets the band tested, and every number carries a confidence tag with any unavailable data source stated.
---
# Pricing Research

Pricing is the single highest-leverage financial lever. Do not set a price
arbitrarily or anchor it to the wrong segment. Five complementary methods triangulate
a defensible range and surface the value metric before any packaging decision.

## Procedure

1. Verify inputs: product description, ICP personas, existing pricing, top-5
   competitors and pricing URLs, interview contacts, survey panel, historical
   revenue if any. Flag missing inputs to the founder.
2. Competitor benchmarking first. Establishes the price band to test in surveys.
3. Van Westendorp PSM. Find the perceptual price range (not too cheap, not too dear).
4. Gabor-Granger. Estimate elasticity and a revenue-maximizing point; randomize
   price order to avoid anchoring.
5. Choice-based conjoint (if sample allows, 300+). Reveal feature-price trade-offs.
6. Qualitative WTP interviews last. Explain and pressure-test the quantitative
   findings; surface objections and hidden value drivers.
7. Synthesize a defensible price range and a recommended value metric.

## Output

`pricing_research`: defensible price range, value-metric recommendation, and
evidence per method, written to the company brain, ready for Packaging Tier Design.

## Rules

- No single-survey ground truth. Each method has a distinct failure mode; triangulate.
- Do not run with fewer than ~50 paying customers if the trigger is a pricing review;
  use customer discovery instead.
- Tag confidence on every number. If a panel or data source is unavailable, say so.

Full method theory, survey design, and benchmarks in the source draft above.
Condense, do not pad.

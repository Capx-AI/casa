---
id: growth-loop-design
title: Growth Loop Design
level: 6
summary: Design and instrument self-reinforcing growth loops where one cohort's output funds the next cohort's input.
applies_to:
  types:
    - "*"
  requires_traits:
    - pmf_achieved
  excluded_traits:
    - pre_idea_only
relevance: core
department: Growth
criticality: core
selection_hint: Run first in scale acquisition, before scaling paid spend. Needs market-product fit and channel data already in hand.
depends_on: []
soft_after:
  - analytics-stack-setup
  - attribution-modeling
produces:
  - growth_loops
consumes:
  - analytics_stack
  - attribution_model
  - north_star_metric
effort: L
leverage: critical
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: pmf-confirmed
---
# Growth Loop Design

A growth loop is a closed system where the output of one cycle is automatically
reinvested as the input of the next, producing compounding rather than linear
growth. Funnels need constant external feeding; loops do not. Run this before
scaling spend so paid acquisition feeds a loop, not a leaky funnel.

## Procedure

1. Check structural prerequisites against the Four Fits (market-product,
   product-channel, channel-model, model-market). If a fit is missing, fix it first;
   no loop survives without market-product fit.
2. Select the loop type from the canonical set (viral, content, paid, sales,
   etc.) given the product's market, model, and channel fit.
3. Design explicit mechanics: input, action, output, and the reinvestment step that
   feeds output back to input.
4. Model the loop quantitatively. Set the cycle time and the per-cycle yield (for
   example K-factor for viral, payback for paid). Identify the single binding
   constraint (Theory of Constraints).
5. Ship the minimum viable loop and instrument every step against the event taxonomy.
6. Monitor and optimize the one constraint; only stack a second loop once the first
   is measured and stable.

## Output

`growth_loops`: documented loop mechanics, the quantitative model, the binding
constraint, and instrumentation, written to the company brain. Feeds 096, 097, 098.

## Rules

- Never scale paid spend before the core engine loop is identified and measured.
- Optimize the binding constraint only; effort elsewhere yields no throughput.
- A loop without market-product fit is malpractice; verify fit before designing.

Cadence: revisited at quarterly growth reviews, new product launches, and channel
saturation signals. Full loop taxonomy and case studies are in the source draft.

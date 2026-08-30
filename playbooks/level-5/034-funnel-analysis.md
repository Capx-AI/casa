---
id: funnel-analysis
title: Funnel Analysis
level: 5
summary: Read signup to activation to retention to revenue, find drop-offs, hand off prioritized fixes.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Data
criticality: core
selection_hint: Run once events flow and there are users moving through the funnel. Diagnoses where the funnel leaks and produces testable remediation hypotheses.
action: "Build the signup-to-revenue funnel by stage, then find the single largest statistically significant drop-off to hand off as a hypothesis."
depends_on:
  - analytics-stack-setup
  - event-taxonomy-design
soft_after:
  - north-star-metric
produces:
  - funnel_analysis
  - activation_metric
  - remediation_hypotheses
consumes:
  - analytics_stack
  - event_taxonomy
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: funnel-instrumented
deliverable:
  artifact: A funnel analysis with the activation metric, the diagnosed drop-offs, and prioritized remediation hypotheses, written to the company brain.
  sections:
    - Activation metric and the setup, aha, and habit moments
    - Funnel by stage segmented by channel, device, geo, and persona
    - Drop-offs cross-referenced against deploys and campaigns
    - Bottlenecks prioritized with RICE
    - Top two testable hypotheses with control/variant, MDE, and sample size
  max_words: 900
rubric: Passes only when drop-offs are statistically significant and cross-referenced against the deploy and campaign schedule before being called bottlenecks, bottlenecks are prioritized with RICE, and the top two are handed off as testable hypotheses with a defined MDE and sample size rather than peeked at early.
---
# Funnel Analysis

RECURRING. Instrument, monitor, and optimize the acquisition-to-revenue funnel.
Find statistically significant drop-offs, diagnose root cause, and hand the top
two priorities to the owning function with a data-backed hypothesis. Grounded in
AARRR/RARRA: retention first, because acquisition into a leaky bucket is waste.

## Procedure

1. Define the activation metric: the early action most correlated (ideally causal)
   with long-term retention. Locate setup, aha, and habit moments.
2. Build the funnel by stage and segment by acquisition channel, device, geo, and
   persona against internal and industry benchmarks.
3. Detect drop-offs; cross-reference every anomaly with the deploy and campaign
   schedule before calling it a true bottleneck.
4. Prioritize bottlenecks with RICE (reach, impact, confidence, ease).
5. Generate a testable hypothesis with control/variant, MDE, and required sample
   size; hand off the top two.

## Output

`funnel_analysis`, the chosen `activation_metric`, and `remediation_hypotheses`
written to the company brain and handed to product/growth/sales. Cadence: weekly
or monthly, plus on conversion-rate anomalies and post-launch. Feeds cohort (035)
and the Weekly Business Review (040).

## Rules

- Never peek at A/B results early; peeking inflates the false-positive rate. Run at
  least two business cycles for day-of-week seasonality.
- An anomaly that lines up with a known deploy or campaign is expected, not a
  bottleneck.

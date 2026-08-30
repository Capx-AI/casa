---
id: repeat-purchase-and-aov
title: Repeat Purchase & AOV
level: 5
summary: Measure cohort repeat-purchase rate and average order value, then operate the replenishment, subscribe-and-save, and post-purchase lifecycle that compound them.
applies_to:
  types:
    - ecommerce
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Data
criticality: core
existential_at: [revenue, scaling]
model_fit: [transactional, physical_goods]
selection_hint: The physical-goods retention loop. Run once orders and events are instrumented; repeat rate and AOV expansion decide whether paid acquisition is ever profitable.
action: "Build the cohort repeat-purchase rate and time-to-second-order distribution, then time one post-purchase reorder nudge to the replenishment interval."
depends_on: []
soft_after:
  - cohort-retention-analysis
produces:
  - repeat_purchase_analysis
consumes:
  - analytics_stack
  - event_taxonomy
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: repeat-purchase-baselined
---
# Repeat Purchase & AOV

RECURRING. For a physical-goods business, retention shows up as the second order and the
larger basket, not as a software login. Repeat-purchase rate and average order value are
the two levers that decide whether customer acquisition cost is ever recovered. A first
order can be sold at a loss only if the lifetime that follows is real and measured.

## Procedure

1. Confirm inputs: order-level data with a stable customer id, the order and line-item
   events from the taxonomy, product category and replenishment cadence, and acquisition
   channel per cohort.
2. Build the repeat-purchase view: by acquisition cohort, the share that places a second
   order, the time-to-second-order distribution, and order frequency over a fixed horizon.
3. Measure AOV and its drivers: basket size, units per order, mix, and the lift from
   bundles, thresholds, and cross-sell. Segment by cohort and channel.
4. Map the replenishment opportunity: for consumable SKUs, model the natural reorder
   interval and the fit for subscribe-and-save or a replenishment reminder.
5. Operate the post-purchase lifecycle: the thank-you and education flow, the
   replenishment or reorder nudge timed to the interval, and win-back for lapsed buyers.
6. Tie every shift to an intervention and queue the next test (offer, timing, bundle, or
   subscription terms).

## Output

`repeat_purchase_analysis`: cohort repeat rate, time-to-second-order, AOV and its drivers,
the replenishment and subscribe-and-save opportunity, and the post-purchase lifecycle
state, written to the company brain. Feeds unit economics and the acquisition decision.

## Rules

- Cohort truth, not blended. A blended repeat rate hides whether a channel sends one-time
  buyers or loyal ones.
- Acquire against measured repeat value, never a hoped-for lifetime. The second-order rate
  is the leading indicator that lets a first order run thin.
- For consumables, the reorder interval is the most leveraged number; build the lifecycle
  around it.

Cadence: monthly read at L5, plus on-demand when a repeat-rate or AOV cohort diverges or a
new acquisition channel scales.

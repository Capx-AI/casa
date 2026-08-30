---
id: retargeting
title: Retargeting
level: 6
summary: Run incrementality-governed retargeting across Meta, Google, and LinkedIn, capped before it cannibalizes organic demand.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
selection_hint: Run post-PMF once a live page has audience volume (>= 1000 visitors/30d) and the landing page is optimized. Harvests existing demand; never a brand-building channel.
depends_on:
  - landing-page-cro
soft_after:
  - google-ads
  - meta-ads
  - attribution-modeling
produces:
  - retargeting_program
consumes:
  - optimized_landing_page
  - analytics_stack
  - event_taxonomy
effort: M
leverage: med
reversibility: easy
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: paid-channel-live
---
# Retargeting

Retargeting is a sales activation mechanism that harvests demand prospecting and
organic already created, not a brand exercise. Hold two truths: it is overrated
(platform ROAS is inflated by view-through credit and cannibalized organic, per the
eBay and Uber holdout findings) and underused (with incrementality testing and
exclusion logic it does produce real incremental conversions). It must be capped
before it taxes organic.

## Procedure

1. Pre-flight pixel/tag integrity (Meta EMQ >= 6.0, Google remarketing tag with
   product IDs, LinkedIn Insight Tag), CAPI/server-side events with deduplication.
2. Build audience architecture by recency and intent; layer exclusion and suppression
   lists (existing customers, recent converters) from the CRM.
3. Set frequency caps and cap total retargeting spend at <= 40% of paid media for B2C
   or <= 54% for B2B (Binet and Field / B2B Institute splits). Flag overages for reallocation.
4. Run dynamic retargeting from the catalog feed where applicable.
5. Measure with holdout/incrementality experiments, not platform-reported attribution;
   reallocate monthly on incrementality-adjusted metrics.

## Output

`retargeting_program`: configured, capped, incrementality-measured retargeting across
platforms with an audience architecture doc, recorded in the company brain.

## Rules

- Recurring. Operate continuously with weekly media review.
- Human gate on spend and on any retargeting ROAS outlier without an incrementality test.
- Cap before cannibalization. Over-investing starves the brand activity that creates
  future retargeting audiences.

Full intellectual foundation, pre-flight checks, and budget framework in the source
draft above. Condense, do not pad.

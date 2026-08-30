---
id: ad-revenue-and-yield
title: Ad Revenue and Yield
level: 4
summary: Stand up the ad-monetization stack and optimize fill rate, eCPM, and ARPU so an ad-supported product turns engagement into revenue.
applies_to:
  types:
    - consumer
    - content
  requires_traits:
    - ad_supported
  excluded_traits: []
relevance: core
department: Growth
criticality: core
existential_at: [launched, revenue, scaling]
model_fit: []
selection_hint: The money mechanism for an ad-supported product. Once there is engagement to monetize, fill rate and eCPM are the levers between DAU and revenue, so this is the revenue work for an ad model, not a side task.
depends_on:
  - analytics-stack-setup
soft_after:
  - north-star-metric
produces:
  - ad_revenue_model
consumes:
  - analytics_stack
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: true
recurring: true
typical_milestone: ads-monetized
---
# Ad Revenue and Yield

RECURRING. For an ad-supported product, engagement is only potential revenue until
the ad stack converts it. The chain from a daily active user to a dollar runs through
fill rate (the share of impressions that serve a paid ad), eCPM (the price those
impressions clear at), and the ad load the experience can carry without eroding
retention. This loop builds that stack and then works the yield, so the north-star
engagement metric actually compounds into money.

## Procedure

1. Integrate a demand source: a direct ad server, a mediation layer across networks,
   or a header-bidding setup, sized to the inventory. Instrument impressions, fills,
   clicks, and revenue against `analytics_stack` so every number is attributable.
2. Set the ad load deliberately. Map placements to the engagement surfaces and cap
   frequency, because an aggressive load lifts short-run revenue while quietly raising
   churn. Hold the load as a retention guardrail, not a free dial.
3. Optimize fill rate first: add or rotate demand partners, set price floors, and
   close the gap between requests and paid serves.
4. Optimize eCPM next: enable competition (mediation or bidding), enrich the request
   with first-party context where consent allows, and prune low-clearing partners.
5. Track ARPU and ARPDAU by segment and channel, not a blended average, so a high-value
   cohort is not masked by a low-monetizing one.
6. Record the stack, the yield levers, and the revenue-per-user trend in
   `ad_revenue_model`, with the retention guardrail held alongside the revenue line.

## Output

`ad_revenue_model`: the integrated demand stack, the fill-rate and eCPM baselines, the
ad-load and frequency policy, and the ARPU-by-segment trend, written to the company
brain. Cadence: a weekly yield read plus a monthly demand-partner review, with an
off-cadence pass on a fill or eCPM drop. Feeds the CEO dashboard and unit economics.

## Rules

- Ad load is a retention liability. Never trade a durable engagement decline for a
  short-run revenue bump; the north star is the engagement metric, not this quarter's
  eCPM.
- Optimize fill before price. Unsold inventory is the largest and cheapest yield gap.
- ARPU is a segmented number. Work the cohort that under-monetizes, not the average.

Deepen this loop over time as inventory and demand grow rather than starting a parallel
monetization effort.

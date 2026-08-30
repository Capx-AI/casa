---
id: icp-target-account-listing
title: ICP & Target Account Listing
level: 3
summary: Define the Ideal Customer Profile and build a scored, tiered, enriched target account list for outbound.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - hardware
    - b2b-service
  requires_traits:
    - b2b
  excluded_traits:
    - b2c
    - self_serve_only
relevance: core
department: Sales
criticality: core
model_fit: [sales_led]
selection_hint: Run before any outbound for a sales-led or hybrid B2B motion. Skip for pure B2C or self-serve products with no named-account targeting. Refresh on ICP drift (CAC up, churn up, win rate down).
action: "Write the ICP from your differentiated value, then build and tier a scored list of target accounts for outbound."
depends_on: []
soft_after:
  - positioning-canvas
  - pricing-research
produces:
  - icp
  - target_account_list
consumes:
  - positioning
  - pricing_tiers
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: gtm-foundation
---
# ICP & Target Account Listing

Define who has the highest potential to succeed with the product (ready, willing,
able), then build the scored, tiered list of accounts to pursue. ICP is downstream
of competitive context: derive it from differentiated value, not from a demographic
guess.

## Procedure

1. Map competitive alternatives (including doing nothing and building internally),
   then the differentiated capabilities and the value they deliver. The segment
   that values that differentiation most is the ICP.
2. Write the ICP: firmographic, technographic, psychographic, and explicit negative
   (disqualifying) criteria. Encode readiness, willingness, and ability, not just
   firmographic proxies.
3. Build the target account list. Enrich each account, attach intent signals, and
   score against the ICP criteria.
4. Tier the list (Tier 1 / 2 / 3) by fit and signal strength.
5. Validate ICP-to-data alignment: confirm enriched data actually matches the
   written criteria; produce a validation report.

## Output

`icp` (the written profile) and a tiered, scored `target_account_list`, written to
the company brain. Unblocks outbound sequences (084), discovery (085), demo (086).

## Rules

- B2B only. For pure B2C or self-serve, skip; targeting is audience-level, not
  account-level.
- An account is not Tier 1 without both fit and a live buying signal.
- Recurring: refresh on a 90-day cadence or when drift signals fire (CAC up >30%,
  churn up >15%, win rate down >10pts, new market entry).

Enterprise variant (L7): tiered named-account TAL with per-account stakeholder maps
runs after this L3 base; do not duplicate. Full source draft at the `source` path.

---
id: inventory-and-fulfillment-setup
title: Inventory & Fulfillment Setup
level: 3
summary: Stand up the 3PL or warehouse, the inventory policy, reorder points, and fulfillment SLAs that move product to the customer.
applies_to:
  types:
    - ecommerce
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Operations
criticality: core
model_fit: [physical_goods]
selection_hint: Run once suppliers and landed COGS exist. Operational backbone for delivering physical product; reorder points and SLAs prevent both stockouts and dead capital.
depends_on:
  - supplier-sourcing-and-cogs
soft_after: []
produces:
  - fulfillment_ops
  - inventory_policy
consumes:
  - supplier_list
effort: L
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: fulfillment-ready
---
# Inventory & Fulfillment Setup

Fulfillment is how a physical-goods company actually delivers. The choice of 3PL or
self-operated warehouse, the inventory policy, and the SLAs set the cost, speed, and
reliability the customer experiences. The two failure modes to engineer against are
stockouts (lost revenue) and overstock (capital frozen in inventory).

## Procedure

1. Pull supplier lead times and MOQs from the supplier list; these set the floor for any
   reorder math.
2. Choose the fulfillment model: 3PL versus self-operated, single versus multi-node, and
   the regions to serve. Decide on the demand profile, order volume, SKU count, and
   margin headroom, not on default convenience.
3. Set the inventory policy per SKU: safety stock, reorder point, and reorder quantity
   from lead time, demand variability, and a target service level. Cap capital tied up in
   slow movers.
4. Define fulfillment SLAs: order cutoff times, pick-pack-ship turnaround, and a tracked
   on-time-ship target. Wire inventory and order data to one system of record.
5. Run a pilot batch end to end (receive, store, pick, pack, ship) and reconcile expected
   versus actual cost and time before going live.
6. Instrument the operation: inventory accuracy, stockout rate, days of cover, and per-order
   fulfillment cost.

## Output

`fulfillment_ops` (the live fulfillment operation, its node map, and SLAs) and
`inventory_policy` (reorder points, safety stock, and reorder quantities per SKU) in the
company brain. Gates the shipping and returns policy.

## Rules

- Reorder points come from lead time and demand variability, not a round number. A stockout
  on a hero SKU is lost revenue you cannot recover.
- Do not over-buy to chase a unit-cost break that freezes more capital than the discount
  is worth.
- One system of record for inventory. Two diverging counts guarantee a stockout or an oversell.

Reassess the inventory policy as demand history accumulates and as new SKUs or nodes are
added; deepen this setup rather than duplicating it.

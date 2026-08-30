---
id: supplier-sourcing-and-cogs
title: Supplier Sourcing & COGS
level: 2
summary: Source and qualify suppliers, then model fully landed COGS and target margins per SKU before any price is committed.
applies_to:
  types:
    - ecommerce
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Finance
criticality: core
model_fit: [physical_goods]
selection_hint: The first physical-goods gate. No price, packaging, or unit-economics number is trustworthy until landed COGS per SKU is modeled from real supplier quotes.
depends_on: []
soft_after: []
produces:
  - cogs_model
  - supplier_list
consumes:
  - preorder_demand_signal
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: true
recurring: false
typical_milestone: cogs-modeled
---
# Supplier Sourcing & COGS

For a physical-goods business, cost of goods is the floor under every price and the
single largest variable cost. Set it from real supplier quotes, not a guess. Landed
COGS per SKU is the number that makes pricing, packaging, and unit economics honest,
and it is why money cannot safely flow until this is done.

## Procedure

1. Define the SKU list and spec each item: materials, dimensions, tolerances, required
   certifications, target minimum order quantity (MOQ), and acceptable quality grade.
2. Shortlist suppliers across at least two regions or tiers so no revenue-critical SKU
   is single-sourced. Request quotes, lead times, MOQs, payment terms, and samples.
3. Qualify on more than unit price: sample quality, defect rate, capacity, communication,
   safety and regulatory compliance, and financial stability.
4. Model fully landed COGS per SKU: ex-works unit cost plus tariffs and duties, freight,
   insurance, inbound handling, payment and FX fees, inspection, packaging, and an
   expected defect and return allowance.
5. Set target margins per SKU and a blended catalog margin; flag any SKU that cannot
   clear the margin floor for redesign, renegotiation, or cut.
6. Record terms, MOQs, and lead times into the supplier list so inventory and fulfillment
   can plan reorder points against real numbers.

## Output

`cogs_model` (landed cost and target margin per SKU) and `supplier_list` (qualified
suppliers with terms, MOQs, and lead times) in the company brain. These gate inventory
and fulfillment setup and feed pricing and unit economics.

## Rules

- Landed cost, never ex-works. A unit price that ignores freight, duty, and defect
  allowance understates COGS and overstates margin.
- Never single-source a revenue-critical SKU. Qualify a backup before the first PO.
- Sample before scale. Approve physical samples and a small pilot run before committing
  to a large MOQ.

Revisit when input costs, freight, or duties move materially, or before a new SKU
launch. Deepen this same model rather than starting a parallel one.

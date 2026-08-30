---
id: shipping-returns-policy
title: Shipping & Returns Policy
level: 3
summary: Define shipping options and rates, the returns and RMA policy, and packaging standards the customer sees at checkout and after delivery.
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
selection_hint: Run once fulfillment can quote real shipping costs and lead times. The customer-facing promise on delivery and returns; it sets expectations and protects margin.
depends_on:
  - inventory-and-fulfillment-setup
soft_after: []
produces:
  - shipping_policy
  - returns_policy
consumes:
  - fulfillment_ops
effort: M
leverage: med
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: shipping-returns-set
---
# Shipping & Returns Policy

The shipping and returns policy is the delivery promise the customer reads at checkout
and judges after the box arrives. It is both a conversion lever (clear, fair terms lift
cart completion) and a margin control (free shipping and lenient returns cost real money).
This needs founder approval because it commits the company publicly and carries legal and
financial weight.

## Procedure

1. Pull real per-zone shipping cost and lead time from fulfillment ops; price options
   against actual cost, not a guess.
2. Set shipping options: the tiers offered (standard, expedited, free-over-threshold),
   who pays, the free-shipping threshold if any, and the stated delivery windows.
3. Write the returns and RMA policy: the return window, condition requirements, who pays
   return freight, refund versus exchange versus store credit, and the RMA request and
   inspection flow.
4. Set packaging standards: protection grade, dimensional-weight efficiency, branded
   unboxing where it earns its cost, and any sustainability or compliance requirement.
5. Model the financial impact: blended shipping cost per order and an expected return rate
   and cost, fed back into the COGS and margin model.
6. Publish the policy to checkout, the help center, and order confirmations so the promise
   is consistent everywhere the customer meets it.

## Output

`shipping_policy` (options, rates, thresholds, and delivery windows) and `returns_policy`
(window, conditions, freight responsibility, and RMA flow), published and recorded in the
company brain.

## Rules

- The published policy must match what fulfillment can actually deliver. A promised window
  the operation misses is the fastest route to disputes and chargebacks.
- Price free shipping and lenient returns into COGS deliberately; do not absorb them by
  accident.
- Change a returns policy carefully once live. Tightening terms on existing customers
  erodes trust, so route any change through the founder gate.

Revisit when carrier rates, return rates, or fulfillment nodes change; deepen this policy
rather than running a second one.

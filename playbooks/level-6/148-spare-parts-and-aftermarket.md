---
id: spare-parts-and-aftermarket
title: Spare Parts & Aftermarket
level: 6
summary: Build the aftermarket program for a hardware product, from a spare-parts and accessories catalog and service stock to consumables revenue, refurbishment, and a managed end-of-life path for each model.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: optional
department: Operations
criticality: optional
model_fit: [physical_goods]
selection_hint: Run once a model has an installed base and an RMA pipeline. The aftermarket (spares, consumables, accessories, refurbished units) is a high-margin revenue stream and a service obligation; it also governs how a model is retired without stranding the customers who own it.
depends_on:
  - warranty-and-rma-operations
soft_after:
  - retail-and-channel-distribution
produces:
  - aftermarket_plan
consumes:
  - rma_ops
effort: M
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: aftermarket-live
---
# Spare Parts & Aftermarket

The installed base is an asset that keeps paying after the first sale. Spare parts,
consumables, accessories, paid repairs out of warranty, and refurbished units are often
the highest-margin revenue a hardware company earns, and stocking critical spares is also
a service obligation: a device a customer cannot get a part for is a dead device and a lost
brand. This playbook turns the installed base into a managed aftermarket program and
defines how each model is eventually retired without stranding its owners. It builds on the
RMA flow, which already surfaces which parts fail and recovers units worth refurbishing.

## Procedure

1. Build the aftermarket catalog. From the BOM and the RMA failure-mode data, identify the
   parts that fail or wear, the consumables the device depends on, and the accessories that
   extend it, and define each as a sellable SKU with a price that reflects its margin
   opportunity and the service commitment.
2. Plan service-parts stock. For critical and long-lead components, set a service-stock
   level and a last-time-buy plan so a part that goes end-of-life at the supplier is
   secured for the warranty and service life of the installed base. A part you cannot
   source is a model you cannot repair.
3. Stand up the consumables and accessories revenue stream. Where the device uses
   consumables or pairs with accessories, build the repurchase motion (reorder reminders,
   subscription or auto-replenish, channel listings) so recurring aftermarket revenue
   compounds on each unit sold.
4. Formalize refurbishment. Take the units recovered through RMA, define the refurbish-to-
   standard process and the certified-refurbished grade, and route them to a discounted
   sales channel or to advance-replacement stock, recovering value instead of scrapping.
5. Set out-of-warranty service. Define paid repair and out-of-warranty replacement pricing
   and the self-service repair path (parts, guides) where it fits the product and the law,
   turning post-warranty failures into revenue and retention rather than churn.
6. Plan end-of-life per model. Set the dates the model stops being sold, stops getting
   firmware and security updates, and stops being serviced; secure the last-time-buy stock
   to honor warranty and service commitments past end-of-sale; and communicate the
   timeline and the upgrade path to the installed base.

## Output

`aftermarket_plan` in the company brain: the spare-parts and accessories catalog, the
service-stock and last-time-buy plan, the consumables and refurbishment revenue motions,
the out-of-warranty service pricing, and the per-model end-of-life schedule. Feeds revenue
forecasting, inventory planning, and the customer-communication plan for retirement.

## Rules

- Secure a last-time-buy for critical parts before the supplier ends production. A
  stranded part orphans every unit that depends on it and breaks the warranty promise.
- Refurbish recovered units to a defined standard, never quietly mix them into new-unit
  channels. A clear certified-refurbished grade is revenue; a hidden one is a returns and
  trust problem.
- An end-of-life is announced with a date and an upgrade path, not by silence. Cutting
  security updates without notice abandons paying customers and, for a connected device,
  leaves a live vulnerability in the field.

Revisit when a model nears end-of-life, a critical part goes end-of-life at the supplier,
or the RMA data shifts which parts the installed base needs. Deepen this same plan rather
than running a parallel one.

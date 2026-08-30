---
id: retail-and-channel-distribution
title: Retail & Channel Distribution
level: 6
summary: Open and manage the indirect sales channels a hardware product scales through, from distributors and retail buyers to online marketplaces, with channel margins, MAP pricing discipline, and sell-through tracking.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Growth
criticality: growth
model_fit: [physical_goods]
selection_hint: Run once the device is certified and producible at volume and direct demand is proven. Retail and distribution multiply reach but take a margin and impose terms; enter deliberately with priced channel economics and a MAP policy, not by accepting the first distributor that calls.
depends_on:
  - hardware-certification-and-compliance
soft_after:
  - contract-manufacturing-setup
produces:
  - channel_distribution
consumes:
  - certifications
effort: L
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: channels-open
---
# Retail & Channel Distribution

Direct-to-consumer proves a hardware product; channel scales it. But every distributor,
retailer, and marketplace takes a cut of the margin, dictates terms, and stands between
the brand and the customer. Done wrong, channel turns a healthy unit economic into a loss
and lets discounters destroy the price. This playbook opens the right channels in the
right order, sets the margin stack so each tier is profitable, and installs the pricing
discipline (MAP) and sell-through tracking that keep the channel a growth engine rather
than a margin leak. The device must be lawful to sell first, which is why certification
gates it.

## Procedure

1. Map the channel architecture. Decide which mix the product needs: direct (own store),
   online marketplaces (Amazon and category-specific platforms), e-tailers, brick-and-
   mortar retail, and two-step distribution (distributor to reseller) for breadth. Pick
   the channels your buyer actually shops, not every channel available.
2. Build the margin stack. Work back from the retail price (MSRP) through each tier's
   required margin (retailer markup, distributor margin, marketplace referral fees,
   fulfillment) to the price you sell in at, and confirm the unit economics survive every
   tier. If a channel does not clear COGS plus contribution, it does not open.
3. Set and enforce a MAP (Minimum Advertised Price) policy. Publish the minimum
   advertised price, the enforcement steps, and the consequence for a violation, so one
   discounter cannot collapse the price for every other partner and your own store.
   Monitor listings for breaches.
4. Qualify and sign partners. Vet distributors and key retail accounts on category fit,
   reach, support capability, and payment terms; negotiate the trade terms (price,
   payment, returns and stock rotation, co-op marketing, who owns warranty and RMA at the
   counter). Get the channel-conflict rules in writing.
5. Stand up marketplace listings deliberately. Optimize the product detail page (title,
   images, A+ content, reviews), decide first-party versus third-party selling, and
   protect the buy box and the brand registry against counterfeit and unauthorized
   sellers.
6. Manage the channel as an operation. Track sell-in versus sell-through, weeks of cover
   in the channel, returns and chargebacks by partner, and channel-attributed revenue.
   Reorder against sell-through, not sell-in, so the channel does not bloat with unsold
   stock.

## Output

`channel_distribution` in the company brain: the channel architecture and chosen
partners, the per-tier margin stack, the MAP policy and enforcement, the trade terms and
channel-conflict rules, and the sell-through and returns tracking. Feeds revenue
forecasting, inventory planning, and the warranty and RMA process at the point of sale.

## Rules

- Price the whole margin stack before opening a channel. A tier that does not clear COGS
  plus contribution loses money on every unit it sells; volume makes it worse.
- A MAP policy is enforced or it is decoration. One unpunished discounter trains the
  entire channel to break price.
- Track sell-through, not sell-in. Stuffing the channel books revenue that returns as
  stock rotation and dead inventory next quarter.
- Settle who owns warranty and RMA at the counter before the first PO, not after the first
  return dispute.

Human gate: a founder approves channel terms, partner contracts, and the MAP policy
before they are committed. Revisit on a new market, a margin or terms change, or a
channel-conflict dispute.

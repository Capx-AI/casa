---
id: marketplace-supply-acquisition
title: Marketplace Supply Acquisition
level: 4
summary: Acquire, vet, and onboard the supply side of the marketplace, the harder side to bootstrap, and seed it ahead of demand.
applies_to:
  types:
    - marketplace
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Growth
criticality: core
model_fit: [marketplace]
selection_hint: The hard side of a marketplace. Supply (sellers, providers, hosts, creators) is usually the binding constraint; concentrate it in one beachhead so early demand always finds a fillable match.
action: "Pick one narrow category and geography, then concierge-onboard your first ten vetted suppliers to live listings before opening demand."
depends_on: []
soft_after:
  - marketplace-trust-and-safety
produces:
  - supply_pipeline
consumes: []
effort: L
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: true
recurring: false
typical_milestone: supply-onboarded
---
# Marketplace Supply Acquisition

A marketplace has two sides and they are not equally hard. Supply (the sellers,
providers, hosts, or creators) is almost always the constraint and the side that
must be built first. The cold-start problem is solved from the supply side:
demand will not stay if it lands on an empty marketplace, so liquidity is seeded
into a narrow beachhead before the demand side is opened. Until supply exists,
nothing can transact and no revenue can flow.

## Procedure

1. Pick the supply beachhead: one narrow, concentrated category and geography
   where you can reach, sign, and serve enough suppliers that any early demand
   finds a fillable match. Density inside one beachhead beats thin coverage
   everywhere.
2. Define the ideal supplier and a minimum-quality bar: who they are, what
   inventory or availability they bring, and the vetting criteria (identity,
   quality, reliability, compliance) that protect the demand side.
3. Build the acquisition channels: direct outreach, manual recruiting (do things
   that do not scale), poaching from incumbent platforms or offline sources, and
   referrals from signed suppliers. Track cost and conversion per channel.
4. Remove onboarding friction. The path from interested supplier to live,
   listable inventory must be short and assisted; concierge-onboard the first
   cohort by hand to find and clear the real blockers.
5. Seed supply ahead of demand. Ensure enough live, quality listings exist before
   the demand side is driven, so the first buyers never hit an empty marketplace.
6. Instrument the supply funnel: applications, approvals, time-to-first-listing,
   active suppliers, and supplier retention. Hand the live supplier base and these
   metrics to liquidity balancing.

## Output

`supply_pipeline` (the vetted, onboarded supplier base plus the acquisition
channels and funnel metrics) in the company brain. This gates marketplace launch
and feeds marketplace-liquidity-balancing, which maintains the supply and demand
balance as a recurring loop.

## Rules

- Build the hard side first. A marketplace with demand and no supply is a dead
  end; supply with no demand can still be seeded into a beachhead and held.
- Concentrate, do not spread. Liquidity in one narrow beachhead beats a thin
  presence across many categories or cities.
- Vet before you scale. One bad supplier can poison demand trust faster than ten
  good ones build it, so the quality bar is set before volume, not after.

Hand the onboarded base to marketplace-liquidity-balancing for ongoing balance
and to marketplace-trust-and-safety for ongoing enforcement.

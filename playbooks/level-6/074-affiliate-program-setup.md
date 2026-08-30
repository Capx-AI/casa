---
id: affiliate-program-setup
title: Affiliate Program Setup
level: 6
summary: Launch a fraud-protected affiliate program that pays for incremental revenue and recruits content-driven partners, not coupon traffic.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
    - pmf_achieved
  excluded_traits: []
relevance: optional
department: Growth
criticality: optional
selection_hint: Gated on M1 retention >= 40%, 50+ paying customers, and a clean funnel. An affiliate program is a multiplier for existing momentum, never a primary early channel.
depends_on:
  - landing-page-cro
soft_after:
  - referral-program
  - unit-economics
produces:
  - affiliate_program
consumes:
  - optimized_landing_page
  - paying_customer
effort: L
leverage: med
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: partner-channel-live
---
# Affiliate Program Setup

An affiliate program is a multiplier for existing organic momentum, not a substitute
for PMF or an early-stage primary channel. The two classic failure modes: launching
before the funnel is proven (affiliates send traffic that bounces, burning relationships)
and paying for subsidized brand traffic (coupon sites and extensions that intercept
last-click credit, as the Honey scandal crystallized). Pay for incremental revenue,
build for trust over volume, and design for the long game.

## Procedure

1. Confirm the gate: M1 retention >= 40%, a working checkout, and 50+ paying customers
   who can seed the program.
2. Select the commission model by billing structure and LTV (recurring for predictable
   SaaS, hybrid, flat bounty, or percent of sale). Set max sustainable rate = target
   CAC / LTV. Separate discovery affiliates from coupon-hunters and govern them differently.
3. Pick a tracking/attribution platform; enforce last-click hygiene and cookie protection.
4. Recruit content-driven partners (top 10% drive ~90% of revenue); onboard, activate,
   and equip with a media kit.
5. Set legal terms, FTC disclosure, and fraud prevention; gate payouts behind a human approval.
6. Measure on incrementality and partner-cohort LTV, not raw signups.

## Output

`affiliate_program`: a live, fraud-protected program with vetted partners generating
tracked incremental revenue, recorded in the company brain.

## Rules

- Recurring. Operate and recruit continuously; review monthly.
- Hard retention gate. Do not launch before M1 retention >= 40% and a clean funnel.
- Human gate on commission economics and payouts. Pay for incremental revenue only.

At L6 scale, do not run affiliate + referral (077) + influencer (075) simultaneously
without clean per-channel attribution. Full payout models, fraud, and economics in
the source draft above. Condense, do not pad.

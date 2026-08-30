---
id: linkedin-ads
title: LinkedIn Ads
level: 7
summary: Run a dual-track B2B LinkedIn motion (demand creation plus demand capture) with ABM audiences and Insight Tag plus CAPI measurement.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
  requires_traits:
    - b2b
    - high_acv
  excluded_traits:
    - b2c
    - low_acv
relevance: conditional
department: Growth
criticality: optional
model_fit: [sales_led]
selection_hint: Only with ACV >= $5k, budget >= $3k/mo, audience >= 50k, and CAPI. CPM economics are fatal below the ACV floor; a B2C or low-ACV company never runs this.
depends_on:
  - linkedin-organic
soft_after:
  - icp-target-account-listing
  - attribution-modeling
produces:
  - linkedin_ads_program
consumes:
  - icp
  - analytics_stack
  - attribution_model
effort: L
leverage: med
reversibility: easy
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: enterprise-pipeline-live
---
# LinkedIn Ads

LinkedIn Ads is a high-cost, high-precision B2B engine, not appropriate for every
business. CPCs of $8 to $15 make the economics unworkable below a $5k ACV floor.
The motion is dual-track: ~60% demand creation (ungated content to the 95% out-of-
market, building memory) and ~40% demand capture (hard offers to the 5% in-market),
layered with ABM.

## Procedure

1. Run the gate in sequence before any budget: ACV > $5k, monthly budget >= $3k,
   ICP documented (firmographic plus psychographic), Insight Tag plus CAPI installed
   and verified. Fail any gate and abort or micro-test only.
2. Build ABM audiences by company, title, seniority, skills; layer intent data
   (6sense/Demandbase) to detect in-market accounts.
3. Track 1 (demand creation): distribute ungated, zero-click thought leadership;
   measure reach, frequency, and self-reported attribution, not CPL.
4. Track 2 (demand capture): hard offers to the in-market 5%; trigger BOFU campaigns
   on the buying committee of high-intent accounts and notify the AE for coordinated outreach.
5. Manage to cost-per-opportunity; pause when CPO exceeds 3x target, audience drops
   below 50k, signal quality degrades, or frequency exceeds 8/30 days without refresh.

## Output

`linkedin_ads_program`: a live dual-track ABM motion with verified measurement and
CPO discipline, recorded in the company brain.

## Rules

- Recurring. Operate continuously with a 14-day rolling review.
- Hard ACV/audience/budget gate. Below threshold, do not run; route budget to Search or Meta.
- Human gate on spend. CPL is a vanity metric at TOFU; optimize for pipeline influence.

Full 95-5 rule, ABM integration, and abort thresholds in the source draft above.
Condense, do not pad.

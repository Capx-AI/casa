---
id: creative-testing
title: Creative Testing
level: 6
summary: Run a weekly, statistically rigorous creative testing loop that finds winning paid-social ad creative and kills losers fast.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
selection_hint: Run continuously alongside active paid social once CPA targets are set. Creative drives ~56% of paid ROI; volume and speed of iteration are the structural advantage.
depends_on: []
soft_after:
  - meta-ads
  - tiktok-growth
produces:
  - winning_creative
consumes:
  - meta_ads_program
  - tone_of_voice
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: creative-engine-live
---
# Creative Testing

Creative testing replaces intuition with a repeatable, data-grounded loop. It is a
math problem, not gambling: if the win rate is 3 to 5% of ads tested, finding a
winner needs ~20 to 33 ads per concept, so volume and speed are structural advantages.
Creative drives ~56% of campaign ROI, and since Andromeda, creative is the targeting.
A winner hits target CPA with confidence, holds 14+ days, and teaches a learnable signal.

## Procedure

1. Confirm inputs: target and breakeven CPA, products, ranked USPs, named personas,
   brand voice and visual rules, landing pages. Halt and request anything missing.
2. Work the creative hierarchy: concept, then angle, then hook, then variant. Test
   genuinely distinct concepts, not near-duplicates (Andromeda similarity penalty).
3. Run the weekly sprint: brief, produce, launch a batch in the ABO testing campaign
   on broad targeting; let each candidate accumulate enough spend for a confident read.
4. Apply kill rules and minimum spend thresholds to prevent false positives from
   scaling; graduate true winners into the scaling campaign.
5. Respond to triggers: winner fatigue, budget scale event, new SKU, platform change,
   competitor longevity, CPA drift, or hit rate below 1 per 20.
6. Compound learnings into the next brief.

## Output

`winning_creative`: graduated winning concepts plus a documented learning library and
running test queue, recorded in the company brain.

## Rules

- Recurring. Weekly sprint cadence; this never completes.
- No winner called before statistical confidence and the durability window; a 3-day
  spike is a false positive.
- Diversity is mandatory. Near-duplicate variants tank delivery under Andromeda.

Full creative hierarchy, statistical rigor, and kill rules in the source draft above.
Condense, do not pad.

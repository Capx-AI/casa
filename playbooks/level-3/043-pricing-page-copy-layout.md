---
id: pricing-page-copy-layout
title: Pricing Page Copy & Layout
level: 3
summary: "Write and lay out the pricing page that converts: tier names, value-led copy, comparison table, FAQ, social proof, and an A/B roadmap."
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
    - has_website
  excluded_traits: []
relevance: core
department: Growth
criticality: core
selection_hint: Run once positioning and tiers are locked, never before, or the page gets rewritten around placeholder prices. The highest-intent page on the site.
depends_on:
  - pricing-research
  - packaging-tier-design
  - positioning-canvas
soft_after:
  - tone-of-voice-guide
produces:
  - pricing_page
consumes:
  - positioning
  - pricing_tiers
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: launch-assets-ready
---
# Pricing Page Copy & Layout

The pricing page is the highest-leverage page on the site: buyer intent is highest
and every element either removes a buying objection or creates one.

## Procedure

1. Confirm inputs: positioning statement, two or more buyer personas with JTBD,
   objections, and WTP, competitor pricing, a corpus of 50+ reviews, gross-margin
   floor, and existing page analytics if any.
2. Structure the anatomy: headline, subheadline, tier cards, comparison table, FAQ,
   social proof, risk reversal. Anchor with the highest-priced tier first.
3. Write value-led copy using voice-of-customer language pulled from the review
   corpus. Name tiers for the persona, not for internal jargon.
4. Build the comparison table in Markdown for developer handoff; communicate
   features as outcomes.
5. Write the FAQ to handle the top objections at scale; add trust signals.
6. Produce a layout spec including mobile breakpoints.
7. Prioritize the first three A/B hypotheses by expected impact.

## Output

`pricing_page`: full copy document, layout spec, Markdown comparison table, and an
A/B testing roadmap, written to the company brain and ready for the launch plan.

## Rules

- Never run before pricing tiers are locked; placeholder prices waste the work.
- No tier may price below the gross-margin floor.
- Copy discipline: no em-dashes, no emojis, institutional tone.

Full psychology principles, table design, and objection handling in the source draft
above. Condense, do not pad.

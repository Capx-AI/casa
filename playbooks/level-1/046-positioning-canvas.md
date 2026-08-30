---
id: positioning-canvas
title: Positioning Canvas
level: 1
summary: Run an April Dunford style canvas to define how the product is the best at something a defined market cares about.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Strategy
criticality: core
selection_hint: The strategic root of all GTM. Run once a beachhead is committed; every pricing, launch, and content decision derives from it.
action: "List the alternatives a best-fit customer would use without you, then map your unique attributes to the value they create."
depends_on:
  - beachhead-selection
soft_after:
  - competitive-teardown
  - jobs-to-be-done-extraction
produces:
  - positioning
consumes:
  - beachhead
  - competitive_landscape
  - jtbd
effort: M
leverage: critical
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: positioning-locked
---
# Positioning Canvas

Positioning is deliberately defining how you are the best at something a defined
market cares deeply about. It is not a tagline. Work the five components in strict
order; each constrains the next.

## Procedure

1. Competitive alternatives. List what best-fit customers would actually use if you
   did not exist (substitutes and workarounds, not just named rivals). Derive from
   the competitive landscape and win-loss evidence.
2. Unique attributes. Capabilities you have that the alternatives do not.
3. Value themes. Translate each unique attribute into the value it produces for the
   customer. Keep only attributes that map to value a best-fit customer cares about.
4. Best-fit customers. The segment whose characteristics make them care most about
   that value. Ground in the 10-20 happiest, lowest-churn customers or the evidence
   corpus.
5. Market category. The frame of reference that makes the value obvious to that
   segment.
6. Synthesize a one-paragraph positioning statement plus a five-act sales narrative.

## Output

`positioning`: the statement, the five-component canvas, and the sales narrative,
written to the company brain. Mark provisional sections that need founder validation.

## Rules

- Strict sequence. Do not run components in parallel; a wrong alternatives list
  poisons every downstream component.
- Human gate before locking. Positioning should hold 6 to 18 months; do not
  over-rotate. Do not re-run if done under 60 days ago with no triggering signal.
- No fabricated customer evidence. If interviews are missing, use review corpus and
  flag confidence.

Full method, triggers, and detection logic in the source draft above. Condense, do
not pad.

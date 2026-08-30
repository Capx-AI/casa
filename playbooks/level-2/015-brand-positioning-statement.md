---
id: brand-positioning-statement
title: Brand Positioning Statement
level: 2
summary: Write the one-to-three sentence statement of who you serve, the category, and why you win.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Brand
criticality: core
selection_hint: Strategic positioning bet that every content, brand, and trademark step downstream consumes. Run once the MVP slice is scoped.
action: "Name the competitive alternatives first, then write a one-to-three sentence positioning statement that deliberately excludes some audiences."
depends_on:
  - mvp-scoping
soft_after:
  - positioning-canvas
produces:
  - brand_positioning
  - messaging_hierarchy
consumes:
  - mvp_scope
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: positioning-locked
deliverable:
  artifact: A brand positioning statement with its five-component canvas and a messaging hierarchy, written to the company brain.
  sections:
    - Competitive alternatives named first
    - Five components (target customer, need, category, key benefit, differentiation)
    - Positioning statement in one to three sentences
    - Messaging hierarchy
  max_words: 600
rubric: Passes only when positioning is anchored to the customer and the competitive alternative rather than the feature list, the statement is one to three sentences that deliberately excludes some audiences, and the copy carries no em-dashes or emojis.
---
# Brand Positioning Statement

Positioning is a strategic bet about where you compete and why you win, not a
tagline. It is the frame of reference in the prospect's mind, and it cascades into
copy, brand, pricing, and sales. Produce positioning here; messaging and copy come
later.

## Procedure

1. Gather inputs: the product capability, the ICP, the competitive alternatives,
   and any customer feedback corpus available. Flag gaps; mark the output
   provisional if the evidence bar is not met.
2. Name the competitive alternatives first (what the customer would do instead).
   This anchors positioning to the customer, not the feature list.
3. Fill the five components: target customer, the need, the category you compete
   in, the key benefit, and the primary differentiation versus the alternative.
4. Write the statement in one to three sentences using the Moore template. Derive
   a short messaging hierarchy beneath it.

## Output

`brand_positioning` (the statement plus the five-component canvas) and a
`messaging_hierarchy`, written to the company brain. Unblocks tone of voice (017),
trademark clearance (011), and visual identity (016).

## Rules

- Positioning to the customer, never to the product. If you started from features,
  restart from the customer's job.
- Do not try to speak to everyone. A statement that excludes no one resonates with
  no one.
- No em-dashes, no emojis in any statement copy.

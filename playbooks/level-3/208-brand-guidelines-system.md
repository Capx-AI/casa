---
id: brand-guidelines-system
title: Brand Guidelines System
level: 3
summary: >-
  A lightweight brand system covering logo usage, color, type, voice, and component do/don't rules
  so every output stays visually and verbally consistent.
applies_to:
  types:
    - '*'
  requires_traits: []
  excluded_traits: []
relevance: recommended
department: Brand
criticality: growth
selection_hint: >-
  Run once a positioning statement and a working logo exist and output is starting to fan out across
  surfaces (site, deck, social, product UI).
depends_on:
  - brand-positioning-statement
soft_after: []
produces:
  - brand_system
  - color_tokens
  - type_scale
  - voice_guide
  - logo_usage_rules
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: first-brand-surface
model_fit:
  - recurring
  - transactional
  - self_serve
  - sales_led
  - marketplace
  - physical_goods
  - local
deliverable:
  artifact: brand_system
  sections:
    - Brand core and personality
    - Color tokens and contrast pairs
    - Type scale and usage
    - Logo usage and forbidden treatments
    - Voice do/don't and banned terms
  max_words: 900
rubric: >-
  Passes if a contributor who has never seen the brand can produce an on-brand surface using only
  the document, with named tokens, a fixed type scale, explicit logo rules, and concrete voice
  examples.
---

# Brand Guidelines System

## Procedure
1. Lock the core. Pull your positioning statement and write one paragraph defining the brand's personality in three adjectives and what it is explicitly not. This anchors every choice below.
2. Define color tokens. Set a primary, one or two accents, and a neutral ramp (background, surface, border, text). Record each as a named hex token (brand_primary, surface_muted) plus minimum contrast pairs. Ship them as CSS variables or a design-tool palette so they are reusable, not screenshots.
3. Define the type scale. Pick one display and one body family, then fix a scale (for example 12, 14, 16, 20, 28, 40) with weights and line-heights. Name each step (heading_l, body_m) and note the one or two cases each is used for.
4. Write the logo usage rules. Specify clear space, minimum size, approved color variants, and three forbidden treatments (no stretching, no recoloring, no drop shadows). Add a single approved and one rejected example per rule.
5. Write the voice guide. Give five do/don't pairs with rewritten before-and-after sentences, plus a banned-terms list. Keep copy free of em-dashes and emojis to stay institutional.
6. Assemble into one shareable file and link it from the repo README and the design tool so contributors and agents reference it before producing any new surface.

## Output
A single brand_system document with color_tokens, type_scale, logo_usage_rules, and voice_guide that any teammate or agent can apply without asking.

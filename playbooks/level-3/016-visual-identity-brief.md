---
id: visual-identity-brief
title: Visual Identity Brief
level: 3
summary: "Produce a machine-readable visual identity spec: logo, palette, typography, and usage rules."
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Brand
criticality: growth
selection_hint: At L3 ship only the Minimum Viable Brand (Inter, one primary color, text wordmark). The full identity here is a post-PMF mature variant; do not run the full build pre-PMF.
depends_on:
  - brand-positioning-statement
soft_after:
  - tone-of-voice-guide
produces:
  - visual_identity
consumes:
  - brand_positioning
effort: L
leverage: med
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: brand-shipped
---
# Visual Identity Brief

A visual identity is the lowest-cost-per-impression marketing asset a company owns.
This playbook produces a rigid, machine-readable spec that both human designers and
generative models can execute deterministically. The best identities are the most
appropriate, not the most creative.

## Procedure (Minimum Viable Brand at L3)

1. Deploy the MVB: Inter typeface, one primary color, a text-only wordmark. This
   ships in hours and is built for speed, not differentiation.
2. Record the MVB in the company brain as the active identity until a PMF trigger
   fires.

## Mature variant (post-PMF, do not run early)

When MoM revenue growth, NPS, or CAC payback crosses the trigger thresholds, run
the full build: parse the brand strategy, map personality adjectives to a Jungian
archetype (flag any archetype-audience conflict and halt), then specify logo,
palette (hex), typography (modular scale), and usage rules. Founder approves at the
direction-lock and final-approval checkpoints.

## Output

`visual_identity` (MVB spec at L3, or the full identity package and brand
guidelines post-PMF), written to the company brain.

## Rules

- Do not build the full identity pre-PMF; a rebrand will happen anyway. Use the MVB.
- Halt on a strategy-audience archetype conflict and request human resolution.

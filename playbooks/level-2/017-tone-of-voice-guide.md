---
id: tone-of-voice-guide
title: Tone of Voice Guide
level: 2
summary: Turn positioning into a machine-executable voice spec with do/don't examples and channel tone maps.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Brand
criticality: core
selection_hint: The voice contract every content-producing agent reads. Run after positioning so all copy speaks consistently.
depends_on:
  - brand-positioning-statement
soft_after: []
produces:
  - tone_of_voice
  - voice_rules
consumes:
  - brand_positioning
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: voice-locked
---
# Tone of Voice Guide

Generic style guides fail agents because subjective adjectives like "be friendly"
cannot be operationalized. Replace every subjective instruction with a verifiable
condition, a rule, and a concrete example so any content agent applies the voice
consistently.

## Procedure

1. Pull inputs: positioning, audience personas, at least ten existing content
   samples, and competitor voice samples. Flag any missing required input.
2. Define the voice on the four dimensions (formal vs casual, serious vs funny,
   respectful vs irreverent, matter-of-fact vs enthusiastic).
3. Map context-specific tone: how the voice flexes by channel and by the user's
   emotional state (error, success, support, marketing).
4. Build the do/don't example library per channel and write the voice rules block
   that gets injected into every content agent's system prompt.

## Output

`tone_of_voice` (the voice system plus channel tone maps) and `voice_rules` (the
enforceable prompt block), written to the company brain. Consumed by all
content-producing playbooks.

## Rules

- Every rule needs a verifiable condition and a concrete do/don't example.
- Banned in all copy: em-dashes and emojis. Tone is institutional and
  category-creating, never founder-bro.

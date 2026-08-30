---
id: naming-and-brand-architecture
title: Naming and Brand Architecture
level: 1
summary: >-
  Choose a defensible company or product name and decide whether you run a branded house or a house
  of brands, before the name calcifies across domains, contracts, and code.
applies_to:
  types:
    - '*'
  requires_traits: []
  excluded_traits: []
relevance: core
department: Brand
criticality: core
selection_hint: >-
  Run when the company or product is unnamed, when a placeholder name is leaking into copy, or when
  a second product line forces a parent-versus-standalone branding choice.
depends_on: []
soft_after:
  - brand-positioning-statement
produces:
  - brand_name_decision
  - brand_architecture
  - name_shortlist
  - domain_and_handle_reservations
  - trademark_clearance_notes
consumes: []
effort: M
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: Pre-launch identity lock
model_fit:
  - recurring
  - transactional
  - self_serve
  - sales_led
  - marketplace
  - physical_goods
  - local
deliverable:
  artifact: brand_name_decision
  sections:
    - Chosen name and rationale
    - Architecture decision (branded house vs house of brands)
    - Clearance and availability evidence
    - Naming system for future products
  max_words: 600
rubric: >-
  Passes if one name is locked with documented trademark and domain clearance, and the architecture
  rule states how the next product gets named.
---

# Naming and Brand Architecture

## Procedure
1. Write the constraints first. In one page, list what the name must do: the positioning it should signal, the categories you may expand into, languages and markets it must survive, and hard exclusions (existing competitors, offensive readings). This is the filter every candidate runs through.
2. Generate 25 to 40 candidates across naming styles: descriptive, suggestive, invented, and founder or lexical. Cut to a shortlist of 6 to 8 by reading each aloud, checking spelling on first hearing, and sanity-testing meaning in your top two non-English markets.
3. Clear the shortlist. For each survivor check exact and near trademark conflicts in your operating classes, the .com or primary TLD, the core social handles, and a same-name app or repo collision. Kill any name with a live mark in your class. Keep evidence in trademark_clearance_notes.
4. Decide architecture explicitly. Choose branded house (one master brand, descriptive sub-names) for a single focused offer, or house of brands (independent names) only if products serve genuinely different buyers or risk profiles. Write the rule that names product number two, so the choice is not relitigated later.
5. Lock one name. Reserve the domain and handles the same day, record the decision with its rationale, and replace every placeholder name in code, copy, and contracts.

## Output
A locked brand_name_decision and brand_architecture rule, with cleared domain and handle reservations.

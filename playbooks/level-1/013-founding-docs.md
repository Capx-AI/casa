---
id: founding-docs
title: Founding Docs
level: 1
summary: Generate the cap table, founder vesting, IP assignment, and 83(b) elections that keep the entity investable.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Legal
criticality: core
selection_hint: Run the moment the entity is registered; the 83(b) clock is 30 days. Errors here are fatal to future fundraising.
depends_on:
  - entity-formation
soft_after: []
produces:
  - cap_table
  - ip_assignment
  - founding_docs
consumes:
  - legal_entity
effort: M
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: company-exists
---
# Founding Docs

The founding docs are the source code of the corporate entity: ownership,
governance, a clean IP chain of title, and tax compliance. A missed 83(b), a
broken cap table, or an IP gap can be fatal to fundraising or an acquisition.

## Procedure

1. Build the cap table: founders, an ESOP reserve (standard 10-15% pre-Series A),
   and authorized-but-unissued shares against 10,000,000 authorized.
2. Set founder equity splits and vesting (standard 4-year vest, 1-year cliff).
3. Execute restricted stock purchase agreements and file 83(b) elections within 30
   days of share issuance.
4. Execute IP assignment from every founder and contractor to the company; carve
   out documented prior work. Paper confidentiality and advisor agreements.

## Output

`cap_table`, `ip_assignment` (signed, with carve-outs), and the `founding_docs`
set, written to the company brain. Unlocks ToS and privacy (014).

## Rules

- The 83(b) window is a hard 30-day deadline from issuance; missing it is
  irreversible. Treat it as the highest-priority clock at L1.
- Founder vesting and equity allocation are hard-to-reverse decisions; they
  escalate for founder approval (human gate).
- No equity is issued before IP assignment is signed; a clean chain of title is
  non-negotiable.

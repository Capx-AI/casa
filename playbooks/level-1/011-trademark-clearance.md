---
id: trademark-clearance
title: Trademark Clearance
level: 1
summary: Run federal, state, and common-law clearance for the mark, assess risk, and file in target jurisdictions.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: recommended
department: Legal
criticality: core
selection_hint: Run the knockout search the moment the name is chosen; file once goods/services are defined. Filing is a legal, money, hard-to-reverse action.
depends_on:
  - company-naming
soft_after:
  - domain-acquisition
produces:
  - trademark_clearance
  - trademark_filing
consumes:
  - brand_name
effort: M
leverage: med
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: company-exists
---
# Trademark Clearance

Clear the mark before committing to it and file to secure brand identity while
avoiding infringement liability. Run the knockout search at naming time; the full
filing waits on the goods and services description from brand positioning (015).

## Procedure

1. Classify the mark (standard character, logo, trade dress) and rate its
   distinctiveness on the Abercrombie spectrum. Reject generic marks.
2. Determine Nice classes (for SaaS commonly 9, 42, 35).
3. Run the clearance funnel: federal knockout (USPTO TESS or equivalent), state
   registries, and common-law search (search engines, app stores, WHOIS, social).
4. Score likelihood of confusion against the DuPont factors; rate risk Low,
   Medium, or High.
5. If risk is acceptable, file (USPTO TEAS or WIPO Madrid) with correct classes
   and basis. Log serial numbers and set the maintenance and office-action
   monitoring schedule.

## Output

`trademark_clearance` (risk-rated report) and, on filing, `trademark_filing`
(serial numbers, monitoring schedule), written to the company brain.

## Rules

- A filing is a legal commitment and a spend; it escalates for founder approval
  (human gate). High-risk marks are not filed without explicit sign-off.
- Knockout clearance can run at L1; the full multi-class filing needs the goods
  and services description from positioning (015).

---
id: domain-acquisition
title: Domain Acquisition
level: 1
summary: Acquire the primary domain via TLD strategy, broker negotiation, and secure escrow transfer.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Operations
criticality: core
selection_hint: Run once the name is final. Secures the primary digital identity. Money and broker negotiation make this a human-gated spend.
depends_on:
  - company-naming
soft_after:
  - trademark-clearance
produces:
  - primary_domain
consumes:
  - brand_name
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: company-exists
---
# Domain Acquisition

Secure the primary digital identity for the final name. For consumer brands the
exact-match .com is business-critical; operating on an alternate TLD donates
direct traffic to whoever owns the .com.

## Procedure

1. Run an availability sweep across .com, .ai, .io, .co, .net, .org for the brand
   name.
2. Apply the TLD decision tree by business model. For B2C, target the exact-match
   .com. For B2B or AI-native, an .ai or .io may be acceptable, with the .com as a
   later upgrade target.
3. If the target is owned, run WHOIS, classify the holder (live site, parked, PPC),
   and choose an outreach approach. Negotiate through a broker or escrow.
4. Complete the purchase through escrow, transfer, and harden DNS and registrar
   security. Register defensive variants if warranted.

## Output

`primary_domain` (acquired, transferred, secured), written to the company brain.
Feeds hosting (026) and email deliverability (082).

## Rules

- Any spend above the founder's pre-authorized threshold escalates for approval
  (human gate); never wire funds outside escrow.
- Do not accept a non-.com as permanent for a B2C brand; record the .com as a
  funded upgrade target.

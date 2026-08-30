---
id: tos-and-privacy-policy
title: ToS & Privacy Policy
level: 3
summary: Draft Terms of Service, Privacy Policy, and DPA with GDPR, CCPA, DPDP, and LGPD coverage.
applies_to:
  types:
    - "*"
  requires_traits:
    - collects_user_data
  excluded_traits:
    - pre_idea_only
relevance: core
department: Legal
criticality: core
selection_hint: Required before any product that collects user data goes public. Gates on a formed entity and known data practices. Legal and irreversible; always human-gated.
depends_on:
  - entity-formation
soft_after:
  - data-backup-recovery
produces:
  - legal_pages
consumes:
  - legal_entity
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: legal-pages-published
---
# ToS & Privacy Policy

Generate the public legal pages from the company profile and its real data
practices. The output is legally binding and public, so a qualified human reviews
and approves before publication.

## Procedure

1. Collect inputs: legal entity and jurisdiction, product model, the categories of
   data actually collected, third-party integrations, AI-training use, and target
   regions and age demographics.
2. Branch on regulatory thresholds: GDPR/UK lawful basis and SCCs for EU/UK;
   CCPA/CPRA "Do Not Sell or Share" and GPC for California; DPDP consent notices
   for India; LGPD lawful basis for Brazil; COPPA or GDPR Article 8 if directed at
   children.
3. Generate the Privacy Policy (scope, data collected, purpose-to-lawful-basis
   map, sub-processors, transfers, retention, user rights, cookie policy) and the
   ToS (clickwrap acceptance, license, liability caps, indemnification). Add a DPA
   for B2B and any EEA/California processing.
4. Route the full package to human legal review before publishing.

## Output

`legal_pages` (ToS, Privacy Policy, and DPA where required), published and recorded
in the company brain.

## Rules

- Never publish without explicit human approval. This is a legal, irreversible,
  public action under the HITL gates.
- Use clickwrap acceptance; browsewrap is often unenforceable.
- For AI training on user data, prefer consent with an easy opt-out over a bare
  legitimate-interest claim.

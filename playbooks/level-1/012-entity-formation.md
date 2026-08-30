---
id: entity-formation
title: Entity Formation
level: 1
summary: Form the legal entity (default Delaware C-Corp), get the EIN, registered agent, and a bank account.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Legal
criticality: existential
selection_hint: Run once the venture is committed and you need to bank, contract, hire, or raise. Default Delaware C-Corp; deviations need a documented reason.
depends_on: []
soft_after:
  - company-naming
  - beachhead-selection
produces:
  - legal_entity
  - ein
consumes: []
effort: M
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: company-exists
deliverable:
  artifact: An entity-formation record capturing the chosen structure, the filing, the EIN, and the bank account, written to the company brain.
  sections:
    - Founder and raise inputs collected
    - Selected structure with rationale for any deviation from Delaware C-Corp
    - Incorporation filing and registered agent
    - EIN
    - Business bank account
  max_words: 800
rubric: Passes only when the entity structure is chosen against the documented inputs (defaulting to Delaware C-Corp, any deviation justified against a specific condition), the EIN and bank account are recorded, and the binding incorporation step is routed to the founder with any IP, licensing, or jurisdiction risk escalated.
---
# Entity Formation

Form an operational legal entity: structure, registration, EIN, registered agent,
and bank account. The default answer is a Delaware C-Corp; for any business that
will raise venture, issue equity, or pursue a US exit it is the only structure
that avoids a costly later conversion.

## Procedure

1. Collect inputs: founder names, nationalities, residencies, equity split, raise
   intent, equity-grant intent, primary and exit markets, prior-employer IP flags.
2. Select the structure. Default Delaware C-Corp. Document any deviation (LLC for a
   pure cash-cow, local jurisdiction for a non-US market) against a specific
   condition.
3. File incorporation (Stripe Atlas, Clerky, or equivalent) with standard
   10,000,000 authorized common shares. Appoint a registered agent.
4. Obtain the EIN and open the business bank account.

## Output

`legal_entity` (registered, with registered agent) and `ein`, written to the
company brain. Unlocks trademark filing (011), founding docs (013), and ToS and
privacy (014).

## Rules

- Incorporation is a legal, money, hard-to-reverse action and blocks revenue from
  flowing legally; it escalates for founder approval (human gate).
- Escalate to human legal counsel if any founder has prior-employer IP claims, the
  business needs financial licensing, or founders sit in capital-control
  jurisdictions.

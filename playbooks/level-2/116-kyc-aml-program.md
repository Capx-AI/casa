---
id: kyc-aml-program
title: KYC/AML Program
level: 2
summary: Stand up the customer-identity, sanctions-screening, transaction-monitoring, and travel-rule program a crypto business must operate before it can legally move customer value.
applies_to:
  types:
    - crypto
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Legal
criticality: existential
existential_at: [launched, revenue, scaling]
model_fit: [transactional]
selection_hint: The do-or-die gate for any crypto business that custodies or transmits customer value. No onboarding, deposit, or transfer can go live until identity verification, sanctions screening, and transaction monitoring are operating.
action: "Scope which of your activities trigger money-services or VASP obligations per jurisdiction, and name the accountable compliance owner."
depends_on: []
soft_after:
  - entity-formation
produces:
  - compliance_program
consumes: []
effort: L
leverage: critical
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: compliance-program-live
deliverable:
  artifact: A documented KYC/AML compliance program covering identity, screening, monitoring, the travel rule, and named ownership, written to the company brain.
  sections:
    - Regulatory perimeter and obligations per activity
    - KYC/CIP identity and verification policy by tier
    - Sanctions and PEP screening procedure
    - Transaction-monitoring rules and SAR path
    - Travel-rule handling
    - Named compliance owner and governance cadence
  max_words: 1500
rubric: Passes only when no customer value can move before identity verification, sanctions screening, and transaction monitoring are live, screening is continuous rather than one-time, and a named human owns and signs off on the program.
---
# KYC/AML Program

For a crypto business, the compliance program is not paperwork bolted on after launch.
It is the precondition for legally touching customer value at all. Onboarding a user,
accepting a deposit, or routing a transfer without identity verification, sanctions
screening, and transaction monitoring exposes the company to enforcement, frozen rails,
and personal liability for its officers. Build the program first, then let money move.

## Procedure

1. Scope the regulatory perimeter. Determine which activities the business performs
   (custody, exchange, transfer, on/off-ramp) and which trigger money-services or
   VASP obligations in each jurisdiction it serves. Document the obligations that
   attach to each activity so nothing is in scope by accident.
2. Stand up Customer Identity (KYC/CIP). Define identity collection and verification
   by customer tier and risk, including document verification, liveness, and beneficial
   ownership for entity accounts. Set the evidence retained and the retention period.
3. Wire sanctions and PEP screening. Screen every customer at onboarding and on an
   ongoing basis against OFAC and the relevant sanctions and politically-exposed-person
   lists, with a documented match-handling and escalation path. No account transacts
   before it clears screening.
4. Implement transaction monitoring. Define the risk rules and thresholds that flag
   structuring, rapid pass-through, mixer or high-risk-counterparty exposure, and
   anomalous volume, with case management and a Suspicious Activity Report path.
5. Implement the Travel Rule. For transfers at or above the applicable threshold,
   transmit and receive the required originator and beneficiary information with
   counterparty VASPs through a compliant messaging path, and handle unhosted-wallet
   transfers per policy.
6. Name accountable owners and governance. Designate the compliance officer, set the
   risk assessment cadence, the independent review, and the records and reporting
   obligations. The program is only real if a named human owns it.

## Output

`compliance_program` in the company brain: the documented KYC/CIP policy, sanctions and
PEP screening procedure, transaction-monitoring rules, travel-rule handling, and the
named compliance owner and governance cadence. This artifact gates onboarding, deposits,
and transfers, and it feeds the licensing and token-classification strategy.

## Rules

- No customer value moves before identity verification, sanctions screening, and
  monitoring are live. This is a hard gate, not a launch-week task.
- Screening is continuous, not one-time. Sanctions lists change; rescreen the book.
- A named human owns the program and signs off. Compliance with no accountable owner
  is not compliance.

This is a founder-gated, hard-to-reverse program. Revisit whenever the business enters a
new jurisdiction, adds a regulated activity, or a sanctions or travel-rule obligation
changes. Deepen this same program rather than standing up a parallel one.

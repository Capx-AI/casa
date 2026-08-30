---
id: discovery-call-framework
title: Discovery Call Framework
level: 5
summary: Run a diagnostic discovery call that qualifies the deal and uncovers quantified pain, scored and logged.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - hardware
    - b2b-service
  requires_traits:
    - b2b
  excluded_traits:
    - b2c
    - self_serve_only
relevance: core
department: Sales
criticality: core
model_fit: [sales_led]
selection_hint: The first substantive sales conversation in a B2B sales-led motion. Fires when a prospect accepts a meeting. Skip for pure B2C or self-serve with no human sales call.
action: "Pick a qualification framework, run SPIN questions on your next prospect, and log a scored next step within 60 minutes."
depends_on:
  - icp-target-account-listing
soft_after:
  - outbound-email-sequences
produces:
  - discovery_notes
  - qualification_score
consumes:
  - icp
  - booked_meetings
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: first-pipeline
---
# Discovery Call Framework

A discovery call is diagnostic, not prescriptive. Prescription before diagnosis is
malpractice. It is not a demo, a pitch, or a pricing talk: spend the call on the
prospect's world, not the product. Selling teams that lead with slides win less.

## Procedure

1. Pre-call research: pull prospect name, company, title, source, and any prior
   interaction history. Form a pain hypothesis.
2. Select the framework by deal shape: BANT for transactional SMB; SPIN as the
   question backbone; MEDDIC/MEDDPICC for enterprise; SPICED for recurring-revenue
   SaaS. JOLT to counter indecision.
3. Run the call: ask Situation, Problem, Implication, Need-Payoff questions in
   sequence. Quantify business consequences. Listen far more than you talk.
4. Score qualification against the chosen matrix. Decide: advance, or disqualify.
5. Send a follow-up email within 60 minutes; book the next step or formally
   disqualify. Log structured notes to the CRM.

## Output

`discovery_notes` (structured CRM notes plus quote/pain capture) and a
`qualification_score`, written to the company brain. Unblocks demo (086), contract
(088), and is the input to objection handling (087).

## Rules

- B2B only. Call fails if it ends with no logged score AND no confirmed next step.
- Escalate to a human only where flagged [HUMAN ESCALATION REQUIRED].
- Recurring: per-prospect, ongoing while a sales motion exists.

Enterprise variant (L7): MEDDPICC, multi-stakeholder. Full source at the `source` path.

---
id: contract-close-playbook
title: Contract & Close
level: 5
summary: Navigate procurement, security, and legal redlines to a signed contract, with the founder approving the binding agreement.
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
criticality: existential
model_fit: [sales_led]
selection_hint: The commercial/legal close for a B2B deal, triggered by a verbal yes. Skip for pure B2C or self-serve checkout. The binding contract is a human gate.
action: "Map the economic buyer and paper process, then co-create a mutual action plan with milestones and a target go-live date."
depends_on:
  - discovery-call-framework
  - demo-script
soft_after:
  - objection-handling-library
produces:
  - signed_contract
  - paying_customer
consumes:
  - discovery_notes
  - demo_delivered
  - qualification_score
effort: L
leverage: critical
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: true
typical_milestone: first-revenue
deliverable:
  artifact: A deal-close record with a mutual action plan and the signed contract terms, written to the company brain.
  sections:
    - Economic buyer and decision/paper process mapped
    - Mutual action plan with milestones and owners
    - Procurement, security, and legal redline status
    - Concessions traded with their return
    - Founder-approved binding agreement and signature
  max_words: 1000
rubric: Passes only when the economic buyer and paper process are mapped, procurement, security, and legal run in parallel rather than single-threaded, every concession is traded for a return rather than conceded, and the binding agreement is explicitly approved by the founder before signature.
---
# Contract & Close

Closing a B2B deal is a multi-threaded, parallel process across legal, security,
procurement, and the business sponsor, not a single event. The agent prepares,
sequences, and negotiates; the founder approves the binding contract.

## Procedure

1. Confirm the Economic Buyer is engaged and the Decision Process and Paper Process
   are mapped (who signs, who reviews) before procurement enters.
2. Co-create a Mutual Action Plan: target go-live date, milestones (technical
   validation, security review, legal redlines, signature), owners on both sides,
   status.
3. Create urgency without discounting: quantify the cost of inaction, work backward
   from go-live, leverage executive alignment.
4. Run procurement, security review, and legal redlines in parallel. Never
   single-thread. Trade, never concede: no discount without a return (multi-year,
   faster terms, case-study rights).
5. Route the final binding agreement (MSA/DPA/SLA, pricing, order form) to the
   founder for explicit approval before signature. Then hand off to support (089).

## Output

`signed_contract` and a `paying_customer`, written to the company brain. Unblocks
support workflow (089) and churn diagnosis (090).

## Rules

- B2B only. Human gate: a binding contract and any pricing concession require
  explicit founder approval (per always-on HITL gates). Irreversible.
- Do not reveal internal deadlines to procurement.
- Recurring: per-deal, ongoing while a sales motion exists.

Enterprise variant (L7): MSA/DPA/SLA negotiation with SOC 2 and a Trust Center;
7-stage cycle, 8-12 week procurement; do not duplicate. Full source at the `source`
path.

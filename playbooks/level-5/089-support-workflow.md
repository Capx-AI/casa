---
id: support-workflow
title: Support Workflow
level: 5
summary: Run end-to-end support, intake, triage, deflection, resolution, escalation, while compounding a knowledge base.
applies_to:
  types:
    - "*"
  requires_traits:
    - has_paying_customers
  excluded_traits:
    - pre_launch_only
relevance: core
department: Success
criticality: core
existential_at: [revenue]
selection_hint: Install the moment the first paying customer exists. Applies to any business with customers, B2B or B2C. Operate continuously, not a one-time checkbox.
action: "Stand up ticket intake with severity triage and SLA tiers, and draft a knowledge-base article on every resolution."
depends_on: []
soft_after:
  - contract-close-playbook
  - transactional-emails
produces:
  - support_workflow
  - knowledge_base
  - health_score
consumes:
  - paying_customer
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: first-customers
---
# Support Workflow

Support volume is an engineering problem before it is a staffing problem. Run two
tracks at once: resolve today's tickets and eliminate tomorrow's. Every ticket is
both a unit of work and a data point about product friction.

## Procedure

1. Stand up the conversational support funnel: proactive (banners, lifecycle
   notices), self-serve (KB plus chatbot trained on it), and human layers.
2. Intake and triage: classify each ticket by category and severity; route by tier
   against the SLA framework.
3. Resolve, deflecting routine inquiries to self-serve where safe; never deflect
   without resolving.
4. Apply the KCS Solve Loop: on every resolution, link to an existing KB article or
   draft a new one and queue it for review. This is required, not optional.
5. Escalate complex, emotional, policy-exception, or VIP cases to the human layer
   with full context.
6. Maintain a running ticket taxonomy; flag any category exceeding threshold for
   product review. Update each account's health score.

## Output

`support_workflow` (the live system), a compounding `knowledge_base`, and per-account
`health_score`, written to the company brain. Health score feeds churn diagnosis
(090).

## Rules

- Applies to any business with paying customers (B2B and B2C).
- Recurring / always-on: install once customers exist, then operate. Targets ~60-70%
  AI resolution without degrading satisfaction.

Full source (SLA tiers, triage logic, deflection engine, benchmarks) at the `source`
path.

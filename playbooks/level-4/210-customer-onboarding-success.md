---
id: customer-onboarding-success
title: Customer Onboarding and Success Activation
level: 4
summary: >-
  Stand up a success-led onboarding motion that drives new customers to first value fast, distinct
  from the in-product onboarding flow: kickoff, a written success plan, and a tracked
  time-to-first-value milestone.
applies_to:
  types:
    - saas
    - b2b
    - b2b-service
    - marketplace
  requires_traits: []
  excluded_traits:
    - self_serve_only
relevance: recommended
department: Success
criticality: core
selection_hint: >-
  Select when deals close with a human touch and customers need help reaching value, not when
  activation is fully self-serve inside the product.
depends_on:
  - onboarding-flow-design
soft_after:
  - pricing-research
  - icp-target-account-listing
produces:
  - success_onboarding
  - customer_success_plan
  - time_to_first_value_metric
  - kickoff_agenda
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: first_ten_paying_customers
model_fit:
  - recurring
  - sales_led
  - marketplace
deliverable:
  artifact: success_onboarding
  sections:
    - Kickoff Agenda
    - Success Plan Template
    - Time-to-First-Value Definition
    - Milestone Checklist
    - Handoff and Escalation Rules
  max_words: 700
rubric: >-
  Pass if a named owner can run a kickoff, produce a per-customer success plan, and report each
  account's time-to-first-value against a defined milestone within the first two weeks.
---

# Customer Onboarding and Success Activation

## Procedure
1. Define one concrete first-value milestone per customer segment. Write it as an observable event, for example "first live transaction processed" or "first report shared with a teammate." This is the target your whole motion drives toward, separate from product signup or feature tours.
2. Build a kickoff agenda you run within 48 hours of close: confirm the customer's goal in their words, name the success owner on both sides, set the date by which the first-value milestone should land, and surface blockers (data, access, integrations). Keep it to 30 minutes.
3. Draft a one-page success plan template with fields for goal, milestone, owner, target date, required inputs, and risks. Fill one out live during kickoff so the customer leaves with a written plan, not notes.
4. Instrument time-to-first-value: record kickoff date and milestone-reached date per account in a shared sheet or CRM field. Compute days-to-value and review it weekly. Flag any account past its target date for proactive outreach.
5. Write handoff and escalation rules: who owns the account from close to milestone, when to loop in product or sales, and what counts as an at-risk account. Document the trigger and the response for each.

## Output
A repeatable success_onboarding kit (kickoff agenda, success plan template, time-to-first-value metric) that an owner runs on every new customer this week.

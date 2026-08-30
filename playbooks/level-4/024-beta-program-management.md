---
id: beta-program-management
title: Beta Program Management
level: 4
summary: Recruit, manage, and graduate a beta cohort with structured feedback loops and clear advancement criteria.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - ecommerce
    - content
    - crypto
  requires_traits:
    - builds_software
    - has_user_accounts
  excluded_traits: []
relevance: core
department: Product
criticality: core
selection_hint: PMF-validation and relationship-building, not QA. Run once the core workflow is functional and instrumented, ahead of public launch.
depends_on:
  - onboarding-flow-design
soft_after:
  - event-taxonomy-design
produces:
  - beta_cohort
  - activation_evidence
  - testimonials
consumes:
  - onboarding_flow
  - activation_event
effort: L
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: beta-graduated
---
# Beta Program Management

A beta program compresses market learning into weeks and builds a cohort of
advocates. The goal is product-market-fit validation and user relationships, not
bug-finding. The core question: would a specific segment be genuinely disappointed
if the product disappeared?

## Procedure

1. Clear the gates: core workflow functional end-to-end without data loss; the aha
   moment reachable in the first session; analytics instrumented; ICP defined; and
   the beta legal docs (BTA with feedback license, NDA, DPA) reviewed and ready.
2. Recruit and screen a tightly-matched cohort; reframe access as membership to
   raise perceived value.
3. Run weekly feedback loops and iterate; track the activation event and the Sean
   Ellis "very disappointed" signal.
4. Graduate users against explicit advancement criteria; capture testimonials and
   social proof for launch.

## Output

`beta_cohort` (the managed cohort), `activation_evidence` (the PMF signal and
metrics), and `testimonials`, written to the company brain. Feeds launch and the
release motion.

## Rules

- A beta is not QA. Bug reports are a byproduct; PMF validation is the goal.
- The beta legal docs require human legal review and founder approval before any
  recruitment begins.

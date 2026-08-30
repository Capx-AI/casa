---
id: hosting-deployment-setup
title: Hosting & Deployment Setup
level: 2
summary: Pick and configure hosting plus a CI/CD pipeline and secrets management for the chosen stack.
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
  excluded_traits: []
relevance: core
department: Engineering
criticality: core
selection_hint: Stands up the deploy foundation once the stack is chosen. Everything observability, security, backup, and release depends on this landing.
depends_on:
  - tech-stack-selection
soft_after:
  - domain-acquisition
produces:
  - hosting
  - cicd
consumes:
  - tech_stack
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: hosting-live
deliverable:
  artifact: A hosting and deployment record with the live URL, the CI/CD pipeline, and secrets management, written to the company brain.
  sections:
    - Hosting choice justified against the decision tree
    - Provisioned compute and managed database with automated backups
    - CI/CD pipeline definition
    - Secrets manager with no hardcoded secrets
    - Health checks and logging
  max_words: 800
rubric: Passes only when the hosting choice is justified against traffic, budget, and cost-predictability as a first-class criterion, the CI/CD pipeline runs lint, test, build, and deploy with no secret hardcoded in the repo or pipeline, and any ongoing-spend provisioning is escalated to the founder.
---
# Hosting & Deployment Setup

Choose a hosting target and stand up a production-grade deploy pipeline. The aim is
a foundation for rapid iteration, high availability, and predictable cost. Watch
for surprise serverless bills; weigh developer experience against TCO at scale.

## Procedure

1. Evaluate inputs (framework, database needs, expected traffic, budget) against
   the decision tree: Vercel/Cloudflare for static or Jamstack, Railway/Fly for
   stateful containers, AWS/GCP for strict compliance and multi-region, self-host
   for absolute cost minimization with DevOps expertise on hand.
2. Provision compute and a managed database with automated backups configured.
3. Configure CI/CD (lint, test, build, multi-stage image, push, rollout) and a
   secrets manager so no secret is hardcoded in the repo or pipeline.
4. Add health checks and platform-native logging so traffic only routes to healthy
   instances.

## Output

`hosting` (live URL plus infra config) and `cicd` (the pipeline definition),
written to the company brain. Unblocks observability (027), security baseline
(029), data backup (030), and release cadence (025).

## Rules

- Cost-predictability is a first-class selection criterion, not an afterthought.
- Provisioning that incurs ongoing spend escalates to the founder per the HITL
  gates before commitment.

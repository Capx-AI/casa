---
id: release-changelog-cadence
title: Release & Changelog Cadence
level: 3
summary: Establish a shipping rhythm and a customer-facing release communications format.
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
relevance: recommended
department: Engineering
criticality: growth
selection_hint: Decouples deploy from release and turns the changelog into a marketing, retention, and recruiting asset. Stands up once CI/CD exists; then operates continuously.
depends_on:
  - hosting-deployment-setup
soft_after:
  - feature-prioritization
produces:
  - release_cadence
  - changelog
consumes:
  - cicd
effort: S
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: release-rhythm-set
---
# Release & Changelog Cadence

Deploys and releases are different acts. Deployment is a frequent, boring technical
act behind a feature flag; release is a deliberate business act tied to
communication. The changelog is a brand asset that proves execution, not a commit
dump. An uncommunicated feature does not exist and breeds silent churn.

## Cadence

Publish a changelog entry within 24 hours of 100 percent rollout. This playbook
installs once, then operates continuously per release.

## Procedure

1. Establish the shipping rhythm: small batches merged to main behind flags;
   release by flipping the flag deliberately.
2. On each user-facing release, draft the changelog with editorial rigor (the
   builder writes the first draft) and prepare the release email, in-app
   announcement, social posts, and any API version bump.
3. Run a support-readiness check before flipping the flag.
4. Publish, then track adoption (target at or above 30 percent within 14 days).

## Output

`release_cadence` (the documented rhythm and comms format) and `changelog` (the
ongoing public record), maintained in the company brain.

## Rules

- Communicate releases, never deploys. Non-user-facing merges get no changelog
  entry unless they materially change performance or reliability.
- Zero unannounced breaking changes.

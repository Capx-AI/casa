---
id: security-baseline
title: Security Baseline
level: 2
summary: "Minimum viable security: auth, secrets, rate limits, input validation, SOC2-ready hygiene."
applies_to:
  types:
    - "*"
  requires_traits:
    - builds_software
    - has_repo
  excluded_traits:
    - pre_idea_only
relevance: core
department: Engineering
criticality: core
selection_hint: Stand up day one alongside hosting. Prevents the cheap, predictable breaches (stolen credentials dominate) and avoids expensive SOC 2 retrofits.
action: "Select the auth architecture, move every secret into a manager with rotation and no human access, and rate-limit public endpoints."
depends_on: []
soft_after:
  - hosting-deployment-setup
produces:
  - security_baseline
  - secrets_policy
  - auth_architecture
consumes: []
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: security-baseline-set
deliverable:
  artifact: A security baseline documenting auth, secrets, abuse prevention, and agent-tool controls, written to the company brain.
  sections:
    - Auth architecture chosen by decision tree
    - Secrets classified with storage, rotation, and access scope
    - Rate limiting and abuse prevention on public endpoints
    - Input validation and output encoding at boundaries
    - Agent tool scopes and prompt-injection guards
    - SOC 2-ready evidence
  max_words: 1000
rubric: Passes only when secret hygiene is treated as the top control with no human access to production Tier 0/1 secrets and immediate rotation on compromise, public endpoints are rate-limited and validate input, and agent tools are scoped to least privilege.
---
# Security Baseline

Establish the minimum viable security posture from day zero across six domains:
authentication and identity, secrets management, rate limiting and abuse
prevention, input validation and output encoding, SOC 2-ready hygiene, and the
security of the AI agents themselves (tool scopes, memory, prompt injection).

## Procedure

1. Collect inputs: repo URL, cloud provider, identity provider, database, secrets
   manager, compliance target, data classification, and the agent tool inventory.
   Pause and request any that are missing.
2. Select auth architecture by decision tree (B2B SSO + phishing-resistant MFA;
   consumer social/passkey + login rate limits; minimal email/OTP otherwise).
3. Classify every secret (Tier 0 critical to Tier 2 medium) and apply matching
   storage, rotation period, and access scope. No human access to production
   Tier 0/1 secrets.
4. Add rate limits and abuse prevention on public endpoints; validate input and
   encode output everywhere user data crosses a boundary.
5. Scope agent tool permissions to least privilege; guard against prompt injection
   and unsafe memory handling.
6. Capture SOC 2-ready evidence (access logs, change control) so an audit is not a
   retrofit.

## Output

`security_baseline`, `secrets_policy`, and `auth_architecture` documented in the
company brain. Enhances incident-response (028) coverage for security events.

## Rules

- Credentials are the most-stolen data type. Treat secret hygiene as the top
  control, not an afterthought.
- Rotate immediately on any suspected compromise or personnel change; a secret in
  a public repo is a P0.
- This is a baseline, not a pen test. Physical security and APTs are out of scope.

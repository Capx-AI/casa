---
id: usability-testing-protocol
title: Usability Testing Protocol
level: 3
summary: Run lean five-user moderated tests on a continuous cadence to find where the design fails users.
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
department: Product
criticality: growth
selection_hint: Behavioral testing of whether users can accomplish goals. Run on a stable prototype or staging build, repeatedly through build. Not for attitudinal questions.
depends_on: []
soft_after:
  - onboarding-flow-design
produces:
  - usability_findings
consumes:
  - onboarding_flow
effort: S
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: usability-validated
---
# Usability Testing Protocol

Observe real users attempt realistic tasks to find where the design fails them, not
where they fail the design. This is the Nielsen discount test: five users, one day,
run small and frequent on a weekly or bi-weekly cadence during active development.

## Cadence

Repeat weekly or bi-weekly during build. Small, frequent, iterative tests beat one
large study. This playbook operates continuously.

## Procedure

1. Confirm the artifact is stable enough to test and that the question is
   behavioral ("can users do this?"), not attitudinal ("do users like this?").
2. Define research questions, recruit and screen five matching participants, and
   write task scenarios plus a moderation script.
3. Run a pilot, then conduct the sessions, observing behavior without leading.
4. Synthesize into severity-ranked findings with specific design recommendations.

## Output

`usability_findings` (severity-ranked problems plus recommended fixes), written to
the company brain. Feeds feature prioritization and the build loop.

## Rules

- Fixing a usability problem costs far more after launch than during design. Test
  early and often.
- For attitudinal questions, use an interview playbook instead.

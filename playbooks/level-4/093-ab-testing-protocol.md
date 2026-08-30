---
id: ab-testing-protocol
title: A/B Testing Protocol
level: 4
summary: Run statistically valid controlled experiments before rolling out product, copy, pricing, or UX changes.
applies_to:
  types:
    - "*"
  requires_traits:
    - has_live_traffic
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Data
criticality: growth
selection_hint: Activate once a surface has live traffic (about 100+ users/day). Below that, use qualitative learning instead, not A/B tests.
action: "Pick one conversion surface, write the hypothesis and MDE, compute the sample size, and launch one test to completion."
depends_on: []
soft_after:
  - analytics-stack-setup
  - event-taxonomy-design
produces:
  - ab_test_protocol
  - experiment_results
consumes:
  - analytics_stack
  - event_taxonomy
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: launch-executed
---
# A/B Testing Protocol

Roughly one in three product ideas actually improves the metric it targets. Without
controlled experiments you ship harm at the same velocity as wins and cannot tell
them apart. This playbook makes that difference legible with explicit statistics.

## Procedure

1. Trigger check. Fire only for changes to conversion-critical surfaces, features
   rolling to more than 5 percent of users, pricing or creative variants. Skip pure
   bug fixes, security patches, and surfaces under 100 users/day.
2. Define the hypothesis. State H0 (no effect), the single primary metric, and the
   minimum detectable effect (MDE).
3. Compute sample size before launching. Use the two-proportion z-test at alpha 0.05
   and 80 percent power. Record required n per variant and the resulting run time.
4. Run to completion. Do not peek and stop early; fix the horizon up front. Hold
   guardrail metrics (revenue, latency, error rate) alongside the primary metric.
5. Read the result. Apply a Twyman's Law sanity check on any surprising win. Treat
   roughly 13 percent of nominal wins as false positives; replicate high-stakes ones.
6. Decide rollout. Ship, iterate, or kill, and log the decision to the brain.

## Output

`ab_test_protocol` (the standing experiment method) and per-test `experiment_results`,
written to the company brain.

## Rules

- Never stop a test before it reaches the precomputed sample size.
- One primary metric per test. Guardrails can veto a primary-metric win.
- Below 100 users/day, switch to qualitative learning, not underpowered tests.

Cadence: runs continuously once live; each surface change re-enters at step 1. The
deeper statistical method, sample-size code, and case data are in the source draft.

---
id: churn-diagnosis-winback
title: Churn Diagnosis & Win-back
level: 5
summary: Detect at-risk and churned customers, root-cause each by type, recover involuntary churn, and run targeted win-back.
applies_to:
  types:
    - "*"
  requires_traits:
    - has_paying_customers
    - recurring_revenue
  excluded_traits:
    - pre_launch_only
relevance: core
department: Success
criticality: core
existential_at: [revenue, scaling]
model_fit: [recurring]
selection_hint: Install once there is recurring revenue and billing webhooks. Highest-ROI lever is recovering involuntary (failed-payment) churn. Operate continuously.
action: "Pull the last 90 days of churn, split voluntary from involuntary, and recover every failed-payment account first."
depends_on:
  - contract-close-playbook
  - support-workflow
soft_after:
  - win-back-campaign
produces:
  - churn_diagnosis
  - winback_campaigns
consumes:
  - paying_customer
  - health_score
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: retention
deliverable:
  artifact: A churn diagnosis with per-account root cause and tailored win-back campaigns, written to the company brain.
  sections:
    - Churn classified on the avoidable/unavoidable by expected/unexpected matrix
    - Voluntary versus involuntary split
    - Involuntary recovery via dunning, card-updater, and retry
    - Voluntary churn branched by lifecycle timing
    - Win-back tailored to reason and timing
  max_words: 900
rubric: Passes only when every churn event is traced to a root cause before any intervention, involuntary failed-payment churn is recovered as the highest-ROI lever, and win-backs are tailored to the churn reason and timing rather than reusing one template across all churn.
---
# Churn Diagnosis & Win-back

Churn is a symptom, not a metric. Customers leave for two reasons: something
external happened, or they never achieved their Desired Outcome. Trace every churn
event to a root cause before designing an intervention; generic win-backs waste
budget.

## Procedure

1. Classify each churn on the avoidable/unavoidable by expected/unexpected matrix.
   Drive churn into "expected" via monitoring; eliminate the "avoidable" row via
   proactive intervention.
2. Split voluntary from involuntary. Involuntary (failed payment) is 20-40% of all
   churn and only ~5% self-recover; recover it with dunning, card-updater, and
   retry logic (the highest-ROI retention activity).
3. For voluntary churn, branch by lifecycle timing: early (0-90d, onboarding/fit
   failure), mid (3-12mo, competitor/feature-gap/champion-loss), late (renewal,
   ROI-justification failure).
4. On health-score drops (yellow/red) or usage drop-off, run early or critical
   intervention before cancellation.
5. Run win-back tailored to the churn reason and timing; never reuse one template
   across all churn.

## Output

`churn_diagnosis` (per-account root cause and quadrant) and `winback_campaigns`,
written to the company brain.

## Rules

- Applies to any recurring-revenue business (B2B and B2C).
- Always re-run a retrospective on every "unexpected and avoidable" churn.
- Recurring / always-on: trigger-driven by billing webhooks, health score, and
  usage signals.

Mature variant (L8): Churn Operations in NRR mode with a predictive model; do not
duplicate. Full source at the `source` path.

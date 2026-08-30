---
id: unit-economics
title: Unit Economics
level: 5
summary: Compute and operate against cohort-level CAC, LTV, payback, contribution margin, and gross margin.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits:
    - pre_idea_only
relevance: core
department: Finance
criticality: core
existential_at: [revenue, scaling]
selection_hint: Baseline at L5 once customer-level billing and channel spend exist. The single answer to "do we make money on one customer?" Feeds the model and the raise.
action: "Compute fully-loaded paid-only CAC and realized LTV for your top acquisition channel, then flag any payback over target."
depends_on: []
soft_after:
  - analytics-stack-setup
  - cohort-retention-analysis
produces:
  - unit_economics
consumes:
  - analytics_stack
effort: M
leverage: critical
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: pmf-confirmed
deliverable:
  artifact: A unit-economics model with cohort CAC, gross margin, realized LTV, contribution margin, and payback by channel, written to the company brain.
  sections:
    - Fully-loaded, paid-only, time-lagged CAC
    - Gross margin with honest COGS
    - Realized cohort LTV over a capped horizon
    - Contribution margin
    - Payback and LTV-to-CAC by cohort and channel
  max_words: 900
rubric: Passes only when CAC is paid-only, fully loaded, and time-lagged (never blended) for scaling decisions, LTV is realized over a capped horizon rather than an infinite-horizon projection, and every number is segmented by cohort and channel rather than blended into an average that hides failing channels.
---
# Unit Economics

Unit economics answers one existential question: when the business sells one unit to
one customer, does it actually make money? If no, scaling accelerates the demise. The
discipline is defending against blended, vanity, and infinite-horizon fallacies.

## Procedure

1. Compute fully-loaded, paid-only, time-lagged CAC. Include media, S&M headcount,
   tooling, agency fees, and onboarding. Lag spend by the sales-cycle length. Never
   use blended CAC for paid-scaling decisions.
2. Compute gross margin with honest COGS (hosting, support, third-party licenses,
   payment fees, and LLM or inference cost for AI-native products).
3. Compute realized LTV by cohort over a fixed horizon (LTV_n): cumulative cash from
   a cohort over n months. Cap n at 36 (enterprise), 24 (SMB), 12 (B2C). Do not use
   the infinite-horizon formula, which breaks under net-negative churn.
4. Compute contribution margin (revenue minus all variable cost) as the ceiling on
   allowable CAC.
5. Compute payback period and the LTV-to-CAC ratio by cohort and acquisition channel.
6. Operate against the numbers: throttle channels whose payback exceeds target; scale
   channels with proven cohort payback.

## Output

`unit_economics`: cohort CAC, gross margin, realized LTV, contribution margin, and
payback by channel, written to the company brain. Feeds 096 and 098.

## Rules

- Paid-only, fully-loaded, time-lagged CAC for any scaling decision. No blended CAC.
- Realized cohort LTV over a capped horizon; never an infinite-horizon projection.
- Segment by cohort and channel; blended averages hide failing channels.

Cadence: recurring monthly read at L5. The L8 mature variant is diligence-ready:
time-lagged cohort truth, audited COGS, and reconciliation to the financial model
(do not duplicate; deepen this same playbook for the raise). See the source draft for
formulas and the full failure-mode taxonomy.

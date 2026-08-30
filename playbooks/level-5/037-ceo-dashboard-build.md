---
id: ceo-dashboard-build
title: CEO Dashboard Build
level: 5
summary: "One screen for business health: finance, growth, product, ops, CS, each owned and alertable."
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Data
criticality: core
selection_hint: Build once the NSM is defined and data sources are connected. Gives the founder one health screen that alerts on exception rather than being checked.
depends_on:
  - analytics-stack-setup
  - north-star-metric
soft_after:
  - cohort-retention-analysis
produces:
  - ceo_dashboard
  - alert_thresholds
consumes:
  - analytics_stack
  - north_star_metric
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: ceo-dashboard-live
---
# CEO Dashboard Build

Build a single dashboard that filters signal from noise for the founder: finance
(cash, burn, runway, CAC/LTV), growth (NSM, channel mix), product (activation,
retention), ops (incidents, SLA), and customer success (NRR, churn, NPS). Every
metric has an owner, a definition, and an alert.

## Procedure

1. Select metrics by the 3x5 rule: three core charts (funnel, cohorts, product
   usage) plus five headline numbers (pipeline coverage, NRR, new ARR, burn
   multiple, cash runway). Exclude vanity metrics.
2. Define each metric precisely with its benchmark (NRR >100%, burn multiple <1.0x,
   runway 18mo+, LTV:CAC 3:1 min) and name an owner.
3. Wire the data stack: sources (Stripe, CRM, product analytics, support) into the
   warehouse, transform, and visualize.
4. Set red thresholds and automated actions per metric (runway <12mo freezes
   non-essential hiring; NRR <100% triggers CS outreach) on an exception basis.
5. Establish the operating cadence: weekly headline review, monthly roadmap and
   budget, quarterly OKRs and cohort review.

## Output

`ceo_dashboard` and `alert_thresholds` in the company brain. The dashboard alerts
the founder; the founder does not poll it. Feeds the Weekly Business Review (040).

## Rules

- Actionability over vanity: every metric needs an owner and a predefined action
  on breach.
- Balance leading indicators (activation, pipeline coverage) against lagging
  outcomes (revenue, NRR).
- Automated actions that commit spend or freeze hiring escalate to the founder per
  the human-in-the-loop gates.

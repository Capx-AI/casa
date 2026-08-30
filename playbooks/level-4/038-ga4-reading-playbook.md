---
id: ga4-reading-playbook
title: GA4 Reading Playbook
level: 4
summary: Weekly and on-alert protocol to read GA4, catch data-quality issues, and triage anomalies.
applies_to:
  types:
    - "*"
  requires_traits:
    - uses_ga4
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Data
criticality: growth
selection_hint: Run once GA4 (ideally with a BigQuery export) is live and there is traffic to read, typically from launch. Skip products that do not use GA4.
action: "Reconcile GA4 revenue against Stripe and stand up a weekly Monday read that triages each finding to a decision."
depends_on:
  - analytics-stack-setup
soft_after:
  - event-taxonomy-design
produces:
  - ga4_read
  - tracking_health_report
consumes:
  - analytics_stack
effort: S
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: ga4-read-operating
---
# GA4 Reading Playbook

RECURRING. A repeatable weekly and on-alert protocol for reading GA4 reports,
spotting data-quality issues, detecting anomalies, and triaging each into a
decision, an investigation, or a no-op. GA4 is event-based; query parameters, not
just event names, and know which reporting identity is active.

## Procedure

1. Data-quality and tracking-health check first (garbage in, garbage out). Verify
   revenue/conversions against source of truth (Stripe, CRM): >5% discrepancy is a
   warning, >10% halts analysis and fires a Tracking Break alert. Investigate
   `(not set)`/`Unassigned` (>5%), Direct-traffic spikes (>20% WoW), consent-mode
   modeled vs observed, and high-cardinality `(other)` rows (>10%).
2. Acquisition analysis: separate user acquisition (first source/medium) from
   traffic acquisition (session source/medium); compare against baseline.
3. Engagement, conversion, and monetization reads against predefined benchmarks.
4. Triage every finding: decision, investigation, or no-op. Log it.

## Output

`ga4_read` (the weekly findings + triage) and a `tracking_health_report`, written
to the company brain. Cadence: weekly (e.g. Monday 09:00) plus on every anomaly
alert. Feeds the Weekly Business Review (040).

## Rules

- Verify data integrity before drawing any conclusion. If thresholding hides data,
  switch reporting identity to Device-based; if sampling appears, use the BigQuery
  export.
- For authenticated B2B products, prioritize the `user_id` dimension for
  cross-device journeys.

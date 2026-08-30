---
id: nps-csat-program
title: NPS / CSAT Program
level: 5
summary: Operate a feedback engine (NPS, CSAT, CES) with closed-loop detractor rescue and promoter activation.
applies_to:
  types:
    - "*"
  requires_traits:
    - has_paying_customers
  excluded_traits:
    - pre_launch_only
relevance: recommended
department: Success
criticality: growth
model_fit: [recurring]
selection_hint: Install once there are active customers and a survey channel. Applies to any business, B2B or B2C. Operate on a fixed cadence; promoters feed the case-study pipeline.
action: "Launch the two-question NPS survey to active customers and contact every detractor within 48 hours to rescue them."
depends_on: []
soft_after:
  - support-workflow
produces:
  - nps
  - csat
consumes:
  - paying_customer
effort: M
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: retention
---
# NPS / CSAT Program

Turn feedback from a static metric into a growth lever. Relational NPS measures
long-term loyalty; transactional CSAT/CES measures a specific interaction. Close the
loop on every response: rescue detractors, activate promoters.

## Procedure

1. Stand up two survey types. Relational NPS on a time cadence (every 90-180 days
   for active users; annually for low-engagement); transactional CSAT/CES on events
   (24h after ticket close, after purchase).
2. Enforce sampling discipline: never survey the same user more than once per 90
   days; aim for statistical validity (roughly 300-400 responses for a 95%
   interval).
3. Use the frictionless two-question format: the 0-10 rating plus a segment-specific
   "why". For pre-PMF startups, run the Sean Ellis 40% "very disappointed" test
   instead.
4. Inner Loop: contact detractors within 24-48h with a personalized rescue; convert
   to passive or promoter. Route promoters to the case-study pipeline (092).
5. Outer Loop: feed themed feedback into the product roadmap for systemic fixes.

## Output

`nps` (relational score plus verbatims) and `csat`/CES (transactional), written to
the company brain. Promoter signal feeds case-study pipeline (092).

## Rules

- Applies to any business with active customers (B2B and B2C).
- Suppress over-surveying; treat score moves below the margin of error as noise.
- Recurring / always-on: cadence-based and event-based; operate, do not check off.

Full source (EGR, statistical validity, inner/outer loop, variations) at the
`source` path.

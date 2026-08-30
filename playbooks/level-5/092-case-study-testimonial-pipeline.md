---
id: case-study-testimonial-pipeline
title: Case Study & Testimonial Pipeline
level: 5
summary: Continuously turn happy customers into modular, multi-format case studies and testimonials, with customer consent before any publish.
applies_to:
  types:
    - "*"
  requires_traits:
    - has_paying_customers
  excluded_traits:
    - pre_launch_only
relevance: recommended
department: Growth
criticality: growth
selection_hint: Install once customers have measurable outcomes and an NPS signal exists. Applies to any business, B2B or B2C. Publishing a customer's story requires their consent.
depends_on:
  - nps-csat-program
soft_after: []
produces:
  - case_study
  - testimonials
  - customer_evidence
consumes:
  - nps
  - csat
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: proof-and-evidence
---
# Case Study & Testimonial Pipeline

Customer evidence is revenue-critical infrastructure: peer proof is the most trusted
B2B content and buyers do most research before talking to sales. Replace the
human-bottlenecked process with a continuous pipeline that produces and distributes
evidence in under 14 days.

## Procedure

1. Monitor triggers continuously: NPS promoter (>=9), high CSAT, positive review,
   renewal, expansion (ARR up >=20%), or a product milestone hit. Queue the
   customer.
2. Reach out, secure participation, and capture the story. Mine Voice-of-Customer
   verbatim language from interviews, reviews, and tickets.
3. Structure every asset on the Tension-Resolution arc: specific before-state pain,
   then the quantified outcome. Open with the tension, not a company boilerplate.
4. Produce modular formats from one engagement: quote, statistic, ROI narrative,
   reference-call profile, so each funnel stage gets the right proof.
5. Obtain explicit customer consent (and any legal/brand review) before publishing
   or quoting externally. Then distribute into every relevant channel and the sales
   enablement library.

## Output

`case_study` and `testimonials` (the modular assets) plus a `customer_evidence`
library, written to the company brain. Feeds the fundraise deck (098).

## Rules

- Applies to any business with customers that have outcomes (B2B and B2C).
- Human gate: never publish a customer's name, quote, logo, or story without
  documented consent and legal/brand sign-off (per always-on HITL gates).
- Recurring / always-on: monitor triggers continuously, do not check off.

Full source (Klettke-Wiebe synthesis, trigger table, asset templates, distribution)
at the `source` path.

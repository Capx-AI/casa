---
id: renewal-and-retention-playbook
title: Renewal and Retention Playbook
level: 6
summary: >-
  A health-score-driven renewal motion: scored accounts, a dated renewal timeline, and save plays
  that trigger before churn becomes inevitable.
applies_to:
  types:
    - saas
    - b2b
    - b2b-service
    - marketplace
  requires_traits:
    - recurring_revenue
  excluded_traits:
    - one_time_purchase
relevance: core
department: Success
criticality: core
selection_hint: >-
  Run once recurring revenue exists and the first cohort of contracts is approaching renewal. Skip
  for one-time transactional models.
depends_on:
  - pricing-research
soft_after: []
produces:
  - renewal_motion
  - account_health_score
  - at_risk_save_plays
  - renewal_timeline
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: First renewal cohort approaching contract end
existential_at:
  - revenue
  - scaling
model_fit:
  - recurring
  - sales_led
deliverable:
  artifact: renewal_motion
  sections:
    - Health Score Definition
    - Renewal Timeline
    - At-Risk Save Plays
    - Owner and Cadence
  max_words: 600
rubric: >-
  Passes if every active account carries a current health score and a dated renewal owner, and at
  least three triggered save plays are documented with entry criteria.
---

# Renewal and Retention Playbook

## Procedure
1. Define a health score from three to five observable signals: product usage trend over the last 30 days, breadth of seats or features active, support sentiment, and payment or invoice status. Weight them and bucket each account into green, yellow, or red. Score every active account in a single sheet this week.
2. Build the renewal timeline backward from each contract end date. Set fixed touchpoints at T-minus-90 (account review and expansion scan), T-minus-60 (renewal proposal and pricing confirmation), and T-minus-30 (commitment and paperwork). Assign one named owner per renewal.
3. Write three to five save plays, each with a clear entry trigger. Examples: usage drop over 40 percent triggers a re-onboarding call; a detractor support ticket triggers an executive check-in; a red score at T-minus-60 triggers a discount-or-downgrade alternative to outright loss.
4. Run a manual at-risk review every Monday. Pull all red and yellow accounts, confirm the right save play is firing, and log the next action and date. Escalate any red account inside 30 days of renewal to a founder.
5. After the first renewal cohort closes, record gross and net retention, win-back rate, and which save plays actually moved accounts back to green. Cut plays that did nothing.

## Output
A live renewal_motion: scored accounts, dated timeline with owners, and triggered save plays reviewed weekly.

---
id: outbound-email-sequences
title: Outbound Email Sequences
level: 5
summary: Run signal-based, deliverability-safe cold outbound that books qualified discovery calls.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - hardware
    - b2b-service
  requires_traits:
    - b2b
  excluded_traits:
    - b2c
    - self_serve_only
relevance: core
department: Sales
criticality: core
model_fit: [sales_led]
selection_hint: The outbound engine for a B2B sales-led motion. Needs warmed sending domains (082) and a target account list (083). Skip for pure B2C or self-serve.
depends_on:
  - email-deliverability-setup
  - icp-target-account-listing
soft_after: []
produces:
  - outbound_sequences
  - booked_meetings
consumes:
  - email_deliverability
  - icp
  - target_account_list
effort: L
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: first-pipeline
---
# Outbound Email Sequences

Outbound in 2026 is a precision instrument, not a firehose. Never send without a
verifiable, data-backed reason to contact that person on that day. The AI advantage
is better emails to better targets at scale, not more emails.

## Procedure

1. Stand up the anti-burn domain architecture: never send from the primary domain;
   maintain a pool of 5-10 secondary sending domains (301-redirecting to primary),
   2-3 inboxes each. Configure SPF, DKIM, DMARC on every sending domain.
2. Enforce the signal requirement: for each account in the TAL, find a qualifying
   buying signal (funding, hiring, leadership change, technographic shift, intent).
   No signal means the prospect moves to a nurture pool, not the send list.
3. Generate personalized opening lines from an enrichment waterfall (recent posts,
   press, job postings, tech stack) keyed to the signal.
4. Build the sequence: multi-touch, value-first, short, plain text. One ask.
5. Send within volume and warmup limits; monitor reply, bounce, and spam rates.

## Output

`outbound_sequences` (live campaigns) and `booked_meetings` written to the CRM and
company brain. Booked meetings feed discovery (085).

## Rules

- B2B only. Auto-pause on bounce rate >5% or spam complaint rate >0.3%; alert.
- Targets: reply rate >=5%, positive replies >=20% of replies, bounce <2%.
- Recurring: weekly metric review, monthly sequence audit, quarterly ICP review.

Full source draft (deliverability trifecta, sequence templates, thresholds) at the
`source` path.

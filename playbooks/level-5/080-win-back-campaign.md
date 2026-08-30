---
id: win-back-campaign
title: Win-back Campaign
level: 5
summary: Re-engage dormant users, recover churned subscriptions, and run dunning on payment failures, segmented by churn cause.
applies_to:
  types:
    - "*"
  requires_traits:
    - sends_email
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
selection_hint: Run once you have customers with churn or dormancy events and warmed deliverability. Recovers former customers at 5 to 25x lower cost than new acquisition.
depends_on:
  - welcome-email-sequence
soft_after:
  - transactional-emails
  - churn-diagnosis-winback
produces:
  - winback_campaign
consumes:
  - welcome_sequence
  - email_deliverability
  - churn_diagnosis
effort: M
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: lifecycle-live
---
# Win-back Campaign

A win-back campaign re-engages dormant users, reactivates cancellations, and recovers
lost revenue. Former customers have brand awareness and product familiarity, so they
convert higher (5 to 15%) than cold acquisition for the same spend. But a campaign to
a stale, unsegmented list can blacklist a sending domain in 24 hours, and discount-led
win-backs train customers to churn on purpose.

## Procedure

1. Classify the trigger daily. Voluntary churn (cancel/downgrade), involuntary churn
   (dunning: route soft declines to retry logic, hard declines to update-payment), or
   dormancy (no meaningful engagement past threshold). Each goes to a different branch.
2. Apply exclusions first. Skip opt-outs, deletion requests, recent failed win-backs,
   ToS terminations, unresolved-bug churners, hard-bounced addresses, and below-threshold LTV.
3. Assemble the data profile (identity, usage history, financials, churn reason,
   engagement). Incomplete profiles cause generic messaging and low conversion.
4. Match the message to the churn reason. Never send "we miss you" to a user who filed
   a detailed bug report; lead with the fix, not a discount.
5. Sequence and cap touches; suppress aggressively to protect deliverability.
6. Measure reactivation rate and post-reactivation retention; escalate per defined thresholds.

## Output

`winback_campaign`: live, segmented win-back and dunning workflows with exclusion
logic and reason-matched messaging, recorded in the company brain.

## Rules

- Recurring. Run on a daily-checked schedule; tune continuously.
- Blocked until deliverability is warmed (082) via the welcome sequence (078). A
  misconfigured send to a stale list can blacklist the domain.
- Do not lead with deep discounts; address the actual churn cause. Honor all exclusions.

Full trigger taxonomy, dunning logic, and copy templates in the source draft above.
Condense, do not pad.

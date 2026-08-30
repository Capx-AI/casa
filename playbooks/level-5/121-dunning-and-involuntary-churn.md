---
id: dunning-and-involuntary-churn
title: Dunning & Involuntary Churn Recovery
level: 5
summary: Recover failed recurring payments with decline-aware retries, a card updater, and dunning sequences to cut involuntary churn.
applies_to:
  types:
    - saas
    - consumer
    - ecommerce
    - content
    - marketplace
    - crypto
  requires_traits:
    - recurring_revenue
  excluded_traits:
    - pre_idea_only
relevance: core
department: Finance
criticality: core
existential_at: [revenue, scaling]
model_fit: [recurring]
selection_hint: Run once recurring charges are live. Involuntary churn (failed cards, not cancellations) is commonly 20 to 40 percent of total churn and the cheapest to recover, because the customer never chose to leave.
depends_on:
  - analytics-stack-setup
soft_after:
  - churn-diagnosis-winback
produces:
  - dunning_recovery
consumes:
  - analytics_stack
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: retention-baselined
---
# Dunning & Involuntary Churn Recovery

RECURRING. Involuntary churn is revenue lost to failed payments rather than to
customer intent. A card expires, a balance is short, a network declines, and a
paying customer silently lapses without ever deciding to leave. It is the
cheapest churn to recover because the relationship is still intact. Treat it as a
distinct, instrumented loop, not a line item hidden inside total churn.

## Procedure

1. Instrument the failure surface. Capture every declined or failed recurring
   charge with its decline code (insufficient funds, expired card, do-not-honor,
   network error) from the billing provider and route it into the analytics stack
   so involuntary churn is measured separately from voluntary cancellations.
2. Configure decline-aware smart retries. Schedule retries on a cadence keyed to
   the decline code: retry soft declines like insufficient funds across likely
   payday windows, and do not burn attempts on hard declines like closed accounts.
   Cap total attempts and respect card-network rules to avoid penalties.
3. Enable an automatic card updater (account updater) with the processor so
   expired or reissued cards are refreshed before they ever fail a charge.
4. Build the dunning sequence: a timed series of emails and in-app prompts that
   ask the customer to update their payment method, escalating in urgency, each
   with a one-click update link. Keep the copy plain and helpful, never punitive.
5. Define the grace and offboarding policy: how long access persists during
   retries, when to pause versus cancel, and how a recovered account is restored
   cleanly without a second interruption.
6. Measure recovery rate (recovered revenue over failed revenue) by decline code
   and cohort. Feed the unrecovered remainder into the churn diagnosis so it is
   not misread as product churn.

## Output

`dunning_recovery` (the configured retry schedule, card updater, dunning
sequence, and the recovery-rate report) in the company brain. Cadence: a monthly
review of recovery rate and decline-code mix, plus on-demand whenever a processor
change, pricing change, or fraud-rule change shifts decline patterns.

## Rules

- Always separate involuntary from voluntary churn. Conflating them hides the
  cheapest recoverable revenue and distorts the churn diagnosis.
- Retry on signal, not on a fixed clock. Decline-code-aware retries recover far
  more than blind daily retries and avoid network penalties.
- Never let a failed payment silently cancel. A customer who did not choose to
  leave deserves a clear, low-friction path back.

This is a recurring loop; deepen the same configuration rather than starting a
parallel one. It pairs with churn-diagnosis-winback (voluntary churn) and
cohort-retention-analysis (the retention baseline).

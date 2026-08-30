---
id: paywall-and-pricing-experiments
title: Paywall and Pricing Experiments
level: 5
summary: "Run the paywall as a continuous experiment surface: test placement and timing, hard vs soft gating, price and packaging, and trial mechanics against trial-to-paid and net revenue per user, not click-through."
applies_to:
  types:
    - consumer
    - saas
  requires_traits:
    - takes_payments
  excluded_traits:
    - pre_idea_only
relevance: core
department: Growth
criticality: core
existential_at: [revenue]
model_fit: [self_serve]
selection_hint: Run once a paywall is live and conversion volume supports a test. The paywall is the single highest-leverage revenue surface in a self-serve app, and small placement, gating, and trial changes move trial-to-paid more than most acquisition work. Skip if monetization is sales-led with no in-product purchase moment.
action: "Instrument trial-to-paid and net revenue per user with refund and retention guardrails, then run one paywall-placement A/B test."
depends_on: []
soft_after:
  - in-app-purchase-and-store-economics
  - freemium-trial-decision
  - ab-testing-protocol
produces:
  - paywall_experiments
consumes:
  - pricing_model
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: paywall-tested
---
# Paywall and Pricing Experiments

RECURRING. The paywall is where intent meets price, and it is the most leveraged
screen in a self-serve product. The same app can double trial-to-paid by changing
where the paywall appears, whether it blocks or merely nudges, what the trial asks
for, and how the offer is framed, with no change to the product itself. This
playbook treats the paywall as a permanent experiment surface. It is not a one-time
design decision; it is a measured loop where every variant is judged on trial-to-paid
and net revenue per user, never on the vanity of paywall views or tap-through.

## Procedure

1. Set the metric and guardrails. The primary metric is trial-to-paid conversion and
   net revenue per new user (after the store fee from the IAP model), measured at a
   fixed horizon (commonly D14 or D30 so renewals and early refunds are captured).
   Guardrail metrics: refund rate, D1 retention, and uninstall, so a higher-converting
   but churn-inducing paywall is caught.
2. Map the paywall surfaces. Inventory every placement: onboarding (before value),
   post-activation (after the aha), at a feature gate, at a usage limit, and a
   hard-blocking session start. Decide which moment to test; post-value placement
   almost always beats pre-value, but it must be measured per app.
3. Test the gating model. Run hard paywall (no access without paying) vs soft
   paywall (dismissable, value-then-ask) vs a metered/freemium gate. Each implies a
   different trial-to-paid and a different top-of-funnel volume; judge them on net
   revenue per install, not conversion rate in isolation.
4. Test price and packaging. Vary price points, billing periods (weekly vs monthly
   vs annual and the annual discount), the default-selected plan, and the number of
   tiers shown. Use the store price tiers and localized pricing. Anchor and decoy
   effects are real; test the layout, not just the number.
5. Test trial mechanics. Vary trial length, the hard-vs-no-trial choice, trial
   without payment up-front vs with, and the pre-expiry reminder. Trial design moves
   both conversion and refund rate, so always read them together.
6. Run it as a disciplined A/B. Follow the A/B protocol: one primary metric, a
   pre-registered hypothesis, sufficient sample and duration to clear novelty and
   weekly seasonality, and a single shipped winner per cycle. Record the result and
   the why, then queue the next test. Roll losers back cleanly.

## Output

`paywall_experiments` in the company brain: the paywall experiment ledger (each
variant, its hypothesis, sample, trial-to-paid and net-revenue-per-user result, and
the guardrail readings), the current shipped paywall configuration, and the queued
next tests. This artifact feeds the revenue model, the lifecycle messaging, and the
next pricing iteration.

## Rules

- The success metric is trial-to-paid and net revenue per user, never paywall views
  or tap-through. A paywall that is seen more but converts worse is a loss.
- Always read guardrails. A variant that lifts conversion while raising refunds or
  killing retention is not a winner.
- One disciplined test at a time per surface, with enough run-time to clear novelty
  and weekly seasonality. Ship one winner, log the why, queue the next.

RECURRING cadence: run a paywall or pricing test continuously, typically one shipped
decision per test cycle. Deepen this same experiment ledger rather than starting a
new one each quarter.

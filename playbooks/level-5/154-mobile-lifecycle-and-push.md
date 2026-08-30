---
id: mobile-lifecycle-and-push
title: Mobile Lifecycle and Push Re-engagement
level: 5
summary: Build the consumer-app lifecycle messaging system across push, in-app, and email, mapped to the D1/D7/D30 retention curve, to drive activation, habit formation, and reactivation without burning the notification permission.
applies_to:
  types:
    - consumer
  requires_traits:
    - builds_software
  excluded_traits:
    - pre_idea_only
relevance: core
department: Growth
criticality: core
existential_at: [revenue]
model_fit: [self_serve]
selection_hint: Run once the app is live and retention is being measured. For a consumer app the D1/D7/D30 curve is the business, and lifecycle messaging is the main lever that bends it short of changing the product. Skip if there is no retained-use loop to reinforce.
depends_on: []
soft_after:
  - cohort-retention-analysis
  - first-run-aha-experience
produces:
  - lifecycle_messaging
consumes:
  - retention_report
  - activation_event
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: lifecycle-live
---
# Mobile Lifecycle and Push Re-engagement

RECURRING. A consumer app lives or dies on the retention curve: what fraction of
new users come back on day 1, day 7, and day 30. The curve either smiles (it flattens
and rises as a core of habitual users forms) or it bleeds out. Lifecycle messaging is
the primary lever to bend it without rebuilding the product: the right nudge at the
right moment moves a user from installed to activated, from activated to habitual,
and pulls a lapsing user back before they uninstall. But push is a scarce, revocable
resource. One bad notification and the user disables permission forever, and you lose
the channel for good. This playbook builds the lifecycle system as a measured program,
not a blast list.

## Procedure

1. Anchor on the retention curve and lifecycle stages. Read the cohort retention
   report and define the stages each user moves through: new (pre-activation),
   activated, habitual (hit the usage interval repeatedly), at-risk (slipping below
   their cadence), and dormant. Each stage has a different job and a different
   message.
2. Earn and protect the push permission. Ask for notification permission after the
   first value moment, not on launch, with a pre-permission primer that explains the
   payoff. Treat the granted permission as an asset: every send spends trust. Track
   opt-out and disable rates as a hard guardrail.
3. Build the onboarding/activation sequence (D0-D3). Trigger messages that drive the
   user to the activation event: complete setup, return for the second session,
   reach the aha. Prefer in-app messages and a single well-timed push over a barrage;
   the goal is one more step toward value.
4. Build the habit sequence (D3-D30). Reinforce the core loop on the user's natural
   cadence (the usage interval from the retention analysis): streaks, a reason to
   return tied to real value or fresh content, and personalized triggers based on
   their behavior, not a fixed daily blast. The aim is the smile in the D7-to-D30
   curve.
5. Build the reactivation sequence (at-risk and dormant). Detect a user slipping
   below their cadence and intervene before they churn with a value-led reason to
   return, then a win-back for the already-dormant. Suppress users who never
   activated from open-ended re-engagement; they have no habit to revive.
6. Orchestrate channels and frequency. Coordinate push, in-app, and email so they do
   not collide, set a frequency cap per user, define quiet hours and timezone-aware
   send times, and route by the message's job (urgent and timely to push, rich and
   deferrable to email or in-app). Hold out a control group on every campaign.
7. Measure against retention, not opens. Judge each sequence on its lift to D1/D7/D30
   retention and reactivation rate versus the holdout, with opt-out rate as the
   guardrail. Kill anything that lifts opens but not retention, or that raises
   disables.

## Output

`lifecycle_messaging` in the company brain: the lifecycle-stage map tied to the
retention curve, the permission-priming approach, the activation, habit, and
reactivation sequences with their triggers and channels, the frequency and quiet-hour
rules, and the holdout-measured retention lift per sequence. This artifact feeds the
retention program and the paywall/monetization timing.

## Rules

- The metric is D1/D7/D30 retention and reactivation lift versus a holdout, never
  open rate. A notification that is opened but does not bend retention is noise that
  costs permission.
- Push permission is a one-shot, revocable asset. Ask after value, cap frequency,
  respect quiet hours, and watch the disable rate as a hard guardrail.
- Trigger on behavior and cadence, not a fixed daily blast. Suppress never-activated
  users from open-ended re-engagement.

RECURRING cadence: review the retention lift and opt-out rates on a regular interval
and tune the sequences against the live curve. Deepen this same lifecycle program
rather than spinning up disconnected campaigns.

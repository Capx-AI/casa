---
id: weekly-business-review
title: Weekly Business Review
level: 5
summary: The standing weekly ritual that confronts plan-versus-reality and converts it to owned actions.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Operations
criticality: core
selection_hint: Install once data flows and metrics have owners, then it runs always-on every week. The primary mechanism against operational drift. Never cancelled.
depends_on:
  - analytics-stack-setup
  - north-star-metric
  - ceo-dashboard-build
soft_after:
  - funnel-analysis
  - cohort-retention-analysis
produces:
  - wbr_artifact
  - action_register
consumes:
  - analytics_stack
  - north_star_metric
  - ceo_dashboard
effort: S
leverage: high
reversibility: easy
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: wbr-operating
---
# Weekly Business Review

RECURRING / always-on once installed. A time-triggered ritual (not event-triggered)
run on a fixed weekly cadence regardless of the week, the primary mechanism for
preventing drift: the silent divergence between what you believe is happening and
what is. Trigger: fixed day/time each week.

## Procedure

1. Auto-collect data and generate charts at end-of-week. 24h before the meeting,
   send each owner their summary, flagging metrics outside control limits with a
   required variance explanation.
2. Review controllable input metrics (leading: demos completed, sequences sent,
   page load time) before output metrics (lagging: revenue, NRR). You manage
   inputs, not outputs.
3. Use exception-based discussion: separate special-cause variation (something
   specific happened) from common-cause noise; only discuss the exceptions.
4. Answer the three questions: are we on track, what is causing deviation and is it
   in our control, what specific actions will we take this week and who owns them.
5. For AI operation, recalibrate the world model: where predictions missed actuals,
   update the model and form a hypothesis for what changed.

## Output

`wbr_artifact` (the weekly review record) and an updated `action_register` with
owners and due dates, in the company brain. Cadence: weekly, same day/time, never
cancelled. The decision-output stage passes through a human review gate.

## Rules

- Never cancel the WBR. If data is incomplete, run with what exists and treat the
  gap as a Red item.
- Manage inputs, not outputs. A target with no controllable lever is not actionable.
- The decision output is a human review gate; material commitments escalate per the
  human-in-the-loop gates.

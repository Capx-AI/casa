---
id: mixpanel-reading-playbook
title: Mixpanel Reading Playbook
level: 4
summary: Autonomous reading of Mixpanel funnels, retention, insights, flows, and JQL into decisions.
applies_to:
  types:
    - "*"
  requires_traits:
    - uses_mixpanel
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Data
criticality: optional
selection_hint: Run once Mixpanel has events flowing and a tracking plan exists, typically from launch. Skip products that do not use Mixpanel.
depends_on:
  - analytics-stack-setup
  - event-taxonomy-design
soft_after: []
produces:
  - mixpanel_read
  - product_health_summary
consumes:
  - analytics_stack
  - event_taxonomy
effort: S
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: mixpanel-read-operating
---
# Mixpanel Reading Playbook

RECURRING. The repeatable protocol by which the analytics agent reads Mixpanel and
converts it into decision-ready output for downstream agents. It does not "review
carefully"; it runs specific conditional checks and queries. Assumes events are
already flowing; instrumentation is owned by the taxonomy playbook (032).

## Procedure

1. Authenticate with a Mixpanel service account (Analyst+), Base64 basic auth, and
   the numeric Project ID. Halt and request credentials if missing.
2. Phase 1 data-integrity audit: confirm events arriving, schema matches the
   tracking plan, no duplicate or dropped events post-deploy.
3. Phase 2 funnels (conversion diagnostics) and Phase 3 retention (PMF and
   engagement health) against benchmarks; flag conversion drops >15% WoW or D7
   retention below 10%.
4. Phase 4 insights and segmentation; Phase 5 JQL for custom extraction; Phase 6
   Signal report for activation-metric discovery; Phase 7 Flows for path analysis.
5. Phase 8 alerts and anomaly detection. Emit structured outputs downstream agents
   can act on directly.

## Output

`mixpanel_read` and a `product_health_summary` in the company brain. Cadence:
weekly full run (Monday 09:00 UTC) plus on-demand on alerts, feature post-mortems
(T+7/14/30), and paid-campaign cohorts. Feeds the Weekly Business Review (040).

## Rules

- Run data integrity (Phase 1) before any funnel or retention read; a breaking
  deploy triggers an immediate Phase 1-only check.
- Output structured decisions, not prose. Downstream agents consume it literally.

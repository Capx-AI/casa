---
id: observability-setup
title: Observability Setup
level: 2
summary: Instrument logs, metrics, traces, error tracking, uptime, and SLOs on the deployed app.
applies_to:
  types:
    - "*"
  requires_traits:
    - builds_software
    - has_deployed_app
  excluded_traits:
    - pre_idea_only
relevance: core
department: Engineering
criticality: core
selection_hint: Run once a deployed app exists. It is the sensory layer that arms incident response and tells you why something broke, not just that it broke.
action: "Instrument the four golden signals, wire error tracking and uptime checks into one place, and prove one alert fires in staging."
depends_on:
  - hosting-deployment-setup
soft_after: []
produces:
  - observability_stack
  - slo_definitions
  - alerting_rules
  - postmortem_template
consumes:
  - hosting
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: app-observable
---
# Observability Setup

You cannot operate what you cannot see. Stand up unified telemetry so agents and
the founder can interrogate the system with arbitrary questions. Prefer wide,
structured events (Observability 2.0) over three siloed pillars.

## Procedure

1. Inventory the stack: language, framework, cloud, deployment target, team size,
   compliance needs, and monthly budget. Pause and ask if any are missing.
2. Instrument the Four Golden Signals (latency, traffic, errors, saturation). Use
   RED for request-driven services and USE for resource analysis.
3. Wire error tracking, structured logging, traces, and external uptime checks
   into one place so they correlate at read time.
4. Define SLOs per critical user journey, baseline them, and derive an error
   budget. Set alerts on SLO burn rate, not raw thresholds, to avoid fatigue.
5. Prove one alert fires correctly in staging. Commit a post-mortem template to
   version control.

## Output

`observability_stack`, `slo_definitions`, `alerting_rules`, and a
`postmortem_template` in the repo. Unblocks incident-response (028) and feeds
release cadence (025).

## Rules

- Reject Observability 1.0 (siloed metrics, logs, traces) unless a legacy
  constraint forces it; it does not correlate for autonomous diagnosis.
- A slow error is worse than a fast error. Track failed-request latency separately.
- At least one alert must demonstrably fire before this is done.

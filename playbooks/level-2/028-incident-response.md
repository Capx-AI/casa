---
id: incident-response
title: Incident Response
level: 2
summary: Severity matrix, command roles, and blameless postmortems for outages and security events.
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
selection_hint: Install once observability is live, then it runs always-on. Triggered by any alert, outage, or security event. Never a one-time checkbox.
depends_on:
  - observability-setup
soft_after:
  - security-baseline
  - data-backup-recovery
produces:
  - incident_runbook
  - severity_matrix
  - postmortem_log
consumes:
  - observability_stack
  - alerting_rules
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: incident-process-live
---
# Incident Response

RECURRING / always-on once installed. Dormant until the first alert or outage,
then runs on every incident. Trigger: any alert acknowledgment, customer-reported
outage, or anomaly detection event. There is no isolated root cause in a complex
system, so diagnose systemically and never blame an individual.

## Procedure

1. Detect and triage (target under 5 min): acknowledge the page, assess blast
   radius across latency/traffic/errors/saturation, declare a severity (SEV-0..4).
   When ambiguous, declare higher and downgrade later.
2. Assign command roles for SEV-0/1/2: Incident Commander (coordinates, does not
   fix), Tech Lead (fixes, reports every 10 min), Comms Lead (status updates every
   30 min for SEV-0/1), Scribe (timestamped log). IC and Scribe may merge on small
   teams; IC and TL must always be separate.
3. Mitigate first, fix root cause second. Communicate even when there is nothing
   new to report; silence is not an option.
4. Run a blameless postmortem within the SLA for the severity. Use 5 Whys to reach
   systemic cause. File it in the postmortem log.

## Output

`incident_runbook` and `severity_matrix` committed; each incident appends to
`postmortem_log`. Cadence: continuous (event-triggered), with scheduled review of
open postmortem action items.

## Rules

- Any confirmed unauthorized access to PII/PHI is automatically SEV-1 and triggers
  the regulatory notification workflow regardless of other metrics.
- Customer-facing status statements and any risky remediation escalate to the
  founder per the human-in-the-loop gates.
- Blameless always. Hindsight bias makes past decisions look obvious; resist it.

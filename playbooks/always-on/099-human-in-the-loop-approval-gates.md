---
id: human-in-the-loop-approval-gates
title: Human-in-the-Loop Approval Gates
level: always-on
summary: Classify every agent action by reversibility and consequence, and gate the high-risk ones on explicit founder approval.
applies_to:
  types:
    - "*"
  requires_traits:
    - runs_agents
  excluded_traits: []
relevance: core
department: Operations
criticality: core
selection_hint: Installed day zero before Level 0, before any agent takes any action. The safety wrapper around every other playbook. Never skip.
depends_on: []
soft_after: []
produces:
  - hitl_gates
consumes: []
effort: M
leverage: critical
reversibility: easy
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: foundations-installed
---
# Human-in-the-Loop Approval Gates

An agent that can send email, run ads, write code, and move money is a digital actor
with real-world consequences. Effective oversight is not approving every action; it
is designing the system so the actions that matter never proceed without a human. This
installs before anything else and runs continuously.

## Procedure

1. Apply the Minimal Footprint Principle to every agent: request only the permissions
   the current task needs, prefer reversible actions, do less when uncertain.
2. Classify every action before execution by the four-tier taxonomy (deterministic
   lookup, not agent discretion):
   - T1 Fully autonomous: read-only or instantly reversible, under $50, under 10
     contacts. Auto-execute.
   - T2 Post-action audit: reversible within 24h, $50 to $500, 10 to 500 contacts,
     within established pattern. Execute, then log for async daily review.
   - T3 Synchronous gate: hard to reverse, over $500, over 500 contacts, production
     change, irrecoverable comms, legal commitment, novel action, confidence under
     80 percent, or unverified external trigger. Pause and request approval.
   - T4 Hard stop: irreversible and catastrophic. Multi-party approval plus typed
     confirmation. Never execute on timeout.
3. On a T3 timeout, escalate per SLA; on a second timeout, execute the Safe Default.
   On T4, never execute under any timeout.
4. Write every T2+ action to an immutable audit log (timestamp, agent, action type,
   payload, affected entities, value, justification). Review the log on cadence.
5. Reclassify anomalous actions retroactively and lower the agent's autonomy for that
   action type.

## Output

`hitl_gates`: the installed action taxonomy, thresholds, escalation SLAs, kill switch,
and audit log, recorded as a global precondition in the company brain.

## Rules

- This is a global precondition: no playbook fires until `hitl_gates` is installed.
- Reversibility is the primary test; if an action fails it, gate it.
- Financial, legal, PR, and irreversible-data actions always escalate, level-agnostic.
- Avoid approval fatigue: gate what matters, audit the rest, do not rubber-stamp.

Cadence: continuous; evaluated on every agent action for the life of the company. Full
taxonomy, thresholds, and incident postmortems are in the source draft.

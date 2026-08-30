---
id: protocol-security-monitoring
title: Protocol Security Monitoring
level: 4
summary: Run continuous on-chain monitoring, exploit detection, a pause/guardian capability, and a rehearsed incident runbook for a live hack, after the audit and before and during mainnet.
applies_to:
  types:
    - crypto
  requires_traits:
    - builds_software
  excluded_traits:
    - pre_idea_only
relevance: core
department: Engineering
criticality: existential
existential_at: [launched, revenue, scaling]
model_fit: []
selection_hint: The live-defense counterpart to the one-time audit. Continuous monitoring, exploit detection, a guardian pause, and a rehearsed hack runbook for any value-bearing contract that is live. Run from mainnet onward, as a standing capability.
action: "Stand up live invariant monitors from the audited properties, wire a guardian pause, and rehearse the hack runbook once."
depends_on:
  - smart-contract-audit
soft_after:
  - onchain-payment-and-stablecoin-integration
  - incident-response
produces:
  - protocol_monitoring
consumes:
  - audit_report
effort: M
leverage: critical
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: protocol-monitoring-live
deliverable:
  artifact: A live protocol monitoring and incident-response setup with invariant monitors, a guardian pause, and a rehearsed hack runbook, written to the company brain.
  sections:
    - Live invariant and exploit-pattern monitors
    - Alerting thresholds tuned against normal activity
    - Guardian pause capability with quorum and conditions
    - Hack incident runbook with named on-call owners
    - Drill and post-mortem record
  max_words: 1200
rubric: Passes only when the pause capability is rehearsed before it is needed, monitors track the deployed artifact and are re-baselined after every change, and the hack response is decided in advance with a named on-call owner rather than improvised during a live drain.
---
# Protocol Security Monitoring

RECURRING. An audit is a snapshot of the code before launch; it does not watch the contract
once it holds real value. On-chain, an exploit unfolds in public, in minutes, and is
irreversible the moment funds leave, so the defense that matters after deployment is
continuous: real-time monitoring of the contract's state and invariants, automated detection
of the transaction patterns that precede a drain, a guardian or pause capability that can
stop the bleeding, and a runbook the team has rehearsed so the response to a live hack is
muscle memory rather than improvisation. This is the standing counterpart to the one-time
smart-contract audit, and it runs from mainnet onward.

## Procedure

1. Instrument the on-chain invariants. From the invariants the audit verified (conservation
   of balances, no unauthorized mint, access control on privileged functions, no anomalous
   outflow), define live monitors that watch the contract's state and flag any violation or
   drift in real time, using a monitoring service (for example Forta, OpenZeppelin Defender,
   Tenderly alerts) or a custom watcher against an archive node.
2. Detect exploit patterns. Alert on the signatures of an attack in progress: a flash-loan
   funded interaction, an unexpected privileged call, an outflow above a threshold in a
   block, a sudden price or oracle deviation, or an interaction from a freshly funded or
   known-malicious address. Tune thresholds against normal activity so the alerts are
   actionable, not noise.
3. Build the pause and guardian capability. Ensure a guardian role (ideally a multisig with
   a documented quorum) can pause value-moving functions or activate a circuit breaker, and
   that the path from alert to pause is short and tested. Document precisely who can pause,
   under what conditions, and how the pause is later lifted.
4. Write the incident runbook for a hack. Define detection-to-containment steps: confirm the
   exploit, pause the affected functions, freeze what can be frozen, contact the relevant
   exchanges and bridges to flag stolen funds, engage incident-response partners and (where
   appropriate) the white-hat path, and decide the user-communication line. Name the
   on-call owner and the escalation chain.
5. Rehearse it. Run a tabletop or testnet drill of the full path from alert to pause to
   communication so the team has executed the runbook before a real incident forces it. An
   unrehearsed pause capability fails exactly when it is needed.
6. Operate and review. Keep the monitors and on-call live, review alerts and tune them on a
   recurring cadence, re-baseline after every contract change or upgrade, and conduct a
   blameless post-mortem after any real or drilled incident, feeding fixes back into the
   monitors and the runbook.

## Output

`protocol_monitoring` in the company brain: the live invariant and exploit-pattern monitors,
the alerting setup and thresholds, the guardian/pause capability with its quorum and
conditions, the rehearsed hack incident runbook with named on-call owners, and the drill and
post-mortem record. Cadence: continuous monitoring with a recurring alert-tuning and drill
review, plus immediate activation on a real incident. Builds directly on the audit report.

## Rules

- The pause capability is rehearsed before it is needed. An untested guardian path that
  fails during a live drain is worse than none, because it was relied upon.
- Monitor the deployed artifact and re-baseline after every change. A post-audit upgrade can
  reopen the whole surface, and the monitors must track the code that is actually live.
- A hack response is decided in advance, not in the moment. Funds move in minutes on-chain;
  there is no time to design the runbook during the incident.

RECURRING. Pairs with and depends on the smart-contract audit. Re-run the tuning and drill
cadence and after every deployment. Deepen this same monitoring and runbook rather than
standing up a parallel one.

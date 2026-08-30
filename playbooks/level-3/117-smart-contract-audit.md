---
id: smart-contract-audit
title: Smart Contract Audit
level: 3
summary: Subject on-chain contracts to third-party audit, formal verification of critical invariants, and a public bug bounty before any mainnet deployment holds value.
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
existential_at: [building, launched, revenue]
model_fit: []
selection_hint: The do-or-die gate before mainnet. A contract that holds user funds is unforgiving and immutable once deployed; an unaudited deploy is an unbounded loss waiting to happen. Run before any value-bearing contract ships.
action: "Freeze the audit scope, pin the deploy commit, and engage a reputable third-party auditor before any value-bearing mainnet deploy."
depends_on: []
soft_after:
  - tech-stack-selection
produces:
  - audit_report
consumes: []
effort: L
leverage: critical
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: contracts-audited
deliverable:
  artifact: A mainnet deploy gate record with the third-party audit, the verified invariants, and a live bug bounty, written to the company brain.
  sections:
    - Frozen audit scope and pinned commit
    - Third-party auditor and engagement inputs
    - Formally verified critical invariants
    - Findings triaged with remediation and re-audit evidence
    - Live bug bounty with scope and payout tiers
    - Founder sign-off on the deploy gate
  max_words: 1200
rubric: Passes only when no value-bearing contract reaches mainnet with an unresolved critical or high finding, the audited artifact is the exact deployed commit (re-audited after any post-audit change), critical invariants are formally verified rather than only tested, and the bounty complements rather than substitutes for the audit.
---
# Smart Contract Audit

On-chain code is adversarial and, once deployed, effectively immutable and public. A bug
in a value-bearing contract is not a patchable defect; it is a standing invitation to
drain user funds, and history is a long list of protocols that learned this after launch.
The audit is the gate that stands between a contract that holds value and mainnet. Clear
it before any deployment that can custody, transfer, or mint value.

## Procedure

1. Freeze the audit scope. Identify the exact contracts, libraries, and upgrade paths
   that will hold or move value, pin the commit, and document the trust assumptions,
   privileged roles, and external dependencies the auditor must reason about.
2. Engage a reputable third-party auditor. Select a firm with a track record on the
   target chain and contract pattern. Provide the spec, threat model, and prior internal
   review so the engagement spends its time on real risk, not orientation.
3. Formally verify the critical invariants. For the properties whose violation is
   catastrophic (no unauthorized mint, conservation of balances, access control on
   privileged functions, no reentrancy on value paths), specify them and verify, not
   merely test.
4. Remediate and re-audit. Triage every finding by severity, fix the highs and criticals,
   and have the auditor confirm the fixes against the same pinned commit. An audit with
   open criticals is not a passed audit.
5. Stand up a bug bounty before mainnet. Publish scope, severity tiers, and payout
   ranges through a recognized program so external researchers have a legitimate,
   incentivized disclosure path rather than an exploit incentive.
6. Record the deploy gate. Capture the final report, the remediation evidence, the
   verified invariants, and the live bounty, and require explicit founder sign-off that
   these conditions are met before the mainnet deploy proceeds.

## Output

`audit_report` in the company brain: the third-party audit with severities and
remediation status, the set of formally verified invariants, and the live bug-bounty
program. This artifact is the precondition the mainnet deploy is gated on.

## Rules

- No value-bearing contract reaches mainnet with an unresolved critical or high finding.
- Audit the deployed artifact, not an older branch. Re-audit after any post-audit change
  to in-scope code; a single late edit can reopen the whole surface.
- A bounty is a complement to an audit, never a substitute for one.

This is a founder-gated, hard-to-reverse gate. Re-run before any subsequent value-bearing
deployment, upgrade, or migration. Deepen this same engagement rather than skipping it
under launch pressure.

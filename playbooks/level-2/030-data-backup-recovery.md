---
id: data-backup-recovery
title: Data Backup & Recovery
level: 2
summary: Set RPO/RTO targets, run encrypted immutable backups, and prove restores with drills.
applies_to:
  types:
    - "*"
  requires_traits:
    - builds_software
    - has_datastore
  excluded_traits:
    - pre_idea_only
relevance: core
department: Engineering
criticality: core
selection_hint: Run once any data store exists. Turns an outage, ransomware event, or bad migration into a 30-minute problem instead of an existential one.
action: "Set RPO and RTO for your Tier 1 data store, then run one full restore drill and log the actual RTO."
depends_on:
  - hosting-deployment-setup
soft_after:
  - security-baseline
produces:
  - backup_policy
  - rpo_rto_targets
  - restore_drill_log
consumes:
  - hosting
effort: M
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: backups-verified
---
# Data Backup & Recovery

Protect every data store so loss is recoverable. Backups that have never been
restored do not count. The restore drill is the deliverable, not the backup job.

## Procedure

1. Inventory data stores (Postgres, object storage, event logs, third-party SaaS)
   and classify each into Tier 1 mission-critical through Tier 4 archival.
2. Set RPO and RTO per tier from business tolerance (Tier 1 near-zero RPO,
   sub-30-minute RTO). Pause and ask the founder for targets if unstated.
3. Implement the 3-2-1-1-0 rule: three copies, two media types, one offsite, one
   immutable or air-gapped, zero recovery errors. For Postgres, use WAL archiving
   plus periodic base backups for point-in-time recovery.
4. Choose a DR pattern that meets each tier's RTO (Backup-and-Restore, Pilot Light,
   Warm Standby, or Multi-Site Active-Active) and weigh cost against recovery speed.
5. Automate alerting on backup-job failure. Run scheduled restore drills (Game
   Days) that spin up, restore, verify integrity, and tear down; log RTO actuals.

## Output

`backup_policy`, `rpo_rto_targets`, and a `restore_drill_log` in the company brain.
Cadence: weekly backup-integrity verification, quarterly full restore drill.
Feeds incident-response (028) restore scenarios.

## Rules

- Destructive restores into production and any irreversible data operation escalate
  to the founder per the human-in-the-loop gates.
- One immutable or air-gapped copy is the ransomware backstop. It must be
  un-deletable even by a full-admin attacker.
- A backup not proven restorable is treated as no backup.

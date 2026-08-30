---
id: email-deliverability-setup
title: Email Deliverability Setup
level: 2
summary: Authenticate sending domains (SPF/DKIM/DMARC), isolate streams, and warm IPs/domains so email reliably reaches the inbox.
applies_to:
  types:
    - "*"
  requires_traits:
    - sends_email
  excluded_traits: []
relevance: core
department: Engineering
criticality: core
selection_hint: Critical-path L2 item. Start day one because the warmup window is 30 to 45 days; every email playbook (078/079/080/081/084) is blocked until this is warmed.
depends_on: []
soft_after:
  - domain-acquisition
produces:
  - email_deliverability
consumes: []
effort: M
leverage: critical
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: email-warmed
---
# Email Deliverability Setup

Deliverability is a continuous operational discipline, not a one-time config. A
single bad DNS record or complaint spike can destroy months of reputation in 24
hours. Goal: sustain 98%+ primary inbox placement across transactional, marketing,
and cold outbound streams. Start this on day one of L2; the warmup window is the
long pole.

## Procedure

1. Authenticate. Publish SPF (one record, end with `-all` once sources are verified,
   keep under 10 DNS lookups, flatten if needed), DKIM (2048-bit RSA, aligned `d=`,
   rotate every 6 months), and DMARC (start `p=quarantine`, configure aggregate
   reporting, move to `p=reject` once clean). Verify each record passes before any send.
2. Isolate streams. Separate subdomains and IP pools for transactional vs marketing
   vs cold outbound. Never mix promotional content into transactional streams.
3. Warm. Ramp volume gradually over 30 to 45 days, seeding engaged recipients first
   so positive engagement signals build domain/IP reputation before scale.
4. List hygiene. Verify every import is opt-in and documented; suppress bounces and
   complaints; keep complaint rate under 0.1% and bounce rate low.
5. Monitor and recover. Watch Postmaster Tools / Sender Score, blacklists (Spamhaus
   SBL/XBL/DBL/PBL, Spamcop), and placement. On a blacklist event, halt sending and
   run the recovery protocol.

## Output

`email_deliverability`: authenticated and warmed sending infrastructure with stream
isolation, plus a monitoring routine, recorded in the company brain.

## Rules

- Recurring. Operate continuously: quarterly health audit, 6-month DKIM rotation,
  daily complaint/blacklist monitoring. This never checks off complete.
- Never send before authentication passes and warmup is underway. Sending at T-7
  from launch lands in spam.
- Comply with Gmail/Yahoo 2024 and Microsoft 2025 bulk-sender rules (one-click
  unsubscribe, complaint thresholds) before scaling volume.

Full RFC detail, flattening protocol, and recovery steps in the source draft above.
Condense, do not pad.

---
id: demo-script
title: Demo Script
level: 5
summary: Run a high-conversion, problem-led product demo that maps value to the prospect's quantified pain.
applies_to:
  types:
    - saas
    - consumer
    - marketplace
    - hardware
    - b2b-service
  requires_traits:
    - b2b
  excluded_traits:
    - b2c
    - self_serve_only
relevance: core
department: Sales
criticality: core
model_fit: [sales_led]
selection_hint: The persuasion event after discovery qualifies a B2B deal. Fires only when discovery is complete and a sandbox is ready. Skip for pure B2C or self-serve with no live demo.
action: "Script a demo that opens with the prospect's quantified pain and shows only the capabilities that resolve it."
depends_on:
  - discovery-call-framework
soft_after: []
produces:
  - demo_delivered
  - demo_script
consumes:
  - discovery_notes
  - qualification_score
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: first-pipeline
---
# Demo Script

The demo is the highest-leverage moment in the B2B cycle, and most demos fail by
feature-dumping. Lead with the prospect's quantified pain, show only what resolves
it, then close on a mutual action plan. A demo is a persuasion event, not a training
session.

## Procedure

1. Gate the demo: proceed only if qualification score meets threshold, a named
   stakeholder is confirmed, the research packet is complete, and the sandbox is
   provisioned and pre-flight-checked within 24h. Otherwise complete the
   prerequisite or escalate.
2. Open by setting the stakes: restate the pain hypothesis (pain, cause, quantified
   impact) from discovery. Get agreement before showing anything.
3. Walk through only the capabilities that resolve the named pain, with the
   sandbox loaded with the prospect's industry, size, and use case (no placeholder
   names).
4. Tailor the talk track per persona (champion, economic buyer, technical buyer,
   end user). Handle objections in real time via 087.
5. Close: agree concrete next steps and a mutual action plan. Send the post-demo
   follow-up.

## Output

`demo_delivered` (with the mutual action plan) and a reusable `demo_script`,
written to the company brain. Feeds contract & close (088); calls objection
handling (087).

## Rules

- B2B only. Never feature-dump or build to a "grand finale"; lead with pain.
- Abort and re-run discovery if the confirmed pain field is missing.
- Recurring: per-prospect, ongoing while a sales motion exists.

Enterprise variant (L7): split exec and technical tracks. Full source at the
`source` path.

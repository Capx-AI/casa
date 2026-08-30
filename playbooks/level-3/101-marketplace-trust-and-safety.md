---
id: marketplace-trust-and-safety
title: Marketplace Trust and Safety
level: 3
summary: Stand up the trust layer a two-sided marketplace lives or dies on, covering identity, fraud screening, dispute resolution, and the policy that governs both sides.
applies_to:
  types:
    - marketplace
  requires_traits: []
  excluded_traits: []
relevance: core
department: Operations
criticality: existential
model_fit: [marketplace]
selection_hint: Run before opening a marketplace to real transactions. Liquidity without trust is churn; the first bad transaction without a dispute path is a dead marketplace.
depends_on: []
soft_after:
  - beachhead-selection
produces:
  - trust_safety_policy
consumes: []
effort: L
leverage: critical
reversibility: medium
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: trust-layer-live
deliverable:
  artifact: A trust and safety policy covering identity, fraud screening, disputes, and enforcement for both marketplace sides, written to the company brain.
  sections:
    - Per-side trust risk map
    - Identity and onboarding requirements per side
    - Fraud screening signals, thresholds, and review queue
    - Dispute-resolution process and decision rule
    - Published policy and enforcement ladder
    - Escrow and payout terms routed to a founder-approved regulated provider
  max_words: 1200
rubric: Passes only when a dispute path exists before any transaction opens, identity and screening are proportional to transaction risk on each side, the enforcement ladder is explicit, and all funds movement is routed to a founder-approved regulated provider rather than handled in the policy.
---

# Marketplace Trust and Safety

The trust layer for a two-sided marketplace. Both sides must believe the other will not
defraud them, or the market never clears.

## Procedure

1. Map the trust risks on each side: who can defraud whom, and how (non-delivery,
   non-payment, fake listings, off-platform leakage, identity fraud).
2. Set identity and onboarding requirements per side, proportional to transaction risk.
3. Define fraud screening: the signals you score, the thresholds, and the manual-review
   queue for the gray zone.
4. Write the dispute-resolution process: how a claim is filed, the evidence each side
   provides, the decision rule, and the refund or payout outcome.
5. Publish the policy both sides agree to, and the enforcement ladder (warning, hold,
   suspension, ban).
6. Decide what is held in escrow and for how long (route funds through a founder-approved regulated provider).

## Output

A `trust_safety_policy`: the per-side identity and screening rules, the dispute process,
the escrow and payout terms, and the enforcement ladder, written to the company brain.

## Rules

- Never open transactions before the dispute path exists. The first unresolved dispute
  teaches both sides the market is unsafe.
- Funds movement and escrow run through a founder-approved regulated provider, not here.

---
id: treasury-and-stablecoin-runway
title: Treasury & Stablecoin Runway
level: 5
summary: Manage the on-chain treasury, hold runway in stablecoins rather than a volatile native token, secure funds behind a multisig, and diversify so a single failure does not end the company.
applies_to:
  types:
    - crypto
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Finance
criticality: existential
existential_at: [revenue, scaling]
model_fit: []
selection_hint: The survival discipline for a crypto business holding its own funds on-chain. Hold runway in stablecoins, secure it behind a multisig, and diversify custody and issuer exposure. Run once the treasury holds meaningful value.
action: "Move operating runway into diversified stablecoins behind a 3-of-5 multisig, then compute months of runway and set alert thresholds."
depends_on: []
soft_after:
  - onchain-payment-and-stablecoin-integration
  - unit-economics
produces:
  - treasury_policy
consumes: []
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: treasury-policy-live
deliverable:
  artifact: A treasury policy covering balance buckets, stablecoin runway, multisig custody, and runway alerts, written to the company brain.
  sections:
    - Labeled treasury buckets
    - Stablecoin runway policy with issuer and chain diversification limits
    - Multisig custody setup with quorum and signer procedures
    - Hot/cold and spend movement controls
    - Runway calculation and alert thresholds
    - Review and rebalance cadence
  max_words: 1200
rubric: Passes only when runway is measured in stablecoins rather than a volatile native token, no single key or single person can move treasury funds, issuer, chain, and custody are diversified so one failure cannot end the company, and custody or concentration changes are founder-gated.
---
# Treasury & Stablecoin Runway

RECURRING. A crypto business holds its operating funds on-chain, and that exposes it to two
failure modes traditional startups never face: the value of its own treasury can collapse if
runway is held in a volatile native token, and the entire treasury can vanish in one
transaction if a single key is compromised. The discipline is to measure runway in
stablecoins (months of real operating expense, not a token-price-inflated number), to hold
funds behind a multisig with no single point of failure, and to diversify across stablecoin
issuers, chains, and custody so no one issuer depeg, one chain halt, or one compromised
signer ends the company. This is treasury management as survival, reviewed on a cadence
because both balances and risks move.

## Procedure

1. Separate the balances. Split the treasury into clearly labeled buckets: operating runway
   (must be stable and liquid), a controlled stablecoin spend balance for paid actions, any
   native token holding (treated as a volatile asset, not runway), and reserves. Never count
   a volatile native-token balance as runway; price it conservatively or exclude it from the
   runway number entirely.
2. Hold runway in stablecoins, and diversify the issuer. Keep operating runway in
   fiat-backed stablecoins, and split across more than one reputable issuer so a single
   depeg or freeze does not take the whole runway with it. Document the acceptable assets and
   the maximum concentration per issuer and per chain.
3. Secure custody behind a multisig. Hold treasury funds in a multisig (for example a Safe)
   with a sensible quorum (such as 3-of-5), with signers who are distinct people on distinct
   devices, and with a documented signer set, key-loss procedure, and rotation policy. No
   single key, and no single person, can move treasury funds.
4. Set spend and movement controls. Define which wallets are hot (small, operational) versus
   cold (the bulk, multisig-secured), the approval threshold above which a transfer needs
   additional sign-off, and an allowlist of destination addresses for routine flows. Route
   genuinely needed paid actions through an approved payment path; the treasury policy reads receipts, it
   does not invent spend.
5. Compute and watch runway. Calculate months of runway as stablecoin operating balance
   divided by net monthly burn, fed by unit economics, and set alert thresholds (for example
   below 12, 9, and 6 months) that trigger a deliberate review. Track the runway number on
   the dashboard alongside revenue.
6. Review and rebalance on cadence. On a recurring schedule reassess issuer and chain
   concentration, depeg and counterparty risk, hot/cold balance, and the signer set; rebalance
   within the documented policy; and require founder sign-off for any change to custody,
   concentration limits, or the signer set.

## Output

`treasury_policy` in the company brain: the labeled treasury buckets, the stablecoin runway
policy with issuer and chain diversification limits, the multisig custody setup with its
quorum and signer procedures, the hot/cold and spend controls, the runway calculation and
alert thresholds, and the review cadence. This reads from the payment rail and unit
economics and is distinct from any CAPX holding.

## Rules

- Runway is measured in stablecoins, never in a volatile native token. A treasury that looks
  healthy only at the token's current price is a runway that can evaporate overnight.
- No single key and no single person moves treasury funds. Multisig custody with distinct
  signers is the floor, not an upgrade.
- Diversify issuer, chain, and custody. A single stablecoin depeg, chain halt, or compromised
  signer must not be able to end the company.

RECURRING. Founder-gated for any custody or concentration change. Re-run the review cadence
and on a runway or depeg alert, and deepen this same policy rather than improvising a parallel
treasury.

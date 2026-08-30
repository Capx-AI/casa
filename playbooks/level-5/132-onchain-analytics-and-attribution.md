---
id: onchain-analytics-and-attribution
title: On-chain Analytics & Attribution
level: 5
summary: Build wallet cohorts, on-chain funnels, and retention-by-wallet on Dune and subgraphs, and attribute on-chain behavior back to acquisition sources.
applies_to:
  types:
    - crypto
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Data
criticality: core
existential_at: [revenue, scaling]
model_fit: [recurring]
selection_hint: The measurement layer for a crypto product, where the source of truth is the chain, not a server log. Wallet cohorts, on-chain funnels, retention by wallet, and source attribution. Run once an analytics stack and on-chain activity exist.
depends_on:
  - analytics-stack-setup
soft_after:
  - event-taxonomy-design
  - wallet-onboarding-ux
produces:
  - onchain_analytics
consumes:
  - analytics_stack
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: onchain-analytics-live
---
# On-chain Analytics & Attribution

RECURRING. In a crypto product the most important behavior happens on the chain, not on the
server, so the analytics stack alone is blind to what matters. A deposit, a swap, a stake,
a transfer, and the wallet that did it are public on-chain facts, and the job of on-chain
analytics is to turn that raw event stream into wallet cohorts, funnels, and retention
curves, and to join it back to the off-chain acquisition data so growth can see which source
brought which wallets and whether they stayed. The tooling is specific (Dune queries, a
subgraph or indexer, an RPC archive node, and a wallet-labeling layer), and the failure mode
is treating raw transaction count as a success metric while real retained value is flat.

## Procedure

1. Stand up the on-chain data layer. Index the product's contracts via a subgraph or a
   hosted indexer, and set up Dune (or an equivalent) for ad-hoc analysis against the public
   chain data. Establish the canonical wallet identifier and a labeling layer that ties a
   wallet to a product user where consent and the account model allow, so on-chain and
   off-chain data can be joined.
2. Define the on-chain critical event. As with off-chain retention, identify the on-chain
   action most correlated with a wallet remaining active (for example first deposit above a
   threshold, second transaction, or liquidity provided), and the usage interval over which
   an active wallet is expected to repeat it. The critical event is never raw transaction
   count.
3. Build wallet cohorts and retention. Group wallets by the week they first transacted and
   chart D1/D7/D30 wallet retention against the critical event, classifying each curve as
   healthy (flattening) or declining. Segment cohorts by acquisition source and by whether
   they arrived through an incentive campaign.
4. Build the on-chain funnel. Chart the path from wallet created to funded to first action
   to retained, quantify drop at each step, and reconcile it with the off-chain onboarding
   funnel so the full journey from visit to retained wallet is visible end to end.
5. Attribute behavior to source. Join on-chain cohorts back to the acquisition channel and,
   for incentive campaigns, separate organically-retained wallets from reward-driven and
   sybil wallets so growth can compute true cost per retained wallet and stop crediting
   farmed volume as success.
6. Publish and watch. Build the standing dashboards (Dune dashboard plus the internal view),
   set alerts on retention drops, sybil-rate spikes, and funnel regressions, and review on a
   recurring cadence so the numbers drive the incentive and product roadmap rather than
   decorate it.

## Output

`onchain_analytics` in the company brain: the indexer/subgraph and Dune setup, the
wallet-labeling and join layer, the on-chain critical event and usage interval, the wallet
cohort and retention tables, the on-chain funnel, and the source attribution that separates
real retained wallets from farmed ones. Cadence: monthly review plus on-demand on retention
or sybil-rate alerts. Feeds the incentive-growth program and the CEO dashboard.

## Rules

- The chain is the source of truth, and raw transaction count is not a success metric.
  Measure retained wallets against a real critical event, the same discipline as off-chain
  retention.
- Always separate organic from incentivized and sybil wallets in attribution. Counting
  farmed volume as retained users hides a leaking funnel and misdirects the budget.
- Respect the account model and consent when joining a wallet to a person. On-chain data is
  public; the linkage to identity is not, and it inherits the compliance and privacy posture.

RECURRING. Re-run on the review cadence and on alert. Deepen these same dashboards rather
than spinning up parallel one-off queries.

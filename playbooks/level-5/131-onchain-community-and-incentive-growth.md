---
id: onchain-community-and-incentive-growth
title: On-chain Community & Incentive Growth
level: 5
summary: Run points, airdrop, quest, and on-chain referral campaigns with sybil resistance to acquire and retain real wallets, not farmers.
applies_to:
  types:
    - crypto
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Growth
criticality: growth
model_fit: []
selection_hint: The crypto-native acquisition loop once a product and wallet onboarding exist. Points, airdrops, quests, and on-chain referral, with sybil resistance so the budget reaches real users. Run as a recurring campaign cadence.
depends_on:
  - wallet-onboarding-ux
soft_after:
  - onchain-analytics-and-attribution
produces:
  - incentive_program
consumes:
  - wallet_onboarding
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: incentive-program-live
---
# On-chain Community & Incentive Growth

RECURRING. Crypto distribution runs on incentives: points that hint at a future allocation,
airdrops that reward early use, quests that walk a wallet through the product, and on-chain
referral that pays for verifiable invites. The opportunity is that these loops can acquire
users faster and cheaper than paid media; the trap is that they attract sybil farmers who
spin up thousands of wallets to harvest the reward and vanish the moment it lands. A program
that does not defend against this is simply paying mercenaries to inflate vanity metrics.
The job is to design incentives that pull real, retained wallets and to make farming
unprofitable. Run this as an ongoing campaign cadence, not a one-off drop.

## Procedure

1. Set the objective and the reward budget. Tie each campaign to a specific on-chain
   behavior worth paying for (first deposit, sustained usage, liquidity provided, real
   referrals), and cap the reward budget against the tokenomics emission plan or a
   stablecoin marketing budget. An incentive with no defined target behavior funds noise.
2. Choose the mechanism. Select points (deferred, flexible, revocable), a retroactive
   airdrop (reward proven past behavior), quests (guided actions with a reward), or on-chain
   referral (pay the referrer when the invited wallet performs the target action). Prefer
   retroactive and behavior-gated rewards over flat sign-up bounties, which farm the worst.
3. Build sybil resistance in from the start. Score wallets on on-chain history and funding
   source, cluster wallets funded from a common source or transacting in lockstep, weight or
   gate rewards by proof-of-humanity or reputation signals, and require genuine product
   actions rather than cheap on-chain pings. Decide the anti-sybil rules before announcing,
   because they cannot be tightened fairly after the fact.
4. Design for retention, not just the claim. Structure the reward so value accrues to
   wallets that keep using the product (vesting points, streak or tenure multipliers,
   clawback of unearned allocations) rather than paying out in full at first touch. The
   metric that matters is retained wallets after the reward, not wallets at the claim.
5. Run, instrument, and defend. Launch the campaign, track participation, cost per retained
   wallet, and the sybil rate flagged and excluded, and adjust caps and rules within the
   stated policy as farming patterns emerge. Publish clear, consistent rules so the
   community trusts the program.
6. Review each cycle. At the campaign cadence, compare cost per retained wallet against paid
   channels, measure post-reward retention versus organic cohorts, retire mechanisms that
   only bought farmers, and feed the next budget from what actually retained.

## Output

`incentive_program` in the company brain: the campaign objectives and target behaviors, the
chosen mechanisms, the sybil-resistance ruleset, the retention-weighted reward structure,
and the per-cycle results (cost per retained wallet, sybil rate, post-reward retention).
Cadence: a recurring campaign review (for example monthly) plus on-demand when a live
campaign shows farming. Reads wallet cohorts from on-chain analytics.

## Rules

- Reward retained behavior, not the claim. A program measured by wallets at claim time is
  measuring farmers; measure wallets still active after the reward.
- Anti-sybil rules are set before announcement and applied consistently. Loosening or
  reinterpreting them after a drop destroys community trust faster than any farmer.
- The reward budget is capped against the emission or marketing plan. An uncapped incentive
  is an unbounded liability dressed as growth.

RECURRING. Re-run each campaign cycle. Deepen this same program with sharper anti-sybil and
retention design rather than chasing a new gimmick each drop.

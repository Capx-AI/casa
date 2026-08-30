---
id: tokenomics-design
title: Tokenomics Design
level: 2
summary: Define token utility, supply schedule, emissions, vesting, and the sink/source balance for a business that issues its own token, before any allocation is committed.
applies_to:
  types:
    - crypto
  requires_traits:
    - has_token
  excluded_traits:
    - pre_idea_only
relevance: core
department: Strategy
criticality: core
existential_at: [launched, scaling]
model_fit: []
selection_hint: Only for a business that actually issues its own token. Sets utility, supply, emissions, and vesting before allocations are locked. Skip entirely if there is no token; the design is irreversible once distribution begins.
depends_on: []
soft_after:
  - token-and-licensing-strategy
produces:
  - token_design
consumes: []
effort: L
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: tokenomics-set
---
# Tokenomics Design

Tokenomics is the monetary policy of the business, and like monetary policy it is far
easier to set than to change. A token's utility (what holding or using it actually does),
its total and circulating supply, its emission curve, and the vesting schedule on team and
investor allocations together determine whether the token accrues value or inflates into
irrelevance. Once an allocation is distributed and vesting has begun, the parameters are
effectively locked by the holders who relied on them, so the design is done deliberately,
on paper, before a single token is committed. This playbook applies only to a business that
issues its own token; a business that merely uses stablecoins does not need it.

## Procedure

1. Define real token utility. State precisely what the token does that nothing else could:
   access or gating, fee payment or fee discount, staking for a service or for security,
   governance, or reward distribution. Reject utility that is purely speculative narrative.
   If removing the token would not break the product, the token has no utility yet and the
   design stops here until it does.
2. Set the supply schedule. Decide total supply (fixed or with a defined inflation rule),
   the initial circulating supply at launch, and the curve by which the rest enters
   circulation. Model circulating supply month by month, including unlocks, so the dilution
   path is explicit rather than discovered later.
3. Design emissions against a budget. If the token rewards usage, liquidity, or staking,
   set the emission rate as a deliberate spend with a runway, not an open-ended faucet. Tie
   emissions to outcomes (real usage, retained liquidity) and define the conditions under
   which they taper. Over-emission is the most common way a token economy bleeds out.
4. Allocate and vest. Split supply across team, investors, treasury, community/ecosystem,
   and liquidity, and attach a cliff and linear vesting to insider allocations long enough
   to align them with the business. Publish the allocation and vesting; opaque or
   short-vested insider supply is a credibility and regulatory red flag.
5. Balance sinks and sources. For every source that mints or releases tokens (emissions,
   unlocks, rewards), name a sink that removes or locks them (fee burns, staking locks,
   buy-and-make, usage that consumes the token). Model the net flow; a token with strong
   sources and no sinks trends to zero regardless of narrative.
6. Stress-test and gate. Run the model under adverse cases (price down, usage flat, large
   unlock cliff, mercenary liquidity exit) and check the economy survives them. Cross-check
   every parameter against the licensing and token-classification posture so the design
   does not contradict the legal stance, then require explicit founder and counsel sign-off
   before any allocation is committed.

## Output

`token_design` in the company brain: the documented token utility, the total and
circulating supply schedule, the emission policy and its budget, the allocation and vesting
table, the sink/source balance model, and the stress-test results with founder and counsel
sign-off. This sits under the licensing strategy and steers the incentive-growth program's
reward budget.

## Rules

- A token with no utility beyond speculation is not designed yet. If removing it would not
  break the product, do not issue it.
- Insider allocations vest on a real cliff and schedule, and the allocation is published.
  Short-vested or hidden insider supply destroys trust and invites scrutiny.
- Every source is matched by a sink, and the net flow is modeled. Emissions are a budgeted
  spend with a runway, never an open faucet.

This is a founder-gated, hard-to-reverse design and must be consistent with the token
classification in the licensing strategy. Revisit only through a deliberate, governed change
and deepen this same model rather than launching a parallel token.

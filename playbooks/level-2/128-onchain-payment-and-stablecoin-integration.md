---
id: onchain-payment-and-stablecoin-integration
title: On-chain Payment & Stablecoin Integration
level: 2
summary: Wire wallet-connect, a stablecoin settlement rail, gas and fee handling, chain selection, and an on/off-ramp so the product can actually move value on-chain.
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
model_fit: [transactional]
selection_hint: The payment rail itself for a crypto product. No deposit, settlement, or payout can flow until wallet-connect, a stablecoin rail, gas handling, and an on/off-ramp are live. Build before any value moves.
action: "Select the settlement chain and stablecoin, pin token addresses as named config, and test the full rail on testnet first."
depends_on: []
soft_after:
  - tech-stack-selection
  - kyc-aml-program
produces:
  - onchain_payments
consumes: []
effort: L
leverage: critical
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: onchain-rail-live
deliverable:
  artifact: An on-chain payment rail spec covering chain, settlement asset, wallet model, fees, ramps, and reconciliation, written to the company brain.
  sections:
    - Selected settlement chain with rationale
    - Settlement stablecoin and pinned token addresses
    - Wallet-connect and custody model
    - Gas and fee handling design
    - On/off-ramp with region and KYC coverage
    - Confirmation depth and reconciliation rules
  max_words: 1500
rubric: Passes only when the rail is non-custodial by default, no unconfirmed transaction is ever treated as settled, token addresses and ramp keys are configuration with named owners rather than literals in source, and ramp access is gated on the KYC/AML screening.
---
# On-chain Payment & Stablecoin Integration

For a crypto product the payment rail is the product surface where value enters and
leaves. It is not a Stripe call you bolt on at the end; it is wallet-connect, a chosen
settlement chain, a stablecoin denomination, the gas economics of every transaction, and
the fiat on/off-ramp that lets a user arrive with a card and leave with cash. Getting the
chain, the stablecoin, and the fee model wrong is expensive to undo once balances and
integrations exist, so the rail is designed deliberately before any value moves across it.

## Procedure

1. Select the settlement chain. Choose the chain (or L2/rollup) on the basis of finality
   time, per-transaction fee at expected volume, stablecoin liquidity and native issuer
   support, wallet and on-ramp coverage, and tooling maturity. Document why the chosen
   chain beats the alternatives for this product, and whether a multi-chain posture is
   needed now or deferred.
2. Pick the settlement asset and denomination. Decide which stablecoin the product settles
   in (a fiat-backed issuer stablecoin such as USDC, or a native chain stablecoin), where
   balances are denominated, and how non-stable assets are converted at the edge. Pin the
   token contract addresses per chain and treat them as configuration, never hardcoded
   strings scattered in the codebase.
3. Implement wallet-connect and account model. Integrate the wallet connection layer
   (WalletConnect / injected providers, or an embedded smart-account provider) so a user
   can authenticate and authorize transfers. Define what the product custodies versus what
   stays in the user's wallet, and make non-custodial the default unless a regulated
   custody path is deliberately chosen.
4. Design gas and fee handling. Decide who pays gas (user-paid, sponsored via a paymaster,
   or netted from the transfer) and implement fee estimation, slippage and minimum-output
   guards on swaps, retry and replacement logic for stuck transactions, and idempotency so
   a retried submit never double-spends. Surface the all-in cost to the user before they
   sign.
5. Wire the on/off-ramp. Integrate a licensed on-ramp (card or bank to stablecoin) and an
   off-ramp (stablecoin to bank) via a provider whose KYC and supported regions match the
   compliance program. Gate ramp access on the screening from the KYC/AML program; the rail
   inherits the compliance perimeter, it does not bypass it.
6. Harden settlement integrity. Track every transfer by on-chain transaction hash, confirm
   to the required block depth before treating value as final, reconcile the product's
   internal ledger against on-chain state on a schedule, and handle reorgs, failed/partial
   transfers, and refunds explicitly. Test the whole path on testnet, then with capped
   real value, before opening it.

## Output

`onchain_payments` in the company brain: the selected chain and settlement stablecoin with
rationale, the wallet-connect and custody model, the gas and fee handling design, the
integrated on/off-ramp and its region/KYC coverage, and the reconciliation and confirmation
rules. This artifact is the rail every downstream payment, payout, and incentive flow runs
on, and it feeds wallet onboarding, on-chain analytics, and treasury.

## Rules

- Non-custodial by default. Holding user keys or funds turns the product into a custodian
  with the full regulatory weight that implies; choose it only deliberately and on top of
  the compliance program.
- Never treat an unconfirmed transaction as settled. Wait for the chain's required
  confirmation depth and reconcile against on-chain state; optimistic crediting is how
  double-spends and reorg losses happen.
- Token addresses, RPC endpoints, and ramp keys are configuration with named owners, not
  literals in source. A wrong stablecoin address is an irreversible loss.

This is a founder-gated, hard-to-reverse rail. Re-run before adding a chain, changing the
settlement stablecoin, or switching ramp providers. Deepen this same integration rather than
standing up a parallel rail.

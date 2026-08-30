---
id: wallet-onboarding-ux
title: Wallet Onboarding UX
level: 3
summary: Design the non-custodial onboarding, the seed-phrase versus account-abstraction choice, recovery, and the first-transaction funnel so a new user gets a wallet and completes their first on-chain action.
applies_to:
  types:
    - crypto
  requires_traits:
    - builds_software
  excluded_traits:
    - pre_idea_only
relevance: core
department: Product
criticality: core
existential_at: [launched, revenue]
model_fit: [self_serve]
selection_hint: The make-or-break funnel for any self-serve crypto product. Wallet creation, key recovery, and the first signed transaction are where most users drop; design this once the payment rail exists.
depends_on:
  - onchain-payment-and-stablecoin-integration
soft_after:
  - onboarding-flow-design
produces:
  - wallet_onboarding
consumes:
  - onchain_payments
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: wallet-onboarding-live
---
# Wallet Onboarding UX

In a self-serve crypto product the single largest source of lost users sits between
"signed up" and "completed their first on-chain action." A new user faces concepts that no
other software demands of them at minute one: a wallet they alone control, a recovery
secret that cannot be reset by support, gas they must hold to transact, and a signature
prompt they do not yet trust. The seed-phrase versus account-abstraction decision, the
recovery model, and the choreography of the first transaction determine whether the rail
built upstream ever carries a real user. This playbook designs that funnel deliberately.

## Procedure

1. Choose the key and account model. Decide between a classic externally-owned wallet
   (user holds a seed phrase) and an account-abstraction / smart-account model (social or
   passkey login, programmable recovery, gas sponsorship). For a consumer self-serve
   product, default to account abstraction with passkey or social login so the first
   experience does not require a seed phrase; reserve raw seed-phrase flows for technical
   audiences who want full self-custody.
2. Design the recovery path before the create path. Recovery is the part users discover at
   the worst moment, so decide it first: social recovery / guardians, passkey-backed
   recovery, or an explicit, well-warned seed-phrase backup. Whichever is chosen, make the
   consequence of losing access unambiguous, and never imply the product can restore funds
   it cannot.
3. Remove gas from the first transaction. Use a paymaster or gas sponsorship so a brand-new
   user can complete their first action without first acquiring native gas tokens. The
   first signed transaction should require nothing the user does not already have.
4. Choreograph the first-transaction funnel. Map the exact steps from landing to first
   confirmed on-chain action, instrument each as an event (wallet created, funded or
   sponsored, transaction prompted, signed, confirmed), and design each signature prompt to
   explain in plain language what the user is authorizing and what it costs.
5. Make the wallet legible. Show balance in the settlement stablecoin (not raw token
   units), show pending versus confirmed state for in-flight transactions, and give the
   user a clear receipt with the transaction hash. Hide chain mechanics the user does not
   need; surface the ones that build trust.
6. Test on the real funnel. Run the onboarding with non-crypto-native testers, watch where
   they hesitate or abandon, measure activation (share of new wallets that reach a first
   confirmed transaction), and iterate on the highest-drop step before launch.

## Output

`wallet_onboarding` in the company brain: the chosen key/account model and rationale, the
recovery design and its user-facing warnings, the gas-sponsorship approach for the first
transaction, the instrumented first-transaction funnel with its activation definition, and
the wallet-legibility patterns. This feeds on-chain analytics (wallet cohorts) and the
incentive-growth program.

## Rules

- Recovery is designed before creation, and the product never promises to restore access
  or funds it has no key for. The worst onboarding failure is a user who funds a wallet
  they can no longer reach.
- The first transaction asks for nothing the user does not already have. Requiring a user
  to go buy gas before their first action is where self-serve crypto funnels die.
- Every signature prompt says, in plain language, what is being authorized and what it
  costs. Blind-signing is both an activation killer and a security hazard.

This is reversible with effort once live. Revisit when changing the account model, the
recovery scheme, or the supported chain, and deepen this same funnel rather than bolting on
a second onboarding path.

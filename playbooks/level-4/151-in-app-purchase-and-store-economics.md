---
id: in-app-purchase-and-store-economics
title: In-App Purchase and Store Economics
level: 4
summary: Stand up App Store and Play in-app purchases (subscriptions and consumables), validate receipts server-side, and model the true take-home after store fees so the monetization mix is built on real unit math.
applies_to:
  types:
    - consumer
  requires_traits:
    - builds_software
  excluded_traits:
    - pre_idea_only
relevance: core
department: Finance
criticality: core
existential_at: [revenue]
model_fit: [self_serve]
selection_hint: Run for any consumer app that monetizes through the mobile stores. The store fee and the subscription-vs-consumable mix decide whether the unit economics close, so this gates how the paywall is priced and packaged. Skip if monetization is web-only outside the stores.
depends_on: []
soft_after:
  - freemium-trial-decision
  - packaging-tier-design
produces:
  - iap_model
consumes:
  - pricing_model
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: true
recurring: false
typical_milestone: iap-live
---
# In-App Purchase and Store Economics

For a consumer app, the store is the cash register and it takes a cut before you
see a cent. Apple and Google sit between the user and the revenue: they own the
billing, the receipt, the refund, and a fee that historically runs 30% (15% under
the small-business and the post-first-year subscription tiers, lower again where
external-purchase or reader rules apply). You cannot price a paywall or model unit
economics honestly until the store fee, the product types, and the receipt path are
nailed down. This playbook sets up the IAP catalog, makes purchases verifiable on
your own server, and produces the take-home math the rest of monetization runs on.

## Procedure

1. Choose the product-type mix. Map each monetization surface to a store product
   type: auto-renewable subscriptions (the recurring spine for a subscription app),
   non-renewing subscriptions, consumables (coins, credits, one-shot unlocks), and
   non-consumables (a permanent unlock). Decide the subscription-vs-consumable split
   deliberately; subscriptions compound and forecast, consumables spike and depend on
   whales. Define the intro offer and free-trial mechanics per subscription.
2. Build the store catalog. Create the product IDs, price tiers, subscription groups
   (so upgrade and downgrade and crossgrade behave), and the localized price points
   in App Store Connect and Google Play Console. Keep product IDs stable and
   namespaced; renaming them later breaks restores and analytics.
3. Wire purchase and restore in-app. Implement the purchase flow (StoreKit 2 on iOS,
   Google Play Billing on Android), including restore-purchases, deferred and pending
   transactions, family sharing, and the upgrade/downgrade proration paths. Handle the
   states users actually hit: interrupted purchase, ask-to-buy, billing retry.
4. Validate receipts server-side. Never trust the client. Verify every transaction
   against the store (App Store Server API and notifications V2, Google Play Developer
   API and Real-time Developer Notifications) on your backend, record the canonical
   entitlement, and reconcile renewals, refunds, grace periods, and billing-retry
   state from the server notifications. Consider a subscription platform (RevenueCat
   or equivalent) via its API rather than building this from scratch, but the
   entitlement of record lives on your server.
5. Model store economics. Build the take-home: gross price, store fee at the correct
   tier (15 vs 30 and the small-business program), VAT/GST handled by the store,
   refunds and chargebacks, involuntary churn from billing failures, and trial-to-paid
   conversion. Output net revenue per subscriber and per consumable buyer, the blended
   net after fee, and the LTV that the paywall and CAC math must clear.
6. Reconcile and report. Tie store payouts to your receipt ledger monthly, surface
   the fee drag and refund rate, and flag when a tier change (crossing the small-
   business threshold or year-one subscription anniversary) shifts the net.

## Output

`iap_model` in the company brain: the chosen product-type and subscription-vs-
consumable mix, the store catalog (product IDs, price tiers, subscription groups,
trial and intro offers), the server-side receipt-validation and entitlement design,
and the store-economics model (net-after-fee, trial-to-paid, LTV). This artifact
gates live store revenue and feeds the paywall and pricing experiments.

## Rules

- Receipts are validated server-side, always. A client-asserted entitlement is a
  revenue-leak and a fraud vector.
- Price against the take-home, not the sticker. The store fee, refunds, and VAT come
  off the top before any unit-economics claim is true.
- Product IDs and subscription groups are set once and kept stable. Renaming them
  later breaks restores, entitlements, and historical analytics.

This is a revenue-blocking setup with hard-to-undo store configuration. Revisit when
adding a new product type, crossing a store-fee tier, or entering a market with
different external-purchase rules. Deepen this same model rather than forking it.

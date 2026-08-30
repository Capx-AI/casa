---
id: local-reviews-reputation
title: Local Reviews and Reputation
level: 5
summary: Build the review-generation and reputation-management loop that compounds local ranking and is the primary trust signal for a local service.
applies_to:
  types:
    - "*"
  requires_traits:
    - local_service_only
  excluded_traits: []
relevance: core
department: Growth
criticality: core
existential_at: [revenue, scaling]
model_fit: [local]
selection_hint: Run once a local service has repeat customers. Reviews are the compounding local-ranking and trust lever; start the loop as early as you have happy customers.
depends_on: []
soft_after:
  - local-google-business-profile
produces:
  - reputation_system
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: reviews-compounding
---

# Local Reviews and Reputation

For a local service, the review count and rating are the moat. They compound ranking and
are the first thing a customer checks. Recurring, because reputation is never finished.

## Procedure

1. Trigger a review request at the moment of peak satisfaction (job completed, customer
   happy), by text or email, with a one-tap link.
2. Make leaving a review frictionless: pre-fill what you can, link straight to the
   profile.
3. Respond to every review, positive and negative, on a fixed cadence. The response is
   read by future customers, not just the reviewer.
4. Route unhappy customers to a private resolution path before they post, and fix the
   root cause.
5. Track rating and volume over time; a steady flow of recent reviews outranks a stale
   high count.

## Output

A `reputation_system`: the review-request trigger and template, the response cadence, the
private-resolution path, and the rating and volume trend.

## Rules

- Ask at peak satisfaction, make it one tap, respond to all. No incentivizing or faking
  reviews; it violates platform policy and customers can tell.

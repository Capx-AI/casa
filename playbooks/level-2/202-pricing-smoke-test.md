---
id: pricing-smoke-test
title: Pricing Smoke Test
level: 2
summary: >-
  Run a fake-door, pre-order, or Van Westendorp test to capture a real willingness-to-pay signal
  from prospects before you build or set list price.
applies_to:
  types:
    - saas
    - ecommerce
    - consumer
    - b2b
    - marketplace
  requires_traits: []
  excluded_traits: []
relevance: core
department: Finance
criticality: core
selection_hint: >-
  Select before launch when price is a guess and you have access to prospects or traffic. Skip if
  pricing is fixed by a marketplace take rate or a contract you do not control.
depends_on:
  - icp-target-account-listing
soft_after:
  - problem-validation-interviews
  - pricing-research
produces:
  - pricing_signal
  - willingness_to_pay_band
  - fake_door_conversion_rate
consumes: []
effort: S
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: pre-launch pricing validated with a real money or intent signal
model_fit:
  - transactional
  - self_serve
deliverable:
  artifact: pricing_signal
  sections:
    - Test method and audience
    - Price points tested
    - Conversion or WTP results
    - Recommended launch price
  max_words: 600
rubric: >-
  Strong if the recommended price is backed by a real money or click-through signal from at least 30
  target prospects, not opinion or guesswork.
---

# Pricing Smoke Test

## Procedure
1. Pick one method based on what you can ship this week. Fake-door: a live pricing page with real buy buttons that route to a waitlist or "notify me" capture. Pre-order: collect an actual deposit or card. Van Westendorp: a 4-question survey (too cheap, cheap, expensive, too expensive). Use pre-order if you can take payment, fake-door otherwise.
2. Define 3 price points to test, anchored to your cost and any pricing-research input. For fake-door, build three identical pages differing only on price and split traffic evenly. For Van Westendorp, the survey itself reveals the band, so skip the split.
3. Recruit at least 30 qualified respondents from your icp-target-account-listing. Drive them via direct outreach, a small paid ad set, or an existing list. Reject unqualified clicks so the signal stays clean.
4. Run for 5 to 7 days or until each variant has 30+ exposures. Record click-to-intent rate per price point, or the Van Westendorp acceptable-price range and optimal price point.
5. Compute the willingness_to_pay_band: the range where intent stays high before it collapses. Pick a launch price at or just below the point where conversion drops sharply.
6. Write up the pricing_signal deliverable with method, price points, raw numbers, and the recommended price. Flag if the signal is weak (under 30 responses or flat across all points) so the team treats it as directional only.

## Output
A dated pricing_signal artifact stating the recommended launch price and the evidence behind it.

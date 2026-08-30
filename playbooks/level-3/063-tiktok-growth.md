---
id: tiktok-growth
title: TikTok Growth
level: 3
summary: Run a hook-first short-form TikTok loop for organic reach and commerce.
applies_to:
  types:
    - ecommerce
    - content
    - consumer
    - marketplace
  requires_traits:
    - b2c
  excluded_traits:
    - b2b
relevance: conditional
department: Growth
criticality: optional
model_fit: [self_serve]
selection_hint: B2C / consumer channel. Short-form video where the first 3 seconds decide reach. Skip for pure B2B; run continuously when the audience is on TikTok.
depends_on: []
soft_after:
  - newsletter-growth
produces:
  - tiktok_channel
  - short_form_video
consumes: []
effort: L
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: audience-channels-live
---
# TikTok Growth

TikTok distributes by satisfaction signals, not follower count. The hook in the
first three seconds decides whether a video reaches anyone.

## Procedure

1. Confirm fit. B2C or consumer audience present on the platform; brand, category,
   and budget defined.
2. Engineer hooks. Open every video with a pattern-interrupt in the first 3
   seconds; test multiple hooks per concept.
3. Build the organic loop. High post volume of native, trend-aware content; iterate
   fast on what the algorithm rewards (watch time, rewatches, shares).
4. Detect and ride trends. Monitor sounds and formats; respond rapidly.
5. Layer paid and commerce. Spark Ads to amplify organic winners; TikTok Shop where
   the product fits, keeping CPA <= 30% of LTV.
6. Protect account health. Avoid guideline strikes; run the shadowban diagnostic on
   reach collapse.

## Cadence

Continuous daily posting; weekly growth sprint and analytics review.

## Output

`tiktok_channel` and a library of `short_form_video`, with metrics in the company
brain.

## Rules

- B2C-leaning channel; do not force it on a pure B2B motion.
- Amplify with paid only after a video proves organic traction.

Short-form winners here are repurposable to Instagram Reels (066).

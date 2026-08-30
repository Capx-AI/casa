---
id: newsletter-growth
title: Newsletter Growth
level: 3
summary: Grow and operate a newsletter from zero to a self-sustaining, owned audience channel.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
model_fit: [self_serve]
selection_hint: The owned, algorithm-independent audience channel. Stand up once an ESP and authenticated domain exist; then run continuously. Other channels feed it.
action: "Set up an authenticated sending domain and a lead-magnet opt-in, then publish your first three issues on a fixed cadence."
depends_on: []
soft_after:
  - email-deliverability-setup
produces:
  - newsletter_channel
  - owned_audience
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: audience-channels-live
---
# Newsletter Growth

The newsletter is the highest-ROI owned media asset: a direct, algorithm-
independent relationship with the audience. The job is to maximize subscriber LTV
while minimizing CAC across every channel.

## Procedure

1. Confirm setup. ESP API access, authenticated domain (SPF/DKIM/DMARC), analytics,
   and at least 3 published issues with a defined editorial voice.
2. Build the opt-in. Lead magnet plus high-converting opt-in surfaces across the
   site and content.
3. Acquire organically. Cross-promotion, content upgrades, and a referral engine.
4. Layer paid (on plateau). Spend only when unit economics are proven at small
   scale.
5. Protect deliverability. List hygiene, sunset inactive subscribers, monitor open
   rate and spam-complaint rate.
6. Measure and iterate. Track new subscribers, open rate, and click-to-open;
   audit subject lines and format on engagement drops.

## Cadence

Operate continuously on the publishing cadence; weekly growth review, immediate
deliverability-recovery on alert.

## Output

`newsletter_channel` and a growing `owned_audience`, with metrics in the company
brain.

## Rules

- Prove unit economics before pouring paid spend in.
- Open rate below 30% or spam complaints above 0.1% trigger immediate
  deliverability recovery.

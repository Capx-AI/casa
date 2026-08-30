---
id: nurture-campaign
title: Nurture Campaign
level: 5
summary: Build behavior-triggered email sequences that educate opted-in prospects and move them toward a conversion event.
applies_to:
  types:
    - "*"
  requires_traits:
    - sends_email
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
selection_hint: Run once a CRM, lead scoring, and a content library exist. Behavior-responsive education for prospects who have raised their hand but are not yet ready to buy.
depends_on:
  - welcome-email-sequence
soft_after:
  - transactional-emails
produces:
  - nurture_campaign
consumes:
  - welcome_sequence
  - email_deliverability
  - long_form_content
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: lifecycle-live
---
# Nurture Campaign

A nurture campaign is a behavior-triggered email sequence that educates, builds
trust, and moves an opted-in prospect toward conversion. It sits between broadcast
newsletters and cold outreach: the prospect already raised their hand. Nurtured
leads buy 47% larger and cost 33% less. The dominant lever is timing relative to
intent, not copy.

## Procedure

1. Verify the trigger. Never enroll a contact without a verified entry event
   (content download, webinar, trial signup). The trigger determines sequence and goal.
2. Match ELM mode to funnel stage. TOFU prospects are peripheral: short, high-value,
   low-ask, social proof. BOFU are central: comparisons, ROI, case studies, objection handling.
3. Always prefer behavioral triggers over calendar timers. Build behavioral exit
   conditions so a high-intent action (visits pricing, books demo) routes the contact
   out of education and into a conversion sequence immediately.
4. Collect at least one segmentation signal in the first two emails and branch the
   rest of the sequence on it (role, goal, industry).
5. Use narrative structure (open loops, protagonist, alternating tension/relief) and
   one clear CTA per email.
6. Monitor click and conversion lift; prune and iterate.

## Output

`nurture_campaign`: live behavior-triggered nurture sequences with segmentation
branching and exit conditions, recorded in the company brain.

## Rules

- Recurring. Operate and tune continuously; review weekly. Add and retire sequences
  as triggers and content change.
- Blocked until deliverability is warmed (082) via the welcome sequence (078).
- One segmentation signal before branching; do not over-send. Honor suppression and
  consent at all times.

Full ELM/SOS/personalization frameworks and trigger taxonomy in the source draft
above. Condense, do not pad.

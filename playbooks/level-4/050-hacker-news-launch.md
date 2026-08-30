---
id: hacker-news-launch
title: Hacker News Launch
level: 4
summary: Run a Show HN launch to reach the front page, sustain visibility, and convert highly skeptical technical traffic.
applies_to:
  types:
    - saas
    - consumer
    - content
    - crypto
  requires_traits:
    - has_website
    - technical_audience
  excluded_traits:
    - local_service_only
    - b2c
relevance: optional
department: Growth
criticality: optional
model_fit: [self_serve]
selection_hint: Run under the launch plan only when the product appeals to a technical audience and the submitting account is aged. Skip for non-technical B2C.
depends_on:
  - launch-plan-t90
soft_after:
  - product-hunt-launch
produces:
  - hn_launch
consumes:
  - launch_plan
  - positioning
effort: M
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: launched
---
# Hacker News Launch

HN is roughly 5 million technically literate, highly skeptical monthly readers who
penalize inauthentic or exaggerated claims and read source code and pricing closely.
The ranking formula decays fast, so the first 60 minutes after submission are
disproportionately important.

## Procedure

1. Confirm triggers: a CEO mandate, public usability, a public landing page or repo,
   and a submitting account at least 14 days old with 20+ karma and real comment
   history.
2. T-7 to T-1: run the pre-launch checklist (page loads under 3 seconds, CDN active,
   no card required, analytics firing, public URL with no email wall). Warm the
   account with substantive comments if history is thin.
3. T-0: submit "Show HN" with an honest, non-marketing title; post a transparent
   maker comment explaining what it is and how it works.
4. T+0 to T+24: answer every technical question candidly, including criticism;
   never argue or astroturf.
5. T+24 to T+72: analyze traffic, conversion, and thread takeaways.

## Output

`hn_launch`: the submission, the engagement log, front-page duration, and HN-attributed
traffic and conversion, written to the company brain.

## Rules

- Human gate on the title and submission; HN launches are one shot and hard to redo.
- No vote rings or sockpuppets; HN auto-flags rapid same-account submissions and
  new-account-then-submit patterns.
- Honesty over polish; the audience rewards transparency and punishes spin.

Full algorithm detail, account hygiene, and conversion tactics in the source draft
above. Condense, do not pad.

---
id: phase0-one-pager
title: Phase 0 One-Pager
level: 0
summary: >-
  Draft a responsive web one-pager as local HTML collateral a founder can share
  without a slide tool or a live host.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Brand
criticality: core
selection_hint: >-
  Public collateral for every new company. Run with or right after the Phase 0
  website. Skip only if a real one-pager already lives under
  company-brain/outputs/phase0-one-pager/.
action: "Write a responsive one-page site to company-brain/outputs/phase0-one-pager/ and do not publish it."
depends_on: []
soft_after:
  - phase0-website
produces:
  - phase0_one_pager
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: >-
    A responsive single-page web one-pager written to
    company-brain/outputs/phase0-one-pager/, openable locally.
  sections:
    - "Offer in one screen: name, who it is for, what it does, why it wins"
    - Proof or evidence block (even if early and honestly thin)
    - Clear next step (waitlist, contact, or conversation)
    - Responsive layout that stays readable on a phone
    - README that names the files and how to open the page locally
  max_words: 500
rubric: >-
  Passes only when a real HTML one-pager exists under
  company-brain/outputs/phase0-one-pager/, states audience, offer, and next step
  on one scroll, remains readable at a phone width, and the README records that
  nothing was published.
---
# Phase 0 One-Pager

Collateral a founder can send in one link-worth of files: who it is for, what
it does, why it is different, and what to do next. This is a web page, not a
PDF requirement and not a hosted landing page. Casa does not build it. The
harness writes static files locally.

## Procedure

1. Read `company-brain/profile.json`. If `company-brain/outputs/phase0-website/`
   exists, reuse its name, one-liner, logo, and colors so the one-pager matches
   the site. If it does not exist yet, proceed from the profile alone.
2. Write a single responsive page (one `index.html` plus CSS, or a self-contained
   HTML file) under `company-brain/outputs/phase0-one-pager/`. It must work
   locally with relative paths. No remote fonts that break offline, no required
   build step.
3. Cover, in one scroll: the name, the audience, the offer, the difference
   versus the obvious alternative, one proof point or an honest "early" note,
   and one next step. Keep copy short. No em-dashes, no emojis.
4. Check a phone-width layout (about 375px). Type must stay readable. The
   primary action must stay visible without hunting.
5. Write `README.md` in that folder: how to open the page locally, and an
   explicit line that this play did not publish anything.
6. Stop. Do not POST to a publish or host API and do not treat this file as
   live. Deployment is a separate, founder-controlled action. Going public is
   always-ask.

## Output

`phase0_one_pager`: the local one-pager under
`company-brain/outputs/phase0-one-pager/`. Required by publish-readiness.

## Rules

- Casa does not build or host this page. The harness writes the files.
- Real HTML, not a markdown mock of a one-pager.
- Do not publish. Do not spend money. Do not overwrite the founder's own
  project files.

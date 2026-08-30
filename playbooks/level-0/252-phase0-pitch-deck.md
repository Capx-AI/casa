---
id: phase0-pitch-deck
title: Phase 0 Pitch Deck
level: 0
summary: >-
  Draft a short responsive web deck locally. HTML slides are the artifact. A
  PPTX file is not required.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Brand
criticality: core
selection_hint: >-
  Short public narrative for every new company. Run with or right after the
  Phase 0 website. Skip only if a real web deck already lives under
  company-brain/outputs/phase0-pitch-deck/.
action: "Write a short HTML slide deck to company-brain/outputs/phase0-pitch-deck/ and do not publish it."
depends_on: []
soft_after:
  - phase0-website
produces:
  - phase0_pitch_deck
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
    A short responsive HTML deck written to
    company-brain/outputs/phase0-pitch-deck/, openable locally, with keyboard or
    scroll navigation between slides.
  sections:
    - Title, problem, and who it is for
    - Product or offer and why now
    - How it works, in a few steps
    - Market or wedge, and the ask or next step
    - README that names the files and how to open the deck locally
  max_words: 700
rubric: >-
  Passes only when a real HTML deck exists under
  company-brain/outputs/phase0-pitch-deck/, has a short slide sequence a founder
  can present from a browser, is not a PPTX-only drop, and the README records
  that nothing was published.
---
# Phase 0 Pitch Deck

A short narrative a founder can present from a browser. The artifact is a
responsive web deck, not a required PowerPoint file. Casa does not build it.
The harness writes static files locally.

## Procedure

1. Read `company-brain/profile.json`. If `company-brain/outputs/phase0-website/`
   exists, reuse its name, one-liner, logo, and colors. If a one-pager exists,
   keep the offer language consistent.
2. Write an HTML deck under `company-brain/outputs/phase0-pitch-deck/`. Each
   slide is a section or a full-viewport panel. Keyboard (arrow keys) or scroll
   must move between slides. Relative paths only. Opening `index.html` locally
   must work. PPTX is optional extra, never the only artifact.
3. Keep it short: about 8 to 12 slides. Suggested arc: title, problem, audience,
   offer, how it works, why now, wedge or market, proof or honest early status,
   the ask or next step. One idea per slide. No em-dashes, no emojis.
4. Check a laptop width and a phone width. Type must stay readable. Do not pack
   a paragraph onto a slide.
5. Write `README.md` in that folder: how to open and advance the deck locally,
   and an explicit line that this play did not publish anything.
6. Stop. Do not POST to a publish or host API and do not treat this deck as
   live. Deployment is a separate, founder-controlled action. Going public is
   always-ask.

## Output

`phase0_pitch_deck`: the local web deck under
`company-brain/outputs/phase0-pitch-deck/`. Required by publish-readiness.

## Rules

- Casa does not build or host this deck. The harness writes the files.
- HTML is required. PPTX alone is a failed run.
- Do not publish. Do not spend money. Do not overwrite the founder's own
  project files.

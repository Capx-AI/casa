---
id: phase0-publish-readiness
title: Phase 0 Publish Readiness
level: 0
summary: >-
  Check that name, description, logo, category, and local website, one-pager,
  and deck versions exist, plus at least one completed Casa playbook. This play
  documents the gate. It does not publish.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Strategy
criticality: core
selection_hint: >-
  The local distribution gate for every new company. Run after the Phase 0
  website, one-pager, and deck exist. Completing it does not go live.
action: "Write a publish-readiness checklist from the local artifacts and stop without calling any publish API."
depends_on:
  - phase0-website
  - phase0-one-pager
  - phase0-pitch-deck
soft_after: []
produces:
  - phase0_publish_readiness
consumes:
  - phase0_website
  - phase0_one_pager
  - phase0_pitch_deck
effort: S
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: >-
    A publish-readiness checklist written to
    company-brain/outputs/phase0-publish-readiness/ that records pass or fail
    for each gate item and states that nothing was published.
  sections:
    - Name, description, logo, and category
    - Local website, one-pager, and deck versions with paths
    - At least one completed Casa playbook with a real outputs/ artifact
    - Explicit non-publish statement
  max_words: 600
rubric: >-
  Passes only when every checklist item is present on disk (name, description,
  logo, category, website, one-pager, deck, and at least one completed playbook
  artifact), each path is real, and the write-up states that this play did not
  publish and that going public still requires an explicit founder-controlled
  deployment.
---
# Phase 0 Publish Readiness

This play is a gate document, not a launch. It checks that the company can be
shown. It does not put anything on the public internet. Going public still
requires a founder-controlled deployment and sits on the always-ask line: no
dial can auto-publish.

## Procedure

1. Do not POST to a publish, host, or register API. Do not deploy. If another
   tool offers publishing, refuse it here. Deployment always stops for explicit
   founder approval.
2. Check each item against files on disk, not against intent:

   - Name: `company-brain/profile.json` `company_name` is non-empty and matches
     the site.
   - Description: a one-liner or short description exists in the profile or on
     the site home page.
   - Logo: a real image or SVG under the website output (or a dedicated logo
     file referenced by the site).
   - Category: `primary_type` (or a founder-chosen category recorded in the
     checklist) is set.
   - Website: `company-brain/outputs/phase0-website/index.html` exists.
   - One-pager: `company-brain/outputs/phase0-one-pager/index.html` exists.
   - Deck: `company-brain/outputs/phase0-pitch-deck/index.html` exists.
   - At least one completed Casa playbook: `company-brain/state.json` lists a
     completed id whose `company-brain/outputs/<id>/` folder contains a real
     artifact. The three Phase 0 artifacts count once they exist.

3. Write `company-brain/outputs/phase0-publish-readiness/CHECKLIST.md` with pass
   or fail per item, the path used as evidence, and any gap. If any required
   item fails, stop and send the founder back to the missing play. Do not mark
   this node done on a partial checklist.
4. End the checklist with two sentences: this play did not publish, and going
   public still requires a separate deployment plus explicit founder approval
   (always-ask: go public).
5. Stop. Completing this playbook records local readiness only. Existing
   companies remain usable if this play is still open. Terminal publication
   will be gated later and must not be assumed from this node.

## Output

`phase0_publish_readiness`: the checklist under
`company-brain/outputs/phase0-publish-readiness/`. It is evidence for a later
publish gate. It is not itself a publish.

## Rules

- Never publish from this play and never call a remote publishing API.
- A missing file is a fail, not a "will add later" pass.
- Do not seed this play as already-done for an existing business. Incomplete
  Phase 0 is catch-up, not a reason to drop the stage floor.
- No em-dashes, no emojis in the checklist.

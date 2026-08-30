---
id: artifact-change-brief
title: Artifact Change Brief
level: 4
summary: >-
  Recommend later-stage website, one-pager, and deck refreshes as an
  approval-required change brief or a local draft. Casa does not edit or
  publish the live artifact.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: recommended
department: Brand
criticality: growth
selection_hint: >-
  After Phase 0 collateral exists and the company is at or past launch. Run when
  the offer, pricing, or positioning has moved. Skip if the live site already
  matches. Never auto-publish.
action: "Write an approval-required change brief for website, one-pager, and deck refreshes. Draft locally if asked. Do not publish or activate."
depends_on:
  - phase0-publish-readiness
soft_after:
  - phase0-website
  - phase0-one-pager
  - phase0-pitch-deck
produces:
  - artifact_change_brief
consumes:
  - phase0_website
  - phase0_one_pager
  - phase0_pitch_deck
  - phase0_publish_readiness
effort: M
leverage: med
reversibility: easy
human_gate: true
blocks_revenue: false
recurring: true
typical_milestone: launched
deliverable:
  artifact: >-
    An approval-required change brief written to
    company-brain/outputs/artifact-change-brief/ that recommends website,
    one-pager, and deck refreshes and states that nothing was published or
    activated.
  sections:
    - Status line (approval required, published no, activated no)
    - Current local website, one-pager, and deck paths
    - Recommended refresh per artifact
    - Optional local draft paths
    - Explicit next step naming publish as a separate founder command
  max_words: 700
rubric: >-
  Passes only when a real brief exists under
  company-brain/outputs/artifact-change-brief/, marks the change as approval
  required, names the local artifacts, and states that this play did not
  publish or activate. A run that called publish or activate is a fail.
---
# Artifact Change Brief

Public collateral drifts. The offer, the name, or the proof changes, and the
live site, one-pager, or deck should follow. This play writes a change brief
the founder can accept or reject. It may copy a local draft. It does not edit
the live hosted version and it does not publish.

Going public sits on the always-ask line. No dial can auto-publish. Activate
and rollback stay explicit founder commands.

## Procedure

1. Do not POST to a publish, deploy, activate, or rollback API. If another tool
   offers publishing, refuse it here. Deployment is a separate founder step
   after this brief is accepted.
2. Read `company-brain/profile.json` for the current name, one-liner, and type.
   Read the local artifacts, if they exist:
   - `company-brain/outputs/phase0-website/`
   - `company-brain/outputs/phase0-one-pager/`
   - `company-brain/outputs/phase0-pitch-deck/`
3. Write the brief with the deterministic CLI (preferred) or by hand to the
   same paths:

   ```
   node scripts/briefs.mjs --brain company-brain
   ```

   Optional local draft (copies current files into a side folder, or writes a
   draft README if the local artifact is missing):

   ```
   node scripts/briefs.mjs --brain company-brain --draft
   ```

   Optional single type: `--type site`, `--type one-pager`, or `--type deck`.
   Optional founder reason: `--reason "Pricing changed"`.
4. Confirm the write landed at
   `company-brain/outputs/artifact-change-brief/BRIEF.md` and
   `company-brain/decisions/artifact-change-brief.md`. The brief must say
   status approval required, published no, and activated no.
5. If a local draft is wanted, edit files under
   `company-brain/outputs/artifact-change-brief/drafts/` only. Do not overwrite
   the live hosted version. Do not treat the draft folder as live.
6. Stop. Present the brief to the founder. If they accept and want it live,
   they choose and run the deployment outside Casa. Completing this playbook
   records that a brief was written. It is not a publish.

## Output

`artifact_change_brief`: the approval-required brief under
`company-brain/outputs/artifact-change-brief/`. Optional local drafts under
`drafts/`. Neither is live.

## Rules

- Never publish, deploy, or activate from this play.
- Casa may recommend and draft locally. Casa must not silently edit a live
  artifact.
- A missing local file is a recommendation to run the Phase 0 play, not a
  reason to skip the brief.
- No em-dashes, no emojis in the brief.

Cadence: monthly after launch, or when the offer, pricing, or positioning
changes.

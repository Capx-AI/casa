---
id: phase0-publish
title: Phase 0 Publish
level: 0
summary: Publish the reviewed company face through a separately installed integration.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
department: Strategy
criticality: core
existential_at: [idea]
selection_hint: Run only after local readiness and one explicit founder publication approval.
depends_on: [phase0-publish-readiness]
soft_after: []
produces: [phase0_published]
consumes: [phase0_publish_readiness]
effort: M
leverage: high
reversibility: easy
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-publish/README.md with confirmed published URLs
  sections: [Reviewed face and approval scope, Published URLs, Verification and gaps]
  max_words: 300
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact from the brief, explicit founder approval, and confirmed URLs.
  Local paths passed off as URLs and placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Publish

Original Casa procedure, distributed under MIT.

## Procedure

1. Read the brief, readiness README, and `company-brain/face.json`. Confirm all
   required artifacts passed readiness and prepare the exact publication scope.
2. Read `docs/ATTESTATION.md` under `Publishing the face`. Its publish commands
   only work when the separate `capx/` integration is present and the brain is
   bound. If either is missing, record the gap and leave this play open.
3. Present the face, site, one-pager, deck, and intended destination together.
   Obtain one explicit founder approval for the complete publication sequence.
4. After approval, the harness runs `node scripts/face.mjs build company-brain`,
   then the documented `site`, `one-pager`, `deck`, and `face` publish commands
   in that order. Use the installed integration; Casa core has no network client.
5. Write `company-brain/outputs/phase0-publish/README.md`, at most 300 words,
   with approval scope, confirmed URLs, and one brief fact tying the publication
   to this company. Record failures honestly and leave incomplete publication open.
6. Verify returned URLs match the approved company and artifacts, then run
   copy-lint on the README. Approval covers this sequence, not later changes.

---
id: phase0-company-brief
title: Phase 0 Company Brief
level: 0
summary: Describe the actual product, users, agent work, and current evidence.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
department: Strategy
criticality: core
existential_at: [idea]
selection_hint: Run first in Phase 0 to ground every company face artifact.
depends_on: []
soft_after: [opportunity-scan]
produces: [company_brief]
consumes: [opportunity_brief]
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-company-brief/brief.md
  sections:
    - What it does
    - Who it is for
    - How it works
    - What the agents run
    - The token in the product (only when capx-bind.json exists)
    - True today versus planned
  max_words: 900
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact in the brief traced to a local input. Five concrete steps and
  current versus planned claims are required; placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Company Brief

Original Casa procedure, distributed under MIT.

## Procedure

1. Read `company-brain/profile.json`, the opportunity-scan output, and local
   product evidence. Read `company-brain/capx-bind.json` when it exists.
2. Write `company-brain/outputs/phase0-company-brief/brief.md`, at most 900 words.
   Start with one summary paragraph, before any heading. Use the company name.
3. Use literal `## ` headings: `What it does`, `Who it is for`, `How it works`,
   `What the agents run`, and `True today versus planned`. Under `How it works`,
   give exactly five numbered steps from user input to a concrete result.
4. Name actual product objects, inputs, processing, storage, and outputs. State
   which jobs agents perform and where the founder acts. Cite local evidence
   paths for at least one number or fact; do not invent measurements.
5. Only when the bind file exists, add `## The token in the product`: identify
   its mint and symbol or ticker and explain its evidenced product use.
6. Separate implemented behavior from planned behavior and open questions.
   Reject interchangeable company copy and placeholders. Run copy-lint on the
   brief. Keep all work local and leave source inputs unchanged.

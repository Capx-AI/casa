---
id: phase0-roadmap
title: Phase 0 Roadmap
level: 0
summary: Turn the company brief into dated product and operating milestones.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
department: Strategy
criticality: core
existential_at: [idea]
selection_hint: Establish milestone ids and target months before the task plan.
depends_on: [phase0-company-brief]
soft_after: []
produces: [roadmap]
consumes: [company_brief]
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-roadmap/roadmap.json, roadmap.mmd, and README.md
  sections: [Milestone ids and outcomes, Target months and playbooks, Evidence and assumptions]
  max_words: 300
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact from the brief. JSON and timeline agree on dated task milestones;
  budgets, financial lines, and placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Roadmap

Original Casa procedure, distributed under MIT.

## Procedure

1. Read the company brief, `company-brain/state.json`, and the playbook catalog.
   Select concrete product and operating outcomes supported by the brief.
2. Write `company-brain/outputs/phase0-roadmap/roadmap.json` as an array. Each
   entry has a unique stable `id`, `title`, `target` in `YYYY-MM` form, `status`
   (`planned`, `in_progress`, or `done`), and a `playbooks` array of catalog ids.
3. Use task milestones only, with no budgets or financial lines. Explain target
   months as plans, not promises. Use completed state as evidence of completion.
4. Write `roadmap.mmd` beside it, first line `timeline`, matching the JSON's
   titles and target months. Mermaid source only, no fences, at most 20 KB.
5. Write `README.md`, at most 300 words, naming the company and tying the
   milestones to a fact or number from the brief. Record assumptions and scope.
6. Parse the JSON, verify unique ids and real playbook references, check the
   timeline syntax, and run copy-lint on all three files.

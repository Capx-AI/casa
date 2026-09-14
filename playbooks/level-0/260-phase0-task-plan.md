---
id: phase0-task-plan
title: Phase 0 Task Plan
level: 0
summary: Break the roadmap into a concrete 90-day list of company tasks.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
department: Operations
criticality: core
existential_at: [idea]
selection_hint: Bind actionable tasks to roadmap milestones and existing playbooks.
depends_on: [phase0-roadmap]
soft_after: [phase0-org-chart]
produces: [task_plan]
consumes: [roadmap]
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-task-plan/plan.json and README.md
  sections: [90-day task sequence, Milestone and playbook references, Evidence of completion]
  max_words: 300
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact from the brief. Every task references a real roadmap milestone;
  financial lines and placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Task Plan

Original Casa procedure, distributed under MIT.

## Procedure

1. Read `company-brain/outputs/phase0-roadmap/roadmap.json`, the company brief,
   the playbook catalog, and `company-brain/state.json`.
2. Select the next 90 days of tasks, each with an observable completion result.
   Order by dependency and timing. Keep budgets and financial lines out.
3. Write `company-brain/outputs/phase0-task-plan/plan.json` as an array. Each
   entry has a unique `id`, concrete `title`, `milestone` (a roadmap id),
   `playbook` (a matching catalog id or null), and `status` (`todo`, `doing`, `done`).
4. Map to playbooks wherever the task actually fits. Never invent catalog ids
   or claim a task done without evidence; the face derives done from state.
5. Write `README.md`, at most 300 words, with the company name, the 90-day date
   range, task ids grouped into days 1-30, 31-60, and 61-90, and one fact or
   number from the brief explaining the choices.
6. Parse the JSON and check all milestone and non-null playbook references.
   Check the sequence is achievable within the stated window and copy-lint both files.

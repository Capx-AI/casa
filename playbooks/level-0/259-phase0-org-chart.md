---
id: phase0-org-chart
title: Phase 0 Org Chart
level: 0
summary: Show the founder, company departments, and the Casa agents doing the work.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
department: Operations
criticality: core
existential_at: [idea]
selection_hint: Make the company's actual operator roster and mandates visible.
depends_on: [phase0-company-brief]
soft_after: []
produces: [org_chart]
consumes: [company_brief]
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-org-chart/org.mmd, agents.json, and README.md
  sections: [Founder and departments, Agent mandates and playbooks, Reporting and approvals]
  max_words: 300
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact from the brief. Agent names match the local roster and have specific
  mandates; invented operators and placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Org Chart

Original Casa procedure, distributed under MIT.

## Procedure

1. Read the company brief, `company-brain/profile.json`, and
   `company-brain/roster.json`. If missing, read the derived roster from
   `node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/roster.mjs company-brain`.
   Record this fallback without changing dials. Read the catalog's departments.
2. Write `company-brain/outputs/phase0-org-chart/org.mmd`, first line
   `flowchart TD`. Show the founder, roster departments, and their Casa agents.
   Use Mermaid source only, at most 20 KB, with no fences or preamble.
3. Write `agents.json` beside it as an array with `name`, `department`,
   `mandate` (one company-specific sentence), and `playbooks` (catalog ids).
   Use the exact operator names from the roster so ledger events can match.
4. Give each agent one record and a primary department; show shared reporting
   in the chart and README. Include actual product work in each mandate.
5. Write `README.md`, at most 300 words, naming the company, explaining founder
   approvals, and citing one fact or number from the brief. Label agents clearly.
6. Parse the JSON, cross-check names and reporting against the roster, verify
   Mermaid syntax, and run copy-lint on all three files.

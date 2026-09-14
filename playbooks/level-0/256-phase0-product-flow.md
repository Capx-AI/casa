---
id: phase0-product-flow
title: Phase 0 Product Flow
level: 0
summary: Show the primary user path and the agent handoffs that make it work.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
department: Product
criticality: core
existential_at: [idea]
selection_hint: Explain the main user journey from the company brief before collateral.
depends_on: [phase0-company-brief]
soft_after: []
produces: [product_flow]
consumes: [company_brief]
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-product-flow/flow.mmd and README.md
  sections: [User trigger and actors, Primary path and handoffs, Result and recovery]
  max_words: 300
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact from the brief. The path has a concrete trigger, actor handoffs,
  and observable result; placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Product Flow

Original Casa procedure, distributed under MIT.

## Procedure

1. Read `company-brain/outputs/phase0-company-brief/brief.md`. Choose the primary
   user's actual job and follow the brief's five steps.
2. Write `company-brain/outputs/phase0-product-flow/flow.mmd`, starting with
   `sequenceDiagram` or `journey` on the first line. Use Mermaid source only,
   without fences or a preamble, at most 20 KB.
3. Name the user, product surfaces, agent jobs, and system responses. Label
   handoffs with actual inputs and outputs, including any founder approval.
4. Show the user-visible result and one evidenced failure or recovery path.
   Distinguish planned behavior; do not imply unbuilt steps already run.
5. Write a companion `README.md`, at most 300 words, naming the company,
   explaining the selected path, and citing one fact or number from the brief.
6. Check that every actor and handoff matches the brief, verify Mermaid syntax,
   and run copy-lint on both files. Keep the result local for inline rendering.

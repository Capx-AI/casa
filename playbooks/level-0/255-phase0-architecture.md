---
id: phase0-architecture
title: Phase 0 Architecture
level: 0
summary: Map the company's product components, interfaces, and boundaries.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
department: Engineering
criticality: core
existential_at: [idea]
selection_hint: Turn the company brief into a technical system view before collateral.
depends_on: [phase0-company-brief]
soft_after: []
produces: [architecture_diagram]
consumes: [company_brief]
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-architecture/architecture.mmd and README.md
  sections: [System boundaries, Named components and interfaces, Current versus planned]
  max_words: 300
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact from the brief. Every box is named in the README and every edge
  describes an actual interaction; placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Architecture

Original Casa procedure, distributed under MIT.

## Procedure

1. Read `company-brain/outputs/phase0-company-brief/brief.md` and the local
   implementation evidence it cites. Trace the primary input to its output.
2. Write `company-brain/outputs/phase0-architecture/architecture.mmd` as Mermaid
   source only. Its first line must be `flowchart LR` or `C4Context`; no fences,
   frontmatter, or preamble. Keep the file at most 20 KB.
3. Name the company's actual clients, agents, services, stores, and external
   systems. Label interfaces and data movement, and show ownership boundaries.
   Use product-specific nouns instead of generic numbered components.
4. Write `README.md` beside it, at most 300 words, naming every box and its
   purpose. Include the company name and one fact or number from the brief.
5. Mark proposed components as planned. Check each edge against the brief and
   local implementation; resolve contradictions without inventing infrastructure.
6. Check the diagram syntax and run copy-lint on the source and README. Leave
   the diagram ready for the local website to render inline.

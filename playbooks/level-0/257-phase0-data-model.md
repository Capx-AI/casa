---
id: phase0-data-model
title: Phase 0 Data Model
level: 0
summary: Describe the product's entities, identifiers, and relationships.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
department: Engineering
criticality: core
existential_at: [idea]
selection_hint: Ground the data model in the architecture and its company brief.
depends_on: [phase0-architecture]
soft_after: []
produces: [data_model]
consumes: [architecture_diagram]
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-data-model/model.mmd and README.md
  sections: [Entities and identifiers, Relationships and cardinality, Storage and ownership]
  max_words: 300
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact from the brief. Entities map to the architecture, with keys and
  explicit cardinality; placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Data Model

Original Casa procedure, distributed under MIT.

## Procedure

1. Read the architecture source and README under
   `company-brain/outputs/phase0-architecture/` and the company brief.
2. Identify the real objects the primary path creates, reads, or changes.
   Follow local schema evidence when present; label proposed entities as planned.
3. Write `company-brain/outputs/phase0-data-model/model.mmd` with `erDiagram`
   as its first line. Use Mermaid source only, at most 20 KB, without fences.
4. Include each entity's primary identifier, essential fields, foreign keys,
   and relationship cardinality. Use product nouns and synthetic field names,
   never private user records or credentials.
5. Write `README.md` beside it, at most 300 words, stating the company name,
   where each entity lives, its owner, and one fact or number from the brief.
6. Check that relationships support the primary path and agree with the
   architecture. Verify Mermaid syntax and run copy-lint on both files.

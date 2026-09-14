---
id: phase0-token-flow
title: Phase 0 Token Flow
level: 0
summary: Show how the agent token and CAPX move through actual product actions.
applies_to: { types: ["*"], requires_traits: [has_token], excluded_traits: [] }
relevance: optional
department: Product
criticality: core
existential_at: [idea]
selection_hint: Use only for a company with the has_token trait and evidenced token use.
depends_on: [phase0-company-brief]
soft_after: []
produces: [token_flow]
consumes: [company_brief]
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: company-brain/outputs/phase0-token-flow/token-flow.mmd and README.md
  sections: [Product actions and actors, Agent token and CAPX movement, Current versus planned]
  max_words: 300
rubric: >-
  Passes only with the company name, the product's real nouns, and at least one
  number or fact from the brief. Agent token and CAPX edges name actors and product
  triggers; unsupported mechanisms and placeholder words such as TBD or lorem ipsum fail.
---
# Phase 0 Token Flow

Original Casa procedure, distributed under MIT.

## Procedure

1. Confirm `has_token` in the profile. Read the company brief and, when present,
   `company-brain/capx-bind.json`; use its actual mint and symbol or ticker.
2. Trace which product actions move the agent token and which move CAPX. Use
   local product evidence only. Record unknown mechanics as gaps in the README.
3. Write `company-brain/outputs/phase0-token-flow/token-flow.mmd`, first line
   `flowchart LR`. Label senders, receivers, token units, and the triggering
   product actions. Mermaid source only, no fences, at most 20 KB.
4. Separate implemented paths from planned paths. If either token has no
   evidenced movement, state that explicitly; do not invent transfers.
5. Write `README.md`, at most 300 words, naming the company, explaining each
   path, and tracing one fact or number to the brief. This play makes no transfers.
6. Check the first line and Mermaid syntax, reconcile token labels with local
   evidence, and run copy-lint on both files. Keep all work local.

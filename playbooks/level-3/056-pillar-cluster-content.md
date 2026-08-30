---
id: pillar-cluster-content
title: Pillar + Cluster Content
level: 3
summary: Architect a topical-authority network of pillar and cluster pages with full interlinking.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - local_service_only
relevance: recommended
department: Growth
criticality: growth
model_fit: [self_serve]
selection_hint: Use to build topical authority on a target domain. Run after keywords exist; produces the linkable long-form assets later channels and link-building depend on.
depends_on:
  - seo-keyword-research
soft_after:
  - content-calendar
produces:
  - long_form_content
  - topical_authority_map
consumes:
  - keyword_research
effort: L
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: topical-authority-built
---
# Pillar + Cluster Content

The pillar-cluster model is a delivery mechanism for topical authority, not the
source of it. The source is genuine, comprehensive, accurate coverage of a
knowledge domain, structured so search and AI answer engines can extract it.

## Procedure

1. Map the topic. Build a topical map from `keyword_research`: one broad pillar
   plus the full set of cluster subtopics, entities, and intents that complete it.
2. Run a gap analysis. Identify missing clusters versus competitor coverage and
   versus the topic's full semantic landscape.
3. Produce the pillar. A comprehensive page covering the broad topic, linking out
   to every cluster.
4. Produce clusters. Each cluster page covers one subtopic in depth and links back
   to the pillar (bidirectional).
5. Wire interlinking. Enforce 100% bidirectional pillar-cluster links; zero orphan
   pages.
6. Maintain. Refresh on a cadence; detect and remediate content decay.

## Cadence

Operate as a rolling program: add clusters over time and run periodic interlink
and decay audits.

## Output

`long_form_content` (pillar and cluster pages) and a `topical_authority_map` in
the company brain.

## Rules

- Comprehensiveness and accuracy beat structure. Cover the domain more completely
  than anyone else or do not publish.
- No orphan pages; every cluster links to and from its pillar.
- Structure for GEO: dense, citable, interlinked detail.

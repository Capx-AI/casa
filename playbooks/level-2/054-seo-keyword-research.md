---
id: seo-keyword-research
title: SEO Keyword Research
level: 2
summary: Analyze demand, difficulty, and intent to produce a prioritized content roadmap.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
model_fit: [self_serve]
selection_hint: Run before any content or SEO work. Foundation that every content and programmatic-SEO playbook consumes. Skip only if SEO is not a planned channel.
action: "Mine customer tickets and reviews for seed keywords, then cluster and prioritize a roadmap of 50 topics by ROI."
depends_on: []
soft_after:
  - positioning-canvas
produces:
  - keyword_research
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: content-foundation
---
# SEO Keyword Research

Keyword research is demand mining mapped to business value. Find the language the
audience actually uses, enrich it with difficulty and intent, then rank clusters
by ROI relative to the site's authority.

## Procedure

1. Generate seeds. Mine customer data, support tickets, reviews, and community
   posts for the audience's real phrasing. Run a competitor content-gap analysis.
2. Expand and enrich. Pull broad/phrase/related terms and People-Also-Ask
   questions; attach volume, keyword difficulty (KD), CPC, and traffic potential.
   Flag zero-volume long-tail terms with clear commercial intent.
3. Classify intent and cluster. Use SERP-overlap (shared top-10 URLs) to group
   terms into one-page-per-cluster sets. Map dominant intent to a content format
   (informational guide, comparison, transactional landing).
4. Prioritize by ROI. Tier 1 = high value, high potential, KD <= site DA. Tier 2
   = bottom-of-funnel quick wins. Tier 3 = high-potential authority plays. Discard
   vanity-volume terms with no business relevance.
5. Produce the roadmap. 50-100 clustered topics with intent, format, and tier.

## Output

`keyword_research`: a prioritized, intent-clustered topic roadmap with briefs,
written to the company brain.

## Rules

- Never target keyword difficulty above the site's domain authority without a
  link-building plan attached.
- Intent drives format. Do not assign a blog post to a transactional cluster.
- Tag confidence; if an API source is unavailable, say so rather than fabricate
  volumes.

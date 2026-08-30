---
id: long-form-blog-post
title: Long-form Blog Post
level: 3
summary: Produce SEO-optimized long-form posts that beat the best ranking result on the target keyword.
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
selection_hint: The primary organic acquisition unit. Run per keyword cluster once research exists; produces the linkable assets link-building later needs.
action: "Pick one keyword cluster and draft a single long-form post that beats the top-ranking result on at least three dimensions."
depends_on:
  - seo-keyword-research
soft_after:
  - pillar-cluster-content
  - tone-of-voice-guide
produces:
  - long_form_content
consumes:
  - keyword_research
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: content-engine-live
---
# Long-form Blog Post

End-to-end creation of long-form posts (1,500-10,000+ words) that target a keyword
cluster, satisfy a clear search intent, and meet the 10x standard: meaningfully
better than the top-ranking result on depth, accuracy, originality, readability,
visuals, or actionability.

## Procedure

1. Confirm the trigger. A cluster with volume >= 500, KD <= 60, and business value
   >= 2; or a competitor gap; or a cluster-map hole; or decay on an existing post.
2. Brief. Lock intent, target cluster, outline, internal links, and the unique
   angle (data, perspective, case study) that makes it 10x.
3. Draft. Lead with reader value; weave the product in naturally where it is the
   real solution. Short paragraphs, scannable headings.
4. Add proof. Cite every factual claim; include original data, expert quotes, and
   diagrams that clarify.
5. Optimize and publish. On-page SEO, internal links to and from the pillar, meta,
   schema. Publish to the CMS.
6. Track decay. Re-enter the loop when traffic drops >= 20% over a rolling period.

## Cadence

Runs continuously; multiple posts in parallel against the calendar's queue.

## Output

`long_form_content` published to the CMS and logged in the company brain.

## Rules

- Word count is not the bar; being better than every competitor on three+
  dimensions is.
- No unsourced statistics. No outdated data.
- Not for news, changelogs, or programmatic pages (see 058).

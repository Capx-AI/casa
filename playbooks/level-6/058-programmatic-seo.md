---
id: programmatic-seo
title: Programmatic SEO
level: 6
summary: Generate landing pages at scale from a template plus a unique structured dataset, with QA guardrails.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_pmf
    - local_service_only
    - high_acv
relevance: conditional
department: Growth
criticality: growth
model_fit: [self_serve]
selection_hint: Only when a keyword pattern has aggregate volume and a unique dataset can populate 100+ genuinely distinct pages. Scale only post-PMF; thin pages at scale risk sitewide deindexation.
depends_on:
  - seo-keyword-research
soft_after:
  - technical-seo-audit
produces:
  - programmatic_pages
consumes:
  - keyword_research
effort: L
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: scaled-organic
---
# Programmatic SEO

pSEO treats content like software: define a template, populate it with structured
data, render thousands of distinct pages. The automation is the delivery
mechanism; the value is the data and the design.

## Procedure

1. Qualify the pattern. Require aggregate MSV >= 5,000, >= 3 unique data points per
   page, a product that maps to the intent, a domain >= 3 months old with no manual
   action, and infra that can serve the page count.
2. Reject disqualifiers. Fewer than 50 viable variations, single-competitor-scraped
   data, near-identical pages, pre-PMF products, or patterns dominated by AI
   Overviews.
3. Source and structure data. Build a unique, reliable dataset.
4. Design the template. Genuinely satisfy intent; include unique value per page,
   not a swapped keyword.
5. Implement. Crawlable, fast, indexable rendering; sitemaps; internal links.
6. QA and guard. Block thin pages (<300 unique words); stage indexation in batches;
   monitor coverage and decay; keep a deindexation recovery protocol ready.

## Output

`programmatic_pages` published, with a monitoring dashboard in the company brain.

## Rules

- Never scale pre-PMF. Thin content at scale triggers scaled-content-abuse and
  helpful-content penalties.
- Human gate before mass publish: irreversible reputation risk.
- Differentiated data per page is mandatory, not optional.

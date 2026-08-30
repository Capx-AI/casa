---
id: technical-seo-audit
title: Technical SEO Audit
level: 3
summary: Forensic audit of crawl, indexation, Core Web Vitals, and schema into a prioritized fix backlog.
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
selection_hint: Run quarterly, after migrations, after core updates, or on a traffic drop. Keeps the site crawlable and indexable so content and programmatic SEO can rank.
depends_on: []
soft_after:
  - hosting-deployment-setup
produces:
  - technical_seo_audit
  - seo_remediation_backlog
consumes: []
effort: M
leverage: med
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: content-engine-live
---
# Technical SEO Audit

A forensic investigation into the gap between what a site intends to tell search
engines and what they actually perceive. Findings feed one prioritized backlog
scored by traffic impact and effort.

## Procedure

1. Pre-flight. Confirm HTTPS with 301s, an accessible robots.txt and XML sitemap
   (200), and live Google Search Console data. Halt and flag on a critical block.
2. Core Web Vitals. Read CrUX field data at the 75th percentile for LCP, INP, CLS;
   corroborate with PageSpeed lab data.
3. Crawl and logs. Inventory URLs with a crawler; analyze 30 days of server logs
   for crawl-budget waste and orphan pages.
4. Indexation and rendering. Check coverage, canonical and noindex correctness,
   and JavaScript-rendered content visibility.
5. Schema and E-E-A-T. Validate structured data and surface content-quality and
   authorship signal gaps.
6. Score and assign. Tier findings P0-P3 by estimated impact and effort; assign
   owners.

## Cadence

Every 90 days, plus event triggers (migration, core update, >15% drop over 14
days).

## Output

`technical_seo_audit` and a tiered `seo_remediation_backlog` in the company brain.

## Rules

- Deterministic conditionals, not "review carefully": specify the check and what
  to flag.
- A P0 (indexation-blocking) finding escalates before any further content spend.

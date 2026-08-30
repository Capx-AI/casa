---
id: landing-page-cro
title: Landing Page CRO
level: 3
summary: "Run research-driven conversion optimization on landing pages: diagnose friction, form hypotheses, test, and compound wins."
applies_to:
  types:
    - "*"
  requires_traits:
    - has_website
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
model_fit: [self_serve]
selection_hint: "Run on a live page with traffic or qualitative signal. The pre-flight gate for paid: scaling spend onto an unoptimized page wastes budget."
depends_on: []
soft_after:
  - analytics-stack-setup
  - pricing-page-copy-layout
produces:
  - optimized_landing_page
consumes:
  - analytics_stack
  - positioning
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: conversion-baseline
---
# Landing Page CRO

CRO turns landing pages from static assets into continuously improving conversion
engines. The goal is not a silver-bullet redesign but a high-velocity experimentation
flywheel: throughput, not individual test perfection (Booking.com runs 25,000+ tests
a year, 10 to 20% positive). Every change is hypothesis-driven and statistically defensible.

## Procedure

1. Trigger on a quantitative or strategic signal (CVR below benchmark, new campaign,
   positioning pivot, rage clicks). Require roughly 1,000+ unique visitors/month for a
   full program; below that, use qualitative methods.
2. Run conversion research (ResearchXL): heuristic walkthrough, technical/Core Web
   Vitals check, analytics drop-off analysis, session replays and heatmaps, on-site
   surveys, and task-based user testing.
3. Diagnose with the LIFT model: strengthen value prop, relevance, clarity, urgency;
   remove anxiety and distraction. Score motivation and friction (MECLABS heuristic).
4. Write structured hypotheses, prioritize by expected impact and effort, and queue experiments.
5. Run A/B tests at correct sample size and statistical confidence; ship winners,
   document losers, and feed learnings into the next batch.

## Output

`optimized_landing_page`: a measured CVR baseline plus a running experiment queue and
a log of shipped wins and learnings, recorded in the company brain.

## Rules

- Recurring. Operate continuously with a 30-day review cycle; never one-and-done.
- Enforce message match. A page CVR below benchmark for paid sources is usually an
  ad-to-page relevance gap, not a design problem.
- No test called before statistical confidence; a 3-day spike is a false positive.

This is the conversion foundation that paid acquisition and retargeting (071) build
on; warm it before scaling spend. Full frameworks and statistical thresholds in the
source draft above. Condense, do not pad.

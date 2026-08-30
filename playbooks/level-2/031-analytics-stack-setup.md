---
id: analytics-stack-setup
title: Analytics Stack Setup
level: 2
summary: "Stand up a layered analytics stack: capture once, one warehouse, one canonical metric definition."
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Engineering
criticality: core
selection_hint: The sensory apparatus of the business. Every downstream metric, funnel, cohort, and dashboard depends on it. Set up in week one to avoid an 18-month rebuild.
action: "Stand up a single event pipeline to one warehouse and a version-controlled metrics layer with exactly one definition per metric."
depends_on: []
soft_after:
  - hosting-deployment-setup
produces:
  - analytics_stack
consumes: []
effort: L
leverage: critical
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: analytics-instrumented
deliverable:
  artifact: An analytics stack with instrumented capture, a single warehouse, and a version-controlled metrics layer, written to the company brain.
  sections:
    - Business and technical context
    - Selected implementation path
    - Single event pipeline to the warehouse
    - Version-controlled metrics layer with one definition per metric
    - Privacy and consent built in
  max_words: 900
rubric: Passes only when every user action is captured once at the source and routed from a single canonical stream with no tool storing its own copy, every metric has exactly one authoritative definition in version control, and privacy and consent are built in from day one rather than retrofitted.
---
# Analytics Stack Setup

Build a coherent, layered analytics architecture so agents do not navigate blind.
Capture every user action once at the source and route it to all consumers from a
single canonical stream. Defeat tracking drift and the single-source-of-truth
failure before they compound.

## Procedure

1. Gather business and technical context: model type, stage, team size, markets,
   regulatory environment, tech stack, engineering bandwidth, budget. Query the
   relevant function agent for any missing input.
2. Select an implementation path: Greenfield, Scale-Up (warehouse-native past ~10k
   MAU or 5+ reporters), Audit-and-Rebuild (when two tools disagree by >15%),
   Privacy-First retrofit (EU/CCPA), or Stack Rationalization.
3. Stand up the stack: a single event pipeline to the warehouse, product-analytics
   tools as query interfaces (not separate stores), and a version-controlled
   metrics layer where each metric has one authoritative definition.
4. Build privacy and consent in from day one (server-side tracking, consent
   management) rather than bolting it on after an incident.

## Output

`analytics_stack`: instrumented capture, the warehouse, and the metrics layer.
This is the producer for the entire analytics chain. Unblocks event-taxonomy (032),
NSM (033), funnel (034), cohort (035), attribution (036), CEO dashboard (037), GA4
reading (038), Mixpanel reading (039), and WBR (040).

## Rules

- Capture once, report everywhere. Tools that each store their own copy guarantee
  the reconciliation argument that wastes every cross-functional meeting.
- Every metric has exactly one definition, in code, version-controlled.
- Mature variant (Path B): when MAU exceeds ~10k or the team grows past 5
  reporters, escalate to a warehouse-native architecture; do not create a new file.

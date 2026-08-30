---
id: content-calendar
title: Content Calendar
level: 3
summary: Plan and operate an editorial calendar with briefs, cadence, distribution, and tracking.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: recommended
department: Growth
criticality: growth
model_fit: [self_serve]
selection_hint: The operating engine for content. Install once keywords and personas exist; then run continuously to plan, brief, publish, and refresh.
action: "Build a four-week editorial calendar from your keyword research, giving each item a brief and a distribution plan before creation."
depends_on:
  - seo-keyword-research
soft_after:
  - tone-of-voice-guide
  - positioning-canvas
produces:
  - content_calendar
  - content_briefs
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
# Content Calendar

The calendar is the central nervous system of the content operation, not just a
schedule. Every piece has a distribution plan before it is created.

## Procedure

1. Ideate. Generate topics from `keyword_research`, customer pain points, and
   content gaps. Organize into pillars and clusters.
2. Brief. Produce an SEO content brief per item: intent, target cluster,
   structure, internal links, and word-count target.
3. Assign and create. Route briefs to writers (human or agent); manage WIP.
4. Review. Check quality bar, brand voice, and SEO requirements before publish.
5. Publish and distribute. Schedule to the cadence; execute the "create once,
   distribute forever" plan across email and social.
6. Measure and refresh. Track against KPIs; trigger a historical-optimization
   refresh when a high-potential post decays.

## Cadence

Operate weekly: plan the upcoming queue, ship scheduled items, and run a monthly
performance review that reprioritizes the backlog and flags refresh candidates.

## Decision logic

- Pre-PMF: founder-led, high-intent, validation-first content.
- Post-PMF: scale across the funnel, balancing evergreen SEO and thought
  leadership.
- B2B leans guides, case studies, ROI; B2C leans visual, digestible, brand-led.

## Output

`content_calendar` and a stream of `content_briefs` in the company brain.

## Rules

- No item enters the calendar without a distribution plan.
- Velocity never beats quality; thin volume invites a helpful-content penalty.

Mature variant (post-PMF) scales production and adds historical-refresh loops.

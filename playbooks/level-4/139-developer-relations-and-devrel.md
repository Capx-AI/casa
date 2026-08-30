---
id: developer-relations-and-devrel
title: Developer Relations and DevRel
level: 4
summary: "Run the developer-relations motion that earns a bottom-up tool its audience: talks, tutorials, sample apps, and advocacy, with the activation and adoption impact actually measured."
applies_to:
  types:
    - saas
  requires_traits:
    - technical_audience
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Growth
criticality: growth
existential_at: []
model_fit: [self_serve]
selection_hint: The primary acquisition engine for a developer tool, where engineers trust other engineers over ads. Run once docs and a real quickstart exist; measure devrel by activated developers, not vanity reach.
depends_on:
  - developer-docs-and-dx
soft_after:
  - positioning-canvas
produces:
  - devrel_motion
consumes:
  - dev_docs
  - positioning
effort: L
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: devrel-engine-running
---
# Developer Relations and DevRel

RECURRING. Developers do not respond to ads, they respond to other engineers
showing them something that works. DevRel is the acquisition engine for a
bottom-up tool: conference talks, deep technical tutorials, sample apps they can
clone and run, livestreams, and showing up credibly in the communities where your
users already are. The trap is measuring DevRel by reach (followers, views,
event count) when the only thing that matters is activated developers, engineers
who went from seeing your content to a successful call to building something
real. Build the content engine and the measurement together, or you will spend a
year on stages with nothing to show.

## Procedure

1. Map where your developers actually live. From the positioning artifact, list
   the specific conferences, meetups, subreddits, Discords, Hacker News, and
   newsletters your ICP reads, ranked by density of real users, not by audience
   size. Reaching 200 of exactly the right engineers beats 20,000 randoms.
2. Build the content ladder, each rung deeper than the last. Short technical
   posts and snippets (top of funnel) -> deep how-to tutorials that solve a real
   problem end to end -> clonable sample apps and reference architectures (a repo
   they `git clone` and run in minutes) -> conference talks and livestreams (the
   trust-builder). Every piece links back to the quickstart from the docs so reach
   converts to activation.
3. Make sample apps the centerpiece. A working, well-documented example
   repository that solves a complete real use case is the highest-converting
   DevRel asset, because it lets a developer see your tool in production shape and
   fork it. Maintain them in CI against the live SDKs so they never break.
4. Run the talk and event motion deliberately. Submit to CFPs with talks that
   teach a hard problem and feature your tool incidentally rather than pitching
   it; sponsor or attend the high-density meetups; do office-hours streams. The
   goal of every appearance is a measurable spike in quickstart starts, not
   applause.
5. Instrument DevRel against activation. Use per-asset UTM and tracking links into
   the docs funnel, tie content to first-successful-call (the API activation
   event) and to signups, and report devrel-influenced activated developers per
   piece and per channel. Kill channels that generate reach but no activation;
   double down on the few that convert.
6. Set a sustainable publishing cadence and a content calendar tied to product
   milestones (releases, new SDKs, new capabilities). Recycle one deep tutorial
   into a talk, a thread, and a sample app rather than starting from zero each
   time.

## Output

`devrel_motion` in the company brain: the ranked channel map, the content ladder
with the sample-app repos as its centerpiece, the talk/event pipeline, and the
activation instrumentation that reports devrel-influenced activated developers per
asset and channel. Cadence: publish on the standing calendar, review activation-
per-channel monthly, and reallocate effort to what converts. This feeds the
developer community (content seeds discussion) and the PLG-to-sales handoff
(activated developers become the accounts sales watches).

## Rules

- Measure activated developers, not reach. Views and followers are vanity; a
  first-successful-call traced to a piece of content is the unit that matters.
- Teach, do not pitch. Engineers trust content that makes them better at their
  job and tune out content that sells. The tool features incidentally.
- Sample apps over slideware. A clonable repo that runs in minutes converts far
  better than any talk; invest there first.

This is a recurring engine. Each cycle, publish on the calendar, cut the channels
that generate reach without activation, and reinvest in the few that produce real
activated developers.

---
id: developer-docs-and-dx
title: Developer Docs and DX
level: 3
summary: "Build the docs that are the real top of funnel for a developer tool: a sub-five-minute quickstart, runnable examples, complete reference, and a measured time-to-first-value funnel."
applies_to:
  types:
    - saas
  requires_traits:
    - technical_audience
  excluded_traits:
    - pre_idea_only
relevance: core
department: Product
criticality: core
existential_at: [launched, revenue]
model_fit: [self_serve]
selection_hint: For a developer tool, docs are the product surface where adoption is won or lost. Run once the API contract exists; treat docs as a living funnel, not a one-time deliverable.
depends_on:
  - api-and-sdk-design
soft_after:
  - tech-stack-selection
produces:
  - dev_docs
consumes:
  - api_design
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: quickstart-live
---
# Developer Docs and DX

RECURRING. For a bottom-up developer tool the docs are not support material, they
are the top of the funnel. An engineer evaluates you by skimming the quickstart
and trying to get a real call working before they will sign up, talk to anyone,
or read your pricing. Time-to-first-value (TTFV) on the docs page is the single
lever that decides adoption: if a developer cannot get a working result inside
five minutes, they close the tab and never return. Docs are also never finished,
because every API change, new SDK, and recurring support question is a docs gap.
Treat this as a standing cadence, not a launch task.

## Procedure

1. Build the quickstart for the impatient. One page, copy-paste, working result
   in under five minutes: install/auth, the single most valuable call, and a real
   response. No prerequisites beyond a key, no architecture lecture before the
   first success. The test-mode key from the API design feeds straight in. This
   page is your most important marketing asset.
2. Make every example runnable, not illustrative. Code samples are tested in CI
   (doc-tests or a snippets harness) against the live SDKs so they never rot.
   Show samples in every SDK language with a language switcher, default to the
   ergonomic SDK call (not raw curl), and include the full surrounding context a
   reader can paste, not a fragment.
3. Layer the docs by intent using the Diataxis frame: tutorials (learning,
   hand-held), how-to guides (a specific task), reference (complete and dry), and
   explanation (the why and the mental model). A developer in a hurry needs how-to
   and reference; a developer adopting deeply needs tutorials and explanation. Do
   not blur them into one wall of prose.
4. Generate the reference from the OpenAPI/protobuf source of truth so endpoints,
   fields, types, and errors never drift from the API. Every endpoint shows auth,
   parameters, a request example, every response and error code, and rate limits.
   Stale reference is worse than no reference because it costs trust.
5. Instrument the time-to-first-value funnel. Track docs-landing -> quickstart-
   started -> first-successful-call (the API event) -> account-created, and find
   the step with the steepest drop. Add an API explorer or an in-docs sandbox at
   the friction point so a developer can fire a real call without leaving the
   page.
6. Close the loop on support questions. Mine the developer community and support
   inbox for the top recurring questions and turn each into a how-to or an FAQ
   entry; a repeated question is a docs defect. Keep a migration guide current for
   every deprecated API version per the versioning contract.

## Output

`dev_docs` in the company brain: the live quickstart with measured TTFV, the
CI-tested runnable examples across SDK languages, the Diataxis-structured docs
site (tutorials, how-to, reference, explanation), the generated API reference, and
the instrumented time-to-first-value funnel with its current drop-off point.
Cadence: review the TTFV funnel monthly and on every API change; turn the top
support questions into docs each cycle. This artifact feeds devrel (tutorials and
sample apps build on it) and is the surface adoption is won on.

## Rules

- The quickstart is sacred: working result in under five minutes or it is broken.
  Optimize it before anything else on the docs site.
- Examples are tested in CI. A code sample that does not run is a bug that costs
  you the developer at the worst possible moment.
- Reference is generated from the API source of truth, never hand-maintained.
  Drift between docs and behavior is a trust failure.

This is a living funnel. Each cycle, fix the steepest drop in the TTFV path and
convert the top recurring support questions into docs, rather than treating the
site as a finished artifact.

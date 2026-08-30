---
id: jobs-to-be-done-extraction
title: Jobs-to-be-Done Extraction
level: 0
summary: Extract functional, emotional, and social jobs from interviews and reviews into a scored JTBD matrix.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: recommended
department: Strategy
criticality: core
selection_hint: Run when interview data or a review corpus exists. Feeds positioning, roadmap, and the competitive teardown. Needs source material to be useful.
depends_on: []
soft_after:
  - opportunity-scan
produces:
  - jtbd
consumes:
  - problem_evidence
  - opportunity_brief
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: validated-opportunity
---
# Jobs-to-be-Done Extraction

People do not buy products, they hire them to make progress in a circumstance.
Extract the jobs that drive switching, then score them. The job, not the
demographic, is what predicts durable fit.

## Procedure

1. Gather source material: interview transcripts, customer reviews, forum threads
   in the target space.
2. For each signal extract three job layers: functional ("get X done"), emotional
   ("feel Y"), social ("be seen as Z").
3. Reconstruct switch moments. Map the four forces (push, pull, anxiety, habit);
   for validation, weight the push force (what is so broken they are leaving).
4. Score each job on importance and current satisfaction. Underserved jobs (high
   importance, low satisfaction) are the opportunity. Build the JTBD matrix.

## Output

`jtbd` (scored functional, emotional, social jobs with verbatim evidence),
written to the company brain. Feeds positioning, roadmap, and competitive analysis.

## Rules

- A job is not valid without verbatim evidence; no inferred jobs.
- Functional-only matrices miss the strongest purchase drivers. Always capture
  emotional and social layers.

---
id: problem-validation-interviews
title: Problem Validation Interviews
level: 0
summary: Run Mom-Test discovery with 10-30 targets to confirm a real, urgent, monetizable problem before any code.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Strategy
criticality: existential
selection_hint: Run before building anything. Confirms the problem is real and urgent, not just plausible. Skip only if a strong review corpus already substitutes.
action: "Recruit and run 10 Mom-Test interviews, asking about past behavior, until 7 confirm the problem unprompted with active workarounds."
depends_on: []
soft_after:
  - opportunity-scan
produces:
  - problem_evidence
  - refined_icp
  - problem_validation_decision
consumes:
  - opportunity_brief
  - candidate_niches
effort: L
leverage: critical
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: validated-opportunity
deliverable:
  artifact: A problem-validation report with a tagged quote bank and a Go/No-Go/Pivot decision, written to the company brain.
  sections:
    - Falsifiable hypothesis and ranked assumptions
    - ICP and interviews completed
    - Tagged verbatim quotes and observed workarounds
    - Synthesis to saturation
    - Go/No-Go/Pivot decision with scored rationale
    - Refined ICP
  max_words: 1500
rubric: Passes only with at least 7 of 10 interviews confirming the problem unprompted and 5 or more participants showing active workarounds, every claim backed by tagged verbatim quotes rather than hypothetical intent answers, ending in a scored Go/No-Go/Pivot decision and a refined ICP.
---
# Problem Validation Interviews

Confirm a real, urgent, monetizable problem exists before writing code. Validate
the problem, not the solution. The most expensive startup mistake is building
something nobody pays for.

## Procedure

1. Formalize a falsifiable hypothesis: "We believe [role] at [company type]
   experiences [problem] when [context], causing [outcome], and addresses it today
   with [workaround]." Rank the top five assumptions to test.
2. Define and recruit the ICP. Target 10-30 participants who match the profile.
3. Run Mom-Test interviews. Talk about their life, not your idea. Ask about
   specific past behavior, never hypotheticals. Listen more than you speak. Never
   describe the product.
4. Capture verbatim quotes and tag each by theme. Look for existing workarounds
   (the strongest signal the pain is real).
5. Synthesize to meaning saturation. Issue a Go / No-Go / Pivot decision with a
   scored rationale and a refined ICP.

## Output

`problem_evidence` (synthesis report plus quote bank), `refined_icp`, and a
`problem_validation_decision`, written to the company brain.

## Rules

- Validation requires at least 7 of 10 interviews confirming the problem
  unprompted or with minimal probing, and 5+ participants with active workarounds.
- Fewer than 5 completed interviews, or only weak polite-agreement signals, is a
  failed run, not a pass. Reject hypothetical "would you use" answers as evidence.
- No fabrication. If recruiting stalls, say so and ask the founder.

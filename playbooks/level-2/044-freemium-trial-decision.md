---
id: freemium-trial-decision
title: Freemium / Trial Decision
level: 2
summary: Choose free, time-boxed trial, freemium, reverse-trial, or paid-only, validated against unit economics and the growth loop.
applies_to:
  types:
    - saas
    - consumer
    - content
    - crypto
    - marketplace
  requires_traits:
    - builds_software
    - takes_payments
  excluded_traits: []
relevance: core
department: Finance
criticality: core
model_fit: [self_serve]
selection_hint: Run after pricing research, before launch. Decides the shape of the acquisition funnel. Most relevant to self-serve software; less so to high-touch services.
action: "Model the cost to serve one free user against gross margin, then pick free-trial, freemium, or paid-only with rationale."
depends_on:
  - pricing-research
soft_after:
  - packaging-tier-design
produces:
  - pricing_model
consumes:
  - pricing_research
  - unit_economics
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: pricing-direction-set
---
# Freemium / Trial Decision

The highest-leverage product decision before the first thousand customers. It sets
CAC, LTV, activation, viral coefficient, and the shape of the growth loop. Treat
freemium as a marketing strategy, not a monetization strategy: ask what the
distribution channel costs and whether it beats alternatives.

## Procedure

1. Gather inputs: gross margin, TAM, viral-loop data, cost to serve a free user,
   competitor model, PMF assessment.
2. Define the candidates precisely. Free trial is time-bounded; freemium is
   feature-bounded; reverse trial starts on the paid tier then downgrades; paid-only
   maximizes WTP signal with the smallest funnel.
3. Run the decision framework on the inputs. Key gates: can gross margin absorb free
   users (cost to serve under ~20% of COGS), is there a viral loop, is time-to-value
   short enough for a trial to convert.
4. Stress-test with unit economics: opt-in trial widens the funnel but converts
   lower; opt-out (card required) narrows it but converts much higher; freemium is
   the widest funnel and the lowest conversion.
5. Document the selected model with rationale and the packaging implications.

## Output

`pricing_model`: the chosen monetization model with the unit-economics justification
and the packaging spec implications, written to the company brain.

## Rules

- Do not conflate free trial and freemium; the failure modes differ.
- Do not adopt freemium if serving free users would consume more than ~20% of COGS
  without a clear conversion path.
- Re-evaluate on a competitive model shift or post-PMF, not on a whim.

Full model profiles, viability tests, and case studies in the source draft above.
Condense, do not pad.

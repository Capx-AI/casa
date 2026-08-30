---
name: casa-validate
description: The validation gate. Turns a business idea into a validation kit and a GO or KILL verdict by running the validation playbooks. Use when validating an idea before committing to build a company.
---

# casa-validate

The wedge. Prove there is real demand before anyone builds anything. This is the
validation gate every new idea passes through, and its verdict personalizes
everything after it.

If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
first and stop. (casa-start invokes this gate itself for an idea-stage company.)

## What it runs (the validation playbooks)

In dependency order (see each playbook's frontmatter under `playbooks/level-0/`):

1. opportunity-scan (001): mine communities, reviews, search, trends for evidence
   of demand. Parallel-safe with 003, 004.
2. problem-validation-interviews (002): Mom-Test discovery; problem evidence memo.
3. competitive-teardown (003): map competitors, pricing, gaps.
4. market-sizing-tam-sam-som (004): top-down and bottom-up; kill if the reachable
   market is below threshold.
5. jobs-to-be-done-extraction (005): functional, emotional, social jobs.
6. red-team-thesis (006): steelman why this fails; set explicit kill criteria.
7. why-now-memo (007): the timing thesis.
8. mvp-scoping (018): the thin slice to build, with explicit non-goals.

On a GO verdict, beachhead-selection (008, the first play of the next level) picks
the narrowest wedge with the most compounding.

## Output

- A validation kit written to `company-brain/` (evidence, sizing, beachhead, MVP
  scope).
- A GO or KILL verdict against the red-team kill criteria.
- On GO, a confirmed business profile (type, traits, ICP, monetization) for the
  router.

## Rules

- Evidence required. An opportunity is not valid until at least three independent
  signals from at least two channels support it. State confidence on every claim.
- No fabrication. If a required input (an API, a real interview) is missing, say
  so and ask the founder rather than inventing data.
- The landing-page demand test and live waitlist are part of this wedge but
  involve a real deploy and possibly paid actions; route those through explicit
  founder approval. For now, produce the kit and the verdict.
- No em-dashes, no emojis.

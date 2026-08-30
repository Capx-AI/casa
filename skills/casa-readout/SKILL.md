---
name: casa-readout
description: Read the company's real numbers honestly. Ingests metrics (pasted, or pulled from an analytics source the founder has connected), computes the meaningful changes, and produces a what changed, why, and what to do reading that resists vanity-metric storytelling. Use for a weekly or monthly metrics review, a funnel or cohort read, or a financial close.
---

# casa-readout

The metrics-reading craft. Founders flatter their own numbers; this reads them
straight. Pairs with the analyst-honesty review persona.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Gather the numbers. Take the metrics the founder pastes, or pull them from an
   analytics or billing source they have connected via MCP (integrate, do not vendor;
   never bundle a closed analytics tool). Read the relevant playbook
   (`weekly-business-review`, `funnel-analysis`, `cohort-retention-analysis`,
   `unit-economics`) and the prior readout in `company-brain/` if one exists.

2. Establish the honest frame. Fix the comparison window and the denominator before
   reading any change. State the base for every rate. Use the actionable metric
   (active, retained, paying, contribution margin), not the cumulative total.

3. Read what changed. For each key metric: the value, the change versus a fair prior
   window, and whether the change is signal or noise given the volume. Flag any metric
   that moved without its guardrail being checked.

4. Explain why, with humility. Offer the most likely cause, and say plainly when a
   change is unattributed. Do not credit an action without a control or a plausible
   mechanism.

5. Decide. End with one or two actions the numbers actually justify, and what you
   would watch next.

6. Honesty check and record. Run `casa-review` so the `analyst-honesty` persona checks
   for vanity metrics, cherry-picked windows, and missing denominators. Address P0 and
   P1 findings. Save the readout to `company-brain/` (and if it is a recurring pulse,
   stamp the loop via `casa-loops`).

## Rules

- Behavior and money over vanity. Totals and impressions are not a reading.
- Every rate states its denominator. Every trend states its window.
- No causal claim without a control or a mechanism.
- No em-dashes, no emojis in the readout.

---
name: casa-experiment
description: Frame and run a growth, pricing, or product experiment with discipline: a hypothesis, one primary metric, a guardrail, a ship plan, and a read. Logs every experiment to an append-only ledger in the company brain so results compound. Use when designing an A/B test, a growth loop, a pricing change, or any deliberate bet you want to learn from.
---

# casa-experiment

The experiment craft. Turns a vague "let us try X" into a falsifiable bet with a metric
and a guardrail, and keeps a durable record so the company stops re-running losers.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Frame the hypothesis. State it as: if we do X, then primary metric M moves by
   roughly E, because of mechanism C. A hypothesis with no mechanism is a guess.

2. Define the read before you ship. Fix the one primary metric, the guardrail metric
   that must not break, the audience and the window, and the decision rule (what
   result means ship, kill, or iterate). Check `company-brain/experiments.jsonl` and
   `learnings.jsonl` so you are not re-running something already settled.

3. Log it at the start. Record the experiment in the ledger:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs experiment company-brain \
     '{"id":"<slug>","hypothesis":"...","primary_metric":"...","guardrail":"...","window":"...","status":"running"}'
   ```

4. Ship it. Execute the change (route any paid action to explicit founder
   approval, any UI to `casa-design`, any copy to `casa-write`). Respect human gates.

5. Read it honestly. When the window closes, read the result with `casa-readout` so the
   `analyst-honesty` persona checks the window, the denominator, and the guardrail. Do
   not credit the change without the mechanism holding up.

6. Close the loop. Log the outcome (`status` won, lost, or inconclusive, plus the
   number and the learning) back to the ledger, and run `casa-compound` so the lesson
   is reusable.

## Rules

- No experiment without a primary metric and a guardrail defined before shipping.
- Every experiment is logged to the ledger, win or lose. The losses are the most
  valuable record.
- No causal claim without the mechanism and a fair read.
- No em-dashes, no emojis.

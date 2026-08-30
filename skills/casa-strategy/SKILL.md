---
name: casa-strategy
description: Create and maintain the company's durable strategy anchor: the target problem, the customer, the wedge and approach, the key metrics, and the current tracks of work. Written to company-brain/STRATEGY.md and read as grounding by every other casa skill. Use when starting, when direction changes, or when the user asks what are we really building.
---

# casa-strategy

The anchor. One durable document that every other skill reads for grounding, so the
build map, the next action, and the copy all pull in the same direction. Sharp
questions, with pushback on weak answers.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Read what exists. Load `company-brain/STRATEGY.md` if present, plus
   `profile.json`, the latest `decisions/`, and `build-map.json`. If STRATEGY.md
   exists, you are updating it, not starting over.

2. Elicit or confirm, one sharp question at a time. Push back on vague answers.
   - Target problem: the specific pain, for a specific customer, stated in their
     terms. Not a market, a problem.
   - Customer: who has this pain most acutely and will pay first (the beachhead).
   - Approach and wedge: the narrow first thing that earns the right to the rest. Why
     this wedge, why now.
   - Key metrics: the one or two numbers that prove this is working (and the guardrail
     that would prove it is not).
   - Tracks: the two to four current lines of work, each tied to a metric.
   - On-chain track (optional): if the company has or plans a token or on-chain layer,
     note the traction gate that would make it eligible to tokenize.

3. Write STRATEGY.md. Save a tight document to `company-brain/STRATEGY.md` with those
   sections, dated. Keep it short enough to reread every session.

4. Reconcile. If the new strategy contradicts a locked decision or the current build
   map, name the conflict and either update the decision (record it in `decisions/`)
   or flag it for the founder. Do not silently diverge.

5. Record. Note the strategy set or revised in `ledger/`, dated.

## Rules

- Strategy is the founder's call. You sharpen and pressure-test it; you do not invent
  a direction they did not choose.
- One page. A strategy no one rereads is not an anchor.
- Every metric has a guardrail. A number that can only go up is not a strategy metric.
- No em-dashes, no emojis. Institutional tone.

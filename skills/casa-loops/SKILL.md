---
name: casa-loops
description: Show and run the company's recurring loops, the work that never finishes (metrics pulse, customer insight, retro, content, financial close). Use when the user asks about loops, recurring work, what is due, the weekly cadence, or says casa loops.
---

# casa-loops

Loops are the standing cadences of a running company. They are defined in
`company-brain/loops.json` and surfaced by the advisor: when a loop is due, it
appears under "Loops due now" in `NOW.md` at session start.

## How loops run

- Interactive mode: run a due loop while you are present using your configured
  agent harness. This is the default.
- Operate mode: the same loops can run headlessly only with the founder's own API
  key, metered billing, explicit opt-in, and compliance with current provider terms.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. See what is due. Read `company-brain/NOW.md` ("Loops due now"), or list all
   loops from `company-brain/loops.json` with their cadence and what triggers them.
   A loop is due when its `cadence_days` have passed since it last ran, it is at or
   above its `min_level`, and its `applies_when` traits hold.

2. Run a due loop. Each loop has a `runs` field naming the playbook or skill it
   triggers (for example weekly-retro runs the weekly-business-review). Execute
   that, writing its output to the loop's `brain_key` folder in the company brain.

3. Record it. Stamp the run so the cadence resets and the advisor stops showing it
   until next time:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs loop-ran company-brain <loop-id>
   ```

4. Compound. Each loop should read its prior outputs first (its `brain_key`
   history) and append what it learned, so the next run starts from the last one.

## Rules

- Surface due loops, do not nag. One reminder per session.
- Respect human-in-the-loop gates inside a loop (anything legal, money, or public
  still stops for approval).
- No em-dashes, no emojis in founder-facing output.

---
name: casa-priority
description: Re-evaluate where the company is and return the founder's ranked priorities for this work session, weighed against their pulse (focus and what they are not doing yet). Broader than casa-next, a full briefing rather than a single action, and it refreshes the pulse when the founder's focus has shifted. Use at the start of a work session, when the user asks where are we or what should I focus on, or says casa priority.
---

# casa-priority

The session opener. Reads the state of the company, refreshes the founder's pulse if it
has changed, and returns a short ranked briefing that is in sync with what the founder
actually cares about. The candidates come from the deterministic engine; the relevance
ranking and the reasoning are the advisor's.

## Steps

1. Understand THIS business. Load `company-brain/NOW.md`, `profile.json` (incl. `one_liner`),
   `company-brain/CLAUDE.md` (the company context blocks), `build-map.json`, `state.json` (for
   `completed`, `last_priority`, and the `loops` run dates), `pulse.json` (focus,
   anti-priorities, the do-or-die `constraint`, the `win_definition`, and weights), recent
   `decisions/`, `learnings.jsonl`, and `finance/receipts.jsonl` and any real metrics the brain
   records. If there is no build map, tell the founder to run `casa-start`. The founder's
   `win_definition`, their north star (`active_north_star.label`), and their do-or-die
   `constraint` -- in their own words -- are the frame for the whole briefing, and they are
   what you reason from. If the brain holds real numbers, those are the situation.

2. Refresh the pulse (the continuous part). State back the founder's current focus and the
   do-or-die constraint, one line each, and ask if they still hold or anything shifted this
   week. If it changed,
   update `company-brain/pulse.md` and `pulse.json` (including the weights), then
   re-render so the new weights take effect:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs sync company-brain
   ```

   If there is no pulse yet, offer to capture it now (the pulse cascade from casa-start).

3. Note what changed since the last check-in: compare against `state.last_priority` and
   the completed set (what was finished, spend delta, days elapsed, anything that
   stalled).

4. Get the pulse-weighted candidates from the engine:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/router.mjs next company-brain/profile.json \
     --level <current_level> --completed <done-id,...> --weights company-brain/pulse.json
   ```

   Each returned action carries an `effective_criticality` (existential, core, growth, or
   optional), a `department`, and `unblocks` (the downstream do-or-die / goal work it gates).
   Treat eligibility, gating, criticality, and order as given by the engine.

5. Deliver the briefing, REASONED and framed by the founder's goal:
   - Open with the goal and the do-or-die: "Your goal: <win_definition / north star>. The
     constraint in the way: <pulse.constraint>." Every priority below is judged by whether it
     moves that goal now and clears that constraint.
   - One line on the state of the company: level and name, progress, spend to date.
   - The top three priorities now, ranked, each with a REASONED why a sharp operator who knows
     this business would give: specific to the company and grounded in their real situation,
     tied to the win and constraint, and using the action's `unblocks` to show the ladder
     ("this unblocks <X>, your path to <goal>"). Lead any existential item first and name it
     as do-or-die. THE BRIDGE: if the founder's stated do-or-die is future work above the
     current level, say so and connect today's top priority to it ("your <constraint> work
     lands at level <n>; today's <action> is the rail it rides on"), so the briefing never
     reads as deaf to the priority the founder named. Flag any human-gate, irreversible,
     money, or legal step.
   - On track, not re-headlined: a recurring existential play (for example north-star-metric
     or unit-economics) run within its cadence window. Check `state.loops` for its last-run
     ISO date (the recorded key may be the play's own id or the loop id whose `runs` names
     it) and compare days elapsed against that loop's `cadence_days` in `loops.json`
     (default 7). If it is inside the window, report it as "on track, last reviewed <date>"
     and lead with the next forward move instead of re-ranking it to the top. If it is past
     its window or never run, it may headline.
   - Blockers: what is waiting, and on what.
   - Loops due now (the "Loops due now" section of `NOW.md`, if present).
   - Holding back: one or two eligible but off-pulse items, with why not now.

6. Record the check-in:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs priority-ran company-brain
   ```

## Rules

- Eligibility and gating are the engine's; the relevance ranking and the reasoning are
  yours. Never recommend a blocked or out-of-level item.
- A ranked briefing tied to the founder's pulse, not a wall of tasks and not a bare
  table. Always say what you are holding back and why.
- Frame the briefing around the founder's win and the do-or-die constraint from `pulse.json`.
  Every ranked priority is judged by whether it moves that goal now and clears the constraint,
  and you always reason HOW it connects.
- Be specific to this company. If a why would read identically for a different company, it is
  too generic. When the founder's do-or-die is future work, build the bridge from today's
  priority to it explicitly, so the plan never feels deaf to what they said kills them.
- An existential item is do-or-die for the stage and is never buried below optimization
  work, even when a lower-criticality item scores slightly higher. A recurring existential
  play reviewed within its cadence is reported as on track, not re-headlined.
- Refresh the pulse when it has shifted, so the recommendations stay in sync. Do not
  re-stage the business here; for that, point the founder to `casa-start`.
- Never auto-execute a human-gate, money, or legal step.
- No em-dashes, no emojis.

---
name: casa-next
description: The always-on advisor. Returns the single next best action for the company, chosen for THIS founder by weighing the engine's eligible candidates against the founder's pulse and real situation, and REASONS why it is the right move for their stated goal right now (not a generic why). Use when the user asks what is next, what should I do, says casa next, or at the start of a working session.
---

# casa-next

The reasoning layer. The engine decides what is ELIGIBLE and in what order; this skill
decides what is WISE for THIS founder right now and explains it like a sharp operator who
knows the business. It never returns a wall of tasks, never a bare table, and never a
generic why that would read the same for any other company.

## Steps

1. Understand THIS business, not a profile. Load and actually read:
   - `company-brain/profile.json` (type, traits, stage, `one_liner`, `monetization`,
     `north_star`) and `company-brain/CLAUDE.md` (the company's own context blocks).
   - `company-brain/pulse.json` -- the founder's stated goal: `north_star_archetype`, the
     do-or-die `constraint`, the `win_definition` (what would make this a win), `focus`,
     `anti_priorities`, and `weights`.
   - `company-brain/NOW.md` and `build-map.json` (`active_north_star`, current level,
     completed ids).
   - `company-brain/state.json` (the `loops` run dates, `last_priority`), recent
     `decisions/`, `learnings.jsonl`, and `finance/receipts.jsonl` and any metrics the brain
     records. If the brain holds real numbers (revenue, users, retention, runway), they are
     the situation you reason from.
   If there is no build map, tell the founder to run `casa-start`. The founder's win and
   do-or-die constraint, in their own words, are the lens for everything below.

2. Get the engine's eligible, pulse-weighted candidates (do not score or gate by hand):

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/router.mjs next company-brain/profile.json \
     --level <current_level> --completed <done-id,done-id,...> \
     --weights company-brain/pulse.json
   ```

   Each action carries `effective_criticality` (existential | core | growth | optional), a
   `department`, and `unblocks` (the downstream do-or-die / goal work it gates). Treat
   eligibility, gating, criticality, and order as given by the engine; never recommend a
   blocked or out-of-level item.

3. Make the call. Pick the single best NEXT action for this founder, weighed against their
   win and north star first, then the pulse. Two rules:
   - Do-or-die leads. An existential action is do-or-die for this stage; name its band and
     never bury it below optimization work, even if a lower-criticality item scores slightly
     higher. Do not invent a band the engine did not assign.
   - Suppress what was just reviewed. A recurring existential play (north-star-metric,
     unit-economics) must not re-headline every session. Check `state.loops` for its last-run
     date against the loop cadence (`cadence_days` in `loops.json`, default 7). If within the
     window, report it as "on track, last reviewed <date>" and lead with the next forward move.

4. REASON, do not restate. This is the point of the skill. For the headline action, write a
   why that a sharp operator who knows THIS company would give:
   - Say the founder's real goal in their words (the `win_definition`, the north star, the
     do-or-die `constraint`).
   - Explain specifically why THIS action serves that goal NOW, grounded in their actual
     situation and numbers, not the playbook's generic purpose.
   - Use the action's `unblocks` to show the ladder: "this unblocks <X>, which is your path
     to <their goal>."
   - THE BRIDGE (critical when the do-or-die is FUTURE work above the current level): if the
     founder's stated do-or-die sits at a higher level than they are now, say so plainly and
     connect today's action to it -- "your <constraint, e.g. cold-start liquidity> work lands
     at level <n>; today's <action> is the rail it rides on, so doing it now is how you get
     there." The founder must never feel the engine is deaf to the priority they named. If the
     engine's #1 differs from what the founder would expect given their constraint, acknowledge
     the gap and explain the sequence, rather than silently overriding their intuition.

5. Deliver the briefing (prose, not a table). Open with their goal, then the reasoned move:

   ```
   Your goal: <win_definition / north star> -- the thing in the way is <constraint>.
   Next: <action>. <The reasoned why from step 4: specific to this company, tied to the goal,
                    naming the ladder and, if relevant, the bridge to the future do-or-die.>
                    [do-or-die for this stage, if existential] [needs your approval, if gated]
   Also ready: <up to 2 more, one specific line why each, only if genuinely on-pulse>.
   On track:   <recurring existential play reviewed within cadence> -- last reviewed <date>.
   Holding back: <eligible but off-goal item> -- <why not now, tied to their anti-priorities>.
   ```

6. Advance the level if the exit gate is satisfied (record it in `ledger/`). Self-update the
   AUTO blocks in `company-brain/CLAUDE.md` and regenerate `NOW.md` via `brain.mjs sync`. Edit
   inside AUTO markers only, date entries, no em-dashes or emojis.

## Rules

- Eligibility, dependencies, gating, and order are the engine's. The relevance call and the
  REASONING are yours. Never recommend a blocked or out-of-level item.
- Be specific to this company. Name their metric, their constraint, their stage reality. If a
  sentence would read identically for a different company, it is too generic -- read more of
  the brain and reason harder.
- Frame the briefing around the founder's win and north star. The next move is whatever moves
  that goal now, and you always say HOW it connects.
- When the founder's stated do-or-die is future work, build the bridge from today's action to
  it explicitly. Never leave the founder feeling the plan ignored what they said kills them.
- One primary action with a real why, not a wall of tasks. Always say what you hold back and why.
- An existential action is do-or-die and is never buried below optimization work. A recurring
  existential play reviewed within cadence is reported as on track, not re-headlined.
- If there is no pulse yet, run with the engine order, say so, and offer to capture the pulse.
- Never auto-execute a human-gate, irreversible, money, or legal step. No em-dashes, no emojis.

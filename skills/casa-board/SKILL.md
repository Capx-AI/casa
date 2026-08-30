---
name: casa-board
description: Move several parts of the company forward at once. Casa picks a handful of independent pieces of ready work, aimed at the one problem holding the company back, drafts them in parallel, checks each against its quality bar, and commits only what passes. Use when you want a work session that advances the whole company instead of one task at a time. You stay present and in control throughout.
argument-hint: "[k:N] (max parallel drafts this wave, default 3)"
---

# casa-board

The work half of the board. Where casa-next hands you one move, casa-board drafts a
WAVE of independent moves at once, led by the one binding constraint, then commits the
ones that pass. Concurrency is in the DRAFTING (parallel, expensive); serialization is
in the COMMITTING (one writer, cheap), so the company brain can never be corrupted.

## ToS and honesty contract (read first)

- INTERACTIVE only. You (the founder) are present; the subagents are in-session Task
  subagents, never a headless `claude -p` or a background process (rule 5). Do not run
  this unattended.
- `scripts/brain.mjs` is the SOLE writer of brain state. Subagents DRAFT into
  `company-brain/outputs/<nodeId>/` and return structured results; they never mutate
  `state.json` / `build-map.json` / `profile.json`.
- A subagent's own self-grade NEVER marks a node verified. Only the grade gate (step 4)
  decides pass or fail. A node Casa did not actually do, or that fails the gate, stays
  open. No fake progress.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Sync, so the wave is computed from current state:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs sync company-brain
   ```

2. Compute the wave (k from the argument, default 3):

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/wave.mjs company-brain --k 3
   ```

   Read the JSON. If `fallback_to_next` is true (frontier under 2 independent plays), a
   wave is not worth the overhead: tell the founder to run `/casa-next` for the single
   best move and STOP. Otherwise describe the wave to the founder in plain words: what
   each piece of work is (its title, not its id), which part of the company it belongs
   to, and how many can genuinely run at once. Never claim more parallelism than the
   returned `frontier_width`; keep the ids and the raw JSON out of the founder-facing
   text unless asked.

3. Fan out, one in-session subagent PER wave node, in parallel. Give each subagent ONLY:
   its `nodeId`, the playbook entry from `${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/playbooks/_index.json`
   (so it can read the body file and the `deliverable` spec), and the shared diagnosis
   from `company-brain/` (the company north star, the binding constraint, and the
   structured `win_definition`). Each subagent:
   - executes the playbook body for THIS company (specific, grounded, not generic),
   - writes the deliverable to `company-brain/outputs/<nodeId>/`,
   - returns ONLY this JSON, no prose, and mutates NOTHING:

   ```json
   { "nodeId": "<id>", "draft_summary": "<one line>",
     "self_grade": 0, "residual_risks": ["<what it could not finish>"],
     "completion_proposal": true }
   ```

4. Grade gate (a self-grade never verifies). For each returned draft, run the existing
   grader, which combines deterministic checks (sections, word budget, copy-lint) with a
   rubric judgment and persists the score:

   ```
   /casa-review grade <nodeId>
   ```

   A draft passes only when the grade is a pass. Failed drafts are reported and left
   OPEN (re-queued for a later wave), never committed.

5. Serial-commit the passing drafts, ONE at a time, through the sole writer (rule-4
   guarded; it refuses any node that is not engine-ready):

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs complete company-brain <nodeId>
   ```

6. Re-sync and report the wave outcome in plain words: what was drafted, what passed
   the quality check and was committed, what fell short and stays open for a later
   wave, and whether the company moved forward a stage. Keep node ids, grades, and
   internal counters out of the founder-facing report unless asked. If a commit
   advanced the level, STOP after this wave (the next wave is recomputed fresh) rather
   than draft against stale readiness.

## Rules

- Never dispatch more than `frontier_width` subagents, and never more than k.
- One node per subagent (a failure costs one draft, not the lane).
- Only DAG-independent nodes draft together (the planner guarantees this); do not add
  nodes by hand.
- The grade gate is mandatory. A self-grade is a hint, never a verification.
- No em-dashes, no emojis in any output or deliverable.

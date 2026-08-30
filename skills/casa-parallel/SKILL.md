---
name: casa-parallel
description: Run a big task faster by splitting it into independent pieces and working them at the same time. Casa first checks the split is actually worth it, runs the pieces concurrently, then merges and verifies the combined result before calling it done. Use when a task is large and separable (a research sweep, a multi-file build, a multi-part audit, a content kit), or when the user says parallelize, fan out, split this up, or make this faster.
---

# casa-parallel

Speed through parallelism, but only when it actually pays. The benchmark behind this is
clear: fan-out wins 2-3x on big, even, independent work and loses on small or dependent
work. This skill makes the planner decide, then executes the plan.

The brain dir is `company-brain/`. All scripts live at `${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/`.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Decompose. Break the task into subtasks. For a playbook wave, the subtasks are the
   ready nodes (`node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/wave.mjs company-brain`). For an
   ad-hoc task, split it yourself into the smallest set of genuinely independent pieces,
   and for each estimate `effort` (rough minutes) and list `deps` (ids it must follow).

2. Ask the planner. Run:
   `node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/planner.mjs '[{"id":"a","effort":8},{"id":"b","effort":8,"deps":["a"]}]'`
   It returns `{ mode, waves, estSpeedup, width, warnings, reason }`.
   - If `mode` is `serial`, do the task normally in this session. Tell the user why
     (single task, dependency chain, chunks too small, or merge cost dominates). Stop here.
   - If a warning names an `imbalanced` chunk, split that chunk further and re-plan first.
     The slowest worker caps the whole wave, so balance matters more than width.

3. Fan out, wave by wave. For each wave in `waves` (in order, they are a barrier):
   spawn one subagent per subtask in that wave CONCURRENTLY (multiple Task tool calls in
   a single message). Give each subagent only its own slice plus any shared contract
   (interfaces, schema, house rules) so independent workers do not drift.
   - Before a worker starts, record it:
     `node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/ledger.mjs append company-brain '{"task":"<id>","dept":"<dept>","agent":"<agent>","status":"running"}'`
   - When it finishes, record the outcome with a PATH to its artifact (never the contents)
     and a one-line decision:
     `... append company-brain '{"task":"<id>","status":"done","artifact":"<path>","decision":"<one line>"}'`

3a. Respect the gates. If any subtask would spend money, publish, merge to main, or do
    something destructive (the `always_ask` line in `company-brain/dials.json`), do NOT
    let the worker do it. Record `{"task":"<id>","status":"blocked","note":"<what it needs>"}`
    and surface it to the founder for approval before proceeding.

4. Serialize the tail. Waves after the first run only once their dependencies are done.
   A dependent synthesis step (it consumes the front waves) is irreducibly serial; do it
   last, in this session, over the collected outputs.

5. Verify before done (the merge gate). Do not trust each worker's self-report.
   - Code: assemble the pieces and run the REAL suite over them, unmocked:
     `node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/verify.mjs <dir>`. A worker can pass its own
     mocked test while having drifted from the shared contract; only the integrated run
     catches that. If it fails, fix the drift (usually one module not importing the shared
     types) and re-run before declaring done.
   - Research / content: synthesize the wave outputs into one coherent result, resolving
     overlaps and contradictions.
   - Record the merge: `... append company-brain '{"task":"merge-verify","status":"merged","decision":"<verify result>"}'`

6. Report. Give the user the merged result and a one-line note of what ran in
   parallel, in plain words. Do not quote modeled or realized speedup numbers unless
   the founder asks. The full timeline is in the ledger
   (`node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/ledger.mjs status company-brain`).

## Notes

- This skill uses this session's own subagents (the path validated at ~2-3x on the Max
  subscription). The headless / multi-account path (more accounts raise the concurrency
  ceiling) is `scripts/dispatch.mjs` driven by the `scripts/headless-runner.mjs`
  `claude -p` runner. That path is ToS-gated (repo rule 5): it runs only on your own
  ANTHROPIC_API_KEY with CASA_OPERATE=1, never on a subscription.
- Keep ledger events thin: an `artifact` is a file path, not the file. Big content goes
  in the file, its path goes in the ledger.

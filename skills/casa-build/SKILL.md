---
name: casa-build
description: Execute a ready playbook from the build map to a finished artifact. Reads the playbook procedure and its input artifacts from the company brain, does the work to a quality bar, writes the produced artifact back into the brain, runs a review, and marks the node done so the engine advances. Use when the user says build, do this, run the next playbook, execute, or names a playbook to carry out.
---

# casa-build

The doer. casa-next and casa-priority say what to do; casa-build actually does it,
to a standard, and advances the company state. It is the execution half of the
build then review loop (casa-review is the other half).

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Pick the node. Read `company-brain/build-map.json` and `NOW.md`. The target is
   either the id the user named or the top ready action. Confirm its status is
   `ready` (not `blocked` or `done`). If the user named a blocked node, say what it
   is waiting on and stop.

2. Load the playbook and its inputs. Playbook files are numbered `NNN-<id>.md`, so
   find the file with a glob: `${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/playbooks/level-<N>/*-<id>.md`.
   Read its `## Procedure`, its
   `consumes` artifacts (load each from `company-brain/`), and its `produces`
   artifact name. If a consumed artifact is missing, stop and route the founder to
   the playbook that produces it.

3. Route to the operator, then do the work to a quality bar. Read the playbook's
   `department` frontmatter and delegate to the operator agent that staffs it.
   `node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/roster.mjs company-brain` lists this company's
   departments and operators (mapping: Strategy -> casa-strategist / casa-researcher,
   Brand -> casa-brand, Product -> casa-product, Engineering -> casa-engineer, Data ->
   casa-analyst, Growth -> casa-growth / casa-marketer / casa-lifecycle, Sales ->
   casa-sales, Success -> casa-success, Finance -> casa-finance, Operations ->
   casa-operator / casa-partnership, Legal -> casa-operator). The operator follows the
   procedure and produces the real artifact, not a placeholder. If the playbook produces
   founder-facing copy, draft it through `casa-write` (which runs the deterministic copy
   linter). If it produces UI, use `casa-design`. Keep the company profile and any locked
   decisions in view.

4. Respect the gates. If the playbook is `human_gate` or the step is irreversible,
   legal, or spends money, STOP before that step: present what you are about to do
   and get explicit approval. Never file, pay, sign, send, or publish on your own.

5. Write the artifact. Save the produced artifact to `company-brain/outputs/<id>/`.
   This path is the contract: casa-review, casa-board, and casa-department all read
   and grade from it. If a significant decision was made, append a record to
   `decisions/`.

6. Hand off what only the founder can do. If the playbook requires a real-world
   founder action Casa cannot perform (customer interviews, a filing, a phone call),
   do all the preparation work first (the script, the list, the draft), then mark the
   play as waiting on the founder:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs waiting company-brain <id> "<what the founder must do>"
   ```

   Tell the founder in plain words exactly what to do, and how to come back: when it
   is done, run `node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs unwait company-brain <id>`
   and then complete the play (step 8). Until then it shows under "Waiting on you" in
   NOW.md. Never mark a waiting play done.

7. Review before done. Run `casa-review` on the produced artifact (the personas that
   fit its type). Address P0 and P1 findings before continuing. For a low-stakes
   artifact a single self-review pass is enough.

8. Mark it done. Advance the deterministic state:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/brain.mjs complete company-brain <id>
   ```

   This re-renders the build map, NOW.md, and the company CLAUDE.md AUTO blocks, and
   may advance the level. Hand off to `casa-next` for what is now unblocked.

## Rules

- Only build a `ready` node. The level gate and dependencies exist for a reason; an
  out-of-order artifact is garbage.
- State changes go through `brain.mjs complete`, never by hand-editing build-map.json
  or the AUTO blocks.
- Never auto-execute a human-gate, irreversible, money, or legal step. Surface it.
- Produce real artifacts, never lorem-ipsum or placeholder company names.
- No em-dashes, no emojis in any output the founder or a customer will see.

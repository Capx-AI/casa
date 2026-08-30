---
name: casa-review
description: Critique a company artifact (a decision, a plan, copy, a price, a positioning line, a deck, a metrics readout) with a panel of specialist persona agents, then merge and confidence-gate their findings into one ranked verdict. Interactive mode applies safe fixes on request; mode:agent returns JSON and changes nothing. Use after building or drafting something, before a launch, a price, or a commitment.
argument-hint: "[mode:agent] [grade <nodeId>] [path to the artifact, or blank for the most recent decision]"
---

# casa-review

The critic. Adapts the parallel-persona review pipeline (always-on plus conditional
personas, structured findings, confidence-gated merge) from code review onto company
decisions. It is the review half of the build then review loop.

## Argument parsing

- `grade <nodeId>`: run the GRADE MODE below instead of the persona critique. It scores
  a completed node's deliverable 0-100 against the playbook's `deliverable` spec and
  `rubric`, combining deterministic checks with an LLM judgment, and persists the score.
- `mode:agent` (or `mode:headless`): return only the merged JSON verdict, apply no
  fixes, mutate nothing. Default mode is interactive (render a briefing, offer to
  apply safe fixes).
- A path: the artifact to review. Blank means the most recent file in
  `company-brain/decisions/` or the artifact the last `casa-build` produced.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Scope. Identify the artifact and its type (decision, copy, plan, pricing,
   positioning, design, metrics, deck). Read it, plus `profile.json`,
   `build-map.json`, and any `decisions/` it references.

2. Select personas. Always-on: `customer-skeptic`, `investor-redteam`,
   `brand-copy-critic`, `analyst-honesty`. Add conditional personas by signal:
   `designers-eye` for UI, `legal-risk` for legal, contract, privacy, custody, or
   payments artifacts, `tokenomics-critic` when the artifact touches a token or
   on-chain mechanics. Select by judgment about the artifact, not by keyword.

3. Spawn the personas in parallel as subagents. Give each the artifact and the
   context. Each returns ONLY this JSON, no prose:

   ```json
   {
     "persona": "<name>",
     "findings": [
       { "severity": "P0|P1|P2|P3", "confidence": 0|25|50|75|100,
         "title": "<short>", "where": "<section, line, or claim>",
         "why": "<the risk>", "fix": "<specific correction>" }
     ],
     "residual_risks": ["<what you could not assess>"]
   }
   ```

4. Merge and gate, deterministically (not by hand):
   - Fingerprint a finding by `where` plus a normalized `title`.
   - When two or more personas raise the same fingerprint, promote its confidence one
     step (cross-reviewer agreement is signal).
   - Suppress anything below confidence 75, except every P0 (a P0 always surfaces).
   - Order by severity, then confidence.

5. Output.
   - Interactive: a ranked briefing in plain language. For each surviving finding say
     who raised it, how serious it is in plain words (must fix, should fix, or worth
     considering, never a P0/P1 label unless the founder asks), the why, and the fix.
     Group safe, reversible fixes and offer to apply them. Never auto-apply an
     irreversible, legal, or money change.
   - mode:agent: print the merged JSON only and stop (severity codes stay intact there;
     that output is for the engine, not the founder).

6. Record. Append a short review record to `company-brain/ledger/` (artifact,
   personas run, count of surviving findings, verdict). Do not edit the artifact in
   mode:agent.

## Grade mode (score a completed deliverable)

Invoked as `casa-review grade <nodeId>` (called after a `casa-build` to score the
output). This is a quality grade of one finished deliverable, not the persona panel.
It returns a score 0-100, a pass or fail, and a short list of concrete gaps, combining
deterministic checks with an LLM judgment, and it persists the score on the node.

1. Load the spec. Read `${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/playbooks/_index.json` and find the entry
   whose `id` is `<nodeId>`. Pull two optional fields:
   - `deliverable` -- what good output is, for example
     `{ "file": "...", "sections": ["..."], "max_words": 800 }`.
   - `rubric` -- how to grade it (the criteria that define quality for this artifact).
   If the entry has no `deliverable` spec, grade against the GENERIC bar (step 5) and
   say so in the output.

2. Read the actual deliverable. Read the file or files the node produced under
   `company-brain/outputs/<nodeId>/` (or the `deliverable.file` path if the spec names
   one). If nothing is there, the grade is an automatic fail with the gap "no
   deliverable found"; persist it (step 6) and stop.

3. Deterministic checks (these are facts, not opinion):
   - Sections present: every required name in `deliverable.sections` appears as a
     heading or labelled section in the deliverable. Each missing one is a gap.
   - Word count: if `deliverable.max_words` is set, the deliverable is within it. Over
     budget is a gap.
   - Copy-lint clean: run the canon linter on each deliverable file and read the JSON:

     ```
     node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/copy-lint.mjs company-brain/outputs/<nodeId>/<file> --json
     ```

     Any entry in `errors` (an em-dash, an emoji, or a placeholder or test company
     name) is a hard canon violation and a gap. `warnings` (founder-bro buzzwords) are
     soft and noted, not a hard fail.

4. LLM judgment against the rubric. Read the deliverable as a sharp operator and judge
   how well it meets each `rubric` criterion: is it specific and grounded in this
   company, is it actionable, does it actually do the job the playbook intends, or is it
   thin or generic. Name concrete gaps tied to the rubric, not vague notes.

5. Score and verdict. Combine into one score 0-100 and a boolean pass:
   - The rubric judgment sets the bulk of the score (how good the work is).
   - The deterministic checks cap it: a missing required section, over `max_words`, or
     a copy-lint error each pulls the score down materially, and any of them forces
     `pass: false` regardless of the rubric judgment (a deliverable that violates the
     hard spec cannot pass).
   - With no spec present, grade against the GENERIC bar: clear, specific, actionable,
     and copy-clean (still run copy-lint). State that a generic bar was used because the
     playbook carries no `deliverable` or `rubric`.
   - Default pass threshold: `score >= 70` AND no deterministic hard violation.

6. Persist the score. Hand it to the engine, which is the only thing that writes
   brain state. Never append to `company-brain/scores.jsonl` yourself.

   ```
   node scripts/brain.mjs grade company-brain <nodeId> <score> <true|false> '["gap one","gap two"]'
   ```

   The persisted shape is `{ "nodeId", "score", "pass", "gaps": [...], "ts" }`,
   append-only. The engine rejects an unknown playbook id, a score outside 0-100,
   or gaps that are not a JSON array of strings, so a bad grade fails loudly here
   rather than silently corrupting the record a verifier will later read.

7. Output. Report the score, the pass or fail, and the short ordered list of concrete
   gaps (deterministic gaps first, then the rubric gaps). Keep it tight; this feeds a
   one-click "make it better" loop, so each gap should be a fixable instruction.

## Rules

- The gating is deterministic (fingerprint, promotion, threshold). Do not re-rank by
  feel.
- Independence is the point: each persona judges on its own, never as a committee.
- Never apply a fix that files, pays, signs, sends, or publishes. Surface those.
- No em-dashes, no emojis in the briefing or any fix.

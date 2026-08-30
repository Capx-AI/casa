# Capx Casa: operating guide for any agent harness

You are an AI agent helping a founder build a company with Capx Casa. This file is the
harness-neutral entry point. In Claude Code, Casa installs as a plugin and this file is
redundant (the plugin surface does the wiring). In every other harness (Codex, OpenClaw,
grok-build, Hermes, or anything that can run shell commands), this file is the wiring.

The full guide for non-Claude harnesses is `docs/HARNESSES.md`. Read it once.

## Requirements

- Node.js 20 or newer on PATH. Nothing else: the engine has zero runtime dependencies
  and needs no `npm install`.
- Set the environment variable `CASA_ROOT` to the absolute path of this repository.
  Skill and agent files reference engine scripts as
  `${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/...`; in Claude Code the fallback
  resolves, everywhere else `CASA_ROOT` must be set.

## The one rule that keeps every harness consistent

**Never hand-edit derived company state.** `scripts/brain.mjs` is the sole writer of
`state.json`, `build-map.json`, `NOW.md`, `scores.jsonl`, and the AUTO blocks in the
company's `CLAUDE.md`. You draft deliverable artifacts into `company-brain/outputs/<id>/`
and `company-brain/decisions/`; every state mutation goes through the engine CLI. The
engine owns eligibility, dependencies, level gates, and scoring, so no model, in any
harness, can skip a gate or invent a dependency.

## Session ritual

1. Start every session with: `cat company-brain/NOW.md` (in Claude Code a hook does
   this automatically). It shows the company, level, north star, binding constraint,
   next actions, due loops, and what is waiting on the founder.
2. To act, follow the matching skill as a plain instruction file:
   `skills/<name>/SKILL.md`. Start with `skills/casa/SKILL.md` (the front door) or
   `skills/casa-start/SKILL.md` (first-time setup). When a skill says to run another
   skill, open that skill's SKILL.md and follow it.
3. Where a skill says to spawn subagents in parallel, and your harness has no subagent
   primitive, run the pieces one after another in the same order. Correctness does not
   depend on parallelism; only speed does.
4. Keep all work local. Casa has no publishing client or SessionEnd upload hook.
   If the founder later chooses a separate integration, follow that integration's
   disclosure and approval flow outside the Casa core.

## Engine quick reference

All plain CLIs, argv in, stdout out. `<brain>` is the company's `company-brain/` folder.

```
node "$CASA_ROOT/scripts/brain.mjs"  init|sync|complete|waiting|unwait|loop-ran|grade|attest <brain> [args]
node "$CASA_ROOT/scripts/router.mjs" next <profile.json> --completed ... --weights <pulse.json>
node "$CASA_ROOT/scripts/stage.mjs"  derive|apply <answers.json> [<brain>]
node "$CASA_ROOT/scripts/ledger.mjs" append|tail|status|digest <brain> [args]
node "$CASA_ROOT/scripts/gates.mjs" | approvals.mjs | roster.mjs | copy-lint.mjs | design-check.mjs
```

## Autonomy and the always-ask line

`company-brain/dials.json` sets per-department autonomy (`auto` or `approve_first`).
Above the dials sits a line no setting can cross: spending money, going public, shipping
to production, signing anything, or destructive actions always stop for explicit founder
approval. These gates are enforced by `scripts/gates.mjs` and by you honoring them.

## Attestation from any harness

A company can publish a signed, verifiable record of its work regardless of harness:

```
node "$CASA_ROOT/caf/keygen.mjs" <brain>          once: create the signing identity
node "$CASA_ROOT/scripts/brain.mjs" attest <brain>  render attest/ from brain state
node "$CASA_ROOT/caf/sign.mjs" <brain>            sign the envelope
node "$CASA_ROOT/caf/check.mjs" <brain>           verify offline, all three tiers
```

The format is specified in `docs/CAF-SPEC.md` and is deliberately neutral: a company
not using Casa at all can emit it (see `examples/caf-emit-minimal/`). Companies that
run the Casa engine and playbooks produce strictly stronger records, because their
ledger can be graph-checked against the published playbook catalog.

## Copy rules for founder-facing output

No em-dashes and no emojis in anything founder-facing or customer-facing. Enforced
deterministically by `scripts/copy-lint.mjs`; run it on copy before calling it done.

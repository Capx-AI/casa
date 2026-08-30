# Running Casa outside Claude Code

Casa is built as a Claude Code plugin, but it is deliberately layered so the parts that
carry the company survive the harness. This page says exactly what works where, how to
set up each harness, and what you give up.

## The three layers

| Layer | What it is | Portability |
|---|---|---|
| Deterministic engine | `scripts/*.mjs`: state, routing, gating, scoring, ledger, linters | Any machine with Node 20+. Zero dependencies, plain CLIs, plain-file state. Identical behavior in every harness. |
| Knowledge | `playbooks/` (the curriculum), `templates/company-brain/` (the state layout) | Plain markdown and JSON. Harness-free. |
| Experience | `skills/`, `agents/`, `hooks/`, `.claude-plugin/` | Written for Claude Code. Usable elsewhere as plain instruction files, with the degradations below. |

The company brain itself is only files. A company started in one harness can be
continued in another, or by a human with a text editor, without conversion.

## Setup by harness

**Claude Code (the reference experience):** install as a plugin per the README. Skills,
subagents, hooks, and slash commands all work. Nothing on this page applies.

**Codex, OpenClaw, grok-build (AGENTS.md-reading harnesses):** clone https://github.com/Capx-AI/casa, then in
the company's project folder tell the agent to read `<casa>/AGENTS.md` first, or copy
that file into the project. Set `CASA_ROOT` to the clone's absolute path in the
environment the agent's shell uses.

**Hermes and anything else with a shell:** same as above; if the harness does not read
AGENTS.md by convention, paste its contents into the system context or say "read
AGENTS.md in the Casa repo and follow it".

**No harness at all:** the engine is usable by hand. `cat company-brain/NOW.md`, run the
CLIs in AGENTS.md, write your own artifacts. Casa's judgment layer is gone but the state
machine, the curriculum, and the attestation path all still work.

## What degrades outside Claude Code, exactly

| Capability | In Claude Code | Elsewhere |
|---|---|---|
| Session greeting | Automatic (SessionStart hook) | Run `cat company-brain/NOW.md` yourself; put it in the harness's session ritual |
| Skill dispatch | `/casa-*` commands, auto-discovered | Open `skills/<name>/SKILL.md` and follow it as a prompt |
| Specialist operators and review personas | Spawned as parallel subagents | Run the same `agents/*.md` files as sequential inline prompts; the persona text is the value, the parallelism is only speed |
| Parallel fan-out (`casa-parallel`, `casa-board`) | Concurrent subagents | Execute waves serially in the planner's order. `scripts/dispatch.mjs` also accepts an injectable runner if your harness has its own headless CLI |
| Tool permissioning per agent | Enforced by the harness | Honor the `tools:` line in each agent file yourself |
| Headless operate mode | `scripts/operate.mjs` (gated to an Anthropic API key by its terms) | Not available; the interactive loop is the supported path |
| Model quality | Whatever your plan runs | Whatever your harness runs; agents declare `model: inherit`, never a specific model |

What does NOT degrade: state integrity. Every mutation goes through `brain.mjs`, so a
company driven from any harness has the same gates, the same level model, the same
ledger, and the same honest NOW.md as one driven from Claude Code.

Casa does not auto-push from any harness. The core contains no publishing client
and registers no SessionEnd upload hook. A separately installed integration must
document its own disclosure and approval flow.

## Attestation strength by adoption level

The CAF attestation format (docs/CAF-SPEC.md) is harness-neutral, but records are not
all equally strong. What makes a record strong is how much of it can be checked:

1. **Casa brain, any harness.** You run the engine CLIs and the playbook catalog. Your
   ledger names `node_id`s, so Tier 2 legality replays your whole history against the
   published dependency graph, and your artifact digests carry inclusion proofs. This is
   the strongest record, and it does not require Claude Code.
2. **Own workflow, CAF emitter.** You keep your own state and emit conforming
   publications (see `examples/caf-emit-minimal/`). Structure and arithmetic verify
   (Tiers 0 and 1); legality is honestly reported as unverifiable because you declared
   no plan to check against. Weaker, and visibly so, by design.
3. **Nothing.** No record. Nothing to verify.

There is no importer today that maps a foreign harness's native logs into a CAF ledger;
if you want the strong record, run the engine. The minimal emitter is a format
reference, not an importer.

## For contributors

The portability contract is enforced by `tests/portability.test.mjs`: every engine
script stays zero-dependency and CLI-invocable, and every path reference in skills and
agents keeps the `${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}` form so it resolves in and out
of Claude Code. If you add a skill, reference scripts the same way.

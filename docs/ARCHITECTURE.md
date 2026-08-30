# Architecture

How Capx Casa works, for contributors. The operating contract this repo runs
under is `CLAUDE.md`; the playbook frontmatter contract is
[PLAYBOOK-SCHEMA.md](PLAYBOOK-SCHEMA.md).

## The prime directive

Deterministic code owns eligibility, dependency math, gating, scoring inputs, and
every state mutation. The LLM reasons at the leaves: intake, disambiguation,
drafting, final relevance ranking over an eligible set, and phrasing. An
ineligible or blocked item can never be recommended, an agent can never skip a
gate, and `scripts/brain.mjs` is the sole writer of brain state. When you add a
feature, put the rule in deterministic code and the judgment in the agent.

## The layers

```
Plugin shell            .claude-plugin/ (plugin.json, marketplace.json)
Deterministic engine    scripts/router.mjs + northstar.mjs + stage.mjs
Brain state engine      scripts/brain.mjs (sole writer of company-brain state)
Skills                  skills/ (commands, one per founder job)
Agents                  agents/ (operators that do the work, advisors that check it)
Loop engine             templates/company-brain/loops.json + brain.mjs due-loop surfacing
Orchestration spine     scripts/cos.mjs, cos-context.mjs, planner.mjs, dispatch.mjs,
                        verify.mjs, gates.mjs, approvals.mjs, ledger.mjs
Company brain           company-brain/ in the founder's project (plain text, git-tracked)
```

## The deterministic engine

`scripts/router.mjs` is the core. Given a business profile and the playbook
catalog (`playbooks/_index.json`, 174 playbooks with machine-readable
frontmatter), it:

1. **Selects** the playbooks that apply, by trait pre-filter (`applies_to`,
   `requires_traits`, `excluded_traits`).
2. **Sequences** them into a DAG from `depends_on` and produces/consumes edges,
   with Kahn topological sort (cycle detection) and critical-path slack.
3. **Scores** every ready node:

   ```
   score = leverage * urgency(slack) * stageFit * fitFactor * revenue / effort * pulseWeight
   ```

   where `stageFit` discounts stale low-level work, `fitFactor` blends
   criticality with business-model fit, and `pulseWeight` personalizes by the
   founder's stated focus. A headline tier (constraint-surface and existential
   work first) sorts the ready set before the score, so do-or-die work leads.
4. **Gates** by level: each play carries an internal level (0 to 8) and never
   becomes ready before its prerequisites exist.

The LLM advisor (`/casa`, `/casa-next`, `/casa-priority`) makes the final
relevance call over that eligible, scored set and explains it. It cannot add to
the set.

Support engines: `scripts/northstar.mjs` derives the business-type north star;
`scripts/stage.mjs` turns onboarding answers into a profile, a start level, and a
seed of already-done work so an existing business never regresses to validation.

## The brain state engine

`scripts/brain.mjs` is the only code that mutates `company-brain/` state:
`init`, `sync`, `complete`, `loop-ran`, `priority-ran`, the experiment ledger,
and `waiting <brainDir> <id> <reason>`, which parks a play on a real-world
founder action and surfaces it in a "Waiting on you" section of `NOW.md`.
`sync` re-renders everything derived (NOW.md, the AUTO blocks of the company's
CLAUDE.md) from `state.json`; nothing else writes those files. Skills and agents
call brain.mjs; they never edit state by hand.

## Skills and agents

Each command is a skill (`skills/<name>/SKILL.md`). Skills are thin:
they gather context, call the deterministic engine for anything rule-shaped, and
put the LLM to work only on judgment and drafting. `/casa` is the front door and
shares its brain with `/casa-cos`.

Agents live in `agents/`. Operators (casa-strategist, casa-engineer,
casa-growth, ...) produce department artifacts; advisors (analyst-honesty,
investor-redteam, customer-skeptic, ...) grade them inside `/casa-review`.
`scripts/roster.mjs` derives which operators a company gets from its type and
binding constraint. Agents return structured output, not prose.

## The orchestration spine

- **Chief of Staff**: `scripts/cos.mjs` (route an action, assemble the session
  briefing) plus `scripts/cos-context.mjs` (a read-only view of profile, dials,
  and live ledger state). Re-instantiated every session; holds no private state.
- **Parallel dispatch**: `scripts/planner.mjs` decides IF and HOW to fan a task
  out (dependency layering, size gate, chunk balancing, speedup floor);
  `scripts/dispatch.mjs` runs the waves and ledgers every worker;
  `scripts/verify.mjs` is the merge gate and runs the real, unmocked test suite.
- **Autonomy**: `scripts/gates.mjs` resolves an action to `block`, `auto`, or
  `propose` from the per-department dials (`dials.json`); an always-ask gate
  beats any dial. `node scripts/gates.mjs dial <brainDir> <Department>
  <auto|approve_first>` changes a dial. `scripts/approvals.mjs
  pending|approve|reject` drains the approvals queue.
- **Ledger**: `scripts/ledger.mjs`, an append-only JSONL log with atomic
  single-line writes, so many terminals write concurrently without locks. See
  [LEDGER.md](LEDGER.md) for the event schema.

## The company brain

Casa's memory is the founder's own repo, plain text, diffable:

```
company-brain/
  CLAUDE.md          self-updating operating contract (AUTO blocks only)
  NOW.md             status, next action, waiting-on-you, due loops (the hook prints it)
  profile.json       business type, traits, monetization (router input)
  build-map.json     the sequenced plan of record
  state.json         progress, level floor, binding constraint, win definition
  pulse.json         founder focus weights (drives ranking personalization)
  ledger.jsonl       cross-terminal activity log
  dials.json         per-department autonomy
  loops.json         recurring cadences
  decisions/  outputs/  learnings.jsonl
  finance/receipts.jsonl   settled external receipts, read-only to Casa
```

## Unattended execution

Interactive use is the default. Headless operate mode (`scripts/operate.mjs`,
`scripts/headless-runner.mjs`) requires the founder's own API key, metered billing,
and an explicit `CASA_OPERATE` opt-in. Users must confirm their account and use
comply with the provider's current terms.

## Invariants to keep

- Zero runtime dependencies: runtime scripts import only `node:` modules and
  relative files (`js-yaml` is dev-only). `scripts/check-plugin.mjs` enforces it.
- `npm test` and `npm run check` must stay green from a fresh clone without sibling
  repositories, private contracts, cloud credentials, or network services.
- No hosted surface, telemetry, network client, or automatic/background egress of
  company state. `brain.mjs attest` renders a disclosed projection into
  `company-brain/attest/` and stops. Nothing is transmitted. `caf/sign.mjs` is a
  local sidecar the founder runs explicitly.
- Hosted integrations and publishing clients belong in separate opt-in packages.

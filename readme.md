# Capx Casa

The open control plane for building a company from your terminal.

[![CI](https://github.com/Capx-AI/casa/actions/workflows/test.yml/badge.svg)](https://github.com/Capx-AI/casa/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)](docs/ARCHITECTURE.md)

AI made a single developer as productive as a whole team. Capx Casa does the same
for the founder. A solo founder is excellent at one thing, but a company is a hundred
things at once. Casa holds the hundred: it figures out which of them matter for
your specific business, puts them in the right order, runs what it can, and tells
you what to do next, every time you open the terminal.

Casa is an open-source (MIT) Claude Code plugin. It runs inside your own Claude
Code, on your own plan. No SaaS login, no hosted inference, nothing to deploy. The
terminal is the source of truth, and the company's state is durable plain-text files
you can read and edit yourself.

## 60-second start

```
/plugin marketplace add https://github.com/Capx-AI/casa
/plugin install capx-casa
/casa-start
```

Casa interviews you about the business (or reads the project you already have),
builds a personalized plan that starts at the right level, and from then on greets
every session with where you are and the one move that matters most.

## What a session looks like

```
=== Capx Casa ===
InboxPilot                Level 0: Ideation and Validation
North star: validated demand, heading toward MRR
Do or die: no users yet. Leading: Growth, Strategy.

Next: Opportunity Scan (Strategy)
Waiting on you: nothing
Loops due: none

Run /casa for a briefing, /casa-help for the map.
=================

> /casa

InboxPilot is at Level 0 and the constraint is still no users:
nothing so far proves anyone wants this. The highest-leverage
move is the Opportunity Scan, a research pass across communities,
reviews, and search data that either surfaces real demand or
tells us to change course early. It runs in this session; nothing
is spent and nothing goes public.

Run the Opportunity Scan now? (yes / pick something else)
```

InboxPilot is a fictional example. A full example company,
[examples/inboxpilot](examples/inboxpilot/), is committed to this repo so you can
browse a real company brain, build map, and a graded artifact without installing
anything.

## How Casa organizes the work: departments

Casa organizes a company the way a founder thinks about it: by department. Every
one of its 174 playbooks belongs to one of eleven functions, and Casa shows your
company as a board of department lanes, each with its own north star.

| Department | What it owns |
|---|---|
| Strategy | The company north star, the binding constraint, the driver tree |
| Product | Activation and time to first value |
| Engineering | Shipping the product at reliable quality |
| Data | Instrumentation, so every other lane has a real number |
| Growth | Activated acquisition at a sustainable cost |
| Sales | Pipeline to closed revenue |
| Success | Retention and expansion |
| Finance | Runway, pricing, and unit economics |
| Legal | Entity, contracts, and regulatory clearance |
| Brand | Positioning, narrative, and message resonance |
| Operations | Cost to serve, fulfillment, and recurring-loop discipline |

Priority is decided by one thing: the binding constraint, the do-or-die problem
that, left unsolved, kills the business at its current stage (no users, no revenue,
a regulatory gate, runway, reliability at scale). Casa names it, puts the
departments that resolve it in the lead, and lets the rest sit honestly as support
or idle. The board is a lens, not a separate planner: underneath, one deterministic,
constraint-aware ranking sequences everything, so the advice stays specific to your
company instead of a generic per-function checklist. Each play also carries an
internal level (0 to 8) that gates when it becomes ready, so a launch play can
never run before there is a product.

## The agents: operators do the work, advisors check it

Casa derives which agents your company needs at `/casa-start` from your type and
binding constraint, and instantiates only those.

**Operators produce the real artifacts**, each owning a cluster of
departments:

| Operator | Department | What it does |
|---|---|---|
| `casa-strategist` | Strategy | Viability, business model, pricing strategy, stage-gate decisions |
| `casa-researcher` | Strategy | Market, customer, and competitive research |
| `casa-brand` | Brand | Naming, entity-formation prep, positioning, the brand system |
| `casa-product` | Product | MVP scoping, prioritization, roadmap, product specs |
| `casa-engineer` | Engineering | Stack, deployment, observability, security baseline |
| `casa-analyst` | Data | Event taxonomy, dashboards, north-star instrumentation |
| `casa-growth` | Growth | Experiments, channel selection, funnel, traction loops |
| `casa-marketer` | Growth | GTM, content, social, paid acquisition, SEO |
| `casa-lifecycle` | Growth | Email and lifecycle, nurture, retention, win-back |
| `casa-partnership` | Operations, Growth | Partnerships, integrations, co-marketing |
| `casa-sales` | Sales | Sales process, prospecting, pitch, deal management |
| `casa-success` | Success | Onboarding, retention, expansion, health scoring |
| `casa-finance` | Finance | Unit economics, runway, financial model, fundraising |
| `casa-operator` | Operations, Legal | Hiring, compliance roadmap, process, vendors |

**Advisors keep the bar high.** A standing review panel (`/casa-review`) grades
an operator's output in parallel and catches what it missed: honest-numbers,
investor red-team, customer-skeptic, brand and copy, design, plan audit, evidence,
and learnings personas. An operator drafts, the advisors grade, you address what
matters, the engine advances.

## The work loop

1. **`/casa` opens the session.** The front door. It reads the whole business from
   durable state (no re-explaining), tells you in plain English where you are and
   the one move it recommends and why, and asks before doing anything. `/casa-cos`
   is the same brain under its formal name; `/casa-next` returns just the single
   next action.
2. **You dispatch the work.** Casa routes the move to the operator that owns it
   through `/casa-build`, or fans it out with `/casa-parallel` when it splits. Each
   action runs under your autonomy setting for its department.
3. **Advisors check it.** `/casa-review` grades the artifact in parallel; you
   address the findings that matter before it counts as done and the engine
   advances to what is now unblocked. Work that needs a real-world step from you
   (a signup, a payment, a decision) is parked as "Waiting on you" instead of
   silently stalling.
4. **Everything syncs.** Every worker, in every terminal, writes a thin line to a
   shared append-only ledger, so a marketing terminal and an engineering terminal
   stay one coherent picture and the next session knows what already happened.

### Going faster: parallel dispatch

When a task is big and breaks into independent pieces (a research sweep, a
multi-file build, a content kit), `/casa-parallel` fans it out across subagents,
then auto-merges and verifies the result. A planner only splits when the pieces
are genuinely independent and large enough that the speedup beats the merge
overhead, and the merge step runs the real test suite, so a worker that drifted
from the shared contract is caught. On a single account this is roughly 2 to 3x
on the right tasks.

### Staying in control: autonomy and approvals

Each department has an autonomy dial: `auto` (reversible work runs without asking)
or `approve_first` (Casa proposes and waits). Above the dials sits an always-ask
line that no setting can cross: spending money, going public, shipping code, or
anything destructive always stops for you. Blocked actions join an approvals queue;
`/casa-approvals` shows it, clears it, and changes the dials. The deterministic
engine owns what is eligible, what depends on what, and what is gated, so an agent
can never skip a gate or run out-of-order work.

## Commands

Start here:

| Command | What it does |
|---|---|
| `/casa-start` | Set up the company: interview or project scan, then a personalized build map |
| `/casa` | The front door: reads the whole business, proposes the next move, asks before acting |
| `/casa-help` | One screen: where you are, the main commands, what to run now |

Do the work:

| Command | What it does |
|---|---|
| `/casa-build` | Execute a ready playbook to a finished artifact and advance the state |
| `/casa-parallel` | Fan a big independent task out across subagents, auto-merge, verify with a real test run |
| `/casa-board` | The company as department lanes led by the binding constraint, plus a wave of parallel drafts |
| `/casa-department <name>` | Focus a session on one function (Engineering, Growth, Finance, ...) |

Judgment:

| Command | What it does |
|---|---|
| `/casa-cos` | The Chief of Staff briefing (the same brain as `/casa`) |
| `/casa-next` | The single next best action, with the reasoning |
| `/casa-priority` | Re-evaluate where the company is and rank this session's priorities |
| `/casa-map` | Show and approve the personalized build map |
| `/casa-review` | Critique a decision, plan, or artifact with a panel of specialist personas |
| `/casa-validate` | Run Level 0 validation to a GO or KILL verdict on the idea |
| `/casa-strategy` | Set and maintain the company strategy anchor |
| `/casa-readout` | Read the company numbers honestly |

Craft:

| Command | What it does |
|---|---|
| `/casa-write` | Draft founder-facing copy to the canon, enforced by a linter |
| `/casa-design` | Build and verify product UI with production craft |
| `/casa-promote` | Draft launch and announcement copy |
| `/casa-synthesize` | Turn raw customer notes into a ranked insight memo |
| `/casa-ideate` | Generate, critique, and shortlist company moves |
| `/casa-experiment` | Frame and log a disciplined experiment |
| `/casa-compound` | Capture a lesson so the next run starts ahead |
| `/casa-refresh` | Sweep the learning store for drift |
| `/casa-pulse` | A time-windowed recap of the company |

Control:

| Command | What it does |
|---|---|
| `/casa-approvals` | See and clear the approvals queue; view and change autonomy dials |
| `/casa-loops` | Show and run recurring loops (metrics, retro, content, close) |

## Built to be trusted

- **Zero runtime dependencies.** The engine imports only Node built-ins. A clone
  needs no `npm install` to run.
- **Fresh-clone tests and preflight checks.** The suite uses Node's built-in test
  runner. `npm run check` verifies the plugin, offline boundary, and tests before
  anything ships.
- **The engine is deterministic where it counts.** Eligibility, dependencies,
  gating, and every state mutation are plain code, so an agent can never skip a
  gate or invent a dependency. The model reasons at the leaves.
- **The core transmits nothing.** All state is plain-text files in
  `company-brain/`, versioned in your own git. The plugin has no telemetry,
  hosted service, account, publishing client, or SessionEnd upload hook.
- **Interactive by default.** Optional headless mode requires your own API key,
  metered billing, and explicit opt-in. Confirm your use complies with the
  provider's current terms before enabling it.

## Not on Claude Code? Casa still works

Claude Code is the reference experience, but the layers that carry the company are
harness-neutral: the deterministic engine is zero-dependency Node CLIs, the playbooks
are plain markdown, and the company brain is plain files. Codex, OpenClaw, grok-build,
Hermes, or any agent with a shell can drive Casa through [AGENTS.md](AGENTS.md); a
company started in one harness continues in another without conversion. What changes
per harness, and what does not, is spelled out in
[docs/HARNESSES.md](docs/HARNESSES.md).

## Verifiable by outsiders: attestation

A Casa company can publish a signed, hash-chained, tamper-evident record of the work it
has done, and anyone can verify it offline. The format (CAF) is an open standard, not a
Casa export: the spec is [docs/CAF-SPEC.md](docs/CAF-SPEC.md), the story is
[docs/ATTESTATION.md](docs/ATTESTATION.md), and
[examples/caf-emit-minimal](examples/caf-emit-minimal/) is a conforming emitter that
shares no code with Casa. Rendering is `node scripts/brain.mjs attest company-brain`;
signing and verification are the sidecars in `caf/`.

## Getting started

1. Make a new, empty project folder for your company and open it in Claude Code,
   or open a project that already exists. Casa works for both.
2. Install:

   ```
   /plugin marketplace add https://github.com/Capx-AI/casa
   /plugin install capx-casa
   ```

3. Run `/casa-start`. For a new idea it infers most of the setup from your
   one-liner, confirms it in one batch, and shows you a draft plan midway; the
   whole thing is about 6 to 9 exchanges. For an existing business it scans the
   project first and asks only what it cannot infer. A raw idea gets validated
   before anything is built; a running business skips ahead, with unfinished
   foundations surfaced as catch-up work.
4. Every session after that, Casa greets you with your company, level, north star,
   binding constraint, and next action. Run `/casa` to act on it.

The full walkthrough is in [docs/ONBOARDING.md](docs/ONBOARDING.md).

## Updating Casa

When a new version is pushed, refresh the marketplace, update the plugin, and
reload it into your current session:

```
/plugin marketplace update capx-casa
/plugin update capx-casa@capx-casa
/reload-plugins
```

`/reload-plugins` activates the new skills and commands without restarting Claude
Code. Notes:

- The marketplace and the plugin are both named `capx-casa`. If `/plugin
  marketplace list` shows it under a different alias, use that name in steps 1
  and 2.
- Casa is versioned by git commit, so every push counts as an update. If
  `/plugin update` reports "already up to date" when you know there are new
  commits, run the marketplace update first (it re-fetches the repo).

## Learn more

- [docs/FAQ.md](docs/FAQ.md): cost, privacy, API keys, what Casa will and will
  not do on its own.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the engine works, for
  contributors.
- [CONTRIBUTING.md](CONTRIBUTING.md): playbooks are the headline contribution;
  skills, agents, and engine fixes are welcome too.

## License

MIT. The skills, agents, loops, router, playbooks, and CAF implementation in this
repository are free to use, modify, and build on.

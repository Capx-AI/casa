# Getting started with Capx Casa

Capx Casa is an open-source Claude Code plugin: a control plane for building and
running a company from your terminal. It runs inside your own Claude Code, on your
own plan. This is the full walkthrough, from install to a working rhythm.

## 1. Install the plugin

Open the folder for your company in Claude Code. A brand-new empty folder works,
and so does a project that already exists. Then:

```
/plugin marketplace add https://github.com/Capx-AI/casa
/plugin install capx-casa
```

This adds the commands, the playbook library, the routing engine, the recurring
loops, and the session greeting. It adds no hosted service and no separate login.
Everything Casa records about your company lives in a `company-brain/` folder as
plain text you can read and edit, versioned in your own git.

## 2. Set up your company

```
/casa-start
```

What happens next depends on where you are starting from.

**Starting from an idea (empty folder).** Give Casa your one-liner. It infers most
of the setup from that sentence (what the business is, who it serves, how it makes
money) and confirms its guesses with you in one batch instead of interrogating you
field by field. Expect about 6 to 9 exchanges in total. Midway through, Casa shows
you a draft of the plan it is forming, so you can correct course before the final
tuning questions. A raw idea always starts with validation: evidence of demand and
a clear GO or KILL before anything gets built.

A new idea-stage company should also run Phase 0 (a local website,
a one-pager, a short web deck, then publish-readiness) before or alongside those
first validation plays. Casa does not build or host the site; the harness writes
static files under `company-brain/outputs/`. Publish-readiness documents the gate
and does not go live. Existing businesses keep their stage floor; incomplete Phase 0
is catch-up, not a send-back to Level 0.

**Starting with an existing business.** Casa reads your project first: the README,
the docs, the manifests, the source. It infers what kind of business this is and
how far along you are, then confirms everything in one batch and asks only the
questions it could not answer from the files. You are never sent back to
validation for a business that is already running; anything foundational you have
not done yet simply shows up as catch-up work you can take or skip.

Either way, Casa then builds your plan: it selects the playbooks that fit this
business, puts them in order, and starts you at the right level. Review it with
`/casa-map` and approve it.

## 3. Your first session

Every time you open the project, Casa greets you before your first message with
the state of the company: the name, the level, the north star, the one do-or-die
constraint and which departments are leading on it, the next action, anything
waiting on you, and any recurring work that is due.

Then run:

```
/casa
```

This is the front door. Casa reads the whole business, tells you in plain English
where things stand and the one move it recommends and why, and asks before doing
anything. You can say yes, ask for something else, or name a goal in your own
words ("I want to get the landing page live this week") and Casa routes it to the
right work.

If you ever feel lost, `/casa-help` prints one screen: where you are, the main
commands, and what to run right now.

## 4. The work loop

The day-to-day rhythm is short:

1. **Casa proposes, you approve.** `/casa` recommends the move; when you say go,
   the work is routed to the specialist that owns it and produced as a real
   artifact (a research memo, a landing page, a pricing model), not an outline.
2. **The work gets checked.** `/casa-review` puts the artifact in front of a panel
   of critics (an honest-numbers analyst, a skeptical customer, a red-team
   investor, and others). You address what matters, then the work counts as done
   and the plan advances to whatever it unblocked.
3. **Some steps wait on you.** When a step needs something only you can do in the
   real world (sign up for a service, make a payment, make a judgment call), Casa
   parks it under "Waiting on you" in your greeting instead of pretending it is
   done or silently stalling. Clear it when you have done the thing, and the plan
   moves on.

You never need to remember where you left off. The greeting and `/casa` carry the
state between sessions.

## 5. Approvals and autonomy

Casa asks before anything that matters. How much it asks is up to you, per
department:

- **auto**: routine, reversible work in that department runs without asking.
- **approve first**: Casa proposes and waits for your yes.

Above those dials sits a line no setting can cross: spending money, publishing
anything public, shipping code, and anything destructive always stop for your
explicit approval, no matter how the dials are set.

```
/casa-approvals
```

shows everything waiting for your decision, lets you approve or reject each item,
and lets you view or change the dials. Blocked work resumes as soon as you clear
it, even if it was started in another terminal.

## 6. Going faster

- `/casa-parallel` takes one big task and splits it across parallel workers when
  the pieces are genuinely independent, then merges and verifies the result. Good
  for research sweeps, content kits, and multi-part builds.
- `/casa-board` shows the whole company as department lanes, with the lanes that
  resolve your constraint in the lead, and can draft several independent plays at
  once.
- `/casa-department Growth` (or any function) focuses a session on one lane when
  you want depth instead of breadth.

Work done in any terminal is written to a shared log, so you can run marketing in
one window and engineering in another and Casa still holds one coherent picture.

## 7. Updating

When a new version is pushed:

```
/plugin marketplace update capx-casa
/plugin update capx-casa@capx-casa
/reload-plugins
```

`/reload-plugins` activates the new version without restarting Claude Code. If
`/plugin update` says "already up to date" when you know there are new commits,
run the marketplace update first; it re-fetches the repo.

## What stays free

Everything in this repo is MIT and free forever. Casa never charges or holds
funds. Real-world actions that cost money (domains, hosting, media) remain under
your control; Casa hands the step to you to complete through a provider you
choose. See
[docs/FAQ.md](FAQ.md) for the plain answers on cost, privacy, and what Casa will
and will not do on its own.

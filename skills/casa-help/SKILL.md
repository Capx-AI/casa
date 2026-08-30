---
name: casa-help
description: The one-screen orientation. Shows where the company is in plain words, what to run now, every command grouped by what a founder wants to do, and your autonomy settings in one line. Use when you are new, feel lost, ask what can Casa do or which command do I use, or say casa help.
---

# casa-help

One screen that orients a founder in ten seconds: where the company is, what to run
now, and what every command is for. Plain language only; no engine jargon anywhere
on this screen.

## Steps

1. Check for a company. If `company-brain/profile.json` does not exist, show ONLY this
   and stop: two sentences on what Casa is ("Capx Casa builds and runs a company with
   you from this terminal. It plans the work, does the work with you, and asks before
   anything real happens.") and one instruction: run /casa-start.

2. Read the state quietly: `company-brain/NOW.md` (if present), `company-brain/dials.json`,
   and the approvals queue:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/approvals.mjs pending company-brain
   ```

3. Render the screen, compact, in four parts:

   (a) Where the company is: the company name, its stage in plain words (for example
       "validating the idea", "building toward launch", "live with first customers"),
       and the one do-or-die problem in front of it. No level numbers, no playbook ids.

   (b) What to run now: one line, normally "/casa for your briefing and the recommended
       move". If anything is waiting on the founder (pending approvals, or a
       waiting-on-you item in NOW.md), say so here in one extra line.

   (c) The command index, grouped for founders:
       - Start here: /casa (open your session: where you are and what to do next),
         /casa-start (set up or re-stage the company).
       - See the plan: /casa-map (the whole build plan), /casa-priority (your ranked
         priorities for this session), /casa-board (progress across every part of the
         company, several pieces at once).
       - Do the work: /casa-build (do the next piece of work to a finished result),
         /casa-parallel (split a big task and run the pieces at the same time),
         /casa-department (focus a session on one function, like growth or finance).
       - Check the work: /casa-review (a tough critique before you commit to something),
         /casa-readout (an honest read of your numbers), /casa-pulse (a recap of the
         last week or month).
       - Control: /casa-approvals (approve or reject queued work and set how much Casa
         does on its own), /casa-loops (the recurring work and what is due).
       - Learn: /casa-compound (save a lesson so the next run starts smarter),
         /casa-refresh (prune and update the saved lessons).
       - The rest, one line each: /casa-next (the single next best action and why),
         /casa-validate (prove real demand before building anything), /casa-strategy
         (the one-page strategy anchor), /casa-ideate (many options, critiqued, only
         the survivors), /casa-experiment (a disciplined test with a metric and a
         guardrail), /casa-synthesize (turn raw customer notes into ranked insight),
         /casa-write (copy drafted to the house standard), /casa-design (product UI
         built with production craft), /casa-promote (drafts launch and announcement
         copy, publishes nothing), /casa-cos (the chief of staff flow behind /casa),
         /casa-help (this screen).

   (d) Your autonomy settings, one line in plain words: which departments act on their
       own and which propose first and wait, read from dials.json, ending with "change
       this with /casa-approvals". Add one fixed sentence: spending money, publishing
       or announcing publicly, shipping code changes, and anything destructive or
       irreversible always stop for your approval, no matter the settings.

## Rules

- One screen. If it scrolls much past a screen, cut.
- Plain language only: no level numbers, no playbook ids, no engine terms.
- This screen never runs work. It orients and points.
- No em-dashes, no emojis.

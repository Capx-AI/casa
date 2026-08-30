---
name: casa
description: The front door to Capx Casa and the one command to remember. Start my session here. It reads the whole business and tells you in plain English where we are, the single move it recommends and why, what is in flight, and what is waiting on you, then asks before doing anything. Use when you type casa, ask what should I do or where are we, or want to open a work session.
---

# casa

The one command. It opens your session the way a chief of staff would: a short
plain-English briefing, one recommendation, and a question. It is the front-door
alias of the casa-cos flow; the detailed procedure lives in that skill.

## Steps

1. If `company-brain/profile.json` does not exist, there is no company here yet. Say one
   friendly line, for example "No company is set up in this folder yet. Run /casa-start
   and I will set one up with you." Then stop. Do not brief, do not create files.

2. Otherwise, follow the procedure in the `casa-cos` skill; this command is its front
   door alias and adds nothing to it. In short:
   - Read the business state quietly via
     `node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/cos-context.mjs company-brain` (it returns the
     binding constraint and the waiting list), plus the ledger and `company-brain/NOW.md`.
   - Give ONE plain-English briefing: where you are, the single move it recommends and
     why, what is in flight, what is waiting on the founder (pending approvals and
     waiting-on-you items), and whether two lanes could run in parallel.
   - Then ASK before doing anything. Propose and wait. Never run work, spend, publish,
     or fan out tasks until the founder says go.

## Rules

- The casa-cos body is the canonical procedure. If this file and casa-cos ever disagree,
  casa-cos wins.
- Plain English only. No playbook ids, no severity bands, no modeled speedups unless the
  founder asks for that detail.
- No em-dashes, no emojis.

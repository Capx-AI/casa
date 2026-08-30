---
name: casa-approvals
description: Your control surface. Shows everything queued and waiting for your yes, lets you approve or reject each item with a note, and shows and changes how much Casa does on its own per department. Four things always ask no matter what: spending money, publishing or announcing publicly, shipping code changes, and anything destructive or irreversible. Use when you want to approve work, see what is waiting on you, or change how hands-on Casa is.
argument-hint: "[approve|reject <task> [note]] [dial <Department> auto|approve_first]"
---

# casa-approvals

The founder-facing safety surface. One place to see what Casa is waiting on you for,
say yes or no with a note, and tune how much each department does without asking.

The brain dir is `company-brain/`. Scripts live at `${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/`.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Show the queue:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/approvals.mjs pending company-brain
   ```

   Render each pending item in plain language: what it is, which part of the company it
   came from, and why it stopped for you (it would spend money, publish or announce
   publicly, ship a code change, or do something hard to undo). If the queue is empty,
   say so in one line.

2. Approve or reject on the founder's word, always naming the item and preserving the
   note:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/approvals.mjs approve company-brain <task> [note]
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/approvals.mjs reject company-brain <task> [reason]
   ```

   Confirm back in one line what was approved or rejected. An approval means the work
   may proceed; it does not itself run the work. The skill that queued the item picks
   it up from there.

3. Show the autonomy dials. Read `company-brain/dials.json` and render each department
   in plain words: "Growth: does reversible work on its own" (auto) or "Growth: proposes
   first and waits for you" (approve_first). Then state the always-ask line in plain
   language:

   No matter how any dial is set, Casa always stops and asks before it would spend
   money, publish or announce publicly, ship code changes, or do anything destructive
   or irreversible.

   Those four map to the `always_ask` ids in dials.json (`spend_money`, `go_public`,
   `merge_to_main`, `destructive`). Render them in the plain words above; never rename
   or remove the underlying ids.

4. Change a dial when the founder asks:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/gates.mjs dial company-brain <Department> <auto|approve_first>
   ```

   Confirm the change back in plain words, and restate that the always-ask line still
   holds. No dial setting can turn it off.

## Rules

- The always-ask line cannot be turned off by any dial, by this skill, or by anyone. If
  a founder asks to disable it, explain that it is fixed and why it exists.
- Approving an item is a record, not an execution. Work resumes through the skill that
  queued it.
- Plain language in everything shown to the founder; the underlying gate ids in
  dials.json stay untouched.
- No em-dashes, no emojis.

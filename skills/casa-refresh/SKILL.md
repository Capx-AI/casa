---
name: casa-refresh
description: Prune and update the company's saved lessons so old guidance never misleads new work. Checks each saved lesson against the company as it is now, updates what has drifted, merges duplicates, and retires what no longer holds. Use periodically, or when the company has changed enough that old lessons may mislead.
---

# casa-refresh

The anti-drift sweep. A learning store that is never maintained turns into a liability:
stale lessons get applied to a company that has moved on. This keeps it honest.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Load the store and the present. Read `company-brain/learnings.jsonl`, the
   `company-brain/playbooks/` notes, recent `decisions/`, and the current
   `profile.json` and `build-map.json` (the company as it is now).

2. Check each entry against now. For each learning, ask: is this still true given the
   current stage, product, and customer? Has a later decision superseded it? Does it
   contradict another entry?

3. Act, conservatively. Update an entry that is mostly right but dated. Consolidate two
   that say the same thing into one. Retire (mark superseded, do not silently delete)
   an entry that no longer holds, with a one-line reason and the date. Preserve the
   history; supersede, never erase.

4. Report. Summarize what was updated, consolidated, and retired, and flag any
   contradiction you could not resolve for the founder to settle.

## Rules

- Supersede with a dated reason; never silently delete a learning.
- Consolidate duplicates so the store stays small and findable.
- When unsure whether a lesson still holds, flag it for the founder rather than acting.
- No em-dashes, no emojis.

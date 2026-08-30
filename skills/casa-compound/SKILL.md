---
name: casa-compound
description: Save a lesson the company learned so the next run starts smarter. Writes what worked, what did not, and the guidance for next time into the company's memory, where future sessions will find it. Use after solving something non-obvious, closing an experiment, or finishing a hard task worth not relearning.
---

# casa-compound

The compounding craft. Each unit of work should make the next easier. This captures
what was learned, while it is fresh, in a form the next session can find.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Capture while fresh. Identify the lesson: what problem, what was tried, what
   actually worked, what did not, and the guidance for next time (repeat this, avoid
   that). Pull specifics from the session, `decisions/`, and `experiments.jsonl`.

2. Check for an existing entry. Search `company-brain/learnings.jsonl` for an
   overlapping lesson. If one exists, update it rather than adding a near-duplicate.

3. Write the learning. Append a structured record to
   `company-brain/learnings.jsonl` with: a short title, the context, what worked, what
   did not, the reusable guidance, the tags (domain, level, playbook id), and the
   date. For a substantial lesson, also write a short markdown note under
   `company-brain/playbooks/<slug>.md`.

4. Keep it discoverable. If a new domain of learning appeared, make sure the company
   `CLAUDE.md` points future sessions at the store (edit inside the AUTO markers only).
   A learning no future agent finds did not compound.

5. Link forward. Note in the relevant `decisions/` or `experiments.jsonl` entry that a
   learning was recorded, so the thread is traceable.

## Rules

- Capture while the context is fresh; a lesson written a week later loses the detail
  that made it useful.
- Update over duplicate. One good entry per lesson, not five overlapping ones.
- Every learning is tagged and dated so `casa-learnings` can retrieve it.
- No em-dashes, no emojis.

---
name: casa-promote
description: Draft launch and announcement copy for a company milestone, in the channel the user names (an X post or thread, a changelog entry, a LinkedIn post, an email, a blog intro). It drafts and checks the copy to the house standard and hands it to you; it publishes nothing. Posting is always yours. Use after shipping something worth announcing.
---

# casa-promote

The announcement craft. Turns a shipped milestone into channel-specific copy that
sounds institutional, not like a hype thread. The canon is enforced, not hoped for.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Establish what shipped and why it matters. Read the relevant `decisions/`,
   `experiments.jsonl`, `build-map.json`, and `STRATEGY.md`. Name the concrete change
   and the value to the reader, not the internal effort.

2. Pick the channel and shape. X post or thread, changelog, LinkedIn, email, or blog
   intro. Match the length and structure to the channel. Lead with the value, not the
   wind-up.

3. Draft to the canon. Institutional and category-creating tone. No founder-bro voice,
   no manufactured urgency, no marketing buzzwords, no placeholder or test company
   names. Use the real company name and the locked positioning. For a Capx token or
   feature announcement, keep claims precise and avoid price or return language.

4. Enforce with the linter. Write the draft to a file, then run:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/copy-lint.mjs <file>
   ```

   Fix every error before going further. Treat buzzword warnings as a strong nudge.

5. Craft check. Run `casa-review` so the `brand-copy-critic` persona checks tone,
   clarity, and positioning consistency. Address P0 and P1 findings.

6. Hand it over. Present the final copy for the founder to post. Never publish or send
   on your own; that is a human gate.

## Rules

- Always run `copy-lint.mjs` before declaring the copy finished.
- No em-dashes, no emojis, no placeholder company names. Institutional tone.
- Never auto-publish. Drafting is the job; posting is the founder's.
- For token or feature announcements, no price, return, or financial-advice language.

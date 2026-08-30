---
name: casa-write
description: Draft founder-facing or customer-facing copy to the Capx canon, then enforce it with the deterministic linter. Covers naming, positioning, pricing-page copy, emails, blog posts, and landing copy. Use when the user needs to write or rewrite copy, or when a playbook produces a text artifact.
---

# casa-write

The writing craft. The model drafts; the linter enforces the hard rules so they never
slip. Tone is institutional and category-creating, never founder-bro.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Frame the piece. Identify the artifact to produce (from a playbook's `produces`,
   or the user's request) and its reader. Read the company brain for voice:
   `profile.json`, any locked positioning and tone in `decisions/`, and
   `design/design-spec.json` if it exists.

2. Draft to the canon. Write the copy. Every sentence earns its place. Headings say
   what the thing is or what the reader can do. No marketing buzzwords, no manufactured
   urgency, no first-person AI framing, no placeholder or test company names. Use the
   real company name and the locked positioning.

3. Enforce with the linter. Write the draft to its file, then run:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/copy-lint.mjs <file>
   ```

   Fix every error (em-dash, emoji, placeholder name) before going further. Treat the
   buzzword warnings as a strong nudge; rewrite unless the term is genuinely the
   clearest word.

4. Craft check (optional, for high-stakes copy). Run `casa-review` so the
   `brand-copy-critic` persona judges tone, clarity, and positioning consistency.
   Address P0 and P1 findings.

5. Land it. Save the artifact to its path under `company-brain/`. If it completes a
   playbook, hand to `casa-build` to mark the node done.

## Rules

- Always run `copy-lint.mjs` before declaring copy finished. The canon is enforced by
  the linter, not by memory.
- No em-dashes, no emojis, no placeholder company names, ever.
- Institutional tone. If a sentence would fit a hype thread, rewrite it.

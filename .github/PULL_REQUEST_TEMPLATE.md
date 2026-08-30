## What this changes

A short description of the change and why it is worth making.

## Type of change

- [ ] Playbook (drafted in `docs/playbook-drafts/`)
- [ ] Skill
- [ ] Agent
- [ ] Engine fix (`scripts/`)
- [ ] Docs
- [ ] Other

## Checklist

- [ ] `npm test` is green
- [ ] `npm run check` (preflight validator) passes
- [ ] Copy canon respected in founder-facing text (no em-dashes, no emojis, no
      placeholder company names; `scripts/copy-lint.mjs` is the linter)
- [ ] No new runtime dependencies (runtime scripts import only `node:` and
      relative paths)
- [ ] New behavior has tests; any changed golden values are explained below

## Notes for the reviewer

Anything that needs context: changed goldens, design decisions, follow-ups.

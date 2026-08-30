# Playbook drafts (staging)

Draft playbooks land here FIRST, never directly under `playbooks/level-N/`. The build
(`scripts/build-index.mjs`) walks `playbooks/`, so a draft placed under `playbooks/` would
change the golden member counts and break the test suite. Staging here keeps `npm test`
green while drafts are authored in parallel.

Integration (done by the coordinating session, not the drafter): review each draft, move it
to `playbooks/level-N/NNN-slug.md`, run `npm run build:index`, update the golden counts in
`tests/router.test.mjs`, and confirm `npm test` is green.

Each draft is one `.md` file with the full frontmatter contract from `docs/PLAYBOOK-SCHEMA.md`.
`department` must be one of the canonical 11: Strategy, Brand, Product, Engineering, Data,
Growth, Sales, Finance, Legal, Success, Operations. No em-dashes or emojis in copy.

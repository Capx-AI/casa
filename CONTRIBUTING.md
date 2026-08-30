# Contributing to Capx Casa

Thank you for helping build the open control plane for company-building. This
guide covers what to contribute, how the repo works, and the rules that keep it
trustworthy.

## Ways to contribute

### Playbooks (the headline contribution)

The playbook library is Casa's curriculum: 174 machine-routable procedures for
building a company. Growing it with real operating knowledge is the single most
valuable contribution.

**What makes a good playbook:**

- It encodes a real company-building job with a clear finished artifact, not
  generic advice. "Set up cohort retention analysis" is a playbook; "think about
  retention" is not.
- It knows who it is for. The frontmatter `applies_to`, `requires_traits`, and
  `excluded_traits` should keep it out of build maps where it is noise.
- It has honest edges: what must exist before it can run (`depends_on`,
  `consumes`) and what it unlocks (`produces`).
- The body is an executable workflow (steps, output spec, quality bar), tight
  enough that an operator agent can produce the artifact from it.

**The contract:** every playbook carries the machine-readable frontmatter defined
in [docs/PLAYBOOK-SCHEMA.md](docs/PLAYBOOK-SCHEMA.md). `department` must be one
of the canonical eleven, `selection_hint` is required, every `consumes` needs a
producer, and no cycles.

**The workflow:** drafts land in `docs/playbook-drafts/`, never directly under
`playbooks/level-N/`. The build walks `playbooks/`, so a draft placed there would
change the golden member counts and break the test suite. Author your draft in
`docs/playbook-drafts/`, open a PR, and a maintainer integrates it: review, move
to `playbooks/level-N/NNN-slug.md`, `npm run build:index`, update the golden
counts in `tests/router.test.mjs`, and confirm the suite is green. See
`docs/playbook-drafts/README.md`.

### Skills

Skills are the command surface (`skills/<name>/SKILL.md`, anthropics/skills
format with `name` and `description` frontmatter). Keep the body tight, bundle
any assets in the skill folder, and put rule-shaped logic in a script the skill
calls rather than in prose the model must obey.

### Agents

Agents live in `agents/<name>.md` with `name`, `description`, `tools`, and an
optional `model`. Operators produce artifacts; advisors return structured
findings, not prose.

### Engine fixes

The deterministic engine is `scripts/*.mjs`. Bug fixes and performance work are
welcome. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) first: the prime
directive is that deterministic code owns eligibility, gating, and state
mutation, and `scripts/brain.mjs` is the sole writer of brain state. A change
that moves a rule from code into an agent prompt will not be merged.

## Dev setup

```
git clone https://github.com/Capx-AI/casa
cd casa
npm test          # Node's built-in runner
npm run check     # preflight validator + the full suite
```

No `npm install` is needed to run the plugin or the tests; the runtime has zero
dependencies. Install dev dependencies (`npm install`) only if you touch the
catalog tooling (`npm run build:index` uses js-yaml, which is dev-only).

## The zero-dependency rule

Runtime scripts import only `node:` modules and relative files. No new runtime
dependencies, full stop. `js-yaml` exists as a dev-only dependency for catalog
builds. The preflight (`scripts/check-plugin.mjs`) enforces this and will fail
your PR if a runtime script imports anything else.

## The copy canon

Founder-facing text (README, docs, skill output, command text, playbook copy)
follows the Capx canon: no em-dashes, no emojis, no placeholder company names.
Tone is plain, confident, and institutional. The deterministic linter is
`scripts/copy-lint.mjs`; run it over anything founder-facing before you push.

## Provenance and licensing

Only contribute material you created or have the right to distribute under MIT.
When a playbook or prompt is adapted from another source, name the source and its
license in the pull request. Do not paste proprietary research, customer data,
private prompts, or unattributed third-party material into the repository.

Commit sign-off is required. Add `Signed-off-by: Your Name <email>` with
`git commit -s` to certify that you have the right to submit the contribution
under the repository license.

## Tests

- Add tests for what you change. The suite runs on Node's built-in runner
  (`node --test`), so a test file is just `tests/<area>.test.mjs` with no
  framework to learn.
- Keep the suite green. If your change legitimately shifts a golden value (for
  example, a new playbook changes the build-map member counts), update the
  golden in the same PR and say so in the description.
- `npm run check` must pass: it is exactly what CI runs.

## PR checklist

Before you open a pull request:

- [ ] `npm test` is green
- [ ] `npm run check` (preflight) passes
- [ ] Copy canon respected in any founder-facing text (no em-dashes, no emojis,
      no placeholder company names)
- [ ] No new runtime dependencies
- [ ] New behavior has tests; changed goldens are explained
- [ ] Playbook drafts are in `docs/playbook-drafts/`, not `playbooks/`
- [ ] No secrets, production identifiers, private paths, or internal plans
- [ ] Third-party sources and licenses are documented
- [ ] Commits include a `Signed-off-by` line

Questions or ideas that are not ready for a PR: open an issue at
[https://github.com/Capx-AI/casa/issues](https://github.com/Capx-AI/casa/issues).
By contributing you agree that your contributions are licensed under the MIT
license, and to the [Code of Conduct](CODE_OF_CONDUCT.md).

# Capx Casa contributor contract

Casa is an MIT-licensed, offline-first Claude Code plugin for planning and doing
the work of building a company. This repository is the reusable core. Hosted
services, production infrastructure, deployment trackers, private roadmaps, and
vendor-specific publishing clients do not belong here.

## Product boundary

- The plugin may read the founder's project and `company-brain/` as described in
  the onboarding documentation.
- The core contains no telemetry, hosted backend, background upload, or network
  publishing path.
- Rendering, signing, and checking a CAF attestation are local operations.
  Uploading or publishing one is outside this repository.
- Spending money, publishing, deploying, signing, sending to real users, and
  destructive actions always require explicit founder approval.
- Integrations with hosted or paid products must ship as separate opt-in packages.

## Architecture rules

1. Deterministic code owns eligibility, dependency ordering, gates, scores, and
   state mutations. Models reason and draft only inside the eligible set.
2. `scripts/brain.mjs` is the sole writer of derived company-brain state.
3. Runtime code has zero third-party dependencies. Use Node.js 20 or newer and
   imports from `node:` or relative files only.
4. The public core must stay offline. Do not add `fetch`, HTTP clients, sockets,
   upload hooks, or background publishing.
5. Do not read `.env`, private keys, credentials, or unrelated user files.
6. Never hard-code local paths, cloud identifiers, production domains, account
   numbers, deployment state, or internal planning notes.
7. Keep instructions harness-neutral where possible. Use
   `${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}` when a skill or agent references scripts.

## Repository map

- `.claude-plugin/`: plugin and marketplace manifests
- `hooks/`: local SessionStart greeting only
- `skills/`: user command surface
- `agents/`: operators and review personas
- `scripts/`: deterministic engine and local CLIs
- `playbooks/`: machine-routable company-building curriculum
- `templates/`: initial company-brain state
- `caf/`: offline attestation format, signing, and verification
- `tests/`: public core tests
- `examples/`: fictional, non-sensitive examples
- `docs/`: current user, protocol, and contributor documentation

## Development workflow

Run before opening a pull request:

```sh
npm ci
npm run lint:playbooks
npm run check
npm audit
claude plugin validate .
```

`npm run check` validates the plugin shape, runtime dependency boundary, offline
core boundary, and test suite. Tests must run from a fresh clone without sibling
repositories, private contracts, cloud credentials, or network services.

## Content and safety

- Founder-facing copy uses plain institutional language, no em dashes, no emojis,
  and no placeholder company names.
- Examples and fixtures must be obviously fictional. Do not use production-shaped
  keys or secret names as test values.
- New playbooks need clear provenance. Record source material and confirm that the
  contribution can be distributed under MIT.
- Never commit `.env` files, keys, certificates, Terraform state, cloud account
  details, deployment logs, operator trackers, or private product strategy.
- Security issues are reported through `SECURITY.md`, not a public issue.

## Change discipline

- Add tests for behavior changes and run the real unmocked suite.
- Keep generated files reproducible. Rebuild `playbooks/_index.json` with
  `npm run build:index` after playbook changes.
- Update documentation in the same change when behavior or privacy boundaries move.
- Do not put historical release diaries in this file. User-relevant release notes
  belong in `CHANGELOG.md`.

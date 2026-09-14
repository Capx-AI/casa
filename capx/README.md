# `capx/`: the seam

**This directory must stay easy to delete.**

Current residents:

- `bind.mjs`: redeem a Launchpad paste code (`CASA-xxxx-xxxx-xxxx`) against
  `https://casa.capx.ai`. Writes `company-brain/capx-bind.json` (public metadata,
  not a key).
- `terminal-code.mjs`: issue a 10-minute Terminal registration code
  (`POST /v1/companies/nonce` then signed `POST /v1/companies/code`). Casa
  decides PUBLISH or CLAIM. Prints the code. Does not print the private key.
- `profile.mjs`: signed create/update of the private token-optional company
  profile. Run this before publishing artifacts when the company has no token.
- `register.mjs`: `push` uploads a signed CAF bundle (nonce, then
  `POST /v1/attest/push`). `register` is a deprecated alias that tells you to
  use `bind.mjs`.
- `autopush.mjs`: if the brain is bound, render, sign, and push. No-op if
  unbound. Quiet fail if offline. Claude Code SessionEnd runs this; other
  harnesses follow the AGENTS.md ritual.
- `publish.mjs`: `site|one-pager|deck --dir <folder> --brain company-brain`
  validates a local static directory, uploads an immutable version, and
  atomically activates it. Public URLs are `{slug}.casa.capx.ai/` (site),
  `/one-pager/`, and `/deck/`. Each type has its own version and visibility.
  Shared caps with the service: 25 MiB total, 5 MiB per file, 500 files.
  Failed finalize leaves the previous active version unchanged.
- `artifacts.mjs`: `list --brain company-brain` and
  `activate site <version> --brain company-brain` (rollback is the same
  command on a prior version). Repeated activate is idempotent.
- `visibility.mjs`: `site public|private --brain company-brain` hides or
  shows one artifact without changing the others.
- `briefs.mjs`: `--brain company-brain` writes an approval-required change
  brief under `company-brain/outputs/artifact-change-brief/` recommending
  website, one-pager, or deck refreshes. `--draft` copies a local draft.
  This command does not publish or activate.

`--api` overrides the origin. `CASA_API` overrides the default when `--api` is
absent. The default is `https://casa.capx.ai`.

Capx Casa is, today, the tool a founder uses to build a company and launch its token on
Capx. A second version, forked from this repo's neutral core, will carry the open-source
north star instead. That fork has to remain a `git rm` away rather than a rewrite.

So every token-shaped thing lives here and nowhere else:

- eligibility criteria and scoring
- mint binding, escrow, compute runway
- registry verdict ingestion
- the `casa-attest`, `casa-launch`, `casa-eligibility` skills

Nothing under `scripts/`, `skills/`, `playbooks/`, `caf/`, or `tests/` may import from
`capx/`. Dependency points one way, always.

## The fork guarantee, stated as a test

```
rm -rf capx/ && npm run check
```

must be green. `scripts/check-plugin.mjs` asserts the import direction on every run.

If that assertion ever goes red and someone marks it flaky, the second version is dead.
It will die quietly, over about three months, and nobody will notice until they try to
fork. **Treat a red assertion as a release blocker, never a lint.**

## What is NOT token-shaped

The attestation format is not. `caf/` and `scripts/caf/` are token-agnostic and stay in
the neutral core: a founder who will never launch a token still benefits from emitting a
verifiable, tamper-evident record of what their company did, for an investor, an acquirer,
or a co-founder. Capx is one possible consumer, and it is named nowhere in that code.

# FAQ

Plain answers to the questions founders ask before installing Casa.

## What does it cost?

Nothing. Casa is MIT-licensed and free forever: every skill, agent, playbook, and
the engine. It runs inside your own Claude Code on the plan you already pay for,
so Casa adds no inference bill of its own. There is no premium tier and no
paywalled prompt.

## Do I need an API key?

No, not for normal use. Interactive use, where you are present in the terminal
and approve each move, uses your existing Claude Code configuration.

The optional headless operate mode (running loops with no human present) requires
your own API key, metered billing, and an explicit opt-in. Confirm your account
and use comply with Anthropic's current terms before enabling it. You can use
Casa fully without headless mode.

## What leaves my machine?

Casa's code transmits nothing. All company state is plain-text files in a
`company-brain/` folder inside your own project, versioned in your own git. The
plugin has no telemetry, analytics, account, hosted service, publishing client,
or SessionEnd upload hook. Your agent harness may make its own model requests
under its separate configuration and privacy policy.

## What project files does Casa inspect?

During existing-project onboarding, the deterministic scanner inventories file
names and reads `package.json` to infer basic signals. The project-scanner agent
may read the README, CLAUDE.md, documentation, manifests, and source to understand
the business. It must never read `.env` files, private keys, credentials, build
outputs, dependencies, or unrelated user directories. You can inspect or skip
the proposed scan before onboarding.

## What happens when an action costs money?

Casa never charges, prices, or holds funds. It records the step as "Waiting on
you" until you complete it through a provider you choose and approve.

## Can it really run my company?

Here is the honest answer. Casa does the department work, and does it to a
standard you can review: real research memos, real positioning, real pricing
models, real specs and copy, each checked by a critic panel before it counts.
What it does not do is cross the always-ask line on its own: spending money,
publishing anything public, shipping code, or anything destructive always stops
for your explicit approval, no matter how you set the autonomy dials. You remain
the founder. Casa makes sure the hundred other jobs are done, ordered, and
waiting on your judgment rather than your labor.

## What if I already have a business?

Casa onboards it by reading it. `/casa-start` inside an existing project scans
your files first, infers what kind of business it is and how far along you are,
confirms everything with you in one batch, and asks only what it could not infer.
You are never regressed to idea validation. Foundational work you skipped shows
up as optional catch-up items, not as a forced restart.

## How do I update?

```
/plugin marketplace update capx-casa
/plugin update capx-casa@capx-casa
/reload-plugins
```

`/reload-plugins` activates the new version without restarting Claude Code. If
the update reports "already up to date" when you know there are new commits, run
the marketplace update first; it re-fetches the repo.

## Where do I report issues?

On GitHub: [https://github.com/Capx-AI/casa/issues](https://github.com/Capx-AI/casa/issues).
Bug reports, feature requests, and playbook proposals each have a template. If
you want to contribute a fix or a playbook yourself, start with
[CONTRIBUTING.md](../CONTRIBUTING.md).

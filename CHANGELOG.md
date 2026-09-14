# Changelog

## 0.3.0

- Added level-0 plays `phase0-company-brief`, `phase0-architecture`,
  `phase0-product-flow`, `phase0-data-model`, `phase0-roadmap`, `phase0-org-chart`,
  `phase0-task-plan`, optional `phase0-token-flow`, and approval-gated `phase0-publish`.
- Updated `phase0-website`, `phase0-one-pager`, and `phase0-pitch-deck` to consume
  the company brief. The website renders a Mermaid diagram inline and links both
  collateral pages. `phase0-publish-readiness` checks the technical artifacts,
  JSON references, Mermaid sources, and face build, recording its result in README.md.
- Added zero-dependency, offline `scripts/face.mjs build|check <brainDir>` and
  `npm run face`. The manifest includes source hashes, completion-derived task
  and roadmap statuses, and each agent's last ten matching ledger events.
- Added `brain.mjs complete --agent <name>` attribution; `casa-build`, `casa-board`,
  and `casa-department` pass their dispatched operator's name.
- Extended the router's Phase 0 set without level gates or automatic seeding;
  rebuilt the catalog and added face, attribution, membership, and seed checks.
- Updated onboarding, the AGENTS.md face ritual, and the separately installed
  integration's publication commands. Bumped package and plugin manifests to 0.3.0.

## 0.2.0

- Reduced the public repository to the reusable, offline Casa plugin core.
- Removed hosted-service code, production infrastructure, deployment tracking,
  internal plans, and vendor-specific publishing clients.
- Removed automatic SessionEnd publishing.
- Made fresh-clone tests self-contained.
- Hardened unattended command execution and test-runner invocation.
- Added dependency auditing, CodeQL, dependency review, Dependabot, ownership,
  and a private security-reporting policy.
- Reconciled privacy, architecture, onboarding, and contributor documentation
  with the implemented offline boundary.

---
id: open-source-strategy
title: Open Source Strategy
level: 2
summary: Decide open-core versus fully-OSS, choose the license, draw the line between what is open and what is commercial, and design the open-source-to-revenue bridge before a single repo goes public.
applies_to:
  types:
    - saas
  requires_traits:
    - technical_audience
  excluded_traits:
    - pre_idea_only
relevance: core
department: Strategy
criticality: core
existential_at: [building, launched]
model_fit: [self_serve]
selection_hint: The defining strategic choice for a developer tool with a bottom-up motion. License and open-core boundary are nearly irreversible once a public repo and a contributor base exist, so settle them before the first public commit.
depends_on:
  - positioning-canvas
soft_after:
  - tech-stack-selection
produces:
  - oss_strategy
consumes:
  - positioning
effort: M
leverage: critical
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: oss-strategy-locked
---
# Open Source Strategy

For a bottom-up developer tool, the license and the open-core boundary are the
business model, not a legal footnote. Engineers adopt what they can read, run
locally, and self-host before they ever talk to sales, so the source IS the
funnel. But every line you open is a line a competitor or a cloud provider can
resell, so the boundary between the open core and the commercial edge decides
whether adoption ever converts to revenue. This choice is close to irreversible:
relicensing a project that already has external contributors requires their
consent or a contributor license agreement signed up front, and clawing back
something the community already runs in production destroys the trust the whole
motion depends on. Settle it before the first public commit.

## Procedure

1. Pick the model: fully-OSS versus open-core versus source-available. Fully-OSS
   (everything under a permissive or copyleft license) maximizes adoption and
   trust but forces revenue entirely onto a hosted or support layer. Open-core
   keeps a permissively licensed core and gates specific enterprise capabilities
   (SSO/SAML, RBAC, audit logs, multi-tenant control plane, SLAs) behind a
   commercial license. Source-available (BSL, Elastic License, SSPL) shows the
   code but restricts competing hosted use. Name which one and why in one
   paragraph tied to the positioning artifact.
2. Choose the license deliberately. MIT/Apache-2.0 for maximum permissive
   adoption (Apache adds an explicit patent grant, preferred for anything a
   company will embed). MPL-2.0 or LGPL for file-level or library copyleft.
   AGPL-3.0 when you want the SaaS-loophole closed so a competitor who hosts your
   code must open their modifications (the classic open-core defensive pairing
   with a commercial license sold to those who cannot accept AGPL). BSL with a
   change-date that converts to Apache after N years when you need a hosting moat
   now but want a credible open future. Record the exact SPDX identifier.
3. Draw the open/commercial line as a written list. Enumerate, capability by
   capability, what lives in the open core (the thing an individual engineer
   self-hosts and loves) and what is commercial-only (the thing a company with a
   security team and a procurement process pays for). The rule of thumb: open
   what wins the developer, charge for what the buyer (the platform team, the
   CISO) needs. Never gate something an individual already relies on.
4. Set the contribution and ownership posture. Decide whether you require a CLA
   or a DCO sign-off, who holds the copyright, and whether the project will live
   under your company org or a foundation. A CLA preserves your right to
   relicense and to sell the commercial edition; a DCO is lighter-weight and more
   community-trusted. This choice constrains step 1 forever.
5. Design the open-source-to-revenue bridge. Name the conversion path: free
   self-host -> hosted/managed tier, or free core -> paid enterprise features, or
   free tool -> paid support and SLA. Define the specific trigger that moves a
   user across it (team size, production use, a gated capability they hit), so the
   downstream PLG-to-sales play has a real signal to act on.
6. Pressure-test for the obvious failure modes: a cloud provider reselling your
   open core, a fork after a community-hostile relicense, and a commercial line so
   high that nobody adopts or so low that nobody pays. Write the mitigation for
   each.

## Output

`oss_strategy` in the company brain: the chosen model (fully-OSS / open-core /
source-available), the exact license with its SPDX identifier, the written
open-versus-commercial capability list, the CLA/DCO and copyright-ownership
posture, and the named open-source-to-revenue bridge with its conversion trigger.
This artifact gates the public repo, constrains api-and-sdk-design (what surface
is even open), seeds developer-community governance, and defines the upgrade
trigger the PLG-to-sales handoff watches for.

## Rules

- Open what wins the individual engineer; charge the buying organization. Never
  gate a capability the community already runs in production.
- Decide the CLA/DCO posture before the first external contribution. Relicensing
  later requires every contributor's consent and is how projects fracture.
- The license is an SPDX identifier and a dated decision, not a vibe. Source-
  available is not open source; say which one you are and do not blur it in copy.

This is a founder-gated, hard-to-reverse decision. Revisit only on a deliberate,
dated supersession (a license change, an open-core boundary move), never
casually, and always with the contributor and trust consequences written down.

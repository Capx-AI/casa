---
id: api-and-sdk-design
title: API and SDK Design
level: 3
summary: "Design the API and SDK surface a developer tool lives or dies by: ergonomics, versioning, idempotency, error design, and a measured time-to-first-successful-call."
applies_to:
  types:
    - saas
  requires_traits:
    - technical_audience
  excluded_traits:
    - pre_idea_only
relevance: core
department: Engineering
criticality: core
existential_at: [building, launched]
model_fit: [self_serve]
selection_hint: The product surface for any developer tool. Run once the open/commercial boundary and stack are set, because the public API contract is the hardest thing in the company to change after adoption.
depends_on:
  - tech-stack-selection
  - open-source-strategy
soft_after:
  - prd-drafting
produces:
  - api_design
consumes:
  - tech_stack
  - oss_strategy
effort: L
leverage: critical
reversibility: hard
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: api-contract-frozen
---
# API and SDK Design

For a developer tool the API is the product. The single metric that predicts
adoption is time-to-first-successful-call (TTFSC): the wall-clock minutes from
landing on the docs to a 200 response with real data. Everything in this play
exists to drive that number down. The API contract is also the most expensive
thing in the company to change, because every breaking change breaks code your
users have already shipped to production. A public endpoint shape, a field name,
an auth scheme, and an error format are commitments you keep for years. Design
them as if they are permanent, because to your users they are.

## Procedure

1. Pick the paradigm and shape from the use, not from fashion. REST with
   resource-oriented nouns for CRUD-shaped tools; gRPC for low-latency,
   strongly-typed service-to-service; GraphQL only when clients genuinely need to
   shape their own response graph. Whatever you pick, be consistent: plural
   resource collections, predictable nesting, cursor-based pagination (never
   offset at scale), and ISO-8601 timestamps everywhere.
2. Design authentication for the first five minutes and for production. Issue a
   test-mode key the moment someone signs up so the first call needs zero setup.
   Support bearer API keys for server-side, scoped keys for least privilege, and
   a clear path to OAuth for tools acting on behalf of a user. Make the live-mode
   versus test-mode distinction visible in the key prefix.
3. Make every mutating call idempotent. Accept an `Idempotency-Key` header on all
   POST/PATCH/DELETE so a retried request after a network blip does not double-
   charge, double-create, or double-send. Document the dedup window and the
   replay semantics. This is the difference between a toy and something a team
   trusts with money or production data.
4. Design errors as a first-class API. Return a stable machine-readable `code`, a
   human `message`, a `type`, and where relevant a `param` and a doc URL, in a
   consistent envelope across every endpoint. Use HTTP status correctly (4xx the
   caller can fix, 5xx you own), and never leak stack traces. Good error design is
   the difference between a developer self-unblocking in seconds and filing a
   ticket.
5. Version explicitly and commit to a deprecation contract. Choose the scheme
   (URL `/v1`, header, or date-based pinning), publish the additive-changes-are-
   not-breaking rule, and write the deprecation policy: minimum notice window,
   sunset headers, and a migration guide obligation. Decide it now, because you
   will live by it.
6. Ship SDKs as the real interface, generated where possible. Maintain an
   OpenAPI/protobuf spec as the source of truth and generate typed clients
   (TypeScript first, then Python, then Go) so the docs, types, and server never
   drift. Hand-polish the ergonomics: sensible defaults, auto-retry with backoff
   on idempotent calls, typed errors, and a one-import quickstart object.
7. Instrument TTFSC and rate limits. Emit an event on first successful authed
   call per account so the funnel is measurable downstream, and define rate-limit
   tiers with `429` plus `Retry-After` and clear headers, never a silent drop.

## Output

`api_design` in the company brain: the chosen paradigm and resource model, the
auth and key scheme, the idempotency contract, the error envelope specification,
the versioning and deprecation policy, the OpenAPI/protobuf source-of-truth spec,
the SDK language plan, and the TTFSC instrumentation point. This artifact is the
contract developer-docs-and-dx documents and the first-successful-call funnel the
whole bottom-up motion is measured against.

## Rules

- Optimize relentlessly for time-to-first-successful-call. A test key on signup
  and a copy-paste quickstart beat any amount of feature surface.
- The public contract is near-permanent. Additive changes are safe; renames,
  removals, and semantic changes are breaking and require a version and a
  deprecation window. Never break a shipped client silently.
- Every mutating call is idempotent and every error is machine-readable. These
  two properties are what let a real team depend on you.

The API contract is hard to reverse. Extend it additively as the product grows;
take a breaking change only through the versioning and deprecation contract
defined here, never as a quiet edit.

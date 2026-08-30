# Playbook schema (the machine-readable contract)

Every playbook is a markdown file with a YAML frontmatter header. The router reads
ONLY the frontmatter to plan (cheap, like reading a manifest, not the source). The
body is the workflow Casa executes when the playbook runs.

## Frontmatter fields

```yaml
id: incorporate-us-entity         # stable kebab-case id, matches the file slug
title: Incorporate a US entity
level: 1                          # 0..8, or "always-on"
summary: Form the legal entity, EIN, registered agent.

# SELECTION  (which businesses this applies to)
applies_to:
  types: ["*"]                    # saas, marketplace, ecommerce, local-service, crypto, content, hardware, ...  "*" = all
  requires_traits: []             # e.g. ["takes_payments", "us_based", "b2b", "has_token"]
  excluded_traits: ["pre_idea_only"]
relevance: core                   # core | recommended | optional | conditional
selection_hint: >                 # one line that helps the model disambiguate (REQUIRED)
  Needed by any business that will take revenue or raise. Skip if only validating.

# ORDERING  (the DAG edges)
depends_on: ["validate-idea"]     # hard predecessors (ids); must be done first
soft_after: ["name-and-brand"]    # preference, not a hard gate
produces: ["legal_entity", "ein"] # artifacts/capabilities this unlocks
consumes: ["confirmed_business_idea"]

# RECOMMENDER  (scoring and gates)
effort: M                         # S | M | L | XL
leverage: high                    # low | med | high | critical  (upside magnitude WHEN done)
reversibility: hard               # easy | medium | hard
human_gate: true                  # requires explicit founder approval to execute
blocks_revenue: true              # money cannot legally or operationally flow until done
recurring: false                  # true = a loop (scheduled cadence), not a one-time checkbox
typical_milestone: company-exists # CPM milestone anchor for slack

# ORG + FITNESS  (department is REQUIRED; the rest tune the model-aware fitness score)
department: Legal                 # REQUIRED. one of: Strategy Brand Product Engineering Data
                                  #   Growth Sales Finance Legal Success Operations
criticality: existential          # existential | core | growth | optional  (survival CONSEQUENCE
                                  #   of NOT doing it at its stage; default growth). Distinct from
                                  #   leverage. Drives CRIT_W in the score.
existential_at: [revenue]         # optional stage list; promotes this play to existential within
                                  #   those stages only (idea|landing|building|launched|revenue|scaling)
model_fit: [recurring]            # optional. recurring|transactional|self_serve|sales_led|
                                  #   marketplace|physical_goods|local. Empty = model-agnostic.
                                  #   A match tilts the score up for that business model.
```

The fitness score (scripts/router.mjs) is `leverage * urgency(slack) * stageFit * fitFactor *
revenue / effort * pulseWeight`, where `stageFit` discounts work far below the company's level
and `fitFactor = clamp(CRIT_W[effective criticality] * modelFit, [0.7, 1.8])`. The north star
(scripts/northstar.mjs) is DERIVED from the profile (not a playbook field) for display and to
seed the initial pulse. See docs/history/DEEP-ENGINE-PLAN.md.

## Worked example: a Level 0 playbook

```yaml
id: opportunity-scan
title: Opportunity Scan
level: 0
summary: Mine trends, communities, reviews, and search data for underserved niches.
applies_to: { types: ["*"], requires_traits: [], excluded_traits: [] }
relevance: core
selection_hint: First step of validation. Surfaces and scores evidence of demand.
depends_on: []
soft_after: []
produces: ["opportunity_brief", "candidate_niches"]
consumes: []
effort: M
leverage: critical
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: validated-opportunity
```

## Gradeable output spec (optional): `deliverable` + `rubric`

The highest-value playbooks (every `criticality: existential` one plus the most
important `criticality: core` ones) carry an optional, machine-gradeable spec of
what a good deliverable IS. The `casa-review` grade mode uses it to score a
completed deliverable against a checkable bar and offer a make-it-better path.
Both fields are OPTIONAL;
a playbook without them is still valid. They are derived from the playbook's own
Procedure / Output / Rules body, not invented.

- `deliverable`: an object describing the artifact the playbook produces.
  - `artifact` (string, required within the block): a one-line description of the
    file or output the playbook produces.
  - `sections` (list, required within the block): the 3-7 concrete, checkable
    sections a complete deliverable must contain.
  - `max_words` (number, optional): a hard ceiling so a grader can flag
    over-production.
- `rubric` (string): one to three sentences describing what a PASSING deliverable
  must demonstrate, specific to this playbook (the bar a grader checks against).

```yaml
deliverable:
  artifact: A unit-economics model with cohort CAC, gross margin, realized LTV, contribution margin, and payback by channel, written to the company brain.
  sections:
    - Fully-loaded, paid-only, time-lagged CAC
    - Gross margin with honest COGS
    - Realized cohort LTV over a capped horizon
    - Contribution margin
    - Payback and LTV-to-CAC by cohort and channel
  max_words: 900
rubric: Passes only when CAC is paid-only, fully loaded, and time-lagged (never blended) for scaling decisions, LTV is realized over a capped horizon rather than an infinite-horizon projection, and every number is segmented by cohort and channel rather than blended into an average that hides failing channels.
```

## CI lint rules (enforced on `playbooks/_index.json`)

1. Every `id` is unique and matches its file slug.
2. Every `consumes` value is `produces`d by at least one other playbook.
3. No dependency cycles (the graph topologically sorts).
4. `selection_hint` is present and non-empty.
5. `level`, `relevance`, `effort`, `leverage`, `reversibility` use allowed values.
6. `recurring: true` playbooks declare a cadence in the body.

## Contributing a playbook

The original long-form source drafts live in the maintainers' archive and are not
part of this repo. Contributions go through `docs/playbook-drafts/`: author the
draft there with the full frontmatter contract above, and see
`docs/playbook-drafts/README.md` plus the repo `CONTRIBUTING.md` for the
integration workflow. To adapt an existing long-form process into a playbook:
lift its preconditions and unblocks into `depends_on` / `produces` / `consumes`,
set the selection fields, and condense the body into an executable workflow.

Note: a `source:` frontmatter field appeared in earlier versions of the catalog.
It is no longer part of the contract and is being stripped; do not add it to new
playbooks.

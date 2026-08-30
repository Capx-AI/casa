---
id: services-delivery-and-utilization
title: Services Delivery and Utilization
level: 5
summary: Operationalize a services business end to end through SOW scoping, a repeatable delivery process, staffing and bench management, and the billable utilization rate that is its north star.
applies_to:
  types:
    - b2b-service
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Operations
criticality: core
existential_at: [revenue, scaling]
model_fit: []
selection_hint: The operating core of a services firm. Run once the business delivers paid engagements; billable utilization is the metric the whole business turns on, so this is monitored, not a one-time setup.
action: "Standardize a statement-of-work template, then instrument billable utilization per person against a 70-to-85-percent target band this week."
depends_on: []
soft_after: []
produces:
  - delivery_ops
consumes: []
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: delivery-ops-live
---
# Services Delivery and Utilization

RECURRING. A services business lives or dies on billable utilization. This play
operationalizes delivery end to end: scoping work into a clear statement of work,
running a repeatable delivery process, staffing engagements and managing the bench,
and monitoring the billable utilization rate that is the north star of a services
firm. Idle skilled capacity is the cost that sinks a services business, and an
over-booked team burns out and misses delivery; utilization is the dial between them.

## Procedure

1. Standardize scoping. Every engagement starts from a statement of work that fixes
   deliverables, acceptance criteria, timeline, staffing, and the billing basis (time
   and materials, fixed fee, or retainer). Scope creep without a change order is the
   first leak in services margin.
2. Define the delivery process: the stages an engagement moves through, the roles and
   responsibilities at each stage, the status cadence with the client, and the
   quality gate before delivery. A repeatable process is what lets utilization rise
   without quality falling.
3. Manage staffing and the bench: match each engagement to the right level and skill,
   plan allocations across the pipeline, and track who is on the bench and for how
   long. Bench time is unbilled cost; the staffing plan exists to minimize it without
   overcommitting people.
4. Instrument utilization precisely: billable hours over available hours, per person
   and blended, against a target band (for example 70 to 85 percent depending on
   role). Separate billable, internal, and bench hours so the rate is honest.
5. Read utilization on a cadence, tie every dip to a cause (a gap between engagements,
   a scoping miss, an under-staffed pipeline), and feed the signal to staffing and
   sales. Record the delivery process, the staffing plan, and the utilization baseline
   in `delivery_ops`.

## Output

`delivery_ops`: the SOW template, the delivery process and quality gate, the staffing
and bench plan, and the billable-utilization baseline with its target band, written
to the company brain. Cadence: a weekly utilization and staffing read and a monthly
utilization-by-person and margin review, with an off-cadence pass when an engagement
ends without a next one booked. Feeds the revenue forecast and capacity planning.

## Rules

- Utilization is the north star, but it is a band, not a maximum. Sustained
  utilization above the band predicts burnout and slipped delivery; below it predicts
  margin loss.
- No statement of work, no delivery. Unscoped work cannot be staffed, billed, or held
  to an acceptance bar.
- Bench is a signal, not a verdict. Persistent bench means sales and delivery are out
  of phase; route it to the pipeline, not to layoffs by reflex.

Monitor utilization as a standing dial rather than a one-time setup. The process is
installed once and the rate is read every cadence.

---
id: warranty-and-rma-operations
title: Warranty & RMA Operations
level: 5
summary: Define the product warranty, stand up the RMA (return merchandise authorization) pipeline, set the repair-versus-replace economics, and run the return-rate loop that feeds defects back into QA and design.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Success
criticality: core
existential_at: [revenue, scaling]
model_fit: [physical_goods]
selection_hint: Run once units are in customers' hands. A hardware company without an RMA pipeline turns every defect into a refund and a lost customer. Warranty is both a customer-trust promise and a financial liability that must be reserved for and managed.
action: "Write warranty terms you can honor at the predicted failure rate, set a per-unit reserve, and stand up the RMA pipeline."
depends_on:
  - hardware-qa-and-reliability
soft_after:
  - retail-and-channel-distribution
produces:
  - rma_ops
consumes:
  - hardware_qa
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: rma-pipeline-live
---
# Warranty & RMA Operations

RECURRING. Every hardware product will have units fail in the field. What separates a
durable brand from a refund machine is the system that handles those failures: a clear
warranty, a fast RMA pipeline, and an economic decision about whether to repair, replace,
or refund each return. Warranty is simultaneously a promise to the customer and a balance-
sheet liability that has to be reserved for. The return rate is also the company's
sharpest field-quality signal, and this loop is where that signal turns into a fix. This
playbook builds the pipeline and the economics, and wires the return-rate loop back into
QA and design.

## Procedure

1. Define the warranty terms. Set the coverage period, what is covered (defects in
   materials and workmanship) versus excluded (misuse, accidental damage, wear), the
   remedy (repair, replace, or refund), and who pays return shipping. Write terms you can
   honor at the failure rate reliability predicts.
2. Reserve for the liability. Using the field failure rate and per-unit service cost from
   the QA program, set a warranty reserve per unit sold and accrue it, so warranty cost is
   funded, not a surprise in a bad quarter.
3. Build the RMA pipeline. Stand up the customer-facing return request, an RMA number and
   prepaid label, triage and diagnosis on receipt, the repair or replacement step, and the
   ship-back, with status visible to the customer at each stage. Define the target
   turnaround time and track it.
4. Set the repair-versus-replace economics. For each failure mode, compute the cost to
   diagnose and repair (labor, parts, test) against the cost to replace with a new or
   refurbished unit, and route each RMA to the cheaper outcome that still meets the
   warranty promise. Capture recovered units into a refurbished pool where viable.
5. Run the return-rate loop. Track the return rate and RMA reasons, build a Pareto of
   failure modes, reconcile against the factory DPPM and the predicted field failure rate,
   and open a corrective action on any mode that is over-indexing, feeding it back into QA
   and the design package.
6. Handle the channel case. Where product sells through retail or distribution, define
   advance-replacement, cross-ship, and end-customer-versus-partner RMA handling so a
   return at the counter does not become a stranded unit.

## Output

`rma_ops` in the company brain: the warranty terms and reserve, the RMA pipeline and its
turnaround metric, the repair-versus-replace decision rules, and the return-rate loop with
its failure-mode Pareto and corrective-action log. Cadence: continuous intake with a
monthly review of return rate, RMA reasons, turnaround, and warranty cost. Feeds the QA
corrective-action loop, the warranty reserve in finance, and the spare-parts and
aftermarket plan.

## Rules

- Reserve for warranty per unit at point of sale. Warranty is a known liability, not a
  cost to discover when returns spike.
- Every RMA is logged with a diagnosed failure mode, not just refunded. A refund with no
  root cause throws away the most valuable quality data the company gets.
- Route repair versus replace by real cost, but never below the warranty promise. Saving
  a few dollars by shipping a slow repair the customer resents loses the customer.
- Reconcile return rate against predicted field failure rate. A return rate well above
  prediction means a field mode the factory screen is missing.

Revisit on a return-rate spike, a new failure mode, a warranty-term change, or a new
channel. Deepen this same pipeline rather than running a parallel one.

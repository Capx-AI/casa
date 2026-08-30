---
id: hardware-qa-and-reliability
title: Hardware QA & Reliability
level: 3
summary: Stand up the reliability-engineering program that proves a device survives its service life, from accelerated stress testing (HALT/HASS) and burn-in to DPPM defect tracking and the field-failure-rate loop.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Operations
criticality: core
existential_at: [launched, revenue]
model_fit: [physical_goods]
selection_hint: Run once a production line exists. Reliability is what turns a unit that works on the bench into one that survives years in the field. Unmeasured defect rates surface as a flood of returns and a destroyed reputation after launch, when fixing them is most expensive.
action: "Define the target service life and field-failure rate, then run HALT on early units to break them and widen margin."
depends_on:
  - contract-manufacturing-setup
soft_after:
  - hardware-prototyping-and-dfm
produces:
  - hardware_qa
consumes:
  - manufacturing_line
effort: L
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: reliability-baselined
---
# Hardware QA & Reliability

RECURRING. A hardware product is a promise that the unit still works in two years, after
heat, vibration, drops, humidity, and ten thousand power cycles. Reliability engineering
is how that promise is tested before customers test it for you. This playbook builds the
program that finds the weak design margins, sets the line defect rate, and closes the
loop from a field return back to a corrective action. The metric that matters most is the
field failure rate, and it is set long before any unit fails: by the margins found in
stress testing and the defects caught (or missed) at the line.

## Procedure

1. Define the reliability requirement. State the target service life, the operating and
   storage environment (temperature, humidity, vibration, ingress), the duty cycle, and
   the acceptable field failure rate (for example, under a stated annualized failure rate
   over the warranty term). This is the bar everything tests against.
2. Run HALT (Highly Accelerated Life Testing) on early units. Step temperature, thermal
   cycling, vibration, and combined stress past spec until the unit fails, to find the
   weak link and the operating and destruct margins. The goal is not to pass; it is to
   break it on purpose and widen the margin before production.
3. Establish HASS (Highly Accelerated Stress Screening) for production. Convert the HALT
   margins into a fast production screen that precipitates latent defects (cold-solder
   joints, marginal components) without consuming life, and run it on the line or a
   sampled basis per the AQL plan.
4. Specify burn-in for units with infant-mortality risk (anything with power
   electronics or electrolytics): power and exercise units at elevated temperature for a
   defined dwell so early-life failures happen in the factory, not the field.
5. Track defects quantitatively. Measure DPPM (defects per million) at incoming
   inspection, in-line, and end-of-line; build a Pareto of defect modes; and run a
   closed-loop corrective action (8D or equivalent) on the top modes, feeding fixes back
   into the design package, the BOM, and the CM process.
6. Close the field loop. Once units ship, compute the field failure rate and the early
   return rate from RMA data, compare them against the target and the factory DPPM, and
   open a corrective action on any field mode the factory screen missed.

## Output

`hardware_qa` in the company brain: the reliability requirement, the HALT margins, the
HASS and burn-in screens, the DPPM baseline and defect Pareto, and the field-failure-rate
loop with its corrective-action log. Cadence: continuous on the line, with a monthly
reliability review of DPPM and field-failure trends. Feeds warranty reserve sizing, the
RMA process, and design and CM corrective actions.

## Rules

- The field failure rate is set in design and at the line, not discovered in returns. If
  it was not stress-tested and screened, the field is the test.
- HALT is meant to break the unit. A HALT that passes cleanly tells you nothing about
  margin; push to destruct and record where it failed.
- Every top defect mode gets a closed-loop corrective action with a verified fix, not a
  rework note. Sorting bad units without fixing the cause guarantees the next lot repeats
  it.
- Reconcile factory DPPM against field failure rate. A large gap means the line screen is
  missing a real-world stress.

Revisit on a design or component change, a supplier change, a DPPM excursion, or a field
failure spike. Deepen this same program rather than running a parallel one.

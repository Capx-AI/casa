---
id: contract-manufacturing-setup
title: Contract Manufacturing Setup
level: 3
summary: Select and qualify a contract manufacturer, commission tooling, run a pilot and first production run, and stand up incoming and outgoing QA.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Operations
criticality: core
model_fit: [physical_goods]
selection_hint: Run once a released design package and a costed BOM exist. Turns a validated design into repeatable units at volume. The tooling and CM choice are expensive to reverse, so qualify before you commit.
depends_on:
  - hardware-prototyping-and-dfm
soft_after:
  - supplier-sourcing-and-cogs
produces:
  - manufacturing_line
consumes:
  - bom
effort: XL
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: production-line-ready
---
# Contract Manufacturing Setup

A validated prototype is one good unit. A business needs thousands of identical good
units, on time, at the costed price. This playbook selects a contract manufacturer (CM),
commissions the tooling, proves the line with a pilot and a first production run, and
installs the quality checks that keep every unit in spec. Tooling spend and a CM
relationship are slow and costly to unwind, so this is a human-gated commitment.

## Procedure

1. Shortlist contract manufacturers against the design and BOM: process capability,
   capacity, relevant certifications, quality systems, location and logistics, minimum
   order quantities, payment terms, and IP protection. Request quotes from at least two.
2. Run a DFM review with the chosen CM. They will flag tolerances, footprints, and
   assembly steps that fight their process. Fold the changes back into the design
   package and the BOM before tooling is cut.
3. Commission tooling and fixtures (molds, jigs, test rigs). Agree ownership of the
   tooling, lead times, and the acceptance criteria for first article inspection.
4. Run a pilot build (engineering or pilot run) on production tooling. Inspect first
   articles against the drawings and the test plan; resolve every nonconformance before
   scaling. Do not skip from prototype to full run.
5. Execute the first production run. Track yield, defect modes, cycle time, and actual
   landed cost against the BOM estimate; open corrective actions on the top defects.
6. Stand up incoming quality control (component inspection), in-line and end-of-line
   test, and an outgoing acceptance sample plan. Define the quality agreement: AQL
   levels, RMA handling, and who pays for scrap and rework.

## What done looks like

`manufacturing_line` in the company brain: a qualified CM, owned tooling, a proven
pilot and first production run, documented yield and landed cost, and an operating QA
process. This unblocks inventory, fulfillment, and sustained production.

## Rules

- Never jump from prototype to full production. A pilot run on real tooling is the only
  honest test of yield and cost.
- Second-source the parts and the relationship where the risk justifies it. A single CM
  or a single supplier for a critical part is an existential dependency.
- Tooling ownership and the quality agreement are settled in writing before the first
  PO, not after the first defect dispute.

Human gate: a founder approves the CM selection and the tooling commitment before spend.
Revisit on a CM change, a yield collapse, or a volume step that needs new tooling.

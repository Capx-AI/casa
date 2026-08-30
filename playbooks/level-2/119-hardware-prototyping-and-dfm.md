---
id: hardware-prototyping-and-dfm
title: Hardware Prototyping & DFM
level: 2
summary: Iterate working prototypes, design for manufacturability, and lock a costed bill of materials before any tooling, certification, or production quote is committed.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Engineering
criticality: core
model_fit: [physical_goods]
selection_hint: The first hardware build gate. No contract manufacturer, certification, or production quote is real until a working prototype and a costed, manufacturable BOM exist.
action: "Build a functional prototype of the riskiest unknown first, then apply DFM and author a costed bill of materials."
depends_on: []
soft_after: []
produces:
  - hardware_prototype
  - bom
consumes: []
effort: L
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: true
recurring: false
typical_milestone: prototype-validated
---
# Hardware Prototyping & DFM

For a hardware business the design is the product, and a design that cannot be built
at volume, at cost, and at quality is not a product at all. This playbook drives the
loop from first functional prototype to a manufacturable design and a costed bill of
materials. It is the floor under tooling, certification, and every production quote,
which is why money cannot safely flow until it is done.

## Procedure

1. Fix the product requirements: core function, performance targets, form factor,
   environmental and durability constraints, target landed cost, and the regulatory
   regime the device must eventually clear (this scopes later certification).
2. Build functional prototypes in iterations. Start with the riskiest unknown
   (mechanism, thermals, RF, power, firmware integration) and prove each one before
   committing the surrounding design. Log every revision and what it changed.
3. Apply design for manufacturability (DFM) and design for assembly (DFA): reduce
   part count, prefer standard and second-sourced components, design tolerances the
   process can actually hold, and eliminate assembly steps that defect or slow a line.
4. Author the bill of materials (BOM): every component with manufacturer part number,
   quantity, reference designator, an estimated unit cost, and at least one approved
   alternate for any single-sourced or long-lead part.
5. Run design-for-cost and design-for-test passes: model the per-unit cost against the
   target, and define the test points and pass/fail checks a line will use to catch
   defects before they ship.
6. Produce a design package a contract manufacturer can quote from: drawings, CAD,
   gerbers or equivalent, the BOM, and the test plan. Validate one final prototype
   built to that exact package.

## What done looks like

`hardware_prototype` (a validated unit built to the released design package) and `bom`
(the costed, manufacturable bill of materials with approved alternates) in the company
brain. These gate contract-manufacturing setup and certification, and feed supplier
sourcing and unit economics.

## Rules

- Prove the riskiest unknown first. A polished enclosure around an unproven mechanism
  is wasted iteration.
- Every single-sourced or long-lead part needs an approved alternate before the design
  is released. A BOM with one supplier per critical part is a single point of failure.
- Design to the test plan, not just to function. A unit that cannot be tested on a line
  cannot be shipped at quality.

Revisit when a component goes end-of-life, a cost target moves, or a field failure
forces a design change. Deepen this same design package rather than forking a parallel
one.

---
id: hardware-certification-and-compliance
title: Hardware Certification & Compliance
level: 3
summary: Identify and obtain the regulatory and safety certifications (FCC, CE, UL, and market equivalents) legally required to sell the device, and apply the marks and documentation that prove it.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Legal
criticality: existential
existential_at: [launched, revenue]
model_fit: [physical_goods]
selection_hint: A hard legal gate for selling physical product. An uncertified device cannot lawfully ship in its target markets, and shipping one risks seizure, recall, and liability. Start the testing early because lab queues and retests are slow.
action: "Determine the required certification regimes per target market, then book accredited lab slots for the long-lead tests now."
depends_on:
  - hardware-prototyping-and-dfm
soft_after: []
produces:
  - certifications
consumes:
  - hardware_prototype
effort: L
leverage: critical
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: certified-to-sell
deliverable:
  artifact: A hardware compliance file with passed test reports, certificates, marks, and a Declaration of Conformity proving the device is legal to sell, written to the company brain.
  sections:
    - Regulatory scope per target market
    - Compliance plan with standards, labs, lead times, and costs
    - Production-representative test results
    - Technical file and Declaration of Conformity
    - Applied marks and labels
    - Renewal and surveillance obligations
  max_words: 1200
rubric: Passes only when certification is against the production-representative unit that will actually ship, every required regime per target market has a passed report, no compliance claim or mark is applied before its report passes, and the founder has approved the markets, lab spend, and published claims.
---
# Hardware Certification & Compliance

A hardware product cannot legally be sold until it clears the certifications its target
markets require. Selling an uncertified or non-compliant device exposes the company to
seizure, forced recall, fines, and product-liability claims. This playbook maps the
required regimes, runs the testing on a production-representative unit, and produces the
certifications, marks, and documentation that make the device lawful to ship. It is
existential: there is no revenue without it.

## Procedure

1. Determine the regulatory scope from the device and its target markets: emissions and
   radio (FCC in the US, CE RED/EMC in the EU, and national equivalents), electrical and
   product safety (UL, IEC/EN, CSA), wireless module and SAR rules if it transmits,
   battery and shipping rules (UN 38.3 for lithium cells), and environmental directives
   (RoHS, REACH, WEEE) where they apply.
2. Build the compliance plan: the exact standards and test reports needed per market,
   accredited test labs, lead times, costs, and which approvals gate which launch
   geographies. Sequence the long-lead items first.
3. Prepare the device for test: certify on a production-representative unit (final
   design, materials, and firmware), since a late hardware change can invalidate a
   completed report and force a retest.
4. Engage accredited labs and run the testing. Manage failures as a loop: a failed
   emissions or safety test feeds a design or shielding change back into the design
   package, then a retest. Keep the prototype and CM in the loop on any change.
5. Assemble the technical and compliance file: test reports, the Declaration of
   Conformity, the bill of materials and safety-critical component approvals, user
   safety documentation, and the label and marking artwork (FCC ID, CE, UL, WEEE).
6. Apply the marks and documentation to the product, packaging, and manuals, and record
   the certificates and their renewal or surveillance obligations.

## What done looks like

`certifications` in the company brain: the passed test reports, certificates, marks, and
the compliance file proving the device is legal to sell in each target market. This
unblocks lawful sale, fulfillment, and marketing claims.

## Rules

- Certify the unit you will actually ship. A certification against a prototype that
  differs from the production unit is not valid and will not survive an audit.
- Start testing early. Lab queues, failures, and retests are the slowest path on the
  launch critical path; a missed certification blocks the entire launch, not one market.
- Do not make or imply a compliance claim, or apply a mark, before the report passes.
  An unearned mark is itself a violation.

Human gate: a founder approves the markets, the lab spend, and any compliance claim
before it is published. Revisit on a design change, a new market, or a standard revision
or certificate expiry.

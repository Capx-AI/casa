---
id: regulatory-licensing-roadmap
title: Regulatory and Licensing Roadmap
level: 2
summary: >-
  Map every license, registration, and regulatory gate a regulated business must clear, then
  sequence them by lead time and dependency so the build and launch plan never stalls on a missing
  permission.
applies_to:
  types:
    - '*'
  requires_traits:
    - regulated
  excluded_traits: []
relevance: core
department: Legal
criticality: core
selection_hint: >-
  Select when the business touches a regulated domain (financial services, payments, health,
  insurance, food, alcohol, transport, crypto custody) or operates in jurisdictions with licensing
  gates before launch.
depends_on: []
soft_after:
  - opportunity-scan
produces:
  - licensing_roadmap
  - regulatory_gate_register
  - compliance_lead_time_schedule
consumes: []
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: building
existential_at:
  - building
  - launched
model_fit:
  - recurring
  - transactional
  - marketplace
  - physical_goods
  - local
deliverable:
  artifact: licensing_roadmap
  sections:
    - Regulated activities and triggering rules
    - Required licenses and registrations by jurisdiction
    - Gate sequence with dependencies and lead times
    - Owner, cost, and renewal cadence per gate
    - Launch-blocking vs operate-while-pending items
  max_words: 900
rubric: >-
  Passes if every revenue-enabling activity is mapped to a specific named license or a documented
  exemption, each gate has an owner, a lead time, and a position in a dependency-ordered sequence.
---

# Regulatory and Licensing Roadmap

## Procedure
1. List the activities you actually perform that trigger regulation: holding customer funds, giving advice, processing payments, storing health data, selling a controlled good, operating in a physical location. Write each as a concrete verb, not a category. This activity list is the spine of the whole roadmap.
2. For each activity and each jurisdiction you will operate in, identify the specific named license, registration, or exemption. Pull the actual rule from the regulator's site or a qualified local counsel. Record the issuing body, statutory basis, and whether an exemption or sandbox applies before you assume you need the full license.
3. Capture cost, processing lead time, prerequisites, and renewal cadence for each gate. Lead time is the load-bearing number: a license that takes four months to grant must start now, not after the product is built.
4. Sequence the gates into a dependency-ordered schedule. Some require an incorporated entity, a named compliance officer, audited capital, or another license first. Draw the chain and put dates against it.
5. Split gates into launch-blocking versus operate-while-pending. Mark which ones legally stop you from taking revenue and which can run in parallel with a soft launch. Flag the single longest pole as the critical path.
6. Book a one-hour review with regulated-domain counsel to confirm nothing is missed and no exemption is misread. Have a human owner sign off before building proceeds.

## Output
A licensing_roadmap with a dated, owner-assigned gate sequence and a clearly marked launch-blocking critical path.

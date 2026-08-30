---
id: data-processing-and-dpa
title: Data Processing Agreement and Subprocessor Package
level: 3
summary: >-
  Produce a signable DPA, a public subprocessor list, and a privacy data-flow map so B2B buyers can
  clear your vendor security review without stalling the deal.
applies_to:
  types:
    - saas
    - b2b
    - b2b-service
  requires_traits:
    - collects_user_data
  excluded_traits: []
relevance: core
department: Legal
criticality: core
selection_hint: >-
  Select when you process personal data on behalf of business customers and a buyer has asked for a
  DPA, subprocessor list, or security questionnaire. Skip if you have no business customers handling
  personal data yet.
depends_on:
  - icp-target-account-listing
soft_after: []
produces:
  - dpa_package
  - subprocessor_list
  - data_flow_map
consumes: []
effort: M
leverage: high
reversibility: medium
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: First B2B contract requiring a data processing agreement
model_fit:
  - recurring
  - sales_led
  - self_serve
deliverable:
  artifact: dpa_package
  sections:
    - Data Flow Map
    - Subprocessor List
    - DPA Body and SCCs
    - Security Measures Annex
    - Signature Block
  max_words: 1800
rubric: >-
  Passes if a B2B buyer's procurement team can countersign the DPA and clear the subprocessor and
  data-flow questions without requesting structural redlines.
---

# Data Processing Agreement and Subprocessor Package

## Procedure
1. Map every place customer personal data enters, moves, and rests. List each system that touches it: your app database, analytics, email, support tooling, payment processor, and any AI or model API. For each, record the data categories, purpose, storage region, and retention period. This table becomes your data_flow_map and is the factual backbone for everything below.
2. Build the subprocessor list from that map. For each third party that processes customer data on your behalf, capture legal entity name, the service they provide, the data they receive, and hosting region. Publish it at a stable URL (for example /subprocessors) and add a notification commitment for new additions. This is your subprocessor_list.
3. Draft the DPA from a recognized template. Adapt a standard controller-to-processor agreement, attach Standard Contractual Clauses for cross-border transfers, and reference the subprocessor URL and data-flow categories as annexes. Fill the security-measures annex from what you actually do, not aspirations.
4. Have a qualified attorney review the DPA, transfer mechanism, and liability caps before you send it to any counterparty. Do not sign your own draft unreviewed.
5. Package the reviewed DPA, subprocessor list, and data-flow map into a single buyer-ready bundle and store it where sales can attach it to a deal in minutes. Pre-sign your side so buyers only countersign.

## Output
A reviewed dpa_package buyers can countersign without a redline cycle.

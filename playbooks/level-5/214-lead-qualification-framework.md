---
id: lead-qualification-framework
title: Lead Qualification Framework and Deal Scoring
level: 5
summary: >-
  Build a BANT or MEDDICC qualification framework with a numeric scoring model so reps invest time
  in winnable deals and disqualify early instead of late.
applies_to:
  types:
    - b2b
    - saas
    - b2b-service
  requires_traits:
    - b2b
  excluded_traits:
    - self_serve_only
relevance: core
department: Sales
criticality: core
selection_hint: >-
  Select when a founder-led or early sales team is taking discovery calls but lacks a consistent way
  to decide which deals to pursue and which to drop.
depends_on:
  - icp-target-account-listing
soft_after:
  - pricing-research
produces:
  - qualification_framework
  - deal_scorecard
  - disqualification_criteria
consumes: []
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: First repeatable sales motion with qualified pipeline
model_fit:
  - sales_led
  - recurring
deliverable:
  artifact: qualification_framework
  sections:
    - Chosen framework and dimension definitions
    - Weighted scoring model with 0-3 anchors
    - Qualify and advance thresholds
    - Hard disqualification criteria
    - CRM fields and enforcement
  max_words: 700
rubric: >-
  Passes if a rep can independently score a live deal in under five minutes and reach the same
  qualify or disqualify decision a peer would.
---

# Lead Qualification Framework and Deal Scoring

## Procedure
1. Pick one framework that matches your deal size. Use BANT (Budget, Authority, Need, Timing) for transactional deals under roughly 15k ACV, or MEDDICC (Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion, Competition) for complex multi-stakeholder deals. Write the chosen dimensions into a one-page definition doc.
2. Pull your last 10 to 20 closed deals (won and lost). For each, score every dimension 0 to 3 from memory or notes. Look for the pattern: which dimensions separated wins from losses. Those become your weighted dimensions.
3. Build the deal scorecard. Assign each dimension a weight summing to 100, define what a 0, 1, 2, and 3 looks like in plain language, and set a qualify threshold (for example, total score below 50 percent or any economic-buyer score of 0 means disqualify).
4. Write explicit disqualification criteria: hard stops that drop a deal regardless of score (no budget this fiscal year, no access to the economic buyer after two attempts, wrong ICP segment). This is the highest-leverage part; it gives reps permission to walk away.
5. Add the scorecard fields to your CRM as required fields on the opportunity record, and require a score before any deal advances past discovery. Run a 30-minute team walkthrough scoring two live deals together to calibrate.

## Output
A one-page qualification_framework, a weighted deal_scorecard in the CRM, and a disqualification_criteria list reps apply on every discovery call.

---
id: fundraise-deck-investor-outreach
title: Fundraise Deck and Investor Outreach
level: 8
summary: Build the deck, data room, and investor CRM, then run a tight batched process that creates competitive tension.
applies_to:
  types:
    - "*"
  requires_traits:
    - pmf_achieved
    - raising_capital
  excluded_traits:
    - pre_idea_only
    - bootstrapped_only
relevance: conditional
department: Finance
criticality: optional
selection_hint: Only when raising. Needs PMF or a real milestone, a defensible model, and case studies. Skip entirely if staying unfunded.
depends_on:
  - financial-model-forecast
  - unit-economics
soft_after:
  - case-study-testimonial-pipeline
  - why-now-memo
produces:
  - fundraise_materials
consumes:
  - financial_model
  - unit_economics
  - case_study
effort: L
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: round-closed
---
# Fundraise Deck and Investor Outreach

The deck secures a meeting, not the investment; investors spend under three minutes
on it. Run fundraising as a sales process built for competitive tension. Every
external move (deck send, intro request, term-sheet decision) is a founder gate.

## Procedure

1. Check prerequisites: working product with traction, committed team, defined large
   market, clean financials. Pull `financial_model`, `unit_economics`, `case_studies`.
2. Build the 10-slide deck (purpose, problem, solution, why now, market, product,
   traction, team, business model, ask) on Raskin's narrative arc.
3. Assemble the data room: pitch materials, financials, corporate docs, product/tech,
   go-to-market, team. Exclude 5-year projections and tax returns unless requested.
4. Build the target list and CRM: stage match, sector thesis, check size, no direct
   competitor in portfolio. Track status, warm-intro path, next action.
5. HUMAN GATE: founder approves the deck, target list, and ask before any outreach.
6. Run the process: secure warm intros, batch all first meetings inside a two-week
   window, use genuine momentum (never lie) to drive herd dynamics and soft deadlines.
7. HUMAN GATE: founder reviews and signs every term sheet. Watch 1x non-participating
   liquidation preference, broad-based weighted-average anti-dilution, board balance.

## Output

`fundraise_materials`: deck, data room, investor CRM, and the term-sheet decision
record, written to the company brain.

## Rules

- Human gate on outreach launch (step 5) and on every term sheet (step 7).
- Bottom-up market size only; a TAM-percent claim collapses under diligence.
- Never fundraise during active PMF iteration; an inconsistent story kills momentum.
- Do not over-optimize valuation; a down-round is worse than a fair mark.

Cadence: event-driven, one-time per round. Templates and term-sheet detail are in the
source draft.

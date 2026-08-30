---
id: financial-model-forecast
title: Financial Model and Forecast
level: 8
summary: Build and maintain a bottom-up 3-statement model with an ARR waterfall, scenarios, and a KPI dashboard.
applies_to:
  types:
    - "*"
  requires_traits:
    - has_revenue
  excluded_traits:
    - pre_idea_only
relevance: core
department: Finance
criticality: core
existential_at: [scaling]
selection_hint: Run when 12 to 24 months of actuals exist and a raise or board cadence is near. Consumes unit economics; produces the model the fundraise leans on.
action: "Build a bottom-up ARR waterfall by cohort from 12 months of actuals, splitting new, expansion, contraction, and churn."
depends_on:
  - unit-economics
soft_after:
  - growth-loop-design
produces:
  - financial_model
consumes:
  - unit_economics
effort: L
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: round-closed
---
# Financial Model and Forecast

A model that serves operators, investors, and the board at once must be credible
(grounded in actuals), transparent (every assumption labeled), and dynamic
(scenarios toggle without breaking). It must be bottom-up: top-down TAM-percent
forecasts are wishes, not models.

## Procedure

1. Verify inputs: 12 to 24 months of P&L, balance sheet, and cash actuals;
   customer-level subscription data; headcount roster and hiring plan; written CEO
   or CFO assumptions. Request anything missing before building.
2. Build the revenue engine bottom-up: ARR waterfall (new, expansion, contraction,
   churn) by cohort. Never model revenue as a fraction of TAM.
3. Pull unit economics (CAC, LTV, payback, burn multiple) from the unit-economics
   playbook; do not recompute them ad hoc.
4. Construct the integrated 3-statement model (income statement, balance sheet, cash
   flow) with the bookings to billings to revenue to cash chain and deferred revenue.
5. Layer headcount and capacity planning tied to the hiring plan.
6. Add scenario and sensitivity tables (base, upside, downside) and a stress test on
   runway. Flag if base-case runway drops below 12 months.
7. Publish the KPI dashboard for board and operator reads.

## Output

`financial_model`: the living 3-statement model, ARR waterfall, scenarios, and KPI
dashboard, written to the company brain. Feeds 098 Fundraise.

## Rules

- Bottom-up only. A top-down TAM-percent forecast is not a model.
- Keep bookings, billings, and revenue distinct; never conflate them.
- Every assumption is visible and labeled; no hidden constants.

Cadence: annual operating plan, quarterly reforecast, and event-driven (fundraise,
board, runway alert). Full construction logic is in the source draft.

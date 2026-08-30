---
id: packaging-tier-design
title: Packaging & Tier Design
level: 2
summary: Design Good/Better/Best tiers, pick the value metric, and set feature gates and upsell triggers so packaging mirrors the customer growth journey.
applies_to:
  types:
    - "*"
  requires_traits:
    - takes_payments
  excluded_traits: []
relevance: core
department: Finance
criticality: core
selection_hint: Run after pricing research lands a price range and value metric. The structural decision that pricing-page copy and freemium choice both depend on.
action: "Pick the single value metric customers pay by, then draft Good, Better, Best tiers around it this week."
depends_on:
  - pricing-research
soft_after: []
produces:
  - pricing_tiers
consumes:
  - pricing_research
  - positioning
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: pricing-direction-set
---
# Packaging & Tier Design

Packaging answers "what does the customer get"; pricing answers "how much." Two
thirds of SaaS use Good/Better/Best because it simplifies the buying decision while
capturing different willingness to pay. The structure should mirror how the customer
grows: solo, then team, then enterprise.

## Procedure

1. Select the value metric: the unit a customer pays by that scales with value
   received (per seat, per 1,000 calls, per resolved ticket). Pull the recommendation
   from pricing research.
2. Define tier jobs. Good drives acquisition and viral loop. Better is the core
   monetization engine for the ICP. Best maximizes ACV and NRR expansion.
3. Allocate features using Leaders, Fillers, Killers. Put leaders (purchase drivers)
   where they pull the target tier; keep killers out of bundles that alienate buyers.
4. Set feature fences that create a real upgrade incentive without crippling the
   entry tier.
5. Configure upsell triggers tied to the value metric (usage approaching a limit).
6. Validate tiers against the WTP and segment evidence from pricing research.

## Output

`pricing_tiers`: named tiers, the value metric, feature allocation per tier, fences,
and upsell triggers, written to the company brain. Feeds pricing-page copy,
freemium decision, discount policy, and launch plan.

## Rules

- Pick the value metric before drawing tiers. A wrong metric makes every tier wrong.
- Avoid build-your-own customization; it creates paralysis and gives procurement
  line items to negotiate away.
- Do not gate so aggressively that the entry tier cannot demonstrate core value.

Full GBB framework, fencing logic, and NRR mechanics in the source draft above.
Condense, do not pad.

---
id: hardware-preorder-demand-validation
title: Hardware Preorder and Demand Validation
level: 2
summary: Prove real hardware demand with preorders or a crowdfunding campaign before committing capital to tooling, inventory, and a manufacturing run.
applies_to:
  types:
    - hardware
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Growth
criticality: core
existential_at: [landing, building]
model_fit: [physical_goods]
selection_hint: The gate before capital-intensive hardware spend. Tooling and a first production run are largely irreversible, so prove paid demand with preorders or crowdfunding before sinking money into supply, not after.
depends_on: []
soft_after:
  - market-sizing-tam-sam-som
  - competitive-teardown
produces:
  - preorder_demand_signal
consumes: []
effort: M
leverage: critical
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: demand-proven
---
# Hardware Preorder and Demand Validation

Hardware is unforgiving: tooling, minimum order quantities, and a first production
run commit real, largely irreversible capital. Validating with paid preorders or a
crowdfunding campaign BEFORE that spend is the difference between a sold-out launch
and a garage full of unsold units. This play proves that strangers will pay for the
product as specified, and surfaces the price and configuration they will pay for, so
the supply and manufacturing work that follows is de-risked rather than speculative.

## Procedure

1. Define the offer precisely: the SKU, the headline specs, the price, the expected
   ship window, and the refund terms. A preorder is a promise; write the one you can
   keep.
2. Stand up a preorder or crowdfunding page with a deposit or full charge, real
   payment capture, and clear delivery expectations. A waitlist email is interest, not
   demand; a captured payment is demand.
3. Drive qualified traffic from the channels your buyers actually use and measure
   conversion to a paid preorder, not to a signup.
4. Set a go or no-go threshold in advance (units, revenue, or conversion rate) tied to
   the minimum order quantity and unit economics, so the decision is a number, not a
   feeling.
5. Test price and configuration where volume allows: a higher tier, a bundle, an
   accessory. Learn what the buyer will actually pay for before tooling locks it in.
6. Record the validated demand, the winning price and configuration, and the go or
   no-go call in `preorder_demand_signal` for the supply and manufacturing work to
   build against.

## Output

`preorder_demand_signal`: the captured preorder volume and revenue, the conversion
rate by channel, the price and configuration that cleared, and the go or no-go
decision against the pre-set threshold, written to the company brain. Feeds supplier
sourcing and COGS (108) and contract manufacturing (114) so capital follows proven
demand.

## Rules

- A deposit is demand; an email is not. Count only captured payments toward the
  threshold.
- Set the go or no-go number before you launch the page, so a near miss is not
  rationalized into a yes.
- Do not commit tooling or a production run until the threshold is met. This gate
  exists precisely because that spend is hard to reverse.

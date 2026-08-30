---
id: token-and-licensing-strategy
title: Token & Licensing Strategy
level: 4
summary: Set the licensing posture (money-transmission and VASP), token classification, and jurisdiction strategy that determine where and how a crypto business may legally operate.
applies_to:
  types:
    - crypto
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: core
department: Legal
criticality: core
existential_at: [scaling]
model_fit: [transactional]
selection_hint: Decide the regulatory shape of the business, which licenses to hold or avoid, how the token is classified, and which jurisdictions to serve. Operating unlicensed where a license is required becomes existential at scale.
action: "Map where your activities trigger money-transmitter or VASP licensing, then classify the token against securities tests with outside counsel."
depends_on:
  - kyc-aml-program
soft_after:
  - entity-formation
produces:
  - licensing_plan
consumes:
  - compliance_program
effort: L
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: false
recurring: false
typical_milestone: licensing-posture-set
---
# Token & Licensing Strategy

Where a crypto business operates, and under what license, is a strategic choice with
durable legal consequences, not a box to tick. Money-transmission and VASP regimes,
securities classification of a token, and the jurisdictions served all interact, and the
wrong combination can foreclose markets, attract enforcement, or strand a token that was
issued as one thing and treated by a regulator as another. Make these calls deliberately,
on top of a real compliance program, before the footprint hardens.

## Procedure

1. Map the licensing surface. From the activities and jurisdictions in the compliance
   program, determine where the business triggers money-transmitter, e-money, or VASP
   registration, and where an exemption or partner-of-record path applies. Distinguish
   licenses to hold from regimes to stay out of.
2. Classify the token. Assess the asset against the relevant securities, commodity, and
   payment-instrument tests in each target jurisdiction, document the rationale, and
   identify the design or distribution constraints that keep the classification stable.
3. Choose the jurisdiction strategy. Decide the home regime and the served markets,
   weighing licensing cost and timeline, banking and on-ramp access, tax, and the
   credibility of each regulator. Name the markets explicitly excluded and why.
4. Sequence the path to operate. Lay out the registrations, filings, legal opinions, and
   partner arrangements required to serve each chosen market, with owners and timelines,
   and the gating conditions before entering each one.
5. Set the operating guardrails. Define geofencing, disclosures, and the do-not-serve
   list that keep the business inside its licensed perimeter, and tie them back to the
   compliance program's screening and monitoring.
6. Obtain founder sign-off. The licensing posture and token classification are
   high-stakes and hard to unwind; require explicit founder approval and qualified
   outside counsel before the plan is treated as settled.

## Output

`licensing_plan` in the company brain: the licensing posture by jurisdiction, the
documented token classification and its rationale, the markets served and excluded, and
the sequenced path and guardrails to operate legally. This builds directly on the
compliance program and steers go-to-market geography.

## Rules

- Classification is decided before distribution, not rationalized after. A token shipped
  ahead of its legal analysis constrains every later choice.
- Serve only markets the business is licensed or exempt to serve; an explicit do-not-serve
  list and geofencing are part of the plan, not an afterthought.
- This sits on top of a live compliance program. A licensing plan without KYC/AML
  underneath it is a posture the business cannot actually operate.

This is a founder-gated, hard-to-reverse strategy. Revisit before entering a new market,
changing token mechanics, or when a regulatory regime shifts. Deepen this same plan rather
than starting a parallel one.

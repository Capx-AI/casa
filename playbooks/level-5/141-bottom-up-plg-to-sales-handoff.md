---
id: bottom-up-plg-to-sales-handoff
title: Bottom-Up PLG to Sales Handoff
level: 5
summary: "Build the bridge from self-serve adoption to sales-assisted revenue for a developer tool: free-to-paid conversion, team-adoption signals, usage-based expansion, and the trigger that turns a self-serve account into a sales-led deal."
applies_to:
  types:
    - saas
  requires_traits:
    - technical_audience
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Sales
criticality: core
existential_at: [revenue]
model_fit: [self_serve]
selection_hint: The revenue bridge for a bottom-up developer tool. Run once self-serve activation and a community exist; the point is catching the moment a self-serve account becomes a sales-worthy deal without smothering the self-serve motion.
depends_on:
  - onboarding-flow-design
  - developer-community-and-contributors
soft_after:
  - developer-relations-and-devrel
produces:
  - plg_sales_motion
consumes:
  - activation_event
  - dev_community
effort: M
leverage: high
reversibility: medium
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: plg-sales-bridge-live
---
# Bottom-Up PLG to Sales Handoff

In a bottom-up developer tool the individual engineer adopts for free and the
company pays later. The money is made in the bridge between those two facts:
catching the moment a self-serve account has grown into something a company will
pay for, and engaging it without smothering the frictionless motion that created
it. The classic failure is gating sales contact on a demo request (developers
will never request one) or, the opposite, having a rep email every signup
(burning the motion and the rep). The answer is a product-qualified-lead (PQL)
model driven by real usage signals: let the product do the qualifying, and reach
out only when usage says a buyer exists. This bridge is what converts the OSS-to-
revenue strategy from a slide into ARR.

## Procedure

1. Define the product-qualified-lead from real signals, not firmographics. Build
   the PQL score from the activation event and downstream usage: multiple seats
   from the same email domain, API call volume crossing a threshold, hitting a
   usage cap or rate limit, adopting a gated commercial capability, or a sudden
   week-over-week usage ramp. A PQL is an account showing it has outgrown the
   free tier, not a logo on a list.
2. Watch the team-adoption signals specifically. The single strongest expansion
   trigger in a bottom-up tool is a second, third, and fourth user appearing on
   the same domain or workspace, because individual adoption becoming team
   adoption is when budget authority enters the picture. Detect domain clustering
   and seat growth and weight it heavily in the score; community activity from a
   domain (multiple people in the Discord, issues filed) corroborates it.
3. Design the usage-based expansion path before any human gets involved. Most
   expansion should be self-serve: clear in-product upgrade prompts at the moment
   a user hits a limit, transparent usage-based or seat-based pricing, and a
   frictionless path from free to paid with no call required. Sales exists for the
   accounts too big or too complex to self-serve, not for routine upgrades.
4. Set the handoff trigger and the SLA. Define the exact PQL threshold that pages
   a human, what context the rep receives (the usage story: which team, what they
   built, where they are capped), and how fast they reach out. The outreach is
   helpful and technical, not a cold pitch: it references what the account is
   actually doing and offers to remove a specific blocker (enterprise SSO, higher
   limits, a security review, an SLA).
5. Keep the motion developer-respectful. Never wall off something the free user
   relies on to force a conversation, never spam every signup, and let any
   account that wants to stay self-serve do so. The sales-assisted path is an
   accelerant for accounts that signal readiness, layered on top of self-serve,
   never a replacement for it.
6. Instrument the full bridge: free-to-paid conversion rate, PQL-to-opportunity
   and opportunity-to-close rates, expansion (net revenue retention) from seat and
   usage growth, and the share of revenue that closed self-serve versus sales-
   assisted. Tune the PQL threshold from these so reps spend time only on accounts
   that convert.

## Output

`plg_sales_motion` in the company brain: the PQL definition and scoring model
(activation plus usage, team-adoption, and community signals), the self-serve
usage-based expansion path, the documented sales-handoff trigger with its context
package and outreach SLA, the developer-respectful guardrails, and the bridge
instrumentation (free-to-paid, PQL-to-close, NRR, self-serve-versus-sales-assisted
revenue split). This artifact realizes the OSS-to-revenue bridge named in the
open-source strategy and is the company's primary revenue mechanism.

## Rules

- The product qualifies the lead, not a form. Engage on usage signals (seats,
  volume, caps, team adoption), never on a demo request a developer will never
  submit, and never by emailing every signup.
- Team adoption is the buy signal. A second and third user on the same domain is
  worth more than any firmographic; weight it heavily and act on it.
- Never break the self-serve motion to force a sale. Sales accelerates accounts
  that signal readiness; it never gates what a free user already depends on.

This bridge is tunable, not one-shot. Adjust the PQL threshold and the self-serve-
versus-sales line from the conversion and expansion data so human effort lands
only where it changes the outcome.

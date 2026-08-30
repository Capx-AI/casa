---
id: referral-and-virality-loops
title: Referral and Virality Loops
level: 5
summary: Design and instrument the viral loop that turns active users into new users, measure k-factor and cycle time, and tune double-sided incentives and invite mechanics so growth compounds instead of leaking.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits:
    - pre_idea_only
relevance: recommended
department: Growth
criticality: growth
existential_at: []
model_fit: [self_serve]
selection_hint: Run once activation is solid and users reach value, because a referral loop amplifies a working product and a broken one alike. A self-serve product with a sharable output or a multiplayer reason to invite gets the most leverage. Skip until activation is fixed.
depends_on: []
soft_after:
  - referral-program
  - activation-rate-optimization
produces:
  - virality_loop
consumes:
  - activation_event
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: true
typical_milestone: virality-instrumented
---
# Referral and Virality Loops

RECURRING. A viral loop is a closed cycle: a user gets value, is prompted to share
or invite, the invited person lands, activates, and themselves becomes a sharer. The
loop is governed by two numbers: the k-factor (how many new activated users each
existing user generates) and the cycle time (how long one turn of the loop takes).
A k below 1 still amplifies paid and organic acquisition; a k at or above 1 means
self-sustaining growth. Most apps never measure either, ship an invite button, and
wonder why nothing compounds. This playbook designs the loop deliberately and
instruments it so the math is visible and tunable.

## Procedure

1. Pick the loop type. Classify the available loop: inherent/collaborative (the
   product needs another person, like shared docs or multiplayer), word-of-mouth
   from a sharable artifact (an export, a result card, a public profile),
   incentivized referral (give-get rewards), or social broadcast (share to feed).
   Most apps can run more than one; choose the one closest to the activation moment.
2. Place the invite at the value peak. Trigger the share or invite prompt right
   after the activation event, when perceived value is highest, not on app open and
   not buried in settings. Pre-fill the message, minimize the steps from intent to
   sent invite, and make the shared object itself carry the product (a watermarked
   export, a deep link to the exact value).
3. Design double-sided incentives (if incentivized). Reward both the inviter and the
   invitee so the ask is generous, not extractive, and tie the inviter reward to the
   invitee actually activating, not merely signing up, so the incentive buys real
   users and not fraud. Cap and monitor for abuse.
4. Instrument the full funnel. Track every stage: invites sent per active user,
   invite acceptance rate, invitee signup, invitee activation, and time per stage.
   Attribute new users back to the referrer with a durable referral code or deep
   link. Without this instrumentation k-factor is a guess.
5. Compute and watch the math. k-factor = (invites sent per user) x (conversion to
   activated invitee). Track k and cycle time as live metrics, segmented by loop
   type and cohort. Model the amplification: a k of 0.5 multiplies acquisition by
   roughly 2x at steady state; small lifts in acceptance compound hard.
6. Tune the weakest stage. Find the lowest-converting step (usually invite-sent rate
   or invitee activation) and run a focused test there. Removing friction at the
   binding stage moves k more than a bigger reward usually does.

## Output

`virality_loop` in the company brain: the chosen loop type and its placement at the
activation peak, the incentive design (and anti-abuse caps), the instrumented invite
funnel, the live k-factor and cycle-time metrics by cohort, and the current tuning
backlog. This artifact feeds the growth-loop portfolio and the acquisition model.

## Rules

- Measure k-factor and cycle time or you are not running a loop, you are shipping a
  button. Both numbers must be live and attributed.
- Reward activation, not signup. An incentive paid on signup buys fraud and inflates
  vanity; tie it to the invitee reaching value.
- Place the invite at the value peak. A loop prompted before the user has felt value
  has nothing to amplify.

RECURRING cadence: review k-factor and the funnel on a regular interval and run one
tuning experiment on the binding stage per cycle. Deepen this same loop rather than
bolting on disconnected invite features.

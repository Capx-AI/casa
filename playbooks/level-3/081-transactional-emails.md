---
id: transactional-emails
title: Transactional Emails
level: 3
summary: Design and deploy receipts, resets, alerts, and notifications on isolated infrastructure, holding the 80/20 utility rule.
applies_to:
  types:
    - "*"
  requires_traits:
    - sends_email
  excluded_traits: []
relevance: core
department: Product
criticality: core
selection_hint: Run once the product has user accounts and deliverability is warmed. These are the highest-open emails you own; treat as product surface, not marketing.
depends_on:
  - email-deliverability-setup
soft_after:
  - hosting-deployment-setup
produces:
  - transactional_emails
consumes:
  - email_deliverability
effort: M
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: transactional-email-live
---
# Transactional Emails

Transactional emails facilitate or confirm something the user already initiated:
receipts, password resets, MFA codes, shipping updates, invites, failed-charge
alerts. They open at 40 to 80% because the user needs the information. That earned
attention is leverage, but any failure (spam, broken link) damages trust and sender
reputation disproportionately.

## Procedure

1. Classify each message. User-initiated action or system event tied to the account
   is transactional (CAN-SPAM exempt). "We want to tell users about a feature" is
   marketing; route it elsewhere.
2. Enforce the 80/20 rule. At least 80% of the body serves the transactional utility;
   20% max for a low-friction secondary CTA (a two-line text link, never a banner).
3. Structure top to bottom: primary utility block above the mobile fold, supporting
   detail, action confirmation (reduces support tickets), optional secondary CTA, footer.
4. Write clarity-first subject lines under 50 chars with the specific data point; no
   promotional spam-trigger words. Use `[Action Required]` brackets where apt.
5. Send from a separate transactional subdomain and IP pool. Wire ESP webhooks for
   delivery, bounce, and complaint events.
6. A/B test and monitor placement and reputation.

## Output

`transactional_emails`: a deployed transactional stream on isolated infrastructure
with templates, triggers, and monitoring, recorded in the company brain.

## Rules

- Never mix heavy promotional content into the transactional stream; it tanks IP
  reputation and pushes password resets to spam.
- Blocked until deliverability is set up (082). Account/billing emails must send
  regardless of marketing preferences.
- Keep transactional and promotional on separate subdomains and IP pools.

Full copy formulas, category table, and the 80/20 violation case study in the source
draft above. Condense, do not pad.

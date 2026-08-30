---
id: b2b-soc2-readiness
title: B2B Security and SOC2 Readiness
level: 6
summary: Get a B2B software company ready to pass enterprise security review, with a SOC2-readiness posture, a data-processing agreement, and answers to the vendor security questionnaire.
applies_to:
  types:
    - "*"
  requires_traits:
    - b2b
    - collects_user_data
  excluded_traits: []
relevance: recommended
department: Legal
criticality: growth
selection_hint: Run when enterprise deals start stalling on security review, or before moving upmarket. Security review is a gate on B2B revenue once deal sizes grow.
depends_on: []
soft_after:
  - security-baseline
produces:
  - security_compliance_posture
consumes: []
effort: XL
leverage: high
reversibility: hard
human_gate: true
blocks_revenue: true
recurring: false
typical_milestone: enterprise-security-ready
---

# B2B Security and SOC2 Readiness

For a B2B company moving upmarket, security review is a hard gate on revenue. This builds
the posture and the paper that unblock it.

## Procedure

1. Pick the framework the buyers ask for (usually SOC2 Type II) and map the controls to
   what you have and what is missing.
2. Close the control gaps: access management, logging and monitoring, vendor management,
   change management, and an incident-response runbook.
3. Prepare the data-processing agreement (DPA) and a subprocessor list buyers will require.
4. Build the reusable answers to the standard vendor security questionnaire so each deal
   does not restart from zero.
5. Engage an auditor for the formal report when the controls are in place; any paid
   engagement requires explicit founder approval.
6. Stand up a trust page or security overview prospects can self-serve.

## Output

A `security_compliance_posture`: the control gap analysis and remediations, the DPA and
subprocessor list, the questionnaire answer bank, and the audit plan.

## Rules

- This gates enterprise revenue; do not promise a certification you have not started.
- Legal documents (DPA) and the audit engagement need founder approval.

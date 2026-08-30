---
name: casa-synthesize
description: Turn raw customer input (interview notes, usability sessions, survey responses, support threads, churn reasons) into a structured insight memo: ranked pains, jobs to be done, representative quotes, and a confidence on every claim. Use after running interviews or usability tests, or when the user has a pile of customer notes to make sense of.
---

# casa-synthesize

The synthesis craft. Founders collect raw customer input and never distill it. This
turns notes into a decision-grade memo, with the honesty discipline that separates a
real signal from a flattering one.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Gather the raw input. Read the notes the founder points to, plus any prior insight
   memos in `company-brain/` and the relevant playbook (for example
   `problem-validation-interviews`, `jobs-to-be-done-extraction`, `usability-testing-protocol`,
   `nps-csat-program`, `churn-diagnosis-winback`). Keep every source identifiable so
   quotes can be attributed.

2. Extract, do not interpret yet. Pull the concrete observations: what the person
   said in their own words, what they did, what they paid for or refused to. Separate
   observed behavior from stated opinion. Discard leading or hypothetical answers
   ("would you use") as weak.

3. Cluster into pains and jobs. Group observations into distinct pains and the jobs
   the customer is trying to get done. For each, capture frequency (how many
   independent sources raised it) and intensity (how much it hurts).

4. Rank. Order pains by frequency times intensity. A pain raised once in passing is
   not a finding; a pain raised independently by several people who took action on it
   is.

5. Attach evidence and confidence. For each ranked pain and job, include one or two
   representative verbatim quotes with attribution, and a confidence (high, medium,
   low) based on how many independent sources and how much real behavior back it.
   State what would raise a low-confidence item.

6. Write the memo. Save the insight memo as the playbook's `produces` artifact under
   `company-brain/`. Structure: top pains ranked, jobs to be done, surprising
   findings, what is NOT supported by the evidence, and the recommended next test.

7. Stress-test. Run `casa-review` so the `customer-skeptic` persona checks for leading
   validation and missing willingness-to-pay signal. Address P0 and P1 findings, then
   hand to `casa-build` to mark the node done.

## Rules

- Behavior outweighs opinion. A thing someone did counts for more than a thing someone
  said they might do.
- Every ranked claim carries a confidence and its evidence. No unsupported assertion
  reaches the memo.
- Do not inflate. A weak signal labeled as strong is worse than no finding.
- No em-dashes, no emojis in the memo.

---
name: casa-ideate
description: Generate many grounded options for a company move (a growth play, a pricing change, a positioning angle, a feature bet), critique all of them with explicit rejection reasons, and surface only the survivors. Use when the user asks what should we try, give me options, or is stuck on a direction. Routes the winner into a brief or casa-build.
---

# casa-ideate

The option-generating craft. Quality comes from explicit rejection, not optimistic
ranking. Generate widely, kill most, explain the few that survive.

## Steps

0. If `company-brain/profile.json` does not exist, tell the founder to run /casa-start
   first and stop.

1. Ground the question. Read `company-brain/STRATEGY.md`, `profile.json`,
   `build-map.json`, the latest `decisions/`, and `learnings.jsonl`. Frame the
   specific decision the founder faces and the constraint it lives under (budget,
   stage, channel, and any token or on-chain layer if that is in scope).

2. Generate many, deliberately varied. Produce eight to twelve options spanning real
   different angles (cheap and fast, high-ceiling and risky, contrarian, adjacent to
   what is working). Each grounded in the actual company state, not generic startup
   advice. No founder-bro framing.

3. Critique all of them. For every option, state the strongest reason it fails: weak
   evidence, wrong stage, no distribution, poor unit economics, off-strategy,
   already tried (check `learnings.jsonl`). Rejection with a reason is the mechanism.

4. Surface the survivors. Keep the two or three that withstand their own strongest
   critique. For each, give the why-it-survives, the cheapest test, and the metric it
   moves. List the rejected ones in one line each so the founder sees the field.

5. Route the winner. On the founder's pick, hand to a brief or directly to
   `casa-build` for the playbook that executes it. Append a note to `decisions/` so a
   rejected idea is not re-litigated later.

## Rules

- Explicit rejection is required. An option with no stated failure mode was not
  critiqued.
- Ground every option in this company's real state and past learnings, not generic
  advice.
- The founder chooses. You generate, critique, and recommend; you do not commit.
- No em-dashes, no emojis. Institutional tone.

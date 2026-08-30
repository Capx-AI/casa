# The self-updating CLAUDE.md protocol

CLAUDE.md is loaded into context at the start of every Claude Code session. That
makes it the single most valuable place to keep the operating state of a company:
whatever is in CLAUDE.md is what Casa "knows" before it does anything. So Casa
treats CLAUDE.md as a living artifact that updates itself at defined checkpoints,
not a document a human edits by hand.

This is a compounding build loop: every cycle does not just complete, it teaches
the system. The teaching is written back into
CLAUDE.md and the company brain, so the next cycle starts smarter.

This protocol applies to BOTH CLAUDE.md files:
- the repo file (`/CLAUDE.md`), which updates when the repo's structure changes
- the company file (`templates/company-brain/CLAUDE.md`), which updates as a
  company progresses through the levels

---

## 1. The marked-block convention

Only content inside an AUTO marker pair is ever machine-edited:

```
<!-- CASA:AUTO:section-name -->
... machine-managed content ...
<!-- /CASA:AUTO:section-name -->
```

Everything outside the markers is hand-authored and stable. A self-update edits
the inside of exactly one block. It never touches text outside a block, never
removes a block, and never removes this protocol.

Rationale: this guarantees the founder's intent and the safety rules can never be
silently overwritten by an automated edit. The model gets a small, well-fenced
surface to write to.

---

## 2. The update triggers (WHEN, WHAT, WHO, HOW)

| # | Trigger (WHEN) | WHAT updates | WHO performs it | HOW |
|---|---|---|---|---|
| T0 | Session start | nothing (read only) | `hooks/session-start.sh` | Prints `company-brain/NOW.md` so the founder sees status and next action before the first turn. |
| T1 | Idea confirmed (Level 0 passes its GO gate) | company CLAUDE.md `profile` and `selected-levels` blocks; create `build-map.json`; write `NOW.md` | `skills/casa-start` (calls `agents/playbook-planner`) | Writes the confirmed business profile and the personalized level plan into the AUTO blocks. |
| T2 | A playbook completes, or a level entry/exit gate resolves | company CLAUDE.md `current-level`, `done`, and `next` blocks; `NOW.md`; `build-map.json` status | `skills/casa-next` | Re-scores ready nodes, advances the level if its exit gate passed, rewrites the blocks. No full replan. |
| T3 | A significant decision is made (pricing, pivot, partnership, hire, anything irreversible or above a money or legal threshold) | append a file to `company-brain/decisions/`; update company CLAUDE.md `locked-decisions` block | `skills/casa-next` or an explicit decision skill | Records context, options, choice, reason, review date. Keeps only the short list of still-binding decisions in CLAUDE.md. |
| T4 | Session end | `NOW.md`; company CLAUDE.md `state` block; flush new entries to `company-brain/learnings.jsonl` | a Stop or SessionEnd hook (Phase 2) | Snapshots where things stand so the next session resumes cleanly. |
| T5 | Weekly retro (the knowledge-audit loop) | prune stale AUTO content and stale learnings | the retro loop | Removes superseded instructions so the file stays lean and the company brain does not poison future cycles with stale facts. |
| TR | Repo structure changes (new layer, skill type, level model, command surface, license posture, build phase) | repo CLAUDE.md `repo-status` block | whoever makes the change | Update the one block, date the entry. |

---

## 3. Safe-edit rules (every self-update must obey)

1. Edit inside exactly one AUTO block. Never change text outside the markers.
2. Never delete a block, the protocol, or any hand-authored safety rule.
3. Keep blocks short. A CLAUDE.md that grows without bound defeats its purpose
   (it is loaded every session and costs context). Caps: `done` keeps the last
   10 items, `locked-decisions` keeps only still-binding decisions, `next` keeps
   at most 3 actions. Older detail lives in the company brain, not here.
4. Date every entry (YYYY-MM-DD). A decision is durable until a newer dated entry
   supersedes it.
5. Use plain prose. No em-dashes, no emojis (Capx copy rule).
6. Write through the deterministic path where one exists. The skill or hook
   computes the new content; the model only fills fuzzy fields (a one-line why).
7. If an edit would exceed a cap, summarize the overflow into the company brain
   first, then write the trimmed version.

---

## 4. Why this is the product, not a nicety

The router decides what to do. The company brain remembers what happened. CLAUDE.md
is the always-loaded surface where those two meet the founder. Because it updates
itself at T1 through T5, the founder opens the terminal on day 60 and Casa already
knows the business, the level, the last 10 things done, the binding decisions, and
the single next action, with zero re-briefing. That standing context, refreshed
automatically, is what makes Casa a control plane instead of a prompt library.

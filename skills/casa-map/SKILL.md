---
name: casa-map
description: Show and approve the personalized company build map (levels, parallel tracks, and status). Use when the user asks to see the plan, the roadmap, the build map, or says casa map.
---

# casa-map

Renders the build map so the founder can see and approve the path.

## Steps

1. Read `company-brain/build-map.json`. If absent, tell the founder to run
   `casa-start`.

2. Render by level. For each selected level show its name, its status (locked,
   active, done), and within it the parallel tracks and their nodes with status
   (blocked, ready, in-progress, done, skipped). Mark the critical path and any
   human-gate nodes.

3. On request, explain why a playbook was selected or skipped (read its
   `selection_hint` and the profile), or why one waits on another (its
   `depends_on`).

4. Approval. If the map is newly created or revised, ask the founder to approve.
   On approval, mark the map committed in `ledger/`. On change requests, hand back
   to the planner for an incremental re-plan (diff only, preserve done work).

## Rules

- Read-only by default. Do not change status here; status changes flow through
  `casa-next` and the playbook runs.
- No em-dashes, no emojis.

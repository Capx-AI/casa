---
name: casa-design
description: Build and refine product UI with production craft. Reads the brand spec from the company brain, detects the codebase design system, plans the visual approach, builds with quality principles (typography, hierarchy, spacing, accessibility, copy discipline), verifies visually, and records design decisions. Use when building a landing page, app UI, dashboard, onboarding screen, or any UI at Level 2 or above.
---

# casa-design

The design craft. A full lifecycle in the terminal: establish a design system, build
UI against it, and verify before shipping. System mode (L2) writes the spec; build
mode (L3 and above) executes against it. Nothing runs below L2.

## Steps

1. Level gate and brain read. Read `company-brain/NOW.md`, `profile.json`,
   `build-map.json`. If the current level is below 2, stop and tell the founder to
   finish Level 1 first. Load if present: `company-brain/design/design-spec.json`
   (the token authority), the latest design-tagged entry in `decisions/`, and the
   `visual_identity` artifact if `visual-identity-brief` is done. No spec and level 2
   means system mode (write the spec). Spec present or level 3 and above means build
   mode.

2. Detect the codebase design system. Search the project for CSS custom properties,
   `tailwind.config.*`, a component library (shadcn, Radix, Chakra, Material), font
   declarations, and an animation library. Classify: existing system (defer to it),
   partial (follow what exists, fill gaps with defaults), spec-only (generate tokens
   from design-spec.json), or greenfield (full guidance). Surface any contradiction
   before proceeding.

3. Brief (write before any code, pause for approval). Three statements: a visual
   thesis (one specific sentence on mood and material, not "clean and modern"), a
   content plan (what goes on the surface and in what order), and a motion plan (two
   or three named interactions and which library renders them).

4. Build. Apply these, each yielding to the detected system: at most two typefaces
   with a clear hierarchy and a constrained scale; a committed palette in CSS
   variables with WCAG AA contrast (4.5:1 body, 3:1 large and UI); whitespace,
   alignment, scale, and contrast before chrome; cards only where the card is the
   interaction unit; two or three intentional interactions; semantic HTML and visible
   focus states; and copy that earns its place. Route drafted copy through
   `casa-write`.

5. Litmus checks. Is the product unmistakable in the first viewport? One anchor per
   section? Scannable by headings alone? One job per section? Cards only as
   interaction units? Motion that adds hierarchy, not ornament? Copy that sounds like
   the product, not a generator? In build mode, no tokens introduced outside
   design-spec.json.

6. Verify. Run the deterministic check, then a visual pass:

   ```
   node ${CASA_ROOT:-${CLAUDE_PLUGIN_ROOT}}/scripts/design-check.mjs company-brain <targetDir>
   ```

   Then run `casa-review` so the `designers-eye` persona audits the build. Use the
   project's browser tooling for the screenshot pass. Fix
   blocking issues, then stop. Multi-cycle refinement is a future casa-design-iterate.

7. Write back. If the spec was newly established, write
   `company-brain/design/design-spec.json` (typography, color, spacing, radius,
   framework, component library, motion library). Record a design decision in
   `decisions/`. Flush design learnings to `learnings.jsonl`.

## design-spec.json (the token contract)

```json
{
  "last_updated": "YYYY-MM-DD",
  "typography": { "display": "...", "body": "...", "mono": null, "scale_px": [12,14,16,20,24,32,48,64] },
  "color": { "brand": "#hex", "brand_foreground": "#hex", "accent": "#hex|null",
             "neutral_50": "#hex", "neutral_900": "#hex", "surface": "#hex", "surface_foreground": "#hex",
             "semantic": { "error": "#hex", "success": "#hex", "warning": "#hex" } },
  "spacing": { "base_px": 4, "scale_px": [4,8,12,16,24,32,48,64,96] },
  "radius_px": 6, "framework": "tailwind|css|...", "component_library": "shadcn|none|...",
  "motion_library": "framer-motion|css|none"
}
```

## Rules

- No design work below Level 2. Route to `/casa-start` if the company is not past
  ideation.
- Never invent tokens. Detect them from the code or derive them from the visual
  identity brief, and once design-spec.json exists it is the authority.
- Never ship to production or buy a font or asset without founder approval.
- No em-dashes, no emojis in any product or founder-facing copy. Institutional tone.

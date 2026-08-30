---
id: phase0-website
title: Phase 0 Website
level: 0
summary: >-
  Draft a real static or JAMstack company site locally as HTML, CSS, JS, fonts, and
  images. The harness writes the files. Casa does not build or host them.
applies_to:
  types:
    - "*"
  requires_traits: []
  excluded_traits: []
relevance: core
department: Brand
criticality: core
existential_at:
  - idea
selection_hint: >-
  First public-facing artifact for every new company. Run at idea stage before or
  alongside validation. Skip only if a real local site already lives under
  company-brain/outputs/phase0-website/.
action: "Write a self-contained static company site to company-brain/outputs/phase0-website/ and do not publish it."
depends_on: []
soft_after: []
produces:
  - phase0_website
consumes: []
effort: L
leverage: high
reversibility: easy
human_gate: false
blocks_revenue: false
recurring: false
typical_milestone: distribution-foundation
deliverable:
  artifact: >-
    A self-contained static or JAMstack company site (HTML, CSS, JS, fonts, images)
    written to company-brain/outputs/phase0-website/, openable locally without a
    remote build.
  sections:
    - Home page with company name, one-liner, and primary call to action
    - About or product section that states who it is for and what it does
    - Contact or waitlist path
    - Logo or mark, typography, and a small image set with relative paths
    - README that names the files and how to open the site locally
  max_words: 800
rubric: >-
  Passes only when the site is real static files under company-brain/outputs/phase0-website/
  (not a mockup, not a prompt, not a hosted URL), opens locally via index.html with
  relative assets, states the company name and offer, and the README records that
  nothing was published.
---
# Phase 0 Website

A company that cannot be shown cannot be published later. This play produces a
real local website, not a wireframe and not a hosted deployment. Casa does not
build the site, does not run package installs on a server, and is not a visual
builder. The agent harness writes static files on the founder's machine.

## Procedure

1. Read `company-brain/profile.json` for the company name, one-liner, ICP, and
   type. Use that name. Do not invent a placeholder brand.
2. Draft the site as static HTML, CSS, and JS, with fonts and images as local
   files. A JAMstack generator is allowed only if the generated output is still
   plain static files. Opening `index.html` in a browser, or serving the folder
   with a local static server, must work. No required remote build, no CDN, no
   account signup.
3. Write every file under `company-brain/outputs/phase0-website/`. Suggested
   layout: `index.html`, `css/`, `js/`, `fonts/`, `images/`, and `README.md`.
   Use relative paths only.
4. Include at least: a home view with name, one-liner, and one call to action;
   a short about or product section; a contact or waitlist path; a simple logo
   or mark (SVG or PNG is enough). Keep copy institutional. No em-dashes, no
   emojis.
5. Write `README.md` in that folder: what was built, how to open it locally,
   and an explicit line that this play did not publish anything.
6. Stop. Do not POST to a publish or host API, do not `npm install` on a remote
   host, and do not treat this folder as live. Deployment is a separate,
   founder-controlled action. Going public is always-ask.

## Output

`phase0_website`: the local static site under
`company-brain/outputs/phase0-website/`. Unblocks the one-pager and deck as
preferred follow-ons, and is required by publish-readiness.

## Rules

- Casa does not build, package, or host this site. The harness does the writing.
- Real files only. A markdown description of a site is a failed run.
- Do not publish. Do not register a domain. Do not spend money.
- Do not overwrite the founder's own project files. Output stays under
  `company-brain/outputs/phase0-website/`.

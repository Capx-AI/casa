// Tests for the deterministic canon linter (scripts/copy-lint.mjs). These lock the
// hard rules (no em-dashes, no emojis, no placeholder company names) and the soft
// buzzword warning, so the canon is enforced by code, not by the model remembering.

import { test } from "node:test";
import assert from "node:assert/strict";
import { lint } from "../scripts/copy-lint.mjs";

test("clean institutional copy passes", () => {
  const r = lint("Capx Casa builds a company from your terminal. It runs on your own plan.");
  assert.equal(r.ok, true);
  assert.equal(r.errors.length, 0);
});

test("em dash is an error", () => {
  const r = lint("This is great—really great.");
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((f) => f.rule === "em_dash"));
});

test("en dash in a numeric range is allowed", () => {
  const r = lint("Pricing runs 10–20 dollars per seat.");
  assert.equal(r.ok, true, "en dash must not be flagged");
});

test("an emoji is an error", () => {
  const r = lint("Ship it \u{1F680} today");
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((f) => f.rule === "emoji"));
});

test("placeholder company names are errors when supplied", () => {
  const r = lint("Welcome to Acme Test Co, the future of widgets.", { placeholders: ["Acme Test Co"] });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((f) => f.rule === "placeholder_name"));
});

test("buzzwords warn but do not fail the lint", () => {
  const r = lint("We supercharge your all-in-one workflow.");
  assert.equal(r.ok, true, "buzzwords are warnings, not errors");
  assert.ok(r.warnings.length >= 2);
  assert.ok(r.warnings.every((f) => f.severity === "warn"));
});

test("findings carry a line number", () => {
  const r = lint("line one\nline two has an emoji \u{1F600}\nline three");
  const emoji = r.errors.find((f) => f.rule === "emoji");
  assert.equal(emoji.line, 2);
});

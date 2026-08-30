// Tests for the deterministic design linter (scripts/design-check.mjs). Locks the
// WCAG contrast math and the token/spacing drift analysis the designers-eye agent
// reads as grounded facts.

import { test } from "node:test";
import assert from "node:assert/strict";
import { contrastRatio, hexToRgb, analyze } from "../scripts/design-check.mjs";

test("contrastRatio: black on white is the maximum 21:1", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
});

test("contrastRatio: a passing pair clears 4.5 and a failing pair does not", () => {
  assert.ok(contrastRatio("#767676", "#ffffff") >= 4.5, "#767676 on white passes AA");
  assert.ok(contrastRatio("#999999", "#ffffff") < 4.5, "#999 on white fails AA");
});

test("contrastRatio: 3-digit hex and case are handled", () => {
  assert.equal(contrastRatio("#000", "#FFF"), 21);
  assert.deepEqual(hexToRgb("#fff"), [255, 255, 255]);
  assert.equal(hexToRgb("not-a-hex"), null);
});

test("analyze: flags a low-contrast spec pair", () => {
  const spec = { color: { surface: "#ffffff", surface_foreground: "#999999" }, spacing: { scale_px: [4, 8, 16] } };
  const r = analyze(spec, [{ path: "a.css", text: "body{color:#999999;background:#ffffff}" }]);
  assert.ok(r.contrast_failures.some((f) => f.pair === "surface_foreground on surface"));
});

test("analyze: flags off-grid spacing", () => {
  const spec = { color: {}, spacing: { scale_px: [4, 8, 16, 24] }, radius_px: 6 };
  const r = analyze(spec, [{ path: "h.css", text: ".x{padding:13px;margin:8px;border-radius:6px}" }]);
  assert.ok(r.spacing_offgrid.some((o) => o.value_px === 13), "13px is off grid");
  assert.ok(!r.spacing_offgrid.some((o) => o.value_px === 8), "8px is on grid");
  assert.ok(!r.spacing_offgrid.some((o) => o.value_px === 6), "radius value is allowed");
});

test("analyze: flags a spec token missing from the code", () => {
  const spec = { color: { brand: "#1a2f5e", surface: "#ffffff" }, spacing: { scale_px: [8] } };
  const r = analyze(spec, [{ path: "t.css", text: ".x{background:#ffffff}" }]);
  assert.ok(r.token_drift.some((t) => t.token === "color.brand" && t.found_in_code === false));
  assert.ok(!r.token_drift.some((t) => t.token === "color.surface"), "surface is present in code");
});

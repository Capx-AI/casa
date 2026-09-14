// Unit tests for the deterministic router engine (scripts/router.mjs).
// These assert the graph math directly through the library exports, against the
// real catalog (183 playbooks) and the two shipped example profiles. The numbers
// here (137/183, 128/183) are the golden build maps; they are a tripwire for any
// unintended membership change.

import { test } from "node:test";
import assert from "node:assert/strict";
import { select, sequence, score, buildMap, nextActions, PHASE0_IDS } from "../scripts/router.mjs";
import { INDEX, loadJson, levelKey } from "./helpers.mjs";

const PROBE = loadJson("examples/profile-b2b-devtool.json"); // b2b, high_acv
const MEME = loadJson("examples/profile-solana-analytics.json"); // b2c, self_serve_only

// ---- select ----

test("select: b2b high-acv profile selects 137/183", () => {
  const { members, skipped } = select(INDEX, PROBE);
  assert.equal(members.length, 137);
  assert.equal(skipped.length, 46);
  assert.equal(members.length + skipped.length, INDEX.length);
});

test("select: b2c self-serve profile selects 128/183", () => {
  const { members, skipped } = select(INDEX, MEME);
  assert.equal(members.length, 128);
  assert.equal(skipped.length, 55);
});

test("select: Phase 0 set includes every face play and every example gets the brief", () => {
  const ids = INDEX.filter((p) => p.id.startsWith("phase0-")).map((p) => p.id);
  assert.equal(ids.length, 13);
  assert.deepEqual([...PHASE0_IDS].sort(), ids.sort());
  for (const profile of [PROBE, MEME, loadJson("examples/inboxpilot/company-brain/profile.json")]) {
    const members = new Set(select(INDEX, profile).members.map((p) => p.id));
    for (const id of ids.filter((id) => id !== "phase0-token-flow")) assert.ok(members.has(id), `${profile.company_name} missing ${id}`);
    assert.equal(members.has("phase0-token-flow"), profile.traits.includes("has_token"));
  }
  assert.ok(select(INDEX, { ...MEME, traits: [...MEME.traits, "has_token"] }).members.some((p) => p.id === "phase0-token-flow"));
});

test("select: every skipped playbook carries a non-empty reason", () => {
  const { skipped } = select(INDEX, MEME);
  for (const s of skipped) {
    assert.ok(typeof s.reason === "string" && s.reason.length > 0, `${s.id} missing reason`);
  }
});

test("select: members are unique and a subset of the library", () => {
  const { members } = select(INDEX, PROBE);
  const ids = new Set(members.map((m) => m.id));
  assert.equal(ids.size, members.length, "no duplicate members");
  const lib = new Set(INDEX.map((p) => p.id));
  for (const id of ids) assert.ok(lib.has(id));
});

// ---- sequence ----

test("sequence: selected sub-DAG is acyclic and topologically ordered", () => {
  const { members } = select(INDEX, MEME);
  const { order, slack } = sequence(members);
  assert.equal(order.length, members.length); // a cycle would have thrown
  const pos = new Map(order.map((id, i) => [id, i]));
  const memberIds = new Set(members.map((m) => m.id));
  for (const m of members) {
    for (const d of m.depends_on || []) {
      if (memberIds.has(d)) assert.ok(pos.get(d) < pos.get(m.id), `${d} must precede ${m.id}`);
    }
  }
  for (const s of slack.values()) assert.ok(s >= 0, "slack is non-negative");
  assert.ok([...slack.values()].some((s) => s === 0), "a critical path (slack 0) exists");
});

test("sequence: the whole 100-playbook graph is acyclic (catalog integrity)", () => {
  const { order } = sequence(INDEX);
  assert.equal(order.length, INDEX.length);
});

// ---- score ----

test("score: deterministic, positive, and strictly decreasing in slack", () => {
  const pb = select(INDEX, MEME).members.find((m) => m.blocks_revenue) || INDEX[0];
  const flags = new Set();
  const s0 = score(pb, 0, flags);
  const s5 = score(pb, 5, flags);
  assert.ok(Number.isFinite(s0) && s0 > 0);
  assert.equal(score(pb, 0, flags), s0, "deterministic for identical inputs");
  assert.ok(s0 > s5, "lower slack scores higher");
});

test("score: a revenue-blocking playbook is boosted until revenue exists", () => {
  const pb = INDEX.find((p) => p.blocks_revenue);
  const before = score(pb, 1, new Set());
  const after = score(pb, 1, new Set(["has_revenue"]));
  assert.ok(before > after, "blocks_revenue boosts score before has_revenue is set");
});

// ---- buildMap ----

test("buildMap: member_count matches select; levels sorted; statuses valid", () => {
  const expected = select(INDEX, MEME).members.length;
  const map = buildMap(INDEX, MEME, { completed: [], level: 0 });
  assert.equal(map.member_count, expected);
  const keys = map.levels.map((l) => levelKey(l.level));
  assert.deepEqual(keys, [...keys].sort((a, b) => a - b), "levels are ordered");
  const valid = new Set(["done", "ready", "blocked"]);
  for (const lvl of map.levels) for (const n of lvl.nodes) assert.ok(valid.has(n.status), n.id);
});

test("buildMap: a completed playbook is marked done", () => {
  const map = buildMap(INDEX, MEME, { completed: ["opportunity-scan"], level: 0 });
  const node = map.levels.flatMap((l) => l.nodes).find((n) => n.id === "opportunity-scan");
  assert.equal(node.status, "done");
});

test("buildMap: b2c self-serve drops the enterprise level; b2b high-acv keeps it", () => {
  const meme = buildMap(INDEX, MEME, {});
  const probe = buildMap(INDEX, PROBE, {});
  assert.ok(!meme.levels.some((l) => l.level === 7), "b2c has no level 7");
  assert.ok(probe.levels.some((l) => l.level === 7), "b2b high-acv keeps level 7");
});

// ---- nextActions ----

test("nextActions: at level 0 nothing above level 0 is recommended", () => {
  const acts = nextActions(INDEX, MEME, { completed: [], level: 0 });
  assert.ok(acts.length > 0, "some action is ready at level 0");
  for (const a of acts) assert.ok(levelKey(a.level) <= 0, `${a.id} is above level 0`);
});

test("nextActions: Phase 0 brief follows opportunity evidence, then unblocks the website", () => {
  const acts = nextActions(INDEX, MEME, { completed: [], level: 0 });
  assert.ok(acts.length > 0, "some action is ready at level 0");
  const ids = acts.map((a) => a.id);
  assert.ok(ids.includes("opportunity-scan"));
  assert.ok(!ids.includes("phase0-company-brief") && !ids.includes("phase0-website"));
  const afterScan = nextActions(INDEX, MEME, { completed: ["opportunity-scan"], level: 0 });
  assert.ok(afterScan.some((p) => p.id === "phase0-company-brief"));
  assert.ok(!afterScan.some((p) => p.id === "phase0-website"));
  assert.ok(nextActions(INDEX, MEME, { completed: ["opportunity-scan", "phase0-company-brief"], level: 0 }).some((p) => p.id === "phase0-website"));
});

test("nextActions: results are sorted by tier then score", () => {
  // do-or-die and the founder's focus lead (tier); the pulse-weighted score orders within a tier.
  const acts = nextActions(INDEX, PROBE, { completed: [], level: 0 });
  for (let i = 1; i < acts.length; i++) {
    const prev = acts[i - 1], cur = acts[i];
    assert.ok(prev.tier > cur.tier || (prev.tier === cur.tier && prev.score >= cur.score), "tier desc, then score desc within tier");
  }
});

test("nextActions: gating — every ready action has its member-deps satisfied", () => {
  const completed = ["opportunity-scan"];
  const completedSet = new Set(completed);
  const { members } = select(INDEX, MEME);
  const memberIds = new Set(members.map((m) => m.id));
  const byId = new Map(members.map((m) => [m.id, m]));
  const acts = nextActions(INDEX, MEME, { completed, level: 0 });
  for (const a of acts) {
    assert.ok(!completedSet.has(a.id), "completed actions are not re-recommended");
    const deps = (byId.get(a.id).depends_on || []).filter((d) => memberIds.has(d));
    // a dependency must be completed, unless it is a recurring loop (which never blocks)
    for (const d of deps) assert.ok(completedSet.has(d) || byId.get(d).recurring, `${a.id} surfaced before non-recurring dep ${d}`);
  }
});

test("nextActions: completing an action removes it from the ready set", () => {
  const before = nextActions(INDEX, MEME, { completed: [], level: 0 }).map((a) => a.id);
  assert.ok(before.includes("opportunity-scan"), "opportunity-scan is ready up front");
  const after = nextActions(INDEX, MEME, { completed: ["opportunity-scan"], level: 0 }).map((a) => a.id);
  assert.ok(!after.includes("opportunity-scan"), "and gone once completed");
});

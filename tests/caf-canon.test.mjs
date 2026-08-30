// Canonical CAF JSON. Determinism is the whole product here: if the same logical
// content can produce two byte strings, every digest and every signature downstream
// is meaningless. These tests are the ones whose failure should block a release.

import { test } from "node:test";
import assert from "node:assert/strict";
import { canon, compareCodePoints } from "../scripts/caf/canon.mjs";
import { digest, digestJson } from "../scripts/caf/digest.mjs";

test("canon: keys are sorted, whitespace is absent", () => {
  assert.equal(canon({ b: 1, a: 2 }), '{"a":2,"b":1}');
  assert.equal(canon({ z: { y: 1, x: 2 } }), '{"z":{"x":2,"y":1}}');
  assert.equal(canon([3, 1, 2]), "[3,1,2]", "array order is semantic and preserved");
});

test("canon: source key insertion order cannot change the bytes", () => {
  const a = { one: 1, two: { alpha: "a", beta: "b" }, three: [1, 2] };
  const b = { three: [1, 2], two: { beta: "b", alpha: "a" }, one: 1 };
  assert.equal(canon(a), canon(b));
  assert.equal(digestJson(a), digestJson(b));
});

test("canon: integers only. floats, NaN and Infinity throw", () => {
  assert.throws(() => canon({ x: 0.1 }), /integers only/);
  assert.throws(() => canon({ x: 82.5 }), /integers only/);
  assert.throws(() => canon(0.1 + 0.2), /integers only/);
  assert.throws(() => canon({ x: NaN }), /finite/);
  assert.throws(() => canon({ x: Infinity }), /finite/);
  assert.throws(() => canon({ x: Number.MAX_SAFE_INTEGER + 2 }), /safe integer/);
});

test("canon: negative zero normalizes, so -0 and 0 cannot fork a digest", () => {
  assert.equal(canon(-0), "0");
  assert.equal(digestJson({ n: -0 }), digestJson({ n: 0 }));
});

test("canon: undefined properties are dropped, null is preserved", () => {
  assert.equal(canon({ a: undefined, b: null }), '{"b":null}');
  assert.equal(canon({ b: null }), canon({ a: undefined, b: null }));
});

test("canon: unsupported types throw rather than silently coercing", () => {
  assert.throws(() => canon(new Date()), /unsupported type/);
  assert.throws(() => canon({ f: () => 1 }), /unsupported type/);
  assert.throws(() => canon(10n), /unsupported type/);
});

test("canon: strings use RFC 8259 escaping and do not escape the solidus", () => {
  assert.equal(canon("a/b"), '"a/b"');
  assert.equal(canon('he said "hi"\n'), '"he said \\"hi\\"\\n"');
  assert.equal(canon("é"), '"é"', "non-ASCII stays literal UTF-8");
});

test("canon: keys sort by code point, not UTF-16 code unit", () => {
  // U+FF3A (fullwidth Z) is a single code unit above U+E000; U+1D400 is astral
  // and sorts AFTER it by code point, but BEFORE it by raw UTF-16 code unit
  // (its high surrogate is U+D835). Naive .sort() gets this backwards.
  const naive = ["\u{1D400}", "Ｚ"].sort();
  assert.equal(naive[0], "\u{1D400}", "sanity: default sort puts the astral char first");

  assert.ok(compareCodePoints("Ｚ", "\u{1D400}") < 0, "code point order is the other way");
  assert.equal(canon({ "\u{1D400}": 1, "Ｚ": 2 }), '{"Ｚ":2,"\u{1D400}":1}');
});

test("canon: byte-identical across repeated runs (the release-blocking property)", () => {
  const brainish = {
    buildmap: { total: 169, done: 71, ready: 9 },
    constraint: { archetype: "no_users", win_gap: 37 },
    work: { tasks_done_total: 2250 },
  };
  const first = canon(brainish);
  for (let i = 0; i < 50; i++) assert.equal(canon(brainish), first);
});

test("digest: known SHA-256 vector, hex lowercase", () => {
  assert.equal(digest("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(digest(Buffer.from("abc")), digest("abc"), "string and bytes agree");
});

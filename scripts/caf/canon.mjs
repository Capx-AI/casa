// Canonical CAF JSON (CCJ). The one serialization every digest and signature is
// taken over, so the same logical content always produces the same bytes.
//
//   - UTF-8, no byte-order mark, no insignificant whitespace.
//   - Object keys sorted by Unicode CODE POINT, ascending.
//   - INTEGERS ONLY. A signature over a float is a signature over a language's
//     serializer, not over a value. Money is micro-dollars, scores are 0-100,
//     ratios are basis points. If you need a fraction, pick a smaller unit.
//   - null only where a schema allows it; undefined properties are dropped.
//
// Zero dependencies (node: builtins only, and in fact none are needed here).

// Strictly a plain object. A Date, Map, Set, RegExp or class instance is typeof
// "object" and would otherwise serialize to "{}" -- a value silently vanishing
// from a signed structure. Reject it loudly instead.
const isPlainObject = (v) => {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

// JS's default Array.sort on strings compares UTF-16 code UNITS, which diverges
// from code-POINT order for astral characters (a surrogate pair sorts before
// U+E000..U+FFFF). Sort by code point so the ordering is stable across languages
// whose native sort is code-point based.
export function compareCodePoints(a, b) {
  const ai = [...a], bi = [...b];
  const n = Math.min(ai.length, bi.length);
  for (let i = 0; i < n; i++) {
    const d = ai[i].codePointAt(0) - bi[i].codePointAt(0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return ai.length - bi.length;
}

function ser(v, path) {
  if (v === null) return "null";

  const t = typeof v;
  if (t === "boolean") return v ? "true" : "false";

  if (t === "number") {
    if (!Number.isFinite(v)) throw new TypeError(`canon: ${v} at ${path} is not a finite number`);
    if (!Number.isInteger(v)) {
      throw new TypeError(
        `canon: non-integer number ${v} at ${path}. CCJ is integers only; ` +
        "encode money as micro-dollars, ratios as basis points.",
      );
    }
    if (!Number.isSafeInteger(v)) throw new TypeError(`canon: ${v} at ${path} exceeds the safe integer range`);
    return Object.is(v, -0) ? "0" : String(v);
  }

  // JSON.stringify gives RFC 8259 escaping with the shortest legal escape and
  // does not escape the forward slash, which is exactly what CCJ requires.
  if (t === "string") return JSON.stringify(v);

  if (Array.isArray(v)) return "[" + v.map((x, i) => ser(x, `${path}[${i}]`)).join(",") + "]";

  if (isPlainObject(v)) {
    const keys = Object.keys(v).filter((k) => v[k] !== undefined).sort(compareCodePoints);
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + ser(v[k], `${path}.${k}`)).join(",") + "}";
  }

  throw new TypeError(`canon: unsupported type ${t === "object" ? v.constructor?.name || "object" : t} at ${path}`);
}

// Serialize a value to Canonical CAF JSON. Throws rather than guessing.
export function canon(value) {
  return ser(value, "$");
}

// Parse CCJ back. Provided for symmetry and for tests; JSON.parse is sufficient
// because CCJ is a strict subset of JSON.
export const parse = (text) => JSON.parse(text);

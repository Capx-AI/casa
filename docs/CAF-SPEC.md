# Company Attestation Format (CAF), version 1.1.0

**Version history:** 1.1.0 (2026-08-12) adds one optional field, `subject.driver_harness`,
naming the agent harness that drove the work. 1.0.0 envelopes remain valid: a verifier
MUST accept any `1.x` and MUST NOT require the new field. Emitters MAY continue to emit
1.0.0.

**Status:** Normative for the format this repo emits and verifies. The reference
implementation is this repo: `scripts/caf/` (primitives), `scripts/attest.mjs` (renderer),
`caf/` (keygen, sign, check, lint), `caf/schema/` (JSON Schemas), generated `caf/fixtures/`
(golden brain and adversarial forgeries), and `examples/caf-emit-minimal/` (a conforming
emitter with no Casa dependency). Where prose and code disagree, the code and schemas win;
file an issue.

**Purpose:** CAF is the format by which a company run by agents publishes a signed,
hash-chained, content-addressed record of what it did, so a third party can verify the
record's integrity and internal consistency without running the company.

**Scope:** this document specifies the publication format, the canonical serialization,
the commitment scheme, and the three-tier offline verification that `caf/check.mjs`
implements. Registry policy (scoring, eligibility, token binding, challenges, anchoring)
is deliberately out of scope: it is not part of the neutral format and does not live in
this repository. See `docs/FORK.md` for the seam.

**Harness neutrality:** Capx Casa is one emitter. A company built in Codex, Hermes,
OpenClaw, grok-build, or by hand is a first-class CAF emitter. The envelope carries a
`subject.harness` field that names the emitter; it is informational and never gated.
`examples/caf-emit-minimal/emit.mjs` demonstrates full conformance in about 160 lines
with zero imports from this repo.

Requirement levels MUST, MUST NOT, SHOULD, MAY are per RFC 2119.

---

## 1. Design constraints

1. **The emitter is untrusted.** Every field in `claims.json` is a claim. The format
   makes claims permanent, ordered, and checkable; it does not make them true.
2. **Disclosure is partial, commitment is total.** The emitter publishes a projection
   and commits, via a Merkle root, to every file in the brain. Any committed file can
   later be proven against that root.
3. **Determinism is a hard requirement.** The same brain state MUST produce
   byte-identical output. `scripts/attest.mjs` is a pure function of brain state: no
   clock, no network, no randomness.
4. **No floats in signed structures.** Money in micro-dollars (1 USD = 1,000,000
   micros), scores as integers 0 to 100, ratios in basis points.
5. **Zero dependencies to emit.** A conforming emitter needs SHA-256, Ed25519, and the
   canonical serializer in section 3. Nothing else.

---

## 2. The publication

A CAF publication is the `attest/` directory inside a company brain:

```
attest/
  attestation.json          the signed envelope (the only signed object)
  profile.json              copy of the brain's profile at render time (may be absent)
  claims.json               the disclosed projection
  ledger.delta.jsonl        events in this attestation's window
  receipts.window.jsonl     settled spend receipts in the window (may be empty)
  merkle.json               the full-brain root and per-artifact inclusion proofs
  chain.jsonl               the emitter's own append-only chain record
```

`attestation.json` contains digests of `profile.json`, `claims.json`,
`ledger.delta.jsonl`, `receipts.window.jsonl`, and `merkle.json`. Tampering with any of
them invalidates the envelope.

---

## 3. Canonical CAF JSON (CCJ)

All digests and signatures are taken over CCJ bytes. Reference: `scripts/caf/canon.mjs`.

1. UTF-8, no byte-order mark, no insignificant whitespace, no trailing newline inside
   the serialized value.
2. Object keys sorted by Unicode code point, ascending. Note this is code POINT order,
   not UTF-16 code unit order; they diverge for astral characters.
3. Strings escaped per RFC 8259 with the shortest legal escape. Forward slashes are not
   escaped.
4. **Numbers MUST be integers** within the safe 64-bit float-safe range, serialized with
   no leading zeros, no plus sign, no exponent, no decimal point. Negative zero
   serializes as `0`.
5. `null` only where a schema allows it. Properties whose value is `undefined` are
   dropped. A Date, Map, Set, RegExp, or class instance MUST be rejected loudly, never
   silently serialized.
6. Arrays preserve emitter order. Where order is not semantically meaningful the schema
   names a sort key and the emitter MUST apply it.

A verifier MUST reject an envelope whose re-serialized CCJ does not reproduce the signed
digest. CCJ is a strict subset of JSON, so any JSON parser reads it.

---

## 4. Digests and the Merkle tree

Reference: `scripts/caf/digest.mjs`, `scripts/caf/merkle.mjs`.

### 4.1 Digest

`digest(bytes) = SHA-256(bytes)`, rendered lowercase hex, 64 characters.

### 4.2 Construction

Over a set of `(path, content)` pairs:

- Sort entries by path bytes, ascending. Duplicate paths are an error.
- Leaf: `SHA-256(0x00 || uvarint(len(path)) || path || SHA-256(content))`
- Internal node: `SHA-256(0x01 || left || right)`
- If a level has an odd number of nodes, the last node is duplicated.
- The empty set has the defined root `SHA-256(0x00)`.

`uvarint` is the unsigned LEB128 varint. Path is the byte sequence of the brain-relative
path with forward slashes and no leading slash. The `0x00`/`0x01` domain prefixes stop an
internal node being presented as a leaf; the length prefix stops `a/bc` and `ab/c`
colliding.

### 4.3 The two roots

- `brain_root`: the tree over **every regular file** under the brain root except the
  `attest/` directory itself. Exclusion of any other file is a decision not to commit to
  it, which defeats the purpose.
- `disclosed_root`: the tree over exactly these four paths as published:
  `profile.json`, `claims.json`, `ledger.delta.jsonl`, `receipts.window.jsonl`.
  Absent files enter as empty content.

### 4.4 Proofs

`merkle.json` MUST contain, for each `artifact_sha256` referenced in
`ledger.delta.jsonl`, an inclusion proof against `brain_root`. Each proof carries the
leaf hex and a `siblings` array of `{h, side}` pairs, where `side` is `"L"` or `"R"`
for the sibling's position, so a verifier can fold without knowing level widths.

Two verification modes exist, and the difference matters for what a UI may claim:

- From revealed bytes (`verifyInclusion`): proves the published bytes are the ones
  committed. This is the reveal path.
- From the digest alone (`verifyCommitment`): a party holding only `attest/` can rebuild
  the leaf from `(path, artifact_sha256)` and fold it to the root. This proves those
  exact bytes were committed under that path. It does not prove the bytes are any good,
  or that they still exist.

---

## 5. The envelope: `attestation.json`

Schema: `caf/schema/attestation.schema.json`. All timestamps in this document are
ISO-8601 UTC strings ending in `Z`.

| Field | Type | Rule |
|---|---|---|
| `caf_version` | string | This spec's version, `1.x.y`. Verifier MUST reject an unknown major. |
| `sequence` | integer | Starts at 0. Strictly `prev.sequence + 1`. |
| `prev_envelope_hash` | string or null | `null` if and only if `sequence == 0`, else `digest(CCJ(prev envelope without signature))`. |
| `subject.company_pubkey` | string or null | Ed25519 public key, base64url (the JWK `x` value). Immutable for the life of the chain. `null` only while unsigned. |
| `subject.harness` | object | `{name, version}`. Names the EMITTER that rendered this record. Informational, never gated. |
| `subject.driver_harness` | object, optional | `{name, version?}`. Names the agent harness that DROVE the work (claude-code, codex, grok, hermes, openclaw, ...). Distinct from `harness`: one emitter can serve many drivers. Recorded in `identity.json` at init, copied verbatim by the renderer, omitted when unset. Informational, never gated. Added in 1.1.0. |
| `subject.brain_schema_version` | string | The brain layout version the emitter wrote against. |
| `subject.playbook_index_sha256` | string | Digest of the playbook catalog the brain was built against (`playbooks/_index.json`). Emitters with no catalog use the all-zero digest and forgo legality checking. |
| `window.from_ts` | string | MUST equal `prev.window.to_ts`. Genesis window starts at the first ledger event. |
| `window.to_ts` | string | End of this window. |
| `roots` | object | `brain_root`, `disclosed_root`, per section 4. |
| `digests` | object | `profile`, `claims`, `ledger_delta`, `receipts_window`, `merkle`: `digest` of each companion file's raw bytes. |
| `produced_at` | string | Emitter clock. Advisory only; never used for ordering. |
| `signature` | string | `"ed25519:" + base64url(sig)`, per 5.1. Absent while unsigned. |

### 5.1 Signing

Reference: `caf/sign.mjs`, `caf/keygen.mjs`.

- The signing preimage is `digest(CCJ(envelope without its signature field))`, as 32
  raw bytes. Ed25519 signs those bytes directly; there is no second hash.
- The signature field is the 64 signature bytes, base64url, prefixed `ed25519:`.
- The public key encoding everywhere is the base64url JWK `x` value of the Ed25519 key.
- The renderer and the signer are separate on purpose. `scripts/attest.mjs` renders and
  never sees a key; `caf/keygen.mjs` writes the private key outside the brain
  (`~/.capx/keys/<company_pubkey>.key`, mode 0600) and only the public half into `identity.json`;
  `caf/sign.mjs` signs in place. A harness MUST NOT hold a company private key inside
  the brain or the repo. Signing MUST NOT mutate any envelope field.
- Signing with a key that does not match `identity.json`'s `company_pubkey` MUST be
  refused: a company's key is its identity, and signing with another forks the chain.

### 5.2 The chain: `chain.jsonl`

The emitter appends one row per rendered attestation:
`{sequence, envelope_hash, from_ts, to_ts}` where `envelope_hash` is the signing
preimage digest. Sequences MUST increase by exactly 1 and windows MUST tile
(`from_ts == prev.to_ts`) with no gaps.

---

## 6. The projection: `claims.json`

Schema: `caf/schema/claims.schema.json`. Every field MUST be derived from brain state.
An emitter MUST NOT place free-form prose in claims; prose belongs in artifacts, which
are committed and revealable.

Required blocks, with the load-bearing fields:

| Block | Required fields | Meaning |
|---|---|---|
| `state` | `level` (0 to 8) | Where the company is in the level model. |
| `buildmap` | `total`, `done`, `ready`, `blocked`, `done_nodes[]` (each with `node_id`) | Progress against the declared playbook plan. |
| `work` | `tasks_done_window`, `tasks_done_total`, `node_id_coverage_bp` | Window and lifetime counts; what share of done work names a playbook node, in basis points. |
| `quality` | `self_score_mean` (0 to 100) | Mean of the brain's own graded scores. Self-reported by construction. |
| `spend` | `settled_micros_total`, `pay_attested` | Settled spend; whether any receipt carries a countersignature not authored by the founder. |
| `self_check` | `index_sha256`, `dag_violations` | The emitter's own legality replay result and the catalog it ran against. |

Emitters without a given source (no scores, no receipts, no catalog) fill the honest
zero: counts 0, `pay_attested` false, coverage 0. The format permits a weak record; it
does not permit a fabricated one.

---

## 7. The delta: `ledger.delta.jsonl`

Schema: `caf/schema/ledger-event.schema.json`. One CCJ JSON object per line. Every
event whose `ts` falls in the window and is not present in an earlier attestation.

| Field | Required | Notes |
|---|---|---|
| `ts` | yes | ISO-8601 UTC. Ordering within the window only. |
| `id` | yes | Globally unique on the chain. A duplicate is a verification failure. |
| `kind` | yes | `task` or `playbook`. |
| `task` | yes | Free string. |
| `status` | yes | One of `started`, `running`, `blocked`, `done`, `merged`, `failed`, `cancelled`. |
| `dept`, `agent` | no | Informational. |
| `node_id` | no | Build-map node this event completed. Required for graph checking. |
| `criticality` | no | `existential`, `core`, `growth`, `optional`. |
| `artifact`, `artifact_sha256` | no | Brain-relative path and its digest. If `artifact` is present its digest MUST have an inclusion proof in `merkle.json`. |
| `rubric_sha256` | no | Digest of the rubric the artifact was graded against. |
| `decision` | no | A dated decision this event records. |

---

## 8. The spend anchor: `receipts.window.jsonl`

Rows copied verbatim from `finance/receipts.jsonl` whose settlement falls in the
  window. The emitter MUST NOT author these rows; they are written by an external
  payment layer. Rows with status `dry-run` or `failed` MUST be
excluded from all sums. `pay_attested` is true only if at least one settled row carries
a valid countersignature from a key the founder does not hold.

---

## 9. Verification: `caf/check.mjs`

Three deterministic tiers, all offline, all free, exit non-zero on any failure.
**Passing is a self-check, not a verdict:** it means the record is internally coherent
and structurally legal, not that it is true. Only an observer over time can speak to
truth.

### Tier 0: structure

1. `caf_version` major is supported.
2. The envelope round-trips through CCJ.
3. If signed: `signature` verifies against `subject.company_pubkey`. An unsigned
   envelope is noted, not failed; chain integrity holds but nothing binds it to an
   identity.
4. Every entry in `digests` matches the actual companion bytes.
5. `disclosed_root` recomputes from the published files, and `merkle.json` agrees.
6. When the full brain is present: `brain_root` recomputes from disk.
7. The chain: the tip of `chain.jsonl` matches this envelope's sequence and signing
   preimage; `prev_envelope_hash` chains to the prior row; sequences step by 1 and
   windows tile.

### Tier 1: arithmetic

1. `work.tasks_done_window` equals the count of `done` rows in the delta.
2. `spend.settled_micros_window` equals the sum over settled receipt rows.
3. If a `win_definition` is claimed, `win_gap == target_value - current_value`.
4. No duplicate event `id` in the delta; every event `ts` inside the window.
5. Every claimed artifact: proof present, bytes present in the brain, digest matches,
   inclusion proof verifies against `brain_root`.

### Tier 2: legality

Reference: `scripts/caf/legality.mjs`. Replays the ledger through the playbook
catalog's own readiness function: a `done` playbook node whose dependencies were not
done, or whose level gate was not open at the time, is a violation. Also checks that
the catalog on disk matches `subject.playbook_index_sha256`.

A brain with no `profile.json` declares no playbook plan. That is legal: CAF is
harness-agnostic and a hand-rolled emitter has no DAG to be checked against. It is also
visibly weaker, and the checker says so rather than crashing or pretending. Low
`node_id` coverage is noted for the same reason: done work that names no node cannot be
graph-checked.

---

## 10. Conformance

An emitter conforms if, over the deterministic fixtures generated by `caf/fixtures/`, it produces
byte-identical output on repeated runs from a clean checkout, and `caf/lint.mjs`
accepts every output and `caf/check.mjs` passes it.

A verifier conforms if it rejects every Tier 0 and Tier 1 violation in the adversarial
fixture set and records every Tier 2 violation. The adversarial fixtures are part of
the specification, not an implementation detail; they include forged sequences,
rewritten chain links, count mismatches, out-of-order completions, and duplicate
artifacts.

The minimal emitter, `examples/caf-emit-minimal/emit.mjs`, is the conformance floor:
`identity.json` plus `ledger.jsonl` in, a valid publication out, no Casa code. Its
output passing this repo's own `lint` and `check` is asserted by
`tests/caf-standard.test.mjs`.

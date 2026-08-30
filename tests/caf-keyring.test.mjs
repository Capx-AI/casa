// Per-brain signing keys live in the CAPX_HOME keyring, never in the company brain.
// identity.json stores only the public half; caf/sign.mjs resolves the private key
// from that pubkey (or an explicit --key).

import { after, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, cpSync, mkdtempSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { attest } from "../scripts/attest.mjs";
import { keygen, keyPath, keyPathFor, publicKeyOf } from "../caf/keygen.mjs";
import { signBrain } from "../caf/sign.mjs";
import { generate } from "../caf/fixtures/generate.mjs";

const FIXTURE_ROOT = mkdtempSync(join(tmpdir(), "caf-keyring-suite-"));
const GOLDEN = generate({ out: join(FIXTURE_ROOT, "golden") }).brain;
after(() => rmSync(FIXTURE_ROOT, { recursive: true, force: true }));

function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "caf-keyring-"));
  const brain = join(root, "company-brain");
  cpSync(GOLDEN, brain, { recursive: true });
  const prevHome = process.env.CAPX_HOME;
  process.env.CAPX_HOME = root;
  return {
    root,
    brain,
    secondBrain() {
      const b = join(root, "company-brain-2");
      cpSync(GOLDEN, b, { recursive: true });
      return b;
    },
    done() {
      prevHome === undefined ? delete process.env.CAPX_HOME : (process.env.CAPX_HOME = prevHome);
      rmSync(root, { recursive: true, force: true });
    },
  };
}

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

test("two brains in one CAPX_HOME get two different keys", () => {
  const s = sandbox();
  try {
    const a = keygen({ brainDir: s.brain });
    const brain2 = s.secondBrain();
    const b = keygen({ brainDir: brain2 });
    assert.notEqual(a.pubkey, b.pubkey);
    assert.notEqual(a.path, b.path);
    assert.equal(a.path, keyPathFor(a.pubkey));
    assert.equal(b.path, keyPathFor(b.pubkey));
    assert.equal(JSON.parse(readFileSync(join(s.brain, "identity.json"), "utf8")).company_pubkey, a.pubkey);
    assert.equal(JSON.parse(readFileSync(join(brain2, "identity.json"), "utf8")).company_pubkey, b.pubkey);
    assert.ok(existsSync(a.path));
    assert.ok(existsSync(b.path));
    assert.equal(statSync(a.path).mode & 0o777, 0o600);
    assert.equal(statSync(join(s.root, ".capx", "keys")).mode & 0o777, 0o700);
  } finally { s.done(); }
});

test("private key file is not inside the brain directory", () => {
  const s = sandbox();
  try {
    const r = keygen({ brainDir: s.brain });
    assert.ok(existsSync(r.path));
    assert.equal(r.path.startsWith(s.brain + "/"), false, "key path must not be under the brain");
    assert.ok(r.path.startsWith(join(s.root, ".capx", "keys") + "/"));

    const id = JSON.parse(readFileSync(join(s.brain, "identity.json"), "utf8"));
    assert.equal(id.company_pubkey, r.pubkey);
    assert.equal("company_privkey" in id, false);

    for (const f of walkFiles(s.brain)) {
      assert.equal(f.endsWith(".key"), false, `no .key file in the brain: ${relative(s.brain, f)}`);
      const txt = readFileSync(f, "utf8");
      assert.equal(/BEGIN (?:PRIVATE|RSA PRIVATE|EC PRIVATE) KEY/.test(txt), false, `private key leaked into ${relative(s.brain, f)}`);
    }
  } finally { s.done(); }
});

test("legacy company.key is adopted once for a pubkey-less brain", () => {
  const s = sandbox();
  try {
    const legacy = keygen();
    rmSync(join(s.root, ".capx", "keys"), { recursive: true, force: true });
    assert.ok(existsSync(keyPath()));
    assert.equal(existsSync(keyPathFor(legacy.pubkey)), false);

    const adopted = keygen({ brainDir: s.brain });
    assert.equal(adopted.pubkey, legacy.pubkey);
    assert.equal(adopted.created, false);
    assert.ok(existsSync(keyPathFor(legacy.pubkey)));
    assert.equal(publicKeyOf(readFileSync(keyPathFor(legacy.pubkey), "utf8")), legacy.pubkey);
    assert.equal(JSON.parse(readFileSync(join(s.brain, "identity.json"), "utf8")).company_pubkey, legacy.pubkey);

    const brain2 = s.secondBrain();
    const next = keygen({ brainDir: brain2 });
    assert.notEqual(next.pubkey, legacy.pubkey, "after adoption, a new brain gets a new key");
    assert.equal(next.created, true);
    assert.equal(JSON.parse(readFileSync(join(brain2, "identity.json"), "utf8")).company_pubkey, next.pubkey);
    assert.equal(JSON.parse(readFileSync(join(s.brain, "identity.json"), "utf8")).company_pubkey, legacy.pubkey);
  } finally { s.done(); }
});

test("signBrain finds the per-pubkey key", () => {
  const s = sandbox();
  try {
    const r = keygen({ brainDir: s.brain });
    if (existsSync(keyPath())) rmSync(keyPath());
    attest(s.brain);
    const ok = signBrain(s.brain);
    assert.equal(ok.pubkey, r.pubkey);
    assert.match(ok.signature, /^ed25519:/);
  } finally { s.done(); }
});

test("signing with the wrong key still throws", () => {
  const s = sandbox();
  try {
    const a = keygen({ brainDir: s.brain });
    const brain2 = s.secondBrain();
    const b = keygen({ brainDir: brain2 });
    attest(s.brain);
    assert.throws(
      () => signBrain(s.brain, { key: b.path }),
      /does not match identity.json/,
    );
    const ok = signBrain(s.brain);
    assert.equal(ok.pubkey, a.pubkey);
  } finally { s.done(); }
});

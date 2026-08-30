# Attestation

Casa can emit a **verifiable, tamper-evident record of what your company did**, so anyone
you choose can check it: an investor, an acquirer, a co-founder, a registry.

It discloses a summary. It commits, by Merkle root, to every file in your brain. Later,
anyone can demand that a single file be revealed and proven, without it ever having been
published.

Nothing leaves your machine unless you send it.

## The four commands

```sh
node caf/keygen.mjs company-brain      # once. Key at ~/.capx/keys/<company_pubkey>.key, mode 0600.
node scripts/brain.mjs attest company-brain
node caf/sign.mjs company-brain
node caf/check.mjs company-brain       # verify it, offline, with no network
```

`brain.mjs attest` renders `company-brain/attest/` and stops. It has no network code and
holds no keys: **Casa renders, the sidecar signs.** Casa never sees a private key and
does not publish the result. If you share an attestation, inspect the disclosed files
first and use a separate founder-controlled transfer or integration.

## What is in `attest/`

| File | What it is |
|---|---|
| `attestation.json` | The signed envelope: sequence, previous hash, roots, digests. |
| `claims.json` | The disclosed projection. Derived, never free-form prose. |
| `ledger.delta.jsonl` | Events since your last attestation. `note` and `terminal` stripped. |
| `receipts.window.jsonl` | Settled receipts from an external payment layer. Empty when none exist. |
| `merkle.json` | The brain root, the disclosed root, and an inclusion proof per artifact. |
| `chain.jsonl` | Your local record of every attestation you have made. Append-only. |

## What it proves

- **Tamper evidence.** Change one byte of one artifact and three independent checks fail.
- **Append-only ordering.** Each attestation chains to the last. Rewriting history is visible.
- **Legality.** Every playbook you claim to have completed was actually *ready* when you
  claimed it, judged by the router's own readiness function, replayed against a catalog
  pinned by digest. A naive forgery trips this in the first few events, at zero token cost.
- **A pinned grading contract.** Each completion records the digest of the rubric its
  playbook published, hashed before the work began.

## What it does not prove

Say this plainly, because a reader will otherwise assume more than is true.

1. **No identity binding.** A signature proves that whoever holds the key produced this
   chain. It does not prove who they are.
2. **No anti-sybil.** Anyone can generate a thousand keys and a thousand chains. Nothing
   costs anything.
3. **No third-party clock.** `produced_at` is your own clock, and it is advisory. Only an
   observer that records when it *saw* an attestation has a trustworthy timestamp.
4. **`caf check` is a self-check, not a verdict.** Passing means the record is internally
   coherent and structurally legal. It does not mean the record is **true**. Casa can only
   say that a company has not contradicted itself.

All four resolve the same way: they are properties of a **registry**, not of the format.
The format's job is to make a registry possible, and to be useful before one exists.

## The format is not Casa's

`caf/` and `scripts/caf/` know nothing about any registry. `examples/caf-emit-minimal/`
emits a valid attestation in about a hundred lines with **no Casa dependency at all**, from
a brain with no profile and no playbooks, and `caf/check.mjs` accepts it.

Such an attestation is valid and visibly weaker: it names no playbooks, so
`node_id_coverage_bp` collapses to zero and nothing it claims can be graph-checked. That is
the honest trade, and it is legible to whoever reads it.

Casa's advantage is not that it is required. It is that it emits a **high-scoring**
attestation as a side effect of being used.

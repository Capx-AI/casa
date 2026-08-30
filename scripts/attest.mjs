// The emitter. Renders company-brain/attest/ from brain state.
//
// An attestation lets a company publish a verifiable, tamper-evident record of what it
// did, so anyone it chooses can check it: an investor, an acquirer, a co-founder, a
// registry. It DISCLOSES a projection and COMMITS, by Merkle root, to every file in the
// brain. Later, a challenger can demand any single file be revealed and proven, without
// it ever having been published.
//
// Three hard properties:
//   1. Pure function of brain state. No network, no key material, no clock. `produced_at`
//      is the last ledger timestamp, not Date.now(), so the same brain always renders the
//      same bytes. A nondeterministic emitter makes every downstream digest meaningless.
//   2. Casa never signs. Signing needs a private key, and Casa holds no keys (directive 8).
//      `caf/sign.mjs` is a separate tool the founder runs.
//   3. brain.mjs stays the sole writer of brain state. This is a library it calls.
//
// Zero dependencies (node: builtins + relative only).

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, appendFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { canon } from "./caf/canon.mjs";
import { digest, digestJson } from "./caf/digest.mjs";
import { merkleRoot, inclusionProof } from "./caf/merkle.mjs";
import { checkLegality } from "./caf/legality.mjs";
import { northStar } from "./northstar.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
export const CAF_VERSION = "1.1.0";

const readJson = (f, dflt = null) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : dflt);
const readJsonl = (f) =>
  !existsSync(f) ? [] : readFileSync(f, "utf8").split("\n").map((l) => l.trim()).filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

// Every regular file in the brain, EXCLUDING attest/ itself. Excluding a file would be a
// decision not to commit to it, which defeats the purpose; attest/ is excluded only
// because a tree cannot contain its own root.
function brainFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const abs = join(dir, name);
    const rel = relative(base, abs).split(sep).join("/");
    if (rel === "attest" || rel.startsWith("attest/")) continue;
    if (statSync(abs).isDirectory()) out.push(...brainFiles(abs, base));
    else out.push({ path: rel, content: readFileSync(abs) });
  }
  return out;
}

// The chain. Append-only, local. Without a registry this file IS the ordering; with one,
// the registry's observation is authoritative and this is the founder's own copy.
const chainPath = (brainDir) => join(brainDir, "attest", "chain.jsonl");
export function chainTip(brainDir) {
  const rows = readJsonl(chainPath(brainDir));
  return rows.length ? rows[rows.length - 1] : null;
}

function claimsOf(brainDir, delta, allEvents) {
  const profile = readJson(join(brainDir, "profile.json"));
  const state = readJson(join(brainDir, "state.json"), { completed: [] });
  const buildmap = readJson(join(brainDir, "build-map.json"));
  const roster = readJson(join(brainDir, "roster.json"));
  const dials = readJson(join(brainDir, "dials.json"));
  const scores = readJsonl(join(brainDir, "scores.jsonl"));
  const receipts = readJsonl(join(brainDir, "finance", "receipts.jsonl"));
  // A brain with no profile.json declares no playbook plan, so nothing in it can be
  // graph-checked. check.mjs treats that as a note, not a failure; the renderer must not
  // crash where the verifier is honest.
  const legality = existsSync(join(brainDir, "profile.json")) ? checkLegality(brainDir) : null;

  const level = buildmap?.current_level ?? 0;
  const ns = buildmap?.active_north_star ?? (profile ? northStar(profile, level) : null);
  const bc = state.binding_constraint ?? buildmap?.binding_constraint ?? null;

  const nodes = buildmap ? buildmap.levels.flatMap((L) => L.nodes) : [];
  const count = (s) => nodes.filter((n) => n.status === s).length;

  const donePb = allEvents.filter((e) => e.kind === "playbook" && e.status === "done");
  const doneAll = allEvents.filter((e) => e.status === "done");
  const deltaDone = delta.filter((e) => e.status === "done");
  const artifacts = new Set(donePb.map((e) => e.artifact_sha256).filter(Boolean));
  const open = new Set();
  for (const e of allEvents) (e.status === "started" || e.status === "running") ? open.add(e.task) : open.delete(e.task);

  const settled = (rows) => rows.filter((r) => r.status === "settled").reduce((a, r) => a + Number(r.amountMicros || 0), 0);
  const inWindow = (r) => delta.length && r.ts >= delta[0].ts && r.ts <= delta[delta.length - 1].ts;

  const passed = scores.filter((s) => s.pass === false);
  const mean = scores.length ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length) : 0;

  const win = bc?.win_definition;
  const structuredWin = win && typeof win === "object" ? win : null;
  const identity = readJson(join(brainDir, "identity.json"), {});
  const loopsFile = readJson(join(brainDir, "loops.json"), { loops: [] });
  const catalogById = new Map((JSON.parse(readFileSync(join(repo, "playbooks", "_index.json"), "utf8")).playbooks || []).map((p) => [p.id, p]));
  const nodeRef = (id) => {
    const pb = catalogById.get(id);
    const fromMap = nodes.find((n) => n.id === id);
    return {
      node_id: id,
      title: fromMap?.title || pb?.title || id,
      department: fromMap?.department || pb?.department || null,
    };
  };
  const byDept = {};
  for (const e of deltaDone) {
    const d = e.dept || catalogById.get(e.node_id)?.department;
    if (!d) continue;
    byDept[d] = (byDept[d] || 0) + 1;
  }
  const waiting = Object.entries(state.waiting || {}).slice(0, 10).map(([id, reason]) => ({
    node_id: id,
    reason: typeof reason === "string" ? reason.slice(0, 200) : "",
    ...nodeRef(id),
  }));
  const readyList = nodes.filter((n) => n.status === "ready").map((n) => nodeRef(n.id));
  const blockedList = nodes.filter((n) => n.status === "blocked").map((n) => nodeRef(n.id));
  const loopRuns = state.loops && typeof state.loops === "object" ? state.loops : {};
  const loops = (loopsFile.loops || []).filter((L) => Number(L.min_level || 0) <= Number(level)).map((L) => ({
    id: L.id,
    title: L.title || L.id,
    last_run: typeof loopRuns[L.id] === "string" ? loopRuns[L.id] : null,
    cadence_days: Number.isInteger(L.cadence_days) ? L.cadence_days : null,
  }));

  return {
    state: {
      level,
      level_name: buildmap?.levels?.find?.((L) => Number(L.level) === Number(level))?.name ?? null,
      departments: roster?.departments ?? [],
      leads: roster?.leads ?? bc?.lead_departments ?? [],
      one_liner: typeof profile?.one_liner === "string" ? profile.one_liner : null,
      created_at: typeof identity?.created_at === "string" ? identity.created_at : null,
      primary_type: typeof profile?.primary_type === "string" ? profile.primary_type : null,
      autonomy: dials ? {
        auto: Object.entries(dials.departments || {}).filter(([, v]) => v === "auto").map(([k]) => k),
        approve_first: Object.entries(dials.departments || {}).filter(([, v]) => v !== "auto").map(([k]) => k),
      } : null,
    },
    next: readyList.slice(0, 5),
    waiting,
    loops,
    buildmap: {
      total: buildmap?.member_count ?? 0,
      done: count("done"),
      ready: count("ready"),
      blocked: count("blocked"),
      critical_remaining: nodes.filter((n) => n.on_critical_path && n.status !== "done").length,
      done_delta: delta.filter((e) => e.kind === "playbook" && e.status === "done").length,
      levels: (buildmap?.levels || []).map((L) => ({
        level: Number(L.level),
        name: L.name || null,
        total: (L.nodes || []).length,
        done: (L.nodes || []).filter((n) => n.status === "done").length,
      })),
      ready_nodes: readyList.slice(0, 10),
      blocked_nodes: blockedList.slice(0, 10),
      // Each completion pins the grading contract that was in force when it was claimed.
      // The rubric was public and hashed before the work started, so a later grader cannot
      // be accused of moving the goalposts.
      done_nodes: donePb.map((e) => ({ node_id: e.node_id, rubric_sha256: e.rubric_sha256 ?? null }))
        .sort((a, b) => (a.node_id < b.node_id ? -1 : 1)),
    },
    northstar: ns ? { band: ns.band, metric_id: ns.metric, label: ns.label, guardrails: ns.guardrails ?? [] } : null,
    constraint: bc ? {
      archetype: bc.archetype ?? null,
      lead_departments: bc.lead_departments ?? [],
      win_definition: structuredWin ?? null,
      win_gap: Number.isInteger(bc.win_gap) ? bc.win_gap : null,
    } : null,
    work: {
      tasks_done_window: deltaDone.length,
      tasks_done_total: doneAll.length,
      artifacts_total: artifacts.size,
      in_flight: open.size,
      node_id_coverage_bp: legality ? legality.node_id_coverage_bp
        : (doneAll.length ? Math.round((donePb.length / doneAll.length) * 10000) : 10000),
      by_department: Object.entries(byDept).map(([department, events]) => ({ department, events }))
        .sort((a, b) => a.department < b.department ? -1 : 1),
    },
    quality: { self_score_mean: mean, self_score_n: scores.length, gaps_open: passed.reduce((a, s) => a + (s.gaps?.length || 0), 0) },
    // Written by an external payment layer, never by the emitter. Without such a
    // layer this is zero and pay_attested is false. Say so rather than imply otherwise.
    spend: {
      settled_micros_window: settled(receipts.filter(inWindow)),
      settled_micros_total: settled(receipts),
      receipt_count_window: receipts.filter(inWindow).length,
      pay_attested: false,
    },
    // Deterministic, reproducible by anyone holding the pinned catalog. Not a verdict:
    // only a registry signs verdicts. This is the company checking its own homework.
    self_check: legality ? {
      index_sha256: legality.index_sha256,
      dag_violations: legality.dag_violations,
      dataflow_violations: legality.dataflow_violations,
      level_violations: legality.level_violations,
      other_violations: legality.other_violations,
    } : {
      // No plan means nothing to violate: vacuously zero, same convention as the minimal
      // emitter. The catalog pin still names the graph this attestation was made beside.
      index_sha256: JSON.parse(readFileSync(join(repo, "playbooks", "_index.json"), "utf8")).index_sha256,
      dag_violations: 0,
      dataflow_violations: 0,
      level_violations: 0,
      other_violations: 0,
    },
  };
}

export function attest(brainDir, { commit = true } = {}) {
  const identity = readJson(join(brainDir, "identity.json"));
  if (!identity) throw new Error(`no identity.json in ${brainDir} (run brain.mjs init)`);
  const catalog = JSON.parse(readFileSync(join(repo, "playbooks", "_index.json"), "utf8"));

  const events = readJsonl(join(brainDir, "ledger.jsonl"))
    .sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : a.id < b.id ? -1 : 1));
  if (!events.length) throw new Error("nothing to attest: ledger.jsonl is empty");

  const tip = chainTip(brainDir);
  const from = tip ? tip.to_ts : events[0].ts;
  const delta = events.filter((e) => (tip ? e.ts > from : true));
  if (!delta.length) throw new Error(`nothing new since attestation ${tip.sequence} (${from})`);
  const to = delta[delta.length - 1].ts;

  const out = join(brainDir, "attest");
  mkdirSync(out, { recursive: true });

  // 1. the disclosed projection. `note` and `terminal` are stripped: they leak working
  //    context and no verification needs them.
  const claims = claimsOf(brainDir, delta, events);
  const deltaRows = delta.map(({ note, terminal, parent, ...keep }) => keep);
  const receipts = readJsonl(join(brainDir, "finance", "receipts.jsonl"))
    .filter((r) => r.ts >= from && r.ts <= to);

  // Disclose profile.json. Without it a registry holding only attest/ cannot re-run the
  // legality replay (select() and buildMap() both need it), so `self_check` would be the
  // company grading its own homework. With it, the registry's replay is byte-identical to
  // the founder's, because the deltas chain into the full ledger and the catalog is pinned.
  // The file is marketing-level: name, type, traits, ICP, one-liner.
  const profileText = existsSync(join(brainDir, "profile.json")) ? readFileSync(join(brainDir, "profile.json"), "utf8") : "";

  const claimsText = canon(claims) + "\n";
  const deltaText = deltaRows.map((e) => canon(e)).join("\n") + "\n";
  const receiptsText = receipts.length ? receipts.map((r) => canon(r)).join("\n") + "\n" : "";

  writeFileSync(join(out, "profile.json"), profileText);
  writeFileSync(join(out, "claims.json"), claimsText);
  writeFileSync(join(out, "ledger.delta.jsonl"), deltaText);
  writeFileSync(join(out, "receipts.window.jsonl"), receiptsText);

  // 2. commit to the WHOLE brain; disclose only the projection.
  const files = brainFiles(brainDir);
  const brain_root = merkleRoot(files);
  const disclosed = [
    { path: "profile.json", content: profileText },
    { path: "claims.json", content: claimsText },
    { path: "ledger.delta.jsonl", content: deltaText },
    { path: "receipts.window.jsonl", content: receiptsText },
  ];
  const disclosed_root = merkleRoot(disclosed);

  // Prove, for every artifact this window claims, that the named bytes were committed.
  const proofs = [];
  for (const e of deltaRows) {
    if (!e.artifact || !e.artifact_sha256) continue;
    if (!files.some((f) => f.path === e.artifact)) continue; // deleted since; recorded as absent
    proofs.push(inclusionProof(files, e.artifact));
  }
  const merkle = { brain_root, disclosed_root, leaf_count: files.length, artifact_proofs: proofs };
  const merkleText = canon(merkle) + "\n";
  writeFileSync(join(out, "merkle.json"), merkleText);

  // 3. the envelope. Unsigned: Casa renders, `caf/sign.mjs` signs.
  const envelope = {
    caf_version: CAF_VERSION,
    sequence: tip ? tip.sequence + 1 : 0,
    prev_envelope_hash: tip ? tip.envelope_hash : null,
    subject: {
      company_pubkey: identity.company_pubkey ?? null,
      harness: identity.harness,
      // Which agent harness drove the work (claude-code, codex, grok, hermes, openclaw,
      // ...). Distinct from `harness`, which names the EMITTER. Recorded at init, never
      // detected here: attest stays a pure function of brain state. Optional (CAF 1.1.0).
      ...(identity.driver_harness && typeof identity.driver_harness === "object"
        ? { driver_harness: identity.driver_harness } : {}),
      brain_schema_version: identity.brain_schema_version,
      playbook_index_sha256: catalog.index_sha256,
    },
    window: { from_ts: from, to_ts: to },
    roots: { brain_root, disclosed_root },
    digests: {
      profile: digest(profileText),
      claims: digest(claimsText),
      ledger_delta: digest(deltaText),
      receipts_window: digest(receiptsText),
      merkle: digest(merkleText),
    },
    // The emitter's clock is not trusted for ordering anyway, so use the last event's
    // timestamp. Date.now() here would make the same brain render different bytes.
    produced_at: to,
  };
  const envelope_hash = digestJson(envelope);
  writeFileSync(join(out, "attestation.json"), canon(envelope) + "\n");

  if (commit) {
    appendFileSync(chainPath(brainDir), canon({
      sequence: envelope.sequence, envelope_hash, from_ts: from, to_ts: to, events: delta.length,
    }) + "\n");
  }

  return { out, envelope, envelope_hash, events: delta.length, claims };
}

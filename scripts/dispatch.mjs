// Casa v4 - dispatcher: execute a fan-out plan, recording every worker to the ledger.
//
// This is the deterministic orchestration core. It is runtime-agnostic: you inject a
// `runner` that actually does the work for one subtask. In the in-session plugin path
// (Max subscription) the runner is a Claude subagent spawned by the casa-parallel skill;
// in the headless / multi-account path it is a `claude -p` worker. Tests inject a fake.
//
//   runWaves(plan, specs, { runner, verify, ledgerDir, onEvent })
//     plan    - output of planFanout ({ mode, waves: [[id,...], ...] })
//     specs   - Map<id, {id, dept?, agent?, prompt?, kind?}> or a plain object keyed by id
//     runner  - async (spec) => { ok?, artifact?, decision?, error? }   (ok defaults true)
//     verify  - async (results, {failures}) => { ok?, report? }         (optional gate)
//     ledgerDir - if set, start/done/merge events are appended there
//     onEvent - optional observer called with each ledger event
//
// Waves run in order (a barrier between them, so a dependent tail waits for its front);
// within a wave, subtasks run concurrently.

import { appendEvent } from "./ledger.mjs";

function record(dir, event, onEvent) {
  const e = dir ? appendEvent(dir, event) : { ...event };
  if (onEvent) onEvent(e);
  return e;
}

export async function runWaves(plan, specs, opts = {}) {
  const { runner, verify, ledgerDir, onEvent } = opts;
  if (typeof runner !== "function") throw new Error("dispatch: opts.runner is required");
  const get = (id) => {
    const s = specs instanceof Map ? specs.get(id) : specs?.[id];
    if (!s) throw new Error(`dispatch: no spec for subtask "${id}"`);
    return s;
  };

  const results = {};
  const failures = [];
  const log = []; // ordered trace, for observability and tests

  const runOne = async (id) => {
    const spec = get(id);
    log.push({ phase: "start", id });
    record(ledgerDir, { task: id, dept: spec.dept, agent: spec.agent, status: "running" }, onEvent);
    let r;
    try {
      r = await runner(spec);
    } catch (e) {
      r = { ok: false, error: String(e?.message ?? e) };
    }
    const ok = r && r.ok !== false;
    results[id] = r;
    if (!ok) failures.push(id);
    record(ledgerDir, {
      task: id, dept: spec.dept, agent: spec.agent,
      status: ok ? "done" : "failed",
      artifact: r?.artifact, decision: r?.decision,
      note: ok ? undefined : (r?.error ?? "failed"),
    }, onEvent);
    log.push({ phase: "end", id, ok });
    return r;
  };

  if (plan.mode === "serial") {
    for (const id of plan.waves.flat()) await runOne(id); // one at a time, in dep order
  } else {
    for (const wave of plan.waves) {
      await Promise.all(wave.map(runOne)); // concurrent within the wave, barrier after
    }
  }

  let verifyResult = null;
  if (typeof verify === "function") {
    verifyResult = await verify(results, { failures });
    record(ledgerDir, {
      task: "merge-verify", agent: "dispatcher",
      status: verifyResult?.ok === false ? "failed" : "merged",
      decision: verifyResult?.report,
    }, onEvent);
  }

  return { mode: plan.mode, results, failures, verify: verifyResult, log };
}

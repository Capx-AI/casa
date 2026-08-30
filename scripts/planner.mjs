// Casa v4 - fan-out planner: decide IF and HOW to parallelize a task.
//
// This is where the round-2 benchmark findings become code. Given a set of subtasks
// (each with dependencies and an effort estimate), it produces a deterministic plan:
//   - layer by dependencies so independent work runs together and dependent work waits
//     (the Amdahl / S5 lesson: parallelize the independent front, serialize the tail);
//   - balance chunk sizes across waves so the slowest worker does not cap the speedup
//     (the S2 lesson: a lopsided 146s chunk wasted four faster ones);
//   - gate on size: only fan out when there are >=2 independent chunks each big enough
//     to clear the per-worker + merge overhead, and the modeled speedup clears a floor
//     (the round-1 lesson: splitting tiny tasks loses to overhead);
//   - cap fan-out width to the available concurrency.
//
// Effort is in caller-chosen units (the playbook path uses frontmatter effort; the
// ad-hoc path uses the planner agent's estimate). Defaults assume "minutes-ish".

const median = (xs) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Kahn layering: layer i holds nodes whose deps are all in layers < i.
// Within a layer every node is mutually independent. Throws on a cycle or bad dep.
function layer(subtasks) {
  const byId = new Map(subtasks.map((t) => [t.id, t]));
  for (const t of subtasks) {
    for (const d of t.deps || []) {
      if (!byId.has(d)) throw new Error(`planner: "${t.id}" depends on unknown "${d}"`);
    }
  }
  const remaining = new Map(subtasks.map((t) => [t.id, new Set(t.deps || [])]));
  const done = new Set();
  const layers = [];
  while (remaining.size) {
    const ready = [...remaining.entries()]
      .filter(([, deps]) => [...deps].every((d) => done.has(d)))
      .map(([id]) => id);
    if (!ready.length) throw new Error("planner: dependency cycle");
    layers.push(ready.map((id) => byId.get(id)));
    for (const id of ready) { remaining.delete(id); done.add(id); }
  }
  return layers;
}

// Split one independent layer into <=k-wide waves, balancing effort across waves (LPT).
function packLayer(nodes, k) {
  const nWaves = Math.max(1, Math.ceil(nodes.length / k));
  const waves = Array.from({ length: nWaves }, () => []);
  const load = new Array(nWaves).fill(0);
  for (const node of [...nodes].sort((a, b) => effortOf(b) - effortOf(a))) {
    let best = -1;
    for (let i = 0; i < nWaves; i++) {
      if (waves[i].length < k && (best < 0 || load[i] < load[best])) best = i;
    }
    waves[best].push(node);
    load[best] += effortOf(node);
  }
  return waves.filter((w) => w.length);
}

const effortOf = (t) => (typeof t.effort === "number" ? t.effort : 1);

export function planFanout(subtasks, opts = {}) {
  const {
    k = 8,                  // max parallel width (concurrency ceiling)
    minChunkEffort = 2,     // a chunk smaller than this is not worth its own worker
    mergeCost = 1,          // fixed cost of the merge + verify step per fan-out wave
    minSpeedup = 1.2,       // do not bother parallelizing below this modeled speedup
  } = opts;

  if (!Array.isArray(subtasks) || !subtasks.length) {
    return { mode: "serial", waves: [], estSerial: 0, estParallel: 0, estSpeedup: 1, width: 0, warnings: [], reason: "no subtasks" };
  }

  const layers = layer(subtasks);
  const waves = layers.flatMap((nodes) => packLayer(nodes, k));

  const estSerial = subtasks.reduce((s, t) => s + effortOf(t), 0);
  let estParallel = 0;
  for (const w of waves) {
    estParallel += w.length > 1 ? Math.max(...w.map(effortOf)) + mergeCost : effortOf(w[0]);
  }
  const estSpeedup = estParallel > 0 ? Math.round((estSerial / estParallel) * 100) / 100 : 1;
  const width = waves.reduce((m, w) => Math.max(m, w.length), 0);

  // Can any wave actually be parallelized usefully? Need >=2 chunks each above the floor.
  const canParallelize = waves.some(
    (w) => w.filter((t) => effortOf(t) >= minChunkEffort).length >= 2
  );

  const warnings = [];
  for (const w of waves) {
    if (w.length < 2) continue;
    const efforts = w.map(effortOf);
    const big = Math.max(...efforts);
    const med = median(efforts);
    if (med > 0 && big > 2 * med) {
      const culprit = w.find((t) => effortOf(t) === big);
      warnings.push(`imbalanced wave: "${culprit.id}" (effort ${big}) caps this wave vs median ${med}; split it to lift speedup`);
    }
  }
  if (layers.length > 1) {
    warnings.push(`${layers.length - 1} dependent layer(s): the tail is serial (Amdahl), only the independent front parallelizes`);
  }

  let mode, reason;
  if (!canParallelize) {
    mode = "serial";
    reason = subtasks.length === 1 ? "single task" :
      layers.every((l) => l.length === 1) ? "dependency chain: nothing independent to parallelize" :
      "chunks too small to clear per-worker + merge overhead";
  } else if (estSpeedup < minSpeedup) {
    mode = "serial";
    reason = `modeled speedup ${estSpeedup}x below floor ${minSpeedup}x (merge cost dominates)`;
  } else {
    mode = "parallel";
    reason = `fan out into ${width}-wide waves, modeled ${estSpeedup}x`;
  }

  return {
    mode,
    waves: waves.map((w) => w.map((t) => t.id)),
    estSerial,
    estParallel,
    estSpeedup,
    width,
    warnings,
    reason,
  };
}

if (process.argv[1] && (await import("node:url")).fileURLToPath(import.meta.url) === process.argv[1]) {
  const input = process.argv[2];
  if (!input) { console.error('usage: planner.mjs \'[{"id":"a","effort":10},{"id":"b","deps":["a"],"effort":5}]\''); process.exit(2); }
  console.log(JSON.stringify(planFanout(JSON.parse(input)), null, 2));
}

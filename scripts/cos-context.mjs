// Casa v4 - Chief of Staff context: the read-only business-state the CoS reads each turn.
//
// It does NOT write anything. It assembles one view from existing engine state
// (profile.json, build-map.json, state.json), the autonomy dials, and the live
// ledger (in-flight / blocked / recent decisions). This is what lets a CoS that is
// re-instantiated every session know the whole business without reading transcripts.
//
// usage: node scripts/cos-context.mjs <brainDir>

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { inFlight, blocked, decisions, aggregateByStatus } from "./ledger.mjs";

const repo = dirname(dirname(fileURLToPath(import.meta.url)));

function readJson(p, fallback) {
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback;
}

// Per-department autonomy. A company's dials.json (written by casa-start) wins;
// otherwise the shipped template default is used.
export function dials(dir) {
  const local = join(dir, "dials.json");
  const tmpl = join(repo, "templates", "company-brain", "dials.json");
  return readJson(existsSync(local) ? local : tmpl, { default: "approve_first", departments: {}, always_ask: [] });
}

export function businessState(dir) {
  const profile = readJson(join(dir, "profile.json"), {});
  const state = readJson(join(dir, "state.json"), { completed: [] });
  const map = readJson(join(dir, "build-map.json"), {});
  const d = dials(dir);
  return {
    company: {
      types: [profile.primary_type, profile.secondary_type].filter(Boolean),
      traits: profile.traits || [],
      // stage.mjs writes the founder's do-or-die constraint to state.json; a hand-authored
      // profile.json may carry it instead. State wins: it is what the router actually reads.
      binding_constraint: state.binding_constraint || profile.binding_constraint || null,
      level: map.current_level ?? null,
      completed: (state.completed || []).length,
    },
    // Plays parked on a real-world founder action (interviews, a filing, a call), with the reason.
    waiting_on_founder: state.waiting || {},
    departments: Object.keys(d.departments || {}),
    autonomy: d,
    in_flight: inFlight(dir),
    blocked: blocked(dir),
    recent_decisions: decisions(dir, 15),
    counts: aggregateByStatus(dir),
  };
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) { console.error("usage: cos-context.mjs <brainDir>"); process.exit(2); }
  // Fail loud rather than briefing from fabricated defaults: a CoS reading a folder with no
  // company must say "run /casa-start", never invent a plausible business.
  if (!existsSync(join(dir, "profile.json")) && !existsSync(join(dir, "state.json"))) {
    console.error(`no company brain at ${dir} (run /casa-start first)`);
    process.exit(2);
  }
  console.log(JSON.stringify(businessState(dir), null, 2));
}

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { tmpBrain, cleanup, runScript, loadJson } from "./helpers.mjs";

test("face: contract projection, completion, attribution, hashes, and deterministic check", (t) => {
  const dir = tmpBrain(); t.after(() => cleanup(dir));
  const put = (p, v) => { mkdirSync(dirname(join(dir, p)), { recursive: true }); writeFileSync(join(dir, p), typeof v === "string" ? v : JSON.stringify(v)); };
  const out = (p, f) => `outputs/phase0-${p}/${f}`;
  const profile = loadJson("examples/inboxpilot/company-brain/profile.json");
  put("profile.json", profile); put("capx-bind.json", { mint: "fictional-mint", ticker: "TEST", ignored: true });
  put(out("company-brief", "brief.md"), "InboxPilot summarizes email.\n\nExtra context.\n\n## What it does\nSummarizes threads.\n\n## Who it is for\nBusy professionals.\n\n## How it works\nFive steps.\n");
  put(out("architecture", "architecture.mmd"), "flowchart LR\n  InboxPilot --> Threads\n");
  put(out("product-flow", "flow.mmd"), "sequenceDiagram\n  User->>InboxPilot: Summarize thread\n");
  put(out("roadmap", "roadmap.json"), [
    { id: "m1", title: "Thread summary", target: "2026-11", status: "planned", playbooks: ["mvp-scoping"] },
    { id: "m2", playbooks: ["mvp-scoping", "red-team-thesis"] }, { id: "m3", status: "in_progress", playbooks: [] },
  ]);
  put(out("task-plan", "plan.json"), [{ id: "t1", title: "Scope threads", milestone: "m1", playbook: "mvp-scoping", status: "todo" }, { id: "t2", playbook: null, status: "doing" }]);
  put(out("org-chart", "agents.json"), [{ name: "casa-engineer", department: "Engineering", mandate: "Build thread summaries", playbooks: ["mvp-scoping"] }]);
  put("state.json", { completed: ["mvp-scoping"] }); put(out("website", "index.html"), "<h1>InboxPilot</h1>");
  const events = Array.from({ length: 12 }, (_, i) => ({ agent: "casa-engineer", task: `task ${i}`, status: "done", ts: `2026-09-14T00:00:${String(i).padStart(2, "0")}Z`, note: "not disclosed" }));
  put("ledger.jsonl", [...events, { agent: "casa-product", ts: "2026-09-14T01:00:00Z" }].map(JSON.stringify).join("\n") + "\n{torn");
  const built = runScript("face.mjs", ["build", dir]); assert.equal(built.code, 0, built.stderr);
  const bytes = readFileSync(join(dir, "face.json"), "utf8"), face = JSON.parse(bytes);
  assert.deepEqual(Object.keys(face), ["face_version", "generated_at", "company", "token", "brief", "diagrams", "roadmap", "plan", "agents", "collateral", "sources"]);
  assert.equal(face.face_version, 1); assert.equal(face.generated_at, "2026-09-14T01:00:00Z");
  assert.deepEqual(face.company, { name: profile.company_name, one_liner: profile.one_liner, category: "saas", website: null, links: {} });
  assert.deepEqual(face.token, { mint: "fictional-mint", symbol: "TEST" });
  assert.deepEqual(face.brief, { summary: "InboxPilot summarizes email.", sections: [{ title: "What it does", body: "Summarizes threads." }, { title: "Who it is for", body: "Busy professionals." }, { title: "How it works", body: "Five steps." }] });
  assert.deepEqual(face.diagrams, { architecture: readFileSync(join(dir, out("architecture", "architecture.mmd")), "utf8"), product_flow: readFileSync(join(dir, out("product-flow", "flow.mmd")), "utf8"), data_model: null, org_chart: null, token_flow: null });
  assert.deepEqual(face.plan.map((p) => p.status), ["done", "doing"]);
  assert.deepEqual(face.roadmap.map((r) => r.status), ["done", "in_progress", "in_progress"]);
  assert.equal(face.agents[0].events.length, 10);
  assert.deepEqual(face.agents[0].events[0], { ts: events[2].ts, task: "task 2", status: "done", node_id: null });
  assert.equal(face.agents[0].events.at(-1).task, "task 11");
  assert.deepEqual(face.collateral, { site: true, one_pager: false, deck: false });
  assert.equal(Object.keys(face.sources).length, 11);
  for (const [p, sha] of Object.entries(face.sources)) assert.equal(sha, createHash("sha256").update(readFileSync(join(dir, p))).digest("hex"));
  assert.equal(runScript("face.mjs", ["check", dir]).code, 0); assert.equal(readFileSync(join(dir, "face.json"), "utf8"), bytes);
  assert.equal(runScript("face.mjs", ["build", dir]).code, 0); assert.equal(readFileSync(join(dir, "face.json"), "utf8"), bytes);
});

test("face: partial brains and size/type failures without writing", (t) => {
  const dir = tmpBrain(); t.after(() => cleanup(dir));
  assert.equal(runScript("face.mjs", ["check", dir]).code, 0); assert.ok(!existsSync(join(dir, "face.json")));
  assert.equal(runScript("face.mjs", ["build", dir]).code, 0);
  const bytes = readFileSync(join(dir, "face.json"), "utf8"), empty = JSON.parse(bytes);
  assert.equal(empty.token, null); assert.equal(empty.generated_at, null); assert.deepEqual(empty.sources, {});
  assert.deepEqual([empty.roadmap, empty.plan, empty.agents, empty.brief.sections], [[], [], [], []]);
  const path = join(dir, "outputs", "phase0-roadmap"); mkdirSync(path, { recursive: true });
  for (const [source, message] of [["timeline\n" + "é".repeat(10240), /exceeds 20 KB/], ["```mermaid\nflowchart LR", /first line/]]) {
    writeFileSync(join(path, "roadmap.mmd"), source);
    for (const cmd of ["build", "check"]) {
      const r = runScript("face.mjs", [cmd, dir]); assert.equal(r.code, 1); assert.match(r.stderr, message); assert.equal(r.stderr.trim().split("\n").length, 1);
      assert.equal(readFileSync(join(dir, "face.json"), "utf8"), bytes);
    }
  }
  writeFileSync(join(path, "roadmap.mmd"), "timeline\n");
  writeFileSync(join(dir, "profile.json"), JSON.stringify({ one_liner: "x".repeat(512 * 1024) }));
  const large = runScript("face.mjs", ["check", dir]); assert.equal(large.code, 1); assert.match(large.stderr, /manifest exceeds 512 KB/);
});

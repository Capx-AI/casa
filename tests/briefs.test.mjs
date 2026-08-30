// Approval-required artifact change briefs. The CLI writes a local brief and
// optional drafts. It must not publish, activate, or send HTTP.

import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { INDEX, REPO } from "./helpers.mjs";
import { lint } from "../scripts/copy-lint.mjs";
import { deriveStage } from "../scripts/stage.mjs";
import { buildMap, select } from "../scripts/router.mjs";

function runBriefs(args, extraEnv = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [join(REPO, "scripts", "briefs.mjs"), ...args], {
      env: { PATH: process.env.PATH, HOME: process.env.HOME, ...extraEnv },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => { stdout += d; });
    child.stderr.on("data", (d) => { stderr += d; });
    const timer = setTimeout(() => child.kill("SIGKILL"), 15000);
    child.on("close", (status) => {
      clearTimeout(timer);
      resolve({ status, stdout, stderr });
    });
  });
}

function listen(onRequest) {
  const requests = [];
  const server = createServer((req, res) => {
    const rec = { method: req.method, url: req.url };
    requests.push(rec);
    if (onRequest) onRequest(rec, res);
    else {
      res.writeHead(500);
      res.end("briefs must not call HTTP");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      resolve({
        server,
        url: `http://127.0.0.1:${addr.port}`,
        requests,
        close: () => new Promise((r, j) => server.close((e) => (e ? j(e) : r()))),
      });
    });
  });
}

function tmpBrain() {
  const dir = mkdtempSync(join(tmpdir(), "casa-brief-"));
  const brain = join(dir, "company-brain");
  mkdirSync(brain, { recursive: true });
  writeFileSync(
    join(brain, "profile.json"),
    JSON.stringify({
      company_name: "Brief Co",
      one_liner: "Local collateral for a later-stage refresh",
      primary_type: "saas",
    }) + "\n",
  );
  return { root: dir, brain };
}

test("playbook artifact-change-brief is in the catalog with a human gate and Phase 0 deps", () => {
  const pb = INDEX.find((p) => p.id === "artifact-change-brief");
  assert.ok(pb, "playbook must exist");
  assert.equal(pb.level, 4);
  assert.equal(pb.human_gate, true);
  assert.equal(pb.recurring, true);
  assert.ok(pb.depends_on.includes("phase0-publish-readiness"));
  const body = readFileSync(join(REPO, pb.file), "utf8");
  assert.match(body, /deployment outside Casa/);
  assert.match(body, /scripts\/briefs\.mjs/);
});

test("select: both golden profiles include artifact-change-brief", () => {
  const probe = JSON.parse(readFileSync(join(REPO, "examples", "profile-b2b-devtool.json"), "utf8"));
  const meme = JSON.parse(readFileSync(join(REPO, "examples", "profile-solana-analytics.json"), "utf8"));
  for (const profile of [probe, meme]) {
    const ids = new Set(select(INDEX, profile).members.map((m) => m.id));
    assert.ok(ids.has("artifact-change-brief"), `${profile.company_name} missing artifact-change-brief`);
  }
});

test("buildMap: the brief stays blocked until Phase 0 publish-readiness is done", () => {
  const meme = JSON.parse(readFileSync(join(REPO, "examples", "profile-solana-analytics.json"), "utf8"));
  const map = buildMap(INDEX, meme, { completed: [], level: 4 });
  const node = map.levels.flatMap((l) => l.nodes).find((n) => n.id === "artifact-change-brief");
  assert.ok(node, "member at launch");
  assert.equal(node.status, "blocked");

  const ready = buildMap(INDEX, meme, {
    completed: ["phase0-website", "phase0-one-pager", "phase0-pitch-deck", "phase0-publish-readiness"],
    level: 4,
  });
  const after = ready.levels.flatMap((l) => l.nodes).find((n) => n.id === "artifact-change-brief");
  assert.equal(after.status, "ready");
});

test("deriveStage: artifact-change-brief is never auto-seeded", () => {
  for (const tier of ["landing", "building", "launched", "revenue", "scaling"]) {
    const { completed_seed } = deriveStage(
      { type: "saas", company_name: "X", traits: ["b2c", "builds_software"], tier, gaps: [] },
      INDEX,
    );
    assert.ok(
      !completed_seed.includes("artifact-change-brief"),
      `artifact-change-brief must not be seeded at ${tier}`,
    );
  }
});

test("briefs.mjs source never talks to the publish or activate APIs", () => {
  const src = readFileSync(join(REPO, "scripts", "briefs.mjs"), "utf8");
  assert.equal(src.includes("fetch("), false);
  assert.equal(src.includes("signedCompanyPost"), false);
  assert.equal(src.includes("publishArtifact"), false);
  assert.equal(src.includes("activateArtifact"), false);
  assert.equal(src.includes("/v1/companies"), false);
  assert.equal(src.includes("artifacts/activate"), false);
  assert.equal(src.includes("from \"./publish.mjs\""), false);
  assert.equal(src.includes("from \"./artifacts.mjs\""), false);
  assert.equal(src.includes("from \"./client.mjs\""), false);
});

test("CLI writes an approval-required brief and a decisions record", async () => {
  const { root, brain } = tmpBrain();
  mkdirSync(join(brain, "outputs", "phase0-website"), { recursive: true });
  writeFileSync(join(brain, "outputs", "phase0-website", "index.html"), "<h1>Brief Co</h1>");
  try {
    const r = await runBriefs(["--brain", brain, "--reason", "Offer changed"]);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /status approval_required/);
    assert.match(r.stdout, /published no/);
    assert.match(r.stdout, /activated no/);

    const mdPath = join(brain, "outputs", "artifact-change-brief", "BRIEF.md");
    const jsonPath = join(brain, "outputs", "artifact-change-brief", "brief.json");
    const decisionPath = join(brain, "decisions", "artifact-change-brief.md");
    assert.ok(existsSync(mdPath));
    assert.ok(existsSync(jsonPath));
    assert.ok(existsSync(decisionPath));

    const md = readFileSync(mdPath, "utf8");
    const doc = JSON.parse(readFileSync(jsonPath, "utf8"));
    assert.equal(doc.status, "approval_required");
    assert.equal(doc.published, false);
    assert.equal(doc.activated, false);
    assert.equal(doc.company_name, "Brief Co");
    assert.equal(doc.reason, "Offer changed");
    assert.equal(doc.artifacts.find((a) => a.type === "site").present, true);
    assert.equal(doc.artifacts.find((a) => a.type === "deck").present, false);
    assert.match(md, /Status: approval required/);
    assert.match(md, /Published: no/);
    assert.match(md, /Activated: no/);
    assert.match(md, /Do not run publish or activate/);
    assert.equal(lint(md).ok, true, JSON.stringify(lint(md).errors));
    assert.equal(lint(readFileSync(decisionPath, "utf8")).ok, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("CLI --draft copies local files and does not treat them as live", async () => {
  const { root, brain } = tmpBrain();
  mkdirSync(join(brain, "outputs", "phase0-one-pager"), { recursive: true });
  writeFileSync(join(brain, "outputs", "phase0-one-pager", "index.html"), "<h1>pager</h1>");
  try {
    const r = await runBriefs(["--brain", brain, "--type", "one-pager", "--draft"]);
    assert.equal(r.status, 0, r.stderr);
    const draft = join(brain, "outputs", "artifact-change-brief", "drafts", "one-pager", "index.html");
    assert.ok(existsSync(draft));
    assert.equal(readFileSync(draft, "utf8"), "<h1>pager</h1>");
    const doc = JSON.parse(readFileSync(join(brain, "outputs", "artifact-change-brief", "brief.json"), "utf8"));
    assert.equal(doc.published, false);
    assert.equal(doc.activated, false);
    assert.equal(doc.drafts.length, 1);
    assert.match(readFileSync(join(brain, "outputs", "artifact-change-brief", "BRIEF.md"), "utf8"), /These files are local only/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("generating a brief sends no HTTP, including no activate, even when CASA_API is set", async () => {
  const { root, brain } = tmpBrain();
  const mock = await listen();
  try {
    const r = await runBriefs(["--brain", brain, "--draft"], {
      CASA_API: mock.url,
    });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(mock.requests.length, 0, JSON.stringify(mock.requests));
    assert.equal(
      mock.requests.some((q) => /activate/i.test(q.url)),
      false,
    );
  } finally {
    await mock.close();
    rmSync(root, { recursive: true, force: true });
  }
});

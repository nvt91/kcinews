import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  existingMarker,
  planNotice,
  safeArtifactUrl,
  summarizeQc,
} from "./notify-render.mjs";

const sample = JSON.parse(fs.readFileSync(new URL("./fixtures/qc-notify-sample.json", import.meta.url), "utf8"));
const run = "40855256222";
const base = {
  event: "issues",
  issue: "46",
  repo: "nvt91/kcinews",
  runId: run,
  runAttempt: "2",
  result: "success",
  server: "https://github.com",
  artifactUrl: `https://github.com/nvt91/kcinews/actions/runs/${run}/artifacts/99`,
  edition: "[KCI VIDEO] 2026-10-29 KR_AM <script>alert(1)</script>",
  job: "jobs/kci-2026-10-29-kr-am.json",
};

const success = planNotice(base, sample, ["kci-2026-10-29-kr-am.mp4"], []);
assert.equal(success.action, "comment");
assert.equal(success.body.startsWith(`<!-- KCI_RENDER_READY:${run} -->`), true);
assert.match(success.body, /@nvt91 MP4 đã render vào GitHub artifact; CHƯA GIAO TRONG CHAT\./);
assert.match(success.body, /Chưa đăng\. Chờ anh duyệt\./);
assert.match(success.body, /Review-only artifact; do not auto-publish\./);
assert.match(success.body, new RegExp(`https://github.com/nvt91/kcinews/actions/runs/${run}/artifacts/99`));
assert.match(success.body, /out\/kci-2026-10-29-kr-am\.mp4/);
assert.match(success.body, /status=REVIEW_REQUIRED/);
assert.match(success.body, /published=false/);
assert.match(success.body, /ctaIncluded=true/);
assert.match(success.body, /voicePresent=true/);
assert.match(success.body, /fallback căn phụ đề: có \(1 cảnh\)/);
assert.match(success.body, /ký tự Vbee: 1840/);
assert.match(success.body, /Lần chạy: 2/);
assert.equal(success.body.includes("canary-not-for-comment"), false);
assert.equal(success.body.includes("example.invalid"), false);
assert.equal(success.body.includes("hooks.example"), false);
assert.equal(success.body.includes("<script>"), false);
assert.equal(success.body.includes("alert(1)"), false);
assert.equal(success.body.includes("scriptalert"), true);

const poisoned = safeArtifactUrl("https://hooks.example/webhook?token=super-secret-token", base.server, base.repo, run);
assert.equal(poisoned, "");
const fallback = planNotice({ ...base, artifactUrl: poisoned }, sample, ["kci-2026-10-29-kr-am.mp4"], []);
assert.match(fallback.body, /không có artifact-url/);
assert.equal(fallback.body.includes("hooks.example"), false);

const legacyQc = {
  job: "kci-2026-10-29-kr-am",
  status: "REVIEW_REQUIRED",
  mode: "video",
  voicePresent: true,
  subtitles: "Estimated from words; requires listening alignment review",
  ctaIncluded: true,
  composition: "KciNewsDaily",
  published: false,
  leak: "https://evil.example/webhook",
};
assert.match(summarizeQc(legacyQc), /fallback căn phụ đề: chưa căn \(ước lượng theo từ\)/);
assert.match(summarizeQc(legacyQc), /ký tự Vbee: không có trong qc/);
assert.equal(summarizeQc(legacyQc).includes("evil.example"), false);

const whisperQc = { subtitles: "Whisper alignment: 14 aligned, 0 proportional fallback", status: "REVIEW_REQUIRED", published: false, ctaIncluded: true, voicePresent: true };
assert.match(summarizeQc(whisperQc), /fallback căn phụ đề: không/);

const sceneQc = { scenes: [{ captionMethod: "aligned" }, { captionMethod: "fallback" }], status: "NOT_A_STATUS with text https://x" };
assert.match(summarizeQc(sceneQc), /fallback căn phụ đề: có \(1 cảnh\)/);
assert.match(summarizeQc(sceneQc), /status=không có/);

assert.equal(existingMarker([`<!-- KCI_VIDEO_NOTIFIED:${run} -->`], run), `KCI_VIDEO_NOTIFIED:${run}`);
assert.equal(existingMarker([`<!-- KCI_RENDER_READY:${run} -->`], run), `KCI_RENDER_READY:${run}`);
assert.equal(existingMarker([`<!-- KCI_VIDEO_FAILED:${run} -->`], run), `KCI_VIDEO_FAILED:${run}`);
assert.equal(existingMarker([`<!-- KCI_VIDEO_NOTIFIED:${run}9 -->`], run), "");
assert.equal(existingMarker([`KCI_VIDEO_NOTIFIED:${run.slice(0, -1)}`], run), "");

const duplicate = planNotice(base, sample, [], [`prefix <!-- KCI_VIDEO_FAILED:${run} --> tail`]);
assert.equal(duplicate.action, "skip");
assert.equal(duplicate.reason, "duplicate-run-id");
assert.equal(duplicate.body, "");

const failure = planNotice({ ...base, result: "failure" }, null, [], []);
assert.equal(failure.body.startsWith(`<!-- KCI_VIDEO_FAILED:${run} -->`), true);
assert.match(failure.body, /@nvt91 RENDER LỖI/);
assert.match(failure.body, new RegExp(`https://github.com/nvt91/kcinews/actions/runs/${run}`));
assert.equal(failure.body.includes("status="), false);
assert.match(failure.body, /Chưa đăng\. Chờ anh duyệt\./);

const dispatch = planNotice({ ...base, event: "workflow_dispatch", issue: "" }, sample, ["clip.mp4"], [`<!-- KCI_VIDEO_NOTIFIED:${run} -->`]);
assert.equal(dispatch.action, "summary");
assert.equal(dispatch.channel, "summary");
assert.match(dispatch.body, /KCI_RENDER_READY/);

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kci-notify-"));
fs.writeFileSync(path.join(dir, "kci-2026-10-29-kr-am.mp4"), "");
fs.writeFileSync(path.join(dir, "ignore.txt"), "secret");
fs.writeFileSync(path.join(dir, "bad name.mp4"), "");
const comments = path.join(dir, "comments.json");
fs.writeFileSync(comments, JSON.stringify(["older note"]));
const stdout = execFileSync("node", [
  "scripts/notify-render.mjs",
  "--dry-run",
  "--qc=scripts/fixtures/qc-notify-sample.json",
  `--out-dir=${dir}`,
  `--comments=${comments}`,
  "--event=issues",
  "--issue=46",
  "--repo=nvt91/kcinews",
  `--run-id=${run}`,
  "--run-attempt=1",
  "--result=success",
  "--server=https://github.com",
  `--artifact-url=https://github.com/nvt91/kcinews/actions/runs/${run}/artifacts/99`,
  "--edition=[KCI VIDEO] 2026-10-29 KR_AM",
], {
  encoding: "utf8",
  env: { ...process.env, GH_TOKEN: "CANARY_TOKEN_SHOULD_NOT_APPEAR", VBEE_API_TOKEN: "CANARY_VBEE" },
});
assert.match(stdout, /^action: comment\nchannel: issue\n---\n/);
assert.match(stdout, /out\/kci-2026-10-29-kr-am\.mp4/);
assert.equal(stdout.includes("CANARY_TOKEN_SHOULD_NOT_APPEAR"), false);
assert.equal(stdout.includes("CANARY_VBEE"), false);
assert.equal(stdout.includes("ignore.txt"), false);

const dup = path.join(dir, "dup.json");
fs.writeFileSync(dup, JSON.stringify([`<!-- KCI_VIDEO_NOTIFIED:${run} -->`]));
const skipped = execFileSync("node", [
  "scripts/notify-render.mjs",
  "--dry-run",
  "--qc=scripts/fixtures/qc-notify-sample.json",
  `--out-dir=${dir}`,
  `--comments=${dup}`,
  "--event=issues",
  "--issue=46",
  "--repo=nvt91/kcinews",
  `--run-id=${run}`,
  "--run-attempt=3",
  "--result=success",
  "--server=https://github.com",
  "--edition=[KCI VIDEO] 2026-10-29 KR_AM",
], {
  encoding: "utf8",
  env: { ...process.env, GH_TOKEN: "CANARY_TOKEN_SHOULD_NOT_APPEAR" },
});
assert.match(skipped, /^action: skip\nchannel: issue\nreason: duplicate-run-id\n/);
assert.equal(skipped.includes("CANARY_TOKEN_SHOULD_NOT_APPEAR"), false);

console.log("notify-render tests passed");

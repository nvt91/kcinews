import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RUN_ID = /^\d{1,20}$/;
const JOB_ID = /^[a-z0-9-]{5,90}$/;
const JOB_FILE = /^jobs\/[a-z0-9-]+\.json$/;
const SERVER = /^https:\/\/[a-zA-Z0-9.-]+$/;
const REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const STATUS = /^[A-Z][A-Z0-9_]{2,39}$/;
const MP4 = /^[A-Za-z0-9._-]{1,120}\.mp4$/;
const KNOWN_WORD_CAPTIONS = "Estimated from words; requires listening alignment review";
const WHISPER_NOTE = /^Whisper alignment: (\d+) aligned, (\d+) proportional fallback$/;
const VBEE_KEYS = ["vbeeCharacters", "vbeeCharCount", "vbeeChars", "characterCount"];

function flag(argv, name) {
  const prefix = `--${name}=`;
  const hit = argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : "";
}

export function parseArgs(argv) {
  const known = new Set([
    "dry-run", "qc", "out-dir", "comments", "event", "issue", "repo",
    "run-id", "run-attempt", "result", "server", "artifact-url", "edition", "job",
  ]);
  for (const arg of argv) {
    if (arg === "--dry-run") continue;
    const name = arg.startsWith("--") ? arg.slice(2).split("=")[0] : "";
    if (!known.has(name) || !arg.includes("=")) {
      throw new Error("Unknown argument.");
    }
  }
  return {
    dryRun: argv.includes("--dry-run"),
    qc: flag(argv, "qc"),
    outDir: flag(argv, "out-dir"),
    comments: flag(argv, "comments"),
    event: flag(argv, "event"),
    issue: flag(argv, "issue"),
    repo: flag(argv, "repo"),
    runId: flag(argv, "run-id"),
    runAttempt: flag(argv, "run-attempt"),
    result: flag(argv, "result"),
    server: flag(argv, "server"),
    artifactUrl: flag(argv, "artifact-url"),
    edition: flag(argv, "edition"),
    job: flag(argv, "job"),
  };
}

export function resolveInput(args, env = process.env) {
  return {
    dryRun: args.dryRun,
    qcPath: args.qc || "out/qc.json",
    outDir: args.outDir || "out",
    commentsPath: args.comments || "",
    event: args.event || env.KCI_EVENT_NAME || "",
    issue: args.issue || env.KCI_ISSUE || "",
    repo: args.repo || env.KCI_REPO || "",
    runId: args.runId || env.KCI_RUN_ID || "",
    runAttempt: args.runAttempt || env.KCI_RUN_ATTEMPT || "",
    result: args.result || env.KCI_RESULT || "",
    server: args.server || env.KCI_SERVER_URL || "https://github.com",
    artifactUrl: args.artifactUrl || env.KCI_ARTIFACT_URL || "",
    edition: args.edition || env.KCI_EDITION || "",
    job: args.job || env.KCI_JOB || "",
  };
}

function hasExactMarker(body, kind, runId) {
  const needle = `KCI_VIDEO_${kind}:${runId}`;
  let from = 0;
  while (from < body.length) {
    const at = body.indexOf(needle, from);
    if (at < 0) return false;
    const next = body[at + needle.length];
    if (!next || !/\d/.test(next)) return true;
    from = at + needle.length;
  }
  return false;
}

export function existingMarker(bodies, runId) {
  const id = String(runId);
  if (!RUN_ID.test(id)) return "";
  for (const body of bodies) {
    if (typeof body !== "string") continue;
    for (const kind of ["NOTIFIED", "FAILED"]) {
      if (hasExactMarker(body, kind, id)) return `KCI_VIDEO_${kind}:${id}`;
    }
  }
  return "";
}

export function loadCommentBodies(file) {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("Comments file must be an array.");
  return parsed.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item.body === "string") return item.body;
    return "";
  });
}

function loadQc(file) {
  try {
    const qc = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!qc || typeof qc !== "object" || Array.isArray(qc)) return null;
    return qc;
  } catch {
    return null;
  }
}

function boolField(qc, key) {
  if (!qc || typeof qc[key] !== "boolean") return "không có";
  return qc[key] ? "true" : "false";
}

function statusField(qc) {
  if (!qc || typeof qc.status !== "string" || !STATUS.test(qc.status)) return "không có";
  return qc.status;
}

function fallbackField(qc) {
  if (!qc) return "không có trong qc";
  if (Number.isInteger(qc.fallbackScenes) && qc.fallbackScenes >= 0 && qc.fallbackScenes <= 99) {
    return qc.fallbackScenes > 0 ? `có (${qc.fallbackScenes} cảnh)` : "không";
  }
  if (typeof qc.captionFallback === "boolean") return qc.captionFallback ? "có" : "không";
  if (Array.isArray(qc.scenes)) {
    let count = 0;
    let saw = false;
    for (const scene of qc.scenes) {
      if (!scene || typeof scene !== "object") continue;
      if (scene.captionFallback === true || scene.alignment === "fallback" || scene.captionMethod === "fallback" || scene.captionMethod === "proportional") {
        count += 1;
        saw = true;
      } else if (scene.captionFallback === false || scene.alignment === "aligned" || scene.captionMethod === "aligned") {
        saw = true;
      }
    }
    if (saw) return count > 0 ? `có (${count} cảnh)` : "không";
  }
  if (qc.subtitles === KNOWN_WORD_CAPTIONS) return "chưa căn (ước lượng theo từ)";
  if (typeof qc.subtitles === "string") {
    const match = WHISPER_NOTE.exec(qc.subtitles);
    if (match) {
      const count = Number(match[2]);
      if (count <= 99) return count > 0 ? `có (${count} cảnh)` : "không";
    }
  }
  return "không có trong qc";
}

function vbeeField(qc) {
  if (!qc) return "không có trong qc";
  for (const key of VBEE_KEYS) {
    const value = qc[key];
    if (Number.isInteger(value) && value >= 0 && value <= 500000) return String(value);
  }
  return "không có trong qc";
}

export function summarizeQc(qc) {
  if (!qc) {
    return "status=không có; published=không có; ctaIncluded=không có; voicePresent=không có; fallback căn phụ đề: không có trong qc; ký tự Vbee: không có trong qc";
  }
  return [
    `status=${statusField(qc)}`,
    `published=${boolField(qc, "published")}`,
    `ctaIncluded=${boolField(qc, "ctaIncluded")}`,
    `voicePresent=${boolField(qc, "voicePresent")}`,
    `fallback căn phụ đề: ${fallbackField(qc)}`,
    `ký tự Vbee: ${vbeeField(qc)}`,
  ].join("; ");
}

export function safeLabel(value) {
  if (typeof value !== "string") return "không rõ";
  const cleaned = [...value]
    .filter((ch) => /[\p{L}\p{N} \-_[\]:./]/u.test(ch))
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
  return cleaned || "không rõ";
}

export function safeJob(qc, jobArg) {
  if (qc && typeof qc.job === "string" && JOB_ID.test(qc.job)) return qc.job;
  if (typeof jobArg === "string" && JOB_FILE.test(jobArg)) return jobArg;
  return "không rõ";
}

export function runUrl(server, repo, runId) {
  if (!SERVER.test(server) || !REPO.test(repo) || !RUN_ID.test(String(runId))) return "";
  return `${server}/${repo}/actions/runs/${runId}`;
}

export function safeArtifactUrl(candidate, server, repo, runId) {
  const page = runUrl(server, repo, runId);
  if (!page || typeof candidate !== "string") return "";
  const prefix = `${page}/artifacts/`;
  if (!candidate.startsWith(prefix)) return "";
  const rest = candidate.slice(prefix.length);
  return RUN_ID.test(rest) ? candidate : "";
}

export function listMp4(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && MP4.test(entry.name))
      .map((entry) => entry.name)
      .sort()
      .slice(0, 5);
  } catch {
    return [];
  }
}

function attemptLabel(value) {
  return /^\d{1,4}$/.test(String(value)) ? String(value) : "không rõ";
}

function assertClean(body, allowedUrls) {
  let rest = body;
  for (const url of allowedUrls) {
    if (url) rest = rest.split(url).join("");
  }
  if (/https?:\/\//i.test(rest) || /(webhook|GH_TOKEN|VBEE_|api_token|\bsecret\b)/i.test(rest)) {
    throw new Error("Refusing notice that contains an unexpected URL or sensitive text.");
  }
}

export function planNotice(input, qc, mp4Names, commentBodies) {
  const id = String(input.runId);
  const page = runUrl(input.server, input.repo, id);
  if (!page) throw new Error("Run URL is not available.");
  const artifact = safeArtifactUrl(input.artifactUrl, input.server, input.repo, id);
  const failed = input.result !== "success";
  const markerKind = failed ? "FAILED" : "NOTIFIED";
  const marker = `<!-- KCI_VIDEO_${markerKind}:${id} -->`;
  const prior = existingMarker(commentBodies, id);
  const channel = input.event === "issues" && /^\d{1,10}$/.test(String(input.issue)) ? "issue" : "summary";
  const lines = [marker, failed ? "@nvt91 RENDER LỖI" : "@nvt91 Render xong. Chờ duyệt.", ""];
  lines.push(`- Bản tin: ${safeLabel(input.edition)}`);
  lines.push(`- Job: ${safeJob(qc, input.job)}`);
  lines.push(`- Lần chạy: ${attemptLabel(input.runAttempt)}`);
  lines.push(`- Run: ${page}`);
  if (!failed) {
    lines.push(artifact ? `- Artifact: ${artifact}` : `- Artifact: không có artifact-url; xem trang run ${page}`);
    if (mp4Names.length) {
      lines.push(`- MP4 trong artifact (cần đăng nhập GitHub mới tải): ${mp4Names.map((name) => `out/${name}`).join(", ")}`);
    } else {
      lines.push("- MP4: không thấy file .mp4 trong out/");
    }
    lines.push(`- QC: ${summarizeQc(qc)}`);
  }
  lines.push("");
  lines.push("Chưa đăng. Chờ Water ĐẠT + anh duyệt.");
  lines.push("Review-only artifact; do not auto-publish.");
  const body = lines.join("\n");
  assertClean(body, [page, artifact]);
  if (channel === "issue" && prior) {
    return { action: "skip", channel, reason: "duplicate-run-id", matched: prior, body: "" };
  }
  return {
    action: channel === "issue" ? "comment" : "summary",
    channel,
    reason: "",
    matched: "",
    body,
  };
}

export function formatPlan(plan) {
  if (plan.action === "skip") {
    return `action: skip\nchannel: ${plan.channel}\nreason: ${plan.reason}\nmatched: ${plan.matched}\n`;
  }
  return `action: ${plan.action}\nchannel: ${plan.channel}\n---\n${plan.body}\n`;
}

function fetchCommentBodies(repo, issue) {
  if (!REPO.test(repo) || !/^\d{1,10}$/.test(issue)) {
    throw new Error("Issue coordinates are not safe to query.");
  }
  let raw = "";
  try {
    raw = execFileSync(
      "gh",
      ["api", "--paginate", `repos/${repo}/issues/${issue}/comments`],
      { encoding: "utf8" },
    );
  } catch {
    throw new Error("Could not read issue comments.");
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Could not read issue comments.");
  }
  if (!Array.isArray(parsed)) throw new Error("Unexpected comment list.");
  return parsed.map((item) => (item && typeof item.body === "string" ? item.body : ""));
}

function postIssueComment(repo, issue, body) {
  const file = path.join(os.tmpdir(), `kci-notify-${process.pid}.md`);
  fs.writeFileSync(file, body, { mode: 0o600 });
  try {
    execFileSync(
      "gh",
      ["issue", "comment", issue, "--repo", repo, "--body-file", file],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch {
    throw new Error("Could not comment on the issue.");
  } finally {
    fs.rmSync(file, { force: true });
  }
}

function writeSummary(body) {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (!file) {
    process.stdout.write(body + "\n");
    return;
  }
  fs.appendFileSync(file, body + "\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = resolveInput(args);
  const qc = loadQc(input.qcPath);
  const mp4Names = listMp4(input.outDir);
  let comments = [];
  if (input.commentsPath) {
    if (!args.dryRun) throw new Error("--comments is only valid with --dry-run.");
    comments = loadCommentBodies(input.commentsPath);
  } else if (!args.dryRun && input.event === "issues") {
    comments = fetchCommentBodies(input.repo, String(input.issue));
  }
  const plan = planNotice(input, qc, mp4Names, comments);
  if (args.dryRun) {
    process.stdout.write(formatPlan(plan));
    return;
  }
  if (plan.action === "skip") {
    console.log(`notify: skip ${plan.matched}`);
    return;
  }
  if (plan.action === "summary") {
    writeSummary(plan.body);
    console.log("notify: wrote step summary");
    return;
  }
  postIssueComment(input.repo, String(input.issue), plan.body);
  console.log(`notify: commented on issue ${input.issue}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "notify failed");
    process.exitCode = 1;
  }
}

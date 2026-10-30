import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const source = fs.readFileSync("scripts/run-job.mjs", "utf8");
const reuseStart = source.indexOf("if (reuseAudio) {");
const vbeeCall = source.indexOf("await synthesizeVbee(");
assert.ok(reuseStart > 0 && vbeeCall > reuseStart);
const between = source.slice(reuseStart, vbeeCall);
assert.equal(between.includes("synthesizeVbee"), false);
assert.match(between, /Refusing to call Vbee/);

let failed = false;
try {
  execFileSync(process.execPath, [
    "scripts/run-job.mjs",
    "--mode=video-reuse",
    "--job=jobs/kci-2026-10-29-kr-mid.json",
  ], {
    encoding: "utf8",
    env: {
      ...process.env,
      KCI_ALIGN_CAPTIONS: "0",
      KCI_REUSE_PROPS: "/tmp/kci-missing-reuse-props.json",
      VBEE_APP_ID: "",
      VBEE_API_TOKEN: "",
    },
  });
} catch (error) {
  failed = true;
  const output = String(error.stderr || "") + String(error.stdout || "");
  assert.match(output, /Missing reused props/);
  assert.doesNotMatch(output, /Missing VBEE_/);
  assert.equal(output.includes("api.vbee.vn"), false);
}
assert.equal(failed, true);

const propsPath = path.join(os.tmpdir(), "kci-reuse-props.json");
fs.writeFileSync(propsPath, JSON.stringify({
  scenes: Array.from({ length: 7 }, () => ({ durationFrames: 300 })),
}));
let regenBlocked = false;
try {
  execFileSync(process.execPath, [
    "scripts/run-job.mjs",
    "--mode=video-reuse",
    "--job=jobs/kci-2026-10-29-kr-close.json",
  ], {
    encoding: "utf8",
    env: {
      ...process.env,
      KCI_ALIGN_CAPTIONS: "0",
      KCI_REGEN_SCENES: "2",
      KCI_REUSE_PROPS: propsPath,
      VBEE_APP_ID: "",
      VBEE_API_TOKEN: "",
    },
  });
} catch (error) {
  regenBlocked = true;
  const output = String(error.stderr || "") + String(error.stdout || "");
  assert.match(output, /Missing reused MP3/);
  assert.doesNotMatch(output, /Missing VBEE_/);
  assert.equal(output.includes("api.vbee.vn"), false);
}
assert.equal(regenBlocked, true);
console.log("video-reuse guard: PASS");

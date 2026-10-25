import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { synthesizeVbee } from "./vbee.mjs";

const temp = await fs.mkdtemp(path.join(os.tmpdir(), "kci-vbee-test-"));
try {
  const fixture = path.join(temp, "github-event.json");
  await fs.writeFile(fixture, JSON.stringify({
    action: "opened",
    issue: {
      title: "[KCI VOICE TEST] 2026-10-23",
      body: '{"job":"jobs/kci-2026-10-23.json"}',
      user: { login: "nvt91" },
    },
  }));
  const validated = execFileSync(process.execPath, [
    "scripts/run-job.mjs", "--mode=validate", "--job=jobs/kci-2026-10-23.json",
  ], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      GITHUB_EVENT_NAME: "issues",
      GITHUB_EVENT_PATH: fixture,
      GITHUB_REPOSITORY_OWNER: "nvt91",
      VBEE_APP_ID: "",
      VBEE_API_TOKEN: "",
    },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.match(validated, /Validated .* scenes/);

  process.env.VBEE_APP_ID = "fake-unit-app";
  process.env.VBEE_API_TOKEN = "fake-unit-token";
  process.env.VBEE_VOICE_CODE = "n_hanoi_male_anhkhoitintuc_zero_shot_news_vc";
  process.env.VBEE_WEBHOOK_URL = "https://kcinews.golffashion-vn.workers.dev/api/vbee-callback";
  const oldFetch = globalThis.fetch;
  const calls = [];
  try {
    globalThis.fetch = async (url, options={}) => {
      calls.push({url: String(url), method: options.method || "GET", redirect:options.redirect});
      if (String(url) === "https://api.vbee.vn/v1/tts") {
        assert.equal(options.method, "POST");
        assert.equal(JSON.parse(options.body).voiceCode, "n_hanoi_male_anhkhoitintuc_zero_shot_news_vc");
        return new Response(JSON.stringify({
          status: "PROCESSING",
          requestId: "test-request-123",
          audioLink: "https://cdn.vbee.vn/test-first",
        }), {status:200, headers:{"content-type":"application/json"}});
      }
      if (String(url) === "https://cdn.vbee.vn/test-first") {
        assert.equal(options.redirect, "manual");
        return new Response(null, {status:302,headers:{Location:"https://cdn.vbee.vn/test-final"}});
      }
      if (String(url) === "https://cdn.vbee.vn/test-final") {
        return new Response(new Uint8Array(4096).fill(42), {status:200, headers:{"content-type":"audio/mpeg"}});
      }
      throw Error("Unexpected test URL");
    };
    const file = path.join(temp, "sample.mp3");
    await synthesizeVbee("Kiểm thử giọng đọc tiếng Việt và tải MP3 Vbee.", file);
    assert.equal((await fs.stat(file)).size, 4096);
    assert.equal(calls.length, 3);
    assert(!calls[1].url.includes("fake-unit-token"), "No auth token sent to CDN");
  } finally {
    globalThis.fetch = oldFetch;
  }
  console.log("KCI Vbee adapter tests passed: validation is free and trusted redirects work.");
} finally {
  await fs.rm(temp, {recursive:true,force:true});
}

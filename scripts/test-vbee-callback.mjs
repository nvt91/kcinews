import assert from "node:assert/strict";
import worker from "../workers/vbee-callback.mjs";

const url = "https://unit-test.workers.dev/api/vbee-callback";

const get = await worker.fetch(new Request(url, { method: "GET" }));
assert.equal(get.status, 200);
assert.equal((await get.json()).status, "ready");

const valid = await worker.fetch(new Request(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ requestId: "test", status: "COMPLETED" }),
}));
assert.equal(valid.status, 200);
assert.equal(await valid.text(), "");

const invalid = await worker.fetch(new Request(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{invalid-json",
}));
assert.equal(invalid.status, 400);

const wrongMedia = await worker.fetch(new Request(url, {
  method: "POST",
  headers: { "content-type": "text/plain" },
  body: "{}",
}));
assert.equal(wrongMedia.status, 415);

const oversize = await worker.fetch(new Request(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ large: "x".repeat(20_000) }),
}));
assert.equal(oversize.status, 413);

const wrongPath = await worker.fetch(new Request("https://unit-test.workers.dev/unrecognized"));
assert.equal(wrongPath.status, 404);

console.log("Cloudflare Vbee callback tests passed: no storage or side effects.");

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {validateKciJob} from "./validate-kci-job.mjs";

const original = JSON.parse(fs.readFileSync("jobs/kci-schema-v2-example.json", "utf8"));
const makeJob = () => JSON.parse(JSON.stringify(original));
assert.doesNotThrow(() => validateKciJob(makeJob()), "existing schema v2 must remain valid");

const cinematic = makeJob();
cinematic.scenes[0].visual.motionStyle = "cinematic";
assert.doesNotThrow(() => validateKciJob(cinematic), "opt-in kinetic headline should be valid");

const malformed = makeJob();
malformed.scenes[0].visual.assetPath = "https://example.org/a.png";
malformed.scenes[0].visual.assetKind = "ai-illustration";
malformed.scenes[0].visual.assetCredit = "AI-generated illustration";
assert.throws(() => validateKciJob(malformed), /visual asset must be a local/, "remote fetch must be rejected");

const traversal = makeJob();
traversal.scenes[0].visual.assetPath = "assets/kci/../../secrets.png";
traversal.scenes[0].visual.assetKind = "ai-illustration";
traversal.scenes[0].visual.assetCredit = "AI-generated illustration";
assert.throws(() => validateKciJob(traversal), /visual asset must be a local/, "path traversal must be rejected");

const local = "public/assets/kci/tests/visual-fixture.png";
try {
  fs.mkdirSync(path.dirname(local), {recursive:true});
  // Tiny test-only transparent pixel. This file is removed by finally.
  fs.writeFileSync(local, Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9YLhSQUAAAAASUVORK5CYII=", "base64",
  ));
  const valid = makeJob();
  valid.scenes[0].visual.assetPath = "assets/kci/tests/visual-fixture.png";
  valid.scenes[0].visual.assetKind = "ai-illustration";
  valid.scenes[0].visual.assetCredit = "Generated test fixture; not a news source";
  assert.doesNotThrow(() => validateKciJob(valid));

  const missingCredit = makeJob();
  missingCredit.scenes[0].visual.assetPath = "assets/kci/tests/visual-fixture.png";
  missingCredit.scenes[0].visual.assetKind = "ai-illustration";
  assert.throws(() => validateKciJob(missingCredit), /visual asset source\/license\/provenance required/);

  const missingDisclosure = makeJob();
  missingDisclosure.scenes[0].visual.assetPath = "assets/kci/tests/visual-fixture.png";
  missingDisclosure.scenes[0].visual.assetCredit = "Generated test fixture; not a news source";
  assert.throws(() => validateKciJob(missingDisclosure), /visual asset disclosure kind required/);
} finally {
  if (fs.existsSync(local)) fs.unlinkSync(local);
}
console.log("KCI Phase-1 visual asset checks passed (schema compatibility, local paths, provenance).");

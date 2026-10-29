import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  alignNarration,
  alignSceneCaptions,
  alignmentEnabled,
  cuesFromTimedWords,
  proportionalCaptions,
  timedWordsFromWhisperJson,
} from "./align-captions.mjs";

const narration = "đóng cửa KOSPI hôm nay năm nghìn điểm.";
const audioFrames = 90;
const proportional = proportionalCaptions(narration, audioFrames);
assert.equal(proportional.map((cue) => cue.text).join(" "), narration);
assert.equal(proportional.length, 2);
assert.equal(proportional[0].from, 0);

const seven = "một hai ba bốn năm sáu bảy tám chín";
const chunks = proportionalCaptions(seven, 270);
assert.deepEqual(chunks.map((cue) => cue.text), [
  "một hai ba bốn năm sáu bảy",
  "tám chín",
]);
assert.equal(chunks[0].from, 0);
assert.equal(chunks[0].to, Math.floor(7 / 9 * 270));

const parsed = timedWordsFromWhisperJson({
  segments: [{
    words: [
      { word: " dong", start: 0.4, end: 0.7 },
      { word: "cửa", start: 0.7, end: 1.0 },
      { word: "KOSPI", start: 1.0, end: 1.4 },
      { word: "hôm", start: 1.5, end: 1.8 },
      { word: "nay", start: 1.8, end: 2.0 },
      { word: "năm", start: 2.1, end: 2.3 },
      { word: "nghìn", start: 2.3, end: 2.6 },
      { word: "điểm.", start: 2.6, end: 3.0 },
    ],
  }],
});
const aligned = alignNarration(narration, parsed, audioFrames);
assert.equal(aligned.ok, true);
assert.equal(aligned.captions.map((cue) => cue.text).join(" "), narration);
assert.ok(aligned.captions.length >= 2, "short cues replace one 7-word block");
assert.ok(aligned.captions.every((cue) => cue.text.split(/\s+/).length <= 3));
assert.equal(aligned.captions[0].from, Math.floor(0.4 * 30));
assert.ok(aligned.captions.at(-1).text.endsWith("điểm."));

const drifted = alignNarration(narration, [
  { text: "hello", start: 0, end: 0.4 },
  { text: "market", start: 0.4, end: 0.8 },
], audioFrames);
assert.equal(drifted.ok, false);
assert.match(drifted.reason, /low match/);

const cppJson = timedWordsFromWhisperJson({
  transcription: [{
    text: " đóng",
    timestamps: { from: "00:00:00,400", to: "00:00:00,700" },
  }],
});
assert.equal(cppJson[0].start, 0.4);
assert.equal(cppJson[0].end, 0.7);

delete process.env.KCI_ALIGN_CAPTIONS;
assert.equal(alignmentEnabled(), false);
const off = alignSceneCaptions({ narration, audioFrames, audioPath: "missing.mp3" });
assert.equal(off.method, "proportional");
assert.equal(off.reason, "disabled");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "kci-align-test-"));
const wav = path.join(temp, "silence.wav");
const marker = path.join(temp, "called");
const stub = path.join(temp, "whisper-cli");
const sampleRate = 8000;
const sampleCount = sampleRate;
const data = Buffer.alloc(44 + sampleCount * 2);
data.write("RIFF", 0);
data.writeUInt32LE(36 + sampleCount * 2, 4);
data.write("WAVEfmt ", 8);
data.writeUInt32LE(16, 16);
data.writeUInt16LE(1, 20);
data.writeUInt16LE(1, 22);
data.writeUInt32LE(sampleRate, 24);
data.writeUInt32LE(sampleRate * 2, 28);
data.writeUInt16LE(2, 32);
data.writeUInt16LE(16, 34);
data.write("data", 36);
data.writeUInt32LE(sampleCount * 2, 40);
fs.writeFileSync(wav, data);
fs.writeFileSync(stub, `#!/bin/sh\necho called > ${JSON.stringify(marker).replaceAll('"', "")}\nexit 0\n`);
fs.chmodSync(stub, 0o755);
const model = path.join(temp, "ggml-base.bin");
fs.writeFileSync(model, "not-a-real-model");

process.env.KCI_ALIGN_CAPTIONS = "1";
process.env.KCI_WHISPER_BIN = stub;
process.env.KCI_WHISPER_MODEL = model;
const failed = alignSceneCaptions({ narration, audioFrames, audioPath: wav });
assert.equal(failed.method, "proportional");
assert.equal(failed.captions.map((cue) => cue.text).join(" "), narration);
assert.match(failed.reason, /JSON|Whisper|timed out|not found|model/i);
assert.equal(fs.existsSync(marker), true, "enabled alignment invokes the local binary");

delete process.env.KCI_ALIGN_CAPTIONS;
fs.rmSync(marker, { force: true });
const skipped = alignSceneCaptions({ narration, audioFrames, audioPath: wav });
assert.equal(skipped.method, "proportional");
assert.equal(fs.existsSync(marker), false, "default off does not invoke Whisper");

const validated = execFileSync(process.execPath, [
  "scripts/run-job.mjs", "--mode=validate", "--job=jobs/kci-2026-10-29-kr-mid.json",
], { encoding: "utf8" });
assert.match(validated, /Validated kci-2026-10-29-kr-mid/);

const realScript = "Samsung vừa công bố báo cáo quý ba: lợi nhuận hoạt động một trăm linh bảy phẩy bốn nghìn tỷ won. Nhưng mảng chip tạo gần hết lợi nhuận, còn mảng thiết bị lại lỗ. Bản sáng mới chỉ nói đến lịch công bố. Đây là số liệu chi tiết vừa ra.";
const realOj = timedWordsFromWhisperJson({
  transcription: [
    {
      timestamps: { from: "00:00:00,000", to: "00:00:06,400" },
      text: " Samson vừa công bố báo cáo quý ba lợi nhận hoạt động 1007/4.000 tỷ huồn, nhưng màng chiếp tạo gần hết lợi nhận,",
    },
    {
      timestamps: { from: "00:00:06,400", to: "00:00:11,320" },
      text: " còn màng thiết bị lại lỗ, bản sáng mới chỉ nói đến lịch công bố, đây là số liệu chi tiết vừa gian.",
    },
  ],
});
assert.ok(realOj.length > 10, "segment text must be split into words");
const realAligned = alignNarration(realScript, realOj, 339);
assert.equal(realAligned.ok, true);
assert.ok(realAligned.matched / realAligned.total >= 0.8, realAligned.matched + "/" + realAligned.total);
assert.ok(realAligned.captions.every((cue) => cue.text.split(/\s+/).length <= 3));

const phrase = cuesFromTimedWords([
  { text: "sáu", start: 0.0, end: 0.3 },
  { text: "phẩy", start: 0.3, end: 0.5 },
  { text: "mươi", start: 0.5, end: 0.8 },
  { text: "phần", start: 0.8, end: 1.0 },
  { text: "trăm.", start: 1.0, end: 1.3 },
  { text: "Con", start: 1.4, end: 1.6 },
  { text: "số", start: 1.6, end: 1.8 },
], 90);
assert.ok(phrase.every((cue) => !cue.text.includes("trăm. Con")), phrase.map((cue) => cue.text).join(" | "));
assert.ok(phrase.some((cue) => cue.text.startsWith("Con")));
const hang = cuesFromTimedWords([
  { text: "nhà", start: 0, end: 0.2 },
  { text: "đầu", start: 0.2, end: 0.4 },
  { text: "Theo", start: 0.4, end: 0.6 },
  { text: "Yonhap", start: 0.6, end: 0.9 },
], 60);
assert.ok(hang.every((cue) => !cue.text.endsWith("Theo")), hang.map((cue) => cue.text).join(" | "));

console.log("align-captions tests: PASS");

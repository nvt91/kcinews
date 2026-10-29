import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const FPS = 30;
const SHORT_CUE_WORDS = 3;
const MIN_MATCH = 0.5;

export function alignmentEnabled() {
  const value = String(process.env.KCI_ALIGN_CAPTIONS || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function proportionalCaptions(narration, audioFrames) {
  const words = String(narration || "").trim().split(/\s+/);
  const captions = [];
  const span = Math.max(1, audioFrames);
  for (let wi = 0; wi < words.length; wi += 7) {
    const from = Math.floor(wi / words.length * span);
    const to = Math.max(from + 1, Math.floor(Math.min(wi + 7, words.length) / words.length * span));
    captions.push({ from, to, text: words.slice(wi, wi + 7).join(" ") });
  }
  return captions;
}

function fold(text) {
  return String(text || "")
    .replace(/[đĐ]/g, "d")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function tokenScore(left, right) {
  if (!left || !right) return -1;
  if (left === right) return 3;
  const shorter = left.length < right.length ? left : right;
  const longer = shorter === left ? right : left;
  if (shorter.length >= 3 && longer.includes(shorter)) return 2;
  return -1;
}

function parseTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const match = /^(\d+):(\d+):(\d+)[,.](\d+)$/.exec(String(value || "").trim());
  if (!match) return NaN;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
}

export function timedWordsFromWhisperJson(json) {
  const words = [];
  const push = (text, start, end) => {
    const token = String(text || "").trim();
    const from = Number(start);
    let to = Number(end);
    if (!token || !Number.isFinite(from) || !Number.isFinite(to)) return;
    if (to < from) to = from + 0.05;
    words.push({ text: token, start: from, end: to });
  };
  if (Array.isArray(json?.words)) {
    for (const word of json.words) push(word.word || word.text, word.start, word.end);
  } else if (Array.isArray(json?.segments)) {
    for (const segment of json.segments) {
      if (Array.isArray(segment.words) && segment.words.length) {
        for (const word of segment.words) push(word.word || word.text, word.start, word.end);
      } else {
        push(segment.text, segment.start, segment.end);
      }
    }
  }
  if (!words.length && Array.isArray(json?.transcription)) {
    for (const segment of json.transcription) {
      push(segment.text, parseTimestamp(segment.timestamps?.from), parseTimestamp(segment.timestamps?.to));
    }
  }
  words.sort((a, b) => a.start - b.start || a.end - b.end);
  return words;
}

export function alignScriptToWhisper(scriptWords, whisperWords, audioSeconds) {
  const script = scriptWords.filter(Boolean);
  const heard = whisperWords.filter((word) => fold(word.text));
  if (!script.length || !heard.length) return { ok: false, reason: "empty tokens" };
  const left = script.map(fold);
  const right = heard.map((word) => fold(word.text));
  const gap = -1;
  const rows = script.length + 1;
  const cols = heard.length + 1;
  const score = Array.from({ length: rows }, () => new Int16Array(cols));
  const back = Array.from({ length: rows }, () => new Uint8Array(cols));
  for (let i = 1; i < rows; i++) {
    score[i][0] = i * gap;
    back[i][0] = 2;
  }
  for (let j = 1; j < cols; j++) {
    score[0][j] = j * gap;
    back[0][j] = 3;
  }
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const diagonal = score[i - 1][j - 1] + tokenScore(left[i - 1], right[j - 1]);
      const skipScript = score[i - 1][j] + gap;
      const skipHeard = score[i][j - 1] + gap;
      if (diagonal >= skipScript && diagonal >= skipHeard) {
        score[i][j] = diagonal;
        back[i][j] = 1;
      } else if (skipScript >= skipHeard) {
        score[i][j] = skipScript;
        back[i][j] = 2;
      } else {
        score[i][j] = skipHeard;
        back[i][j] = 3;
      }
    }
  }
  const assigned = new Array(script.length).fill(null);
  let i = script.length;
  let j = heard.length;
  let matched = 0;
  while (i > 0 || j > 0) {
    const move = i > 0 && j > 0 ? back[i][j] : (i > 0 ? 2 : 3);
    if (move === 1) {
      if (tokenScore(left[i - 1], right[j - 1]) > 0) {
        assigned[i - 1] = { start: heard[j - 1].start, end: heard[j - 1].end };
        matched += 1;
      }
      i -= 1;
      j -= 1;
    } else if (move === 2) i -= 1;
    else j -= 1;
  }
  if (matched / script.length < MIN_MATCH) {
    return { ok: false, reason: `low match ${matched}/${script.length}`, matched, total: script.length };
  }
  const duration = Number.isFinite(audioSeconds) && audioSeconds > 0 ? audioSeconds : heard[heard.length - 1].end;
  const timed = fillGaps(script, assigned, duration);
  return { ok: true, words: timed, matched, total: script.length };
}

function fillGaps(script, assigned, audioSeconds) {
  const times = assigned.map((slot) => (slot ? { start: slot.start, end: slot.end } : null));
  let previousIndex = -1;
  let previousEnd = 0;
  for (let index = 0; index <= script.length; index++) {
    const anchored = index < script.length && times[index];
    if (!anchored && index < script.length) continue;
    const gapStart = previousIndex + 1;
    const gapCount = index - gapStart;
    const nextStart = anchored ? times[index].start : audioSeconds;
    if (gapCount > 0) {
      const span = Math.max(0, nextStart - previousEnd);
      for (let offset = 0; offset < gapCount; offset++) {
        const start = previousEnd + span * offset / gapCount;
        const end = previousEnd + span * (offset + 1) / gapCount;
        times[gapStart + offset] = { start, end: Math.max(start, end) };
      }
    }
    if (anchored) {
      previousIndex = index;
      previousEnd = times[index].end;
    }
  }
  return script.map((text, index) => ({ text, start: times[index].start, end: times[index].end }));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function cuesFromTimedWords(timedWords, audioFrames, fps = FPS) {
  const span = Math.max(1, audioFrames);
  const cues = [];
  let bucket = [];
  const flush = () => {
    if (!bucket.length) return;
    let from = clamp(Math.floor(bucket[0].start * fps), 0, span - 1);
    let to = clamp(Math.ceil(bucket[bucket.length - 1].end * fps), 0, span);
    if (to <= from) to = Math.min(span, from + 1);
    const previous = cues[cues.length - 1];
    if (previous && from < previous.to) from = previous.to;
    if (from >= span) from = span - 1;
    if (to <= from) to = Math.min(span, from + 1);
    if (from < to) cues.push({ from, to, text: bucket.map((word) => word.text).join(" ") });
    bucket = [];
  };
  for (const word of timedWords) {
    bucket.push(word);
    if (bucket.length >= SHORT_CUE_WORDS || /[.?!…]$/.test(word.text)) flush();
  }
  flush();
  return cues;
}

function which(name) {
  try {
    const found = execFileSync("which", [name], { encoding: "utf8", timeout: 2000 }).trim();
    return found || "";
  } catch {
    return "";
  }
}

function modelPath() {
  const configured = process.env.KCI_WHISPER_MODEL;
  if (configured && fs.existsSync(configured)) return configured;
  const fallback = path.join(os.homedir(), ".cache", "kci-whisper", "ggml-base.bin");
  if (fs.existsSync(fallback)) return fallback;
  throw new Error("local Whisper model file not found (set KCI_WHISPER_MODEL to ggml-base.bin)");
}

function toWav(audioPath, destination) {
  if (which("ffmpeg")) {
    execFileSync("ffmpeg", [
      "-y", "-i", audioPath, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", destination,
    ], { timeout: 60000, stdio: "ignore" });
    return destination;
  }
  if (audioPath.toLowerCase().endsWith(".wav")) return audioPath;
  throw new Error("ffmpeg not found");
}

function readWhisperOutput(directory, baseName) {
  const candidates = [
    path.join(directory, baseName + ".json"),
    path.join(directory, "whisper.json"),
  ];
  for (const file of fs.readdirSync(directory)) {
    if (file.endsWith(".json")) candidates.push(path.join(directory, file));
  }
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    return timedWordsFromWhisperJson(JSON.parse(fs.readFileSync(file, "utf8")));
  }
  throw new Error("Whisper wrote no JSON");
}

function runWhisper(wavPath, directory) {
  const configured = process.env.KCI_WHISPER_BIN;
  const binary = configured || which("whisper-cli") || which("whisper");
  if (!binary) throw new Error("whisper binary not found");
  const baseName = "whisper";
  const cpp = path.basename(binary).includes("whisper-cli") || path.basename(binary) === "main";
  if (cpp) {
    const model = modelPath();
    const args = ["-m", model, "-l", "vi", "-f", wavPath, "-oj", "-of", path.join(directory, baseName)];
    try {
      execFileSync(binary, [...args, "-sow"], { timeout: 180000, stdio: "ignore" });
    } catch (error) {
      if (error?.code === "ETIMEDOUT" || error?.killed) throw new Error("Whisper timed out");
      execFileSync(binary, args, { timeout: 180000, stdio: "ignore" });
    }
  } else {
    execFileSync(binary, [
      wavPath,
      "--model", process.env.KCI_WHISPER_MODEL || "base",
      "--language", "vi",
      "--word_timestamps", "True",
      "--output_format", "json",
      "--output_dir", directory,
      "--device", "cpu",
      "--verbose", "False",
    ], { timeout: 180000, stdio: "ignore" });
  }
  const words = readWhisperOutput(directory, baseName);
  if (!words.length) throw new Error("Whisper JSON had no word times");
  return words;
}

export function alignNarration(narration, whisperWords, audioFrames, fps = FPS) {
  const scriptWords = String(narration || "").trim().split(/\s+/).filter(Boolean);
  const audioSeconds = audioFrames / fps;
  const aligned = alignScriptToWhisper(scriptWords, whisperWords, audioSeconds);
  if (!aligned.ok) return aligned;
  const captions = cuesFromTimedWords(aligned.words, audioFrames, fps);
  const spoken = captions.map((cue) => cue.text).join(" ");
  if (spoken !== scriptWords.join(" ")) return { ok: false, reason: "cue text drifted from the script" };
  return { ok: true, captions, matched: aligned.matched, total: aligned.total, method: "aligned" };
}

export function alignSceneCaptions({ narration, audioFrames, audioPath }) {
  if (!alignmentEnabled()) {
    return { ok: true, method: "proportional", captions: proportionalCaptions(narration, audioFrames), reason: "disabled" };
  }
  if (!audioPath || !fs.existsSync(audioPath)) {
    return { ok: false, reason: "no audio file", captions: proportionalCaptions(narration, audioFrames), method: "proportional" };
  }
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "kci-align-"));
  try {
    const wav = toWav(audioPath, path.join(directory, "scene.wav"));
    const words = runWhisper(wav, directory);
    const aligned = alignNarration(narration, words, audioFrames);
    if (!aligned.ok) {
      return { ...aligned, captions: proportionalCaptions(narration, audioFrames), method: "proportional" };
    }
    return aligned;
  } catch (error) {
    return {
      ok: false,
      method: "proportional",
      reason: String(error?.message || error).replace(/\s+/g, " ").slice(0, 180),
      captions: proportionalCaptions(narration, audioFrames),
    };
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

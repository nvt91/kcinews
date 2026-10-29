import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const FPS = 30;
const SHORT_CUE_WORDS = 3;
const MIN_MATCH = 0.5;
const NUM_WORDS = new Set(
  "khong mot hai ba bon nam sau bay tam chin muoi tram nghin ngan trieu ty phay linh le tu".split(" "),
);

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

function editDistance(left, right) {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const score = Array.from({ length: rows }, () => new Uint16Array(cols));
  for (let i = 0; i < rows; i++) score[i][0] = i;
  for (let j = 0; j < cols; j++) score[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      score[i][j] = Math.min(score[i - 1][j] + 1, score[i][j - 1] + 1, score[i - 1][j - 1] + cost);
    }
  }
  return score[left.length][right.length];
}

function hasDigit(text) {
  return /\d/.test(text);
}

function isNumWord(text) {
  return NUM_WORDS.has(text);
}

function tokenScore(left, right) {
  if (!left || !right) return -1;
  if (left === right) return 4;
  if (isNumWord(left) && hasDigit(right)) return 3;
  const distance = editDistance(left, right);
  const longest = Math.max(left.length, right.length);
  if (longest >= 6 && distance <= 2) return 3;
  if (Math.min(left.length, right.length) >= 3 && distance <= 1) return 3;
  return -1;
}

function parseTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const match = /^(\d+):(\d+):(\d+)[,.](\d+)$/.exec(String(value || "").trim());
  if (!match) return NaN;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
}

function isSpecialToken(text) {
  return /^\[.*\]$/.test(String(text || "").trim());
}

function wordsFromPieces(pieces) {
  const words = [];
  let current = null;
  const flush = () => {
    if (!current) return;
    const text = current.text.trim();
    if (text) words.push({ text, start: current.start, end: current.end });
    current = null;
  };
  for (const piece of pieces) {
    const raw = String(piece.text || "");
    if (!raw || isSpecialToken(raw)) continue;
    const start = piece.start;
    const end = piece.end;
    if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
    const boundary = /^\s/.test(raw) || !current;
    if (boundary) flush();
    const chunk = raw.trim();
    if (!chunk) continue;
    if (!current) current = { text: chunk, start, end: Math.max(start, end) };
    else {
      current.text += chunk;
      current.end = Math.max(current.end, end);
    }
  }
  flush();
  return words;
}

function spreadText(text, start, end) {
  const parts = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length || !Number.isFinite(start) || !Number.isFinite(end)) return [];
  const span = Math.max(0.02, end - start);
  return parts.map((part, index) => ({
    text: part,
    start: start + span * index / parts.length,
    end: start + span * (index + 1) / parts.length,
  }));
}

function piecesOf(list, textKey) {
  return list.filter((item) => !isSpecialToken(item[textKey] || item.text || item.word)).map((item) => ({
    text: item[textKey] || item.text || item.word || "",
    start: parseTimestamp(item.timestamps?.from ?? item.start),
    end: parseTimestamp(item.timestamps?.to ?? item.end),
  }));
}

export function timedWordsFromWhisperJson(json) {
  const segments = Array.isArray(json?.transcription) ? json.transcription
    : Array.isArray(json?.segments) ? json.segments : [];
  let words = [];
  let sawTokens = false;
  for (const segment of segments) {
    if (Array.isArray(segment.tokens) && segment.tokens.length) {
      sawTokens = true;
      words.push(...wordsFromPieces(piecesOf(segment.tokens, "text")));
    } else if (Array.isArray(segment.words) && segment.words.length) {
      sawTokens = true;
      for (const word of segment.words) {
        const start = parseTimestamp(word.start);
        const end = parseTimestamp(word.end);
        words.push(...spreadText(word.word || word.text, start, end));
      }
    }
  }
  if (!sawTokens && Array.isArray(json?.words)) {
    sawTokens = true;
    for (const word of json.words) {
      words.push(...spreadText(word.word || word.text, parseTimestamp(word.start), parseTimestamp(word.end)));
    }
  }
  if (!words.length) {
    for (const segment of segments) {
      const start = parseTimestamp(segment.timestamps?.from ?? segment.start);
      const end = parseTimestamp(segment.timestamps?.to ?? segment.end);
      words.push(...spreadText(segment.text, start, end));
    }
  }
  words.sort((a, b) => a.start - b.start || a.end - b.end);
  return words.filter((word) => fold(word.text) || hasDigit(word.text));
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
  const take = Array.from({ length: rows }, () => new Uint8Array(cols));
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
      let best = score[i - 1][j - 1] + tokenScore(left[i - 1], right[j - 1]);
      let move = 1;
      let consumed = 1;
      const skipScript = score[i - 1][j] + gap;
      const skipHeard = score[i][j - 1] + gap;
      if (skipScript > best) { best = skipScript; move = 2; consumed = 1; }
      if (skipHeard > best) { best = skipHeard; move = 3; consumed = 1; }
      if (hasDigit(heard[j - 1].text)) {
        for (let k = 2; k <= 12 && k <= i; k++) {
          if (!isNumWord(left[i - k])) break;
          let numeric = true;
          for (let step = 1; step < k; step++) {
            if (!isNumWord(left[i - step])) { numeric = false; break; }
          }
          if (!numeric) break;
          const runScore = score[i - k][j - 1] + 3 * k;
          if (runScore > best) { best = runScore; move = 4; consumed = k; }
        }
      }
      score[i][j] = best;
      back[i][j] = move;
      take[i][j] = consumed;
    }
  }
  const assigned = new Array(script.length).fill(null);
  let i = script.length;
  let j = heard.length;
  let matched = 0;
  while (i > 0 || j > 0) {
    const move = i > 0 && j > 0 ? back[i][j] : (i > 0 ? 2 : 3);
    if (move === 4 && j > 0) {
      const count = take[i][j] || 1;
      const spanStart = heard[j - 1].start;
      const spanEnd = heard[j - 1].end;
      for (let step = count; step >= 1; step--) {
        const offset = count - step;
        assigned[i - step] = {
          start: spanStart + (spanEnd - spanStart) * offset / count,
          end: spanStart + (spanEnd - spanStart) * (offset + 1) / count,
        };
        matched += 1;
      }
      i -= count;
      j -= 1;
    } else if (move === 1 && j > 0) {
      if (tokenScore(left[i - 1], right[j - 1]) > 0) {
        assigned[i - 1] = { start: heard[j - 1].start, end: heard[j - 1].end };
        matched += 1;
      }
      i -= 1;
      j -= 1;
    } else if (move === 2 || j === 0) i -= 1;
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

const HANGING = new Set("theo va cua cho voi tu den trong la cac nhung de khi ma hay hoac o tai mot".split(" "));

function bareWord(text) {
  return fold(text).replace(/[^\p{L}\p{N}]+/gu, "");
}

export function cuesFromTimedWords(timedWords, audioFrames, fps = FPS) {
  const span = Math.max(1, audioFrames);
  const cues = [];
  let bucket = [];
  const flush = (keepLast = false) => {
    let held = null;
    if (keepLast && bucket.length > 1 && HANGING.has(bareWord(bucket[bucket.length - 1].text))) {
      held = bucket.pop();
    }
    if (!bucket.length) {
      if (held) bucket = [held];
      return;
    }
    let from = clamp(Math.floor(bucket[0].start * fps), 0, span - 1);
    let to = clamp(Math.ceil(bucket[bucket.length - 1].end * fps), 0, span);
    if (to <= from) to = Math.min(span, from + 1);
    const previous = cues[cues.length - 1];
    if (previous && from < previous.to) from = previous.to;
    if (from >= span) from = span - 1;
    if (to <= from) to = Math.min(span, from + 1);
    if (from < to) cues.push({ from, to, text: bucket.map((word) => word.text).join(" ") });
    bucket = held ? [held] : [];
  };
  for (const word of timedWords) {
    bucket.push(word);
    const sentence = /[.?!…]$/.test(word.text);
    const clause = /[,;:]$/.test(word.text);
    if (sentence) flush(false);
    else if (clause && bucket.length > 1) flush(false);
    else if (bucket.length >= SHORT_CUE_WORDS) flush(true);
  }
  flush(false);
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
  for (const name of ["ggml-small.bin", "ggml-base.bin"]) {
    const candidate = path.join(os.homedir(), ".cache", "kci-whisper", name);
    if (fs.existsSync(candidate)) return candidate;
  }
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
    const outBase = path.join(directory, baseName);
    const args = ["-m", model, "-l", "vi", "-f", wavPath, "-of", outBase, "-np", "-t", "2"];
    try {
      execFileSync(binary, [...args, "-ojf", "-sow"], { timeout: 180000, stdio: "ignore" });
    } catch (error) {
      if (error?.code === "ETIMEDOUT" || error?.killed) throw new Error("Whisper timed out");
      execFileSync(binary, [...args, "-oj"], { timeout: 180000, stdio: "ignore" });
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

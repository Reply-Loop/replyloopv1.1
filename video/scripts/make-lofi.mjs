// Lo-fi jazz music kit: one audio file per ad section ("batch"), all at 90 BPM.
// Every sound choice lives in a named PROFILE (v1-original, v2-clean, alts), and
// all profiles share the same beat grid and accent cues, so any version drops
// into any edit. v1-original reproduces the first delivery bit-for-bit.
//
// (= exactly 20 frames per beat at 30fps), sample-aligned so they chain
// seamlessly. Each section has its own progression, groove and colour, plus
// "thump" accents on the beats where the main point of the frame lands.
// Also writes src/audio/cues.json (the visuals sync to it) and a stitched
// full mix for review. Fully synthesized, deterministic, no downloads.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SR = 44100;
const BPM = 90;
const FPS = 30;
const BEAT = 60 / BPM; // 0.6667s
const FPB = (FPS * 60) / BPM; // 20 frames per beat
const TAIL = 1.6; // seconds of ring-out after each section (overlaps next)
const MUSIC = path.resolve(process.env.MUSIC_DIR || "public/music");
fs.mkdirSync(path.resolve("src/audio"), { recursive: true });

// ---------- utils ----------
let seed = 90210;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const rn = () => rnd() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const S = (sec) => Math.round(sec * SR);

const writeWav = (file, L, R) => {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  let o = 44;
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), o);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), o + 2);
    o += 4;
  }
  fs.writeFileSync(file, buf);
};

// RBJ biquad, coefficients refreshed in blocks so cutoff can move.
const biquad = (x, type, cutoffFn, q = 0.707) => {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, b0, b1, b2, a1, a2;
  for (let i = 0; i < x.length; i++) {
    if (i % 64 === 0) {
      const fc = Math.min(SR * 0.45, Math.max(20, typeof cutoffFn === "function" ? cutoffFn(i / SR) : cutoffFn));
      const w = (2 * Math.PI * fc) / SR, c = Math.cos(w), al = Math.sin(w) / (2 * q);
      const a0 = 1 + al;
      if (type === "lp") { b0 = (1 - c) / 2 / a0; b1 = (1 - c) / a0; b2 = b0; }
      else if (type === "hp") { b0 = (1 + c) / 2 / a0; b1 = -(1 + c) / a0; b2 = b0; }
      else { b0 = al / a0; b1 = 0; b2 = -al / a0; } // bandpass
      a1 = (-2 * c) / a0; a2 = (1 - al) / a0;
    }
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
};

// Freeverb-style reverb (mono in, stereo out).
const reverb = (x, size = 0.84, damp = 0.35) => {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const aps = [556, 441, 341, 225];
  const run = (spread) => {
    const out = new Float32Array(x.length);
    for (const d0 of combs) {
      const d = d0 + spread; const buf = new Float32Array(d); let idx = 0, filt = 0;
      for (let i = 0; i < x.length; i++) {
        const o = buf[idx]; filt = o * (1 - damp) + filt * damp;
        buf[idx] = x[i] * 0.015 + filt * size; out[i] += o; idx = (idx + 1) % d;
      }
    }
    for (const d0 of aps) {
      const d = d0 + spread; const buf = new Float32Array(d); let idx = 0;
      for (let i = 0; i < out.length; i++) {
        const b = buf[idx]; const v = -out[i] + b; buf[idx] = out[i] + b * 0.5; out[i] = v; idx = (idx + 1) % d;
      }
    }
    return out;
  };
  return [run(0), run(23)];
};

// ---------- instruments (write into a Float32Array at sample offset) ----------
const tapeWow = (t) => 1 + 0.0022 * Math.sin(2 * Math.PI * 0.42 * t) + 0.0007 * Math.sin(2 * Math.PI * 4.7 * t);

// ---------- sound profiles ----------
// v1-original = the first delivery, kept for reference. v2-clean = default:
// fewer notes, tamed low end, mastered to a safe loudness. Alts = same timing,
// slightly different key, voicings and tone, for future videos.
const V1 = {
  transpose: 0, voices: "full", comp: true, melody: "v1", bass: "v1", ghostHats: 0.35,
  kick: { base: 48, sweep: 100, decay: 7.5, drive: 1.7, gain: 0.75, accBase: 40, accSweep: 120, accDecay: 2.6, accDrive: 2.1, accGain: 0.95, accLen: 1.3 },
  bassGain: 0.26, bassLP: 900, duck: 0.5, fmIndex: 2.4, tine: 0.18, lpScale: 1, swing: 0.58,
  vinyl: 1, sat: 1.25, hp: 32, hpPasses: 1, wash: 0.12, swell: 0.22, rim: false, loudness: null,
};
const V2 = {
  ...V1, voices: "shell", comp: false, melody: null, bass: "simple", ghostHats: 0,
  kick: { base: 56, sweep: 70, decay: 10, drive: 1.2, gain: 0.5, accBase: 52, accSweep: 80, accDecay: 7, accDrive: 1.35, accGain: 0.62, accLen: 0.6 },
  bassGain: 0.14, bassLP: 520, duck: 0.25, fmIndex: 2.0, tine: 0.13, lpScale: 0.95,
  vinyl: 0.8, sat: 1.0, hp: 48, hpPasses: 2, wash: 0.075, swell: 0.13, loudness: -16,
};
const PROFILES = {
  "v1-original": V1,
  "v2-clean": V2,
  "alt-a-warm": { ...V2, transpose: -2, fmIndex: 1.5, tine: 0.07, lpScale: 0.8, vinyl: 1.1, swing: 0.6 },
  "alt-b-bright": { ...V2, transpose: 2, voices: "shell-up", fmIndex: 2.6, tine: 0.2, lpScale: 1.08 },
  "alt-c-dusty": { ...V2, voices: "upper", rim: true, swing: 0.62, melody: "sparse", vinyl: 1.3, lpScale: 0.88 },
};
export const DEFAULT_VERSION = "v2-clean";
let P = V1;

// FM electric piano (Rhodes-ish): bell tine + warm body, slight detune L/R.
let NOTE_COUNT = 0;
const rhodes = (L, R, startSec, midi, dur, vel, pan = 0.5) => {
  NOTE_COUNT++;
  const f = mtof(midi); const s0 = S(startSec); const n = S(dur + 1.8);
  let pc = 0, pm = 0, pt = 0;
  for (let j = 0; j < n; j++) {
    const i = s0 + j; if (i < 0 || i >= L.length) continue;
    const t = j / SR; const gt = startSec + t; const w = tapeWow(gt);
    const fc = f * w;
    pc += (2 * Math.PI * fc) / SR; pm += (2 * Math.PI * fc) / SR; pt += (2 * Math.PI * fc * 14) / SR;
    const idx = 0.35 + P.fmIndex * Math.exp(-t * 5) * vel;
    const release = t > dur ? Math.exp(-(t - dur) * 4.5) : 1;
    const env = Math.min(1, t / 0.004) * (0.55 * Math.exp(-t * 0.9) + 0.45 * Math.exp(-t * 3.2)) * release;
    const tine = Math.sin(pt) * Math.exp(-t * 28) * P.tine * vel;
    const v = (Math.sin(pc + idx * Math.sin(pm)) + tine) * env * vel * 0.16;
    const trem = 1 + 0.12 * Math.sin(2 * Math.PI * 4.2 * gt);
    L[i] += v * (1 - pan) * 2 * trem * 0.5 + v * 0.5; R[i] += v * pan * 2 * (2 - trem) * 0.5 + v * 0.5;
  }
};

// Upright-ish bass: sine + soft 2nd/3rd, plucked envelope with finger thump.
const bass = (M, startSec, midi, dur, vel = 1) => {
  NOTE_COUNT++;
  const f = mtof(midi); const s0 = S(startSec); const n = S(dur + 0.25); let ph = 0;
  for (let j = 0; j < n; j++) {
    const i = s0 + j; if (i < 0 || i >= M.length) continue;
    const t = j / SR; ph += (2 * Math.PI * f * tapeWow(startSec + t)) / SR;
    const rel = t > dur ? Math.exp(-(t - dur) * 25) : 1;
    const env = Math.min(1, t / 0.006) * (0.65 * Math.exp(-t * 2.2) + 0.35) * rel;
    const v = Math.sin(ph) + 0.35 * Math.sin(2 * ph) * Math.exp(-t * 6) + 0.12 * Math.sin(3 * ph) * Math.exp(-t * 10);
    M[i] += Math.tanh(v * 1.3) * env * vel * P.bassGain + rn() * Math.exp(-t * 120) * 0.04 * vel;
  }
};

// Kick. size: 1 = groove kick, 2 = accent thump.
const kick = (M, startSec, vel = 1, size = 1) => {
  const k = P.kick; const acc = size > 1;
  const s0 = S(startSec); const n = S(acc ? k.accLen : 0.45); let ph = 0;
  for (let j = 0; j < n; j++) {
    const i = s0 + j; if (i < 0 || i >= M.length) continue;
    const t = j / SR;
    const f = (acc ? k.accBase : k.base) + (acc ? k.accSweep : k.sweep) * Math.exp(-t * (acc ? 22 : 30));
    ph += (2 * Math.PI * f) / SR;
    const body = Math.sin(ph) * Math.exp(-t * (acc ? k.accDecay : k.decay));
    const click = rn() * Math.exp(-t * 400) * 0.25;
    const knock = Math.sin(2 * Math.PI * 210 * t) * Math.exp(-t * 40) * 0.25;
    M[i] += Math.tanh((body + click + knock) * (acc ? k.accDrive : k.drive)) * vel * (acc ? k.accGain : k.gain);
  }
};

const snare = (M, V, startSec, vel = 1, rim = false) => {
  const s0 = S(startSec); const n = S(rim ? 0.12 : 0.32);
  const noise = new Float32Array(n); for (let j = 0; j < n; j++) noise[j] = rn();
  const bp = biquad(noise, "bp", rim ? 2600 : 1900, rim ? 2.5 : 0.9);
  for (let j = 0; j < n; j++) {
    const i = s0 + j; if (i < 0 || i >= M.length) continue;
    const t = j / SR;
    const body = Math.sin(2 * Math.PI * (rim ? 820 : 185) * t) * Math.exp(-t * (rim ? 70 : 28)) * (rim ? 0.5 : 0.6);
    const v = (bp[j] * Math.exp(-t * (rim ? 45 : 17)) * (rim ? 0.9 : 1.4) + body) * vel * 0.5;
    M[i] += v; if (V) V[i] += v * 0.6; // reverb send
  }
};

const hat = (M, startSec, vel = 1, open = false) => {
  const s0 = S(startSec); const n = S(open ? 0.35 : 0.06);
  const noise = new Float32Array(n); for (let j = 0; j < n; j++) noise[j] = rn();
  const hp = biquad(noise, "hp", 7000, 0.8);
  for (let j = 0; j < n; j++) {
    const i = s0 + j; if (i < 0 || i >= M.length) continue;
    const t = j / SR; M[i] += hp[j] * Math.exp(-t * (open ? 9 : 75)) * vel * 0.16;
  }
};

// Woodblock "tok": small accent marker that points at a line item.
const tok = (M, V, startSec, vel = 1, pitch = 1) => {
  const s0 = S(startSec); const n = S(0.18);
  for (let j = 0; j < n; j++) {
    const i = s0 + j; if (i < 0 || i >= M.length) continue;
    const t = j / SR;
    const v = (Math.sin(2 * Math.PI * 980 * pitch * t) * 0.7 + Math.sin(2 * Math.PI * 1530 * pitch * t) * 0.3) * Math.exp(-t * 38) * vel * 0.22;
    M[i] += v; V[i] += v * 0.5;
  }
};

// Washy lo-fi cymbal + reversed swell into a big accent.
const wash = (M, V, startSec, vel = 1) => {
  const s0 = S(startSec); const n = S(2.2);
  const noise = new Float32Array(n); for (let j = 0; j < n; j++) noise[j] = rn();
  const f = biquad(biquad(noise, "hp", 3500, 0.7), "lp", 9000, 0.7);
  for (let j = 0; j < n; j++) {
    const i = s0 + j; if (i < 0 || i >= M.length) continue;
    const t = j / SR; const v = f[j] * Math.exp(-t * 2.4) * Math.min(1, t / 0.003) * vel * P.wash;
    M[i] += v; V[i] += v * 0.8;
  }
};
const swell = (M, endSec, len, vel = 1) => {
  const n = S(len); const s0 = S(endSec) - n;
  const noise = new Float32Array(n); for (let j = 0; j < n; j++) noise[j] = rn();
  const f = biquad(noise, "lp", (t) => 600 + 7000 * Math.pow(t / len, 2), 1.2);
  for (let j = 0; j < n; j++) {
    const i = s0 + j; if (i < 0 || i >= M.length) continue;
    const p = j / n; M[i] += f[j] * Math.pow(p, 2.6) * vel * P.swell;
  }
};

const vinyl = (L, R, amt = 1) => {
  let lp = 0;
  for (let i = 0; i < L.length; i++) {
    lp = lp * 0.93 + rn() * 0.07;
    let v = lp * 0.010 * amt;
    if (rnd() < 7 / SR) v += rn() * 0.18 * amt;
    if (rnd() < 60 / SR) v += rn() * 0.03 * amt;
    L[i] += v; R[i] += v * 0.9;
  }
};

// ---------- harmony (home key: F major, lo-fi jazz voicings) ----------
const C = {
  Fmaj9: { b: 41, v: [57, 60, 64, 67, 72] },
  Dm9: { b: 38, v: [53, 57, 60, 64, 69] },
  Gm9: { b: 43, v: [58, 62, 65, 69, 74] },
  C13: { b: 36, v: [58, 64, 69, 74] },
  C7sus: { b: 36, v: [58, 62, 65, 70] },
  Bbmaj9: { b: 46, v: [57, 60, 62, 65, 69] },
  A7b9: { b: 45, v: [55, 61, 64, 70] },
  Am7: { b: 45, v: [55, 60, 64, 67] },
  D7b9: { b: 38, v: [54, 60, 63, 66] },
  Ebmaj7: { b: 39, v: [55, 58, 62, 65] },
  Fadd13: { b: 41, v: [57, 62, 64, 67, 72] },
};
// Pick the notes a profile plays from a chord. "shell" = 3 notes (3rd/7th/9th or
// 7th/3rd/13th), "shell-up" = same with the lowest note an octave up,
// "upper" = the 3 upper voices (airier). "full" = every voicing note (v1).
const voicing = (v) => {
  const shell = v.length >= 5 ? [v[0], v[2], v[3]] : [v[0], v[1], v[2]];
  if (P.voices === "shell") return shell;
  if (P.voices === "shell-up") return [shell[1], shell[2], shell[0] + 12];
  if (P.voices === "upper") return v.length >= 5 ? [v[2], v[3], v[4]] : [v[1], v[2], v[3]];
  return v;
};

// ---------- sections ("batches") ----------
// chords: [beat, chordName, beatsLong]. accents: [beat, "big" | "small"] — the
// beats where the frame's main point lands (cue sheet for the visuals).
const SECTIONS = [
  { id: "01-hook", beats: 8, groove: "intro", lp: [1400, 7000], vinyl: 1.3,
    chords: [[0, "Dm9", 4], [4, "Gm9", 2], [6, "A7b9", 2]],
    accents: [[0, "big"], [4, "big"]] },
  { id: "02-stat", beats: 6, groove: "half", lp: [5200, 6000], vinyl: 1,
    chords: [[0, "Bbmaj9", 4], [4, "A7b9", 2]],
    accents: [[0, "big"], [4, "small"]] },
  { id: "03-what-we-do", beats: 8, groove: "groove", lp: [6500, 7500], vinyl: 0.9,
    chords: [[0, "Gm9", 4], [4, "C13", 4]],
    accents: [[0, "big"], [4, "small"], [5, "small"], [6, "small"], [7, "small"]] },
  { id: "04-setup-499", beats: 16, groove: "walk", lp: [7000, 7000], vinyl: 0.8,
    chords: [[0, "Fmaj9", 4], [4, "Dm9", 4], [8, "Gm9", 4], [12, "C13", 2], [14, "C7sus", 2]],
    accents: [[0, "big"], [4, "small"], [6, "small"], [8, "small"], [10, "small"], [12, "big"]] },
  { id: "05-monthly-350", beats: 20, groove: "groove", melody: true, lp: [7500, 8000], vinyl: 0.8,
    chords: [[0, "Bbmaj9", 4], [4, "Am7", 2], [6, "D7b9", 2], [8, "Gm9", 4], [12, "C13", 4], [16, "Fmaj9", 4]],
    accents: [[0, "big"], [4, "small"], [6, "small"], [8, "small"], [10, "small"], [12, "small"], [14, "small"], [16, "big"]] },
  { id: "06-price-math", beats: 10, groove: "sparse", lp: [5500, 6500], vinyl: 1,
    chords: [[0, "Dm9", 4], [4, "Gm9", 4], [8, "C13", 2]],
    accents: [[0, "big"], [3, "big"], [6, "big"], [9, "small"]] },
  { id: "07-owner-control", beats: 10, groove: "groove", lp: [6500, 7000], vinyl: 0.9,
    chords: [[0, "Bbmaj9", 4], [4, "Am7", 2], [6, "Gm9", 2], [8, "C13", 2]],
    accents: [[0, "small"], [3, "small"], [6, "small"], [8, "big"]] },
  { id: "08-cta", beats: 8, groove: "outro", lp: [7500, 3000], vinyl: 1.2,
    chords: [[0, "Fmaj9", 4], [4, "Fadd13", 4]],
    accents: [[0, "big"], [4, "big"]] },
];

const swingPos = (b) => {
  const frac = b - Math.floor(b);
  if (Math.abs(frac - 0.5) < 1e-6) return Math.floor(b) + P.swing; // swung 8th
  if (Math.abs(frac - 0.75) < 1e-6) return Math.floor(b) + 0.81; // swung 16th
  if (Math.abs(frac - 0.25) < 1e-6) return Math.floor(b) + 0.27;
  return b;
};
const human = () => rn() * 0.006;

const renderSection = (sec) => {
  const lenSec = sec.beats * BEAT + TAIL;
  const N = S(lenSec);
  const L = new Float32Array(N), R = new Float32Array(N);
  const drums = new Float32Array(N), bassBus = new Float32Array(N), send = new Float32Array(N);
  const keysL = new Float32Array(N), keysR = new Float32Array(N);
  const t = (beat) => swingPos(beat) * BEAT;
  const end = sec.beats;
  const tr = P.transpose;
  const kickTimes = [];
  const K = (beat, vel, size = 1) => { kick(drums, t(beat) + (size > 1 ? 0 : human()), vel, size); kickTimes.push({ s: t(beat), d: size > 1 ? 0.6 : 0.35 }); };

  // Is a beat inside the "drop" right before a big accent?
  const inDrop = (beat) => sec.accents.some(([b, ty]) => ty === "big" && b > 0 && beat >= b - 0.5 && beat < b);

  // --- groove ---
  for (let b = 0; b < end; b += 0.25) {
    if (inDrop(b)) continue;
    const inBar = b % 4;
    const g = sec.groove;
    if (g === "intro") {
      if (b >= 2 && b % 0.5 === 0) hat(drums, t(b) + human(), b % 1 ? 0.5 : 0.25);
      continue;
    }
    if (g === "half") {
      if (inBar === 0) K(b, 0.8);
      if (inBar === 2) snare(drums, send, t(b) + human(), 0.85, P.rim);
      if (b % 1 === 0) hat(drums, t(b) + human(), 0.45);
      if (b % 1 === 0.5) hat(drums, t(b) + human(), 0.25);
      continue;
    }
    if (g === "sparse") {
      if (inBar === 0 || inBar === 2.5) K(b, 0.75);
      if (inBar === 1 || inBar === 3) snare(drums, send, t(b) + human(), 0.75, true);
      if (b % 1 === 0.5) hat(drums, t(b) + human(), 0.4);
      continue;
    }
    // groove / walk / outro: boom-bap with swung hats (+ ghost 16ths in v1)
    const outroStop = g === "outro" && b >= 4;
    if (outroStop) continue;
    if (inBar === 0 || inBar === 2.5 || (inBar === 1.75 && g !== "walk")) K(b, inBar === 1.75 ? 0.55 : 0.85);
    if (g === "walk" && inBar === 2.75) K(b, 0.45);
    if (inBar === 1 || inBar === 3) snare(drums, send, t(b) + human(), 0.9, P.rim);
    if (b % 0.5 === 0) hat(drums, t(b) + human(), b % 1 ? 0.55 : 0.32, inBar === 3.5 && b % 8 === 7.5);
    else if (rnd() < P.ghostHats) hat(drums, t(b) + human(), 0.14);
  }

  // --- accents: the "look here" thumps ---
  for (const [b, type] of sec.accents) {
    if (type === "big") {
      K(b, 1, 2);
      wash(drums, send, t(b), 0.9);
      if (b > 0) swell(drums, t(b), BEAT * 0.5, 0.9);
      snare(drums, send, t(b) + 0.004, 0.35);
    } else {
      K(b, 0.95, 1);
      tok(drums, send, t(b), 0.9, b % 2 ? 1.12 : 1);
    }
  }

  // --- harmony ---
  for (const [b, name, len] of sec.chords) {
    const ch = C[name];
    const notes = voicing(ch.v).map((m) => m + tr);
    const root = ch.b + tr;
    const lastChord = b + len >= end;
    const dur = len * BEAT - 0.08 + (lastChord ? 0.9 : 0);
    // lazy strum, low to high
    notes.forEach((m, k) => rhodes(keysL, keysR, t(b) + k * 0.018 + human(), m, dur, 0.85 - k * 0.04, 0.3 + k * 0.1));
    // comping re-hit on the "and" of 2 for longer chords (v1 only)
    if (P.comp && len >= 4 && sec.groove !== "intro" && sec.groove !== "outro" && !inDrop(b + 1.5)) {
      notes.slice(1).forEach((m, k) => rhodes(keysL, keysR, t(b + 1.5) + k * 0.012, m, BEAT * 0.9, 0.42, 0.4 + k * 0.08));
    }
    // bass line
    if (P.bass === "simple") {
      bass(bassBus, t(b), root, len * BEAT * 0.9, 0.95); // one held root per chord
    } else if (sec.groove === "walk") {
      const steps = [0, 7, 12, 10];
      for (let k = 0; k < len; k++) bass(bassBus, t(b + k), root + steps[k % 4] - (k % 4 === 2 ? 12 : 0), BEAT * 0.85, k === 0 ? 1 : 0.8);
    } else if (sec.groove === "intro") {
      bass(bassBus, t(b), root, len * BEAT * 0.95, 0.9);
    } else {
      bass(bassBus, t(b), root, BEAT * 1.4, 1);
      if (len >= 4 && !inDrop(b + 2.5)) bass(bassBus, t(b + 2.5), root + 7, BEAT * 0.45, 0.7);
      if (len >= 4 && !inDrop(b + 3.5)) bass(bassBus, t(b + 3.5), root + (b + len >= end ? 0 : 5), BEAT * 0.4, 0.6);
    }
  }

  // Rhodes melody for the monthly-value section: full motif (v1) or 3 notes (alt-c).
  if (sec.melody && P.melody) {
    const motif = P.melody === "v1"
      ? [[1, 72, 0.5], [1.5, 74, 0.5], [2, 77, 1], [3.5, 76, 0.5], [9, 77, 0.5], [9.5, 79, 0.5], [10, 81, 1.2], [13, 79, 0.5], [13.5, 77, 0.5], [14, 74, 1.5], [17, 72, 0.5], [17.5, 74, 0.5], [18, 76, 1.8]]
      : [[2, 77, 1.6], [10, 81, 1.6], [18, 76, 2]];
    for (const [b, m, d] of motif) if (!inDrop(b)) rhodes(keysL, keysR, t(b) + human(), m + tr, d * BEAT, 0.7, 0.62);
  }

  // --- mix ---
  // Sidechain: keys + bass duck under every kick.
  const duck = new Float32Array(N).fill(1);
  for (const { s, d } of kickTimes) {
    const s0 = S(s); const n = S(d);
    for (let j = 0; j < n && s0 + j < N; j++) duck[s0 + j] = Math.min(duck[s0 + j], 1 - P.duck * Math.exp(-(j / SR) / (d * 0.35)));
  }
  const keysMono = new Float32Array(N);
  for (let i = 0; i < N; i++) { keysMono[i] = (keysL[i] + keysR[i]) * 0.5; send[i] += keysMono[i] * 0.55; }
  const [rvL, rvR] = reverb(send, 0.86, 0.4);
  const bassLP = biquad(bassBus, "lp", P.bassLP, 0.8);
  const [lpLo, lpHi] = sec.lp.map((x) => x * P.lpScale);
  const secLen = sec.beats * BEAT;
  const cutoff = (tt) => lpLo + (lpHi - lpLo) * Math.min(1, tt / secLen);
  for (let i = 0; i < N; i++) {
    const d = duck[i];
    L[i] = keysL[i] * d + bassLP[i] * d + drums[i] + rvL[i] * 0.9;
    R[i] = keysR[i] * d + bassLP[i] * d + drums[i] * 0.97 + rvR[i] * 0.9;
  }
  vinyl(L, R, sec.vinyl * P.vinyl);
  // Lo-fi tone: moving lowpass, rumble highpass (steeper in v2), tape saturation, tail fade.
  let outL = biquad(L, "lp", cutoff, 0.75), outR = biquad(R, "lp", cutoff, 0.75);
  for (let k = 0; k < P.hpPasses; k++) { outL = biquad(outL, "hp", P.hp, 0.7); outR = biquad(outR, "hp", P.hp, 0.7); }
  for (let i = 0; i < N; i++) {
    const tt = i / SR;
    const fade = tt > secLen ? Math.max(0, 1 - (tt - secLen) / TAIL) ** 1.5 : 1;
    outL[i] = Math.tanh(outL[i] * P.sat) * fade;
    outR[i] = Math.tanh(outR[i] * P.sat) * fade;
  }
  return [outL, outR];
};

// ---------- render a set, normalize together, stitch ----------
const hashSeed = (str) => [...str].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

// Integrated loudness (LUFS) and true peak (dBTP) of a wav, via ffmpeg ebur128.
const measure = (file) => {
  const out = execSync(`ffmpeg -nostats -i "${file}" -af ebur128=peak=true -f null - 2>&1`).toString();
  const I = parseFloat(out.match(/I:\s+(-?[\d.]+) LUFS/g).pop().match(/-?[\d.]+/)[0]);
  const TP = parseFloat(out.match(/Peak:\s+(-?[\d.]+) dBFS/g).pop().match(/-?[\d.]+/)[0]);
  return { I, TP };
};

// Look-ahead peak limiter (4 ms look-ahead, smooth attack, 120 ms release), in place.
const limit = (L, R, ceil) => {
  const n = L.length; const la = S(0.004); const rel = Math.exp(-1 / (0.12 * SR));
  const need = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = Math.max(Math.abs(L[i]), Math.abs(R[i])); need[i] = a > ceil ? ceil / a : 1; }
  const minAhead = new Float32Array(n);
  for (let i = 0; i < n; i++) { let m = 1; for (let k = 0; k <= la && i + k < n; k++) if (need[i + k] < m) m = need[i + k]; minAhead[i] = m; }
  let g = 1, acc = 0; const q = [];
  for (let i = 0; i < n; i++) {
    q.push(minAhead[i]); acc += minAhead[i]; if (q.length > la) acc -= q.shift();
    const target = Math.min(minAhead[i], acc / q.length);
    g = target < g ? target : target + (g - target) * rel;
    L[i] *= g; R[i] *= g;
  }
};

const renderSet = ({ version, name, sections, cuesFile, mixFile, seedMode }) => {
  P = PROFILES[version];
  const OUT = path.join(MUSIC, version);
  fs.mkdirSync(OUT, { recursive: true });
  if (seedMode === "set") seed = version === "v1-original" ? 90210 : hashSeed(version + name);
  NOTE_COUNT = 0;
  const rendered = sections.map((s) => {
    if (seedMode === "section") seed = hashSeed(version === "v1-original" ? s.id : version + s.id);
    return { s, audio: renderSection(s) };
  });
  let peak = 0;
  for (const { audio } of rendered) for (const ch of audio) for (const v of ch) peak = Math.max(peak, Math.abs(v));
  let gain = 0.89 / peak; // ~-1 dBFS peak, same gain for every file so levels match

  const totalFrames = sections.reduce((a, s) => a + s.beats * FPB, 0);
  const stitch = (g) => {
    const FL = new Float32Array(S(totalFrames / FPS + TAIL)), FR = new Float32Array(FL.length);
    let frame = 0;
    for (const { s, audio } of rendered) {
      const off = S(frame / FPS);
      for (let i = 0; i < audio[0].length && off + i < FL.length; i++) { FL[off + i] += audio[0][i] * g; FR[off + i] += audio[1][i] * g; }
      frame += s.beats * FPB;
    }
    for (let i = 0; i < FL.length; i++) { FL[i] = Math.max(-0.97, Math.min(0.97, FL[i])); FR[i] = Math.max(-0.97, Math.min(0.97, FR[i])); }
    return [FL, FR];
  };
  // Mastering: raise to the target loudness through a gentle look-ahead peak
  // limiter (ceiling -2 dBFS), and never let the mix's true peak pass -1.5 dBTP.
  let report = "";
  if (P.loudness !== null) {
    const ceiling = Math.pow(10, -2 / 20);
    const applyGain = (g) => { for (const { audio } of rendered) for (const ch of audio) for (let i = 0; i < ch.length; i++) ch[i] *= g; };
    applyGain(gain); gain = 1;
    const tmp = path.join(OUT, ".measure.wav");
    let m;
    for (let pass = 0; pass < 4; pass++) {
      writeWav(tmp, ...stitch(1));
      m = measure(tmp);
      const want = P.loudness - m.I;
      if (Math.abs(want) < 0.2 && m.TP <= -1.5) break;
      if (want > 0) {
        applyGain(Math.pow(10, want / 20));
        for (const { audio } of rendered) limit(audio[0], audio[1], ceiling);
      } else if (m.TP > -1.5 || want < 0) {
        applyGain(Math.pow(10, Math.min(want, -1.5 - m.TP) / 20));
      }
    }
    writeWav(tmp, ...stitch(1));
    m = measure(tmp);
    if (m.TP > -1.5) { applyGain(Math.pow(10, (-1.5 - m.TP) / 20)); writeWav(tmp, ...stitch(1)); m = measure(tmp); }
    fs.unlinkSync(tmp);
    report = ` | ${m.I.toFixed(1)} LUFS, true peak ${m.TP.toFixed(1)} dBTP`;
  }

  let frame = 0;
  const cues = { bpm: BPM, fps: FPS, framesPerBeat: FPB, musicVersion: version, versions: Object.keys(PROFILES), sections: [] };
  for (const { s, audio } of rendered) {
    const [aL, aR] = audio;
    for (let i = 0; i < aL.length; i++) { aL[i] *= gain; aR[i] *= gain; }
    const file = `section-${s.id}.wav`;
    writeWav(path.join(OUT, file), aL, aR);
    cues.sections.push({
      id: s.id, file: `music/${version}/${file}`, startFrame: frame, durationInFrames: s.beats * FPB,
      audioFrames: Math.ceil((aL.length / SR) * FPS), beats: s.beats,
      accents: s.accents.map(([b, type]) => ({ beat: b, frame: Math.round(b * FPB), type })),
    });
    frame += s.beats * FPB;
  }
  writeWav(path.join(OUT, mixFile), ...stitch(1)); // sections are already gained
  cues.totalFrames = totalFrames;
  if (version === DEFAULT_VERSION) fs.writeFileSync(path.resolve(`src/audio/${cuesFile}`), JSON.stringify(cues, null, 2));
  console.log(`[${version} · ${name}] ${sections.length} sections | ${(totalFrames / FPS).toFixed(2)}s @ ${BPM} BPM | ${NOTE_COUNT} keys+bass notes${report}`);
};

// 15-second Reels cutdown: hook -> what we do -> price -> CTA (22 beats = 440f).
const CUT15 = [
  { id: "c15-01-hook", beats: 4, groove: "intro", lp: [2200, 7000], vinyl: 1.2,
    chords: [[0, "Dm9", 2], [2, "Gm9", 2]],
    accents: [[0, "big"], [2, "big"]] },
  { id: "c15-02-what", beats: 4, groove: "groove", lp: [6500, 7500], vinyl: 0.9,
    chords: [[0, "Bbmaj9", 4]],
    accents: [[0, "big"], [1, "small"], [2, "small"], [3, "small"]] },
  { id: "c15-03-price", beats: 8, groove: "walk", lp: [7000, 8000], vinyl: 0.8,
    chords: [[0, "Gm9", 4], [4, "C13", 2], [6, "C7sus", 2]],
    accents: [[0, "big"], [4, "big"], [6, "small"]] },
  { id: "c15-04-cta", beats: 6, groove: "outro", lp: [7500, 3000], vinyl: 1.2,
    chords: [[0, "Fmaj9", 3], [3, "Fadd13", 3]],
    accents: [[0, "big"], [3, "big"]] },
];

// VERSIONS=v2-clean,alt-a-warm (default: every profile). SET=master|c15 (default: both).
const versions = (process.env.VERSIONS || Object.keys(PROFILES).join(",")).split(",");
const only = process.env.SET;
for (const version of versions) {
  if (!PROFILES[version]) throw new Error(`Unknown version ${version}`);
  if (!only || only === "master") renderSet({ version, name: "master", sections: SECTIONS, cuesFile: "cues.json", mixFile: "full-mix.wav", seedMode: "set" });
  if (!only || only === "c15") renderSet({ version, name: "reels-15s", sections: CUT15, cuesFile: "cues-15.json", mixFile: "full-mix-15s.wav", seedMode: "section" });
}

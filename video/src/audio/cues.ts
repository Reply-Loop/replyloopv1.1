import cuesJson from "./cues.json";
import cues15Json from "./cues-15.json";

export type Accent = { beat: number; frame: number; type: "big" | "small" };
export type SectionCue = {
  id: string;
  file: string;
  startFrame: number;
  durationInFrames: number;
  audioFrames: number;
  beats: number;
  accents: Accent[];
};

export type CueSet = {
  bpm: number;
  fps: number;
  framesPerBeat: number;
  totalFrames: number;
  sections: SectionCue[];
};

export const cues = cuesJson as CueSet; // 58s master
export const cues15 = cues15Json as CueSet; // 15s Reels cutdown

export const section = (id: string): SectionCue => {
  const s = [...cues.sections, ...cues15.sections].find((x) => x.id === id);
  if (!s) throw new Error(`No cue section ${id}`);
  return s;
};

// Accent frames (relative to the section start), in order. Visual "hits" land
// ON these frames so the thump in the music points at the main idea.
export const hits = (id: string) => section(id).accents.map((a) => a.frame);
export const FPB = cues.framesPerBeat;

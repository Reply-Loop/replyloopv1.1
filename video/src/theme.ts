import { Easing } from "remotion";

// ReplyLoop visual brand (own assets only): charcoal / ivory / brass, Fraunces + Inter.
export const theme = {
  colors: {
    bg: "#14171A", // deep charcoal base
    bgAlt: "#1B1F23", // brand charcoal
    panel: "#22272C",
    ivory: "#F8F5EF",
    ivoryDim: "rgba(248,245,239,0.62)",
    ivoryFaint: "rgba(248,245,239,0.14)",
    hairline: "rgba(248,245,239,0.10)",
    brass: "#C99A4B", // hero (light brass, readable on charcoal)
    brassDeep: "#8A5F1C", // brand deep brass, for fills/buttons
    brassGlow: "rgba(201,154,75,0.45)",
    ink: "#1B1F23",
    alert: "#D46A5A", // only for "unanswered" state marks
  },
  fonts: {
    display: "Fraunces",
    body: "Inter",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.33, 1, 0.68, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    slow: { damping: 26, stiffness: 60, mass: 1 },
  },
  layout: {
    w: 1080,
    h: 1920,
    gutter: 84, // side margin
    safeTop: 250, // keep clear of Reels/Stories top UI
    safeBottom: 380, // keep clear of Reels caption/CTA UI
  },
  music: { bpm: 100 },
} as const;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

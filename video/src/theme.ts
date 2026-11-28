import { Easing } from "remotion";

/** One theme for the whole film. Brand tokens from the site (src/app/globals.css). */
export const theme = {
  colors: {
    ivory: "#F8F5EF",
    ivoryDeep: "#EFE6D6",
    charcoal: "#1B1F23",
    slate: "#4A4F55",
    mist: "#C9C4BA",
    brass: "#8A5F1C", // THE hero colour: at most one brass element leads per frame
    brassLight: "#C49A5A",
    brassShadow: "#5C3E12",
    brassLine: "#B8894A", // brass on charcoal (decorative line only, never text)
    warm: "#FFE9C4",
  },
  fonts: { display: "Fraunces", body: "Inter" },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    draw: Easing.bezier(0.45, 0, 0.2, 1),
  },
  // Calm brand: slower, well-damped springs (no bounce).
  spring: {
    smooth: { damping: 26, stiffness: 70, mass: 1 },
    gentle: { damping: 30, stiffness: 50, mass: 1.1 },
  },
} as const;

export const FPS = 30;
export const DURATION_S = 16;
export const WIDTH = 1280;
export const HEIGHT = 720;

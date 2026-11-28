"use client";

import { useSyncExternalStore } from "react";
import { getMotionMode, subscribeMotion, type MotionMode } from "@/lib/motion/state";

export type MotionState = {
  /** "server" until the browser has read the real preference. Treat as static. */
  mode: MotionMode | "server";
  /** Ambient or autoplay motion (rotation, film, idle loops) may run. */
  ambient: boolean;
  /** Scroll-linked motion may run (the visitor drives it). */
  scroll: boolean;
  reduced: boolean;
  paused: boolean;
};

/** Reads the site motion mode. Static on the server and during hydration. */
export function useMotion(): MotionState {
  const mode = useSyncExternalStore<MotionMode | "server">(subscribeMotion, getMotionMode, () => "server");
  return {
    mode,
    ambient: mode === "full",
    scroll: mode === "full" || mode === "paused",
    reduced: mode === "reduce",
    paused: mode === "paused",
  };
}

import { getMotionMode, subscribeMotion } from "@/lib/motion/state";

/**
 * The visitor's own play/pause choice for the brand film, shared by every
 * film on the site and kept for the browser session.
 * true = paused by the visitor, false = play chosen, undefined = no choice
 * (follow the site motion setting and Save-Data).
 * Pausing all motion from the header clears the choice, so that pause always wins.
 */
const KEY = "rl-film-choice";
type Choice = boolean | undefined;

let choice: Choice;
let loaded = false;
const listeners = new Set<() => void>();
let unwatch: (() => void) | null = null;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const v = sessionStorage.getItem(KEY);
    choice = v === "paused" ? true : v === "playing" ? false : undefined;
  } catch {}
}

export function getFilmChoice(): Choice {
  load();
  return choice;
}

export function setFilmChoice(next: Choice) {
  load();
  choice = next;
  try {
    if (next === undefined) sessionStorage.removeItem(KEY);
    else sessionStorage.setItem(KEY, next ? "paused" : "playing");
  } catch {}
  listeners.forEach((l) => l());
}

export function subscribeFilmChoice(cb: () => void) {
  listeners.add(cb);
  if (!unwatch) {
    let last = getMotionMode();
    unwatch = subscribeMotion(() => {
      const mode = getMotionMode();
      if (mode === "paused" && last !== "paused" && getFilmChoice() === false) setFilmChoice(undefined);
      last = mode;
    });
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size && unwatch) {
      unwatch();
      unwatch = null;
    }
  };
}

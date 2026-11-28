/**
 * A visitor's "Pause film" press, shared by every film and kept for the
 * browser session. Only the pause is shared: a "play" press is local to the
 * film it was pressed on (see BrandFilm), so it can never start another film
 * or outlive a later press of the global pause.
 */
const KEY = "rl-film-paused";

let paused: boolean | undefined;
const listeners = new Set<() => void>();

export function getFilmPaused(): boolean {
  if (paused === undefined) {
    try {
      paused = sessionStorage.getItem(KEY) === "1";
    } catch {
      paused = false;
    }
  }
  return paused;
}

export function setFilmPaused(next: boolean) {
  paused = next;
  try {
    if (next) sessionStorage.setItem(KEY, "1");
    else sessionStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

export function subscribeFilmPaused(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

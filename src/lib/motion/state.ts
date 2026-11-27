/**
 * Site-wide motion state.
 *
 * - "reduce": the visitor asked the OS for reduced motion. Posters and stills only,
 *   no pinning, no scrubbing.
 * - "paused": the visitor pressed "Pause motion" (WCAG 2.2.2). Ambient and autoplay
 *   motion stops; scroll-linked motion, which the visitor drives, still follows scroll.
 * - "full": everything allowed (subject to the device tier below).
 *
 * The head script sets html[data-motion] before first paint, so CSS can gate
 * motion with no flash. The store below keeps React in sync with the same source.
 */
export type MotionMode = "reduce" | "paused" | "full";

export const MOTION_STORAGE_KEY = "rl-motion-v1";
const CHANGE_EVENT = "rl-motion-change";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Inline <head> script. Must stay tiny and must not throw. Before first paint it sets:
 * - html[data-motion]: reduce | paused | full (the server renders "static", kept without JS);
 * - html[data-tier]: full | lite, from the same pre-paint tests as getMotionTier()
 *   (Save-Data, device memory < 4 GB, fewer than 4 cores), so CSS before-states can be
 *   scoped to the tier their timelines run on.
 * It also owns the GSAP failure timer (a bundle that fails could not set it): when a page
 * has a GSAP scene ([data-gsap-scene]) or loadGsap() asks for it (window.__rlWatchGsap),
 * and html.rl-gsap-ready has not appeared 3 s later, it adds html.rl-gsap-failed, which
 * voids every CSS before-state so the finished state shows.
 */
export const MOTION_HEAD_SCRIPT = `(function(){try{var d=document.documentElement,w=window,n=navigator,r=w.matchMedia("${REDUCE_QUERY}").matches,p=false;try{p=localStorage.getItem("${MOTION_STORAGE_KEY}")==="paused"}catch(e){}d.setAttribute("data-motion",r?"reduce":p?"paused":"full");var c=n.connection,l=(c&&c.saveData)||(typeof n.deviceMemory=="number"&&n.deviceMemory<4)||(typeof n.hardwareConcurrency=="number"&&n.hardwareConcurrency<4);d.setAttribute("data-tier",l?"lite":"full");var t=0;w.__rlWatchGsap=function(){if(t||d.classList.contains("rl-gsap-ready"))return;t=setTimeout(function(){t=0;if(!d.classList.contains("rl-gsap-ready"))d.classList.add("rl-gsap-failed")},3000)};w.addEventListener("load",function(){if(document.querySelector("[data-gsap-scene]"))w.__rlWatchGsap()})}catch(e){}})()`;

let memoryPaused = false;

function readPaused(): boolean {
  try {
    return window.localStorage.getItem(MOTION_STORAGE_KEY) === "paused";
  } catch {
    return memoryPaused;
  }
}

export function getMotionMode(): MotionMode {
  if (window.matchMedia(REDUCE_QUERY).matches) return "reduce";
  return readPaused() ? "paused" : "full";
}

function applyAttribute(mode: MotionMode) {
  document.documentElement.setAttribute("data-motion", mode);
}

let pauseEpoch = 0;

// A pause pressed in another tab arrives as a storage event. Count it here, in
// one module-level listener registered before any React subscriber, so a local
// film play lapses on it too.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === MOTION_STORAGE_KEY && e.newValue === "paused") pauseEpoch += 1;
  });
}

/**
 * Counts presses of the global pause in this page session. A local "play"
 * (the brand film) records the epoch it was pressed in and lapses as soon as
 * the visitor pauses all motion again, wherever they press it.
 */
export function getPauseEpoch() {
  return pauseEpoch;
}

export function setMotionPaused(paused: boolean) {
  if (paused) pauseEpoch += 1;
  memoryPaused = paused;
  try {
    if (paused) window.localStorage.setItem(MOTION_STORAGE_KEY, "paused");
    else window.localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    // Storage blocked: the choice holds for this page view.
  }
  applyAttribute(getMotionMode());
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY);
  const onChange = () => {
    applyAttribute(getMotionMode());
    callback();
  };
  mq.addEventListener("change", onChange);
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Device tier. Decides how heavy the motion may be, independent of the mode.
 * - "full": WebGL hero and pinned scroll scenes allowed.
 * - "lite": no WebGL; pre-rendered video or stills instead. Phones, Save-Data,
 *   low memory or few cores, or no WebGL.
 */
export type MotionTier = "lite" | "full";

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

let cachedWebGL: boolean | undefined;
function hasWebGL(): boolean {
  if (cachedWebGL !== undefined) return cachedWebGL;
  try {
    const c = document.createElement("canvas");
    cachedWebGL = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    cachedWebGL = false;
  }
  return cachedWebGL;
}

export const FULL_TIER_MIN_WIDTH = 1024;

export function getMotionTier(): MotionTier {
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return "lite";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return "lite";
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return "lite";
  if (window.innerWidth < FULL_TIER_MIN_WIDTH) return "lite";
  if (!hasWebGL()) return "lite";
  return "full";
}

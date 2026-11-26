"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInViewport } from "@/components/motion/useInViewport";
import { useMotion } from "@/components/motion/useMotion";
import { setMotionPaused } from "@/lib/motion/state";
import { cn } from "@/lib/cn";

const SRC_WEBM = "/media/brand-film.webm";
const SRC_MP4 = "/media/brand-film.mp4";
const POSTER = "/media/brand-film-poster.avif";

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
const pageVisible = () => document.visibilityState === "visible";

const noSubscribe = () => () => {};

function prefersSaveData() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return Boolean(nav.connection?.saveData);
}

/**
 * The 16 s brand film (rendered with Remotion, see /video). Decorative and
 * silent: every word in it is also on the page as text.
 *
 * - Markup is a muted, looping, inline <video> with preload="none" and the
 *   frame-0 poster, in a fixed 16:9 box (no layout shift).
 * - Playback is started by script, not the autoplay attribute, so it only runs
 *   while motion is fully on, the film is on screen, and the tab is visible.
 *   Reduced motion, no JS, or the global pause: the poster only, and the video
 *   is never downloaded.
 * - Save-Data starts paused; the visitor can press play.
 * - A pause control sits on the film (the loop runs longer than 5 s).
 */
export function BrandFilm({ className }: { className?: string }) {
  const { mode, ambient, paused: globalPaused } = useMotion();
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const onScreen = useInViewport(box, "0px");
  const visible = useSyncExternalStore(subscribeVisibility, pageVisible, () => false);
  // Save-Data visitors start paused until they press play (true on the server).
  const saveData = useSyncExternalStore(noSubscribe, prefersSaveData, () => true);
  const [override, setOverride] = useState<boolean | undefined>(undefined);
  const localPaused = override ?? saveData;
  const [playing, setPlaying] = useState(false);

  const want = ambient && !localPaused && onScreen && visible;

  useEffect(() => {
    const v = video.current;
    if (!v || !want) return;
    let stopped = false;
    v.play().catch(() => {
      // Autoplay refused (power saver, policy): stay on the poster.
      if (!stopped) setPlaying(false);
    });
    return () => {
      // Off screen, paused, tab hidden, unmounted, or the route hidden by <Activity>.
      stopped = true;
      v.pause();
    };
  }, [want]);

  const controllable = mode === "full" || mode === "paused";
  const pressed = globalPaused || localPaused;

  const toggle = () => {
    if (pressed) {
      if (globalPaused) setMotionPaused(false);
      setOverride(false);
    } else {
      setOverride(true);
    }
  };

  return (
    <div
      ref={box}
      className={cn(
        "relative aspect-video overflow-hidden rounded-2xl border border-rule bg-[#efe8dc] shadow-[0_30px_60px_-30px_rgb(32_33_36/0.35)]",
        className,
      )}
    >
      <video
        ref={video}
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 size-full object-cover"
        poster={POSTER}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={SRC_WEBM} type="video/webm" />
        <source src={SRC_MP4} type="video/mp4" />
      </video>
      {controllable ? (
        <button
          type="button"
          aria-pressed={pressed}
          onClick={toggle}
          className="absolute bottom-3 left-3 inline-flex size-11 items-center justify-center rounded-full border border-rule bg-ivory/85 text-charcoal backdrop-blur hover:border-brass"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden focusable="false" fill="currentColor">
            {pressed || !playing ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
          </svg>
          <span className="sr-only">Pause film</span>
        </button>
      ) : null}
    </div>
  );
}

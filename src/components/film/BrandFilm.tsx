"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useInViewport } from "@/components/motion/useInViewport";
import { useMotion } from "@/components/motion/useMotion";
import { cn } from "@/lib/cn";
import { getFilmChoice, setFilmChoice, subscribeFilmChoice } from "./filmChoice";

const SRC_WEBM = "/media/brand-film.webm";
const SRC_MP4 = "/media/brand-film.mp4";
const POSTER_AVIF = "/media/brand-film-poster.avif";
const POSTER_WEBP = "/media/brand-film-poster.webp";

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
 * - Markup is a muted, looping, inline <video> with preload="none" over the
 *   frame-0 poster (a <picture>: AVIF, WebP fallback), in a fixed 16:9 box.
 * - Playback is started by script, not the autoplay attribute, so it only runs
 *   while the film is on screen and the tab is visible, and only if motion is
 *   fully on or the visitor pressed play. Reduced motion or no JS: the poster
 *   only, and the video is never downloaded.
 * - The global pause and Save-Data start it paused. "Pause film" is this
 *   film's own control (the loop runs longer than 5 s); pressing play here
 *   never changes the site-wide motion setting.
 */
export function BrandFilm({ className }: { className?: string }) {
  const { mode, paused: globalPaused } = useMotion();
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const onScreen = useInViewport(box, "0px");
  const visible = useSyncExternalStore(subscribeVisibility, pageVisible, () => false);
  // Save-Data visitors start paused until they press play (true on the server).
  const saveData = useSyncExternalStore(noSubscribe, prefersSaveData, () => true);
  const choice = useSyncExternalStore(subscribeFilmChoice, getFilmChoice, () => undefined);

  const controllable = mode === "full" || mode === "paused";
  const pressed = choice ?? (globalPaused || saveData);
  const want = controllable && !pressed && onScreen && visible;

  useEffect(() => {
    const v = video.current;
    if (!v || !want) return;
    let stopped = false;
    v.play().catch((err: unknown) => {
      // Autoplay refused (iOS Low Power Mode, policy): show it as paused, so
      // the button reads "play" and the next press plays inside the gesture.
      if (!stopped && err instanceof DOMException && err.name === "NotAllowedError") setFilmChoice(true);
    });
    return () => {
      // Off screen, paused, tab hidden, unmounted, or the route hidden by <Activity>.
      stopped = true;
      v.pause();
    };
  }, [want]);

  const toggle = () => {
    const v = video.current;
    if (pressed) {
      setFilmChoice(false);
      v?.play().catch(() => undefined); // in the click, so autoplay policy allows it
    } else {
      setFilmChoice(true);
      v?.pause();
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
      <picture>
        <source type="image/avif" srcSet={POSTER_AVIF} />
        <img
          src={POSTER_WEBP}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
      <video
        ref={video}
        aria-hidden
        tabIndex={-1}
        className="film-video absolute inset-0 size-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src={SRC_MP4} type="video/mp4" />
        <source src={SRC_WEBM} type='video/webm; codecs="vp9"' />
      </video>
      {controllable ? (
        <button
          type="button"
          aria-pressed={pressed}
          onClick={toggle}
          className="absolute bottom-3 left-3 inline-flex size-11 items-center justify-center rounded-full border border-rule bg-ivory/85 text-charcoal backdrop-blur hover:border-brass"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden focusable="false" fill="currentColor">
            {pressed ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
          </svg>
          <span className="sr-only">Pause film</span>
        </button>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInViewport } from "@/components/motion/useInViewport";
import { useMotion } from "@/components/motion/useMotion";
import { PauseControl } from "@/components/motion/PauseControl";
import { cn } from "@/lib/cn";
import { getPauseEpoch, subscribeMotion } from "@/lib/motion/state";
import { getFilmPaused, setFilmPaused, subscribeFilmPaused } from "./filmChoice";

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
 * - The global pause and Save-Data start it paused. "Pause film" is the
 *   film's own control (the loop runs longer than 5 s). A pause press is
 *   remembered for the session on every film; a play press applies to this
 *   film only, never changes the site-wide setting, and lapses at the next
 *   global pause. Reduced motion turned on mid-play hides the video (poster).
 */
export function BrandFilm({ className }: { className?: string }) {
  const { mode, paused: globalPaused } = useMotion();
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const onScreen = useInViewport(box, "0px");
  const visible = useSyncExternalStore(subscribeVisibility, pageVisible, () => false);
  // Save-Data visitors start paused until they press play (true on the server).
  const saveData = useSyncExternalStore(noSubscribe, prefersSaveData, () => true);
  // A "Pause film" press, shared by every film for the session.
  const filmPaused = useSyncExternalStore(subscribeFilmPaused, getFilmPaused, () => false);
  const epoch = useSyncExternalStore(subscribeMotion, getPauseEpoch, () => 0);
  // A "play" press on this film only, in memory. It lapses at the next global pause.
  const [playEpoch, setPlayEpoch] = useState<number | null>(null);
  // The browser refused autoplay (iOS Low Power Mode): this film, this visit only.
  const [refused, setRefused] = useState(false);

  const controllable = mode === "full" || mode === "paused";
  const localPlay = playEpoch !== null && playEpoch === epoch;
  const pressed = localPlay ? false : filmPaused || globalPaused || saveData || refused;
  const want = controllable && !pressed && onScreen && visible;

  useEffect(() => {
    const v = video.current;
    if (!v || !want) return;
    let stopped = false;
    v.play().catch((err: unknown) => {
      // Show it as paused, so the button reads "play" and the next press plays inside the gesture.
      if (!stopped && err instanceof DOMException && err.name === "NotAllowedError") setRefused(true);
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
      // Local only: the shared "Pause film" stays, so other films stay paused.
      setRefused(false);
      setPlayEpoch(getPauseEpoch());
      v?.play().catch(() => undefined); // in the click, so autoplay policy allows it
    } else {
      setFilmPaused(true);
      setPlayEpoch(null);
      v?.pause();
    }
  };

  return (
    <div
      ref={box}
      className={cn(
        // The frame (brief §8.3.3): 20px radius, 1px rule border, --shadow-3. Its unveil
        // ends with the clip opened past the shadow (.film-frame in src/styles/home.css).
        // The surface behind the poster is the palette's paper shade (no off-palette hex).
        "film-frame reveal-art relative aspect-video overflow-hidden rounded-card border border-rule bg-paper-shade shadow-3",
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
        className={cn("film-video absolute inset-0 size-full object-cover", !controllable && "invisible")}
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
      {controllable ? <PauseControl label="Pause film" pressed={pressed} onToggle={toggle} tone="light" /> : null}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setMotionPaused, getMotionTier } from "@/lib/motion/state";
import { useMotion } from "@/components/motion/useMotion";
import { useInViewport } from "@/components/motion/useInViewport";
import { cn } from "@/lib/cn";
import { LoopStill } from "./LoopStill";
import type { Pointer } from "./LoopScene";

// Client-only, code-split: three.js and R3F never load on phones or for reduced motion.
const LoopCanvas = dynamic(() => import("./LoopCanvas"), { ssr: false });

const LOW_POWER_KEY = "rl-hero-lowpower";

/**
 * Hero object: the sculptural brass loop beside the locked H1.
 * 1. First paint: the SVG still (never the LCP element).
 * 2. After the first interaction (or 7 s), on capable desktops with motion allowed:
 *    the WebGL loop fades in over the still. It turns slowly and leans toward
 *    the cursor (or device tilt where no permission prompt is needed).
 * 3. If the frame rate is too low, it fades back to the still for the session.
 */
export function HeroVisual({ className }: { className?: string }) {
  const { mode, ambient, paused } = useMotion();
  const box = useRef<HTMLDivElement>(null);
  const onScreen = useInViewport(box, "0px");
  const seen = useInViewport(box, "0px", { once: true });
  const pointer = useMemo(() => ({ current: { x: 0, y: 0 } as Pointer }), []);
  const [eligible, setEligible] = useState(false);
  const [shown, setShown] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [failed, setFailed] = useState(false);

  // Decide only after load and a real user gesture (or 7 s), and only while
  // motion is fully on. Paused visitors never download the 3D at all.
  useEffect(() => {
    if (mode !== "full") return;
    let cancelled = false;
    let idle = 0;
    let fallback = 0;
    const decide = () => {
      if (cancelled) return;
      let flagged = false;
      try {
        flagged = sessionStorage.getItem(LOW_POWER_KEY) === "1";
      } catch {}
      setEligible(!flagged && getMotionTier() === "full");
    };
    const start = () => {
      disarm();
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(decide, { timeout: 1500 }) as unknown as number;
    };
    // Clear user intent only: not browser-driven scrolls (anchors, restoration)
    // and not the synthetic pointermove Chrome sends when layout moves under a cursor.
    const onIntent = (e: Event) => {
      if (!e.isTrusted) return;
      if (e.type === "pointermove") {
        const m = e as PointerEvent;
        if (Math.abs(m.movementX) + Math.abs(m.movementY) < 2) return;
      }
      start();
    };
    const EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    const disarm = () => {
      window.clearTimeout(fallback);
      EVENTS.forEach((t) => window.removeEventListener(t, onIntent));
    };
    const arm = () => {
      EVENTS.forEach((t) => window.addEventListener(t, onIntent, { passive: true }));
      fallback = window.setTimeout(start, 7000);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", arm);
      disarm();
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, [mode]);

  // Cursor lean (and device tilt where the browser allows it without a prompt).
  useEffect(() => {
    if (!eligible) return;
    const p = pointer.current;
    const onMove = (e: PointerEvent) => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return;
      pointer.current.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)));
      pointer.current.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.2)));
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      pointer.current.x = Math.max(-1, Math.min(1, e.gamma / 30));
      pointer.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    const needsPermission =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === "function";
    window.addEventListener("pointermove", onMove, { passive: true });
    if (!needsPermission) window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
      p.x = 0;
      p.y = 0;
    };
  }, [eligible, pointer]);

  const onReady = useCallback(() => setShown(true), []);
  const onFail = useCallback(() => setFailed(true), []);
  // The renderer is gone (unmounted or route hidden): show the still until a new one is ready.
  const onTeardown = useCallback(() => setShown(false), []);
  const onLowPower = useCallback(() => {
    // QA override: ?hero=webgl keeps WebGL on software renderers (screenshots).
    if (new URLSearchParams(window.location.search).get("hero") === "webgl") return;
    try {
      sessionStorage.setItem(LOW_POWER_KEY, "1");
    } catch {}
    setLowPower(true);
  }, []);

  // Mount the 3D only once the hero has been seen; a deep link far down the page never pays for it.
  const webgl = eligible && seen && !lowPower && !failed && mode !== "reduce";
  const live = webgl && shown;

  return (
    <div ref={box} className={cn("relative", className)} aria-hidden={!live || undefined}>
      {/* Soft contact shadow on the paper. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[18%] bottom-[14%] h-[12%] rounded-[50%] bg-charcoal/20 blur-2xl"
      />
      <div aria-hidden className={cn("relative transition-opacity duration-[1200ms]", live ? "opacity-0" : "opacity-100")}>
        <LoopStill className="px-[6%] py-[14%]" />
      </div>
      {webgl ? (
        <div aria-hidden className={cn("absolute inset-0 transition-opacity duration-[1400ms]", live ? "opacity-100" : "opacity-0")}>
          <LoopCanvas
            active={ambient && onScreen}
            pointer={pointer}
            onReady={onReady}
            onLowPower={onLowPower}
            onFail={onFail}
            onTeardown={onTeardown}
          />
        </div>
      ) : null}
      {/* Film grain, static (no motion cost). */}
      <div
        aria-hidden
        className="film-grain pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(closest-side,black,transparent)]"
      />
      {live ? (
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setMotionPaused(!paused)}
          className="absolute right-2 bottom-2 inline-flex size-11 items-center justify-center rounded-full border border-rule bg-ivory/80 text-charcoal backdrop-blur hover:border-brass"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden focusable="false" fill="currentColor">
            {paused ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
          </svg>
          <span className="sr-only">Pause motion</span>
        </button>
      ) : null}
    </div>
  );
}

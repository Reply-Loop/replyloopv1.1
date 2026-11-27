"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type TransitionEvent } from "react";
import { setMotionPaused, getMotionTier, heroWebGLForced } from "@/lib/motion/state";
import { useMotion } from "@/components/motion/useMotion";
import { useInViewport } from "@/components/motion/useInViewport";
import { PauseControl } from "@/components/motion/PauseControl";
import { cn } from "@/lib/cn";
import { LoopStill } from "./LoopStill";
import type { Pointer } from "./LoopScene";

// Client-only, code-split: three.js and R3F never load on phones or for reduced motion.
const LoopCanvas = dynamic(() => import("./LoopCanvas"), { ssr: false });

const LOW_POWER_KEY = "rl-hero-lowpower";
/** Clear intent only (brief §8.2): never wheel or touchstart, which are scrolling. */
const INTENT_EVENTS = ["pointermove", "pointerdown", "keydown"] as const;
const IDLE_ARM_MS = 7000;

/**
 * Hero object: the sculptural brass loop beside the locked H1 (brief §8.2).
 * 1. First paint: the SVG still, in a box the 3D canvas shares exactly. Vector art is
 *    never an LCP candidate, so the H1 stays LCP. The contact shadow is a CSS gradient.
 * 2. On a capable desktop with motion fully on, after a pointer or key gesture (or 7 s
 *    idle), and only while the hero is still mostly in view, the WebGL loop loads. It
 *    is framed to the still's silhouette. The canvas fades in over the still (900ms,
 *    ease-soft); only when that has finished does the still fade out (300ms, linear),
 *    so the two never show half-and-half (no ghost). The one-time light sweep follows.
 * 3. If the frame rate is too low, or the renderer fails, the still comes back under
 *    the canvas and the canvas fades out (600ms, ease-inout) for the rest of the session.
 */
export function HeroVisual({ className }: { className?: string }) {
  const { mode, ambient, paused } = useMotion();
  const box = useRef<HTMLDivElement>(null);
  const onScreen = useInViewport(box, "0px");
  const seen = useInViewport(box, "0px", { once: true });
  const pointer = useMemo(() => ({ current: { x: 0, y: 0 } as Pointer }), []);
  // The QA override only reaches the client-only canvas, never the markup, so reading it
  // during hydration cannot cause a mismatch.
  const [forced] = useState(() => typeof window !== "undefined" && heroWebGLForced());
  const [eligible, setEligible] = useState(false);
  // ready: the renderer has drawn; covered: the canvas has finished fading in.
  const [ready, setReady] = useState(false);
  const [covered, setCovered] = useState(false);
  // retiring: falling back to the still; the canvas fades out, then unmounts.
  const [retiring, setRetiring] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [failed, setFailed] = useState(false);

  // Decide only after load and clear intent (or 7 s idle), and only while motion is
  // fully on. Paused visitors never download the 3D at all.
  useEffect(() => {
    if (mode !== "full") return;
    const qa = forced;
    let cancelled = false;
    let idle = 0;
    let fallback = 0;
    const decide = () => {
      if (cancelled) return;
      // A visitor who has already scrolled past half the hero never pays for the 3D.
      const hero = box.current?.closest("section") ?? box.current;
      if (hero && window.scrollY > 0.5 * hero.getBoundingClientRect().height) return;
      let flagged = false;
      try {
        flagged = !qa && sessionStorage.getItem(LOW_POWER_KEY) === "1";
      } catch {}
      setEligible(!flagged && getMotionTier({ forceWebGL: qa }) === "full");
    };
    const start = () => {
      disarm();
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(decide, { timeout: 1500 }) as unknown as number;
    };
    // Trusted events only, and not the synthetic pointermove Chrome sends when layout
    // moves under a resting cursor.
    const onIntent = (e: Event) => {
      if (!e.isTrusted) return;
      if (e.type === "pointermove") {
        const m = e as PointerEvent;
        if (Math.abs(m.movementX) + Math.abs(m.movementY) < 2) return;
      }
      start();
    };
    const disarm = () => {
      window.clearTimeout(fallback);
      INTENT_EVENTS.forEach((t) => window.removeEventListener(t, onIntent));
    };
    const arm = () => {
      INTENT_EVENTS.forEach((t) => window.addEventListener(t, onIntent, { passive: true }));
      fallback = window.setTimeout(start, IDLE_ARM_MS);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", arm);
      disarm();
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, [mode, forced]);

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

  const readyRef = useRef(false);
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);
  const onReady = useCallback(() => setReady(true), []);
  // Fall back: the still is shown again at once (it sits under the canvas), then the canvas
  // fades out. A canvas that never became visible has nothing to fade: it simply unmounts.
  const retire = useCallback(() => {
    setCovered(false);
    if (readyRef.current) setRetiring(true);
  }, []);
  const onFail = useCallback(() => {
    setFailed(true);
    retire();
  }, [retire]);
  const onLowPower = useCallback(() => {
    try {
      sessionStorage.setItem(LOW_POWER_KEY, "1");
    } catch {}
    setLowPower(true);
    retire();
  }, [retire]);
  // The renderer is gone (unmounted, or the route was hidden): the still shows until a new one is ready.
  const onTeardown = useCallback(() => {
    setReady(false);
    setCovered(false);
  }, []);

  // Mount the 3D only once the hero has been seen; a deep link far down the page never pays for it.
  const wanted = eligible && seen && !lowPower && !failed && mode !== "reduce";
  const mounted = wanted || retiring;
  const live = ready && !retiring && mounted;

  // The fade-out normally ends on transitionend; a hidden tab may never send it.
  useEffect(() => {
    if (!retiring) return;
    const t = window.setTimeout(() => {
      setRetiring(false);
      setReady(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, [retiring]);

  const onCanvasFade = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "opacity") return;
    if (live) setCovered(true);
    else if (retiring) {
      setRetiring(false);
      setReady(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* One box for the still and the canvas: the loop fills the column, at most 520px wide. */}
      <div ref={box} className="relative mx-auto w-full max-w-[520px]" aria-hidden={!live || undefined}>
        {/* Contact shadow on the paper: a CSS gradient (never a raster: no LCP candidate, CLS 0). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[16%] bottom-[10%] h-[16%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(27_31_35/0.1),transparent)] blur-[24px]"
        />
        <div
          aria-hidden
          className={cn(
            "relative",
            covered && !retiring ? "opacity-0 transition-opacity duration-300 ease-linear" : "opacity-100",
          )}
        >
          <LoopStill className="px-[6%] py-[8%]" />
        </div>
        {mounted ? (
          <div
            aria-hidden
            onTransitionEnd={onCanvasFade}
            className={cn(
              "absolute inset-0 transition-opacity",
              retiring ? "duration-600 ease-inout" : "duration-[var(--dur-hero)] ease-soft",
              live ? "opacity-100" : "opacity-0",
            )}
          >
            <LoopCanvas
              active={ambient && onScreen && !retiring}
              forced={forced}
              alive={covered && !retiring}
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
          <PauseControl label="Pause motion" pressed={paused} onToggle={() => setMotionPaused(!paused)} tone="light" />
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { createRoot, extend, type ReconcilerRoot } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DirectionalLight, Group, HemisphereLight, Mesh } from "three";
import { LoopScene, type Pointer } from "./LoopScene";

// Register only the three classes this scene renders as JSX. R3F's <Canvas>
// would register the whole THREE namespace and defeat tree-shaking.
extend({ DirectionalLight, Group, HemisphereLight, Mesh });

type Props = {
  active: boolean;
  /** QA override (?hero=webgl): accept a software renderer and skip the low-power probe. */
  forced: boolean;
  /** The swap has finished: the loop may start to move and the light sweep may run. */
  alive: boolean;
  pointer: { current: Pointer };
  onReady: () => void;
  onLowPower: () => void;
  /** The renderer or its assets failed: fall back to the still. */
  onFail: () => void;
  /** The renderer was torn down (unmount, or the route was hidden). */
  onTeardown: () => void;
};

type Callbacks = { current: Omit<Props, "active" | "pointer" | "forced" | "alive"> };

/**
 * Camera framing (brief §8.2): the canvas fills the same box as the SVG still, whose
 * loop spans 88% of the box width (px 6%) in a box 0.5696 × its width tall (py 8%).
 * One world unit (the loop's half-width) is 0.3971 × the box width there, and at a 30°
 * vertical field of view the camera distance that gives the same scale is
 * 0.5696 / (2 · tan 15° · 0.3971) ≈ 2.68, at every box width. Tuned against a pixel
 * diff of the two silhouettes at 1440×900.
 */
export const CAMERA_Z = 2.68;

/**
 * One full configuration, passed on every configure() call. R3F fills in its
 * defaults (dpr [1,2], frameloop "always") for any key left out, so a partial
 * configure({ size }) would silently undo these.
 * failIfMajorPerformanceCaveat: a software renderer refuses the context, so those
 * visitors keep the still (brief §8.2), unless the QA override asks for it.
 */
function baseConfig(forced: boolean) {
  return {
    dpr: [1, 1.5] as [number, number],
    frameloop: "demand" as const,
    gl: {
      antialias: true,
      alpha: true,
      powerPreference: "high-performance" as const,
      premultipliedAlpha: true,
      failIfMajorPerformanceCaveat: !forced,
    },
    camera: { fov: 30, near: 0.1, far: 50, position: [0, 0, CAMERA_Z] as [number, number, number] },
  };
}

function renderScene(
  r: ReconcilerRoot<HTMLCanvasElement>,
  active: boolean,
  forced: boolean,
  alive: boolean,
  pointer: { current: Pointer },
  cb: Callbacks,
) {
  r.render(
    <LoopScene
      active={active}
      forced={forced}
      alive={alive}
      pointer={pointer}
      onReady={() => cb.current.onReady()}
      onLowPower={() => cb.current.onLowPower()}
      onFail={() => cb.current.onFail()}
    />,
  );
}

/**
 * Hosts the WebGL loop via R3F createRoot. Loaded with next/dynamic (ssr:false)
 * on capable desktops only.
 *
 * A fresh <canvas> is created on every mount and removed on cleanup. With Cache
 * Components, <Activity> hides a route instead of unmounting it: the cleanup
 * runs (R3F disposes the renderer and force-loses its WebGL context) but the
 * DOM stays. Reusing that canvas on return would build a renderer on a lost
 * context and throw, so the canvas never outlives its root.
 */
export default function LoopCanvas({ active, forced, alive, pointer, onReady, onLowPower, onFail, onTeardown }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<{ r: ReconcilerRoot<HTMLCanvasElement>; ready: boolean } | null>(null);
  const callbacks = useRef({ onReady, onLowPower, onFail, onTeardown });
  const latest = useRef({ active, forced, alive, pointer });
  useEffect(() => {
    callbacks.current = { onReady, onLowPower, onFail, onTeardown };
    latest.current = { active, forced, alive, pointer };
  });

  useEffect(() => {
    const wrap = host.current;
    if (!wrap) return;
    const el = document.createElement("canvas");
    el.className = "absolute inset-0 size-full";
    el.setAttribute("aria-hidden", "true");
    wrap.appendChild(el);

    let cancelled = false;
    // A lost context (GPU reset, the browser reclaiming contexts) never draws again and
    // its light map is gone: fall back to the still. Cleanup sets cancelled before
    // unmount, whose own forced context loss fires this event too.
    const onLost = () => {
      if (!cancelled) callbacks.current.onFail();
    };
    el.addEventListener("webglcontextlost", onLost);
    const size = () => {
      const box = wrap.getBoundingClientRect();
      return { width: Math.max(1, box.width), height: Math.max(1, box.height), top: 0, left: 0 };
    };

    let r: ReconcilerRoot<HTMLCanvasElement>;
    try {
      r = createRoot(el);
    } catch {
      el.remove();
      callbacks.current.onFail();
      return;
    }
    const entry = { r, ready: false };
    root.current = entry;

    r.configure({ ...baseConfig(latest.current.forced), size: size() })
      .then(() => {
        if (cancelled) return;
        entry.ready = true;
        renderScene(r, latest.current.active, latest.current.forced, latest.current.alive, latest.current.pointer, callbacks);
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onFail();
      });

    const ro = new ResizeObserver(() => {
      if (entry.ready) r.configure({ ...baseConfig(latest.current.forced), size: size() }).catch(() => undefined);
    });
    ro.observe(wrap);

    return () => {
      cancelled = true;
      ro.disconnect();
      el.removeEventListener("webglcontextlost", onLost);
      try {
        r.unmount();
      } catch {
        // Already torn down.
      }
      el.remove();
      root.current = null;
      callbacks.current.onTeardown();
    };
  }, []);

  useEffect(() => {
    const entry = root.current;
    if (entry?.ready) renderScene(entry.r, active, forced, alive, pointer, callbacks);
  }, [active, forced, alive, pointer]);

  return <div ref={host} className="absolute inset-0" aria-hidden />;
}

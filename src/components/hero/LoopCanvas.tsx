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
  pointer: { current: Pointer };
  onReady: () => void;
  onLowPower: () => void;
};

type Callbacks = { current: { onReady: () => void; onLowPower: () => void } };

function renderScene(
  r: ReconcilerRoot<HTMLCanvasElement>,
  active: boolean,
  pointer: { current: Pointer },
  callbacks: Callbacks,
) {
  r.render(
    <LoopScene
      active={active}
      pointer={pointer}
      onReady={() => callbacks.current.onReady()}
      onLowPower={() => callbacks.current.onLowPower()}
    />,
  );
}

/**
 * Hosts the WebGL loop on a bare <canvas> via R3F createRoot. Loaded with
 * next/dynamic (ssr: false) after first paint, on capable desktops only.
 * Unmounting (or <Activity> hiding the route) unmounts the root, which disposes
 * the renderer and frees the GPU context.
 */
export default function LoopCanvas({ active, pointer, onReady, onLowPower }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<ReconcilerRoot<HTMLCanvasElement> | null>(null);
  const callbacks = useRef({ onReady, onLowPower });
  useEffect(() => {
    callbacks.current = { onReady, onLowPower };
  });

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const r = createRoot(el);
    root.current = r;
    let cancelled = false;

    const size = () => {
      const box = el.parentElement?.getBoundingClientRect();
      return { width: box?.width ?? 1, height: box?.height ?? 1, top: 0, left: 0 };
    };

    r.configure({
      size: size(),
      dpr: [1, 1.5],
      frameloop: "demand",
      gl: { antialias: true, alpha: true, powerPreference: "high-performance", premultipliedAlpha: true },
      camera: { fov: 30, near: 0.1, far: 50, position: [0, 0.05, 4.3] },
    }).then(() => {
      if (cancelled) return;
      renderScene(r, active, pointer, callbacks);
    });

    const ro = new ResizeObserver(() => r.configure({ size: size() }));
    if (el.parentElement) ro.observe(el.parentElement);

    return () => {
      cancelled = true;
      ro.disconnect();
      r.unmount();
      root.current = null;
    };
    // The root is created once; prop changes re-render it in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (root.current) renderScene(root.current, active, pointer, callbacks);
  }, [active, pointer]);

  return <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden />;
}

"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  TubeGeometry,
  type DirectionalLight,
  type Group,
  type Texture,
} from "three";
import { crossingCurve, loopCurve, LOOP_TUBE_RADIUS } from "./loopCurve";

export type Pointer = { x: number; y: number };

type SceneProps = {
  /** Ambient motion allowed and the hero is on screen. */
  active: boolean;
  /** QA override (?hero=webgl): skip the low-power probe. */
  forced: boolean;
  pointer: { current: Pointer };
  onReady: () => void;
  onLowPower: () => void;
  onFail: () => void;
};

/**
 * Deep brushed brass (brief §8.2). The brief's starting colour #7E561A is converted to
 * linear space by three.js, where a metal albedo that dark stays a saturated brown
 * (mean saturation 0.77 against the still's 0.56). Tuned with the light map below
 * against the SVG still at 1440×900, pixels of the brass only, at the swap (key light
 * at the start of its sweep): mean HSL saturation 0.564 (still 0.559), top-decile
 * (lightest 10%) saturation 0.35 (not yellow; gate ≤ 0.6), mean lightness 0.345 (still
 * 0.362). ACES filmic at 0.9 measured closer than Neutral (saturation 0.73).
 */
const BRASS = new Color("#9A7644");
/** Enamel ivory, tuned so the band's median colour matches the still's (239, 236, 230). */
const IVORY = new Color("#FBF6EC");
/**
 * The ivory crossing band sits just proud of the tube. 1.035 (range tried 1.03–1.06)
 * reads as an inlay; larger values stand off the surface like tape.
 */
export const BAND_RADIUS_SCALE = 1.035;
/** Tube resolution (brief §8.2: 480×28 → 320×20). */
const TUBULAR_SEGMENTS = 320;
const RADIAL_SEGMENTS = 20;
/** Low-power probe: after this many frames of real motion below FPS_FLOOR, back to the still. */
const PROBE_FRAMES = 45;
const FPS_FLOOR = 50;

type Built = { tube: TubeGeometry; band: TubeGeometry; brass: MeshPhysicalMaterial; enamel: MeshPhysicalMaterial };

/**
 * The reflection light map, built once from a tiny scene of emissive cards (no EXR, no
 * loader): a warm 6×2 key strip up and to the left, a thin ivory rim behind right, and a
 * dark floor card, in a soft warm-grey room. PMREMGenerator.fromScene renders it to a
 * prefiltered cube map; the source meshes are disposed straight after.
 */
function buildLightMap(pmrem: PMREMGenerator): Texture {
  const scene = new Scene();
  scene.background = new Color("#B8AE9F");
  const plane = new PlaneGeometry(1, 1);
  const card = (hex: string, strength: number, w: number, h: number, pos: [number, number, number]) => {
    const m = new Mesh(
      plane,
      new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(strength), side: DoubleSide, toneMapped: false }),
    );
    m.scale.set(w, h, 1);
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    scene.add(m);
    return m;
  };
  const meshes = [
    card("#FFE7C2", 5, 6, 2, [-3.2, 3.4, 3.6]), // warm key strip
    card("#F8F5EF", 1.8, 7, 0.35, [3.6, 1.2, -3.4]), // thin ivory rim
    card("#1B1F23", 1, 10, 10, [0, -3.2, 0]), // dark floor card
  ];
  const env = pmrem.fromScene(scene, 0.04).texture;
  meshes.forEach((m) => (m.material as MeshBasicMaterial).dispose());
  plane.dispose();
  return env;
}

/** User Timing marks for each init step, so a long-task log can be read against them. */
const mark = (step: string) => {
  try {
    performance.mark(`rl-hero:${step}`);
  } catch {}
};

type IdleHandle = { cancel: () => void };
function whenIdle(cb: () => void): IdleHandle {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout: 500 });
    return { cancel: () => window.cancelIdleCallback(id) };
  }
  const id = window.setTimeout(cb, 16);
  return { cancel: () => window.clearTimeout(id) };
}

/**
 * The sculptural loop: deep brushed brass, warm key light, ivory enamel band on the
 * crossing. Built from the same curve as logo B.
 *
 * Init is split across idle callbacks so no single main-thread task is long (brief §8.2):
 * 1. geometry (tube 320×20 and the crossing band) and materials;
 * 2. the light map (PMREM from emissive cards);
 * 3. compileAsync (KHR_parallel_shader_compile where supported).
 * Only then is the first frame drawn and onReady sent.
 */
export function LoopScene({ active, forced, pointer, onReady, onLowPower, onFail }: SceneProps) {
  // R3F state is read through get() so renderer and scene settings are changed outside
  // React's render values.
  const get = useThree((s) => s.get);
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  const group = useRef<Group>(null);
  const key = useRef<DirectionalLight>(null);
  const [built, setBuilt] = useState<Built | null>(null);
  const [compiled, setCompiled] = useState(false);
  const failRef = useRef(onFail);
  useEffect(() => {
    failRef.current = onFail;
  });
  const clock = useRef({ t: 0, sweep: 0, frames: 0, probe: 0, probed: false, readySent: false });

  // Renderer look (brief §8.2): ACES filmic at exposure 0.9, measured against the still.
  useEffect(() => {
    const { gl } = get();
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.9;
  }, [get]);

  // Steps 1 and 2: geometry, then the light map, each in its own idle callback.
  useEffect(() => {
    let disposed = false;
    const res: { made: Built | null; env: Texture | null; pmrem: PMREMGenerator | null } = {
      made: null,
      env: null,
      pmrem: null,
    };
    let step: IdleHandle = whenIdle(() => {
      if (disposed) return;
      const tube = new TubeGeometry(loopCurve(), TUBULAR_SEGMENTS, LOOP_TUBE_RADIUS, RADIAL_SEGMENTS, true);
      tube.computeTangents();
      const band = new TubeGeometry(crossingCurve(), 64, LOOP_TUBE_RADIUS * BAND_RADIUS_SCALE, RADIAL_SEGMENTS, false);
      const brass = new MeshPhysicalMaterial({
        color: BRASS,
        metalness: 1,
        roughness: 0.58,
        anisotropy: 0.5,
        anisotropyRotation: 0,
        envMapIntensity: 1.4,
      });
      const enamel = new MeshPhysicalMaterial({
        color: IVORY,
        metalness: 0,
        roughness: 0.55,
        clearcoat: 0.45,
        clearcoatRoughness: 0.4,
        envMapIntensity: 0.6,
      });
      const made: Built = { tube, band, brass, enamel };
      res.made = made;
      mark("geometry");
      step = whenIdle(() => {
        if (disposed) return;
        try {
          const { gl } = get();
          res.pmrem = new PMREMGenerator(gl);
          res.env = buildLightMap(res.pmrem);
          // Set on each material, not as scene.environment: envMapIntensity applies only to
          // a material's own envMap (scene.environment has scene.environmentIntensity).
          made.brass.envMap = res.env;
          made.enamel.envMap = res.env;
          mark("light-map");
          setBuilt(made);
        } catch {
          // No light map (context trouble): show the still, never a blank canvas.
          failRef.current();
        }
      });
    });
    return () => {
      disposed = true;
      step.cancel();
      res.env?.dispose();
      res.pmrem?.dispose();
      if (res.made) {
        res.made.tube.dispose();
        res.made.band.dispose();
        res.made.brass.dispose();
        res.made.enamel.dispose();
      }
    };
  }, [get]);

  // Step 3: compile the shaders (in parallel where the browser supports it) before the
  // first visible frame, after the meshes have mounted.
  useEffect(() => {
    if (!built) return;
    let cancelled = false;
    const step = whenIdle(() => {
      if (cancelled) return;
      const { gl, scene, camera } = get();
      gl.compileAsync(scene, camera)
        .catch(() => undefined)
        .then(() => {
          if (cancelled) return;
          mark("compiled");
          setCompiled(true);
          invalidate();
        });
    });
    return () => {
      cancelled = true;
      step.cancel();
    };
  }, [built, get, invalidate]);

  // Only render continuously while ambient motion is allowed and the hero is visible.
  useEffect(() => {
    setFrameloop(active && compiled ? "always" : "demand");
    invalidate();
  }, [active, compiled, setFrameloop, invalidate]);

  useFrame((_, delta) => {
    const c = clock.current;
    const g = group.current;
    if (!g || !compiled) return;
    const dt = Math.min(delta, 1 / 20);

    if (!c.readySent) {
      c.readySent = true;
      mark("first-frame");
      onReady();
    }

    // Frame-rate probe over the first frames of real motion (skipped by the QA override).
    if (active && !c.probed && !forced) {
      c.frames += 1;
      c.probe += delta;
      if (c.frames >= PROBE_FRAMES) {
        c.probed = true;
        if (c.frames / c.probe < FPS_FLOOR) onLowPower();
      }
    }

    if (active) c.t += dt;
    // Light catches the edge once as the scene appears (about 2.4 s), then rests.
    c.sweep = Math.min(1, c.sweep + dt / 2.4);
    const e = 1 - Math.pow(1 - c.sweep, 3);
    if (key.current) key.current.position.set(-4.5 + 8 * e, 3.2 - 0.8 * e, 2.6 + 0.6 * e);

    // At t = 0 the loop faces the camera square on, matching the still's silhouette; the
    // slow turn and the cursor lean grow from there.
    const p = pointer.current;
    const ramp = Math.min(1, c.t / 2.5);
    const targetY = ramp * 0.42 * Math.sin(c.t * 0.16) + p.x * 0.1;
    const targetX = ramp * (-0.16 + 0.05 * Math.sin(c.t * 0.21)) - p.y * 0.08;
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, dt * 2.2);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, dt * 2.2);
    g.position.y = ramp * 0.035 * Math.sin(c.t * 0.5);
  });

  return (
    <>
      <hemisphereLight args={["#f6f1e8", "#2b2a28", 0.5]} />
      <directionalLight ref={key} color="#ffe1b8" intensity={1.5} position={[-4.5, 3.2, 2.6]} />
      <directionalLight color="#eef0f2" intensity={0.6} position={[3.5, -1.5, -3]} />
      <group ref={group}>
        {built ? (
          <>
            <mesh geometry={built.tube} material={built.brass} />
            <mesh geometry={built.band} material={built.enamel} />
          </>
        ) : null}
      </group>
    </>
  );
}

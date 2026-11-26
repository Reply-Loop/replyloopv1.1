"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  NeutralToneMapping,
  Color,
  EquirectangularReflectionMapping,
  type Group,
  type DirectionalLight,
  MeshPhysicalMaterial,
  PMREMGenerator,
  TubeGeometry,
} from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { crossingCurve, loopCurve, LOOP_TUBE_RADIUS } from "./loopCurve";

export type Pointer = { x: number; y: number };

type SceneProps = {
  /** Ambient motion allowed and the hero is on screen. */
  active: boolean;
  pointer: { current: Pointer };
  onReady: () => void;
  onLowPower: () => void;
};

const BRASS = new Color("#775628"); // deep, slightly desaturated brass (#8A5F1C family) so it reads brown-brass, not orange
const IVORY = new Color("#E9DCC6");

/**
 * The sculptural loop: deep brushed brass, warm key light, ivory enamel band
 * on the crossing. Built from the same curve as logo B.
 */
export function LoopScene({ active, pointer, onReady, onLowPower }: SceneProps) {
  // R3F state is read through get() so renderer and scene settings are changed
  // outside React's render values.
  const get = useThree((s) => s.get);
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  const group = useRef<Group>(null);
  const key = useRef<DirectionalLight>(null);
  const [envReady, setEnvReady] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const clock = useRef({ t: 0, sweep: 0, frames: 0, probe: 0, probed: false, readySent: false });

  const { tube, band, brass, enamel } = useMemo(() => {
    const tube = new TubeGeometry(loopCurve(), 480, LOOP_TUBE_RADIUS, 28, true);
    tube.computeTangents();
    const band = new TubeGeometry(crossingCurve(), 80, LOOP_TUBE_RADIUS * 1.045, 28, false);
    const brass = new MeshPhysicalMaterial({
      color: BRASS,
      metalness: 1,
      roughness: 0.52,
      anisotropy: 0.55,
      anisotropyRotation: 0,
      envMapIntensity: 0.8,
    });
    const enamel = new MeshPhysicalMaterial({
      color: IVORY,
      metalness: 0,
      roughness: 0.55,
      clearcoat: 0.45,
      clearcoatRoughness: 0.4,
      envMapIntensity: 0.7,
    });
    return { tube, band, brass, enamel };
  }, []);

  // Renderer look: filmic tone curve, a touch warm.
  useEffect(() => {
    const { gl } = get();
    // Khronos PBR Neutral keeps the brass hue (ACES pushes it toward yellow gold).
    gl.toneMapping = NeutralToneMapping;
    gl.toneMappingExposure = 0.95;
  }, [get]);

  // Self-hosted CC0 studio light (public/hdri). Reflections only; never shown as a background.
  useEffect(() => {
    let disposed = false;
    const { gl } = get();
    const pmrem = new PMREMGenerator(gl);
    new EXRLoader().load("/hdri/studio-512.exr", (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.mapping = EquirectangularReflectionMapping;
      const env = pmrem.fromEquirectangular(tex).texture;
      tex.dispose();
      get().scene.environment = env;
      setEnvReady(true);
      invalidate();
    });
    return () => {
      disposed = true;
      const { scene } = get();
      scene.environment?.dispose();
      scene.environment = null;
      pmrem.dispose();
    };
  }, [get, invalidate]);

  useEffect(
    () => () => {
      tube.dispose();
      band.dispose();
      brass.dispose();
      enamel.dispose();
    },
    [tube, band, brass, enamel],
  );

  // Compile shaders off the main thread where the browser supports it
  // (KHR_parallel_shader_compile), before the first frame is drawn.
  useEffect(() => {
    if (!envReady) return;
    let cancelled = false;
    const { gl, scene, camera } = get();
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setCompiled(true);
      });
    return () => {
      cancelled = true;
    };
  }, [envReady, get]);

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
      onReady();
    }

    // Frame-rate probe over the first ~90 frames of real motion.
    if (active && !c.probed) {
      c.frames += 1;
      c.probe += delta;
      if (c.frames >= 90) {
        c.probed = true;
        if (c.frames / c.probe < 40) onLowPower();
      }
    }

    if (active) c.t += dt;
    // Light catches the edge once as the scene appears (about 2.4 s), then rests.
    c.sweep = Math.min(1, c.sweep + dt / 2.4);
    const e = 1 - Math.pow(1 - c.sweep, 3);
    if (key.current) key.current.position.set(-4.5 + 8 * e, 3.2 - 0.8 * e, 2.6 + 0.6 * e);

    const p = pointer.current;
    const targetY = 0.42 * Math.sin(c.t * 0.16) + p.x * 0.1;
    const targetX = -0.16 + 0.05 * Math.sin(c.t * 0.21) - p.y * 0.08;
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, dt * 2.2);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, dt * 2.2);
    g.position.y = 0.035 * Math.sin(c.t * 0.5);
  });

  return (
    <>
      <hemisphereLight args={["#f6f1e8", "#2b2a28", 0.5]} />
      <directionalLight ref={key} color="#ffe1b8" intensity={1.9} position={[-4.5, 3.2, 2.6]} />
      <directionalLight color="#eef0f2" intensity={0.6} position={[3.5, -1.5, -3]} />
      <group ref={group} rotation={[-0.16, 0, 0]}>
        <mesh geometry={tube} material={brass} />
        <mesh geometry={band} material={enamel} />
      </group>
    </>
  );
}

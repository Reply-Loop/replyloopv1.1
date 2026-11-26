"use client";

import { useEffect, useRef, useState } from "react";
import { useInViewport } from "@/components/motion/useInViewport";
import { useMotion } from "@/components/motion/useMotion";
import { LOOP_PATH, LOOP_POINTS, LOOP_VIEWBOX } from "@/lib/loop/geometry.generated";
import { cn } from "@/lib/cn";

type Station = { name: string; body: string; s: number };

/**
 * Four stations, a quarter of the loop apart (s = arc-length fraction from the
 * crossing, in the path's travel direction): top-left, bottom-left, top-right,
 * bottom-right. The list below uses the same two-column order.
 */
const STATIONS: Station[] = [
  { name: "Ask", body: "Every customer gets the same review link and the same ask.", s: 0.625 },
  { name: "Review", body: "A customer writes on Google, in their own words.", s: 0.875 },
  { name: "Reply", body: "We answer in your voice. A hard review waits until you have seen the reply.", s: 0.125 },
  { name: "Learn", body: "What customers mention shapes your next posts and your monthly workbook.", s: 0.375 },
];

const LAP_SECONDS = 16;
const TRAIL = 0.1; // fraction of the loop the brass trail covers

const at = (s: number) => {
  const n = LOOP_POINTS.length;
  const [x, y] = LOOP_POINTS[Math.round((((s % 1) + 1) % 1) * n) % n];
  return { x: x * 100, y: -y * 100 }; // LOOP_POINTS is y-up; SVG is y-down
};

/**
 * The trust loop on /services/review-replies: Ask, Review, Reply, Learn.
 * The words are an HTML list; the drawing is decorative (aria-hidden).
 * With motion fully on and the diagram on screen, a bead travels the loop and
 * the step it passes lights up. Otherwise it rests at Ask.
 */
export function TrustLoop({ className }: { className?: string }) {
  const { ambient } = useMotion();
  const box = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const bead = useRef<SVGCircleElement>(null);
  const onScreen = useInViewport(box, "0px");
  const [active, setActive] = useState<number | null>(null);
  const run = ambient && onScreen;

  useEffect(() => {
    const p = path.current;
    const t = trail.current;
    const b = bead.current;
    if (!run || !p || !t || !b) return;
    const len = p.getTotalLength();
    t.style.strokeDasharray = `${len * TRAIL} ${len}`;
    let raf = 0;
    let last = performance.now();
    let s = STATIONS[0].s;
    let current = -1;
    const frame = (now: number) => {
      s = (s + Math.min(now - last, 50) / 1000 / LAP_SECONDS) % 1;
      last = now;
      const pt = p.getPointAtLength(s * len);
      b.setAttribute("cx", pt.x.toFixed(2));
      b.setAttribute("cy", pt.y.toFixed(2));
      t.style.strokeDashoffset = String(-(s - TRAIL) * len);
      // The step whose quarter the bead is in, starting just before each station.
      const idx = STATIONS.reduce((best, st, i) => {
        const d = (((s - st.s + 0.04) % 1) + 1) % 1;
        const bd = (((s - STATIONS[best].s + 0.04) % 1) + 1) % 1;
        return d < bd ? i : best;
      }, 0);
      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      setActive(null);
      const home = at(STATIONS[0].s);
      b.setAttribute("cx", String(home.x));
      b.setAttribute("cy", String(home.y));
      t.style.strokeDasharray = "";
      t.style.strokeDashoffset = "";
    };
  }, [run]);

  const home = at(STATIONS[0].s);

  return (
    <div ref={box} className={cn("rounded-2xl border border-rule bg-ivory p-6 sm:p-8", className)}>
      <svg aria-hidden focusable="false" viewBox={LOOP_VIEWBOX} className="mx-auto block h-auto w-full max-w-xl overflow-visible">
        <path ref={path} d={LOOP_PATH} fill="none" className="stroke-rule" strokeWidth={2.2} />
        <path
          ref={trail}
          d={LOOP_PATH}
          fill="none"
          className={cn("stroke-brass transition-opacity duration-500", run ? "opacity-100" : "opacity-0")}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {STATIONS.map((st, i) => {
          const { x, y } = at(st.s);
          const on = active === i;
          return (
            <g key={st.name}>
              <circle
                cx={x}
                cy={y}
                r={on ? 11 : 9.5}
                className={cn(
                  "transition-[r,fill,stroke] duration-500",
                  on ? "fill-brass stroke-brass" : "fill-ivory stroke-brass",
                )}
                strokeWidth={1.4}
              />
              <text
                x={x}
                y={y}
                dy="0.35em"
                textAnchor="middle"
                className={cn("font-serif text-[10px] transition-[fill] duration-500", on ? "fill-ivory" : "fill-charcoal")}
              >
                {i + 1}
              </text>
            </g>
          );
        })}
        <circle ref={bead} cx={home.x} cy={home.y} r={3.4} className={cn("fill-charcoal", run ? "opacity-100" : "opacity-0")} />
      </svg>
      <ol className="mt-8 grid gap-4 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-2">
        {STATIONS.map((st, i) => (
          <li
            key={st.name}
            className={cn(
              "rounded-xl border px-5 py-4 transition-colors duration-500",
              active === i ? "border-brass bg-[#f3ede2]" : "border-rule",
            )}
          >
            <p className="flex items-baseline gap-3">
              <span aria-hidden className="font-serif text-lg text-brass">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-xl font-medium">{st.name}</span>
            </p>
            <p className="mt-1.5 text-slate">{st.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

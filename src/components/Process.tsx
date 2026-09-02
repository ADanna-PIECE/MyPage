"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import SectionKicker from "./SectionKicker";
import TextReveal from "./TextReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// home layout: a hub + hex ring. index order matters — edges reference it.
const HOME = [
  { x: 150, y: 150, step: 1 }, // 0 hub
  { x: 150, y: 34, step: 1 }, // 1
  { x: 250, y: 92, step: 2 }, // 2
  { x: 250, y: 208, step: 1 }, // 3
  { x: 150, y: 266, step: 2 }, // 4
  { x: 50, y: 208, step: 1 }, // 5
  { x: 50, y: 92, step: 2 }, // 6
];

// where each node starts — flung out and scattered (the problem)
const SCATTER = [
  { x: 150, y: 150 },
  { x: -40, y: -30 },
  { x: 360, y: -50 },
  { x: 380, y: 150 },
  { x: 300, y: 360 },
  { x: -60, y: 330 },
  { x: -50, y: 60 },
];

// edges as [fromIndex, toIndex, appearsAtStep]
const EDGES: [number, number, number][] = [
  [0, 1, 1],
  [0, 3, 1],
  [0, 5, 1],
  [0, 2, 2],
  [0, 4, 2],
  [0, 6, 2],
  [1, 2, 2],
  [2, 3, 2],
  [3, 4, 2],
  [4, 5, 2],
  [5, 6, 2],
  [6, 1, 2],
];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

export default function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const steps = t.process.steps;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<(SVGCircleElement | null)[]>([]);
  const edgeEls = useRef<(SVGLineElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        setPinned(true);

        let lastK = -1;
        const assemble = (p: number) => {
          // quantise so the 26 SVG attr writes happen ~60 times total, not every frame
          const k = Math.round(easeOut(clamp01((p - 0.04) / 0.62)) * 60) / 60;
          if (k === lastK) return;
          lastK = k;
          const cur = HOME.map((h, i) => ({
            x: SCATTER[i].x + (h.x - SCATTER[i].x) * k,
            y: SCATTER[i].y + (h.y - SCATTER[i].y) * k,
          }));
          cur.forEach((c, i) => {
            const el = nodeEls.current[i];
            if (el) {
              el.setAttribute("cx", c.x.toFixed(1));
              el.setAttribute("cy", c.y.toFixed(1));
            }
          });
          EDGES.forEach(([a, b], i) => {
            const el = edgeEls.current[i];
            if (el) {
              el.setAttribute("x1", cur[a].x.toFixed(1));
              el.setAttribute("y1", cur[a].y.toFixed(1));
              el.setAttribute("x2", cur[b].x.toFixed(1));
              el.setAttribute("y2", cur[b].y.toFixed(1));
            }
          });
        };

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          pinType: "transform",
          onRefresh: (self) => assemble(self.progress),
          onUpdate: (self) => {
            const p = self.progress;
            setActive(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
            if (barRef.current) barRef.current.style.width = `${p * 100}%`;
            if (graphRef.current)
              graphRef.current.style.transform = `rotate(${(-16 + p * 20).toFixed(1)}deg) scale(${(0.82 + p * 0.2).toFixed(3)})`;
            assemble(p);
          },
        });
        assemble(0);
        return () => {
          setPinned(false);
          st.kill();
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="process" className="rule-t md:h-[240vh]">
      <div
        ref={pinRef}
        className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 overflow-hidden px-6 py-24 md:h-screen md:flex-row md:items-center md:justify-between md:gap-12 md:px-10 md:py-0"
      >
        {/* giant ghost step numeral — 3 stacked, cross-fading (no remount) */}
        {pinned && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[2%] top-1/2 -z-0 hidden -translate-y-1/2 select-none text-[26vw] font-medium leading-none tracking-tighter text-foreground/[0.04] md:grid"
          >
            {steps.map((_, i) => (
              <span
                key={i}
                className="col-start-1 row-start-1 transition-all duration-500 ease-out"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: `translateY(${i === active ? 0 : i < active ? -18 : 18}%)`,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </span>
        )}

        <div className="relative z-10 flex flex-col gap-9 md:w-[50%]">
          <SectionKicker label={t.process.kicker} className="text-muted" />
          <TextReveal
            as="h2"
            text={t.process.heading}
            className="block max-w-2xl text-3xl font-medium tracking-tight md:text-[2.75rem] md:leading-[1.05]"
          />

          <ol className="mt-2 flex flex-col">
            {steps.map((step, i) => {
              const on = !pinned || i === active;
              return (
                <li
                  key={step.n}
                  className="relative border-l border-line py-4 pl-6 transition-all duration-500"
                  style={{
                    opacity: on ? 1 : 0.38,
                    transform: pinned ? `translateX(${on ? 0 : -8}px)` : "none",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-px top-0 h-full w-px origin-top bg-accent transition-transform duration-500 ease-out"
                    style={{ transform: `scaleY(${on ? 1 : 0})` }}
                  />
                  <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-wide">
                    <span className="tnum text-accent">{step.n}</span>
                    <span className="text-muted">{step.tag}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-muted md:text-base">{step.body}</p>
                </li>
              );
            })}
          </ol>

          {pinned && (
            <div className="hidden items-center gap-3 font-mono text-xs uppercase tracking-wide text-muted md:flex">
              <span key={active} className="tnum inline-block animate-[fadeUp_.4s_ease] text-foreground">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="block h-px w-16 bg-line">
                <span ref={barRef} className="block h-full bg-accent" style={{ width: "0%" }} />
              </span>
              <span>{String(steps.length).padStart(2, "0")}</span>
            </div>
          )}
        </div>

        <div className="relative z-10 hidden md:flex md:w-[42%] md:flex-col md:items-center md:gap-6">
          <div
            ref={graphRef}
            className="w-full max-w-[400px]"
            style={{ transition: "transform .15s linear" }}
          >
            <svg viewBox="0 0 300 300" className="h-auto w-full overflow-visible" aria-hidden="true">
              <g
                className="process-graph-spin-rev"
                style={{ transformOrigin: "150px 150px", transformBox: "view-box" }}
              >
                <circle
                  cx="150"
                  cy="150"
                  r="134"
                  fill="none"
                  style={{ stroke: "var(--line)", strokeDasharray: "2 7", strokeWidth: 1 }}
                />
              </g>
              <circle
                cx="150"
                cy="150"
                r="140"
                style={{
                  fill: "var(--accent)",
                  opacity: active >= 2 ? 0.13 : 0,
                  transition: "opacity 1s ease",
                }}
              />
              {EDGES.map(([, , step], i) => {
                const lit = active >= step;
                return (
                  <line
                    key={i}
                    ref={(el) => {
                      edgeEls.current[i] = el;
                    }}
                    pathLength={1}
                    style={{
                      stroke: "var(--accent)",
                      strokeWidth: 1.25,
                      strokeDasharray: 1,
                      strokeDashoffset: lit ? 0 : 1,
                      opacity: lit ? 0.5 : 0,
                      transition: `stroke-dashoffset .6s ease ${i * 0.025}s, opacity .45s ease`,
                    }}
                  />
                );
              })}
              {HOME.map((n, i) => {
                const lit = active >= n.step;
                return (
                  <g key={i}>
                    {lit && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={5}
                        fill="none"
                        style={{
                          stroke: "var(--accent)",
                          strokeWidth: 1,
                          transformBox: "fill-box",
                          transformOrigin: "center",
                          animation: "node-ping .9s ease-out forwards",
                        }}
                      />
                    )}
                    <circle
                      ref={(el) => {
                        nodeEls.current[i] = el;
                      }}
                      cx={n.x}
                      cy={n.y}
                      r={lit ? (i === 0 ? 7.5 : 5.5) : 3.5}
                      style={{
                        fill: lit ? "var(--accent)" : "var(--muted)",
                        opacity: lit ? 1 : 0.5,
                        transition: "r .5s ease, fill .5s ease, opacity .5s ease",
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          <span
            key={active}
            className="animate-[fadeUp_.5s_ease] font-mono text-xs uppercase tracking-[0.2em] text-muted"
          >
            {t.process.stageCaption[active]}
          </span>
        </div>
      </div>
    </section>
  );
}

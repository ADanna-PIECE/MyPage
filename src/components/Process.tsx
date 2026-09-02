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

// radial cluster: scattered points (the problem) that wire into a system as you scroll
const NODES = [
  { id: "h", x: 150, y: 150, step: 1 },
  { id: "n1", x: 150, y: 38, step: 1 },
  { id: "n2", x: 247, y: 94, step: 2 },
  { id: "n3", x: 247, y: 206, step: 1 },
  { id: "n4", x: 150, y: 262, step: 2 },
  { id: "n5", x: 53, y: 206, step: 1 },
  { id: "n6", x: 53, y: 94, step: 2 },
] as const;

const EDGES: [string, string, number][] = [
  ["h", "n1", 1],
  ["h", "n3", 1],
  ["h", "n5", 1],
  ["h", "n2", 2],
  ["h", "n4", 2],
  ["h", "n6", 2],
  ["n1", "n2", 2],
  ["n2", "n3", 2],
  ["n3", "n4", 2],
  ["n4", "n5", 2],
  ["n5", "n6", 2],
  ["n6", "n1", 2],
];

const POS = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<
  string,
  (typeof NODES)[number]
>;

function ProcessGraph({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 300 300" className="mx-auto h-auto w-full max-w-[360px]" aria-hidden="true">
      <circle
        cx="150"
        cy="150"
        r="140"
        style={{
          fill: "var(--accent)",
          opacity: active >= 2 ? 0.1 : 0,
          transition: "opacity 1s ease",
        }}
      />
      <g
        className="process-graph-spin"
        style={{ transformOrigin: "150px 150px", transformBox: "view-box" }}
      >
        {EDGES.map(([from, to, step], i) => {
          const on = active >= step;
          const s = POS[from];
          const e = POS[to];
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={e.x}
              y2={e.y}
              pathLength={1}
              style={{
                stroke: "var(--accent)",
                strokeWidth: 1.25,
                strokeDasharray: 1,
                strokeDashoffset: on ? 0 : 1,
                opacity: on ? 0.55 : 0,
                transition: `stroke-dashoffset .7s ease ${i * 0.03}s, opacity .5s ease`,
              }}
            />
          );
        })}
        {NODES.map((n) => {
          const on = active >= n.step;
          return (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={on ? (n.id === "h" ? 7 : 5.5) : 3}
              style={{
                fill: on ? "var(--accent)" : "var(--muted)",
                transition: "r .5s ease, fill .5s ease",
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const steps = t.process.steps;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        setPinned(true);
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            // setActive is a no-op re-render when the value doesn't change, so
            // the component only re-renders on the 3 real step boundaries
            setActive(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
            if (barRef.current) barRef.current.style.width = `${p * 100}%`;
            if (graphRef.current)
              graphRef.current.style.transform = `rotate(${(p - 0.5) * 5}deg)`;
          },
        });
        return () => {
          setPinned(false);
          st.kill();
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="process" className="rule-t md:h-[200vh]">
      <div
        ref={pinRef}
        className="flex flex-col gap-10 px-6 py-24 md:h-screen md:flex-row md:items-center md:justify-between md:gap-12 md:px-10 md:py-0"
      >
        <div className="flex flex-col gap-10 md:w-[52%] md:gap-14">
          <SectionKicker label={t.process.kicker} className="text-muted" />
          <TextReveal
            as="h2"
            text={t.process.heading}
            className="block max-w-3xl text-3xl font-medium tracking-tight md:text-5xl"
          />

          <ol className="max-w-2xl">
            {steps.map((step, i) => {
              const on = !pinned || i === active;
              return (
                <li
                  key={step.n}
                  className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-line py-6 transition-all duration-500 md:py-8"
                  style={{
                    opacity: on ? 1 : 0.25,
                    transform: pinned ? `translateX(${on ? 0 : -8}px)` : "none",
                  }}
                >
                  <span className="tnum font-mono text-sm text-accent">{step.n}</span>
                  <div>
                    <h3 className="text-xl font-medium tracking-tight md:text-2xl">
                      {step.title}
                    </h3>
                    <p
                      className="mt-2 max-w-md text-muted transition-all duration-500"
                      style={{
                        maxHeight: on ? "8rem" : "0",
                        opacity: on ? 1 : 0,
                        overflow: "hidden",
                      }}
                    >
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {pinned && (
            <div className="hidden items-center gap-3 font-mono text-xs uppercase tracking-wide text-muted md:flex">
              <span className="tnum text-foreground">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="block h-px w-16 bg-line">
                <span ref={barRef} className="block h-full bg-accent" style={{ width: "0%" }} />
              </span>
              <span>{String(steps.length).padStart(2, "0")}</span>
            </div>
          )}
        </div>

        <div
          ref={graphRef}
          className="hidden md:block md:w-[38%]"
          style={{ transition: "transform .2s linear" }}
        >
          <ProcessGraph active={active} />
        </div>
      </div>
    </section>
  );
}

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

// scattered points (the problem) that wire into a connected system as you scroll
const NODES = [
  { id: "h", x: 150, y: 150, step: 1 },
  { id: "n1", x: 150, y: 34, step: 1 },
  { id: "n2", x: 250, y: 92, step: 2 },
  { id: "n3", x: 250, y: 208, step: 1 },
  { id: "n4", x: 150, y: 266, step: 2 },
  { id: "n5", x: 50, y: 208, step: 1 },
  { id: "n6", x: 50, y: 92, step: 2 },
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
    <svg viewBox="0 0 300 300" className="h-auto w-full" aria-hidden="true">
      {/* the field the scattered points live in */}
      <circle
        cx="150"
        cy="150"
        r="134"
        fill="none"
        style={{ stroke: "var(--line)", strokeDasharray: "2 7", strokeWidth: 1 }}
      />
      {/* system glow once it's all connected */}
      <circle
        cx="150"
        cy="150"
        r="140"
        style={{
          fill: "var(--accent)",
          opacity: active >= 2 ? 0.12 : 0,
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
              r={on ? (n.id === "h" ? 7.5 : 5.5) : 3.5}
              style={{
                fill: on ? "var(--accent)" : "var(--muted)",
                opacity: on ? 1 : 0.55,
                transition: "r .5s ease, fill .5s ease, opacity .5s ease",
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
          pinType: "transform",
          onUpdate: (self) => {
            const p = self.progress;
            // setActive is a no-op re-render when the value doesn't change
            setActive(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
            if (barRef.current) barRef.current.style.width = `${p * 100}%`;
            if (graphRef.current)
              graphRef.current.style.transform = `rotate(${(p - 0.5) * 6}deg)`;
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
    <section ref={sectionRef} id="process" className="rule-t md:h-[220vh]">
      <div
        ref={pinRef}
        className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24 md:h-screen md:flex-row md:items-center md:justify-between md:gap-12 md:px-10 md:py-0"
      >
        <div className="flex flex-col gap-9 md:w-[50%]">
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
                  className="border-l py-4 pl-6 transition-all duration-500"
                  style={{
                    borderColor: on ? "var(--accent)" : "var(--line)",
                    opacity: on ? 1 : 0.4,
                    transform: pinned ? `translateX(${on ? 0 : -6}px)` : "none",
                  }}
                >
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

        <div className="hidden md:flex md:w-[42%] md:flex-col md:items-center md:gap-6">
          <div
            ref={graphRef}
            className="w-full max-w-[400px]"
            style={{ transition: "transform .2s linear" }}
          >
            <ProcessGraph active={active} />
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

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

export default function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const steps = t.process.steps;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
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
          onUpdate: (self) => {
            setActive(
              Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999)),
            );
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
    <section ref={sectionRef} id="process" className="rule-t md:h-[300vh]">
      <div
        ref={pinRef}
        className="flex flex-col justify-center gap-10 px-6 py-24 md:h-screen md:gap-14 md:px-10 md:py-0"
      >
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
                  transform: on && pinned ? "translateX(0)" : pinned ? "translateX(-8px)" : "none",
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
              <span
                className="block h-full bg-accent transition-[width] duration-500"
                style={{ width: `${((active + 1) / steps.length) * 100}%` }}
              />
            </span>
            <span>{String(steps.length).padStart(2, "0")}</span>
          </div>
        )}
      </div>
    </section>
  );
}

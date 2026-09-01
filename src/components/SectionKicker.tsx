"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SectionKicker({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ref.current, start: "top 88%" };
        gsap.from(ref.current!.querySelector(".kicker-line"), {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: st,
        });
        gsap.from(ref.current!.querySelector(".kicker-text"), {
          x: -12,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: st,
        });
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 font-mono text-xs uppercase tracking-wide ${className}`}
    >
      <span className="kicker-line inline-block h-px w-8 bg-current opacity-50" />
      <span className="kicker-text">{label}</span>
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** stagger direct children instead of the wrapper itself */
  stagger?: boolean;
  y?: number;
};

export default function Reveal({
  children,
  className,
  stagger = false,
  y = 40,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets =
          stagger && ref.current
            ? (Array.from(ref.current.children) as HTMLElement[])
            : ref.current;

        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 0.8,
          ease: "power2.out",
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Reveals its children with a bottom-up clip wipe as they scroll into view.
export default function Wipe({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 78%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={{ clipPath: "inset(0 0 0% 0)" }}>
      {children}
    </div>
  );
}

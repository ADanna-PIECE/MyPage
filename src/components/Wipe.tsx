"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Lifts its children in as they scroll into view. Transform + opacity only
// (animating clip-path on a whole section repaints it every frame).
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
          y: 64,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "transform", // don't leave a containing block over sticky children
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
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

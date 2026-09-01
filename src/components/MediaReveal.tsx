"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Reveals an image with a left-to-right clip wipe while the image itself
// eases out of an over-scale.
export default function MediaReveal({
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
        const st = { trigger: ref.current, start: "top 82%" };
        gsap.from(ref.current, {
          clipPath: "inset(0 100% 0 0)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: st,
        });
        gsap.from(ref.current!.firstElementChild, {
          scale: 1.3,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: st,
        });
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      {children}
    </div>
  );
}

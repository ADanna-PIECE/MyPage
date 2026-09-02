"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Splits text into words that rise + un-blur on scroll-in (gsap.com style).
export default function TextReveal({
  text,
  as: Tag = "span",
  className = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current!.querySelectorAll(".tr-word"), {
          yPercent: 115,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.055,
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="mr-[0.28em] inline-block overflow-hidden align-bottom last:mr-0"
        >
          <span className="tr-word inline-block">{word}</span>
        </span>
      ))}
    </Tag>
  );
}

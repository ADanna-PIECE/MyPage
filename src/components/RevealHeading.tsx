"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Words rise out of a mask on scroll-in, then push away from the cursor.
export default function RevealHeading({
  text,
  as: Tag = "h2",
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
      const root = ref.current!;
      const wordEls = gsap.utils.toArray<HTMLElement>(".rh-word", root);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(wordEls, {
          yPercent: 118,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 85%" },
        });
      });

      if (window.matchMedia("(pointer: fine)").matches) {
        const reach = 300;
        const onMove = (e: PointerEvent) => {
          wordEls.forEach((w) => {
            const r = w.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < reach) {
              const push = (1 - dist / reach) * 26;
              gsap.to(w, {
                x: (-dx / dist) * push,
                y: (-dy / dist) * push,
                duration: 0.7,
                ease: "power3",
                overwrite: "auto",
              });
            } else {
              gsap.to(w, { x: 0, y: 0, duration: 0.7, ease: "power3", overwrite: "auto" });
            }
          });
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
          <span className="rh-word inline-block will-change-transform">{word}</span>
        </span>
      ))}
    </Tag>
  );
}

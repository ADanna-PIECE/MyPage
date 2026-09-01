"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // native scroll, no smoothing, no skew

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true });
    const raf = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    // subtle skew driven by scroll velocity (gsap.com signature)
    const skewTo = wrap.current
      ? gsap.quickTo(wrap.current, "skewY", { duration: 0.5, ease: "power3" })
      : null;
    const clamp = gsap.utils.clamp(-2.4, 2.4);
    lenis.on("scroll", ({ velocity }: { velocity: number }) => {
      skewTo?.(clamp(velocity * 0.12));
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="origin-center will-change-transform">
      {children}
    </div>
  );
}

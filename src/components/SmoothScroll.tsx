"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out" });

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // native scroll, no smoothing

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });
    const raf = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    // expose scroll velocity for the marquee skew — only while the hero marquee
    // is on screen, so it isn't invalidating styles on every scroll frame lower down
    const root = document.documentElement;
    const clampSkew = gsap.utils.clamp(-7, 7);
    let lastSkew = 0;
    lenis.on("scroll", ({ velocity }: { velocity: number }) => {
      if (window.scrollY > window.innerHeight * 1.4) {
        if (lastSkew !== 0) {
          root.style.setProperty("--mskew", "0deg");
          lastSkew = 0;
        }
        return;
      }
      const next = clampSkew(velocity * 0.35);
      if (Math.abs(next - lastSkew) < 0.1) return;
      root.style.setProperty("--mskew", `${next}deg`);
      lastSkew = next;
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return <>{children}</>;
}

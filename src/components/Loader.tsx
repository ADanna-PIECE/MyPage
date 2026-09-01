"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

// First visit: a counter 000 → 100, then the panel sweeps up to reveal the site.
// Later navigations (language switch): just the quick sweep-up reveal.
export default function Loader({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const finish = () => {
      document.body.style.overflow = "";
      el.style.display = "none";
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("intro-seen");
    } catch {}

    if (reduced) {
      finish();
      return;
    }

    document.body.style.overflow = "hidden";

    if (seen) {
      gsap.to(el, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
        delay: 0.05,
        onComplete: finish,
      });
      return;
    }

    const numEl = el.querySelector<HTMLElement>(".loader-num");
    const counter = { v: 0 };

    gsap
      .timeline({ onComplete: finish })
      .to(counter, {
        v: 100,
        duration: 1.7,
        ease: "power2.inOut",
        onUpdate: () => {
          if (numEl)
            numEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
        },
      })
      .to(".loader-inner", { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" }, "-=0.15")
      .to(el, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "-=0.1");
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[200] flex items-end justify-between bg-background px-6 pb-8 md:px-10 md:pb-10"
      aria-hidden="true"
    >
      <div className="loader-inner font-mono text-xs uppercase tracking-[0.3em] text-muted">
        {name}
      </div>
      <div className="loader-inner loader-num tnum text-[16vw] font-medium leading-none tracking-tight text-foreground md:text-[9vw]">
        000
      </div>
    </div>
  );
}

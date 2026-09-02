"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onIntroReveal } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger);

// Sharp cut-out portrait standing at the bottom-right of the hero: clip-reveals
// up on the intro, drifts a little against the cursor, sinks + fades as you
// scroll out. Renders nothing until /photo-cutout.png actually loads.
export default function HeroPortrait() {
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setReady(true);
    img.src = "/photo-cutout.png";
  }, []);

  useEffect(() => {
    if (!ready) return;
    const wrap = wrapRef.current;
    const im = imgRef.current;
    if (!wrap || !im) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    // rise + clip-reveal on the intro, then a permanent slow float
    gsap.set(im, { yPercent: 16, opacity: 0, clipPath: "inset(100% 0 0 0)" });
    onIntroReveal(() => {
      gsap.to(im, {
        yPercent: 0,
        opacity: 1,
        clipPath: "inset(0% 0 0 0)",
        duration: 1.3,
        ease: "power3.out",
        delay: 0.35,
        onComplete: () => {
          gsap.to(im, {
            yPercent: -2.4,
            duration: 4.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });
    });

    // sink a little as the hero scrolls away (it leaves with the section anyway)
    const st = gsap.to(wrap, {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
    });

    // drift against the cursor for a bit of depth
    let removeMove = () => {};
    if (window.matchMedia("(pointer: fine)").matches) {
      const xTo = gsap.quickTo(wrap, "x", { duration: 1, ease: "power3" });
      const yTo = gsap.quickTo(wrap, "y", { duration: 1, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -22);
        yTo((e.clientY / window.innerHeight - 0.5) * -14);
      };
      window.addEventListener("pointermove", onMove);
      removeMove = () => window.removeEventListener("pointermove", onMove);
    }

    return () => {
      st.scrollTrigger?.kill();
      st.kill();
      removeMove();
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute bottom-0 right-0 hidden h-[94vh] w-[38vw] max-w-[540px] will-change-transform md:block"
      aria-hidden="true"
    >
      <span className="hero-portrait-glow absolute inset-x-0 bottom-0 -z-10 h-3/4 rounded-[45%] bg-[var(--accent-soft)] blur-[90px]" />
      <img
        ref={imgRef}
        src="/photo-cutout.png"
        alt=""
        className="absolute bottom-0 right-0 h-full w-full object-contain object-bottom [filter:saturate(1.05)_contrast(1.02)]"
        style={{
          outline: "none",
          maskImage: "linear-gradient(to top, transparent 0%, #000 13%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, #000 13%)",
        }}
      />
      {/* accent light sweeping down the figure, occasionally */}
      <span
        className="hero-portrait-scan absolute inset-x-0 top-0 h-[12vh]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--accent) 60%, transparent) 48%, transparent)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

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

    // 3D tilt toward the cursor + a soft highlight that follows it across him
    let removeMove = () => {};
    if (window.matchMedia("(pointer: fine)").matches) {
      const ryTo = gsap.quickTo(wrap, "rotationY", { duration: 0.9, ease: "power3" });
      const rxTo = gsap.quickTo(wrap, "rotationX", { duration: 0.9, ease: "power3" });
      const xTo = gsap.quickTo(wrap, "x", { duration: 0.9, ease: "power3" });
      gsap.set(wrap, { transformPerspective: 900, transformOrigin: "70% 60%" });
      const onMove = (e: PointerEvent) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        ryTo(cx * 7);
        rxTo(cy * -5);
        xTo(cx * -14);
        const r = wrap.getBoundingClientRect();
        wrap.style.setProperty("--hx", `${((e.clientX - r.left) / r.width) * 100}%`);
        wrap.style.setProperty("--hy", `${((e.clientY - r.top) / r.height) * 100}%`);
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
      className="pointer-events-none absolute bottom-0 right-[2vw] hidden h-[92vh] w-[30vw] max-w-[520px] will-change-transform md:block lg:right-[3vw]"
      style={{ ["--hx" as string]: "50%", ["--hy" as string]: "40%" }}
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
      {/* soft light that catches him where the cursor points */}
      <span
        className="absolute bottom-0 right-0 h-[86%] w-full"
        style={{
          background:
            "radial-gradient(38% 34% at var(--hx) var(--hy), rgba(255,236,214,0.16), transparent 70%)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}

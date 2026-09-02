"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import Rich from "./Rich";
import HeroField from "./HeroField";
import HeroPixelFace from "./HeroPixelFace";
import Magnetic from "./Magnetic";
import { onIntroReveal } from "@/lib/intro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function useBuenosAiresClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const time = useBuenosAiresClock();
  const ref = useRef<HTMLElement>(null);
  const words = t.name.split(" ");

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const wordEls = gsap.utils.toArray<HTMLElement>(".hero-word");

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // hidden until the loader curtain begins to lift
        gsap.set(".hero-top > *", { y: 16, opacity: 0 });
        gsap.set(".hero-word", { y: 70, filter: "blur(12px)", opacity: 0 });
        gsap.set([".hero-intro", ".hero-bottom"], { opacity: 0, y: 20 });
        gsap.set(".hero-folio", { opacity: 0 });

        onIntroReveal(() => {
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .to(".hero-top > *", { y: 0, opacity: 1, stagger: 0.1, duration: 0.7 })
            .to(
              ".hero-word",
              { y: 0, filter: "blur(0px)", opacity: 1, duration: 1.1, stagger: 0.12 },
              "-=0.35",
            )
            .to(".hero-intro", { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
            .to(".hero-bottom", { y: 0, opacity: 1, duration: 0.8 }, "-=0.4")
            .to(".hero-folio", { opacity: 1, duration: 0.8 }, "<")
            .add(() => {
              gsap.to(".hero-name", {
                y: 6,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            });
        });

        // ambient drifting blobs
        gsap.utils.toArray<HTMLElement>(".hero-blob").forEach((blob, i) => {
          gsap.to(blob, {
            xPercent: i % 2 ? -32 : 30,
            yPercent: i % 2 ? 24 : -22,
            scale: 1.25,
            duration: 10 + i * 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        // whole hero block drifts up and fades as you scroll past it
        gsap.to(".hero-fade", {
          yPercent: -16,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });

        // ...and the name breaks apart first — one tween per line
        gsap.to(".hero-word", {
          yPercent: (i) => (i % 2 ? -170 : -280),
          xPercent: (i) => (i % 2 ? 95 : -75),
          rotation: (i) => (i % 2 ? 13 : -10),
          ease: "power2.in",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => "+=" + window.innerHeight * 0.5,
            scrub: 0.4,
          },
        });
      });

      // cursor: halo follows, name repels
      if (window.matchMedia("(pointer: fine)").matches) {
        const halo = root.querySelector<HTMLElement>(".hero-halo");
        const xTo = halo && gsap.quickTo(halo, "x", { duration: 0.9, ease: "power3" });
        const yTo = halo && gsap.quickTo(halo, "y", { duration: 0.9, ease: "power3" });

        const onMove = (e: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          if (xTo && yTo) {
            xTo((e.clientX - rect.left - rect.width / 2) * 0.12);
            yTo((e.clientY - rect.top - rect.height / 2) * 0.12);
          }
          const reach = 380;
          wordEls.forEach((w) => {
            const r = w.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < reach) {
              const push = (1 - dist / reach) * 22;
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
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-6 pt-28 md:px-10 md:pb-10"
    >
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="hero-mesh" />
        <div
          className="hero-blob absolute left-[-14vw] top-[20vh] h-[46vh] w-[46vh] rounded-full blur-[100px]"
          style={{ background: "color-mix(in srgb, var(--accent) 34%, transparent)" }}
        />
        <div
          className="hero-blob absolute bottom-[-6vh] right-[6vw] h-[42vh] w-[42vh] rounded-full blur-[100px]"
          style={{ background: "color-mix(in srgb, var(--accent) 22%, transparent)" }}
        />
        <div
          className="hero-halo absolute right-[-15vw] top-[2vh] h-[80vh] w-[80vh] rounded-full blur-[130px] md:right-[4vw]"
          style={{
            background:
              "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
          }}
        />
        <HeroField />
        <HeroPixelFace />
      </div>

      <div className="relative z-10 hero-top flex items-start justify-between font-mono text-xs uppercase tracking-wide text-muted">
        <span>{t.hero.role}</span>
        <span className="text-right">
          Buenos Aires
          <br />
          <span className="tnum text-foreground">{time || "—"}</span>
        </span>
      </div>

      <div className="hero-fade relative z-10">
        <span className="hero-intro mb-6 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-wide text-muted">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {t.hero.status}
        </span>

        <h1 className="hero-name text-[15vw] font-medium leading-[0.88] tracking-[-0.04em] will-change-transform md:text-[10.5vw]">
          {words.map((word, i) => (
            <span key={i} className="block">
              <span className="hero-word inline-block will-change-transform">{word}</span>
            </span>
          ))}
        </h1>

        <p className="hero-intro mt-7 max-w-xl text-base text-muted md:text-lg">
          <Rich text={t.hero.intro} />
        </p>
      </div>

      <span className="hero-folio pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 font-mono text-[11px] uppercase tracking-[0.35em] text-muted lg:block">
        Portfolio — 2026
      </span>

      <div className="hero-bottom relative z-10">
        <Magnetic strength={0.4}>
          <a href="#work" className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide">
            <span className="scroll-cue" />
            {t.hero.scrollCue}
          </a>
        </Magnetic>

        <div className="marquee-skew mt-6 flex gap-8 overflow-hidden border-t border-line pt-4 font-mono text-xs uppercase tracking-wide text-muted [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee-track flex shrink-0 gap-8 whitespace-nowrap">
            {[...t.hero.tech, ...t.hero.tech].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

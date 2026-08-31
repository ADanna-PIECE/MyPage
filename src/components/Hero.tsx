"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import Rich from "./Rich";

gsap.registerPlugin(useGSAP);

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
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-top > *", { y: 16, opacity: 0, stagger: 0.1, duration: 0.7 })
          .from(".hero-word", { yPercent: 115, duration: 1.1, stagger: 0.1 }, "-=0.3")
          .from(".hero-intro", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
          .from(".hero-bottom", { opacity: 0, duration: 0.8 }, "-=0.3");

        gsap.to(".hero-halo", {
          xPercent: 8,
          yPercent: -6,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-6 pt-28 md:px-10 md:pb-10"
    >
      <div
        className="hero-halo pointer-events-none absolute right-[-10vw] top-[6vh] -z-10 h-[75vh] w-[75vh] rounded-full blur-[130px] md:right-[8vw]"
        style={{ background: "var(--accent-soft)" }}
        aria-hidden="true"
      />

      <div className="hero-top flex items-start justify-between font-mono text-xs uppercase tracking-wide text-muted">
        <span>{t.hero.role}</span>
        <span className="text-right">
          Buenos Aires
          <br />
          <span className="tnum text-foreground">{time || "—"}</span>
        </span>
      </div>

      <div>
        <span className="hero-intro mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent text-glow" />
          {t.hero.status}
        </span>

        <h1 className="text-[15vw] font-medium leading-[0.88] tracking-[-0.04em] md:text-[10.5vw]">
          {words.map((word, i) => (
            <span key={i} className="block overflow-hidden">
              <span className="hero-word block">{word}</span>
            </span>
          ))}
        </h1>

        <p className="hero-intro mt-7 max-w-xl text-base text-muted md:text-lg">
          <Rich text={t.hero.intro} />
        </p>
      </div>

      <div className="hero-bottom">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide">
          <span className="inline-block h-8 w-px bg-foreground" />
          {t.hero.scrollCue}
        </div>

        <div className="mt-6 flex gap-8 overflow-hidden border-t border-line pt-4 font-mono text-xs uppercase tracking-wide text-muted [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
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

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

gsap.registerPlugin(useGSAP);

export default function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-line", { yPercent: 120, duration: 1, stagger: 0.12 })
          .from(".hero-meta", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
          .from(".hero-cue", { opacity: 0, duration: 0.6 }, "-=0.2");
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="flex min-h-[100svh] flex-col justify-between px-6 pb-8 pt-32 md:px-10 md:pb-10"
    >
      <div className="hero-meta flex flex-col gap-1 font-mono text-xs uppercase tracking-wide text-muted md:flex-row md:justify-between">
        <span>{t.hero.role}</span>
        <span>Buenos Aires, AR</span>
      </div>

      <div>
        <h1 className="text-[13vw] font-medium leading-[0.9] tracking-[-0.03em] md:text-[9vw]">
          {t.name.split(" ").map((word, i) => (
            <span key={i} className="block overflow-hidden">
              <span className="hero-line block">{word}</span>
            </span>
          ))}
        </h1>

        <div className="mt-8 max-w-xl overflow-hidden">
          <p className="hero-line text-lg text-muted md:text-xl">{t.hero.intro}</p>
        </div>
      </div>

      <a
        href="#work"
        className="hero-cue flex items-center gap-3 font-mono text-xs uppercase tracking-wide"
      >
        <span className="inline-block h-8 w-px bg-foreground" />
        {t.hero.scrollCue}
      </a>
    </section>
  );
}

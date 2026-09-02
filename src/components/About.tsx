"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import Rich from "./Rich";
import SectionKicker from "./SectionKicker";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Light section — deliberate palette break from the dark rest of the page.
export default function About({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // portrait: clip wipe up + settle from an over-scale, then wash to colour
        gsap.from(".about-photo", {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".about-photo", start: "top 85%" },
        });
        gsap.from(".about-photo img", {
          scale: 1.25,
          filter: "grayscale(1) brightness(1.1)",
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-photo", start: "top 85%" },
        });

        // heading wipes in from the left behind a mask
        gsap.from(".about-heading", {
          clipPath: "inset(0 100% 0 0)",
          duration: 1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".about-heading", start: "top 84%" },
        });
        gsap.from(".about-underline", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.9,
          ease: "power3.inOut",
          delay: 0.25,
          scrollTrigger: { trigger: ".about-heading", start: "top 84%" },
        });

        // bio paragraphs rise in
        gsap.from(".about-p", {
          y: 34,
          opacity: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-copy", start: "top 80%" },
        });

        // fact rows snap in from the left, rules draw across
        const factsSt = { trigger: ".about-facts", start: "top 82%" };
        gsap.from(".fact-row", {
          x: -44,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: factsSt,
        });
        gsap.from(".fact-rule", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: factsSt,
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="about"
      className="bg-[#f1efe9] py-24 text-[#14140f] md:py-40"
      style={{ ["--foreground" as string]: "#14140f" }}
    >
      <div className="grid gap-10 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <SectionKicker label={t.about.kicker} className="text-[#7a766c]" />

            {/* TODO(augusto): guardá tu foto de LinkedIn como public/photo.jpg */}
            <div className="about-photo mt-6 aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-lg border border-black/10">
              <img
                src="/photo.jpg"
                alt={t.name}
                className="h-full w-full object-cover object-top grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-8">
          <h2 className="about-heading block max-w-3xl text-3xl font-medium tracking-tight md:text-5xl">
            {t.about.heading}
          </h2>
          <span className="about-underline mt-6 block h-0.5 w-20 origin-left bg-accent" />

          <div className="about-copy mt-12 max-w-xl space-y-7 text-[#4a463c]">
            {t.about.body.map((paragraph, i) => (
              <p key={i} className="about-p">
                <Rich text={paragraph} />
              </p>
            ))}
          </div>

          <ul className="about-facts mt-16 max-w-xl border-t border-black/10 pt-10">
            {t.about.facts.map((fact, i) => (
              <li
                key={i}
                className="fact-row relative flex gap-4 py-4 text-sm text-[#14140f]"
              >
                <span className="fact-rule absolute bottom-0 left-0 h-px w-full origin-left bg-black/15" />
                <span className="tnum font-mono text-xs text-[#9a958a]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

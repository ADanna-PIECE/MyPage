"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import Rich from "./Rich";
import SectionKicker from "./SectionKicker";
import TextReveal from "./TextReveal";
import MediaReveal from "./MediaReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Light section — deliberate palette break from the dark rest of the page.
export default function About({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ref = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // the portrait drifts against the copy as the section passes
        if (photoRef.current) {
          gsap.fromTo(
            photoRef.current,
            { yPercent: -6 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }

        // accent bar draws out from under the heading
        gsap.from(".about-underline", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".about-underline", start: "top 88%" },
        });

        // bio paragraphs rise in
        gsap.from(".about-p", {
          y: 22,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-copy", start: "top 82%" },
        });

        // fact rows slide in and their rule draws left-to-right
        const factsSt = { trigger: ".about-facts", start: "top 84%" };
        gsap.from(".fact-row", {
          x: -18,
          opacity: 0,
          duration: 0.6,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: factsSt,
        });
        gsap.from(".fact-rule", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.7,
          stagger: 0.09,
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
      className="overflow-hidden bg-[#f1efe9] py-24 text-[#14140f] md:py-40"
      style={{ ["--foreground" as string]: "#14140f" }}
    >
      <div className="grid gap-10 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <SectionKicker label={t.about.kicker} className="text-[#7a766c]" />

          {/* TODO(augusto): guardá tu foto de LinkedIn como public/photo.jpg */}
          <div ref={photoRef} className="mt-6 will-change-transform">
            <MediaReveal className="aspect-[3/4] w-full max-w-[320px] rounded-lg border border-black/10">
              <img
                src="/photo.jpg"
                alt={t.name}
                className="h-full w-full object-cover object-top grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            </MediaReveal>
          </div>
        </div>
        <div className="md:col-span-8">
          <TextReveal
            as="h2"
            text={t.about.heading}
            className="block max-w-3xl text-3xl font-medium tracking-tight md:text-5xl"
          />
          <span className="about-underline mt-6 block h-0.5 w-20 origin-left bg-accent" />

          <div className="about-copy mt-10 max-w-xl space-y-5 text-[#4a463c]">
            {t.about.body.map((paragraph, i) => (
              <p key={i} className="about-p">
                <Rich text={paragraph} />
              </p>
            ))}
          </div>

          <ul className="about-facts mt-12 max-w-xl border-t border-black/10 pt-8">
            {t.about.facts.map((fact, i) => (
              <li
                key={i}
                className="fact-row relative flex gap-4 py-3 text-sm text-[#14140f]"
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

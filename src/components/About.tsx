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
        // everything here is scrubbed — you literally scroll the reveal open

        // portrait: clip wipe up + the image eases out of an over-scale
        gsap.fromTo(
          ".about-photo",
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "none",
            scrollTrigger: { trigger: ".about-photo", start: "top 88%", end: "top 42%", scrub: true },
          },
        );
        gsap.fromTo(
          ".about-photo-img",
          { scale: 1.22 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: ".about-photo", start: "top 88%", end: "top 35%", scrub: true },
          },
        );

        // heading wipes open left-to-right as it scrolls up
        gsap.fromTo(
          ".about-heading",
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: { trigger: ".about-heading", start: "top 92%", end: "top 55%", scrub: true },
          },
        );
        gsap.fromTo(
          ".about-underline",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left",
            ease: "none",
            scrollTrigger: { trigger: ".about-heading", start: "top 78%", end: "top 55%", scrub: true },
          },
        );

        // bio paragraphs rise in, staggered along the scroll
        gsap.utils.toArray<HTMLElement>(".about-p").forEach((p, i) => {
          gsap.fromTo(
            p,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: p,
                start: `top ${88 - i * 2}%`,
                end: `top ${64 - i * 2}%`,
                scrub: true,
              },
            },
          );
        });

        // fact rows slide in from the left and their rule draws across
        gsap.utils.toArray<HTMLElement>(".fact-row").forEach((row) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 92%", end: "top 68%", scrub: true },
          });
          tl.fromTo(row, { x: -70, opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out" }).fromTo(
            row.querySelector(".fact-rule"),
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: "left", ease: "none" },
            0,
          );
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
          <div className="relative md:sticky md:top-28">
            <SectionKicker label={t.about.kicker} className="text-[#7a766c]" />

            {/* rotating "available" badge over the portrait corner */}
            <div className="pointer-events-none absolute left-[246px] top-[118px] z-10 hidden h-24 w-24 md:block">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full animate-[spin_16s_linear_infinite]"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="about-badge-arc"
                    d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0"
                    fill="none"
                  />
                </defs>
                <text className="fill-[#14140f] font-mono text-[10.5px] uppercase tracking-[0.22em]">
                  <textPath href="#about-badge-arc">
                    Disponible · Para proyectos ·&nbsp;
                  </textPath>
                </text>
              </svg>
              <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-accent" />
            </div>

            {/* TODO(augusto): guardá tu foto de LinkedIn como public/photo.jpg.
                grayscale base + a colour copy revealed in a circle that tracks the cursor */}
            <div
              className="about-photo group relative mt-6 aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-lg border border-black/10 shadow-none transition-[border-color,transform,box-shadow] duration-500 hover:scale-[1.03] hover:border-accent/60 hover:shadow-[0_30px_60px_-20px_rgba(139,92,246,0.35)]"
              style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                el.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <img
                src="/photo.jpg"
                alt={t.name}
                className="about-photo-img absolute inset-0 h-full w-full object-cover object-top grayscale"
              />
              <img
                src="/photo.jpg"
                alt=""
                aria-hidden="true"
                className="about-photo-img absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-300 [filter:saturate(1.45)_contrast(1.05)] group-hover:opacity-100"
                style={{
                  maskImage:
                    "radial-gradient(circle 150px at var(--mx) var(--my), #000 45%, transparent 70%)",
                  WebkitMaskImage:
                    "radial-gradient(circle 150px at var(--mx) var(--my), #000 45%, transparent 70%)",
                }}
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

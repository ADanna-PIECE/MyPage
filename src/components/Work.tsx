"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { projects, type Project } from "@/content/projects";
import VideoDialog from "./VideoDialog";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Dict = ReturnType<typeof getDictionary>;

export default function Work({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [active, setActive] = useState<Project | null>(null);

  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="rule-t px-6 md:px-10">
      <header className="sticky top-0 z-20 flex items-baseline justify-between gap-4 bg-background py-4 font-mono text-xs uppercase tracking-wide text-muted">
        <span>{t.work.kicker}</span>
        <span className="text-xl font-medium normal-case tracking-tight text-foreground md:text-3xl">
          {t.work.heading}
        </span>
        <span>{t.work.span}</span>
      </header>

      <ol>
        {featured.map((project, i) => (
          <ProjectRow
            key={project.slug}
            index={i + 1}
            project={project}
            locale={locale}
            t={t}
            onWatch={() => setActive(project)}
          />
        ))}
      </ol>

      {more.length > 0 && (
        <div className="py-16 md:py-24">
          <h3 className="font-mono text-xs uppercase tracking-wide text-muted">
            {t.work.more}
          </h3>
          <ul className="mt-6">
            {more.map((project) => (
              <li
                key={project.slug}
                className="rule-b grid gap-2 py-6 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <span className="font-medium md:col-span-3">{project.title}</span>
                <span className="line-clamp-2 text-sm text-muted md:col-span-7">
                  {project.tagline[locale]}
                </span>
                <span className="flex gap-4 font-mono text-xs uppercase tracking-wide md:col-span-2 md:justify-end">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-accent underline-offset-4"
                    >
                      {t.work.visitSite}
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-accent underline-offset-4"
                    >
                      {t.work.sourceCode}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <VideoDialog
        youtubeId={active?.youtubeId ?? null}
        title={active?.title ?? ""}
        onClose={() => setActive(null)}
      />
    </section>
  );
}

type RowProps = {
  index: number;
  project: Project;
  locale: Locale;
  t: Dict;
  onWatch: () => void;
};

function ProjectRow({ index, project, locale, t, onWatch }: RowProps) {
  const ref = useRef<HTMLLIElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The panel "assembles" onto the grid as the row scrolls up.
        gsap.from(".frag", {
          xPercent: (i: number) => (i % 2 ? 45 : -45),
          yPercent: (i: number) => (i < 2 ? -35 : 35),
          rotate: (i: number) => (i % 2 ? 4 : -4),
          opacity: 0,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        });

        // Index number counts up to its position.
        const numEl = ref.current?.querySelector<HTMLElement>(".row-num");
        if (numEl) {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: index,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              end: "top 45%",
              scrub: true,
            },
            onUpdate: () => {
              numEl.textContent = String(Math.round(counter.value)).padStart(2, "0");
            },
          });
        }

        // Text lines rise into place.
        gsap.from(".row-line", {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 72%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <li
      ref={ref}
      className="rule-b grid gap-8 py-16 md:grid-cols-12 md:gap-10 md:py-28"
    >
      <div className="flex flex-col justify-center md:col-span-5">
        <span className="row-num font-mono text-6xl leading-none text-accent md:text-8xl">
          00
        </span>

        <h3 className="mt-5 overflow-hidden">
          <span className="row-line block text-3xl font-medium tracking-tight md:text-5xl">
            {project.title}
          </span>
        </h3>

        <div className="mt-4 overflow-hidden">
          <p className="row-line block max-w-md text-muted">
            {project.tagline[locale]}
          </p>
        </div>

        <dl className="row-line mt-8 grid grid-cols-2 gap-4 font-mono text-xs uppercase tracking-wide">
          <div>
            <dt className="text-muted">{t.work.roleLabel}</dt>
            <dd className="mt-1 normal-case">{project.role[locale]}</dd>
          </div>
          <div>
            <dt className="text-muted">{t.work.stackLabel}</dt>
            <dd className="mt-1">{project.stack.join(" · ") || "—"}</dd>
          </div>
        </dl>

        <div className="row-line mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wide">
          {project.youtubeId && (
            <button onClick={onWatch} className="underline decoration-accent underline-offset-4">
              {t.work.watchDemo}
            </button>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-accent underline-offset-4"
            >
              {t.work.visitSite}
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-accent underline-offset-4"
            >
              {t.work.sourceCode}
            </a>
          )}
        </div>

      </div>

      <div className="md:col-span-7">
        <div className="relative grid aspect-[4/3] grid-cols-2 grid-rows-2 overflow-hidden border border-rule">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="frag border border-rule bg-[#f4f4f2]" />
          ))}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-4 font-mono text-xs uppercase tracking-wide">
            <span>{project.title}</span>
            {project.year && <span>{project.year}</span>}
          </div>
        </div>
      </div>
    </li>
  );
}

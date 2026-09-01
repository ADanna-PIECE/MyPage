"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { projects, type Project } from "@/content/projects";
import VideoDialog from "./VideoDialog";
import Rich from "./Rich";
import LazyVideo from "./LazyVideo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Dict = ReturnType<typeof getDictionary>;

export default function Work({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [active, setActive] = useState<Project | null>(null);

  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="rule-t px-6 md:px-10">
      <div className="flex items-baseline justify-between gap-4 py-10 font-mono text-xs uppercase tracking-wide text-muted md:py-16">
        <span>
          {t.work.kicker} — {String(featured.length).padStart(2, "0")}
        </span>
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-5xl">
          {t.work.heading}
        </h2>
        <span>{t.work.span}</span>
      </div>

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

      <div className="rule-t py-16 md:py-24">
        <h3 className="font-mono text-xs uppercase tracking-wide text-muted">{t.work.more}</h3>
        <p className="mt-6 max-w-2xl text-xl text-muted md:text-2xl">
          <Rich text={t.work.moreNote} />
        </p>
        {more.length > 0 && (
          <ul className="mt-10">
            {more.map((project) => (
              <li
                key={project.slug}
                className="grid gap-2 border-t border-line py-6 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <span className="text-lg font-medium md:col-span-3">{project.title}</span>
                <span className="line-clamp-2 text-sm text-muted md:col-span-7">
                  <Rich text={project.tagline[locale]} />
                </span>
                <span className="flex gap-4 font-mono text-xs uppercase tracking-wide md:col-span-2 md:justify-end">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="link transition-colors hover:text-accent">
                      {t.work.visitSite}
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="link transition-colors hover:text-accent">
                      {t.work.sourceCode}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <VideoDialog
        youtubeId={active?.youtubeId ?? null}
        src={active?.demoVideo ?? null}
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
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panel = ref.current?.querySelector<HTMLElement>(".panel");
        if (panel) {
          gsap.fromTo(
            panel,
            { clipPath: "inset(6% 6% 6% 6%)", opacity: 0.35 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top 90%",
                end: "top 45%",
                scrub: true,
              },
            },
          );
        }

        const media = ref.current?.querySelector<HTMLElement>(".panel-media");
        if (media) {
          gsap.set(media, { scale: 1.14 });
          gsap.fromTo(
            media,
            { yPercent: -7 },
            {
              yPercent: 7,
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

        const numEl = ref.current?.querySelector<HTMLElement>(".row-num");
        if (numEl) {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: index,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 92%", end: "top 62%", scrub: true },
            onUpdate: () => {
              numEl.textContent = String(Math.round(counter.value)).padStart(2, "0");
            },
          });
        }

        const lines = ref.current?.querySelectorAll(".row-line");
        if (lines?.length) {
          gsap.from(lines, {
            yPercent: 120,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: ref.current, start: "top 70%" },
          });
        }
      });
    },
    { scope: ref },
  );

  const hasDemo = project.youtubeId !== null || project.demoVideo !== null;

  return (
    <li
      ref={ref}
      className="grid items-start gap-8 border-t border-line py-14 md:grid-cols-12 md:gap-8 md:py-16"
    >
      <div className="flex flex-col md:col-span-5">
        <span className="row-num tnum font-mono text-6xl leading-none text-accent text-glow md:text-8xl">
          00
        </span>

        <h3 className="mt-4 overflow-hidden">
          <span className="row-line block text-4xl font-medium tracking-tight md:text-6xl">
            {project.title}
          </span>
        </h3>

        <div className="mt-5 overflow-hidden">
          <p className="row-line block max-w-md text-muted">
            <Rich text={project.tagline[locale]} />
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
          {hasDemo && (
            <button
              onClick={onWatch}
              className="link text-accent transition-transform active:scale-[0.97]"
            >
              ▶ {t.work.watchDemo}
            </button>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="link transition-colors hover:text-accent"
            >
              {t.work.visitSite} ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="link transition-colors hover:text-accent"
            >
              {t.work.sourceCode} ↗
            </a>
          )}
        </div>

        {project.detail && (
          <div className="row-line mt-8">
            <button
              onClick={() => setOpen((v) => !v)}
              className="link font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-foreground"
            >
              {open ? t.work.readLess : t.work.readMore} {open ? "−" : "+"}
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <dl className="mt-6 space-y-5 border-l border-line pl-5">
                  {(["brief", "approach", "solution", "extra"] as const).map((k) => (
                    <div key={k}>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-accent">
                        {t.work.detail[k]}
                      </dt>
                      <dd className="mt-1 max-w-md text-sm text-muted">
                        {project.detail![k][locale]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-6 md:col-start-7">
        <div className="panel glow-accent relative aspect-video overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-300 hover:border-white/25">
          <div className="panel-media absolute inset-0 scale-[1.14]">
            {project.previewVideo ? (
              <LazyVideo
                className="h-full w-full object-cover"
                src={project.previewVideo}
              />
            ) : (
              <div className="relative grid h-full w-full items-end bg-surface p-6">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 20% 0%, var(--accent-soft), transparent 60%)",
                  }}
                />
                <span className="relative text-2xl font-medium tracking-tight text-foreground/60 md:text-3xl">
                  {project.title}
                </span>
              </div>
            )}
          </div>

          {hasDemo && (
            <button
              onClick={onWatch}
              aria-label={t.work.watchDemo}
              className="absolute inset-0 grid place-items-center transition-colors hover:bg-black/40"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/60 bg-black/30 text-lg backdrop-blur transition-transform duration-300 hover:scale-110">
                ▶
              </span>
            </button>
          )}
        </div>

        {hasDemo && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-muted">
            ▶ {t.work.watchDemo} — {t.work.demoWithAudio}
          </p>
        )}
      </div>
    </li>
  );
}

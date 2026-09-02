"use client";

import { useRef, useState, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { projects, type Project } from "@/content/projects";
import VideoDialog from "./VideoDialog";
import DetailDialog from "./DetailDialog";
import Rich from "./Rich";
import LazyVideo from "./LazyVideo";
import Magnetic from "./Magnetic";
import TextReveal from "./TextReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Dict = ReturnType<typeof getDictionary>;
type ActiveVideo = { youtubeId: string | null; src: string | null; title: string };

export default function Work({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [video, setVideo] = useState<ActiveVideo | null>(null);
  const [detail, setDetail] = useState<Project | null>(null);
  const [idx, setIdx] = useState(0);

  const featured = projects.filter((p) => p.featured);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const amount = () => track.scrollWidth - window.innerWidth;

          const horiz = gsap.to(track, {
            x: () => -amount(),
            ease: "none",
            scrollTrigger: {
              trigger: pinRef.current,
              pin: true,
              scrub: 0.5,
              start: "top top",
              end: () => "+=" + amount(),
              snap:
                featured.length > 1
                  ? { snapTo: 1 / (featured.length - 1), duration: 0.3, ease: "power1.inOut" }
                  : undefined,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                setIdx(Math.round(self.progress * (featured.length - 1))),
            },
          });

          gsap.utils.toArray<HTMLElement>(".pcard").forEach((card) => {
            gsap.from(card.querySelectorAll(".pc-line"), {
              y: 40,
              opacity: 0,
              stagger: 0.06,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horiz,
                start: "left 62%",
                // during a fast flick just snap it done instead of animating
                fastScrollEnd: true,
              },
            });

            // one parallax layer per card — the panel drifts against the page
            const media = card.querySelector<HTMLElement>(".panel-media");
            if (media) {
              gsap.set(media, { scale: 1.09 });
              gsap.fromTo(
                media,
                { xPercent: -5 },
                {
                  xPercent: 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: horiz,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                },
              );
            }
          });
        },
      );
    },
    { scope: pinRef },
  );

  return (
    <section id="work" className="rule-t">
      <div className="flex items-baseline justify-between gap-4 px-6 py-10 font-mono text-xs uppercase tracking-wide text-muted md:px-10 md:py-16">
        <span className="hidden sm:block">
          {t.work.kicker} — {String(featured.length).padStart(2, "0")}
        </span>
        <TextReveal
          as="h2"
          text={t.work.heading}
          className="block text-3xl font-medium tracking-tight text-foreground md:text-5xl"
        />
        <span className="hidden sm:block">{t.work.span}</span>
      </div>

      <div ref={pinRef} className="relative md:h-screen md:overflow-hidden">
        <div className="pointer-events-none absolute left-6 top-24 z-10 hidden font-mono text-xs uppercase tracking-wide text-muted md:block md:left-10">
          {t.work.heading} — {t.work.span}
        </div>
        <ol
          ref={trackRef}
          className="flex flex-col md:h-screen md:w-max md:flex-row"
        >
          {featured.map((project, i) => (
            <ProjectCard
              key={project.slug}
              i={i}
              project={project}
              locale={locale}
              t={t}
              onWatch={setVideo}
              onDetail={() => setDetail(project)}
            />
          ))}
        </ol>

        <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-xs uppercase tracking-wide text-muted md:flex">
          <span className="tnum text-foreground">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span className="block h-px w-16 bg-line">
            <span
              className="block h-full bg-accent transition-[width] duration-300"
              style={{ width: `${((idx + 1) / featured.length) * 100}%` }}
            />
          </span>
          <span>{String(featured.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="rule-t px-6 py-16 md:px-10 md:py-24">
        <h3 className="font-mono text-xs uppercase tracking-wide text-muted">
          {t.work.more}
        </h3>
        <p className="mt-6 max-w-2xl text-xl text-muted md:text-2xl">
          <Rich text={t.work.moreNote} />
        </p>
      </div>

      <VideoDialog
        youtubeId={video?.youtubeId ?? null}
        src={video?.src ?? null}
        title={video?.title ?? ""}
        onClose={() => setVideo(null)}
      />
      <DetailDialog
        detail={detail?.detail ?? null}
        title={detail?.title ?? ""}
        locale={locale}
        onClose={() => setDetail(null)}
      />
    </section>
  );
}

type CardProps = {
  i: number;
  project: Project;
  locale: Locale;
  t: Dict;
  onWatch: (v: ActiveVideo) => void;
  onDetail: () => void;
};

function ProjectCard({ i, project, locale, t, onWatch, onDetail }: CardProps) {
  const primary: ActiveVideo = {
    youtubeId: project.youtubeId,
    src: project.demoVideo,
    title: project.title,
  };
  const demos: { label: string; video: ActiveVideo }[] = [];
  if (project.youtubeId || project.demoVideo) {
    demos.push({
      label: project.demoLabel?.[locale] ?? t.work.watchDemo,
      video: primary,
    });
  }
  if (project.extraDemo) {
    demos.push({
      label: project.extraDemo.label[locale],
      video: {
        youtubeId: project.extraDemo.youtubeId,
        src: project.extraDemo.demoVideo,
        title: project.title,
      },
    });
  }

  // soft accent light that follows the cursor across the panel
  const panelRef = useRef<HTMLDivElement>(null);
  const moveGlow = (e: MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <li
      data-i={i + 1}
      className="pcard flex w-full shrink-0 flex-col justify-center gap-8 border-t border-line px-6 py-16 md:h-screen md:w-screen md:flex-row md:items-center md:gap-12 md:border-t-0 md:px-10 md:py-0"
    >
      <div className="flex flex-col md:w-[38vw]">
        <span className="pc-line pc-num tnum font-mono text-6xl leading-none text-accent text-glow md:text-8xl">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="pc-line mt-4 text-4xl font-medium tracking-tight md:text-6xl">
          {project.title}
        </h3>
        <p className="pc-line mt-5 max-w-md text-muted">
          <Rich text={project.tagline[locale]} />
        </p>
        <dl className="pc-line mt-8 grid grid-cols-2 gap-4 font-mono text-xs uppercase tracking-wide">
          <div>
            <dt className="text-muted">{t.work.roleLabel}</dt>
            <dd className="mt-1 normal-case">{project.role[locale]}</dd>
          </div>
          <div>
            <dt className="text-muted">{t.work.stackLabel}</dt>
            <dd className="mt-1">{project.stack.join(" · ") || "—"}</dd>
          </div>
        </dl>
        <div className="pc-line mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wide">
          {demos.map((d) => (
            <button
              key={d.label}
              onClick={() => onWatch(d.video)}
              className="link text-accent transition-transform active:scale-[0.97]"
            >
              ▶ {d.label}
            </button>
          ))}
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
          {project.detail && (
            <button
              onClick={onDetail}
              className="link text-muted transition-colors hover:text-foreground"
            >
              {t.work.readMore} +
            </button>
          )}
        </div>
      </div>

      <div className="md:w-[46vw]">
        <div
          ref={panelRef}
          onMouseMove={moveGlow}
          style={{ ["--gx" as string]: "50%", ["--gy" as string]: "50%" }}
          className="panel group glow-accent relative aspect-video overflow-hidden rounded-lg border border-line bg-surface transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40"
        >
          <div className="panel-media absolute inset-0 scale-[1.09]">
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

          {/* soft accent light that tracks the cursor across the media */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--gx) var(--gy), color-mix(in srgb, var(--accent) 55%, transparent), transparent 42%)",
            }}
          />

          {demos.length > 0 && (
            <button
              onClick={() => onWatch(demos[0].video)}
              aria-label={demos[0].label}
              data-cursor="demo"
              className="absolute inset-0 grid place-items-center bg-gradient-to-t from-transparent to-transparent transition-colors duration-300 group-hover:from-black/55"
            >
              <Magnetic strength={0.5}>
                <span className="grid h-16 w-16 place-items-center rounded-full border border-white/70 bg-black/30 text-lg backdrop-blur transition-transform duration-300 group-hover:scale-110">
                  ▶
                </span>
              </Magnetic>
            </button>
          )}
        </div>

        {demos.length > 0 && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-muted">
            ▶ {t.work.watchDemo} — {t.work.demoWithAudio}
          </p>
        )}
      </div>
    </li>
  );
}

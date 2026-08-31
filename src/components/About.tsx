import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

export default function About({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section
      id="about"
      className="rule-t grid gap-10 px-6 py-24 md:grid-cols-12 md:px-10 md:py-40"
    >
      <div className="md:col-span-4">
        <div className="font-mono text-xs uppercase tracking-wide text-muted">
          {t.about.kicker}
        </div>
        {/* TODO(augusto): guardá tu foto de LinkedIn como public/photo.jpg */}
        <img
          src="/photo.jpg"
          alt={t.name}
          className="mt-6 aspect-[3/4] w-full max-w-[320px] rounded-lg border border-line object-cover object-top grayscale transition-[filter] duration-500 hover:grayscale-0"
        />
      </div>
      <div className="md:col-span-8">
        <h2 className="max-w-3xl text-3xl font-medium tracking-tight md:text-5xl">
          {t.about.heading}
        </h2>
        <div className="mt-10 max-w-xl space-y-5 text-muted">
          {t.about.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

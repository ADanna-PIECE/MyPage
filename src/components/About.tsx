import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

export default function About({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section
      id="about"
      className="rule-t grid gap-8 px-6 py-20 md:grid-cols-12 md:px-10 md:py-32"
    >
      <div className="md:col-span-4">
        <div className="font-mono text-xs uppercase tracking-wide text-muted">
          {t.about.kicker}
        </div>
        {/* TODO(augusto): guardá tu foto de LinkedIn como public/photo.jpg */}
        <img
          src="/photo.jpg"
          alt={t.name}
          className="mt-6 aspect-[4/5] w-full max-w-[280px] border border-rule object-cover"
        />
      </div>
      <div className="md:col-span-8">
        <h2 className="max-w-3xl text-3xl font-medium tracking-tight md:text-5xl">
          {t.about.heading}
        </h2>
        <div className="mt-8 max-w-xl space-y-4 text-muted">
          {t.about.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

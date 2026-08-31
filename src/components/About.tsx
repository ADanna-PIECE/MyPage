import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

// Light section — deliberate palette break from the dark rest of the page.
export default function About({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section
      id="about"
      className="bg-[#f1efe9] py-24 text-[#14140f] md:py-40"
    >
      <div className="grid gap-10 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <div className="font-mono text-xs uppercase tracking-wide text-[#7a766c]">
            {t.about.kicker}
          </div>
          {/* TODO(augusto): guardá tu foto de LinkedIn como public/photo.jpg */}
          <img
            src="/photo.jpg"
            alt={t.name}
            className="mt-6 aspect-[3/4] w-full max-w-[320px] rounded-lg border border-black/10 object-cover object-top grayscale transition-[filter] duration-500 hover:grayscale-0"
          />
        </div>
        <div className="md:col-span-8">
          <h2 className="max-w-3xl text-3xl font-medium tracking-tight md:text-5xl">
            {t.about.heading}
          </h2>
          <div className="mt-10 max-w-xl space-y-5 text-[#4a463c]">
            {t.about.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

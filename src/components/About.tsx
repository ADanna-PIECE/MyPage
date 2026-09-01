import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import Rich from "./Rich";
import SectionKicker from "./SectionKicker";
import TextReveal from "./TextReveal";

// Light section — deliberate palette break from the dark rest of the page.
export default function About({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section
      id="about"
      className="bg-[#f1efe9] py-24 text-[#14140f] md:py-40"
      style={{ ["--foreground" as string]: "#14140f" }}
    >
      <div className="grid gap-10 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <SectionKicker label={t.about.kicker} className="text-[#7a766c]" />

          {/* TODO(augusto): guardá tu foto de LinkedIn como public/photo.jpg */}
          <img
            src="/photo.jpg"
            alt={t.name}
            className="mt-6 aspect-[3/4] w-full max-w-[320px] rounded-lg border border-black/10 object-cover object-top grayscale transition-[filter] duration-500 hover:grayscale-0"
          />
        </div>
        <div className="md:col-span-8">
          <TextReveal
            as="h2"
            text={t.about.heading}
            className="block max-w-3xl text-3xl font-medium tracking-tight md:text-5xl"
          />
          <div className="mt-10 max-w-xl space-y-5 text-[#4a463c]">
            {t.about.body.map((paragraph, i) => (
              <p key={i}>
                <Rich text={paragraph} />
              </p>
            ))}
          </div>

          <ul className="mt-12 max-w-xl border-t border-black/10 pt-8">
            {t.about.facts.map((fact, i) => (
              <li
                key={i}
                className="flex gap-4 border-b border-black/10 py-3 text-sm text-[#14140f]"
              >
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

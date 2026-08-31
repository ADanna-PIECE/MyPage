import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

// TODO(jimena): reemplazá el mail, el /cv.pdf (poné el archivo en public/) y los links.
const EMAIL = "tu-email@ejemplo.com";
const LINKEDIN = "https://www.linkedin.com/";
const GITHUB = "https://github.com/";

export default function Contact({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section id="contact" className="rule-t px-6 py-20 md:px-10 md:py-32">
      <div className="font-mono text-xs uppercase tracking-wide text-muted">
        {t.contact.kicker}
      </div>
      <h2 className="mt-6 max-w-4xl text-[10vw] font-medium leading-[0.95] tracking-[-0.03em] md:text-[6vw]">
        {t.contact.heading}
      </h2>
      <p className="mt-8 max-w-md text-muted">{t.contact.body}</p>

      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide">
        <a
          href={`mailto:${EMAIL}`}
          className="underline decoration-accent underline-offset-4 hover:text-accent"
        >
          {t.contact.emailLabel}
        </a>
        <a
          href="/cv.pdf"
          className="underline decoration-accent underline-offset-4 hover:text-accent"
        >
          {t.contact.resumeLabel}
        </a>
        <a
          href={LINKEDIN}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-accent underline-offset-4 hover:text-accent"
        >
          LinkedIn
        </a>
        <a
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-accent underline-offset-4 hover:text-accent"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}

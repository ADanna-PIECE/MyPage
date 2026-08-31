import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

// TODO(augusto): confirmá el mail, y poné cv.pdf en public/.
const EMAIL = "augustomartindanna16@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/augusto-danna-0a0423195/";
const GITHUB = "https://github.com/ADanna-PIECE";

const LINKS = [
  { label: "Email", href: `mailto:${EMAIL}` },
  { label: "LinkedIn", href: LINKEDIN },
  { label: "GitHub", href: GITHUB },
  { label: "CV", href: "/cv.pdf" },
];

export default function Contact({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section id="contact" className="rule-t px-6 py-24 md:px-10 md:py-40">
      <div className="font-mono text-xs uppercase tracking-wide text-muted">
        {t.contact.kicker}
      </div>
      <h2 className="mt-8 text-[14vw] font-medium leading-[0.9] tracking-[-0.04em] md:text-[9vw]">
        {t.contact.heading}
      </h2>
      <p className="mt-8 max-w-md text-muted">{t.contact.body}</p>

      <ul className="mt-14 border-t border-line">
        {LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-center justify-between border-b border-line py-5 text-xl transition-colors hover:text-accent md:text-2xl"
            >
              <span>{link.label}</span>
              <span className="font-mono text-xs text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

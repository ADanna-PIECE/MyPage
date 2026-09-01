"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import SectionKicker from "./SectionKicker";

// TODO(augusto): confirmá el mail, y poné cv.pdf en public/.
const EMAIL = "augustomartindanna16@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/augusto-danna-0a0423195/";
const GITHUB = "https://github.com/ADanna-PIECE";

const EXTERNAL = [
  { label: "LinkedIn", href: LINKEDIN },
  { label: "GitHub", href: GITHUB },
  { label: "CV", href: "/cv.pdf" },
];

export default function Contact({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="rule-t px-6 py-24 md:px-10 md:py-40">
      <SectionKicker label={t.contact.kicker} className="text-muted" />
      <h2 className="mt-8 text-[14vw] font-medium leading-[0.9] tracking-[-0.04em] md:text-[9vw]">
        {t.contact.heading}
      </h2>
      <p className="mt-8 max-w-md text-muted">{t.contact.body}</p>

      <ul className="mt-14 border-t border-line">
        <li className="border-b border-line">
          <button
            onClick={copyEmail}
            className="group relative flex w-full items-center justify-between overflow-hidden py-5 text-left text-xl md:text-2xl"
          >
            <span
              className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 ease-out group-hover:translate-x-0"
              aria-hidden="true"
            />
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-4 group-hover:text-white">
              {copied ? t.contact.copied : EMAIL}
            </span>
            <span className="relative z-10 font-mono text-xs text-muted transition-all duration-300 group-hover:-translate-x-4 group-hover:text-white">
              {copied ? "" : t.contact.copy}
            </span>
          </button>
        </li>

        {EXTERNAL.map((link) => (
          <li key={link.label} className="border-b border-line">
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group relative flex items-center justify-between overflow-hidden py-5 text-xl md:text-2xl"
            >
              <span
                className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 ease-out group-hover:translate-x-0"
                aria-hidden="true"
              />
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-4 group-hover:text-white">
                {link.label}
              </span>
              <span className="relative z-10 font-mono text-xs text-muted transition-all duration-300 group-hover:-translate-x-4 group-hover:text-white">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import SectionKicker from "./SectionKicker";
import { MailIcon, LinkedInIcon, GitHubIcon, DocIcon } from "./ContactIcons";

// TODO(augusto): confirmá el mail, y poné cv.pdf en public/.
const EMAIL = "augustomartindanna16@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/augusto-danna-0a0423195/";
const GITHUB = "https://github.com/ADanna-PIECE";

const EXTERNAL: { label: string; href: string; icon: ReactNode }[] = [
  { label: "LinkedIn", href: LINKEDIN, icon: <LinkedInIcon /> },
  { label: "GitHub", href: GITHUB, icon: <GitHubIcon /> },
  { label: "CV — AI & Full-Stack", href: "/cv.pdf", icon: <DocIcon /> },
  { label: "CV — Quant", href: "/cv-quant.pdf", icon: <DocIcon /> },
];

function Row({
  children,
  end,
}: {
  children: ReactNode;
  end: ReactNode;
}) {
  return (
    <>
      <span
        className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 ease-out group-hover:translate-x-0"
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-4 transition-transform duration-300 group-hover:translate-x-4 group-hover:text-white">
        {children}
      </span>
      <span className="relative z-10 font-mono text-xs text-muted transition-all duration-300 group-hover:-translate-x-4 group-hover:text-white">
        {end}
      </span>
    </>
  );
}

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
            data-cursor={t.contact.copy}
            className="group relative flex w-full items-center justify-between overflow-hidden py-5 text-left text-xl md:text-2xl"
          >
            <Row end={copied ? "" : t.contact.copy}>
              <MailIcon />
              {copied ? t.contact.copied : t.contact.emailLabel}
            </Row>
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
              <Row end="↗">
                {link.icon}
                {link.label}
              </Row>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

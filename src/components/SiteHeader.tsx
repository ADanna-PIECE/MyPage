"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

export default function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const other: Locale = locale === "es" ? "en" : "es";
  const otherHref = pathname.replace(`/${locale}`, `/${other}`) || `/${other}`;

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 200 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "#work", label: t.nav.work },
    { href: "#about", label: t.nav.about },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-transform duration-500 md:px-10 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <a
          href="#top"
          className="font-mono text-xs font-medium uppercase tracking-[0.25em]"
          onClick={() => setOpen(false)}
        >
          {t.monogram}
        </a>

        <nav className="hidden items-center gap-6 font-mono text-xs uppercase tracking-wide md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <Link href={otherHref} className="link text-foreground">
            {locale} / <span className="text-muted">{other}</span>
          </Link>
        </nav>

        <button
          className="font-mono text-xs uppercase tracking-wide md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t.nav.close : t.nav.menu}
        </button>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-background px-6 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-4xl font-medium tracking-tight"
          >
            {l.label}
          </a>
        ))}
        <Link
          href={otherHref}
          onClick={() => setOpen(false)}
          className="mt-4 font-mono text-xs uppercase tracking-wide text-muted"
        >
          {locale} / {other}
        </Link>
      </div>
    </>
  );
}

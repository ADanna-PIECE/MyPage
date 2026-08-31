"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

export default function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const other: Locale = locale === "es" ? "en" : "es";
  const otherHref = pathname.replace(`/${locale}`, `/${other}`) || `/${other}`;

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-rule bg-background/80 px-6 py-3 backdrop-blur md:px-10">
      <a href="#top" className="font-mono text-xs font-medium uppercase tracking-[0.2em]">
        {t.monogram}
      </a>
      <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wide">
        <a href="#work" className="hover:text-accent">{t.nav.work}</a>
        <a href="#about" className="hover:text-accent">{t.nav.about}</a>
        <a href="#contact" className="hover:text-accent">{t.nav.contact}</a>
        <Link href={otherHref} className="text-muted hover:text-foreground">
          {other}
        </Link>
      </nav>
    </header>
  );
}

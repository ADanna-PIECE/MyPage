import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="rule-t flex flex-col gap-3 px-6 py-8 font-mono text-xs uppercase tracking-wide text-muted md:flex-row md:items-center md:justify-between md:px-10">
      <span>
        © {year} {t.name}
      </span>
      <span>{t.footer.note}</span>
      <a href="#top" className="transition-colors hover:text-foreground">
        {t.footer.backToTop} ↑
      </a>
    </footer>
  );
}

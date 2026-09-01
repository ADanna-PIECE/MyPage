import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import Magnetic from "./Magnetic";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="rule-t overflow-hidden px-6 pb-8 pt-16 md:px-10 md:pt-24">
      <div className="pointer-events-none select-none text-[19vw] font-medium leading-[0.8] tracking-[-0.04em] text-foreground/[0.06] md:text-[15vw]">
        {t.name}
      </div>
      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 font-mono text-xs uppercase tracking-wide text-muted md:flex-row md:items-center md:justify-between">
        <span>
          © {year} {t.name}
        </span>
        <span>{t.footer.note}</span>
        <Magnetic strength={0.3}>
          <a href="#top" className="link transition-colors hover:text-foreground">
            {t.footer.backToTop} ↑
          </a>
        </Magnetic>
      </div>
    </footer>
  );
}

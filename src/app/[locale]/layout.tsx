import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import SmoothScroll from "@/components/SmoothScroll";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Grain from "@/components/Grain";
import Cursor from "@/components/Cursor";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "es");
  const title = `${t.name} — ${t.hero.role}`;
  const description = t.hero.intro.replace(/\*/g, "");
  return {
    // TODO(augusto): cambiá esto por tu dominio real cuando deployees
    metadataBase: new URL("https://augustodanna.vercel.app"),
    title,
    description,
    openGraph: { title, description, type: "website", locale },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <div className="scroll-progress" aria-hidden="true" />
        <Grain />
        <Cursor />
        <SmoothScroll>
          <SiteHeader locale={locale} />
          <main>{children}</main>
          <SiteFooter locale={locale} />
        </SmoothScroll>
      </body>
    </html>
  );
}

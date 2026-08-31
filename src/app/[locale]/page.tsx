import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Hero locale={locale} />
      <Work locale={locale} />
      <Reveal>
        <About locale={locale} />
      </Reveal>
      <Reveal>
        <Contact locale={locale} />
      </Reveal>
    </>
  );
}

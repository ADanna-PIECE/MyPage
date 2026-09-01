import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Wipe from "@/components/Wipe";

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
      <Wipe>
        <About locale={locale} />
      </Wipe>
      <Wipe>
        <Contact locale={locale} />
      </Wipe>
    </>
  );
}

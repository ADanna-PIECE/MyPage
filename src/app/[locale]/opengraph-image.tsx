import { ImageResponse } from "next/og";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Augusto D'Anna — AI Solutions & Full-Stack Developer";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "es");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#ededed",
          padding: 76,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#8a8a92",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>{t.hero.role}</span>
          <span>Buenos Aires</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              color: "#8b5cf6",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            {t.hero.status}
          </div>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>
            {t.name}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#9a9aa2", maxWidth: 900 }}>
          {t.hero.intro.replace(/\*/g, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}

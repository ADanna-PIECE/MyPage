import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "404 — Augusto D'Anna" };

export default function NotFound() {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        <main className="flex min-h-[100svh] flex-col justify-between px-6 py-10 md:px-10">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">
            Error 404
          </span>
          <div>
            <h1 className="text-[24vw] font-medium leading-none tracking-[-0.04em] text-accent text-glow md:text-[16vw]">
              404
            </h1>
            <p className="mt-6 max-w-md text-muted">
              Esta página no existe. Volvé al inicio.
            </p>
            <a
              href="/es"
              className="mt-8 inline-block font-mono text-xs uppercase tracking-wide text-accent underline decoration-accent underline-offset-4"
            >
              Volver al inicio ↗
            </a>
          </div>
          <span className="font-mono text-xs uppercase tracking-wide text-muted">
            Augusto D&apos;Anna
          </span>
        </main>
      </body>
    </html>
  );
}

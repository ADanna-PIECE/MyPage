import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

// Redirects `/` and any locale-less path to a locale-prefixed one.
// Language is guessed from the Accept-Language header, defaulting to Spanish.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const locale = accept.startsWith("en") ? "en" : defaultLocale;

  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  // Skip Next internals and anything with a file extension (assets).
  matcher: ["/((?!_next|.*\\..*).*)"],
};

import type { ReactNode } from "react";

// Passthrough root layout. <html>/<body> live in [locale]/layout.tsx so the
// `lang` attribute can follow the active locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

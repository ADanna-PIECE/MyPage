# Portfolio — Augusto Danna

Sitio personal para mostrar proyectos (videos + descripción) para LinkedIn.

- **Stack:** Next.js 16 · Tailwind v4 · Lenis (scroll suave) · GSAP ScrollTrigger · Framer Motion
- **Idiomas:** `/es` (default) y `/en` — diccionarios en `src/content/dictionary.ts`
- **Dirección visual:** Swiss (blanco, grilla, un acento naranja, números como composición)

## Correr en local

```bash
npm install
npm run dev
# abrir http://localhost:3000  (redirige a /es)
```

## Qué editar (todo marcado con `TODO(augusto)`)

| Qué | Archivo |
|---|---|
| Nombre, rol, bio, textos de secciones (ES + EN) | `src/content/dictionary.ts` |
| Proyectos: título, línea, rol, stack, links, id de YouTube | `src/content/projects.ts` |
| Mail, LinkedIn, GitHub, link al CV | `src/components/Contact.tsx` y `src/components/SiteFooter.tsx` |
| Foto (poné el archivo) | `public/` y usala en `src/components/About.tsx` |
| CV en PDF | poné `cv.pdf` en `public/` |
| Color de acento / tipografía | `src/app/globals.css` |

### Agregar el video de un proyecto

1. Subí el `.mp4` de OBS a YouTube como **"No listado"**.
2. Copiá el id del video (lo que va después de `watch?v=`).
3. Pegalo en `youtubeId` del proyecto en `src/content/projects.ts`.
4. El botón "Ver demo" y el modal aparecen solos.

## Deploy gratis (Vercel)

1. Subí el repo a GitHub (repo nuevo, privado o público).
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importá el repo.
3. Deploy. Queda en `https://<nombre>.vercel.app`.
4. Cada `git push` a `main` redeploya solo.

## Estructura

```
src/
  app/
    layout.tsx            passthrough (sin <html>)
    [locale]/layout.tsx   <html lang>, header, footer, smooth scroll
    [locale]/page.tsx     arma las secciones
    globals.css           tokens del tema Swiss
  proxy.ts                redirige / -> /es | /en según el navegador
  components/             Hero, Work (assembly al scroll), About, Contact, ...
  content/                dictionary.ts (textos), projects.ts (proyectos)
  lib/i18n.ts             locales
```

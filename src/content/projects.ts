import type { Locale } from "@/lib/i18n";

export type Project = {
  slug: string;
  title: string;
  year: string;
  /** YouTube video id (the part after `v=`). null = no demo video yet. */
  youtubeId: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  tagline: Record<Locale, string>;
  role: Record<Locale, string>;
  stack: string[];
  /** true = visible "replace me" slot, not shown as a real project. */
  placeholder?: boolean;
};

/*
  TODO(jimena): dejá Brocolix con sus datos reales (falta el youtubeId del
  video que grabaste con OBS: subilo a YouTube como "no listado" y pegá el id).
  Reemplazá los dos slots placeholder con proyectos reales o borralos.
*/
export const projects: Project[] = [
  {
    slug: "brocolix",
    title: "Brocolix",
    year: "2025",
    youtubeId: null,
    liveUrl: "https://brocolix.vercel.app",
    repoUrl: null,
    tagline: {
      es: "Plataforma para nutricionistas: seguimiento de pacientes entre consultas, con registro de comidas por foto y panel de adherencia.",
      en: "Platform for nutritionists: patient tracking between appointments, with photo-based food logging and an adherence dashboard.",
    },
    role: {
      es: "Diseño de producto y desarrollo full-stack",
      en: "Product design and full-stack development",
    },
    stack: ["Next.js", "TypeScript", "Vercel"],
  },
  {
    slug: "placeholder-2",
    title: "Proyecto 02",
    year: "—",
    youtubeId: null,
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "Slot de ejemplo. Reemplazá con un proyecto real: título, una línea, rol, stack y el link del video.",
      en: "Placeholder slot. Replace with a real project: title, one line, role, stack and the video link.",
    },
    role: { es: "—", en: "—" },
    stack: [],
    placeholder: true,
  },
  {
    slug: "placeholder-3",
    title: "Proyecto 03",
    year: "—",
    youtubeId: null,
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "Slot de ejemplo. Reemplazá o borrá este bloque en src/content/projects.ts.",
      en: "Placeholder slot. Replace or delete this entry in src/content/projects.ts.",
    },
    role: { es: "—", en: "—" },
    stack: [],
    placeholder: true,
  },
];

import type { Locale } from "@/lib/i18n";

/*
  TODO(jimena): todo lo de abajo es texto de ejemplo. Reemplazá:
  - name / role / heroIntro
  - about.body (tu bio real, 2-3 frases por idioma)
  - contact.email y los links en src/components/SiteFooter.tsx
*/

type Dictionary = {
  name: string;
  monogram: string;
  nav: { work: string; about: string; contact: string };
  hero: { role: string; intro: string; scrollCue: string };
  work: {
    kicker: string;
    heading: string;
    span: string;
    watchDemo: string;
    visitSite: string;
    sourceCode: string;
    roleLabel: string;
    stackLabel: string;
    placeholderNote: string;
  };
  about: { kicker: string; heading: string; body: string[] };
  contact: {
    kicker: string;
    heading: string;
    body: string;
    emailLabel: string;
    resumeLabel: string;
  };
  footer: { note: string; backToTop: string };
};

const es: Dictionary = {
  name: "Jimena Díaz Carrizo",
  monogram: "JDC",
  nav: { work: "Trabajos", about: "Sobre mí", contact: "Contacto" },
  hero: {
    role: "Desarrolladora full-stack",
    intro:
      "Diseño y construyo productos web de punta a punta — de la idea al deploy.",
    scrollCue: "Scrolleá",
  },
  work: {
    kicker: "Selección",
    heading: "Trabajos",
    span: "2023 — 2025",
    watchDemo: "Ver demo",
    visitSite: "Ver sitio",
    sourceCode: "Código",
    roleLabel: "Rol",
    stackLabel: "Stack",
    placeholderNote: "Espacio de ejemplo — reemplazar con un proyecto real.",
  },
  about: {
    kicker: "Sobre mí",
    heading: "Quién está detrás",
    body: [
      "Soy Jimena, desarrolladora enfocada en llevar ideas de producto hasta algo que la gente pueda usar.",
      "Trabajo cómoda en toda la pila: interfaz, lógica de negocio, base de datos y deploy.",
      "Este es un texto de ejemplo — reemplazalo con tu historia real.",
    ],
  },
  contact: {
    kicker: "Contacto",
    heading: "Trabajemos juntos",
    body: "¿Tenés un proyecto en mente o una vacante abierta? Escribime.",
    emailLabel: "Escribir un mail",
    resumeLabel: "Descargar CV",
  },
  footer: {
    note: "Hecho con Next.js — código abierto en GitHub.",
    backToTop: "Volver arriba",
  },
};

const en: Dictionary = {
  name: "Jimena Díaz Carrizo",
  monogram: "JDC",
  nav: { work: "Work", about: "About", contact: "Contact" },
  hero: {
    role: "Full-stack developer",
    intro: "I design and build web products end to end — from idea to deploy.",
    scrollCue: "Scroll",
  },
  work: {
    kicker: "Selected",
    heading: "Work",
    span: "2023 — 2025",
    watchDemo: "Watch demo",
    visitSite: "Visit site",
    sourceCode: "Source",
    roleLabel: "Role",
    stackLabel: "Stack",
    placeholderNote: "Placeholder slot — replace with a real project.",
  },
  about: {
    kicker: "About",
    heading: "Who is behind this",
    body: [
      "I'm Jimena, a developer focused on taking product ideas all the way to something people can actually use.",
      "I'm comfortable across the stack: interface, business logic, database and deployment.",
      "This is placeholder copy — swap it for your real story.",
    ],
  },
  contact: {
    kicker: "Contact",
    heading: "Let's work together",
    body: "Have a project in mind or a role open? Send me a message.",
    emailLabel: "Send an email",
    resumeLabel: "Download CV",
  },
  footer: {
    note: "Built with Next.js — source on GitHub.",
    backToTop: "Back to top",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

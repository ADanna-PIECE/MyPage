import type { Locale } from "@/lib/i18n";

/*
  Contenido real de Augusto D'Anna (de los dos CVs).
  TODO(augusto): ajustá la bio si querés otro tono. El posicionamiento del hero
  es "AI Solutions & Full-Stack Developer"; si preferís liderar como Quant,
  cambiá hero.role e intro.
*/

type Dictionary = {
  name: string;
  monogram: string;
  nav: { work: string; about: string; contact: string; menu: string; close: string };
  hero: {
    role: string;
    intro: string;
    scrollCue: string;
    status: string;
    tech: string[];
  };
  work: {
    kicker: string;
    heading: string;
    span: string;
    watchDemo: string;
    demoWithAudio: string;
    visitSite: string;
    sourceCode: string;
    roleLabel: string;
    stackLabel: string;
    more: string;
    moreNote: string;
    detail: { brief: string; approach: string; solution: string; extra: string };
    readMore: string;
    readLess: string;
  };
  process: {
    kicker: string;
    heading: string;
    steps: { n: string; title: string; body: string }[];
  };
  about: { kicker: string; heading: string; body: string[]; facts: string[] };
  contact: {
    kicker: string;
    heading: string;
    body: string;
    emailLabel: string;
    resumeLabel: string;
    copy: string;
    copied: string;
  };
  footer: { note: string; backToTop: string };
};

const TECH = [
  "Python",
  "Next.js",
  "Flask",
  "TypeScript",
  "GSAP",
  "Firebase",
  "MongoDB",
  "Google Cloud",
  "Claude",
  "Gemini Vision",
  "Apify",
  "MCP",
];

const es: Dictionary = {
  name: "Augusto D'Anna",
  monogram: "AD",
  nav: {
    work: "Proyectos",
    about: "Sobre mí",
    contact: "Contacto",
    menu: "Menú",
    close: "Cerrar",
  },
  hero: {
    role: "AI Solutions & Full-Stack Developer",
    intro:
      "Construyo *software B2B de punta a punta*: automatización con IA, orquestación de agentes y *análisis cuantitativo riguroso*.",
    scrollCue: "Scrolleá",
    status: "Disponible para proyectos",
    tech: TECH,
  },
  work: {
    kicker: "Selección",
    heading: "Proyectos",
    span: "2019 — 2026",
    watchDemo: "Ver demo",
    demoWithAudio: "explicada, con audio",
    visitSite: "Sitio en vivo",
    sourceCode: "Código",
    roleLabel: "Rol",
    stackLabel: "Stack",
    more: "Más trabajo",
    moreNote:
      "Estos son algunos. Hay varios proyectos más — de *automatización, data y producto* — que no entran en esta selección. Escribime y te muestro.",
    detail: {
      brief: "El pedido",
      approach: "Mi enfoque",
      solution: "La solución",
      extra: "Qué agregué",
    },
    readMore: "Ver detalle",
    readLess: "Ocultar",
  },
  process: {
    kicker: "Cómo trabajo",
    heading: "Del problema al sistema",
    steps: [
      {
        n: "01",
        title: "Entiendo el problema",
        body: "Me interiorizo, busco ideas y no doy nada por sentado hasta tenerlo claro.",
      },
      {
        n: "02",
        title: "Elijo la forma",
        body: "Decido si conviene automatizarlo de punta a punta o sumarle un asistente — lo que resuelva mejor.",
      },
      {
        n: "03",
        title: "Hablo con los resultados",
        body: "Valido contra datos reales, no contra supuestos. Si un número no cierra, vuelvo atrás.",
      },
    ],
  },
  about: {
    kicker: "Sobre mí",
    heading: "Diseño y llevo productos de punta a punta",
    body: [
      "Ingeniero de software enfocado en *desarrollo de sistemas y soluciones B2B*, workflows de automatización con IA y arquitectura de datos.",
      "Vengo de *siete años en mercados de capitales* (forex y cripto), donde validé cada estrategia con separación in-sample/out-of-sample, análisis de sensibilidad y costos de transacción reales. Sumo tres años como analista contable y financiero.",
      "Trabajo con *desarrollo asistido por IA*: orquesto agentes (Claude, Gemini), aplico MCP y skills propias para mantener el *código lean* y listo para producción. Estudiante avanzado de *Sistemas de Información en la UBA*.",
      "Mi manera de resolver: primero entiendo bien el problema, busco ideas y me interiorizo, y recién ahí decido si conviene *automatizarlo o sumarle un asistente*. No me confío de un supuesto — hablo con los resultados.",
    ],
    facts: [
      "7 años operando mercados de capitales (forex y cripto)",
      "Superé varias evaluaciones de prop firms y generé varios payouts",
      "Gestioné capital propio y de varios clientes con el mismo proceso de validación de riesgo",
      "Partner y expositor de BingX en varias oportunidades (2022–2023)",
      "Machine Learning (Stanford Specialization) · SQL y NoSQL",
      "Estudiante avanzado — Sistemas de Información, UBA",
    ],
  },
  contact: {
    kicker: "Contacto",
    heading: "Trabajemos juntos",
    body: "¿Tenés un proyecto B2B, una automatización o una vacante? Escribime.",
    emailLabel: "Mail",
    resumeLabel: "Descargar CV",
    copy: "copiar",
    copied: "Copiado ✓",
  },
  footer: {
    note: "Hecho con Next.js — código abierto en GitHub.",
    backToTop: "Volver arriba",
  },
};

const en: Dictionary = {
  name: "Augusto D'Anna",
  monogram: "AD",
  nav: {
    work: "Work",
    about: "About",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
  },
  hero: {
    role: "AI Solutions & Full-Stack Developer",
    intro:
      "I build *B2B software end to end*: AI automation, agent orchestration, and *rigorous quantitative analysis*.",
    scrollCue: "Scroll",
    status: "Available for projects",
    tech: TECH,
  },
  work: {
    kicker: "Selected",
    heading: "Work",
    span: "2019 — 2026",
    watchDemo: "Watch demo",
    demoWithAudio: "narrated, with audio",
    visitSite: "Live site",
    sourceCode: "Source",
    roleLabel: "Role",
    stackLabel: "Stack",
    more: "More work",
    moreNote:
      "These are a few. There are several more — *automation, data and product* — that don't fit this selection. Message me and I'll walk you through them.",
    detail: {
      brief: "The brief",
      approach: "My approach",
      solution: "The solution",
      extra: "What I added",
    },
    readMore: "Read detail",
    readLess: "Hide",
  },
  process: {
    kicker: "How I work",
    heading: "From problem to system",
    steps: [
      {
        n: "01",
        title: "I understand the problem",
        body: "I dig in, look for ideas, and take nothing for granted until it's clear.",
      },
      {
        n: "02",
        title: "I pick the approach",
        body: "I decide whether to automate it end to end or add an assistant — whatever solves it better.",
      },
      {
        n: "03",
        title: "I talk to the results",
        body: "I validate against real data, not assumptions. If a number doesn't add up, I go back.",
      },
    ],
  },
  about: {
    kicker: "About",
    heading: "I design and ship products end to end",
    body: [
      "Software engineer focused on *systems and B2B solution development*, AI automation workflows, and data architecture.",
      "I come from *seven years in capital markets* (forex and crypto), where I validated every strategy with in-sample/out-of-sample separation, parameter sensitivity analysis, and real transaction costs. Plus three years as an accounting and financial analyst.",
      "I work with *AI-assisted development*: orchestrating agents (Claude, Gemini), applying MCP and custom skills to keep *code lean* and production-ready. Advanced *Information Systems student at UBA*.",
      "How I solve things: I get the problem clearly, look for ideas and dig in, and only then decide whether to *automate it or add an assistant*. I don't trust an assumption — I talk to the results.",
    ],
    facts: [
      "7 years trading capital markets (forex and crypto)",
      "Passed several prop-firm evaluations and earned multiple payouts",
      "Managed my own and several clients' capital with the same risk-validation process",
      "BingX partner and speaker on several occasions (2022–2023)",
      "Machine Learning (Stanford Specialization) · SQL and NoSQL",
      "Advanced student — Information Systems, UBA",
    ],
  },
  contact: {
    kicker: "Contact",
    heading: "Let's work together",
    body: "Have a B2B project, an automation, or a role open? Send me a message.",
    emailLabel: "Mail",
    resumeLabel: "Download CV",
    copy: "copy",
    copied: "Copied ✓",
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

import type { Locale } from "@/lib/i18n";

export type Project = {
  slug: string;
  title: string;
  /** Año o rango. "" = no mostrar. */
  year: string;
  /** YouTube video id (lo que va después de `v=`). null = sin demo todavía. */
  youtubeId: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  tagline: Record<Locale, string>;
  role: Record<Locale, string>;
  stack: string[];
  placeholder?: boolean;
};

/*
  TODO(augusto):
  - Confirmá años, y qué proyecto tiene sitio en vivo / repo público.
  - Subí cada demo a YouTube como "No listado" y pegá el id en `youtubeId`.
  - Reordená o borrá los que no quieras mostrar.
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
      es: "Plataforma B2B para nutricionistas. Registro de comidas por foto con IA de visión (NutriCam), generación automática de rutinas (FitCam) y panel de adherencia de pacientes en tiempo real.",
      en: "B2B platform for nutritionists. Photo-based food logging with vision AI (NutriCam), automated workout generation (FitCam), and a real-time patient-adherence dashboard.",
    },
    role: {
      es: "Diseño de producto y desarrollo full-stack",
      en: "Product design and full-stack development",
    },
    stack: ["Next.js", "Firebase", "Vision AI", "Vercel"],
  },
  {
    slug: "growth-content-factory",
    title: "Growth Content Factory",
    year: "",
    youtubeId: null,
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "Arquitectura agéntica multi-API para ingeniería inversa de contenido viral. Extracción masiva con Apify, un loop de validación concurrente contra tres APIs de base de datos para elegir los mejores datos sin duplicados, y cascadas de contenido generadas por LLMs (guiones, hilos, imágenes).",
      en: "Multi-API agentic architecture for reverse-engineering viral content. Mass extraction via Apify, a concurrent validation loop across three database APIs to pick the best data with no duplicates, and LLM-generated content cascades (scripts, threads, images).",
    },
    role: {
      es: "Arquitectura y desarrollo — sistema multi-cliente con tests unitarios, e2e e integración",
      en: "Architecture and development — multi-client system with unit, e2e and integration tests",
    },
    stack: ["Python", "Apify", "Multi-LLM", "MongoDB"],
  },
  {
    slug: "algocode",
    title: "ALGOCODE",
    year: "",
    youtubeId: null,
    liveUrl: null,
    repoUrl: "https://github.com/ADanna-PIECE/ALGOCODE",
    tagline: {
      es: "Framework cuantitativo en Flask para backtesting histórico. Motor walk-forward para validación institucional (in-sample/out-of-sample) y mitigación de overfitting, pipelines ETL de series temporales OHLCV e indicadores propios en Pine Script y Python.",
      en: "Flask quantitative framework for historical backtesting. Walk-forward engine for institutional validation (in-sample/out-of-sample) and overfitting mitigation, OHLCV time-series ETL pipelines, and custom Pine Script and Python indicators.",
    },
    role: { es: "Desarrollo individual", en: "Solo build" },
    stack: ["Python", "Flask", "Pandas / NumPy", "Pine Script"],
  },
  {
    slug: "visual-analyzer",
    title: "Visual Analyzer",
    year: "",
    youtubeId: null,
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "Herramienta activada por hotkey (F9): captura la pantalla y usa un modelo de visión (Gemini) para extraer automáticamente los datos de los trades marcados en el gráfico hacia un dashboard local en Flask, con métricas por sesión horaria.",
      en: "Hotkey-triggered tool (F9): captures the screen and uses a vision model (Gemini) to automatically extract data from chart-annotated trades into a local Flask dashboard, with hourly-session metrics.",
    },
    role: { es: "Desarrollo individual", en: "Solo build" },
    stack: ["Python", "Gemini Vision", "Flask"],
  },
  {
    slug: "trading-performance-tracker",
    title: "Trading Performance Tracker",
    year: "",
    youtubeId: null,
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "Dashboard interactivo en tiempo real: calendario de P/L, estadísticas por setup, día y hora, curva de equidad y un módulo de IA (Claude) que analiza patrones de comportamiento de forma continua.",
      en: "Real-time interactive dashboard: P/L calendar, stats by setup, day and time, equity curve, and an AI module (Claude) that continuously analyzes behavioral patterns.",
    },
    role: { es: "Desarrollo individual", en: "Solo build" },
    stack: ["Next.js", "Python", "Claude API"],
  },
  {
    slug: "bank-reconciliation",
    title: "Automated Bank Reconciliation",
    year: "",
    youtubeId: null,
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "Cruza facturas en PDF contra el extracto bancario y concilia automáticamente, combinando extracción de texto e IA.",
      en: "Cross-checks PDF invoices against bank statements and reconciles automatically, combining text extraction and AI.",
    },
    role: { es: "Desarrollo individual", en: "Solo build" },
    stack: ["Python", "LLM APIs", "PDF parsing"],
  },
];

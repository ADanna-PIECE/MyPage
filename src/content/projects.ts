import type { Locale } from "@/lib/i18n";

export type ProjectDetail = {
  brief: Record<Locale, string>;
  approach: Record<Locale, string>;
  solution: Record<Locale, string>;
  extra: Record<Locale, string>;
};

export type Project = {
  slug: string;
  title: string;
  /** loop mudo corto en public/preview/ — se muestra en el panel */
  previewVideo: string | null;
  /** id de YouTube (No listado) de la demo completa — tiene prioridad, trae subtítulos */
  youtubeId: string | null;
  /** demo self-hosteada en public/demo/ — fallback si no hay youtubeId */
  demoVideo: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  tagline: Record<Locale, string>;
  role: Record<Locale, string>;
  stack: string[];
  detail: ProjectDetail | null;
  /** true = bloque completo con visual + animación. false = lista compacta "Más trabajo". */
  featured?: boolean;
};

/*
  TODO(augusto):
  - Los `detail` de abajo son un BORRADOR que armé desde tu CV y los videos.
    Revisalos y corregilos — puedo haber inventado detalles del pedido/cliente.
  - Growth Content Factory está deployada con login: pasá la URL si querés
    linkearla con nota "(acceso privado)".
  - youtubeId: subí cada demo a YouTube "No listado" y pegá el id acá (trae subtítulos).
  - Demos self-hosteadas en public/demo/ como fallback.
*/
export const projects: Project[] = [
  {
    slug: "brocolix",
    title: "Brocolix",
    featured: true,
    previewVideo: "/preview/brocolix.mp4",
    youtubeId: null,
    demoVideo: "/demo/brocolix.mp4",
    liveUrl: "https://brocolix.vercel.app",
    repoUrl: null,
    tagline: {
      es: "*Plataforma B2B para nutricionistas*. Registro de comidas por foto con *IA de visión* (NutriCam), generación automática de rutinas (FitCam) y *panel de adherencia* de pacientes en tiempo real.",
      en: "*B2B platform for nutritionists*. Photo-based food logging with *vision AI* (NutriCam), automated workout generation (FitCam), and a real-time *patient-adherence dashboard*.",
    },
    role: {
      es: "Diseño de producto y desarrollo full-stack",
      en: "Product design and full-stack development",
    },
    stack: ["Next.js", "Firebase", "Vision AI", "Vercel"],
    detail: {
      brief: {
        es: "El nutricionista pierde el hilo del paciente entre consulta y consulta: no sabe qué come, si entrena, ni cómo va la adherencia.",
        en: "Nutritionists lose track of the patient between appointments — what they eat, whether they train, how adherence is going.",
      },
      approach: {
        es: "Un ecosistema donde el paciente registra todo desde el celular y el profesional lo ve en tiempo real, con IA que le saca la fricción de cargar datos.",
        en: "An ecosystem where the patient logs everything from their phone and the practitioner sees it live, with AI removing the friction of data entry.",
      },
      solution: {
        es: "Dos apps para el paciente (NutriCam para comidas por foto, FitCam para entrenamiento) sincronizadas con un panel para el nutricionista con alertas de adherencia.",
        en: "Two patient apps (NutriCam for photo food logging, FitCam for training) synced to a practitioner dashboard with adherence alerts.",
      },
      extra: {
        es: "Modelo de negocio por paciente activo en vez de licencia fija, y generación automática de planes y rutinas.",
        en: "A per-active-patient pricing model instead of a fixed license, plus automated meal-plan and routine generation.",
      },
    },
  },
  {
    slug: "growth-content-factory",
    title: "Growth Content Factory",
    featured: true,
    previewVideo: "/preview/growth-content-factory.mp4",
    youtubeId: null,
    demoVideo: "/demo/growth-content-factory.mp4",
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "*Arquitectura agéntica multi-API* para ingeniería inversa de contenido viral. Extracción masiva con Apify, un *loop de validación concurrente* contra tres APIs de base de datos para elegir los mejores datos sin duplicados, y *cascadas de contenido generadas por LLMs* (guiones, hilos, imágenes).",
      en: "*Multi-API agentic architecture* for reverse-engineering viral content. Mass extraction via Apify, a *concurrent validation loop* across three database APIs to pick the best data with no duplicates, and *LLM-generated content cascades* (scripts, threads, images).",
    },
    role: {
      es: "Arquitectura y desarrollo — sistema multi-cliente con tests unitarios, e2e e integración",
      en: "Architecture and development — multi-client system with unit, e2e and integration tests",
    },
    stack: ["Python", "Apify", "Multi-LLM", "MongoDB"],
    detail: {
      brief: {
        es: "Una agencia necesitaba producir contenido a escala sin perder lo que funciona en el nicho de cada cliente.",
        en: "An agency needed to produce content at scale without losing what works in each client's niche.",
      },
      approach: {
        es: "Ingeniería inversa: primero entender qué contenido rinde en cada nicho, después generar variantes a partir de esos patrones.",
        en: "Reverse-engineering: first understand what content performs in each niche, then generate variants from those patterns.",
      },
      solution: {
        es: "Extracción masiva con Apify, validación concurrente contra tres APIs para quedarse con lo mejor sin duplicados, y LLMs generando la cascada completa (guion, hilo, carrusel, newsletter).",
        en: "Mass extraction with Apify, concurrent validation across three APIs to keep the best with no duplicates, and LLMs generating the full cascade (script, thread, carousel, newsletter).",
      },
      extra: {
        es: "Arquitectura multi-cliente con tests unitarios, e2e e integración.",
        en: "Multi-client architecture with unit, e2e and integration tests.",
      },
    },
  },
  {
    slug: "algocode",
    title: "ALGOCODE",
    featured: true,
    previewVideo: null,
    youtubeId: null,
    demoVideo: "/demo/algocode.mp4",
    liveUrl: null,
    repoUrl: "https://github.com/ADanna-PIECE/ALGOCODE",
    tagline: {
      es: "*Framework cuantitativo en Flask* para backtesting histórico. *Motor walk-forward* para validación institucional (in-sample/out-of-sample) y mitigación de overfitting, *pipelines ETL* de series temporales OHLCV e indicadores propios en Pine Script y Python.",
      en: "*Flask quantitative framework* for historical backtesting. *Walk-forward engine* for institutional validation (in-sample/out-of-sample) and overfitting mitigation, OHLCV time-series *ETL pipelines*, and custom Pine Script and Python indicators.",
    },
    role: { es: "Desarrollo individual", en: "Solo build" },
    stack: ["Python", "Flask", "Pandas / NumPy", "Pine Script"],
    detail: {
      brief: {
        es: "Necesitaba validar estrategias de trading con rigor institucional, no con backtests que sobreajustan.",
        en: "I needed to validate trading strategies with institutional rigor, not with backtests that overfit.",
      },
      approach: {
        es: "Separar in-sample de out-of-sample desde el principio, y medir la sensibilidad a parámetros vecinos antes de confiar en un resultado.",
        en: "Separate in-sample from out-of-sample from the start, and measure sensitivity to neighboring parameters before trusting a result.",
      },
      solution: {
        es: "Un framework en Flask con motor walk-forward, pipelines ETL para series OHLCV e indicadores propios en Pine Script y Python.",
        en: "A Flask framework with a walk-forward engine, ETL pipelines for OHLCV series, and custom Pine Script and Python indicators.",
      },
      extra: {
        es: "Cálculo automático de métricas de riesgo: Sharpe, Sortino, Calmar, máximo drawdown y períodos underwater.",
        en: "Automatic risk-metric calculation: Sharpe, Sortino, Calmar, max drawdown and underwater periods.",
      },
    },
  },
  {
    slug: "trading-performance-tracker",
    title: "Trading Performance Tracker",
    featured: true,
    previewVideo: "/preview/trading-performance-tracker.mp4",
    youtubeId: null,
    demoVideo: "/demo/trading-performance-tracker.mp4",
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "*Dashboard interactivo en tiempo real*: calendario de P/L, estadísticas por setup, día y hora, curva de equidad y un *módulo de IA (Claude)* que analiza patrones de comportamiento de forma continua.",
      en: "*Real-time interactive dashboard*: P/L calendar, stats by setup, day and time, equity curve, and an *AI module (Claude)* that continuously analyzes behavioral patterns.",
    },
    role: { es: "Desarrollo individual", en: "Solo build" },
    stack: ["Next.js", "Python", "Claude API"],
    detail: {
      brief: {
        es: "Llevar un diario de trading a mano no escala y no muestra los patrones reales de comportamiento.",
        en: "Keeping a trading journal by hand doesn't scale and doesn't reveal the real behavioral patterns.",
      },
      approach: {
        es: "Registrar cada trade con su contexto (setup, día, hora) y dejar que la data muestre dónde se gana y dónde se pierde.",
        en: "Log every trade with its context (setup, day, time) and let the data show where you win and where you lose.",
      },
      solution: {
        es: "Un dashboard con calendario de P/L, estadísticas por setup / día / hora y curva de equidad.",
        en: "A dashboard with a P/L calendar, stats by setup / day / time, and an equity curve.",
      },
      extra: {
        es: "Un módulo de IA (Claude) que analiza patrones de comportamiento de forma continua.",
        en: "An AI module (Claude) that continuously analyzes behavioral patterns.",
      },
    },
  },
  {
    slug: "visual-analyzer",
    title: "Visual Analyzer",
    featured: true,
    previewVideo: "/preview/visual-analyzer.mp4",
    youtubeId: null,
    demoVideo: "/demo/visual-analyzer.mp4",
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "*Bitácora de backtesting con captura automática*. Una hotkey toma una screenshot del gráfico y un *modelo de visión (Gemini)* extrae los datos de cada trade marcado hacia un dashboard local en Flask, con *RR óptimo por símbolo* y métricas por sesión horaria.",
      en: "*Backtesting journal with automatic capture*. A hotkey screenshots the chart and a *vision model (Gemini)* extracts each annotated trade into a local Flask dashboard, with *optimal RR per symbol* and hourly-session metrics.",
    },
    role: { es: "Desarrollo individual", en: "Solo build" },
    stack: ["Python", "Gemini Vision", "Flask"],
    detail: {
      brief: {
        es: "Cargar a mano los datos de cada trade de un backtest es lento y propenso a errores.",
        en: "Entering each backtest trade's data by hand is slow and error-prone.",
      },
      approach: {
        es: "Que la máquina lea el gráfico: una captura y un modelo de visión que extrae los datos solo.",
        en: "Let the machine read the chart: one screenshot and a vision model that extracts the data on its own.",
      },
      solution: {
        es: "Una hotkey toma la screenshot, Gemini extrae los datos del trade marcado, y todo va a un dashboard local en Flask.",
        en: "A hotkey takes the screenshot, Gemini extracts the annotated trade's data, and it all goes to a local Flask dashboard.",
      },
      extra: {
        es: "RR óptimo por símbolo y métricas por sesión horaria, calculadas sobre el historial completo.",
        en: "Optimal RR per symbol and hourly-session metrics, computed over the full history.",
      },
    },
  },
  {
    slug: "bank-reconciliation",
    title: "Automated Bank Reconciliation",
    previewVideo: null,
    youtubeId: null,
    demoVideo: null,
    liveUrl: null,
    repoUrl: null,
    tagline: {
      es: "Cruza facturas en PDF contra el extracto bancario y *concilia automáticamente*, combinando extracción de texto e IA.",
      en: "Cross-checks PDF invoices against bank statements and *reconciles automatically*, combining text extraction and AI.",
    },
    role: { es: "Desarrollo individual", en: "Solo build" },
    stack: ["Python", "LLM APIs", "PDF parsing"],
    detail: null,
  },
];

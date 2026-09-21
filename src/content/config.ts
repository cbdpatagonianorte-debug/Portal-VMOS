import { z, defineCollection } from 'astro:content';

/**
 * Categorías editoriales del portal Faro Energético / Noticias VMOS.
 * Mapean 1:1 con los tokens de navegación del Header y los badges de NewsCard.
 */
const CATEGORIAS = [
  'Economía & Energía',
  'Sierra Grande',
  'Playas Doradas',
  'Punta Colorada & VMOS',
  'Río Negro',
  'Medio Ambiente',
  'Logística',
  'Legislación',
  'Empleo Técnico',
  'Comunidad',
] as const;

/**
 * Alcance geográfico de la nota.
 */
const ALCANCE = [
  'Municipal',
  'Provincial',
  'Nacional',
  'Internacional',
] as const;

/**
 * Variante de tarjeta sugerida al renderizar en portada.
 * - hero   → columna central, imagen 16:9 con KPIs
 * - trend  → columna izquierda "En Foco", imagen 16:10
 * - wire   → columna derecha "Despachos", solo texto
 */
const VARIANTE_CARD = ['hero', 'trend', 'wire'] as const;

// ─── Esquema de la colección "noticias" ────────────────────────────────────────
const noticiasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Cabecera editorial
    title: z.string().max(120),
    description: z.string().max(300),
    category: z.enum(CATEGORIAS),
    scope: z.enum(ALCANCE),

    // Temporal
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),

    // Metadatos editoriales
    author: z.string().default('Redacción Faro Energético'),
    /** Sección del portal: label del badge naranja */
    section: z.string().optional(),
    /** Etiqueta del badge dorado (ej. "EXCLUSIVO / VMOS", "INFORME ESPECIAL") */
    tag: z.string().optional(),
    /** Tiempo estimado de lectura en minutos */
    readingMinutes: z.number().int().positive().optional(),

    // Imagen de portada
    coverImage: z.object({
      url: z.string().url().or(z.string().regex(/^\/.*/)),
      alt: z.string(),
      credit: z.string().optional(),
    }).optional(),

    // Opciones de presentación en portada
    /** Variante de NewsCard recomendada para mostrar en portada */
    cardVariant: z.enum(VARIANTE_CARD).default('trend'),
    /** Marca la noticia como "último momento" (activa live-pulse en badge) */
    isBreaking: z.boolean().default(false),
    /** Orden numérico dentro de la sección "En Foco" (1–5) */
    featuredOrder: z.number().int().min(1).max(5).optional(),

    // KPIs opcionales (solo útiles en hero)
    kpis: z.array(
      z.object({
        icon: z.string(),    // nombre del Material Symbol
        label: z.string(),
        value: z.string(),
      })
    ).max(4).optional(),

    // Fuentes periodísticas
    sources: z.array(z.string()).min(1),

    // SEO
    /** Descripción SEO alternativa; si se omite usa `description` */
    metaDescription: z.string().max(160).optional(),
    /** Tags para agrupar noticias relacionadas */
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  noticias: noticiasCollection,
};
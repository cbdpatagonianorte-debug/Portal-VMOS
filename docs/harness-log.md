# Harness Log — Registro de Fallos Reales

## 2026-09-23 | Imagen duplicada en artículo
- **Archivo:** `src/content/noticias/terminal-portuaria-vmos-punta-colorada.md`
- **Fallo:** La imagen se declaraba en `image` (frontmatter) y también como `![...](/gallery/...)` en el cuerpo, generando duplicado visual.
- **Solución:** Eliminar referencia interna; la plantilla renderiza `image` automáticamente.
- **Regla:** Nunca repetir la imagen de portada dentro del cuerpo Markdown.

## 2026-09-23 | Validación de esquema: `scope` en minúsculas
- **Archivo:** `src/content/noticias/terminal-portuaria-vmos-punta-colorada.md`
- **Fallo:** `scope: "provincial"` no pasaba la validación de Zod (el enum requiere `"Provincial"`).
- **Solución:** Corregir a `scope: "Provincial"`.
- **Regla:** Respetar el enum exacto de `src/content/config.ts` para `scope` y `category`.

## 2026-09-23 | Botón PDF visible en notas sin `isReport`
- **Archivo:** `src/pages/noticias/[slug].astro`
- **Fallo:** El botón "Descargar PDF" se renderizaba para todas las notas, incluso sin `isReport: true`.
- **Solución:** Envolver en `{isReport && (...)}` y asegurar que el schema incluya `isReport: z.boolean().default(false)`.
- **Regla:** El botón PDF solo se muestra si `entry.data.isReport === true`.

## 2026-09-23 | Grid de categoría con layouts mixtos
- **Archivo:** `src/pages/categoria/[categoria].astro`, `src/components/NewsCard.astro`
- **Fallo:** La primera tarjeta usaba `variant="hero"` con imagen pequeña superpuesta; las secundarias usaban `variant="trend"`. Diseño inconsistente.
- **Solución:** Introducir variante `list` unificada y aplicarla a todas las tarjetas de la grilla.
- **Regla:** Todas las tarjetas de `categoria/[categoria].astro` deben compartir la misma estructura visual.

## 2026-09-23 | Bloques ASCII con fondo oscuro
- **Archivo:** `src/pages/noticias/[slug].astro`
- **Fallo:** Los bloques ```text se renderizaban con fondo oscuro por Tailwind Typography.
- **Solución:** Agregar CSS con mayor especificidad (`.prose pre`, `article pre`, `pre`) y utilities `prose-pre:bg-slate-50 prose-pre:text-slate-900`.
- **Regla:** Forzar fondo claro en `<pre>` dentro de artículos mediante CSS de página, no por clase invert.

# Arquitectura del Portal VMOS & Sierra Grande

## Capas

### Frontend
- Framework: Astro v4 (SSG/SSR)
- Estilos: Tailwind CSS con tokens semánticos
- Componentes: `src/components/Header.astro`, `src/components/NewsCard.astro`
- Páginas: `src/pages/index.astro`, `src/pages/categoria/[categoria].astro`, `src/pages/noticias/[slug].astro`

### Content Layer
- CMS: Astro Content Collections
- Schema: `src/content/config.ts` (Zod)
- Noticias: `src/content/noticias/*.md`
- Validación: `isReport`, `category`, `scope`, `image`

### Backend (Objetivo)
- API REST en Express (puerto 3000)
- Base de datos para metadatos de noticias y usuarios
- CORS configurado para dominio del portal

### Agent Harness
- Orquestador: `.agents/agents/editor-lead.md`
- Escritor: `.agents/agents/vmos-energy-writer.md`
- Ingesta: `.agents/agents/news-ingestion.md`
- Dev: `.agents/agents/fullstack-dev.md`

## Dominios de Noticias
- `Economía & Energía`: VMOS, Vaca Muerta, exportación, inversión.
- `Punta Colorada & VMOS`: terminal portuaria, monoboyas, campañas marinas.
- `Río Negro`: política provincial, regulación energética.
- `Sierra Grande`: local, industria, empleo.
- `Playas Doradas`: turismo, desarrollo habitacional.

## Flujo de Publicación
1. `news-ingestion` extrae información de fuentes oficiales.
2. `vmos-energy-writer` redacta el `.md` respetando `news-schema`.
3. `editor-lead` valida contra `editorial-principles.md` y `harness-log.md`.
4. `fullstack-dev` despliega y verifica maquetación.

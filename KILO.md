# Contexto del Proyecto: Portal de Noticias VMOS & Sierra Grande

## Agent Harness
El proyecto usa un equipo de agentes especializados definidos en `.agents/agents/`:
- `editor-lead`: Orquestador y evaluador de calidad.
- `vmos-energy-writer`: Redactor técnico especializado.
- `news-ingestion`: Ingesta y extracción de fuentes.
- `fullstack-dev`: Desarrollo frontend/backend.

## Skills Disponibles
- `vmos-energy-taxonomy`: Taxonomía del sector energético.
- `news-schema`: Schema y reglas de validación de noticias.

## Esquema de Noticias (`src/content/config.ts`)
Cada `.md` debe incluir: `title`, `category`, `scope`, `publishedAt`, `sources`, `image`.
Categorías válidas: `Economía & Energía`, `Punta Colorada & VMOS`, `Río Negro`, `Sierra Grande`, `Playas Doradas`.
Scope válido: `Municipal`, `Provincial`, `Nacional`, `Internacional`.

## Stack
- Frontend: Astro v4 + Tailwind CSS.
- Content: Astro Content Collections con Zod.
- Backend objetivo: Express en puerto 3000.

## Comandos
- Desarrollo: `npm run dev`
- Build: `npm run build`
- Sensor: `scripts/checks/fast.sh`
- Guardia: `scripts/checks/guard-command.sh`
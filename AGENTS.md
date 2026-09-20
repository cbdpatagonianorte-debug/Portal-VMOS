# AGENTS.md - Portal Informativo VMOS & Sierra Grande

## Setup Commands
- Instalar dependencias: `npm install`
- Servidor de desarrollo: `npm run dev`
- Compilar proyecto: `npm run build`

## Stack de Desarrollo Actual del Front-End
- **Framework:** Astro v4
- **Estilos:** Tailwind CSS (con tokens semánticos de Stitch configurados en `tailwind.config.js`)
- **Página Principal:** `src/pages/index.astro`
- **Componentes Creados:**
  - `src/components/Header.astro` (Maneja barra utilitaria, ticker de Brent Oil, menú institucional y navegación)
  - `src/components/NewsCard.astro` (Componente modular para las tarjetas de noticias)

## Code Style & Standards
- TypeScript estricto / React / Tailwind CSS
- Estructura de Noticias: Titular, Bajada, Cuerpos de Texto, Alcance Geográfico y Fuentes

## Testing Instructions
- Ejecutar pruebas: `npm test`
- Validar linters: `npm run lint`

## Skills Disponibles
Para taxonomía energética y formatos de noticias, consultar `.opencode/skills/` o `.agents/skills/`.
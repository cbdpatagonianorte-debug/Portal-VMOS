# Contexto del Proyecto: Portal de Noticias Integrales y Regionales

## Esquema Estricto de Noticias (`src/content/config.ts`)

Cada noticia `.md` en `src/content/noticias/` debe contener:

- `title`: string (máx 80 caracteres)
- `summary`: string
- `category`: Enum (Secciones temáticas del portal)
  - `Politica`
  - `Economia`
  - `Sociedad`
  - `Deportes`
  - `Cultura`
  - `VMOS_Energia`
  - `Sierra_Grande`
  - `Playas_Doradas`
  - `Rio_Negro`
- `scope`: Enum (Nivel de cobertura territorial)
  - `Municipal`
  - `Provincial`
  - `Nacional`
  - `Internacional`
- `sources`: array de strings (URLs o agencias)
- `publishedAt`: date
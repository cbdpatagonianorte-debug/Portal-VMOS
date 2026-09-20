---
name: news-schema
description: Estructura JSON para la generación y validación de artículos periodísticos en el portal VMOS & Sierra Grande.
---

## Esquema del Artículo

Cada noticia debe estructurarse según el siguiente esquema JSON y se representa en un archivo `.md` con frontmatter:

```json
{
  "title": "String (Máx 80 caracteres)",
  "summary": "String (Bajada periodística)",
  "content": "String (Markdown)",
  "category": "Enum('VMOS_Energia', 'Sierra_Grande', 'Playas_Doradas', 'Rio_Negro', 'Nacional_Internacional')",
  "scope": "Enum('Municipal', 'Provincial', 'Nacional', 'Internacional')",
  "sources": "Array de URLs o nombres de entidades citadas",
  "publishedAt": "ISO 8601 Date"
}
```

## Reglas de Validación
- `title`: Máximo 80 caracteres, obligatorio.
- `summary`: Bajada informativa, una a dos líneas.
- `category`: Debe ser uno de los valores del enum definido en `vmos-energy-taxonomy`.
- `scope`: Clasificación geográfica según el alcance de la noticia.
- `sources`: Array no vacío con URLs o entidades de referencia.
- `publishedAt`: Fecha en formato ISO 8601 (YYYY-MM-DD).

## Ejemplo de Frontmatter Markdown

```yaml
---
title: "Titular de la noticia aquí"
summary: "Bajada periodística que resume el contenido."
category: "VMOS_Energia"
scope: "Provincial"
publishedAt: "2024-01-15"
sources: ["https://ejemplo.com", "Entidad citada"]
---
```
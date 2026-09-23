---
name: news-publish
description: Publica una noticia validada en el portal. Solo ejecutar después de news-validate.
---
# Publicar Noticia

Pasos:
1. Confirmar que `scripts/checks/fast.sh` pasa.
2. Confirmar que `editor-lead` aprobó.
3. Mover/guardar archivo en `src/content/noticias/`.
4. Commit con mensaje editorial.
5. `npm run dev` para verificar en local.
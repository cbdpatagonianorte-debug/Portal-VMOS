---
name: news-validate
description: Valida una noticia contra el schema y las reglas editoriales antes de publicar.
---
# Validar Noticia

Ejecuta en orden:
1. `scripts/checks/fast.sh`
2. Verificación manual de `docs/editorial-principles.md`
3. Confirmación de `editor-lead`

Si pasa, la noticia está lista para `news-publish`.
# Portal de Noticias VMOS & Sierra Grande

## Comandos Principales
- Instalar dependencias: `npm install`
- Servidor dev: `npm run dev`
- Verificación rápida (Sensor): `scripts/checks/fast.sh`

## Trampas Conocidas & Reglas
- No publicar directamente a la base de datos sin pasar por la validación del JSON Schema.
- El servidor backend escucha en el puerto 3000. No alterar los headers de CORS.
- Toda nota de Sierra Grande o Playas Doradas debe incluir la etiqueta de ámbito (`Municipal` o `Provincial`).

## Punteros de Conocimiento
- Arquitectura web: docs/ARCHITECTURE.md
- Guía de redacción y tono: docs/editorial-principles.md
- Registro de errores corregidos: docs/harness-log.md
- Definición de agentes del equipo: .agents/agents/
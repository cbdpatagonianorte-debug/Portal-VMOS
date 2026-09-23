#!/usr/bin/env bash
# El Sensor Silencioso — validación ligera y silenciosa.
# Exit 0 = Silencio (todo bien) | Exit 2 = Error, devuelve al agente para autocorregir.
cd "$(git rev-parse --show-toplevel)" || exit 0

# 1. Validar tipos e interfaces de TypeScript y Linter
OUT=$(npm -s run lint 2>&1 && npm -s run check-types 2>&1)
if [ $? -ne 0 ]; then
  echo "ERROR DE CÓDIGO/TIPOS DETECTADO:" >&2
  echo "$OUT" | tail -n 40 >&2
  exit 2
fi

# 2. Validar esquema JSON de las noticias generadas
if [ -f "scripts/checks/validate-news-schema.js" ]; then
  SCHEMA_OUT=$(node scripts/checks/validate-news-schema.js 2>&1)
  if [ $? -ne 0 ]; then
    echo "ERROR DE ESQUEMA EN NOTICIAS GENERADAS:" >&2
    echo "$SCHEMA_OUT" >&2
    exit 2
  fi
fi

exit 0

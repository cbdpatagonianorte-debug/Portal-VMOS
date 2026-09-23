#!/usr/bin/env bash
set -euo pipefail

CMD="$*"

BLOCKED=("rm -rf" "drop database" "npm run deploy" "git push" "git push --force" "git push -f")
for b in "${BLOCKED[@]}"; do
  if [[ "$CMD" == *"$b"* ]]; then
    echo "[guard] BLOQUEADO: $CMD"
    echo "[guard] Motivo: comando destructivo o publicación no autorizada."
    echo "[guard] Usa 'scripts/checks/fast.sh' antes de publicar."
    exit 1
  fi
done

# Si se intenta publicar contenido sin pasar por fast.sh, verificar archivos modificados
if [[ "$CMD" == *"publish"* || "$CMD" == *"deploy"* ]]; then
  if ! git diff --quiet; then
    echo "[guard] BLOQUEADO: hay cambios sin commitear."
    echo "[guard] Commitea o stashea antes de publicar."
    exit 1
  fi
fi

echo "[guard] OK"
exit 0

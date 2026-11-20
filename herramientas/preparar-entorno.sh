#!/usr/bin/env bash
# Prepara un entorno limpio para producir (lo usa la producción diaria automática).
# Idempotente: si ya está instalado, no repite trabajo.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ ! -d motor/node_modules ]; then (cd motor && npm ci --no-audit --no-fund); fi
if [ ! -x .venv/bin/python ]; then python3 -m venv .venv; fi
.venv/bin/pip install -q -r herramientas/requirements.txt
command -v ffmpeg >/dev/null || { echo "Falta ffmpeg"; exit 1; }
# texturas y efectos (se versionan, pero por si faltan)
[ -f motor/public/texturas/grano.png ] || .venv/bin/python herramientas/texturas.py motor/public/texturas
[ -f motor/public/sfx/tick.wav ] || .venv/bin/python herramientas/musica.py sfx motor/public/sfx
# regenerar datos de los vídeos ya existentes (música y copias para Remotion no se versionan)
for d in contenido/videos/*/; do
  [ -f "$d/audio/voz-original.mp3" ] && (cd motor && node scripts/producir.mjs "../$d" >/dev/null) || true
done
echo "Entorno listo"

---
name: nuevo-video
description: Produce un vídeo completo de la marca (idea → ganchos → guion → voz ElevenLabs → render → auditoría → ENTREGA.md). Úsala cuando pidan "crea un vídeo", "nuevo reel", "haz el vídeo sobre X".
---
# Nuevo vídeo

Sigue `docs/flujo-de-trabajo.md` al pie de la letra. Resumen:

1. **ID y carpeta**: siguiente número libre en `contenido/videos/` (`V0NN-tema-corto`).
2. **Editorial** (`editorial.yaml`; plantilla en `contenido/plantillas/editorial.yaml`): concepto, 10 ganchos puntuados, elegido y motivo, fuentes, publicación.
3. **Verificar** cada dato con el agente `verificador` (o la skill verificar-dato).
4. **Guion** (`guion.yaml`; plantilla en `contenido/plantillas/guion.yaml`) y `cd motor && npm run validar -- ../contenido/videos/<ID>`.
5. **Voz** con ElevenLabs: estimar coste (`estimate_only`), comprobar cupo restante (`account_get_usage`), generar 1 toma con voz `E1MLwoobU29hxksWgI7o` y modelo `eleven_multilingual_v2`; descargar a `audio/voz-original.mp3`. Nunca superar el cupo del plan.
6. **Producir**: `npm run producir -- ../contenido/videos/<ID>` → `node scripts/fotogramas.mjs <ID>` → revisar la hoja de contactos → `--render`.
7. **Auditar** (skill auditar). < 85 → rehacer.
8. **Entrega**: `node scripts/entrega.mjs ../contenido/videos/<ID>` y enviar el MP4 al propietario.
9. Commit en español y push.

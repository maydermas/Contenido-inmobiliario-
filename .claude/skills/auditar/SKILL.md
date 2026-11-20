---
name: auditar
description: Auditoría de calidad 0–100 de un vídeo renderizado (técnica + editorial + visual). Úsala antes de publicar o con "audita el vídeo X".
---
# Auditoría

1. `bash herramientas/qc.sh salida/<ID>.mp4` — todo debe estar en ✓.
2. `cd motor && node scripts/fotogramas.mjs <ID>` y revisa la hoja: legibilidad, zonas seguras, etiquetas de transparencia, coherencia de marca.
3. Lee `guion.yaml`, `timing.json` y `editorial.yaml → fuentes`: ¿toda cifra tiene fuente o es ejemplo hipotético? ¿hay promesas?
4. Puntúa los 10 criterios (×10) en `editorial.yaml → auditoria` con problemas y mejoras concretas. Sin inflar.
5. < 85 → aplica mejoras, vuelve a renderizar y re-audita. Regenera `ENTREGA.md`.

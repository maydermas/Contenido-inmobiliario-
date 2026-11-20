# Flujo de trabajo: de la idea al MP4

## 0. Preparar el entorno (una vez)
```bash
cd motor && npm ci
cd .. && python3 -m venv .venv && .venv/bin/pip install -r herramientas/requirements.txt
```
El primer alineado descarga el modelo `small` de faster-whisper (≈ 480 MB, Hugging Face, licencia MIT).

## 1. Idea y ganchos → `editorial.yaml`
- Elegir pilar, emoción y formato mirando `contenido/registro.json` (no repetir pilar 3 veces seguidas ni emoción 2 veces).
- Escribir **10 ganchos** de familias distintas (`docs/editorial/ganchos.md`) y puntuarlos de 1 a 5 en:
  atención, identificación, claridad, curiosidad, intensidad, credibilidad y relación con el contenido.
- Elegir el mejor. Un gancho fuerte nunca puede ser engañoso.

## 2. Guion → `guion.yaml`
- Un bloque por frase o idea. `voz` = texto exacto que se locuta (cifras con letras).
- `escena.tipo` del catálogo (`docs/editorial/escenas.md`) y sus `props`.
- Sincroniza animaciones con la voz usando `en: <palabra>` (la palabra debe estar en `voz`).
- Cifras en pantalla → `fuente:` o etiqueta «Ejemplo hipotético». El validador lo exige.
- Comprobar: `cd motor && npm run validar -- ../contenido/videos/<ID>`

## 3. Voz (ElevenLabs, dentro del plan ya pagado)
1. Unir los `voz` de los bloques con una línea en blanco entre bloques.
2. Estimar coste (`estimate_only: true`). Comprobar créditos restantes. Nunca superar el cupo.
3. Generar **1 toma** con la voz `E1MLwoobU29hxksWgI7o`, modelo `eleven_multilingual_v2`.
4. Guardar como `audio/voz-original.mp3` y el texto exacto en `audio/texto-locucion.txt`.

Dos vías equivalentes:
- **Conector de ElevenLabs en Claude** (lo que se ha usado en los pilotos): `creative_generate_speech` → descargar el `content_url`.
- **API con clave propia**: `herramientas/elevenlabs.py` (incluye control de cupo). Requiere `ELEVENLABS_API_KEY`.
  *Preparado pero no probado: no hay clave configurada.*

Si se cambia una frase hablada, hay que regenerar la voz (≈ 700 créditos por vídeo de 45 s).
Si solo se cambian escenas, textos en pantalla o tiempos, **no** hace falta.

## 4. Producir
```bash
cd motor
npm run producir -- ../contenido/videos/<ID>            # prepara datos (rápido)
node scripts/fotogramas.mjs <ID>                          # hoja de contactos → salida/<ID>-contactos.jpg
npm run producir -- ../contenido/videos/<ID> --render     # MP4 final + control de calidad (≈ 3 min)
npm run producir -- ../contenido/videos/<ID> --render --borrador   # MP4 a media resolución, más rápido
```
`producir` hace: validación → post-proceso de voz (pausas, ritmo, −16 LUFS) → alineado palabra a palabra →
música original a medida → ensamblado → render → control de calidad (`herramientas/qc.sh`).

## 5. Revisión y entrega
- Revisar la hoja de contactos y el MP4. Corregir escenas en `guion.yaml` o en `motor/src/escenas/`.
- Completar la auditoría en `editorial.yaml` (sin inflar notas; < 85 se rehace).
- `node scripts/entrega.mjs ../contenido/videos/<ID>` → `ENTREGA.md` (concepto, ganchos, guion por segundos,
  storyboard, prompts, producción, subtítulos, publicación y auditoría).

## 6. Publicar y medir
- Publicar con los textos de `ENTREGA.md` (adaptación por plataforma).
- A los 7 días, anotar métricas en `metricas/metricas.csv` (retención, visualización completa, guardados,
  compartidos, comentarios, visitas al perfil, mensajes, consultas cualificadas, reuniones).
- Las visualizaciones solas no son éxito: priorizar guardados, mensajes y consultas cualificadas.

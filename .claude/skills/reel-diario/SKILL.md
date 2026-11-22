---
name: reel-diario
description: Producción diaria automática de un reel completo (elegir tema, verificar, guion, voz ElevenLabs, render, auditoría, entrega y commit). La usa la tarea programada diaria; también se puede lanzar a mano con "haz el reel de hoy".
---
# Reel diario (sin supervisión)

Orden de cada día: **0 entorno → 5 bis publicar el siguiente de la cola → 1–6 producir el de mañana**.

Trabajas solo: nadie revisa antes de que termines. Sé conservador: si algo no cumple las normas, **no lo entregues como listo**.
Normas: `CLAUDE.md`, `docs/directivas/`, `docs/automatizacion.md`. Fecha de hoy = fecha del sistema (zona Europe/Madrid).

## 0. Entorno (≈ 3 min)
`bash herramientas/preparar-entorno.sh`. Si falla, notifica el error al propietario y termina.
Si hoy ya existe un vídeo con `fecha` de hoy en `contenido/registro.json`, termina sin hacer nada (evita duplicados).

## 1. Elegir el tema
- Lee `contenido/banco-de-temas.yaml`, `contenido/registro.json` y `metricas/metricas.csv`.
- Toma el **primer tema `pendiente`** que cumpla: pilar distinto del último vídeo; estilo distinto del último;
  emoción (la eliges tú, docs/editorial/pilares.md) distinta del último; formato no usado en los 2 últimos.
- CTA: como máximo 2 comerciales («escríbeme…») en los últimos 7 vídeos; alterna guardar/compartir/comentar/seguir.
- Si quedan < 15 temas pendientes, añade 10 nuevos (variados, de los 6 pilares, con `verificar:`) al final del banco.
- ID: `V` + número siguiente de 3 cifras + `-tema-corto` (ver `contenido/videos/`).

## 2. Verificar
Para cada punto de `verificar:` y cualquier cifra o norma del guion: busca en fuentes oficiales (skill verificar-dato).
Si algo no se puede verificar, **no se dice**. Anota fuentes en `editorial.yaml → fuentes` y en `docs/cumplimiento/verificacion.md`.

## 3. Editorial y guion
- `editorial.yaml` (plantilla `contenido/plantillas/editorial.yaml`): concepto, **10 ganchos** de ≥ 4 familias puntuados, elegido y motivo,
  storyboard por bloque, prompts (opcionales), publicación completa (portada, descripción, CTA, hashtags, TikTok/Instagram/YouTube).
- `guion.yaml`: 6–9 bloques, 20–55 s de voz (≈ 2,6 palabras/s), cifras de la voz en letras, escenas del catálogo
  (`docs/editorial/escenas.md`) variando respecto a los 3 últimos vídeos. Ejemplos con cifras → «Ejemplo hipotético».
- `cd motor && npm run validar -- ../contenido/videos/<ID>` sin errores.

## 4. Voz (ElevenLabs, solo dentro del cupo)
**Vía preferente — Composio (cuenta de ElevenLabs conectada, alias «voces-nico»):**
1. `COMPOSIO_SEARCH_TOOLS` (sesión nueva) y `ELEVENLABS_GET_USER_SUBSCRIPTION_INFO`: restante = `character_limit − character_count`.
2. Texto = los `voz` de los bloques unidos con una línea en blanco. Coste ≈ nº de caracteres (multilingual v2).
   **Si restante − caracteres < 3000 → no generes** (ver más abajo).
3. `ELEVENLABS_TEXT_TO_SPEECH` una sola vez: `voice_id: E1MLwoobU29hxksWgI7o`, `model_id: eleven_multilingual_v2`,
   `text: <texto>`. Descarga `data.file.s3url` (caduca en 1 h) con `curl -sS -o contenido/videos/<ID>/audio/voz-original.mp3 "<s3url>"`
   y guarda el texto exacto en `audio/texto-locucion.txt`. Nunca repitas la generación si ya se cobró.

**Vía B — API (si no tienes las herramientas `mcp__ElevenLabs__*`):**
`.venv/bin/python herramientas/elevenlabs.py contenido/videos/<ID> --estimar` y, si el cupo alcanza, sin `--estimar`.
El script comprueba el cupo (reserva de 3.000) y guarda `audio/voz-original.mp3` y `audio/texto-locucion.txt`.
La clave la inyecta el proxy desde el secreto del entorno; nunca la pidas por chat ni la escribas en archivos.
**Si no hay conector ni la API responde** (sin clave): no uses otra voz. Deja editorial y guion validados, commitea,
anota «falta voz» en `contenido/diario.md` y notifica al propietario cómo activarla (ver `docs/automatizacion.md`).

**Vía A — conector de ElevenLabs (si tienes las herramientas `mcp__ElevenLabs__*`):**
1. `account_get_usage`: restante = `character_limit − character_count`.
2. Une los `voz` de los bloques con una línea en blanco. `creative_generate_speech` con `estimate_only: true`,
   voz `E1MLwoobU29hxksWgI7o`, modelo `eleven_multilingual_v2`, `generations_count: 1`.
3. **Si restante − coste < 3000 → NO generes.** Notifica al propietario «cupo de voz insuficiente hasta el <fecha de reinicio>» y termina
   (deja el guion validado y commiteado para producirlo cuando haya cupo). Nunca actives sobreconsumo ni compres nada.
4. Genera una sola vez (nunca reintentes la generación: cobra otra vez). Sondea `creative_get_flow_run_status`.
5. `curl -sS -o contenido/videos/<ID>/audio/voz-original.mp3 "<content_url>"` y guarda el texto exacto en `audio/texto-locucion.txt`.

## 5. Producir y revisar
1. `npm run producir -- ../contenido/videos/<ID>` (coincidencia guion/voz debe ser ≥ 90 %).
2. `node scripts/fotogramas.mjs <ID>` y **mira la hoja** (`salida/<ID>-contactos.jpg`): textos solapados, zonas seguras,
   legibilidad, escenas vacías. Corrige `guion.yaml`/props y repite (máx. 3 iteraciones).
3. Si tocas código del motor: `npx tsc --noEmit` y no rompas escenas existentes (cambios compatibles, props opcionales).
4. `npm run producir -- ../contenido/videos/<ID> --render` → todo ✓ en el control de calidad.

## 5 bis. Publicar en Instagram (antes de producir, cada día)
Cuenta: **@capital4thunel** (Composio, toolkit `instagram`, alias `capital-4-tune`, cuenta `instagram_amazed-arear`).

**Regla obligatoria de cuenta (propietario):**
- En **todas** las llamadas a herramientas `INSTAGRAM_*` pasa siempre `account: "instagram_amazed-arear"`.
  Nunca uses la conexión por defecto ni omitas `account` (hay otras cuentas de Instagram conectadas en Composio).
- **Antes de publicar**, llama a `INSTAGRAM_GET_USER_INFO` con `account: "instagram_amazed-arear"` y comprueba que
  `username` es exactamente `capital4thunel`. Si no lo es (o la llamada falla), **no crees el contenedor ni publiques**:
  anótalo en `contenido/diario.md` y avisa al propietario indicando qué username devolvió la conexión.
Publicación directa autorizada por el propietario. **Solo Instagram.** Exactamente 1 publicación al día:
1. Si `contenido/publicaciones.json` ya tiene una publicación con la fecha de hoy, no publiques otra.
2. `cd motor && node scripts/publicar.mjs siguiente` → `{ id, video_url, caption }` (el más antiguo listo y no publicado;
   si `id` es null, no hay cola: publica el que produzcas hoy en cuanto pase la auditoría, repitiendo este paso).
3. Comprueba que la URL responde: `curl -sI "<video_url>"` → 200.
4. `INSTAGRAM_POST_IG_USER_MEDIA` con `ig_user_id: "me"`, `video_url`, `media_type: "REELS"`, `share_to_feed: true`,
   `caption` (texto tal cual, con `#` normales) y `thumb_offset: 1500` → `creation_id`.
5. `INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH` con `ig_user_id: "me"`, `creation_id`, `max_wait_seconds: 40`
   (la llamada de Composio corta a los 60 s: valores mayores dan «timeout» con resultado desconocido).
   Si hay timeout, **antes de reintentar** mira `INSTAGRAM_GET_IG_USER_MEDIA` (limit 3): si ya aparece, no publiques otra vez.
   Si falla por 9007/«not available», espera y reintenta el **publish** con el mismo `creation_id` (nunca crees otro
   contenedor si el anterior pudo publicarse: comprueba antes con `INSTAGRAM_GET_IG_USER_MEDIA`).
6. `INSTAGRAM_GET_IG_MEDIA` (campos `id,permalink,caption`) → comprueba que el pie se ve bien (sin `%23`).
7. `node scripts/publicar.mjs registrar <ID> <ig_media_id> <permalink>`; commit y push.
8. Envía al propietario con `SendUserFile` (status `proactive`) el MP4 publicado y, en el mensaje, el enlace y el
   **pie completo** (contenido de `PIE.txt`).

## 6. Auditoría y entrega
- Auditoría honesta en `editorial.yaml → auditoria` (10 × 10). Si < 85: mejora y vuelve a renderizar (máx. 2 veces).
  Si sigue < 85, entrégalo marcado «NO PUBLICAR: revisar».
- `node scripts/entrega.mjs ../contenido/videos/<ID>`.
- Marca el tema `producido` en el banco con `video: <ID>` y `fecha`. Añade una línea a `contenido/diario.md`
  (fecha, ID, tema, nota, créditos usados y restantes, incidencias).
- Commit en español en `main` y `git push origin main`.
- El vídeo producido hoy queda en la cola de publicación: se envía al propietario (MP4 + pie) el día que se publique
  (paso 5 bis). Si hoy no había cola, se publica hoy mismo en cuanto pase la auditoría.

## Si algo falla
No ocultes errores. Commitea lo que sea válido, deja constancia en `contenido/diario.md` y notifica qué falló y qué falta.

# CLAUDE.md — Contenido Inmobiliario · marca Capital 4 Tune (Instagram @capital4thunel)

Motor de producción audiovisual para una marca personal **faceless** de asesoramiento inmobiliario,
educación financiera y decisiones inteligentes (Roquetas de Mar, Aguadulce, Almería y resto de España).
Vídeos verticales 9:16 para Instagram Reels, TikTok y YouTube Shorts.

Las normas completas están en `docs/directivas/`:
- `prompt-maestro-v1.md` — identidad, pilares, ganchos, estructura, formato de entrega, principios.
- `directiva-v2.md` — presupuesto cero, faceless, dirección artística, herramientas, Remotion, calidad.
**Si chocan, manda la v2**, salvo decisiones posteriores del propietario registradas en `docs/decisiones.md`
(p. ej. la voz de ElevenLabs está autorizada dentro del plan ya contratado).

## Principios que nunca se rompen
1. No engañar para conseguir visualizaciones. No usar el miedo para forzar una compra.
2. No inventar datos, estadísticas, precios de mercado ni condiciones bancarias. Toda cifra en pantalla lleva
   `fuente:` o la etiqueta «Ejemplo hipotético». Si no se puede verificar, no se afirma.
3. No prometer hipotecas ni rentabilidades. La marca **no es intermediario de crédito**: explica conceptos
   generales y deriva a profesionales habilitados.
4. No presentar propiedades, testimonios ni historias ficticias como reales («Imagen ilustrativa»,
   «Recreación 3D ilustrativa», «Ejemplo hipotético»).
5. No recomendar algo por la comisión. No sacrificar la confianza por una venta.
6. Nada de frases motivacionales vacías ni fórmulas repetidas mecánicamente.
7. Presupuesto cero: no contratar ni ejecutar nada de pago. ElevenLabs solo dentro del cupo del plan ya pagado.
8. No afirmar que algo está implementado si solo está diseñado. No ocultar errores.

Lema: «No pienso ofrecerte nada de lo que sepa que en un futuro te puedas arrepentir». Concepto: «Lo estudiamos juntos».

## Estructura
```
contenido/videos/<ID>/     guion.yaml (fuente de verdad) · editorial.yaml (concepto, ganchos, publicación, auditoría)
                           audio/voz-original.mp3 (ElevenLabs) · timing.json · subtitulos.srt · ENTREGA.md (generado)
contenido/registro.json    historial para no repetir ganchos, pilares, emociones y formatos
contenido/calendario/      planificación semanal
motor/                     Remotion + React + TypeScript (1080×1920, 30 fps, H.264)
  src/marca/tokens.ts      colores, tipografías, ritmos, zonas seguras  ← la identidad vive aquí
  src/escenas/             12 escenas configurables (+ DynamicSubtitle y BrandSignature como capas)
  src/ilustraciones/       SVG 2.5D propios · src/escenas/tres-d.tsx: 3D procedural (Three.js)
  scripts/                 producir.mjs · validar.mjs · fotogramas.mjs · entrega.mjs
herramientas/              voz.py · alinear.py · musica.py · texturas.py · elevenlabs.py · qc.sh
docs/                      directivas, marca, editorial, cumplimiento, herramientas y licencias
salida/                    MP4 renderizados (no se versiona)
```

## Flujo de un vídeo (ver `docs/flujo-de-trabajo.md`)
1. `guion.yaml`: 10 ganchos evaluados en `editorial.yaml`, el mejor en el bloque 1. Cada bloque = una frase de voz + una escena.
2. Voz: ElevenLabs, voz `E1MLwoobU29hxksWgI7o` (Raul Garcia, es-peninsular), `eleven_multilingual_v2`, 1 toma.
   Estimar coste antes (`estimate_only`). Guardar en `audio/voz-original.mp3` + `audio/texto-locucion.txt`.
3. `cd motor && npm run producir -- ../contenido/videos/<ID> --render` (valida, procesa voz, alinea, música, render, QC).
4. `node scripts/fotogramas.mjs <ID>` → hoja de contactos para revisión visual. Corregir y volver a renderizar.
5. `node scripts/entrega.mjs ../contenido/videos/<ID>` → `ENTREGA.md` con los 9 puntos del formato de entrega.
6. Auditoría 0–100 en `editorial.yaml`; < 85 → se rehace. Sin inflar notas.

## Comandos
- Instalar: `cd motor && npm ci` · `python3 -m venv .venv && .venv/bin/pip install -r herramientas/requirements.txt`
- Estudio interactivo: `cd motor && npm run studio`
- Tipos: `cd motor && npx tsc --noEmit`
- Validar guion: `cd motor && npm run validar -- ../contenido/videos/<ID>`

## Convenciones
- Voz: cifras escritas con letras en `voz`; en pantalla, con números.
- `destacar`: solo 2–4 palabras clave por bloque. Las marcas de sincronía (`en:`, `revelarEn:`…) deben ser palabras de la voz.
- Escenas nuevas: componente en `motor/src/escenas/`, registrar en `escenas/index.ts` y en `TIPOS` de `scripts/validar.mjs`, documentar en `docs/editorial/escenas.md`.
- Nunca cambiar colores o fuentes fuera de `tokens.ts`. Recursos externos: registrar licencia en `docs/licencias.md`.
- Commits en español, descriptivos.

## Producción diaria automática
Un reel al día mediante una tarea programada que sigue `.claude/skills/reel-diario/SKILL.md` (ver `docs/automatizacion.md`).
Temas en `contenido/banco-de-temas.yaml`; registro en `contenido/diario.md`. Publica 1 reel al día solo en Instagram (@capital4thunel, vía Composio) y envía al propietario el reel y su pie.

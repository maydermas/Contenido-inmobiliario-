# Producción diaria automática

**Plan del propietario:** 1 reel al día, todos los días. El sistema elige el tema y lo produce solo.

## Cómo funciona
Una tarea programada abre cada día una sesión nueva de Claude en la nube que sigue la skill
`.claude/skills/reel-diario/SKILL.md`:

1. Prepara el entorno (`herramientas/preparar-entorno.sh`).
2. Elige tema del `contenido/banco-de-temas.yaml` respetando la rotación (pilar, estilo, emoción, formato, CTA).
3. Verifica los datos en fuentes oficiales.
4. Escribe `editorial.yaml` (10 ganchos puntuados) y `guion.yaml`, y los valida.
5. Genera la voz con ElevenLabs **solo si queda cupo** (reserva mínima de 3.000 créditos).
6. Produce, revisa la hoja de contactos, renderiza y pasa el control de calidad.
7. Auditoría ≥ 85/100 o se marca «NO PUBLICAR: revisar».
8. Commit + push en `main`, registro en `contenido/diario.md` y envío del MP4 con el texto de publicación.

## Lo que NO hace (y por qué)
- **No publica en Instagram, TikTok ni YouTube.** No hay ninguna integración de publicación conectada, y publicar en
  nombre de la marca es una acción pública que debe autorizarse expresamente. Opciones futuras: Instagram Graph API
  (cuenta profesional + app de Meta), TikTok Content Posting API (requiere revisión de la app) o YouTube Data API,
  o un conector de terceros. Ninguna está implementada.
- No gasta dinero: si se agota el cupo mensual de ElevenLabs, deja el guion listo y avisa.

## Cupo de voz
≈ 700 créditos por reel de 45 s → ≈ 21.000 al mes con un reel diario. El plan Creator da 122.038 al mes
(se reinicia el día 2 de cada mes). Si el cupo se comparte con otros usos de la cuenta, puede agotarse antes:
el sistema lo comprueba cada día antes de generar.

## Hora
La tarea se lanza a las 05:37 (hora de Madrid) para que el reel esté listo por la mañana.
Hora recomendada de publicación: entre 13:00 y 14:30 o entre 20:00 y 22:00 (ajustar con métricas reales).

## Supervisión
- `contenido/diario.md`: una línea por día (tema, nota, créditos, incidencias).
- Métricas: rellenar `metricas/metricas.csv` a los 7 días de cada publicación; el sistema las usa para elegir temas.
- Para pausar: pedir a Claude que desactive la tarea programada «Reel diario».

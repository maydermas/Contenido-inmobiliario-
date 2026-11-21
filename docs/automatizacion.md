# Producción diaria automática

**Plan del propietario:** 1 reel al día, todos los días. El sistema elige el tema y lo produce solo.

## Cómo funciona
Una tarea programada despierta cada día la sesión de Claude del proyecto, que sigue la skill
`.claude/skills/reel-diario/SKILL.md`:

1. Prepara el entorno (`herramientas/preparar-entorno.sh`).
2. Elige tema del `contenido/banco-de-temas.yaml` respetando la rotación (pilar, estilo, emoción, formato, CTA).
3. Verifica los datos en fuentes oficiales.
4. Escribe `editorial.yaml` (10 ganchos puntuados) y `guion.yaml`, y los valida.
5. Genera la voz con ElevenLabs **solo si queda cupo** (reserva mínima de 3.000 créditos).
6. Produce, revisa la hoja de contactos, renderiza y pasa el control de calidad.
7. Auditoría ≥ 85/100 o se marca «NO PUBLICAR: revisar».
8. Commit + push en `main`, registro en `contenido/diario.md` y envío del MP4 con el texto de publicación.

## Publicación
- **Solo Instagram**, cuenta **@capital4thunel** (Composio), publicación directa autorizada por el propietario.
- Una publicación al día, a las 12:41 (Madrid). Se publica el vídeo más antiguo listo (auditoría ≥ 85) y aún no publicado;
  así siempre hay ~1 día de margen por si una producción falla.
- El MP4 se sirve desde la rama `medios` del repositorio (público) para que Instagram lo descargue; esa rama se reescribe
  en cada publicación y solo contiene el vídeo pendiente.
- Tras publicar, el propietario recibe el reel y su pie completo. Registro en `contenido/publicaciones.json`.
- No gasta dinero: si se agota el cupo mensual de ElevenLabs, deja el guion listo y avisa.

## Voz en la ejecución diaria
La tarea programada se ejecuta **dentro de la sesión de Claude que la creó**, que tiene conectados Composio
(ElevenLabs, Instagram, YouTube, Dropbox) y el conector de ElevenLabs. Las sesiones nuevas no heredan conectores,
por eso no se usa el modo «sesión nueva cada día».
Orden de vías para la voz: Composio (`ELEVENLABS_TEXT_TO_SPEECH`) → conector de ElevenLabs → API con clave
guardada como secreto del entorno (`herramientas/elevenlabs.py`). Si ninguna funciona, se deja el guion listo y se avisa.

## Cupo de voz
≈ 700 créditos por reel de 45 s → ≈ 21.000 al mes con un reel diario. El plan Creator da 122.038 al mes
(se reinicia el día 2 de cada mes). Si el cupo se comparte con otros usos de la cuenta, puede agotarse antes:
el sistema lo comprueba cada día antes de generar.

## Hora
La tarea se lanza a las 12:41 (hora de Madrid): publica primero y después produce el vídeo del día siguiente.
Ajustar la hora con métricas reales (franjas habituales: 13:00–14:30 y 20:00–22:00).

## Supervisión
- `contenido/diario.md`: una línea por día (tema, nota, créditos, incidencias).
- Métricas: rellenar `metricas/metricas.csv` a los 7 días de cada publicación; el sistema las usa para elegir temas.
- Para pausar: pedir a Claude que desactive la tarea programada «Reel diario».

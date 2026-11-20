# Herramientas: licencias, costes y estado

Auditoría del 20/11/2026 (Directiva 2.0, §1 «Transparencia económica»). Revisar antes de cambiar de versión.

**Entorno de producción actual:** contenedor sin GPU, 4 núcleos CPU, 15 GB RAM. Node 22, Python 3.13, FFmpeg 6.1, Chromium.

## En uso

| Herramienta | Función | Licencia | Comercial | API / créditos | GPU | Coste | Clasificación |
|---|---|---|---|---|---|---|---|
| Remotion 4.0.545 | Montaje y render | Remotion License: gratis para personas y equipos ≤ 3 | Sí (≤ 3 personas) | No | No | 0 € | GRATUITA Y UTILIZABLE |
| React 19 / TypeScript | Componentes | MIT / Apache-2.0 | Sí | No | No | 0 € | GRATUITA Y UTILIZABLE |
| Three.js + React Three Fiber | Escenas 3D procedurales | MIT | Sí | No | No (WebGL por software «swangle») | 0 € | GRATUITA Y UTILIZABLE |
| FFmpeg | Audio, mezcla, QC | LGPL/GPL | Sí (uso como herramienta) | No | No | 0 € | GRATUITA Y UTILIZABLE |
| faster-whisper (modelo `small`) | Alinear voz y subtítulos | MIT (código y pesos Whisper) | Sí | No | No (CPU int8) | 0 € | GRATUITA Y UTILIZABLE |
| NumPy | Música y efectos propios | BSD | Sí | No | No | 0 € | GRATUITA Y UTILIZABLE |
| Manrope (Fontsource) | Tipografía sans | SIL OFL 1.1 | Sí | No | No | 0 € | GRATUITA Y UTILIZABLE |
| Cormorant Garamond (Fontsource) | Tipografía serif | SIL OFL 1.1 | Sí | No | No | 0 € | GRATUITA Y UTILIZABLE |
| ElevenLabs (plan Creator ya contratado) | Voz en off | Licencia comercial incluida en planes de pago | Sí | Sí: ≈ 700 créditos por vídeo de 45 s | No | 0 € adicional dentro del cupo mensual | YA PAGADO · solo dentro del cupo |

## Alternativas y mejoras futuras (no integradas)

| Herramienta | Función | Licencia | Comercial | GPU | Clasificación | Nota |
|---|---|---|---|---|---|---|
| Kokoro-82M | Voz local | Apache-2.0 | Sí | No | GRATUITA · calidad en español por verificar | Español: `ef_dora`, `em_alex` (sin nota de calidad publicada). Depende de espeak-ng (GPL). Alternativa si se agota el cupo de ElevenLabs. |
| Piper TTS | Voz local | Motor MIT/GPL; cada voz con su licencia | Depende de la voz | No | GRATUITA CON LIMITACIONES | es_ES `carlfm` dominio público; `mls_*` CC BY 4.0 (atribución); `sharvard` **no comercial**: no usar; `davefx` licencia por confirmar. |
| eSpeak NG | Voz robótica | GPL-3.0 | Sí | No | GRATUITA Y UTILIZABLE | Calidad insuficiente para la marca. Solo pruebas. |
| Wan 2.2 (TI2V-5B) | Vídeo IA | Apache-2.0 | Sí | Sí (tipo RTX 4090) | REQUIERE INFRAESTRUCTURA | Candidato nº 1 si se dispone de GPU gratuita. |
| LTX-2.x | Vídeo IA | LTX-2 Community License: gratis por debajo de 10 M$ de ingresos anuales | Sí (umbral) | Sí | REQUIERE INFRAESTRUCTURA | Revisar licencia de cada versión. |
| HunyuanVideo | Vídeo IA | Tencent Hunyuan Community License: **excluye UE, Reino Unido y Corea del Sur** | **No en España** | Sí | LICENCIA NO COMPATIBLE | No integrar. |
| FLUX.1 [schnell] | Imagen IA | Apache-2.0 | Sí | Sí | REQUIERE INFRAESTRUCTURA | |
| FLUX.1 [dev] | Imagen IA | Licencia no comercial | No | Sí | LICENCIA NO COMPATIBLE | |
| Stable Diffusion 3.5 | Imagen IA | Stability Community License (umbral de ingresos; verificar) | Con límites | Sí | LICENCIA NO VERIFICADA | |
| SDXL | Imagen IA | CreativeML OpenRAIL++-M | Sí, con restricciones de uso | Sí | REQUIERE INFRAESTRUCTURA | |
| ComfyUI | Orquestar modelos | GPL-3.0 | Sí | Según modelo | REQUIERE INFRAESTRUCTURA | |
| GSAP | Animación web | Licencia estándar gratuita (Webflow, 2025) | Sí, salvo herramientas no-code que compitan con Webflow | No | GRATUITA Y UTILIZABLE | No necesaria: Remotion cubre la animación. |
| GPU gratuita (Kaggle / Colab) | Inferencia ocasional | Términos del servicio | Revisar | — | GRATUITA CON LIMITACIONES | Horas limitadas, requiere cuenta. Propuesta futura, no implementada. |

**Fuentes consultadas:** fichas de Hugging Face de Wan-AI y Kokoro, licencia LTX-2.3, licencia y commits de
HunyuanVideo, repositorio rhasspy/piper-voices, centro de ayuda de ElevenLabs, FAQ de licencia de Remotion,
anuncio de Webflow sobre GSAP, comparativas de licencias de FLUX/SD (secundarias: verificar antes de integrar).

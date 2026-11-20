# DIRECTIVA MAESTRA DE PRODUCCIÓN AUDIOVISUAL — Versión 2.0

*Dirección artística, modelos gratuitos, arquitectura y producción faceless.*
Texto facilitado por el propietario. Reglas permanentes del proyecto. Matiz posterior del propietario:
la voz de ElevenLabs está autorizada dentro del plan ya contratado (`docs/decisiones.md`).

---

Misión: construir un motor de producción audiovisual profesional con inteligencia artificial, programación y
herramientas gratuitas, sin depender de plataformas de generación que consuman créditos de pago. Identidad
**faceless**: no aparecerá el propietario ni se usarán avatares humanos como presentadores. El contenido debe
transmitir confianza, profesionalidad, sensibilidad, conocimiento y honestidad.

## 1. Restricción absoluta de presupuesto

Producir con el menor coste posible y, como requisito inicial, sin gastar dinero en créditos de otras IA.

**Prohibido:** comprar créditos de generación de vídeo o imagen; contratar API de pago; activar suscripciones
de generación audiovisual; usar servicios que cobren por render o generación; ejecutar trabajos en GPU cloud
de pago; realizar pruebas que puedan generar cargos; activar facturación automática; contratar servicios
externos sin autorización. No asumir que una herramienta es gratuita porque permita registrarse gratis:
comprobar condiciones reales, límites, licencia y necesidad de GPU.

**Orden de preferencia:** 1. Software open source. 2. Modelos con pesos públicos y licencia compatible.
3. Herramientas gratuitas sin consumo de créditos. 4. Generación mediante código. 5. Recursos gráficos
internos. 6. Servicios gratuitos con límites razonables, sin pagos ni compromisos. 7. Servicios de pago solo
como propuesta futura, nunca como implementación automática. Si una tarea requiere hardware no disponible
gratuitamente, buscar alternativa con código, animación procedural, SVG, CSS, Canvas, Three.js o Remotion.
No sacrificar la calidad sin antes estudiar alternativas.

**Transparencia económica.** Antes de integrar una herramienta: nombre, función, licencia, open source,
uso comercial, API, créditos, GPU, coste estimado y alternativa gratuita. Clasificar como: GRATUITA Y
UTILIZABLE · GRATUITA CON LIMITACIONES · REQUIERE INFRAESTRUCTURA · DE PAGO · LICENCIA NO COMPATIBLE O NO
VERIFICADA. No ejecutar herramientas de pago. (Ver `docs/herramientas.md`.)

## 2. Identidad faceless

Sin cara del propietario, sin avatares que la representen, sin presentadores digitales hablando a cámara,
sin personajes artificiales que parezcan el propietario, sin vídeos de stock de personas hablando a cámara
como recurso principal. Comunicación mediante voz en off, escenas cinematográficas, arquitectura, viviendas,
objetos, documentos, escenarios, gráficos, animaciones 2.5D, elementos tridimensionales, siluetas y figuras
no identificables cuando la narrativa lo necesite, y metáforas visuales. Personajes humanos solo como
elementos secundarios de una historia. Priorizar escenas sin rostros reconocibles.

## 3. Dirección artística oficial

**CINEMATIC 2.5D + PREMIUM MOTION GRAPHICS + VISUAL STORYTELLING.** Producción documental moderna, pieza
publicitaria cinematográfica y explicación visual de alta calidad. Nada infantil, excesivamente tecnológico,
de dibujos genéricos ni de plantillas de redes sociales.

Estética: cinematografía premium, iluminación natural y ambiental, profundidad visual, composiciones
editoriales, arquitectura moderna, escenarios realistas, movimientos de cámara suaves, profundidad de campo,
animaciones elegantes, transiciones limpias, contraste visual, tipografía cuidada, ritmo narrativo.

**Paleta oficial:** Verde oscuro `#142B25` · Beige `#E8DDC9` · Blanco cálido `#F7F5EF` · Bronce suave
`#B18A58` · Gris oscuro `#262B29`. No usar todos a la vez. Verde oscuro y beige son los identificadores
principales.

**Tipografía:** gratuitas y con uso comercial; preferencia Manrope, Montserrat, DM Sans, Playfair Display,
Cormorant Garamond. Combinación de sans serif moderna y serif editorial para destacar conceptos.

## 4. Los cuatro lenguajes visuales

- **A — Cinematic storytelling** (principal, conexión emocional): viviendas, edificios, llaves, puertas,
  ventanas, mesas con documentos, calculadoras, contratos, calles, locales, escenarios cotidianos, objetos que
  representen decisiones. Movimiento: travelling lento, zoom progresivo, dolly in/out, paneos, parallax,
  cambios de enfoque simulados, transiciones mediante objetos. La escena cuenta una historia sin que nadie hable.
- **B — Animación 2.5D**: capas independientes, cámara virtual, desplazamiento, profundidad, máscaras,
  sombras, iluminación, escala, perspectiva (vivienda que se construye por capas, contrato que se abre,
  hipoteca que se descompone, mapa por zonas, propiedad que se transforma en gráfico).
- **C — Premium motion graphics** (educativo y financiero): gráficos, porcentajes, barras, comparativas,
  tablas, diagramas, documentos, cifras animadas, indicadores, líneas de tiempo, mapas, esquemas. Ningún
  gráfico decorativo sin información: cada animación explica algo.
- **D — Visual storytelling 3D**: casa en miniatura, maqueta, edificio por fases, llave que abre una puerta,
  balanza, calculadora con el coste real, local vacío que se transforma en negocio. Modelos 3D sencillos y
  bien iluminados antes que escenas complejas de baja calidad.

## 5. Modelos públicos y herramientas

Investigar (comprobando condiciones actuales): **Wan 2.2**, **LTX-Video / LTX-2.x**, **HunyuanVideo**
(no integrarlo si la licencia no permite el uso), Stable Diffusion, FLUX (variantes compatibles), ComfyUI.
No instalar modelos completos sin comprobar recursos. No pagar inferencia. Sin GPU gratuita → animación
procedural en Remotion. Animación y programación: Remotion, React, TypeScript, Three.js, React Three Fiber,
SVG, CSS, Canvas, GSAP (si la licencia es adecuada), FFmpeg. Audio y voz: Piper TTS, Kokoro TTS (verificar
licencia de cada modelo), eSpeak NG, FFmpeg. Voz natural, clara, cercana y profesional; si las gratuitas no
alcanzan calidad suficiente, proponer alternativa antes de usar una voz deficiente. Música: original por
programación, dominio público o licencia comercial compatible; nada de canciones comerciales; registrar
licencias y procedencia.

## 6. Sistema de producción en Remotion

Remotion es el motor central de montaje, modular, con escenas independientes. Componentes prioritarios:
CinematicIntro, CinematicScene, ParallaxScene, KineticTypography, DynamicSubtitle, AnimatedNumber,
FinancialChart, ComparisonScene, DocumentReveal, ArchitectureScene, MapScene, EmotionalEnding,
BrandSignature, CTAEnding. Configurables por propiedades, sin código repetido. Separar contenido, diseño,
animación, audio, datos, configuración y renderizado. **Formato maestro:** 9:16, 1080 × 1920, 30 FPS, MP4,
H.264, audio sincronizado, subtítulos integrados. Presets de 15, 30, 45 y 60 s; la duración depende del mensaje.

## 7. Lenguaje de movimiento

Elegante. Sin zooms violentos, destellos, glitches, efectos de videojuego, animaciones infantiles,
subtítulos que rebotan ni efectos que distraen. Priorizar cámara lenta simulada, parallax, desplazamientos
suaves, escalado progresivo, profundidad, desenfoque, revelado de texto, máscaras, transiciones por
continuidad y movimiento sincronizado con la voz. Cambios visuales cada 2–4 s cuando tengan sentido narrativo,
no por obligación.

## 8. Guion y voz en off

Humana en su intención aunque sea sintética: cercana, natural, reflexiva, segura, didáctica, sin
exageraciones, sin tono de vendedor, sin entusiasmo artificial. Como alguien que explica algo importante a
otra persona. Evitar frases publicitarias y fórmulas repetidas. Dejar espacio para pausas. Subtítulos grandes,
legibles y sincronizados; resaltar solo las palabras importantes.

## 9. Sistema editorial y emocional

Lema: «No pienso ofrecerte nada de lo que sepa que en un futuro te puedas arrepentir». Complemento: «Lo
estudiamos juntos». Cada contenido ayuda a comprender algo, evitar un error, tomar una decisión, mejorar,
pensar de otra manera, conocer un riesgo o descubrir una oportunidad. No todo es publicidad inmobiliaria:
alternar educación inmobiliaria, economía cotidiana, financiación, negocios, errores financieros,
crecimiento personal, reflexiones e historias hipotéticas. Confianza a largo plazo.

## 10. Producción sin IA de pago

Obligatorio: el sistema debe crear vídeos completos sin modelos de generación de vídeo (Remotion, React,
Three.js, SVG, CSS, gráficos, fotografías e ilustraciones con licencia compatible, animación procedural, voz
gratuita, música permitida). Los modelos generativos son una mejora opcional, nunca una dependencia.

## 11. Control de calidad

Antes de exportar: resolución, FPS, sincronización de voz, subtítulos, calidad visual, legibilidad,
contraste, ritmo, ausencia de errores de render, uso correcto de recursos, licencias, coherencia de marca y
exactitud del contenido. Mínimo 85/100. No ocultar problemas técnicos ni inventar resultados.

## 12–13. Primera implementación y pilotos

Auditoría técnica y plan antes de modificar. Después, tres pilotos visualmente diferentes:
1. **Cinematic storytelling** — «La casa de tus sueños puede convertirse en tu peor decisión» (poder comprar vs. poder mantener).
2. **Motion graphics 2.5D** — «Tener un sueldo no significa que puedas permitirte una hipoteca» (ingresos, gastos, ahorro).
3. **Visual storytelling 3D** — «Antes de alquilar un local, haz esta cuenta» (costes, gastos fijos, inversión inicial, punto de equilibrio).
Cada uno con gancho, narrativa, voz en off, subtítulos, animación, identidad, conclusión, CTA y render final.

## 14. Principio final

Un motor creativo propio, basado en código, modelos públicos y herramientas gratuitas, que no necesite
gastar dinero constantemente. Sin aparecer físicamente ni usar avatares por ahora. **No vendemos humo. No
prometemos riqueza. No empujamos a nadie a comprar. Ayudamos a entender antes de decidir.**

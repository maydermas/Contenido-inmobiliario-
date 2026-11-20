# Identidad audiovisual

Fuente única en código: `motor/src/marca/tokens.ts`. Hoja visual: composición `Muestrario` → `docs/marca/muestrario.png`.

## Nombre (provisional): Lo Estudiamos
Nace del concepto «Lo estudiamos juntos». Alternativas propuestas: Antes de Firmar · Umbral · Decidir Bien ·
Casa con Criterio · La Cuenta Real · Sin Arrepentirte · Primero Entender. Antes de fijarlo: comprobar
usuario libre en Instagram, TikTok y YouTube y búsqueda en OEPM. Cambiarlo = editar `MARCA.nombre`.

## Símbolo
Arco de puerta en trazo bronce sobre una línea de suelo: decidir es cruzar un umbral. Se dibuja al final de cada vídeo.

## Color
| Token | Hex | Uso |
|---|---|---|
| `verde` | #142B25 | Fondo principal. Identificador de marca. |
| `beige` | #E8DDC9 | Texto secundario, tarjetas claras. Identificador de marca. |
| `blanco` | #F7F5EF | Texto principal sobre verde, papel. |
| `bronce` | #B18A58 | Acentos, líneas, cifra clave. No para texto pequeño. |
| `bronceClaro` | #D2AE7C | Palabras destacadas sobre verde (contraste AA). |
| `bronceOscuro` | #76583A | Palabras destacadas sobre beige/blanco (contraste AA). |
| `gris` | #262B29 | Texto sobre papel, objetos. |
Regla: no usar los cinco colores a la vez; verde + beige mandan, bronce acentúa.

## Tipografía
- **Manrope** (700–800): titulares, subtítulos, datos. Interlineado 1,1–1,15, tracking ligeramente negativo en tamaños grandes.
- **Cormorant Garamond cursiva** (500–600): énfasis editorial dentro de una frase (`*palabra*` en el guion) y frases de cierre.

## Subtítulos (DynamicSubtitle)
Manrope 800, 66 px, centrados en la zona 1250–1450 px. Grupos de 2–4 palabras (≈ 22 caracteres), nunca acaban
en palabra de enlace. La palabra se ilumina al pronunciarse. Solo las palabras de `destacar` van en bronce.
Sin rebotes ni escalados.

## Zonas seguras (1080 × 1920)
- 0–170 px: interfaz de la plataforma (solo marca de agua discreta).
- 170–1140 px: zona visual principal.
- 1250–1450 px: subtítulos.
- 1500–1920 px: interfaz de la plataforma (descripción, botones). Nada importante aquí.
- Margen lateral: 80 px (derecha algo más por los botones).

## Movimiento
Curvas suaves (`salida` = cubic-bezier(0.16, 1, 0.3, 1), `suave` = (0.65, 0, 0.35, 1)). Cámara: dolly in/out
lento (≤ 15 % de escala por escena), parallax por capas, paneos cortos. Transición entre escenas: fundido de
12 frames con desenfoque 10 → 0 px y escala 1,03 → 1. Elementos que aparecen sincronizados con la palabra que
los nombra. Sin destellos, glitches ni rebotes.

## Sonido
Voz a −16 LUFS integrados (pico ≤ −1,5 dBTP). Música original suave (pads + piano + bajo), atenuada
automáticamente mientras habla la voz. Efectos discretos: «tick» al aparecer un dato, «pop» para la cifra clave,
«whoosh» muy bajo en transiciones, «papel» en documentos.

## Etiquetas de transparencia
«Imagen ilustrativa», «Recreación 3D ilustrativa», «Ejemplo hipotético», «Mapa ilustrativo». Arriba a la
izquierda, en píldora. Obligatorias cuando algo pueda confundirse con real.

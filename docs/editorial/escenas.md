# Catálogo de escenas (`escena.tipo` en guion.yaml)

Todas reciben `props` y se sincronizan con la voz mediante palabras (`en:`, `revelarEn:`, `encenderEn:`,
`cambiarEn:`, `tacharEn:`, `marca:`). La palabra debe aparecer en el `voz` del bloque. En pantalla, `*texto*`
se convierte en serif cursiva bronce.

| Tipo | Estilo | Props principales | Uso |
|---|---|---|---|
| `CinematicIntro` | A | `ilustracion` (`casa-atardecer`, `ventana-luz`, `mesa`, `mesa-arras`), `titular[]`, `etiqueta` | Gancho con plano general y titular. |
| `CinematicScene` | A | `ilustracion`, `texto`, `movimiento` (`dolly-in`, `dolly-out`, `paneo`), `etiqueta` | Plano de apoyo. |
| `ParallaxScene` | A/B | `revelarEn` | Casa con etiqueta «Precio»; la cámara baja y revela «Lo que viene después». |
| `DocumentReveal` | A | `documento`, `marca` (firma) **o** `lista[{texto,en,destacada}]`, `fuente` | Contrato sobre la mesa / checklist que se marca. |
| `KineticTypography` | C | `variante`: `titular` (`lineas[]`), `recibo` (`titulo`, `lineas[{texto,en}]`, `simbolo`), `contraste` (`lineas[2]`, `cambiarEn`), `pregunta` (`lineas[]`, `respuesta`, `en`) | Tipografía animada. |
| `FinancialChart` | C | `variante`: `pila` (`base`, `piezas[]`, `titulo`, `fuente`), `anillo` (`desde`, `hasta`, `etiqueta`, `en`, `fuente`), `barras` (`filas[{texto,valor,en,destacada}]`, `etiqueta`) | Gastos apilados, porcentaje, cascada de importes. |
| `AnimatedNumber` | C | `variante`: `hucha` (`lineas[]`, `conclusion`), `calculadora` (`operacion[]`, `resultado{texto,valor,en}`, `nota`, `etiqueta`) | Cifras que cuentan. |
| `ComparisonScene` | B/D | `variante`: `balanza` (`izquierda`, `derecha`, `inclinarHacia`), `tarjetas` (`signo`, `tacharEn`, `etiqueta`, `conclusion`), `giro` (`cambiarEn`) | Comparar dos ideas. |
| `ArchitectureScene` | D | `modelo: local`, `camara` (`aproximacion`, `interior`, `cenital`), `titular[]`, `cartel`, `encenderEn`, `fichas[{texto,en}]`, `etiqueta` | Local comercial 3D (calle, interior, maqueta en corte). |
| `MapScene` | B | `titulo`, `puntos[{nombre,x,y,en}]` | Mapa esquemático **ilustrativo** (sin pretensión cartográfica). |
| `EmotionalEnding` | A | `ilustracion` (`ventana-luz`, `llaves`), `frase[]` | Conclusión emocional. |
| `CTAEnding` | — | `accion` (`guardar`, `compartir`, `escribir`), `texto`, `palabraClave` | Llamada a la acción + firma de marca al acabar la voz. |

Capas globales (no se declaran en el guion): `DynamicSubtitle` (subtítulos), `BrandSignature` (firma final),
`MarcaAgua`, grano y viñeta (`Acabado`), transiciones, música con atenuación y efectos.

## Añadir una escena
1. Componente en `motor/src/escenas/` que reciba `EscenaProps` (`dur`, `marca`, `props`).
2. Registrar en `motor/src/escenas/index.ts` y en `TIPOS` de `motor/scripts/validar.mjs`.
3. Documentarla aquí. Probar con `node scripts/fotogramas.mjs <ID>`.

# Sistema de ganchos (primeros 3 segundos)

Regla: **10 candidatos por vídeo**, de al menos 4 familias distintas, puntuados de 1 a 5 en 7 criterios
(atención · identificación · claridad · curiosidad · intensidad · credibilidad · relación con el contenido;
máximo 35). Se elige el mejor y se anotan en `editorial.yaml` los 5 finalistas y el porqué.
**Un gancho fuerte nunca puede ser engañoso**: si no se puede sostener con el contenido, se descarta.
El validador rechaza ganchos idénticos y avisa de los parecidos (`contenido/registro.json`).

## Familias

| Familia | Necesidad psicológica | Ejemplos |
|---|---|---|
| A. Miedo a perder dinero | Protegerse | «Este error puede costarte miles de euros y probablemente todavía no lo sabes» · «Antes de comprar una vivienda, hay algo que deberías comprobar» · «Puedes estar pagando mucho más de lo que realmente vale» · «No cometas este error por tener prisa» |
| B. Identificación emocional | Sentirse comprendido | «Si llevas meses intentando comprar una casa, escucha esto» · «Sé que quieres independizarte, pero hay algo que necesitas saber» · «Si trabajas todos los meses y aun así no consigues ahorrar, esto te interesa» · «Hay decisiones que parecen buenas hasta que empiezas a pagarlas» |
| C. Curiosidad | Cerrar un hueco de información | «Hay una diferencia enorme entre comprar una casa barata y comprar bien» · «Esto es lo primero que estudiaría antes de comprar un local» · «Te voy a explicar algo que cambia completamente la forma de valorar una vivienda» · «La pregunta importante no es cuánto cuesta» |
| D. Contradicción | Romper una creencia | «No siempre es buena idea comprar la casa que puedes permitirte» · «A veces, vender puede ser peor decisión que esperar» · «Tener una hipoteca aprobada no significa que debas aceptarla» · «La vivienda más bonita no siempre es la mejor compra» |
| E. Urgencia racional | Actuar a tiempo, sin presión | «Antes de entregar una señal, dedica un minuto a esto» · «Si vas a vender tu vivienda este año, comprueba esto primero» · «Antes de firmar un contrato, hay tres cosas que debes entender» |
| F. Aspiración y esperanza | Avanzar | «No necesitas ganar más dinero para empezar a tomar mejores decisiones» · «Tu primera vivienda no tiene que ser perfecta. Tiene que tener sentido» · «Puedes empezar a construir tu futuro sin aparentar que ya lo has conseguido» |
| G. Confianza y honestidad | Encontrar a alguien fiable | «Si esta operación no te conviene, prefiero decírtelo» · «Voy a explicarte por qué quizá no deberías comprar esta vivienda» · «No todas las oportunidades merecen ser aprovechadas» · «Hay veces que la mejor operación es no hacer ninguna» |
| H. Preguntas incómodas | Mirarse con honestidad | «¿Comprarías una casa si supieras que vas a vivir justo todos los meses?» · «¿Sabes cuánto te cuesta realmente mantener una vivienda?» · «¿Estás comprando porque te conviene o porque tienes miedo de quedarte sin ella?» |

## Prohibido
Cifras inventadas · miedo artificial · promesas no garantizables · «último aviso», «solo hoy», «no te lo pierdas» ·
clickbait que el vídeo no cumple.

## Plantilla de evaluación (en `editorial.yaml`)
```yaml
ganchos:
  - { texto: "...", familia: D, atencion: 5, identificacion: 4, claridad: 5, curiosidad: 4, intensidad: 4, credibilidad: 5, relacion: 5 }
elegido: 0
motivo: "..."
```

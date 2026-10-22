---
name: historias-de-usuario
description: Convierte requisitos o un documento funcional en historias de usuario ("Como… quiero… para…") agrupadas en épicas, con prioridad MoSCoW, criterios de aceptación en Gherkin (Dado/Cuando/Entonces) y trazabilidad a requisitos y casos de prueba. Úsala cuando el usuario pida historias de usuario, criterios de aceptación, user stories, escenarios Gherkin, "pasar los requisitos a historias" o preparar el backlog de una funcionalidad, aunque solo diga "armemos las historias".
---

# Historias de usuario

Las historias expresan los requisitos desde la necesidad del usuario, y sus criterios de aceptación son el contrato que QA verifica. Parte de los requisitos `RF-xxx` del documento funcional (si existe, léelo primero) para que cada historia cite los requisitos que cubre y no se pierda ninguno.

## Proceso

1. Lee el documento funcional o los requisitos. Agrupa por épica (autenticación, catálogo, carrito, checkout, navegación…).
2. Define los roles reales (comprador, visitante, QA). Si no hay un rol que se beneficie de algo, no inventes una historia.
3. Escribe una historia por intención del usuario, no una por requisito: varios requisitos suelen caber en una historia.
4. Escribe los criterios de aceptación con los textos exactos del catálogo de mensajes.
5. Cierra con la matriz historia → requisitos → casos de prueba.

## Plantilla de cada historia

````
### HU-NN – Título corto
**Como** [rol], **quiero** [acción] **para** [beneficio].

**Prioridad:** Must|Should|Could · **Requisitos:** RF-… · **Casos:** XXX-NN

```gherkin
Escenario: …
  Dado que …
  Cuando …
  Entonces …
```
````

## Criterios de calidad

- **Independiente y pequeña:** se puede probar sola.
- **Un escenario, un resultado:** si un escenario verifica dos cosas distintas, sepáralo.
- **Esquema del escenario** con tabla de ejemplos cuando solo cambian los datos (campos vacíos, opciones de orden).
- **Mensajes literales:** copia el texto exacto; la automatización lo comparará tal cual.
- **Prioridad MoSCoW:** Must para el camino crítico de la compra o del negocio, Should para validaciones y funciones frecuentes, Could para lo accesorio.
- Lo que el negocio aún no definió no se inventa: déjalo como nota "Pendiente de definición" con referencia a la duda del documento funcional.

## Estructura del archivo

Por defecto `documentacion/historias-de-usuario-<producto>.md`: cabecera con el documento relacionado, roles, definición de terminado común, resumen por épica, historias por épica y la matriz de trazabilidad al final.

Una historia para usuarios de prueba con fallas intencionales se escribe desde el rol QA: el criterio de éxito es detectar y documentar la falla, no corregirla.

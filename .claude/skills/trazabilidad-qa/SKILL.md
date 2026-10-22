---
name: trazabilidad-qa
description: Revisa y mantiene la trazabilidad entre documento funcional (RF/RNF), historias de usuario (HU) y casos de prueba (LOG-, CAR-, VIS-…), detecta requisitos sin casos, casos sin requisito, IDs duplicados, conteos que no cuadran y mensajes que difieren entre documentos, y corrige la matriz. Úsala cuando el usuario pida revisar la cobertura, la matriz de trazabilidad, validar que todo esté enlazado, comprobar consistencia entre documentos de QA, o antes de hacer commit de documentación de pruebas.
---

# Trazabilidad QA

Los tres documentos (funcional, historias, casos) se escriben en momentos distintos y se desalinean fácilmente. Esta revisión demuestra cobertura: cada requisito tiene al menos un caso y cada caso apunta a un requisito. Esa es la respuesta a "¿qué probaron y qué no?".

## Revisión

1. **Inventario.** Lee los tres archivos y extrae los IDs: `RF-…`/`RNF-…`, `HU-…` y los casos (`XXX-NN`). Un script corto (regex) da las listas exactas y evita errores de lectura a ojo.
2. **Requisitos sin caso.** Todo `RF`/`RNF` debe aparecer en la columna "Requisito" de algún caso. Los que no, son huecos de cobertura: propón el caso.
3. **Casos sin requisito.** Un caso sin requisito es una duda para producto, no un error: debe decir "Sin requisito (duda n.º)" y existir esa duda en el documento funcional.
4. **IDs.** Sin duplicados, sin saltos inexplicables, y todas las referencias cruzadas apuntan a IDs que existen.
5. **Matrices coherentes.** La matriz del documento funcional (requisito → casos), la de las historias (historia → requisitos → casos) y la columna "Requisito" de los casos deben decir lo mismo. Si difieren, la fuente de verdad es la columna "Requisito" de cada caso; ajusta las matrices.
6. **Conteos.** La tabla resumen de casos coincide con las filas reales, y el camino crítico solo contiene IDs existentes.
7. **Mensajes literales.** Los textos de error y confirmación son idénticos en los tres archivos y coinciden con el catálogo de mensajes.
8. **Estado.** Si hay "Resultado real", ningún caso queda sin estado.

## Salida

Entrega un informe breve con: hallazgos por categoría (cantidad y los IDs afectados), qué corregiste y qué necesita decisión de alguien (p. ej. una duda de producto). Aplica las correcciones mecánicas (conteos, matrices, IDs); las que cambian el significado de un requisito se consultan primero.

No des por buena la trazabilidad por una lectura rápida; los desajustes están en las filas que no revisas.

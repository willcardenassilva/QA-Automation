---
name: flujo-qa
description: Guía el flujo completo de análisis y diseño de pruebas de QA como en una empresa real, de la documentación a los casos y al repositorio, en este orden: documento funcional, historias de usuario, casos de prueba (con visuales y camino crítico), revisión de trazabilidad y commit. Úsala cuando el usuario quiera simular el trabajo de un QA en una empresa, empezar a probar un sitio o aplicación desde cero, "armar todo el flujo QA" o ver qué sigue después de un paso, aunque no nombre las etapas.
---

# Flujo QA completo

En una empresa el QA no empieza probando: recibe documentación y de ella salen los casos. Esta skill encadena las etapas en el orden que usa un equipo y delega cada una en su skill.

| Etapa | Skill | Resultado | Archivo por defecto |
|-------|-------|-----------|---------------------|
| 1. Documentación | `documento-funcional` | Requisitos RF/RNF, pantallas con wireframes, dudas | `documentacion/documento-funcional-<producto>.md` |
| 2. Historias | `historias-de-usuario` | Historias con criterios Gherkin | `documentacion/historias-de-usuario-<producto>.md` |
| 3. Casos | `casos-de-prueba` | Casos funcionales y visuales, camino crítico | `casos-manuales/casos-de-prueba-<producto>.md` |
| 4. Revisión | `trazabilidad-qa` | Cobertura verificada y matrices coherentes | (corrige los anteriores) |
| 5. Entrega | (este flujo) | Commit y push al repositorio | |
| 6. Siguiente | ejecución y automatización | Resultados reales, defectos, pruebas automáticas del camino crítico | `automatizacion/` |

## Cómo conducirlo

1. **Ubica al usuario.** Mira qué archivos existen en el repositorio: si ya hay documento funcional, sigue en la etapa 2, y así sucesivamente. No rehagas lo que ya está.
2. **Ejecuta una etapa a la vez** con su skill, y confirma el resultado antes de pasar a la siguiente. Cada etapa depende de la anterior (los casos citan requisitos; las historias citan requisitos).
3. **Reporta con honestidad el origen de los datos:** si los textos, precios o comportamientos salieron de memoria o de exploración y no de una ejecución, dilo, porque los resultados esperados quedan "Pendiente" hasta ejecutar.
4. **Revisa trazabilidad antes de entregar** (etapa 4); es lo que evita requisitos sin casos y matrices desactualizadas.
5. **Entrega (etapa 5):** muestra qué archivos se van a subir. Haz commit y push solo cuando el usuario lo confirme. Si Git no tiene identidad configurada, pregunta con qué nombre y correo firmar (queda visible en el historial); no los inventes ni uses configuración global sin permiso.

## Después del diseño

La etapa 6 es lo siguiente natural: ejecutar los casos manuales para llenar "Resultado real" y registrar defectos con pasos, evidencia y severidad; luego automatizar el camino crítico (por ejemplo con Playwright, usando los textos originales de la interfaz, no la traducción del navegador) y referenciar cada prueba automática desde su caso.

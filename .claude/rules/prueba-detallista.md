# Pruebas detallistas, visuales y con todos los usuarios

Esta regla se aplica en todo el proyecto. El detalle completo y las técnicas están en la skill `qa-exhaustivo`.

- **No basta con probar la función.** Cada vista se prueba también visualmente: posición, alineación, tamaños, imágenes,
  estados, contraste, consistencia entre pantallas y resoluciones.
- **Prueba con todos los usuarios existentes** (`agent-config/credentials/saucedemo-users.md`), con las mismas
  verificaciones y comparando contra `standard_user`. La matriz está en `automatizacion/tests/todos-los-usuarios.spec.ts`.
- **Mide antes de concluir.** Posiciones, estilos calculados, transformaciones (también de los elementos hijos),
  tiempos, contraste y conteos. Un "se ve raro" sin medida no cierra un hallazgo.
- **Abre cada menú y submenú** y recorre cada opción; busca funciones no documentadas.
- **Revisa el contenido:** nombres, textos, imágenes y precios coherentes entre pantallas.
- **Cuando la persona aporta un hallazgo, verifícalo con medidas.** Si no se reproduce, pide la captura: no lo descartes.
- **Verifica tus propios tests** antes de culpar al producto (selectores, esperas de imágenes, medir el elemento correcto).
- Los defectos conocidos se dejan como fallos esperados (`test.fail`) con el motivo.

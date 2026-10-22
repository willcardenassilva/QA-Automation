# Resumen de ejecución – Usuarios especiales

| Campo | Valor |
|-------|-------|
| Fecha | 2026-10-22 |
| Herramienta | Playwright 1.64.1 (Chromium) |
| Estado | **Ejecutado** (15 comprobaciones, todas con el defecto esperado confirmado) |

| Caso | Usuario | Resultado | Defecto confirmado |
|------|---------|-----------|--------------------|
| USR-01 | `problem_user` | Defecto confirmado | 6 imágenes iguales |
| USR-02 | `problem_user` | Defecto confirmado | Solo 3 de 6 botones agregan |
| USR-03 | `problem_user` | Defecto confirmado | No ordena por precio ni Z–A |
| USR-04 | `problem_user` | Defecto confirmado | Apellido en el campo del nombre |
| USR-05 | `performance_glitch_user` | Defecto confirmado | Login de unos 5,6 s |
| USR-06 | `error_user` | Defecto confirmado | No completa la compra |
| USR-07a | `visual_user` | Defecto confirmado | Precios distintos |
| USR-07b | `visual_user` | Defecto confirmado | Ícono del carrito desplazado |
| USR-02b | `error_user` | Defecto confirmado | Solo 3 de 6 botones agregan |
| USR-02c | `error_user` | Defecto confirmado | "Remove" del listado no quita |
| USR-03b | `error_user` | Defecto confirmado | Aviso "Sorting is broken! … reported to Backtrace" al ordenar |
| USR-05b | `performance_glitch_user` | Defecto confirmado | Ordenar tarda unos 5 s |
| USR-07c | `visual_user` | Defecto confirmado | Imagen del primer producto distinta |
| USR-07d | `visual_user` | Defecto confirmado | Botón Checkout del carrito desplazado |
| USR-07e | `visual_user` | Defecto confirmado | Ícono del menú rotado unos 3° |

## Notas

- `error_user` comparte con `problem_user` el fallo de botones y de orden.
- El umbral de 3 s para USR-05 es una propuesta de prueba: el documento no define un tiempo máximo (duda 11.4).

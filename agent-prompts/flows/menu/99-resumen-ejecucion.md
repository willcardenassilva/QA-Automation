# Resumen de ejecución – Menú lateral

| Campo | Valor |
|-------|-------|
| Fecha | 2026-10-22 |
| Herramienta | Playwright 1.64.1 (Chromium) |
| Estado | **Ejecutado** |

| Caso | Resultado | Evidencia / nota |
|------|-----------|------------------|
| MEN-01 | PASS con diferencia | Se abre y cierra. La app muestra 5 opciones (incluye "Dynamic Catalog"); el documento define 4. El test `MEN-01b` lo registra como fallo esperado |
| MEN-02 | PASS | All Items vuelve al listado |
| MEN-03 | PASS | El enlace apunta a saucelabs.com |
| MEN-04 | Parcial | El contador se vacía; los botones no vuelven a "Add to cart" hasta recargar. El test `MEN-04b` lo registra como defecto |

## Diferencias app ≠ documento

- RF-MEN-01: el menú tiene una quinta opción, "Dynamic Catalog". Decidir si se actualiza el documento o si es un cambio no especificado.
- RF-MEN-05: "Reset App State" no actualiza los botones del listado sin recargar (defecto de la app).

## Bugs sugeridos (borrador, sin crear)

- `[Menú] Reset App State no devuelve los botones a "Add to cart"` — severidad Minor, RF-MEN-05, caso MEN-04.

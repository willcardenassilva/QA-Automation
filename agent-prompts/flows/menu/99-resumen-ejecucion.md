# Resumen de ejecución – Menú lateral

| Campo | Valor |
|-------|-------|
| Fecha | 2026-10-22 |
| Herramienta | Playwright 1.64.1 (Chromium) |
| Estado | **Ejecutado** |

| Caso | Resultado | Evidencia / nota |
|------|-----------|------------------|
| MEN-01 | PASS | Se abre y cierra con las 5 opciones del documento 1.1 (incluye "Dynamic Catalog"). El test `MEN-01b` verifica la lista exacta |
| MEN-02 | PASS | All Items vuelve al listado |
| MEN-03 | PASS | El enlace apunta a saucelabs.com |
| MEN-04 | Parcial | El contador se vacía; los botones no vuelven a "Add to cart" hasta recargar. El test `MEN-04b` lo registra como defecto |

## Diferencias app ≠ documento

- RF-MEN-01: el menú tiene una quinta opción, "Dynamic Catalog". **Resuelta:** se agregó al documento funcional 1.1 (RF-MEN-01, RF-MEN-06 y sección 5.9).
- RF-MEN-05: "Reset App State" no actualiza los botones del listado sin recargar (defecto de la app).

## Bugs sugeridos (borrador, sin crear)

- `[Menú] Reset App State no devuelve los botones a "Add to cart"` — severidad Minor, RF-MEN-05, caso MEN-04.

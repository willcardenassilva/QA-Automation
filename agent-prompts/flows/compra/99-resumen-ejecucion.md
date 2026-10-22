# Resumen de ejecución – Compra

| Campo | Valor |
|-------|-------|
| Modo | TURBO (casos críticos automatizados) |
| Fecha | 2026-10-22 |
| Navegador / resolución | Chromium (Desktop Chrome de Playwright) |
| Herramienta | Playwright 1.64.1 (Chromium) |
| Estado | **Parcial:** 8 casos críticos ejecutados; los edge cases siguen pendientes |

## Resultados

| Caso | Resultado | Evidencia | Bug / nota |
|------|-----------|-----------|------------|
| PRO-01 | PASS | Automatizado, 2026-10-22 | |
| PRO-04 | PASS | Automatizado, 2026-10-22 | |
| CAR-01 | PASS | Automatizado, 2026-10-22 | |
| CAR-05 | PASS | Automatizado, 2026-10-22 | |
| CHK-01 | PASS | Automatizado, 2026-10-22 | |
| CHK-08 | PASS | Automatizado, 2026-10-22 | |
| CHK-09 | PASS | Automatizado, 2026-10-22 | |
| CHK-10 | Pendiente | | |
| CHK-02 | PASS | Automatizado, 2026-10-22 | |
| CHK-03…07, 11, 12 | Pendiente | | |
| CAR-02…04, 06…09 | Pendiente | | |

## Cálculos de la ejecución

| Concepto | Esperado | Real |
|----------|----------|------|
| Item total | suma de precios leídos de la pantalla | coincide (CHK-08) |
| Tax (8 %) | subtotal × 0.08, 2 decimales | coincide (CHK-09) |
| Total | subtotal + tax | coincide (CHK-09) |

## Totales

PASS: 8 · FAIL: 0 · WARNING: 0 · Pendiente: edge cases (CHK-03…07, 11, 12; CAR-02…04, 06…09)

## Diferencias app ≠ documento

(ninguna registrada todavía)

## Bugs sugeridos

(ninguno)

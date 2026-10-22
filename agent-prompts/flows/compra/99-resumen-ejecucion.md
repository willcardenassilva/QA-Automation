# Resumen de ejecución – Compra

| Campo | Valor |
|-------|-------|
| Modo | COMPLETO (automatizado) |
| Fecha | 2026-10-22 |
| Navegador / resolución | Chromium (Desktop Chrome de Playwright) |
| Herramienta | Playwright 1.64.1 (Chromium) |
| Estado | **Ejecutado** (casos críticos y de regresión) |

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
| CHK-10 | PASS | Automatizado (`checkout-regresion.spec.ts`), 2026-10-22 | |
| CHK-02 | PASS | Automatizado, 2026-10-22 | |
| CHK-03…07, 11 | PASS | Automatizado (`checkout-regresion.spec.ts`), 2026-10-22 | |
| CHK-12 | Defecto confirmado | El sitio permite iniciar el checkout con el carrito vacío (duda 11.1); el test lo registra como fallo esperado | Posible defecto |
| CAR-02…04, 06…09 | PASS | Automatizado (`carrito-regresion.spec.ts`), 2026-10-22 | |
| PRO-02, 03, 05, 06, 07, 08 | PASS | Automatizado (`inventario-detalle.spec.ts`), 2026-10-22 | |

## Cálculos de la ejecución

| Concepto | Esperado | Real |
|----------|----------|------|
| Item total | suma de precios leídos de la pantalla | coincide (CHK-08) |
| Tax (8 %) | subtotal × 0.08, 2 decimales | coincide (CHK-09) |
| Total | subtotal + tax | coincide (CHK-09) |

## Totales

PASS: 29 · Defecto confirmado: 1 (CHK-12) · FAIL: 0 · Pendiente: 0

## Diferencias app ≠ documento

- CHK-12: el documento no define el comportamiento con el carrito vacío (duda 11.1); la app permite avanzar.

## Bugs sugeridos

(ninguno)

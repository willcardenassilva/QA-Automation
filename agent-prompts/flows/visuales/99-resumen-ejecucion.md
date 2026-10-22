# Resumen de ejecución – Pruebas visuales

| Campo | Valor |
|-------|-------|
| Fecha | 2026-10-22 |
| Herramienta | Playwright 1.64.1 (Chromium) |
| Estado | **Ejecutado** (VIS-01…VIS-24) |

**Resultado:** PASS en los 24 casos. VIS-25 se cubre en `usuarios-especiales` (defecto intencional confirmado).

## Diferencias app ≠ documento (por revisar con producto)

| Caso | Documento funcional / wireframe | App observada |
|------|----------------------------------|---------------|
| VIS-15 | Botón "Back Home" centrado | Desplazado del centro (documento 1.1: observación y duda 11.11) |
| VIS-16 | Fondo atenuado al abrir el menú | Sin elemento de fondo atenuado (el menú de 5 opciones ya está en el documento 1.1) |

**Corregido en el documento 1.1:** el pie dice "X" (antes Twitter) y el menú tiene 5 opciones (antes 4).

## Pendiente

- Línea base de capturas comparables píxel a píxel (por sistema operativo).

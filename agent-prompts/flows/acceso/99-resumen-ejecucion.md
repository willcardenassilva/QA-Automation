# Resumen de ejecución – Acceso

| Campo | Valor |
|-------|-------|
| Modo | COMPLETO (automatizado con Playwright + verificación manual de LOG-06…09 en el navegador) |
| Fecha | 2026-10-22 |
| Navegador / resolución | Navegador integrado de Claude, viewport del panel |
| Herramienta | Playwright 1.64.1 (Chromium) y navegador integrado |
| Estado | **Ejecutado** (12 de 12 casos) |

## Resultados

| Caso | Resultado | Evidencia | Bug / nota |
|------|-----------|-----------|------------|
| LOG-01 | PASS | Automatizado (`acceso.spec.ts`), 2026-10-22 | |
| LOG-02 | PASS | Automatizado (`acceso.spec.ts`), 2026-10-22 | |
| LOG-03 | PASS | Automatizado (`acceso.spec.ts`), 2026-10-22 | |
| LOG-04 | PASS | Automatizado (`acceso.spec.ts`), 2026-10-22 | |
| LOG-09 | PASS | Mensaje exacto `Epic sadface: You can only access '/inventory.html' when you are logged in.` (con el prefijo); misma conducta en `/cart.html` y `/checkout-step-one.html` | |
| OUT-01 | PASS | Automatizado (`acceso.spec.ts`), 2026-10-22 | |
| LOG-05 | PASS | Automatizado (`acceso.spec.ts`), 2026-10-22 | |
| LOG-06 | PASS | Mensaje exacto `Epic sadface: Password is required`; banner rojo con X y ambos campos en rojo | |
| LOG-07 | PASS | Mensaje exacto `Epic sadface: Username is required` | |
| LOG-08 | PASS | La X cierra el banner | WARNING menor: tras cerrar la X los campos conservan la clase `input_error` (borde rojo); el documento no lo define |
| LOG-10 | PASS | Automatizado (`acceso.spec.ts`), 2026-10-22 | |
| OUT-02 | PASS | Automatizado (`acceso.spec.ts`), 2026-10-22 | |

## Totales

PASS: 12 · FAIL: 0 · WARNING: 1 (menor, en LOG-08) · Pendiente: 0

## Diferencias app ≠ documento

- Ninguna en mensajes: los cuatro textos observados coinciden con el catálogo del documento funcional.
- Observación técnica: al abrir una URL protegida sin sesión, la pestaña muestra brevemente el título "Single Page Apps for GitHub Pages" (redirección por una página 404 de GitHub Pages) antes de llegar al login. No es un defecto; se anota en `ECOSYSTEM-CONTEXT.md`.
- Los casos con contraseña se ejecutaron con Playwright, que inicia sesión desde el código.

## Bugs sugeridos

(ninguno)

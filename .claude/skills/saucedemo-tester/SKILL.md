---
name: saucedemo-tester
description: Ejecuta pruebas manuales asistidas en SauceDemo (Swag Labs, https://www.saucedemo.com) con el navegador: health check rápido, flujos de agent-prompts/flows (login, compra, carrito, visuales), validación de UI y red, reporte PASS/FAIL/WARNING y borrador de bugs. Úsala siempre que el usuario pida ejecutar, correr, probar o validar algo en SauceDemo, pasar un flujo en modo TURBO/COMPLETO/REGRESIÓN, una "pasada rápida", un smoke test o reportar un defecto del sitio, aunque no nombre la skill.
---

# SauceDemo tester

Esta skill define cómo el agente ejecuta pruebas en el navegador sin inventar nada. El producto, los usuarios y los textos salen de los documentos del repo; el agente observa, compara y reporta.

## Antes de empezar

1. Lee `agent-prompts/ECOSYSTEM-CONTEXT.md` y el flujo pedido en `agent-prompts/flows/<épica>/` (README + `EJECUTAR-TESTS.md`). Si el usuario no indica flujo, propón el health check.
2. **URL:** https://www.saucedemo.com (es el único entorno; no hay staging separado). No uses otras URLs.
3. **Credenciales:** los usuarios están en `agent-config/credentials/saucedemo-users.md`. No las escribas dentro de skills ni flujos. **El agente no escribe contraseñas**, ni siquiera la de demo: ver "Login y contraseñas".
4. **Navegador:** Playwright MCP (`mcp__playwright__browser_*`) si está disponible; si no, el navegador integrado (`mcp__Claude_Browser__*`). Si ninguno responde, dilo y detente.

## Pre-flight

- ¿Hay una sesión previa? Haz logout o abre una pestaña limpia para partir de un estado conocido.
- ¿Qué usuario exige el flujo? (`standard_user` salvo que el caso pida otro.)
- ¿El carrito está vacío? Usa "Reset App State" del menú antes de los flujos de compra.
- Anota navegador y resolución; los resultados dependen de ellos.

## Login y contraseñas

La herramienta del agente no permite escribir contraseñas en formularios de login, tampoco la pública de demo (`secret_sauce`). Por eso el login se reparte así:

- **Protocolo de login asistido:** el agente abre `/` y escribe el usuario; después **pide a la persona** que escriba la contraseña directamente en el panel del navegador (debe estar visible) y que avise. El agente pulsa Login (o lo hace la persona), y verifica la sesión: URL `/inventory.html`, título "Products" y cookie `session-username`.
- **Pasos marcados `[PERSONA]`** en los flujos: son los que escriben una contraseña. La persona los hace; el agente **observa y verifica** el resultado y los mensajes.
- **Casos sin contraseña** (campos vacíos LOG-05, LOG-06, LOG-07, acceso directo LOG-09, logout) el agente los ejecuta completos.
- Si no hay nadie para escribir la contraseña, no improvises: detente y pídela. Para ejecuciones sin intervención usa la automatización con Playwright (etapa 7), donde el código hace el login.

## Health check express ("pasada rápida", ~2 min)

1. Abrir `/` → se ve el formulario de login.
2. Login `standard_user` (contraseña: **[PERSONA]**, ver "Login y contraseñas") → URL `/inventory.html`, título "Products", **6** productos.
3. Agregar un producto → botón "Remove" y badge `1`.
4. Abrir el carrito → el producto aparece.
5. Checkout → el paso 1 muestra los 3 campos.
6. Menú → "Reset App State" y "Logout" → vuelve a login.

Resultado: **OK** si los 6 pasos pasan; si uno falla, detente, anota cuál y evalúa si es un bug o un problema de entorno.

## Mindset QA

- No asumas: observa y cita el texto literal que ves.
- Cruza antes de declarar bug: documento funcional, otros flujos y el comportamiento del usuario estándar.
- No marques "bug persiste" por timing: espera, relee la pantalla y repite.
- Los mensajes `Epic sadface: …` y `Error: … is required` son **esperados** cuando provocas el error; el bug es que falten o difieran del catálogo.
- Los usuarios `problem_user`, `error_user`, `visual_user` y `performance_glitch_user` fallan a propósito. Documenta las fallas; no las tomes por regresión.

## Severidad

**Blocker:** impide login o completar la compra. **Major:** función importante o cálculo incorrecto. **Minor:** cosmético o de texto.

## Flujo de trabajo

1. **Entender:** qué se prueba, qué casos (`LOG-01`…) y qué requisitos (`RF-…`).
2. **Setup:** pre-flight, estado limpio.
3. **Ejecutar:** paso a paso, con captura de pantalla donde el flujo lo pida.
4. **Auditar:** red y consola tras cargar cada vista (regla `browser-network-capture`); estado en cookie y carrito.
5. **Reportar:** `99-resumen-ejecucion.md` del flujo con PASS / FAIL / WARNING y evidencia; si hay FAIL, borrador de bug según la regla `github-bug-creation` (sin crearlo hasta que el usuario confirme).

Usa **WARNING** cuando el resultado difiere del documento pero este aún tiene una duda abierta, o cuando algo es dudoso y no se pudo reproducir.

## Al terminar

- **No cierres el navegador**, salvo que el usuario lo pida.
- Resume en pocas líneas: modo, casos ejecutados, conteo PASS/FAIL/WARNING, bugs sugeridos y hallazgos de documentación (app ≠ documento).
- Para profundizar en una pantalla usa `saucedemo-testing-method`; para cálculos de compra, `saucedemo-checkout`.

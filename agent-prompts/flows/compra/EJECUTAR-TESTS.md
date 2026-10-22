# Ejecutar la épica Compra

Lee antes: `.claude/skills/saucedemo-tester/SKILL.md` y `.claude/skills/saucedemo-checkout/SKILL.md`. Usuario: `standard_user` (credenciales en `agent-config/credentials/saucedemo-users.md`).

## Modos

- **TURBO:** `01`, `02` y `03` en orden. Sin auditoría de red.
- **COMPLETO:** TURBO + `_edge-cases/` + red y consola en inventario, carrito y los tres pasos del checkout.
- **REGRESIÓN:** solo los archivos con FAIL/WARNING previo en `99-resumen-ejecucion.md`.

## Estado inicial (cada archivo)

1. Login con `standard_user` (login asistido: el agente escribe el usuario y la persona escribe la contraseña **[PERSONA]**; ver `saucedemo-tester`). Con la sesión abierta, el resto del flujo lo ejecuta el agente.
2. Menú → Reset App State (carrito en 0). Después recargar `/inventory.html`.

## Datos

- Formulario válido y productos: `agent-prompts/test-data/README.md`.
- **Anota los precios que muestra la pantalla** antes de calcular; no uses los del catálogo del documento.

## Resultado

Completa `99-resumen-ejecucion.md`. En los cálculos, registra valores esperados y reales. Para cada FAIL, borrador de bug (regla `github-bug-creation`), sin crearlo hasta que el usuario confirme. No cierres el navegador.

# Ejecutar la épica Menú lateral

Lee antes: `.claude/skills/saucedemo-tester/SKILL.md`. El login con `standard_user` lo hace el código de Playwright. Si el agente repite el flujo a mano, el login es asistido (la persona escribe la contraseña, **[PERSONA]**; ver `saucedemo-tester`).

- **Automatizado:** `npx playwright test menu` (4 casos y 2 comprobaciones de hallazgos).
- **TURBO / COMPLETO:** el archivo `01` completo. **REGRESIÓN:** solo los casos con WARNING o defecto en `99-resumen-ejecucion.md`.
- Estado inicial: sesión iniciada y carrito en 0.

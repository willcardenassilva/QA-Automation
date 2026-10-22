# Ejecutar la épica Usuarios especiales

El login con `standard_user` lo hace el código de Playwright. Si el agente repite el flujo a mano, el login es asistido (la persona escribe la contraseña, **[PERSONA]**; ver `saucedemo-tester`).

- **Automatizado:** `npx playwright test usuarios-especiales`.
- Todos los usuarios usan la contraseña común de demo (`agent-config/credentials/saucedemo-users.md`).
- Si un test marcado como fallo esperado **pasa**, el defecto desapareció: actualiza `99-resumen-ejecucion.md` y la documentación.
- Los defectos de estos usuarios no se reportan como bugs del producto: se documentan con el prefijo `[Usuario de prueba]`.

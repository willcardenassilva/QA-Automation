# Ejecutar la épica Pruebas visuales

El login con `standard_user` lo hace el código de Playwright. Si el agente repite el flujo a mano, el login es asistido (la persona escribe la contraseña, **[PERSONA]**; ver `saucedemo-tester`).

- **Automatizado:** `npx playwright test visual`. El informe (`npx playwright show-report`) incluye las capturas de cada vista.
- Resolución base: 1920×1080 en Chromium. Las demás resoluciones están en el archivo `02`.
- Una diferencia con los wireframes del documento funcional se registra como WARNING y se lista en `99-resumen-ejecucion.md`.

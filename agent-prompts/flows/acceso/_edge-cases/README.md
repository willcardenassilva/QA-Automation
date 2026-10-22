# Edge cases – Acceso (modo COMPLETO)

Los casos que escriben una contraseña (LOG-10, OUT-02 y los de "Para romper" con contraseña) los hace la **[PERSONA]** en ese paso; LOG-05, LOG-06, LOG-07 y LOG-08 no escriben contraseña y los ejecuta el agente completos. Cada fila es un caso corto. Registra el resultado en `../99-resumen-ejecucion.md`. Recarga `/` entre casos.

| Caso | Acción | Resultado esperado | Requisito |
|------|--------|--------------------|-----------|
| LOG-05 | Username vacío, contraseña de demo, Login | `Epic sadface: Username is required` | RF-LOG-05 |
| LOG-06 | `standard_user`, Password vacío, Login | `Epic sadface: Password is required` | RF-LOG-06 |
| LOG-07 | Ambos vacíos, Login | `Epic sadface: Username is required` | RF-LOG-05 |
| LOG-08 | Provocar un error y pulsar la X del mensaje | El mensaje desaparece | RF-LOG-07 |
| LOG-10 | `Standard_User` + contraseña de demo | Mensaje de credenciales inválidas (distingue mayúsculas) | RF-LOG-08 |
| OUT-02 | Login, logout y botón "atrás" del navegador | No se ve el inventario sin sesión | RF-LOG-10 |

## Para romper (extra, sin caso asignado)

- Username con espacios al inicio o al final (duda 11.2).
- Contraseña de demo con una letra en mayúscula.
- Doble clic rápido en Login.
- Abrir `/cart.html` y `/checkout-step-one.html` sin sesión: ¿mismo comportamiento que `/inventory.html`?

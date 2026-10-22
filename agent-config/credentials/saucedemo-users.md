# Usuarios de demo – SauceDemo

Datos públicos que muestra la propia página de login de https://www.saucedemo.com. No son secretos.

**Contraseña común:** `secret_sauce`

| Usuario | Comportamiento esperado |
|---------|-------------------------|
| `standard_user` | Funcionamiento normal |
| `locked_out_user` | No puede entrar: `Epic sadface: Sorry, this user has been locked out.` |
| `problem_user` | Fallas intencionales (imágenes, botones, orden, formulario) |
| `performance_glitch_user` | Funciona, con demoras intencionales |
| `error_user` | Fallas intencionales en acciones concretas |
| `visual_user` | Diferencias visuales intencionales |

Aunque la contraseña sea pública, el agente no la escribe en formularios: la escribe la persona (login asistido) o el código de automatización.

Si la página de login muestra una lista distinta, la de la página manda: repórtalo como diferencia con el documento.

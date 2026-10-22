# Login y contraseñas

El agente **no escribe contraseñas** en formularios de login, tampoco la pública de demo de SauceDemo. Esta regla evita
planear ejecuciones que dependan de algo que el agente no puede hacer.

## Protocolo de login asistido

1. El agente abre `/` y escribe el usuario.
2. La **persona** escribe la contraseña en el navegador y avisa. El panel del navegador debe estar visible y recibir el
   teclado; si la contraseña no llega al campo, usar Claude in Chrome.
3. El agente pulsa Login (o la persona) y verifica la sesión: URL `/inventory.html`, título "Products", cookie
   `session-username`.
4. Con la sesión abierta, el agente ejecuta el resto del flujo.

## Marcas en los flujos

- `[PERSONA]` en un paso = lo hace la persona porque escribe una contraseña. El agente observa y verifica.
- Los casos sin contraseña (campos vacíos, acceso directo sin sesión, logout) los ejecuta el agente completos.

## Si no hay sesión

No insistas ni reintentes en bucle: comprueba con el navegador si hay sesión (URL, cookie) y, si no la hay, pide la
contraseña a la persona o propón Claude in Chrome. Las ejecuciones sin intervención se hacen con pruebas en código
(Playwright), donde el código inicia la sesión.

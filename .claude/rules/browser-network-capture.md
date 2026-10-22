# Captura de red y estado con el navegador

Aplica con Playwright MCP (`browser_network_requests`, `browser_console_messages`) y, si no está disponible, con el
navegador integrado (`read_network_requests`, `read_console_messages`, `javascript_tool`).

## Cuándo capturar

- Después de **cargar cada vista** relevante (login, inventario, carrito, cada paso del checkout) y después de la acción
  que se está probando.
- Siempre que un resultado de UI parezca raro: la red y la consola dicen si fue un fallo de carga o de lógica.

## Qué esperar en SauceDemo

SauceDemo es una aplicación de una sola página sin API REST propia; el "Back" observable es limitado:

- Peticiones de **recursos estáticos** (HTML, JS, CSS, imágenes de productos) y de terceros (analítica). Un recurso con
  error 4xx/5xx o una imagen que no carga es un hallazgo.
- El estado vive en el navegador: cookie `session-username` (sesión) y almacenamiento local (carrito). Para validar
  persistencia o logout, lee estos valores.
- Errores en la consola **propios de la aplicación** se registran; los de extensiones o de terceros se anotan aparte.

## Cómo registrar

Para cada vista: URL, peticiones con error (método, URL, código), errores de consola y estado relevante (cookie, carrito).
Usa `agent-prompts/templates/endpoints-section-template.md`. No inventes endpoints: si no hubo llamadas, escríbelo.

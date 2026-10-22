# Contexto del producto – Swag Labs (SauceDemo)

> **Estado de los datos:** este contexto resume el documento funcional (`documentacion/documento-funcional-saucedemo.md`),
> que se escribió **sin ejecutar** la aplicación. Todo lo marcado `TODO(verificar)` debe confirmarse en la primera
> ejecución y corregirse en el documento (con autorización del usuario).

## Qué es

Tienda en línea de demostración publicada por Sauce Labs para practicar automatización. No hay registro de usuarios, pago
real ni backoffice. El único entorno es https://www.saucedemo.com.

- Tipo de app: aplicación web de una sola página (SPA) sin API REST propia observable. `TODO(verificar)` con la red.
- Observado (2026-10-22): las URLs protegidas abiertas sin sesión pasan por una página 404 de GitHub Pages (título "Single Page Apps for GitHub Pages") y redirigen al login con el mensaje `Epic sadface: You can only access '<ruta>' when you are logged in.`; sin recursos con error 4xx/5xx en esa carga.
- Idioma: inglés. La traducción de Chrome no es parte del producto.
- Estado: sesión en la cookie `session-username`; carrito en el almacenamiento del navegador. `TODO(verificar)`.

## Navegación

| Pantalla | URL | Sesión |
|----------|-----|--------|
| Login | `/` | No |
| Inventario | `/inventory.html` | Sí |
| Detalle | `/inventory-item.html?id=<n>` | Sí |
| Carrito | `/cart.html` | Sí |
| Checkout – datos | `/checkout-step-one.html` | Sí |
| Checkout – resumen | `/checkout-step-two.html` | Sí |
| Checkout – confirmación | `/checkout-complete.html` | Sí |

Flujo: Login → Inventario ⇄ Detalle → Carrito → Checkout (datos → resumen → confirmación). El menú lateral (☰) ofrece
All Items, About, Logout y Reset App State.

## Conceptos y reglas de negocio

- Un producto solo puede estar una vez en el carrito (no hay cantidades).
- Impuesto = 8 % del item total; total = item total + impuesto. `TODO(verificar)` el redondeo.
- Pago y envío son valores fijos (`SauceCard #31337`, `Free Pony Express Delivery!`). `TODO(verificar)`.
- Pantallas con sesión redirigen al login si no hay sesión, con un mensaje `Epic sadface: …`.

## Usuarios

Contraseña común de demo y lista de usuarios en `agent-config/credentials/saucedemo-users.md`. Los usuarios
`problem_user`, `performance_glitch_user`, `error_user` y `visual_user` tienen **fallas intencionales**.

## Mensajes de referencia

El catálogo completo está en la sección 8 del documento funcional. Los textos se comparan **literalmente**.

## Documentación relacionada

- Requisitos: `documentacion/documento-funcional-saucedemo.md`
- Historias de usuario: `documentacion/historias-de-usuario-saucedemo.md`
- Casos de prueba: `casos-manuales/casos-de-prueba-saucedemo.md`
- Dudas abiertas para producto: sección 11 del documento funcional (checkout con carrito vacío, validación de código postal, navegadores soportados, etc.)

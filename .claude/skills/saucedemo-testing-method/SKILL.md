---
name: saucedemo-testing-method
description: Metodología de auditoría exhaustiva de una pantalla o módulo de SauceDemo en 4 capas (Back, Front, UI, Doc) con captura de red, contrato observado y "prueba para romper" (datos inválidos, transiciones válido→inválido, límites, URLs directas). Úsala cuando el usuario pida una prueba exhaustiva, auditar una vista, buscar defectos a fondo, probar para romper, o validar contra el documento funcional, además de ejecutar un flujo normal.
---

# Metodología de prueba exhaustiva

Un flujo feliz que pasa no prueba que la pantalla esté bien. Esta metodología revisa cada vista por capas y luego intenta romperla. Úsala sobre una pantalla o módulo concreto (login, inventario, carrito, cada paso del checkout).

## Las 4 capas

SauceDemo es una aplicación de una sola página sin API REST propia, así que las capas se adaptan:

| Capa | Qué revisar | Cómo |
|------|-------------|------|
| **Back** | Peticiones tras cargar la vista: recursos estáticos y terceros; códigos de error; errores de consola; cookie `session-username` | Red y consola del navegador (regla `browser-network-capture`) |
| **Front** | Estado de la aplicación: contador del carrito, productos del carrito, persistencia al navegar, datos del formulario | Leer almacenamiento local y la UI tras cada acción |
| **UI** | Elementos, textos literales, estados de botones, mensajes de error, comportamiento de cada control | Contraste con los wireframes (sección 5 del documento funcional) y el catálogo de mensajes |
| **Doc** | Diferencias entre la app y el documento funcional/casos | Anota cada diferencia; no edites el documento (regla `doc-vs-app-and-locators`) |

Para cada vista, registra una sección **Contrato observado**: qué se vio en cada capa, usando `agent-prompts/templates/endpoints-section-template.md`. Si no hubo llamadas relevantes, dilo.

## Prueba para romper

Después del camino feliz, por cada formulario o acción:

- **Datos inválidos:** vacíos, solo espacios, mayúsculas/minúsculas, caracteres especiales, textos muy largos.
- **Orden de validación:** ¿qué campo se valida primero? Debe coincidir con el documento.
- **Transiciones válido → inválido:** ingresa datos correctos, avanza, vuelve con "atrás" y cambia a inválido; abre y cancela; agrega, quita y vuelve a agregar.
- **Límites:** 0, 1 y todos los productos en el carrito; carrito vacío en checkout (duda 11.1).
- **Acceso directo:** URLs de pantallas protegidas sin sesión y con sesión cerrada; saltarse pasos del checkout abriendo `/checkout-step-two.html` directamente.
- **Estado entre sesiones:** logout y nuevo login con el carrito lleno (duda 11.6).
- **Repetición:** el mismo botón dos veces rápido, recarga a mitad del flujo.

Todo comportamiento inesperado se reproduce dos veces antes de reportarlo.

## Salida

Por vista, una tabla con capa → observación → resultado (PASS/FAIL/WARNING) → evidencia, y una lista de diferencias app ≠ documento. Termina con los bugs sugeridos (borrador, sin crear) y las dudas nuevas para producto.

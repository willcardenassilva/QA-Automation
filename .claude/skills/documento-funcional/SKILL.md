---
name: documento-funcional
description: Redacta un documento funcional de QA para una aplicación web, con alcance, roles, mapa de navegación, wireframes en texto de cada pantalla, requisitos numerados (RF-xxx), reglas de negocio, catálogo de mensajes, requisitos visuales (RNF-VIS-xx) y dudas para producto. Úsala siempre que el usuario pida documentar funcionalidades, describir pantallas, "armar la documentación funcional", especificar requisitos de un sitio o producto, o preparar la base para escribir historias de usuario y casos de prueba, aunque no use la palabra "documento funcional".
---

# Documento funcional

En una empresa real el QA recibe la documentación antes de escribir casos. Este documento es esa fuente: define qué debe hacer el producto, de modo que los casos de prueba se deriven de requisitos y no solo de la exploración. Cada requisito lleva un ID estable porque las historias y los casos lo van a citar.

## Antes de escribir

1. Identifica el producto y su URL. Si está disponible, explóralo (navegador o capturas) para no inventar pantallas, textos ni precios. Lo que no puedas confirmar se marca como "por confirmar" en lugar de afirmarse.
2. Lista las pantallas y las acciones de cada una.
3. Anota las ambigüedades: lo que la documentación no define (p. ej. checkout con carrito vacío) va a la sección de dudas, no se resuelve por suposición.

## Estructura del documento

Escribe un solo archivo markdown, por defecto `documentacion/documento-funcional-<producto>.md`, con estas secciones en orden:

1. **Introducción:** objetivo, alcance, fuera de alcance, glosario. Incluye una tabla de cabecera (producto, URL, versión, audiencia, estado).
2. **Usuarios y roles:** permisos y comportamiento esperado por usuario. Si hay usuarios de prueba con fallas intencionales, indica que son defectos deliberados.
3. **Mapa de navegación:** tabla de pantallas con URL y si requiere sesión, más un diagrama de flujo en texto.
4. **Elementos comunes:** encabezado y pie, con wireframe.
5. **Pantallas:** una subsección por pantalla con (a) wireframe en bloque de código con caracteres de caja, (b) tabla de elementos (tipo y reglas) y (c) tabla de requisitos.
6. **Catálogo de datos:** p. ej. productos y precios, si el producto los tiene.
7. **Reglas de negocio:** `RN-xx`, incluidas las fórmulas (impuestos, totales).
8. **Catálogo de mensajes:** texto exacto de cada mensaje de error o confirmación, porque los casos y la automatización comparan texto literal. Anota el idioma real de la interfaz.
9. **Requisitos visuales (no funcionales):** `RNF-VIS-xx` (composición según wireframes, imágenes, consistencia de encabezado/pie y estilo, estados visuales, resoluciones soportadas).
10. **Matriz de trazabilidad:** requisito → casos de prueba. Déjala con los casos que ya existan; si aún no hay, deja la tabla preparada.
11. **Puntos a aclarar con producto:** tabla numerada con la duda y los casos afectados.

## Convención de requisitos

- Formato `RF-<MÓDULO>-<NN>`, p. ej. `RF-LOG-03`; los visuales `RNF-VIS-<NN>`.
- Un requisito, una verificación: si tiene un "y" que mezcla dos comportamientos comprobables, sepáralo.
- Redáctalos en presente y de forma comprobable: "Con credenciales inválidas muestra *…* y permanece en login".
- El orden de validación importa (qué campo se valida primero); decláralo cuando aplique.

## Wireframes en texto

Usa bloques de código con `┌─┐│└┘`. Muestra la posición relativa de los elementos, no el estilo. Un wireframe por pantalla y uno por cada estado que cambie el diseño (error, vacío, menú abierto). Alcanza con que sea legible; el objetivo es que QA sepa qué elementos deben existir y dónde.

## Al terminar

Indica qué datos salieron de memoria o de suposiciones y deben verificarse contra el producto real, y qué dudas quedaron abiertas. Si hay ya historias o casos escritos, actualiza la matriz de trazabilidad para que no queden requisitos sin casos.

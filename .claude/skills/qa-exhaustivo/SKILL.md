---
name: qa-exhaustivo
description: Forma detallista y exhaustiva de probar una aplicación web, funcional y visualmente, con todos los usuarios o roles existentes, midiendo en lugar de mirar (posiciones, estilos, contraste, tiempos, imágenes) y comparando cada usuario contra una línea base. Incluye listas de comprobación por vista, técnicas de medición y errores comunes que se deben evitar. Úsala en cualquier proyecto nuevo de QA, al diseñar pruebas, al auditar una pantalla, al revisar qué se pasó por alto, al comparar hallazgos manuales con los del agente, y siempre que el usuario pida pruebas "detalladas", "visuales", "con todos los usuarios", "exhaustivas" o "que no se escape nada".
---

# QA exhaustivo: el detalle es la diferencia

Probar solo "que funcione" deja pasar casi todo lo que un usuario real nota: un ícono inclinado, un nombre que parece código, un mensaje que cuesta leer, un botón corrido, una lista que cambia de precio. Estas pruebas se hacen **midiendo**, con **todos los usuarios o roles** que existan y **en todas las vistas**. Esta skill reúne lo aprendido en proyectos anteriores para aplicarlo desde el primer día.

## Principios

1. **Mide, no mires.** Una captura puede engañar; una medida no. Posición (`boundingBox`), estilo calculado (`getComputedStyle`), transformaciones, tamaño natural frente al mostrado de una imagen, contraste, tiempos. Una medida en el informe convence más que "se ve raro".
2. **Mira dentro del elemento.** El defecto puede estar en un hijo, un hermano o un pseudo-elemento, no en el contenedor. Un ícono inclinado estaba en una `<img>` junto al botón, y medir solo el botón decía "todo igual". Inspecciona el árbol completo antes de concluir "no se reproduce".
3. **Todos los usuarios y roles.** Prueba cada usuario existente (incluidos bloqueados, de prueba, con permisos distintos) con **las mismas verificaciones** y compáralo contra un usuario base. Una matriz usuarios × verificaciones muestra a la vez qué falla en quién y qué cambia entre ellos.
4. **Abre todo.** Despliega cada menú y submenú, pulsa cada opción, recorre cada pestaña. Una función no documentada ("Dynamic Catalog") estaba escondida en un submenú que nadie había abierto.
5. **Contenido, no solo función.** Que un texto cargue no significa que esté bien: nombres que son código, imagen que no coincide con el nombre, precios que cambian en cada carga, idioma mezclado, ortografía, formatos de moneda.
6. **Pruebas visuales en cada vista, no solo funcionales.** Composición, alineación, tamaños, imágenes, estados, consistencia entre pantallas y resoluciones.
7. **Verifica tus propias pruebas.** Un test que falla puede ser culpa del test: selectores ambiguos, imágenes sin cargar, esperas. Un test que pasa puede estar midiendo lo equivocado. Reproduce a mano un hallazgo antes de darlo por defecto.
8. **Tu lista y la de la persona se cruzan.** Verifica cada hallazgo manual con medidas. Si no se reproduce, pide la captura: lo que la persona vio vale más que una medición incompleta.

## Lista de comprobación por vista

Aplícala a **cada** pantalla y a cada estado (vacío, con datos, con error, cargando).

**Contenido**
- Textos exactos, ortografía, idioma, tono; mensajes literales del documento.
- Nombres, descripciones, precios e imágenes coherentes entre sí y entre pantallas (listado, detalle, carrito, resumen).
- Datos que cambian solos (precios aleatorios, orden inestable) o que se repiten.

**Visual y geometría**
- Posición de cada elemento frente al wireframe y frente a la línea base (`boundingBox`).
- Alineación de columnas y campos, mismo ancho/alto en elementos equivalentes, sin superposiciones.
- Íconos: tamaño, rotación o transformación del elemento **y de sus hijos**, nitidez.
- Imágenes: cargadas, sin deformar (relación natural frente a mostrada), sin sustitutas de error.
- Colores, tipografías y estilos de botones iguales entre pantallas; estados distinguibles (normal, activo, deshabilitado, error).
- Encabezado y pie idénticos; pie al fondo; enlaces del pie con el texto correcto.

**Accesibilidad básica**
- Contraste del texto contra su fondo (mínimo 4,5:1 en texto normal; ratio real calculado, no a ojo).
- Tamaño de texto legible, foco visible con teclado, texto alternativo en imágenes, roles y etiquetas en controles.

**Funcional**
- Camino feliz y negativos: vacío, inválido, mayúsculas, espacios, límites, orden de validación.
- Estados del carrito o de la lista: vacío, uno, todos, quitar, recargar.
- Cálculos con la suma hecha aparte (subtotal, impuesto, total, redondeo).

**Navegación y sesión**
- Atrás y adelante (con y sin sesión), recarga a mitad del flujo, URL directa a pantallas protegidas, pestañas múltiples.
- Cierre de sesión y regreso con "atrás"; sesión que persiste cuando no debería.

**Rendimiento**
- Tiempo de cada acción (login, cargar, ordenar, filtrar, abrir menú) frente a la línea base; el umbral lo define producto, si no, propón uno y márcalo como duda.
- No mezclar "lento" con "no funciona": si la acción no ocurre, la medición no aplica.

**Técnico**
- Red: recursos propios con error 4xx/5xx (distinguir las redirecciones del alojamiento).
- Consola: errores propios frente a los de terceros.
- Alertas y diálogos del navegador (un `alert` con "reportado a Backtrace" es un hallazgo).
- Resoluciones (escritorio, laptop, tablet, móvil) y zoom al 200 %: sin scroll horizontal ni elementos fuera de pantalla.

## Matriz de usuarios

1. Lista **todos** los usuarios o roles (revisa la página de login, la documentación y los datos de prueba).
2. Define 10 a 20 verificaciones comunes (login, listado, imágenes, precios, orden, agregar, quitar, formulario, compra, tiempos, posiciones, íconos).
3. Calcula una **línea base** con el usuario estándar (valores, posiciones, tiempos).
4. Ejecuta las mismas verificaciones con cada usuario y guarda la tabla completa.
5. Declara qué verificaciones **deben fallar** para cada usuario (defectos conocidos). El test falla si aparece un fallo nuevo **o** si un defecto desaparece, así detecta regresiones y correcciones.
6. Marca como "no aplica" lo que no se puede medir (el tiempo de un orden que no funciona).

## Técnicas de medición (Playwright)

| Qué | Cómo |
|-----|------|
| Posición y tamaño | `locator.boundingBox()` |
| Estilo, transformación, color | `getComputedStyle(el)`; recorrer hijos y hermanos |
| Imagen deformada o rota | `naturalWidth/naturalHeight` frente a `getBoundingClientRect()`; esperar a `img.complete` |
| Contraste | Luminancia relativa WCAG de texto y fondo (el fondo puede estar en un ancestro, no en el elemento) |
| Desborde horizontal | `scrollWidth <= clientWidth` y elementos con `right > clientWidth` (ignorando paneles fuera de pantalla a propósito) |
| Tiempos | `Date.now()` alrededor de la acción hasta una condición observable |
| Diálogos | `page.on('dialog', …)` para registrar el mensaje |
| Respuestas de red | `page.on('response', …)` separando `resourceType() === 'document'` |
| Errores de consola | `page.on('console', …)` filtrando por origen propio |

## Errores comunes que evitar

- Dar por buena una pantalla porque un test pasa, sin medir geometría ni contenido.
- Medir el contenedor y concluir "no se reproduce" sin mirar los hijos.
- Pulsar el título de un menú desplegable y no abrir sus opciones.
- Localizar por texto parcial (`hasText: 'red'` encontró la linterna "red light" en lugar de la camiseta roja).
- Medir imágenes antes de que carguen (resultado `NaN` o "no cargó").
- Cerrar con "no hay defecto" un comportamiento que simplemente no se probó con ese usuario o rol.
- Cambiar la documentación para que cuadre con la app: se reporta la diferencia y decide producto.

## Salida

Cada hallazgo lleva **esperado, observado y medida** (valor, posición, ratio, tiempo), el usuario con que se vio y una clasificación:
defecto del producto · defecto intencional de un usuario de prueba · diferencia app ≠ documento · por definir con producto · mejora · no reproducido.
Los defectos conocidos se dejan en el código como fallos esperados (`test.fail`) con su motivo, para que avisen si el sitio los corrige.

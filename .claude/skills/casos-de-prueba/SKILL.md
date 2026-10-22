---
name: casos-de-prueba
description: Escribe casos de prueba manuales (funcionales, negativos y visuales por vista) a partir de requisitos, historias de usuario o exploración, en tablas con ID, precondición, pasos, resultado esperado, prioridad, requisito y resultado real, y define el camino crítico a automatizar primero. Úsala cuando el usuario pida casos de prueba, plan de pruebas, pruebas manuales, pruebas visuales o de interfaz, "qué casos automatizar primero" o la matriz de casos de un sitio web, aunque solo diga "armemos las pruebas".
---

# Casos de prueba manuales

Un buen caso es repetible por otra persona sin preguntar nada, y se puede rastrear hasta un requisito. Por eso cada caso lleva ID, pasos concretos, un resultado esperado verificable y el requisito que cubre.

## Fuente de los casos

1. **Requisitos / historias primero.** Si existen el documento funcional y las historias, deriva los casos de sus requisitos y criterios de aceptación: así se sabe qué se probó y qué no.
2. **Exploración después.** Si solo hay un producto en funcionamiento, explóralo y escribe los casos, pero deja constancia de que los resultados esperados no están ejecutados todavía (estado "Pendiente") y marca con "**A verificar**" lo que depende de una definición faltante.
3. Los resultados esperados vienen de la documentación, no de lo que el producto hace hoy: si el producto contradice el requisito, eso es un defecto.

## Formato

Una tabla por módulo, con estas columnas:

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |

- **ID:** prefijo del módulo y número (`LOG-01`, `CAR-04`, `CHK-08`). Los IDs no se reutilizan.
- **Pasos:** numerados, con datos concretos y el valor exacto a ingresar.
- **Resultado esperado:** observable y con el texto literal de los mensajes.
- **Prior.:** A (crítico), M (media), B (baja).
- **Requisito:** `RF-xxx` o `RNF-xxx`; si no existe, escribe "Sin requisito (duda n.º)" y registra la duda.
- **Resultado real:** "Pendiente" hasta ejecutarlo; luego Pasó / Falló con una referencia al defecto.

## Qué cubrir por módulo

- **Camino feliz** y luego los **negativos**: datos inválidos, vacíos, mayúsculas/minúsculas, orden de validación.
- **Estados:** vacío, con datos, después de cancelar, después de volver con "atrás".
- **Acceso:** pantallas protegidas sin sesión, logout y regreso con "atrás".
- **Cálculos:** comprueba fórmulas con la suma hecha a mano (subtotales, impuesto, total).
- **Persistencia:** el estado se conserva al navegar.
- **Usuarios de prueba con fallas intencionales:** compáralos contra el comportamiento esperado y marca "posible defecto".

## Detalle y todos los usuarios

Antes de dar por completo el plan, revisa la skill `qa-exhaustivo`: lista de comprobación por vista (contenido, geometría,
accesibilidad, navegación, rendimiento, red) y la **matriz de todos los usuarios o roles** contra un usuario base. Cada
usuario existente debe pasar por las mismas verificaciones, y los defectos conocidos se declaran como fallos esperados.
Los hallazgos nuevos que salgan al comparar con la exploración manual se agregan como casos (sección "Hallazgos adicionales").

## Pruebas visuales por vista

Agrega una sección de casos `VIS-NN` con una columna "Vista". Por cada pantalla cubre: composición general según el wireframe, estados (error, vacío, botón activo, contador), alineación, imágenes cargadas y sin deformarse, íconos sin rotar, contraste del texto y consistencia entre pantallas (medidos, no a ojo). Luego casos transversales: encabezado y pie consistentes, tipografía y colores, resoluciones (1920×1080, 1366×768, 768×1024, 375×812), zoom al 200 % y recursos sin errores en la consola.

Método: ejecutar con el usuario estándar en un navegador y resolución base, guardar una captura por vista como línea base y comparar en cada ejecución; a futuro se automatiza con capturas comparables. Si no hay diseño oficial, la referencia son los wireframes del documento funcional.

## Camino crítico

Al final del archivo, una tabla con los casos a automatizar primero (6 a 15): los de prioridad A que cubren el flujo principal de negocio más un caso de cada tipo (login válido y negativo, acceso sin sesión, agregar y quitar, compra completa, validación de formulario, cálculo). Repite descripción, pasos clave, resultado esperado, prioridad y requisito, para que se pueda leer sola.

## Cabecera y resumen

Empieza el archivo con el sitio, tipo de prueba, usuarios y datos de prueba públicos, el estado de ejecución y la leyenda de prioridades. Termina con una tabla resumen que cuente los casos por módulo; verifica que el total coincide con las filas reales.

Archivo por defecto: `casos-manuales/casos-de-prueba-<producto>.md`.

# Casos de prueba manuales – SauceDemo (Swag Labs)

**Sitio bajo prueba:** https://www.saucedemo.com
**Tipo de prueba:** funcional, caja negra
**Usuarios de prueba (públicos, publicados en la propia página de login):**
`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`
**Contraseña pública de demo:** `secret_sauce`

> Estado de ejecución: todos los casos están en **Pendiente**. La columna "Resultado real" se completa al
> ejecutarlos. La columna "Requisito" enlaza cada caso con el
> [documento funcional](../documentacion/documento-funcional-saucedemo.md) (`RF-xxx`, `RNF-VIS-xx`).
> Los casos que se automaticen se referenciarán desde la carpeta `automatizacion/` (se creará al iniciar la automatización).

Prioridad: **A** = crítico, **M** = media, **B** = baja.

---

## 1. Login

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| LOG-01 | Login válido | Estar en la página de login | 1. Ingresar `standard_user` 2. Ingresar `secret_sauce` 3. Clic en Login | Se abre la página de productos (`/inventory.html`) con el título "Products" | A | RF-LOG-01, RF-LOG-02 | PASS (automatizado, 2026-10-22) |
| LOG-02 | Contraseña incorrecta | Estar en login | 1. Usuario `standard_user` 2. Contraseña inválida 3. Login | Mensaje: "Epic sadface: Username and password do not match any user in this service". Permanece en login | A | RF-LOG-03 | PASS (automatizado, 2026-10-22) |
| LOG-03 | Usuario inexistente | Estar en login | 1. Usuario inventado 2. Contraseña `secret_sauce` 3. Login | Mismo mensaje de credenciales inválidas | A | RF-LOG-03 | PASS (automatizado, 2026-10-22) |
| LOG-04 | Usuario bloqueado | Estar en login | 1. `locked_out_user` / `secret_sauce` 2. Login | Mensaje: "Epic sadface: Sorry, this user has been locked out." No accede | A | RF-LOG-04 | PASS (automatizado, 2026-10-22) |
| LOG-05 | Usuario vacío | Estar en login | 1. Dejar usuario vacío, contraseña `secret_sauce` 2. Login | Mensaje: "Epic sadface: Username is required" | M | RF-LOG-05 | PASS (automatizado, 2026-10-22) |
| LOG-06 | Contraseña vacía | Estar en login | 1. Usuario `standard_user`, contraseña vacía 2. Login | Mensaje: "Epic sadface: Password is required" | M | RF-LOG-06 | PASS (automatizado, 2026-10-22) |
| LOG-07 | Ambos campos vacíos | Estar en login | 1. Clic en Login sin datos | Mensaje: "Epic sadface: Username is required" | M | RF-LOG-05 | PASS (automatizado, 2026-10-22) |
| LOG-08 | Cerrar el mensaje de error | Tener un error visible (LOG-02) | 1. Clic en la X del mensaje | El mensaje desaparece | B | RF-LOG-07 | PASS (automatizado, 2026-10-22) |
| LOG-09 | Acceso directo sin sesión | Sin sesión iniciada | 1. Abrir `/inventory.html` directo en el navegador | No muestra productos; vuelve al login con mensaje "Epic sadface: You can only access '/inventory.html' when you are logged in." | A | RF-LOG-09 | PASS (automatizado, 2026-10-22) |
| LOG-10 | Distinción de mayúsculas | Estar en login | 1. Usuario `Standard_User` 2. `secret_sauce` 3. Login | Mensaje de credenciales inválidas (el usuario distingue mayúsculas) | B | RF-LOG-08 | PASS (automatizado, 2026-10-22) |

## 2. Cierre de sesión

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| OUT-01 | Logout desde el menú | Sesión iniciada | 1. Abrir menú (☰) 2. Clic en "Logout" | Vuelve a la página de login, campos vacíos | A | RF-MEN-04 | PASS (automatizado, 2026-10-22) |
| OUT-02 | Sin acceso tras logout | Haber hecho logout | 1. Botón "atrás" del navegador | No se puede ver la página de productos sin sesión | M | RF-LOG-10 | PASS (automatizado, 2026-10-22) |

## 3. Listado de productos

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| PRO-01 | Se listan los 6 productos | Login `standard_user` | 1. Observar la página | 6 productos, cada uno con imagen, nombre, descripción, precio y botón "Add to cart" | A | RF-PRO-01, RF-PRO-02 | PASS (automatizado, 2026-10-22) |
| PRO-02 | Orden por nombre A→Z | Login | 1. Selector de orden → "Name (A to Z)" | Productos ordenados alfabéticamente ascendente | M | RF-PRO-03 | PASS (automatizado, 2026-10-22) |
| PRO-03 | Orden por nombre Z→A | Login | 1. "Name (Z to A)" | Orden alfabético descendente | M | RF-PRO-03 | PASS (automatizado, 2026-10-22) |
| PRO-04 | Orden por precio menor a mayor | Login | 1. "Price (low to high)" | Precios en orden ascendente | M | RF-PRO-03 | PASS (automatizado, 2026-10-22) |
| PRO-05 | Orden por precio mayor a menor | Login | 1. "Price (high to low)" | Precios en orden descendente | M | RF-PRO-03 | PASS (automatizado, 2026-10-22) |
| PRO-06 | Detalle de producto por nombre | Login | 1. Clic en el nombre de un producto | Abre la página de detalle con nombre, descripción, precio e imagen correctos | A | RF-PRO-04, RF-PRO-07 | PASS (automatizado, 2026-10-22) |
| PRO-07 | Detalle de producto por imagen | Login | 1. Clic en la imagen | Mismo detalle que PRO-06 | B | RF-PRO-04, RF-PRO-07 | PASS (automatizado, 2026-10-22) |
| PRO-08 | Volver desde el detalle | Estar en detalle | 1. Clic en "Back to products" | Regresa al listado | M | RF-PRO-09 | PASS (automatizado, 2026-10-22) |

## 4. Carrito

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| CAR-01 | Agregar un producto | Login | 1. "Add to cart" en un producto | Botón cambia a "Remove"; el ícono del carrito muestra 1 | A | RF-PRO-05, RF-CAR-01 | PASS (automatizado, 2026-10-22) |
| CAR-02 | Agregar varios productos | Login | 1. Agregar 3 productos | El contador del carrito muestra 3 | A | RF-PRO-05, RF-CAR-01 | PASS (automatizado, 2026-10-22) |
| CAR-03 | Quitar desde el listado | Un producto en carrito | 1. Clic en "Remove" | Botón vuelve a "Add to cart"; el contador baja | A | RF-PRO-06, RF-CAR-01 | PASS (automatizado, 2026-10-22) |
| CAR-04 | Ver el carrito | 2 productos agregados | 1. Clic en el ícono del carrito | Abre `/cart.html` con los 2 productos, con cantidad y precio correctos | A | RF-CAR-02 | PASS (automatizado, 2026-10-22) |
| CAR-05 | Quitar desde el carrito | Estar en el carrito con productos | 1. Clic en "Remove" de un producto | El producto desaparece y el contador se actualiza | A | RF-CAR-03 | PASS (automatizado, 2026-10-22) |
| CAR-06 | Carrito vacío | Sin productos | 1. Abrir el carrito | Lista vacía, se puede volver con "Continue Shopping" | M | RF-CAR-07 | PASS (automatizado, 2026-10-22) |
| CAR-07 | Continuar comprando | Estar en el carrito | 1. "Continue Shopping" | Vuelve al listado conservando los productos del carrito | M | RF-CAR-04 | PASS (automatizado, 2026-10-22) |
| CAR-08 | Persistencia del carrito | Productos agregados | 1. Navegar al detalle y volver | El carrito mantiene los productos | M | RF-CAR-05 | PASS (automatizado, 2026-10-22) |
| CAR-09 | Agregar desde el detalle | Estar en el detalle de un producto | 1. "Add to cart" | El producto se agrega; el contador sube | M | RF-PRO-08 | PASS (automatizado, 2026-10-22) |

## 5. Checkout

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| CHK-01 | Compra completa (camino feliz) | Login, 1 producto en carrito | 1. Carrito → Checkout 2. Nombre, apellido y código postal válidos 3. Continue 4. Revisar resumen 5. Finish | Pantalla "Thank you for your order!"; el carrito queda vacío | A | RF-CAR-06, RF-CHK-05, RF-CHK-13, RF-CHK-14 | PASS (automatizado, 2026-10-22) |
| CHK-02 | Nombre vacío | En el paso 1 del checkout | 1. Dejar nombre vacío, completar el resto 2. Continue | Mensaje: "Error: First Name is required" | A | RF-CHK-02 | PASS (automatizado, 2026-10-22) |
| CHK-03 | Apellido vacío | Paso 1 | 1. Dejar apellido vacío 2. Continue | Mensaje: "Error: Last Name is required" | A | RF-CHK-03 | PASS (automatizado, 2026-10-22) |
| CHK-04 | Código postal vacío | Paso 1 | 1. Dejar código postal vacío 2. Continue | Mensaje: "Error: Postal Code is required" | A | RF-CHK-04 | PASS (automatizado, 2026-10-22) |
| CHK-05 | Todos los campos vacíos | Paso 1 | 1. Continue sin datos | Mensaje: "Error: First Name is required" | M | RF-CHK-02 | PASS (automatizado, 2026-10-22) |
| CHK-06 | Cancelar en el paso 1 | Paso 1 | 1. "Cancel" | Vuelve al carrito | M | RF-CHK-06 | PASS (automatizado, 2026-10-22) |
| CHK-07 | Cancelar en el resumen | Paso 2 | 1. "Cancel" | Vuelve al listado de productos | M | RF-CHK-12 | PASS (automatizado, 2026-10-22) |
| CHK-08 | Subtotal correcto | 3 productos en carrito | 1. Llegar al resumen 2. Sumar precios a mano | "Item total" = suma de los precios | A | RF-CHK-09 | PASS (automatizado, 2026-10-22) |
| CHK-09 | Impuesto y total | Resumen | 1. Comparar con el item total | Tax ≈ 8 % del item total; Total = item total + tax | A | RF-CHK-10, RF-CHK-11 | PASS (automatizado, 2026-10-22) |
| CHK-10 | Resumen coincide con carrito | Resumen | 1. Comparar productos y cantidades | Mismos productos y precios que en el carrito | A | RF-CHK-07 | PASS (automatizado, 2026-10-22) |
| CHK-11 | Volver al inicio tras comprar | Compra finalizada | 1. "Back Home" | Vuelve al listado con el carrito en 0 | M | RF-CHK-15 | PASS (automatizado, 2026-10-22) |
| CHK-12 | Checkout con carrito vacío | Carrito sin productos | 1. Intentar ir a Checkout | **A verificar:** el sitio podría dejar avanzar con carrito vacío (posible defecto) | M | Sin requisito (duda 11.1) | Defecto confirmado: el sitio permite iniciar el checkout con el carrito vacío (duda 11.1) (automatizado, 2026-10-22) |

## 6. Menú lateral

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| MEN-01 | Abrir y cerrar menú | Login | 1. ☰ 2. Clic en la X | Menú se abre con 4 opciones y se cierra | B | RF-MEN-01 | PASS con diferencia: la app muestra 5 opciones (incluye "Dynamic Catalog"); el documento define 4 (automatizado, 2026-10-22) |
| MEN-02 | All Items | Estar en el detalle de un producto | 1. Menú → "All Items" | Vuelve al listado | M | RF-MEN-02 | PASS (automatizado, 2026-10-22) |
| MEN-03 | About | Login | 1. Menú → "About" | Abre el sitio de Sauce Labs | B | RF-MEN-03 | PASS (automatizado, 2026-10-22) |
| MEN-04 | Reset App State | Productos en carrito | 1. Menú → "Reset App State" | El carrito queda en 0 y los botones vuelven a "Add to cart" | M | RF-MEN-05 | Parcial: el contador se vacía (PASS) pero los botones siguen en "Remove" hasta recargar (defecto, MEN-04b) (automatizado, 2026-10-22) |

## 7. Usuarios con comportamientos especiales

Estos usuarios están pensados para detectar defectos. Se prueban contra el comportamiento esperado del sitio.

| ID | Caso | Usuario | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|---------|-------|--------------------|--------|--------|---------------|
| USR-01 | Imágenes de productos | `problem_user` | 1. Login 2. Observar el listado | Cada producto muestra su propia imagen. **Posible defecto:** imágenes repetidas o incorrectas | M | RF-USR-01 | Defecto intencional confirmado: las 6 imágenes del listado son la misma (automatizado, 2026-10-22) |
| USR-02 | Agregar/quitar productos | `problem_user` | 1. Agregar y quitar productos desde el listado | Los botones y el contador funcionan igual que con `standard_user`. **Posible defecto:** algunos botones no responden | M | RF-USR-01 | Defecto intencional confirmado: solo 3 de 6 botones agregan al carrito (automatizado, 2026-10-22) |
| USR-03 | Orden de productos | `problem_user` | 1. Cambiar el orden por nombre o precio | El orden cambia correctamente. **Posible defecto:** no ordena | M | RF-USR-01 | Defecto intencional confirmado: no ordena por precio ni Z-A (automatizado, 2026-10-22) |
| USR-04 | Datos en checkout | `problem_user` | 1. Completar el formulario de checkout | Los datos ingresados se guardan en el campo correcto. **Posible defecto:** campos que no conservan lo escrito | M | RF-USR-01 | Defecto intencional confirmado: el apellido se escribe en el campo del nombre (automatizado, 2026-10-22) |
| USR-05 | Tiempo de respuesta | `performance_glitch_user` | 1. Login y medir cuánto tarda en cargar | Carga en un tiempo razonable. **Posible defecto:** demora de varios segundos | B | RF-USR-01 | Defecto intencional confirmado: el login tarda unos 5,6 s (estándar: 0,6 s) (automatizado, 2026-10-22) |
| USR-06 | Finalizar compra | `error_user` | 1. Completar una compra | La compra se completa. **Posible defecto:** errores al finalizar | M | RF-USR-01 | Defecto intencional confirmado: no se puede finalizar la compra (queda en el resumen) (automatizado, 2026-10-22) |
| USR-07 | Aspecto visual | `visual_user` | 1. Login y comparar con `standard_user` | La interfaz se ve igual. **Posible defecto:** elementos desalineados o con otro precio | B | RF-USR-01 | Defecto intencional confirmado: precios distintos y ícono del carrito desplazado (automatizado, 2026-10-22) |

## 8. Pruebas visuales (por vista)

Verifican que cada pantalla se ve como está definido en los wireframes del documento funcional (sección 5) y que no
hay defectos de presentación: elementos cortados, superpuestos, desalineados, imágenes rotas o estilos inconsistentes.

**Método:** ejecutar con `standard_user` en Chrome a 1920×1080 (resolución base) y guardar una captura de cada vista
como **línea base**. Las ejecuciones siguientes se comparan contra esa línea base; a futuro se automatizan con
capturas comparables de Playwright. Hasta que exista un diseño oficial (Figma), la referencia visual son los
wireframes del documento funcional.

| ID | Vista | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|-------|------|--------------|-------|--------------------|--------|--------|---------------|
| VIS-01 | Login | Composición general | Estar en login | 1. Observar la pantalla completa | Logo, campos Username y Password, botón Login y bloque de usuarios/contraseña visibles, centrados, sin superposiciones ni textos cortados | A | RNF-VIS-01 | PASS (automatizado, 2026-10-22) |
| VIS-02 | Login | Estado de error | Provocar el error de LOG-02 | 1. Observar el banner de error | Banner rojo con el texto completo y la X visibles; los campos se marcan en rojo; el layout no se desplaza de forma abrupta | M | RNF-VIS-04 | PASS (automatizado, 2026-10-22) |
| VIS-03 | Login | Campo de contraseña | Estar en login | 1. Escribir una contraseña | Los caracteres se muestran enmascarados; el texto de ayuda de cada campo es legible | B | RNF-VIS-01 | PASS (automatizado, 2026-10-22) |
| VIS-04 | Inventario | Encabezado y título | Login | 1. Observar la parte superior | Botón ☰ a la izquierda, logo "Swag Labs", ícono de carrito a la derecha, título "Products" y selector de orden alineado a la derecha | A | RNF-VIS-01 | PASS (automatizado, 2026-10-22) |
| VIS-05 | Inventario | Cuadrícula de productos | Login | 1. Observar las 6 tarjetas | Tarjetas del mismo tamaño y alineadas; imágenes cargadas, sin deformarse; precios con formato `$00.00`; descripciones sin cortarse de forma incorrecta | A | RNF-VIS-02 | PASS (automatizado, 2026-10-22) |
| VIS-06 | Inventario | Estados del botón y del badge | Login | 1. Agregar un producto 2. Observar botón y carrito | El botón pasa de "Add to cart" a "Remove" con un estilo distinto; el badge numérico aparece sobre el ícono del carrito, legible y bien posicionado | A | RNF-VIS-05 | PASS (automatizado, 2026-10-22) |
| VIS-07 | Inventario | Selector de orden | Login | 1. Abrir el selector | Muestra la opción activa y el desplegable con las 4 opciones legibles | B | RNF-VIS-01 | PASS (automatizado, 2026-10-22) |
| VIS-08 | Detalle | Composición | Login | 1. Abrir el detalle de un producto | Botón "Back to products" arriba; imagen grande a la izquierda sin deformarse; nombre, descripción, precio y botón a la derecha | M | RNF-VIS-01 | PASS (automatizado, 2026-10-22) |
| VIS-09 | Detalle | Estado "Remove" | Estar en el detalle | 1. "Add to cart" 2. Observar | El botón cambia a "Remove" con el mismo estilo que en el listado; el badge aparece | M | RNF-VIS-05 | PASS (automatizado, 2026-10-22) |
| VIS-10 | Carrito | Con productos | 2 productos en el carrito | 1. Abrir el carrito | Cabeceras QTY y DESCRIPTION; filas alineadas con cantidad, nombre, descripción, precio y botón Remove; botones Continue Shopping y Checkout al pie | A | RNF-VIS-01 | PASS (automatizado, 2026-10-22) |
| VIS-11 | Carrito | Vacío | Carrito sin productos | 1. Abrir el carrito | Sin filas; las cabeceras y los botones Continue Shopping y Checkout se ven correctamente; sin badge | M | RNF-VIS-05 | PASS (automatizado, 2026-10-22) |
| VIS-12 | Checkout paso 1 | Formulario | Llegar al paso 1 | 1. Observar la pantalla | Título "Checkout: Your Information"; tres campos alineados y de igual ancho; botones Cancel y Continue en los extremos | A | RNF-VIS-01 | PASS (automatizado, 2026-10-22) |
| VIS-13 | Checkout paso 1 | Estado de error | Provocar el error de CHK-02 | 1. Observar | Mensaje de error rojo con la X visible; campos marcados en rojo; texto sin cortarse | M | RNF-VIS-04 | PASS (automatizado, 2026-10-22) |
| VIS-14 | Checkout paso 2 | Resumen | Llegar al paso 2 con 2 o más productos | 1. Observar la pantalla | Lista de productos, bloques de pago, envío y totales; montos alineados con dos decimales; botones Cancel y Finish visibles | A | RNF-VIS-01 | PASS (automatizado, 2026-10-22) |
| VIS-15 | Checkout paso 3 | Confirmación | Finalizar una compra | 1. Observar la pantalla | Imagen del pony cargada, título, mensaje y botón "Back Home" centrados; el carrito sin badge | M | RNF-VIS-01 | PASS; el botón Back Home no está centrado como en el wireframe (automatizado, 2026-10-22) |
| VIS-16 | Menú lateral | Panel abierto | Login | 1. Clic en ☰ 2. Observar | Panel lateral con la X y las 4 opciones legibles; el contenido de fondo queda atenuado; las opciones muestran estado hover/foco | M | RNF-VIS-01 | PASS; no se observa fondo atenuado y el menú tiene 5 opciones (automatizado, 2026-10-22) |
| VIS-17 | Todas | Encabezado y pie consistentes | Login | 1. Recorrer todas las vistas con sesión | El encabezado y el pie se ven igual en todas; el pie queda al fondo con los 3 íconos sociales y el copyright | M | RNF-VIS-03 | PASS; el pie muestra "X" en lugar de Twitter (documento: Twitter) (automatizado, 2026-10-22) |
| VIS-18 | Todas | Consistencia de estilo | Login | 1. Comparar fuentes, colores y botones entre vistas | Misma tipografía y paleta; los botones equivalentes tienen el mismo estilo | M | RNF-VIS-04 | PASS (automatizado, 2026-10-22) |
| VIS-19 | Todas | Escritorio 1920×1080 | Login | 1. Recorrer todas las vistas | Sin scroll horizontal, sin textos cortados ni elementos superpuestos | A | RNF-VIS-06 | PASS (automatizado, 2026-10-22) |
| VIS-20 | Todas | Laptop 1366×768 | Login | 1. Recorrer todas las vistas | Mismos criterios que VIS-19 | M | RNF-VIS-06 | PASS (automatizado, 2026-10-22) |
| VIS-21 | Todas | Tablet 768×1024 | Login | 1. Recorrer todas las vistas | Mismos criterios; la cuadrícula de productos se reorganiza sin romperse | M | RNF-VIS-06 | PASS (automatizado, 2026-10-22) |
| VIS-22 | Todas | Móvil 375×812 | Login | 1. Recorrer todas las vistas | Mismos criterios; botones y campos usables con el dedo; el menú, el carrito y el checkout se ven completos | M | RNF-VIS-06 | PASS (automatizado, 2026-10-22) |
| VIS-23 | Todas | Zoom del navegador al 200 % | Login | 1. Ampliar el zoom 2. Recorrer las vistas | El contenido sigue siendo legible y operable; no se pierden botones fuera de la pantalla | B | RNF-VIS-06 | PASS (automatizado, 2026-10-22) |
| VIS-24 | Todas | Imágenes y recursos | Login | 1. Recorrer las vistas con las herramientas de desarrollo abiertas | Ninguna imagen rota; sin errores de carga de recursos en la consola | M | RNF-VIS-02 | PASS (automatizado, 2026-10-22) |
| VIS-25 | Inventario | Comparación `visual_user` contra la línea base | Línea base de VIS-05 | 1. Login con `visual_user` 2. Comparar con la captura base | Cualquier diferencia (alineación, precios, tamaños) se registra como hallazgo; ver USR-07 | B | RF-USR-01, RNF-VIS-01 | Defecto intencional confirmado (USR-07a/b): precios distintos e ícono desplazado (automatizado, 2026-10-22) |

---


## 9. Hallazgos adicionales (agregados tras la evaluación de bugs)

Casos que salieron de comparar los hallazgos manuales con los del agente (ver
`documentacion/evaluacion-de-bugs.md`). Todos están automatizados.

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|-----------|----------------|
| LOG-11 | Con la sesión activa, "atrás" no debería mostrar el login | Sesión iniciada | 1. Pulsar "atrás" del navegador | **Por definir con producto.** Esperado razonable: no mostrar el formulario de login | B | Sin requisito (por definir) | Defecto por definir: se muestra el formulario con la sesión abierta (automatizado, 2026-10-22) |
| VIS-26 | Contraste del mensaje de error del login | Estar en login | 1. Login vacío 2. Medir el contraste del texto | Al menos 4,5:1 (WCAG AA) | B | RNF-VIS-05 | PASS con margen estrecho: 4,68:1 (automatizado, 2026-10-22) |
| DYN-01 | Dynamic Catalog – Lazy Load | Login | 1. Menú → Dynamic Catalog → Lazy Load 2. Bajar | La página carga y suma tarjetas al bajar | M | Sin requisito (función no documentada) | PASS: de 12 a 100 tarjetas (21 nombres distintos); igual con `visual_user` (automatizado, 2026-10-22) |
| DYN-02 | Dynamic Catalog – Spinner | Login | 1. Menú → Dynamic Catalog → Spinner | Indicador de carga y luego los 6 productos | M | Sin requisito (función no documentada) | PASS (automatizado, 2026-10-22) |
| DYN-03 | Dynamic Catalog – Slider | Login | 1. Menú → Dynamic Catalog → Slider | Un producto a la vez | M | Sin requisito (función no documentada) | PASS (automatizado, 2026-10-22) |
| USR-02b | `error_user`: agregar los 6 productos | `error_user` | 1. Pulsar "Add to cart" en los 6 | Contador en 6 | M | RF-USR-01 | Defecto intencional confirmado: solo 3 botones agregan (automatizado, 2026-10-22) |
| USR-02c | `error_user`: quitar desde el listado | `error_user` | 1. Agregar un producto 2. Pulsar "Remove" | El producto se quita | M | RF-USR-01 | Defecto intencional confirmado: no se quita desde el listado (automatizado, 2026-10-22) |
| USR-03b | `error_user`: aviso al ordenar | `error_user` | 1. Ordenar Z–A | Sin avisos de error | M | RF-USR-01 | Defecto intencional confirmado: "Sorting is broken! This error has been reported to Backtrace." (automatizado, 2026-10-22) |
| USR-05b | `performance_glitch_user`: tiempo al ordenar | `performance_glitch_user` | 1. Ordenar por precio | Menos de 3 s (umbral de prueba, duda 11.4) | B | RF-USR-01 | Defecto intencional confirmado: unos 5 s (automatizado, 2026-10-22) |
| USR-07c | `visual_user`: imagen del primer producto | `visual_user` | 1. Comparar con el estándar | Misma imagen | B | RF-USR-01 | Defecto intencional confirmado: otra imagen (automatizado, 2026-10-22) |
| USR-07d | `visual_user`: botón Checkout del carrito | `visual_user` | 1. Abrir el carrito 2. Comparar la posición del botón | Misma posición que el estándar | B | RF-USR-01 | Defecto intencional confirmado: desplazado a la esquina superior derecha (automatizado, 2026-10-22) |
| USR-07e | `visual_user`: ícono del menú | `visual_user` | 1. Observar el ícono ☰ | Sin rotación | B | RF-USR-01 | Defecto intencional confirmado: rotado unos 3° y 1 px más grande (automatizado, 2026-10-22) |

---

## Resumen

| Módulo | Casos |
|--------|-------|
| Login | 10 |
| Cierre de sesión | 2 |
| Productos | 8 |
| Carrito | 9 |
| Checkout | 12 |
| Menú | 4 |
| Usuarios especiales | 7 |
| Pruebas visuales | 25 |
| Hallazgos adicionales | 12 |
| **Total** | **89** |

## Candidatos a automatizar primero (camino crítico)

| ID | Módulo | Caso | Pasos clave | Resultado esperado | Prior. | Requisito |
|----|--------|------|-------------|--------------------|--------|--------|
| LOG-01 | Login | Login válido | Ingresar `standard_user` y `secret_sauce`, clic en Login | Se abre `/inventory.html` con el título "Products" | A | RF-LOG-01, RF-LOG-02 |
| LOG-02 | Login | Contraseña incorrecta | `standard_user` con una contraseña inválida, clic en Login | Mensaje "Epic sadface: Username and password do not match any user in this service". Se queda en login | A | RF-LOG-03 |
| LOG-04 | Login | Usuario bloqueado | `locked_out_user` con `secret_sauce`, clic en Login | Mensaje "Epic sadface: Sorry, this user has been locked out." No accede | A | RF-LOG-04 |
| LOG-09 | Login | Acceso directo sin sesión | Abrir `/inventory.html` sin haber iniciado sesión | Vuelve al login con el mensaje "Epic sadface: You can only access '/inventory.html' when you are logged in." | A | RF-LOG-09 |
| OUT-01 | Cierre de sesión | Logout desde el menú | Abrir el menú (☰), clic en "Logout" | Vuelve al login con los campos vacíos | A | RF-MEN-04 |
| PRO-01 | Productos | Se listan los 6 productos | Login con `standard_user` y observar la página | 6 productos, cada uno con imagen, nombre, descripción, precio y botón "Add to cart" | A | RF-PRO-01, RF-PRO-02 |
| PRO-04 | Productos | Orden por precio de menor a mayor | Selector de orden, opción "Price (low to high)" | Los precios quedan en orden ascendente | M | RF-PRO-03 |
| CAR-01 | Carrito | Agregar un producto | Clic en "Add to cart" en un producto | El botón cambia a "Remove" y el ícono del carrito muestra 1 | A | RF-PRO-05, RF-CAR-01 |
| CAR-05 | Carrito | Quitar un producto desde el carrito | Estar en el carrito con productos, clic en "Remove" | El producto desaparece y el contador se actualiza | A | RF-CAR-03 |
| CHK-01 | Checkout | Compra completa (camino feliz) | Carrito → Checkout, datos válidos, Continue, revisar el resumen, Finish | Pantalla "Thank you for your order!" y carrito vacío | A | RF-CAR-06, RF-CHK-05, RF-CHK-13, RF-CHK-14 |
| CHK-02 | Checkout | Nombre vacío | En el paso 1, dejar el nombre vacío y completar el resto, Continue | Mensaje "Error: First Name is required" | A | RF-CHK-02 |
| CHK-08 | Checkout | Subtotal correcto | Con 3 productos en el carrito, llegar al resumen y sumar los precios a mano | "Item total" es igual a la suma de los precios | A | RF-CHK-09 |


## Smoke test

Subconjunto mínimo que confirma que el sitio está vivo y que el flujo principal funciona. Está automatizado y se
ejecuta con `npm run smoke` (tests marcados `@smoke` en `automatizacion/tests/`).

| ID | Qué confirma | Requisito |
|----|--------------|-----------|
| LOG-01 | Se puede iniciar sesión | RF-LOG-01, RF-LOG-02 |
| LOG-09 | Las pantallas protegidas exigen sesión | RF-LOG-09 |
| PRO-01 | El catálogo carga con los 6 productos | RF-PRO-01, RF-PRO-02 |
| CAR-01 | Agregar un producto actualiza el carrito | RF-PRO-05, RF-CAR-01 |
| CHK-01 | Compra completa hasta la confirmación | RF-CAR-06, RF-CHK-05, RF-CHK-13, RF-CHK-14 |
| OUT-01 | Se puede cerrar la sesión | RF-MEN-04 |

Los casos negativos del login, los cálculos del checkout (CHK-08, CHK-09) y las validaciones (CHK-02) quedan para la
regresión.

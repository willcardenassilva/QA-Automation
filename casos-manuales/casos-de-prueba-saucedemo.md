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
| LOG-01 | Login válido | Estar en la página de login | 1. Ingresar `standard_user` 2. Ingresar `secret_sauce` 3. Clic en Login | Se abre la página de productos (`/inventory.html`) con el título "Products" | A | RF-LOG-01, RF-LOG-02 | Pendiente |
| LOG-02 | Contraseña incorrecta | Estar en login | 1. Usuario `standard_user` 2. Contraseña inválida 3. Login | Mensaje: "Epic sadface: Username and password do not match any user in this service". Permanece en login | A | RF-LOG-03 | Pendiente |
| LOG-03 | Usuario inexistente | Estar en login | 1. Usuario inventado 2. Contraseña `secret_sauce` 3. Login | Mismo mensaje de credenciales inválidas | A | RF-LOG-03 | Pendiente |
| LOG-04 | Usuario bloqueado | Estar en login | 1. `locked_out_user` / `secret_sauce` 2. Login | Mensaje: "Epic sadface: Sorry, this user has been locked out." No accede | A | RF-LOG-04 | Pendiente |
| LOG-05 | Usuario vacío | Estar en login | 1. Dejar usuario vacío, contraseña `secret_sauce` 2. Login | Mensaje: "Epic sadface: Username is required" | M | RF-LOG-05 | Pendiente |
| LOG-06 | Contraseña vacía | Estar en login | 1. Usuario `standard_user`, contraseña vacía 2. Login | Mensaje: "Epic sadface: Password is required" | M | RF-LOG-06 | Pendiente |
| LOG-07 | Ambos campos vacíos | Estar en login | 1. Clic en Login sin datos | Mensaje: "Epic sadface: Username is required" | M | RF-LOG-05 | Pendiente |
| LOG-08 | Cerrar el mensaje de error | Tener un error visible (LOG-02) | 1. Clic en la X del mensaje | El mensaje desaparece | B | RF-LOG-07 | Pendiente |
| LOG-09 | Acceso directo sin sesión | Sin sesión iniciada | 1. Abrir `/inventory.html` directo en el navegador | No muestra productos; vuelve al login con mensaje "Epic sadface: You can only access '/inventory.html' when you are logged in." | A | RF-LOG-09 | Pendiente |
| LOG-10 | Distinción de mayúsculas | Estar en login | 1. Usuario `Standard_User` 2. `secret_sauce` 3. Login | Mensaje de credenciales inválidas (el usuario distingue mayúsculas) | B | RF-LOG-08 | Pendiente |

## 2. Cierre de sesión

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| OUT-01 | Logout desde el menú | Sesión iniciada | 1. Abrir menú (☰) 2. Clic en "Logout" | Vuelve a la página de login, campos vacíos | A | RF-MEN-04 | Pendiente |
| OUT-02 | Sin acceso tras logout | Haber hecho logout | 1. Botón "atrás" del navegador | No se puede ver la página de productos sin sesión | M | RF-LOG-10 | Pendiente |

## 3. Listado de productos

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| PRO-01 | Se listan los 6 productos | Login `standard_user` | 1. Observar la página | 6 productos, cada uno con imagen, nombre, descripción, precio y botón "Add to cart" | A | RF-PRO-01, RF-PRO-02 | Pendiente |
| PRO-02 | Orden por nombre A→Z | Login | 1. Selector de orden → "Name (A to Z)" | Productos ordenados alfabéticamente ascendente | M | RF-PRO-03 | Pendiente |
| PRO-03 | Orden por nombre Z→A | Login | 1. "Name (Z to A)" | Orden alfabético descendente | M | RF-PRO-03 | Pendiente |
| PRO-04 | Orden por precio menor a mayor | Login | 1. "Price (low to high)" | Precios en orden ascendente | M | RF-PRO-03 | Pendiente |
| PRO-05 | Orden por precio mayor a menor | Login | 1. "Price (high to low)" | Precios en orden descendente | M | RF-PRO-03 | Pendiente |
| PRO-06 | Detalle de producto por nombre | Login | 1. Clic en el nombre de un producto | Abre la página de detalle con nombre, descripción, precio e imagen correctos | A | RF-PRO-04, RF-PRO-07 | Pendiente |
| PRO-07 | Detalle de producto por imagen | Login | 1. Clic en la imagen | Mismo detalle que PRO-06 | B | RF-PRO-04, RF-PRO-07 | Pendiente |
| PRO-08 | Volver desde el detalle | Estar en detalle | 1. Clic en "Back to products" | Regresa al listado | M | RF-PRO-09 | Pendiente |

## 4. Carrito

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| CAR-01 | Agregar un producto | Login | 1. "Add to cart" en un producto | Botón cambia a "Remove"; el ícono del carrito muestra 1 | A | RF-PRO-05, RF-CAR-01 | Pendiente |
| CAR-02 | Agregar varios productos | Login | 1. Agregar 3 productos | El contador del carrito muestra 3 | A | RF-PRO-05, RF-CAR-01 | Pendiente |
| CAR-03 | Quitar desde el listado | Un producto en carrito | 1. Clic en "Remove" | Botón vuelve a "Add to cart"; el contador baja | A | RF-PRO-06, RF-CAR-01 | Pendiente |
| CAR-04 | Ver el carrito | 2 productos agregados | 1. Clic en el ícono del carrito | Abre `/cart.html` con los 2 productos, con cantidad y precio correctos | A | RF-CAR-02 | Pendiente |
| CAR-05 | Quitar desde el carrito | Estar en el carrito con productos | 1. Clic en "Remove" de un producto | El producto desaparece y el contador se actualiza | A | RF-CAR-03 | Pendiente |
| CAR-06 | Carrito vacío | Sin productos | 1. Abrir el carrito | Lista vacía, se puede volver con "Continue Shopping" | M | RF-CAR-07 | Pendiente |
| CAR-07 | Continuar comprando | Estar en el carrito | 1. "Continue Shopping" | Vuelve al listado conservando los productos del carrito | M | RF-CAR-04 | Pendiente |
| CAR-08 | Persistencia del carrito | Productos agregados | 1. Navegar al detalle y volver | El carrito mantiene los productos | M | RF-CAR-05 | Pendiente |
| CAR-09 | Agregar desde el detalle | Estar en el detalle de un producto | 1. "Add to cart" | El producto se agrega; el contador sube | M | RF-PRO-08 | Pendiente |

## 5. Checkout

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| CHK-01 | Compra completa (camino feliz) | Login, 1 producto en carrito | 1. Carrito → Checkout 2. Nombre, apellido y código postal válidos 3. Continue 4. Revisar resumen 5. Finish | Pantalla "Thank you for your order!"; el carrito queda vacío | A | RF-CAR-06, RF-CHK-05, RF-CHK-13, RF-CHK-14 | Pendiente |
| CHK-02 | Nombre vacío | En el paso 1 del checkout | 1. Dejar nombre vacío, completar el resto 2. Continue | Mensaje: "Error: First Name is required" | A | RF-CHK-02 | Pendiente |
| CHK-03 | Apellido vacío | Paso 1 | 1. Dejar apellido vacío 2. Continue | Mensaje: "Error: Last Name is required" | A | RF-CHK-03 | Pendiente |
| CHK-04 | Código postal vacío | Paso 1 | 1. Dejar código postal vacío 2. Continue | Mensaje: "Error: Postal Code is required" | A | RF-CHK-04 | Pendiente |
| CHK-05 | Todos los campos vacíos | Paso 1 | 1. Continue sin datos | Mensaje: "Error: First Name is required" | M | RF-CHK-02 | Pendiente |
| CHK-06 | Cancelar en el paso 1 | Paso 1 | 1. "Cancel" | Vuelve al carrito | M | RF-CHK-06 | Pendiente |
| CHK-07 | Cancelar en el resumen | Paso 2 | 1. "Cancel" | Vuelve al listado de productos | M | RF-CHK-12 | Pendiente |
| CHK-08 | Subtotal correcto | 3 productos en carrito | 1. Llegar al resumen 2. Sumar precios a mano | "Item total" = suma de los precios | A | RF-CHK-09 | Pendiente |
| CHK-09 | Impuesto y total | Resumen | 1. Comparar con el item total | Tax ≈ 8 % del item total; Total = item total + tax | A | RF-CHK-10, RF-CHK-11 | Pendiente |
| CHK-10 | Resumen coincide con carrito | Resumen | 1. Comparar productos y cantidades | Mismos productos y precios que en el carrito | A | RF-CHK-07 | Pendiente |
| CHK-11 | Volver al inicio tras comprar | Compra finalizada | 1. "Back Home" | Vuelve al listado con el carrito en 0 | M | RF-CHK-15 | Pendiente |
| CHK-12 | Checkout con carrito vacío | Carrito sin productos | 1. Intentar ir a Checkout | **A verificar:** el sitio podría dejar avanzar con carrito vacío (posible defecto) | M | Sin requisito (duda 11.1) | Pendiente |

## 6. Menú lateral

| ID | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|--------------|-------|--------------------|--------|--------|---------------|
| MEN-01 | Abrir y cerrar menú | Login | 1. ☰ 2. Clic en la X | Menú se abre con 4 opciones y se cierra | B | RF-MEN-01 | Pendiente |
| MEN-02 | All Items | Estar en el detalle de un producto | 1. Menú → "All Items" | Vuelve al listado | M | RF-MEN-02 | Pendiente |
| MEN-03 | About | Login | 1. Menú → "About" | Abre el sitio de Sauce Labs | B | RF-MEN-03 | Pendiente |
| MEN-04 | Reset App State | Productos en carrito | 1. Menú → "Reset App State" | El carrito queda en 0 y los botones vuelven a "Add to cart" | M | RF-MEN-05 | Pendiente |

## 7. Usuarios con comportamientos especiales

Estos usuarios están pensados para detectar defectos. Se prueban contra el comportamiento esperado del sitio.

| ID | Caso | Usuario | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|------|---------|-------|--------------------|--------|--------|---------------|
| USR-01 | Imágenes de productos | `problem_user` | 1. Login 2. Observar el listado | Cada producto muestra su propia imagen. **Posible defecto:** imágenes repetidas o incorrectas | M | RF-USR-01 | Pendiente |
| USR-02 | Agregar/quitar productos | `problem_user` | 1. Agregar y quitar productos desde el listado | Los botones y el contador funcionan igual que con `standard_user`. **Posible defecto:** algunos botones no responden | M | RF-USR-01 | Pendiente |
| USR-03 | Orden de productos | `problem_user` | 1. Cambiar el orden por nombre o precio | El orden cambia correctamente. **Posible defecto:** no ordena | M | RF-USR-01 | Pendiente |
| USR-04 | Datos en checkout | `problem_user` | 1. Completar el formulario de checkout | Los datos ingresados se guardan en el campo correcto. **Posible defecto:** campos que no conservan lo escrito | M | RF-USR-01 | Pendiente |
| USR-05 | Tiempo de respuesta | `performance_glitch_user` | 1. Login y medir cuánto tarda en cargar | Carga en un tiempo razonable. **Posible defecto:** demora de varios segundos | B | RF-USR-01 | Pendiente |
| USR-06 | Finalizar compra | `error_user` | 1. Completar una compra | La compra se completa. **Posible defecto:** errores al finalizar | M | RF-USR-01 | Pendiente |
| USR-07 | Aspecto visual | `visual_user` | 1. Login y comparar con `standard_user` | La interfaz se ve igual. **Posible defecto:** elementos desalineados o con otro precio | B | RF-USR-01 | Pendiente |

## 8. Pruebas visuales (por vista)

Verifican que cada pantalla se ve como está definido en los wireframes del documento funcional (sección 5) y que no
hay defectos de presentación: elementos cortados, superpuestos, desalineados, imágenes rotas o estilos inconsistentes.

**Método:** ejecutar con `standard_user` en Chrome a 1920×1080 (resolución base) y guardar una captura de cada vista
como **línea base**. Las ejecuciones siguientes se comparan contra esa línea base; a futuro se automatizan con
capturas comparables de Playwright. Hasta que exista un diseño oficial (Figma), la referencia visual son los
wireframes del documento funcional.

| ID | Vista | Caso | Precondición | Pasos | Resultado esperado | Prior. | Requisito | Resultado real |
|----|-------|------|--------------|-------|--------------------|--------|--------|---------------|
| VIS-01 | Login | Composición general | Estar en login | 1. Observar la pantalla completa | Logo, campos Username y Password, botón Login y bloque de usuarios/contraseña visibles, centrados, sin superposiciones ni textos cortados | A | RNF-VIS-01 | Pendiente |
| VIS-02 | Login | Estado de error | Provocar el error de LOG-02 | 1. Observar el banner de error | Banner rojo con el texto completo y la X visibles; los campos se marcan en rojo; el layout no se desplaza de forma abrupta | M | RNF-VIS-04 | Pendiente |
| VIS-03 | Login | Campo de contraseña | Estar en login | 1. Escribir una contraseña | Los caracteres se muestran enmascarados; el texto de ayuda de cada campo es legible | B | RNF-VIS-01 | Pendiente |
| VIS-04 | Inventario | Encabezado y título | Login | 1. Observar la parte superior | Botón ☰ a la izquierda, logo "Swag Labs", ícono de carrito a la derecha, título "Products" y selector de orden alineado a la derecha | A | RNF-VIS-01 | Pendiente |
| VIS-05 | Inventario | Cuadrícula de productos | Login | 1. Observar las 6 tarjetas | Tarjetas del mismo tamaño y alineadas; imágenes cargadas, sin deformarse; precios con formato `$00.00`; descripciones sin cortarse de forma incorrecta | A | RNF-VIS-02 | Pendiente |
| VIS-06 | Inventario | Estados del botón y del badge | Login | 1. Agregar un producto 2. Observar botón y carrito | El botón pasa de "Add to cart" a "Remove" con un estilo distinto; el badge numérico aparece sobre el ícono del carrito, legible y bien posicionado | A | RNF-VIS-05 | Pendiente |
| VIS-07 | Inventario | Selector de orden | Login | 1. Abrir el selector | Muestra la opción activa y el desplegable con las 4 opciones legibles | B | RNF-VIS-01 | Pendiente |
| VIS-08 | Detalle | Composición | Login | 1. Abrir el detalle de un producto | Botón "Back to products" arriba; imagen grande a la izquierda sin deformarse; nombre, descripción, precio y botón a la derecha | M | RNF-VIS-01 | Pendiente |
| VIS-09 | Detalle | Estado "Remove" | Estar en el detalle | 1. "Add to cart" 2. Observar | El botón cambia a "Remove" con el mismo estilo que en el listado; el badge aparece | M | RNF-VIS-05 | Pendiente |
| VIS-10 | Carrito | Con productos | 2 productos en el carrito | 1. Abrir el carrito | Cabeceras QTY y DESCRIPTION; filas alineadas con cantidad, nombre, descripción, precio y botón Remove; botones Continue Shopping y Checkout al pie | A | RNF-VIS-01 | Pendiente |
| VIS-11 | Carrito | Vacío | Carrito sin productos | 1. Abrir el carrito | Sin filas; las cabeceras y los botones Continue Shopping y Checkout se ven correctamente; sin badge | M | RNF-VIS-05 | Pendiente |
| VIS-12 | Checkout paso 1 | Formulario | Llegar al paso 1 | 1. Observar la pantalla | Título "Checkout: Your Information"; tres campos alineados y de igual ancho; botones Cancel y Continue en los extremos | A | RNF-VIS-01 | Pendiente |
| VIS-13 | Checkout paso 1 | Estado de error | Provocar el error de CHK-02 | 1. Observar | Mensaje de error rojo con la X visible; campos marcados en rojo; texto sin cortarse | M | RNF-VIS-04 | Pendiente |
| VIS-14 | Checkout paso 2 | Resumen | Llegar al paso 2 con 2 o más productos | 1. Observar la pantalla | Lista de productos, bloques de pago, envío y totales; montos alineados con dos decimales; botones Cancel y Finish visibles | A | RNF-VIS-01 | Pendiente |
| VIS-15 | Checkout paso 3 | Confirmación | Finalizar una compra | 1. Observar la pantalla | Imagen del pony cargada, título, mensaje y botón "Back Home" centrados; el carrito sin badge | M | RNF-VIS-01 | Pendiente |
| VIS-16 | Menú lateral | Panel abierto | Login | 1. Clic en ☰ 2. Observar | Panel lateral con la X y las 4 opciones legibles; el contenido de fondo queda atenuado; las opciones muestran estado hover/foco | M | RNF-VIS-01 | Pendiente |
| VIS-17 | Todas | Encabezado y pie consistentes | Login | 1. Recorrer todas las vistas con sesión | El encabezado y el pie se ven igual en todas; el pie queda al fondo con los 3 íconos sociales y el copyright | M | RNF-VIS-03 | Pendiente |
| VIS-18 | Todas | Consistencia de estilo | Login | 1. Comparar fuentes, colores y botones entre vistas | Misma tipografía y paleta; los botones equivalentes tienen el mismo estilo | M | RNF-VIS-04 | Pendiente |
| VIS-19 | Todas | Escritorio 1920×1080 | Login | 1. Recorrer todas las vistas | Sin scroll horizontal, sin textos cortados ni elementos superpuestos | A | RNF-VIS-06 | Pendiente |
| VIS-20 | Todas | Laptop 1366×768 | Login | 1. Recorrer todas las vistas | Mismos criterios que VIS-19 | M | RNF-VIS-06 | Pendiente |
| VIS-21 | Todas | Tablet 768×1024 | Login | 1. Recorrer todas las vistas | Mismos criterios; la cuadrícula de productos se reorganiza sin romperse | M | RNF-VIS-06 | Pendiente |
| VIS-22 | Todas | Móvil 375×812 | Login | 1. Recorrer todas las vistas | Mismos criterios; botones y campos usables con el dedo; el menú, el carrito y el checkout se ven completos | M | RNF-VIS-06 | Pendiente |
| VIS-23 | Todas | Zoom del navegador al 200 % | Login | 1. Ampliar el zoom 2. Recorrer las vistas | El contenido sigue siendo legible y operable; no se pierden botones fuera de la pantalla | B | RNF-VIS-06 | Pendiente |
| VIS-24 | Todas | Imágenes y recursos | Login | 1. Recorrer las vistas con las herramientas de desarrollo abiertas | Ninguna imagen rota; sin errores de carga de recursos en la consola | M | RNF-VIS-02 | Pendiente |
| VIS-25 | Inventario | Comparación `visual_user` contra la línea base | Línea base de VIS-05 | 1. Login con `visual_user` 2. Comparar con la captura base | Cualquier diferencia (alineación, precios, tamaños) se registra como hallazgo; ver USR-07 | B | RF-USR-01, RNF-VIS-01 | Pendiente |

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
| **Total** | **77** |

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

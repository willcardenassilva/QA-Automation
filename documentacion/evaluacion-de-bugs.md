# Evaluación de bugs – hallazgos manuales vs. hallazgos del agente

| Campo | Valor |
|-------|-------|
| Fecha | 2026-10-22 |
| Fuente A | Lista de bugs encontrados por la persona que prueba (exploración manual) |
| Fuente B | Pruebas del agente (Playwright, 92 tests) y verificaciones directas en el sitio |
| Producto | https://www.saucedemo.com |

Cada hallazgo de la lista manual se verificó en el sitio con medidas (posiciones, tiempos, contraste, conteos) y, cuando
se confirmó y no estaba cubierto, se convirtió en un test.

**Leyenda:** **Coincide** = ambas fuentes lo encontraron · **Aporte** = lo encontró la persona y se confirmó (no estaba
cubierto) · **Parcial** = se confirma una parte · **No reproducido** = no se pudo confirmar con medidas ·
**No es defecto** = comportamiento esperado o de diseño.

## 1. Lista manual contra lo verificado

| # | Hallazgo manual | Usuario | Resultado | Evidencia y test |
|---|-----------------|---------|-----------|------------------|
| 1 | Camiseta rosa; el nombre en el catálogo es código HTML, no su nombre real | todos | **Aporte** | Con tu captura: el nombre mostrado es `Test.allTheThings() T-Shirt (Red)`, una expresión de código y no un nombre comercial, y la imagen es un suéter naranja-salmón (color medio 209,131,113), no una camiseta roja. Pasa con todos los usuarios (el precio de tu captura es de `visual_user`). Es un tema de contenido que decide producto. No automatizado |
| 2 | El mensaje de error del login no se aprecia bien | todos | **Aporte** | Texto blanco de 14 px sobre rojo `rgb(226,35,26)`: contraste 4,68:1. Cumple el mínimo AA (4,5:1) por poco y no llega a AAA (7:1). Test `VIS-26` |
| 3 | `locked_out_user` no inicia sesión | `locked_out_user` | **No es defecto** | Es el comportamiento esperado (RF-LOG-04). Test `LOG-04` |
| 4 | Imágenes iguales en todos los productos | `problem_user` | **Coincide** | Las 6 imágenes son la misma. Test `USR-01` |
| 5 | Los filtros no cambian el orden | `problem_user` | **Coincide** | No ordena por precio ni Z–A; solo A–Z. Test `USR-03` (también falla en `error_user`) |
| 6 | Lentitud en login, menús y filtros | `performance_glitch_user` | **Parcial** | Login 5,6 s (estándar 0,6 s), ordenar 5,0 s (estándar 0,03 s), recarga del inventario 5,3 s: confirmado. Abrir el menú (31 ms) y el carrito (60 ms) **no** son lentos. Tests `USR-05`, `USR-05b` |
| 7 | Ventana emergente de "reportar a Backtrace" al ordenar | `error_user` | **Aporte** | Aviso exacto: "Sorting is broken! This error has been reported to Backtrace." Test `USR-03b` |
| 8 | Al agregar: 3 productos se agregan pero no se quitan; en los otros 3 no pasa nada; se quitan desde el carrito | `error_user` | **Coincide** | Los botones 1, 2 y 5 agregan; el resto no responde; el "Remove" del listado no quita. Tests `USR-02b`, `USR-02c`. La remoción desde el carrito no la verifiqué |
| 9 | Se llega al checkout sin productos | `standard_user` | **Coincide** | El sitio deja avanzar con el carrito vacío (duda 11.1). Test `CHK-12` |
| 10 | La imagen del primer producto no es la correcta | `visual_user` | **Coincide** | Muestra `sl-404…jpg` en lugar de la imagen del producto. Test `USR-07c` |
| 11 | Carrito muy cerca de los filtros y movido hacia abajo | `visual_user` | **Coincide** | Carrito en (1674, 39) frente a (1860, 10) del estándar; se solapa 11 px con el selector. Test `USR-07b` |
| 12 | Las 3 rayitas del menú están algo inclinadas | `visual_user` | **Aporte** | Confirmado con tu captura y con medidas: la imagen del ícono (`img.bm-icon.visual_failure`) está rotada 3° (`matrix(0.99863, 0.052336, …)`) y mide 21×21 px frente a 20×20 del estándar. Mi primera medición miró el botón y no la imagen. Test `USR-07e` |
| 13 | Elementos del carrito y del checkout corridos | `visual_user` | **Aporte** | El botón Checkout del carrito está en (1700, 0) frente a (1380, 218). En el paso 1 el cuadro está en la misma posición, con 9 px más de alto. Test `USR-07d` |
| 14 | Con la sesión activa, "atrás" muestra el login y "adelante" vuelve al catálogo | `standard_user` | **Aporte** | Confirmado: el formulario de login se muestra con la sesión abierta. Es un tema por definir con producto. Test `LOG-11` |
| 15 | Falta un botón de continuar o ir al carrito en el catálogo | `standard_user` | **No es defecto** | Es una decisión de diseño: el carrito se abre con el ícono. Se anota como sugerencia de mejora |
| 16 | No hay cantidades ni aviso de "última unidad" | `standard_user` | **No es defecto** | Coincide con el documento (RN-02: un producto una sola vez, sin stock). Sería un requisito nuevo, no un bug |
| 17 | En "Dynamic Catalog – Lazy Load" los productos se multiplican sin fin | `visual_user` | **Parcial** | Es una función **no documentada**. Lazy Load pasa de 12 a 100 tarjetas (solo 21 nombres distintos, por tallas) y en la prueba se detuvo en 100. Ocurre igual con `standard_user`, no solo con `visual_user`. Tests `DYN-01` a `DYN-03` |

**Resumen de la lista manual (17 hallazgos):** 6 coinciden · 6 aportes confirmados · 2 parciales · 0 sin reproducir · 3 no son defecto.

## 2. Lo que encontró el agente y no estaba en la lista manual

| Hallazgo | Usuario | Test |
|----------|---------|------|
| "Reset App State" vacía el contador, pero los botones siguen en "Remove" hasta recargar | `standard_user` | `MEN-04b` |
| El menú tiene 5 opciones ("Dynamic Catalog") y el documento define 4 | `standard_user` | `MEN-01b` |
| El pie dice "X" en lugar de "Twitter" | `standard_user` | `VIS-17` |
| El botón "Back Home" no está centrado como en el wireframe | `standard_user` | `VIS-15` |
| Las direcciones directas (`/inventory.html`) responden HTTP 404 y luego cargan (alojamiento en GitHub Pages) | `standard_user` | `VIS-24` (nota técnica) |
| El apellido se escribe en el campo del nombre | `problem_user` | `USR-04` |
| No se puede finalizar la compra | `error_user` | `USR-06` |
| Los precios cambian en cada carga | `visual_user` | `USR-07a` |
| Al ordenar por precio los precios mostrados quedan desordenados (los precios son aleatorios y cambian en cada render: `$19.92 $91.88 $42.23…`) | `visual_user` | `MAT-visual_user` (C06) |
| Todas las imágenes del listado son la misma, incluida la primera | `problem_user` | `MAT-problem_user` (C16) |

## 3. Qué es defecto del producto y qué es de los usuarios de prueba

Los fallos de `problem_user`, `performance_glitch_user`, `error_user` y `visual_user` son **intencionales**: se
documentan, pero no se reportan como bugs del producto (regla `github-bug-creation`).

| Categoría | Hallazgos |
|-----------|-----------|
| **Defectos del producto** (candidatos a issue) | Checkout con carrito vacío (#9) · Reset App State no actualiza botones · Nombre en forma de código e imagen de la camiseta (#1) · Contraste del mensaje de error (#2) |
| **Por definir con producto** | "Atrás" con sesión activa (#14) · Dynamic Catalog (función no documentada, #17) · Falta de cantidades y stock (#16) |
| **Diferencias app ≠ documento** | Menú con 5 opciones · Pie con "X" · Back Home descentrado · Dynamic Catalog sin documentar |
| **Defectos intencionales** (se documentan) | #4, #5, #6, #7, #8, #10, #11, #12, #13 y los de la sección 2 de los cuatro usuarios de prueba |

## 4. Bugs sugeridos (borrador; no se crean sin tu confirmación)

| Título | Severidad | Requisito / caso |
|--------|-----------|------------------|
| `[Checkout] Se puede iniciar el checkout con el carrito vacío` | Major | Duda 11.1 · `CHK-12` |
| `[Menú] "Reset App State" no devuelve los botones a "Add to cart" sin recargar` | Minor | RF-MEN-05 · `MEN-04b` |
| `[Catálogo] El producto se llama "Test.allTheThings() T-Shirt (Red)" (código) y su imagen es un suéter naranja` | Minor | RF-PRO-01 · sin test |
| `[Login] El mensaje de error tiene poco contraste (4,68:1)` | Minor | RNF-VIS-05 · `VIS-26` |

## 5. Acciones propuestas

1. Revisar con producto las dudas: checkout vacío, "atrás" con sesión activa y la función "Dynamic Catalog".
2. Actualizar el documento funcional con las diferencias (menú, pie, Dynamic Catalog); requiere tu autorización.
3. Crear los 4 issues sugeridos cuando lo apruebes.

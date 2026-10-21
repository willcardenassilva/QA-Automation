# Documento Funcional – Swag Labs (SauceDemo)

| Campo | Valor |
|-------|-------|
| Producto | Swag Labs – tienda en línea de demostración |
| URL | https://www.saucedemo.com |
| Versión del documento | 1.0 (borrador para revisión de QA) |
| Audiencia | QA, desarrollo, producto |
| Estado | Borrador |

> **Nota de origen.** Este documento describe el comportamiento esperado del producto tal como lo conoce
> el equipo. Los requisitos (`RF-xxx`) son la base de la que se derivan los casos de prueba y la
> matriz de trazabilidad (sección 10). Las dudas de interpretación están en la sección 11.

---

## 1. Introducción

### 1.1 Objetivo
Permitir que un usuario autenticado consulte un catálogo de productos, arme un carrito y complete un
proceso de compra (checkout) hasta la confirmación del pedido.

### 1.2 Alcance
- Autenticación (login y logout).
- Catálogo de productos con ordenamiento y detalle.
- Carrito de compras.
- Checkout en tres pasos (datos de envío, resumen, confirmación).
- Menú lateral de navegación.

### 1.3 Fuera de alcance
- Registro de usuarios y recuperación de contraseña.
- Pasarela de pago real (el pago es simulado y fijo).
- Gestión de inventario, precios o pedidos (no existe backoffice).
- Persistencia de datos en servidor entre sesiones o dispositivos.

### 1.4 Glosario
| Término | Significado |
|---------|-------------|
| Checkout | Proceso de compra desde el carrito hasta la confirmación |
| Badge | Contador numérico sobre el ícono del carrito |
| Item total | Suma de los precios de los productos, sin impuesto |
| Tax | Impuesto calculado sobre el item total |

---

## 2. Usuarios y roles

No existen roles con permisos distintos. Todos los usuarios tienen las mismas capacidades; lo que cambia es
el comportamiento diseñado para pruebas. Contraseña común de demo: `secret_sauce`.

| Usuario | Comportamiento esperado |
|---------|-------------------------|
| `standard_user` | Funcionamiento normal en todas las pantallas |
| `locked_out_user` | No puede iniciar sesión; se muestra mensaje de bloqueo |
| `problem_user` | Usuario de prueba con fallas intencionales (imágenes, botones, orden, formulario) |
| `performance_glitch_user` | Funciona, pero con demoras intencionales al cargar |
| `error_user` | Falla intencional en acciones concretas (p. ej. al finalizar compra) |
| `visual_user` | Funciona, pero con diferencias visuales intencionales |

Los comportamientos de los usuarios de prueba son defectos deliberados. Esto se debe tener presente al
analizar los resultados: sirven para validar que el QA los detecta (ver `RF-USR-01`).

---

## 3. Mapa de navegación

| Pantalla | URL | Acceso |
|----------|-----|--------|
| Login | `/` | Pública |
| Inventario (listado) | `/inventory.html` | Requiere sesión |
| Detalle de producto | `/inventory-item.html?id=<n>` | Requiere sesión |
| Carrito | `/cart.html` | Requiere sesión |
| Checkout – datos | `/checkout-step-one.html` | Requiere sesión |
| Checkout – resumen | `/checkout-step-two.html` | Requiere sesión |
| Checkout – confirmación | `/checkout-complete.html` | Requiere sesión |

```
 Login ──► Inventario ◄──► Detalle
              │  ▲
              ▼  │
            Carrito ──► Checkout datos ──► Checkout resumen ──► Confirmación
              ▲              │                    │                  │
              └── Cancel ────┘                    └── Cancel ──► Inventario
                                                                     ▲
                                                  Back Home ─────────┘
```

---

## 4. Elementos comunes

### 4.1 Encabezado (pantallas con sesión)
```
┌──────────────────────────────────────────────────────────────┐
│ [☰]  Swag Labs                                      [🛒 (n)] │
└──────────────────────────────────────────────────────────────┘
```
| Elemento | Descripción |
|----------|-------------|
| ☰ (menú) | Abre el menú lateral (sección 5.8) |
| Logo "Swag Labs" | Texto fijo, sin enlace |
| Ícono de carrito | Lleva a `/cart.html`. Muestra el badge `(n)` solo si hay productos |

### 4.2 Pie de página
```
┌──────────────────────────────────────────────────────────────┐
│   [Twitter]  [Facebook]  [LinkedIn]                          │
│   © <año> Sauce Labs. All Rights Reserved.                   │
│   Terms of Service | Privacy Policy                          │
└──────────────────────────────────────────────────────────────┘
```
Los enlaces sociales abren sitios externos. No participan del flujo de compra.

---

## 5. Pantallas

### 5.1 Login (`/`)

```
┌──────────────────────────────────────┐
│             Swag Labs                │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Username                     │   │
│   └──────────────────────────────┘   │
│   ┌──────────────────────────────┐   │
│   │ Password            (oculto) │   │
│   └──────────────────────────────┘   │
│   ┌──────────────────────────────┐   │
│   │           LOGIN              │   │
│   └──────────────────────────────┘   │
│                                      │
│   Accepted usernames are:            │
│   standard_user, locked_out_user,    │
│   problem_user, performance_glitch_  │
│   user, error_user, visual_user      │
│   Password for all users:            │
│   secret_sauce                       │
└──────────────────────────────────────┘
```

| Elemento | Tipo | Reglas |
|----------|------|--------|
| Username | Texto | Obligatorio. Distingue mayúsculas y minúsculas |
| Password | Texto enmascarado | Obligatorio. Distingue mayúsculas y minúsculas |
| Login | Botón | Envía las credenciales |
| Mensaje de error | Banner rojo con botón **X** | Aparece sobre/bajo los campos; se cierra con la X |
| Listas de usuarios y contraseña | Texto informativo | Solo ayuda de demo |

**Requisitos**

| ID | Requisito |
|----|-----------|
| RF-LOG-01 | La pantalla muestra los campos Username y Password y el botón Login |
| RF-LOG-02 | Con credenciales válidas el sistema abre `/inventory.html` |
| RF-LOG-03 | Con usuario o contraseña incorrectos muestra *"Epic sadface: Username and password do not match any user in this service"* y permanece en login |
| RF-LOG-04 | Con `locked_out_user` muestra *"Epic sadface: Sorry, this user has been locked out."* y no permite el acceso |
| RF-LOG-05 | Si Username está vacío muestra *"Epic sadface: Username is required"* (se valida primero) |
| RF-LOG-06 | Si Username tiene dato y Password está vacío muestra *"Epic sadface: Password is required"* |
| RF-LOG-07 | El mensaje de error se puede cerrar con la X |
| RF-LOG-08 | Username y Password distinguen mayúsculas y minúsculas |
| RF-LOG-09 | Si se accede a una pantalla protegida sin sesión, se redirige a login y se muestra *"Epic sadface: You can only access '/inventory.html' when you are logged in."* (con la URL accedida) |

---

### 5.2 Inventario (`/inventory.html`)

```
┌──────────────────────────────────────────────────────────────┐
│ [☰]  Swag Labs                                      [🛒 (n)] │
├──────────────────────────────────────────────────────────────┤
│ Products                          [ Name (A to Z)        ▼ ] │
├──────────────────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐                                   │
│ │ img  │ │ img  │ │ img  │                                   │
│ │Nombre│ │Nombre│ │Nombre│                                   │
│ │Descr.│ │Descr.│ │Descr.│                                   │
│ │$00.00│ │$00.00│ │$00.00│                                   │
│ │[Add ]│ │[Add ]│ │[Add ]│                                   │
│ └──────┘ └──────┘ └──────┘                                   │
│ ┌──────┐ ┌──────┐ ┌──────┐                                   │
│ │  …   │ │  …   │ │  …   │                                   │
│ └──────┘ └──────┘ └──────┘                                   │
├──────────────────────────────────────────────────────────────┤
│ Pie de página                                                │
└──────────────────────────────────────────────────────────────┘
```

| Elemento | Descripción |
|----------|-------------|
| Título | Texto "Products" |
| Selector de orden | Opciones: *Name (A to Z)* (por defecto), *Name (Z to A)*, *Price (low to high)*, *Price (high to low)* |
| Tarjeta de producto | Imagen, nombre (enlace), descripción, precio y botón **Add to cart** / **Remove** |

**Requisitos**

| ID | Requisito |
|----|-----------|
| RF-PRO-01 | Se listan los 6 productos del catálogo (sección 6), cada uno con imagen, nombre, descripción, precio y botón |
| RF-PRO-02 | Al entrar, el orden por defecto es *Name (A to Z)* |
| RF-PRO-03 | El selector reordena la lista según la opción elegida (A–Z, Z–A, precio ascendente, precio descendente) |
| RF-PRO-04 | Clic en el nombre o en la imagen abre el detalle de ese producto |
| RF-PRO-05 | **Add to cart** agrega el producto, cambia el botón a **Remove** y actualiza el badge |
| RF-PRO-06 | **Remove** quita el producto, vuelve el botón a **Add to cart** y actualiza el badge |

---

### 5.3 Detalle de producto (`/inventory-item.html?id=<n>`)

```
┌──────────────────────────────────────────────────────────────┐
│ [☰]  Swag Labs                                      [🛒 (n)] │
├──────────────────────────────────────────────────────────────┤
│ [← Back to products]                                         │
│                                                              │
│  ┌──────────────┐   Nombre del producto                      │
│  │              │   Descripción completa                     │
│  │    imagen    │   $00.00                                   │
│  │              │   [ Add to cart ]                          │
│  └──────────────┘                                            │
└──────────────────────────────────────────────────────────────┘
```

| ID | Requisito |
|----|-----------|
| RF-PRO-07 | El detalle muestra imagen, nombre, descripción y precio del producto seleccionado, iguales a los del listado |
| RF-PRO-08 | **Add to cart** / **Remove** en el detalle funciona igual que en el listado (RF-PRO-05/06) |
| RF-PRO-09 | **Back to products** regresa al listado |

---

### 5.4 Carrito (`/cart.html`)

```
┌──────────────────────────────────────────────────────────────┐
│ [☰]  Swag Labs                                      [🛒 (n)] │
├──────────────────────────────────────────────────────────────┤
│ Your Cart                                                    │
│ QTY   DESCRIPTION                                            │
│ ──────────────────────────────────────────────────────────── │
│  1    Nombre producto (enlace)                       $00.00  │
│       Descripción                          [ Remove ]        │
│ ──────────────────────────────────────────────────────────── │
│  1    Nombre producto                                $00.00  │
│       Descripción                          [ Remove ]        │
│                                                              │
│ [ Continue Shopping ]                        [ Checkout ]    │
└──────────────────────────────────────────────────────────────┘
```

| ID | Requisito |
|----|-----------|
| RF-CAR-01 | El badge del encabezado muestra la cantidad de productos en el carrito y se oculta cuando es 0 |
| RF-CAR-02 | El carrito lista cada producto agregado con cantidad, nombre, descripción y precio |
| RF-CAR-03 | **Remove** elimina el producto de la lista y actualiza el badge |
| RF-CAR-04 | **Continue Shopping** regresa al listado conservando el carrito |
| RF-CAR-05 | El carrito conserva los productos al navegar entre pantallas durante la sesión |
| RF-CAR-06 | **Checkout** abre el paso 1 del checkout |
| RF-CAR-07 | Con el carrito vacío la lista aparece vacía y se puede volver con Continue Shopping |

---

### 5.5 Checkout paso 1 – Datos (`/checkout-step-one.html`)

```
┌──────────────────────────────────────────────────────────────┐
│ [☰]  Swag Labs                                      [🛒 (n)] │
├──────────────────────────────────────────────────────────────┤
│ Checkout: Your Information                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ First Name                                             │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Last Name                                              │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Zip/Postal Code                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│  (mensaje de error con X)                                    │
│ [ Cancel ]                                   [ Continue ]    │
└──────────────────────────────────────────────────────────────┘
```

| ID | Requisito |
|----|-----------|
| RF-CHK-01 | El formulario solicita First Name, Last Name y Zip/Postal Code; los tres son obligatorios |
| RF-CHK-02 | Se validan en orden: si falta First Name muestra *"Error: First Name is required"* |
| RF-CHK-03 | Si First Name está completo y falta Last Name muestra *"Error: Last Name is required"* |
| RF-CHK-04 | Si First y Last Name están completos y falta el código postal muestra *"Error: Postal Code is required"* |
| RF-CHK-05 | Con los tres campos completos, **Continue** abre el resumen (paso 2) |
| RF-CHK-06 | **Cancel** regresa al carrito |

---

### 5.6 Checkout paso 2 – Resumen (`/checkout-step-two.html`)

```
┌──────────────────────────────────────────────────────────────┐
│ [☰]  Swag Labs                                      [🛒 (n)] │
├──────────────────────────────────────────────────────────────┤
│ Checkout: Overview                                           │
│ QTY   DESCRIPTION                                            │
│  1    Nombre producto                                $00.00  │
│       Descripción                                            │
│ ──────────────────────────────────────────────────────────── │
│ Payment Information:    SauceCard #31337                     │
│ Shipping Information:   Free Pony Express Delivery!          │
│ Price Total                                                  │
│   Item total: $00.00                                         │
│   Tax:        $0.00                                          │
│   Total:      $00.00                                         │
│ [ Cancel ]                                    [ Finish ]     │
└──────────────────────────────────────────────────────────────┘
```

| ID | Requisito |
|----|-----------|
| RF-CHK-07 | El resumen muestra los mismos productos, cantidades y precios que el carrito |
| RF-CHK-08 | Se muestra el método de pago *SauceCard #31337* y el envío *Free Pony Express Delivery!* (valores fijos) |
| RF-CHK-09 | *Item total* = suma de los precios de los productos |
| RF-CHK-10 | *Tax* = 8 % del item total, redondeado a 2 decimales |
| RF-CHK-11 | *Total* = Item total + Tax |
| RF-CHK-12 | **Cancel** regresa al listado de productos |
| RF-CHK-13 | **Finish** completa el pedido y abre la pantalla de confirmación |

---

### 5.7 Checkout paso 3 – Confirmación (`/checkout-complete.html`)

```
┌──────────────────────────────────────────────────────────────┐
│ [☰]  Swag Labs                                      [🛒]     │
├──────────────────────────────────────────────────────────────┤
│ Checkout: Complete!                                          │
│                      [ imagen pony ]                         │
│               Thank you for your order!                      │
│  Your order has been dispatched, and will arrive just as     │
│  fast as the pony can get there!                             │
│                    [ Back Home ]                             │
└──────────────────────────────────────────────────────────────┘
```

| ID | Requisito |
|----|-----------|
| RF-CHK-14 | Se muestra *"Thank you for your order!"* y el carrito queda vacío (badge oculto) |
| RF-CHK-15 | **Back Home** abre el listado de productos con el carrito en 0 |

---

### 5.8 Menú lateral

```
┌─────────────────┐
│            [X]  │
│ All Items       │
│ About           │
│ Logout          │
│ Reset App State │
└─────────────────┘
```

| ID | Requisito |
|----|-----------|
| RF-MEN-01 | El botón ☰ abre el menú con cuatro opciones; la X lo cierra |
| RF-MEN-02 | **All Items** abre el listado de productos |
| RF-MEN-03 | **About** abre el sitio de Sauce Labs (saucelabs.com) |
| RF-MEN-04 | **Logout** cierra la sesión y abre la pantalla de login con los campos vacíos |
| RF-MEN-05 | **Reset App State** deja el carrito en 0 y los botones de los productos en *Add to cart* |
| RF-LOG-10 | Tras un logout no se puede volver a pantallas protegidas con el botón "atrás" del navegador sin iniciar sesión de nuevo |

---

## 6. Catálogo de productos

| Id | Producto | Precio (USD) |
|----|----------|--------------|
| 4 | Sauce Labs Backpack | 29.99 |
| 0 | Sauce Labs Bike Light | 9.99 |
| 1 | Sauce Labs Bolt T-Shirt | 15.99 |
| 5 | Sauce Labs Fleece Jacket | 49.99 |
| 2 | Sauce Labs Onesie | 7.99 |
| 3 | Test.allTheThings() T-Shirt (Red) | 15.99 |

Cada producto tiene una imagen y una descripción propias. La cantidad por producto en el carrito es siempre 1
(no existe selector de cantidad).

---

## 7. Reglas de negocio

| ID | Regla |
|----|-------|
| RN-01 | No se puede acceder a ninguna pantalla distinta de login sin sesión iniciada |
| RN-02 | Un producto solo puede estar una vez en el carrito (no hay cantidades) |
| RN-03 | Impuesto = 8 % del item total; Total = item total + impuesto |
| RN-04 | El pago y el envío son valores fijos; no se solicitan al usuario |
| RN-05 | Al finalizar la compra el carrito se vacía |
| RN-06 | El estado del carrito se conserva solo en el navegador durante la sesión; no se comparte entre dispositivos |

---

## 8. Catálogo de mensajes

| Contexto | Mensaje |
|----------|---------|
| Credenciales inválidas | Epic sadface: Username and password do not match any user in this service |
| Usuario bloqueado | Epic sadface: Sorry, this user has been locked out. |
| Usuario vacío | Epic sadface: Username is required |
| Contraseña vacía | Epic sadface: Password is required |
| Acceso sin sesión | Epic sadface: You can only access '/inventory.html' when you are logged in. |
| Nombre vacío (checkout) | Error: First Name is required |
| Apellido vacío (checkout) | Error: Last Name is required |
| Código postal vacío (checkout) | Error: Postal Code is required |
| Compra finalizada | Thank you for your order! |

Todos los textos de la interfaz están en inglés. La traducción automática del navegador no forma parte del producto.

---

## 9. Requisitos para usuarios de prueba

| ID | Requisito |
|----|-----------|
| RF-USR-01 | Los usuarios `problem_user`, `performance_glitch_user`, `error_user` y `visual_user` pueden presentar comportamientos distintos al de `standard_user` por diseño. Estas diferencias se documentan como defectos conocidos del entorno de demo y se reportan como hallazgos, no como requisitos a cumplir |

### 9.1 Requisitos visuales (no funcionales)

| ID | Requisito |
|----|-----------|
| RNF-VIS-01 | Cada pantalla respeta la composición y los elementos definidos en los wireframes de la sección 5 |
| RNF-VIS-02 | Las imágenes cargan correctamente, se muestran sin deformarse y los textos no quedan cortados ni superpuestos |
| RNF-VIS-03 | El encabezado y el pie de página son idénticos en todas las pantallas con sesión |
| RNF-VIS-04 | Los botones, campos y mensajes de error mantienen un estilo consistente entre pantallas (tipografía, colores, estados) |
| RNF-VIS-05 | Los estados visuales (botón *Add to cart* / *Remove*, badge del carrito, mensaje de error) son claramente distinguibles |
| RNF-VIS-06 | La interfaz es utilizable, sin scroll horizontal, en las resoluciones soportadas (pendiente de confirmar, ver 11.5) |

---

## 10. Matriz de trazabilidad (requisito → casos de prueba)

| Requisito | Casos de prueba |
|-----------|-----------------|
| RF-LOG-01, 02 | LOG-01 |
| RF-LOG-03, 08 | LOG-02, LOG-03, LOG-10 |
| RF-LOG-04 | LOG-04 |
| RF-LOG-05 | LOG-05, LOG-07 |
| RF-LOG-06 | LOG-06 |
| RF-LOG-07 | LOG-08 |
| RF-LOG-09 | LOG-09 |
| RF-LOG-10 | OUT-02 |
| RF-MEN-04 | OUT-01 |
| RF-PRO-01 | PRO-01 |
| RF-PRO-02, 03 | PRO-02, PRO-03, PRO-04, PRO-05 |
| RF-PRO-04, 07 | PRO-06, PRO-07 |
| RF-PRO-05, 06 | CAR-01, CAR-02, CAR-03 |
| RF-PRO-08 | CAR-09 |
| RF-PRO-09 | PRO-08 |
| RF-CAR-01 | CAR-01, CAR-02 |
| RF-CAR-02 | CAR-04 |
| RF-CAR-03 | CAR-05 |
| RF-CAR-04 | CAR-07 |
| RF-CAR-05 | CAR-08 |
| RF-CAR-07 | CAR-06 |
| RF-CAR-06, RF-CHK-05, 08, 13, 14 | CHK-01 |
| RF-CHK-02 | CHK-02, CHK-05 |
| RF-CHK-03 | CHK-03 |
| RF-CHK-04 | CHK-04 |
| RF-CHK-06 | CHK-06 |
| RF-CHK-07 | CHK-10 |
| RF-CHK-09 | CHK-08 |
| RF-CHK-10, 11 | CHK-09 |
| RF-CHK-12 | CHK-07 |
| RF-CHK-15 | CHK-11 |
| RF-MEN-01 | MEN-01 |
| RF-MEN-02 | MEN-02 |
| RF-MEN-03 | MEN-03 |
| RF-MEN-05 | MEN-04 |
| RF-USR-01 | USR-01 a USR-07, VIS-25 |
| RNF-VIS-01 | VIS-01, 03, 04, 07, 08, 10, 12, 14, 15, 16, 25 |
| RNF-VIS-02 | VIS-05, 24 |
| RNF-VIS-03 | VIS-17 |
| RNF-VIS-04 | VIS-02, 13, 18 |
| RNF-VIS-05 | VIS-06, 09, 11 |
| RNF-VIS-06 | VIS-19 a 23 |
| *(sin requisito definido)* | CHK-12 (ver punto 11.1) |

---

## 11. Puntos a aclarar con producto

Cuando la documentación no cubre un escenario, el QA lo eleva antes de definir el resultado esperado.

| # | Duda | Impacto |
|---|------|---------|
| 11.1 | ¿Debe permitirse iniciar el checkout con el carrito vacío? El documento no lo define | CHK-12 |
| 11.2 | ¿Se deben recortar espacios al inicio o final de Username y de los campos del checkout? | LOG, CHK |
| 11.3 | ¿Existen validaciones de formato en el código postal (solo números, longitud)? No está especificado | CHK-04 |
| 11.4 | ¿Cuál es el tiempo máximo aceptable de carga para `performance_glitch_user`? | USR-05 |
| 11.5 | ¿Qué navegadores y resoluciones están soportados? | Alcance de ejecución |
| 11.6 | ¿Debe mantenerse el carrito tras un logout y un nuevo login? | CAR-08 |

# Historias de usuario – Swag Labs (SauceDemo)

| Campo | Valor |
|-------|-------|
| Producto | Swag Labs – tienda en línea de demostración |
| Documento relacionado | [documento-funcional-saucedemo.md](documento-funcional-saucedemo.md) |
| Versión | 1.0 (borrador para revisión de QA) |

Cada historia sigue el formato **Como** [rol] **quiero** [acción] **para** [beneficio], con criterios de aceptación
en formato Dado / Cuando / Entonces (Gherkin). Las historias se agrupan en épicas y se priorizan con MoSCoW
(**Must** / **Should** / **Could**). Cada una referencia los requisitos funcionales (`RF-xxx`) y los casos de
prueba manuales que la cubren.

**Roles**
- **Comprador:** usuario autenticado que compra en la tienda.
- **Visitante:** usuario sin sesión iniciada.

**Definición de terminado (DoD) común**
- Todos los criterios de aceptación pasan en Chrome con `standard_user`.
- Los mensajes coinciden textualmente con los del documento funcional.
- Los casos de prueba asociados están ejecutados y sin defectos críticos abiertos.

---

## Resumen

| Épica | Historias |
|-------|-----------|
| E1 Autenticación | HU-01 a HU-05 |
| E2 Catálogo | HU-06 a HU-08 |
| E3 Carrito | HU-09, HU-10 |
| E4 Checkout | HU-11 a HU-14 |
| E5 Navegación | HU-15, HU-16 |
| E6 Usuarios de prueba | HU-17 |

---

## E1 – Autenticación

### HU-01 – Iniciar sesión
**Como** visitante, **quiero** iniciar sesión con mi usuario y contraseña **para** acceder a la tienda.

**Prioridad:** Must · **Requisitos:** RF-LOG-01, RF-LOG-02 · **Casos:** LOG-01

```gherkin
Escenario: Login con credenciales válidas
  Dado que estoy en la página de login
  Cuando ingreso el usuario "standard_user" y la contraseña "secret_sauce" y pulso Login
  Entonces se abre la página de productos "/inventory.html" con el título "Products"
```

### HU-02 – Rechazo de credenciales inválidas o usuario bloqueado
**Como** visitante, **quiero** que el sistema me indique claramente por qué no pude entrar **para** corregir mis datos.

**Prioridad:** Must · **Requisitos:** RF-LOG-03, RF-LOG-04, RF-LOG-08 · **Casos:** LOG-02, LOG-03, LOG-04, LOG-10

```gherkin
Escenario: Contraseña incorrecta
  Dado que estoy en la página de login
  Cuando ingreso "standard_user" con una contraseña inválida y pulso Login
  Entonces veo "Epic sadface: Username and password do not match any user in this service"
  Y permanezco en la página de login

Escenario: Usuario inexistente
  Cuando ingreso un usuario inventado con la contraseña "secret_sauce"
  Entonces veo el mismo mensaje de credenciales inválidas

Escenario: Usuario bloqueado
  Cuando ingreso "locked_out_user" con "secret_sauce"
  Entonces veo "Epic sadface: Sorry, this user has been locked out."
  Y no accedo a la tienda

Escenario: El usuario distingue mayúsculas y minúsculas
  Cuando ingreso "Standard_User" con "secret_sauce"
  Entonces veo el mensaje de credenciales inválidas
```

### HU-03 – Validación de campos obligatorios en el login
**Como** visitante, **quiero** saber qué campo me falta completar **para** enviar el formulario correctamente.

**Prioridad:** Should · **Requisitos:** RF-LOG-05, RF-LOG-06, RF-LOG-07 · **Casos:** LOG-05, LOG-06, LOG-07, LOG-08

```gherkin
Escenario: Usuario vacío
  Cuando dejo el usuario vacío, ingreso la contraseña y pulso Login
  Entonces veo "Epic sadface: Username is required"

Escenario: Contraseña vacía
  Cuando ingreso "standard_user", dejo la contraseña vacía y pulso Login
  Entonces veo "Epic sadface: Password is required"

Escenario: Ambos campos vacíos
  Cuando pulso Login sin completar nada
  Entonces veo "Epic sadface: Username is required"

Escenario: Cerrar el mensaje de error
  Dado que hay un mensaje de error visible
  Cuando pulso la X del mensaje
  Entonces el mensaje desaparece
```

### HU-04 – Protección de pantallas privadas
**Como** responsable del producto, **quiero** que solo los usuarios con sesión vean la tienda **para** evitar accesos no autorizados.

**Prioridad:** Must · **Requisitos:** RF-LOG-09, RN-01 · **Casos:** LOG-09

```gherkin
Escenario: Acceso directo sin sesión
  Dado que no tengo sesión iniciada
  Cuando abro "/inventory.html" directamente en el navegador
  Entonces vuelvo a la página de login
  Y veo "Epic sadface: You can only access '/inventory.html' when you are logged in."
```

### HU-05 – Cerrar sesión
**Como** comprador, **quiero** cerrar mi sesión **para** que nadie use mi cuenta en este navegador.

**Prioridad:** Must · **Requisitos:** RF-MEN-04, RF-LOG-10 · **Casos:** OUT-01, OUT-02

```gherkin
Escenario: Logout desde el menú
  Dado que tengo sesión iniciada
  Cuando abro el menú y pulso "Logout"
  Entonces vuelvo a la página de login con los campos vacíos

Escenario: No se recupera la sesión con "atrás"
  Dado que hice logout
  Cuando pulso el botón "atrás" del navegador
  Entonces no puedo ver la página de productos sin iniciar sesión
```

---

## E2 – Catálogo

### HU-06 – Ver el catálogo de productos
**Como** comprador, **quiero** ver todos los productos con su imagen, descripción y precio **para** decidir qué comprar.

**Prioridad:** Must · **Requisitos:** RF-PRO-01, RF-PRO-02 · **Casos:** PRO-01

```gherkin
Escenario: Listado inicial
  Dado que inicié sesión con "standard_user"
  Cuando veo la página de productos
  Entonces aparecen 6 productos
  Y cada uno muestra imagen, nombre, descripción, precio y el botón "Add to cart"
  Y el orden inicial es "Name (A to Z)"
```

### HU-07 – Ordenar los productos
**Como** comprador, **quiero** ordenar el catálogo por nombre o precio **para** encontrar más rápido lo que busco.

**Prioridad:** Should · **Requisitos:** RF-PRO-03 · **Casos:** PRO-02, PRO-03, PRO-04, PRO-05

```gherkin
Esquema del escenario: Ordenamiento
  Dado que estoy en la página de productos
  Cuando elijo la opción "<opción>" en el selector
  Entonces los productos se muestran en orden "<orden>"

  Ejemplos:
    | opción              | orden                 |
    | Name (A to Z)       | alfabético ascendente |
    | Name (Z to A)       | alfabético descendente|
    | Price (low to high) | precio ascendente     |
    | Price (high to low) | precio descendente    |
```

### HU-08 – Ver el detalle de un producto
**Como** comprador, **quiero** abrir la ficha de un producto **para** ver su información completa.

**Prioridad:** Must · **Requisitos:** RF-PRO-04, RF-PRO-07, RF-PRO-09 · **Casos:** PRO-06, PRO-07, PRO-08

```gherkin
Escenario: Abrir el detalle
  Dado que estoy en la página de productos
  Cuando pulso el nombre o la imagen de un producto
  Entonces se abre su detalle con nombre, descripción, precio e imagen iguales a los del listado

Escenario: Volver al listado
  Dado que estoy en el detalle de un producto
  Cuando pulso "Back to products"
  Entonces regreso a la página de productos
```

---

## E3 – Carrito

### HU-09 – Agregar y quitar productos
**Como** comprador, **quiero** agregar y quitar productos desde el listado o el detalle **para** armar mi compra.

**Prioridad:** Must · **Requisitos:** RF-PRO-05, RF-PRO-06, RF-PRO-08, RF-CAR-01, RN-02 · **Casos:** CAR-01, CAR-02, CAR-03, CAR-09

```gherkin
Escenario: Agregar un producto
  Dado que estoy en la página de productos con el carrito vacío
  Cuando pulso "Add to cart" en un producto
  Entonces el botón cambia a "Remove"
  Y el ícono del carrito muestra 1

Escenario: Agregar varios productos
  Cuando agrego 3 productos distintos
  Entonces el ícono del carrito muestra 3

Escenario: Quitar desde el listado
  Dado que un producto está en el carrito
  Cuando pulso "Remove" en ese producto
  Entonces el botón vuelve a "Add to cart"
  Y el contador del carrito baja en 1

Escenario: Agregar desde el detalle
  Dado que estoy en el detalle de un producto
  Cuando pulso "Add to cart"
  Entonces el producto se agrega y el contador sube
```

### HU-10 – Revisar y editar mi carrito
**Como** comprador, **quiero** ver el contenido de mi carrito y poder quitar productos **para** confirmar qué voy a comprar.

**Prioridad:** Must · **Requisitos:** RF-CAR-02 a RF-CAR-07, RN-06 · **Casos:** CAR-04, CAR-05, CAR-06, CAR-07, CAR-08

```gherkin
Escenario: Ver el carrito
  Dado que agregué 2 productos
  Cuando pulso el ícono del carrito
  Entonces se abre "/cart.html" con los 2 productos, su cantidad, descripción y precio

Escenario: Quitar desde el carrito
  Dado que estoy en el carrito con productos
  Cuando pulso "Remove" en uno
  Entonces el producto desaparece y el contador se actualiza

Escenario: Carrito vacío
  Dado que no agregué productos
  Cuando abro el carrito
  Entonces la lista aparece vacía
  Y puedo volver con "Continue Shopping"

Escenario: Continuar comprando
  Dado que estoy en el carrito con productos
  Cuando pulso "Continue Shopping"
  Entonces regreso al listado conservando los productos del carrito

Escenario: El carrito se conserva al navegar
  Dado que tengo productos en el carrito
  Cuando abro el detalle de un producto y vuelvo
  Entonces el carrito mantiene los mismos productos
```

---

## E4 – Checkout

### HU-11 – Ingresar mis datos de envío
**Como** comprador, **quiero** ingresar mi nombre, apellido y código postal **para** continuar con la compra.

**Prioridad:** Must · **Requisitos:** RF-CAR-06, RF-CHK-01 a RF-CHK-05 · **Casos:** CHK-01, CHK-02, CHK-03, CHK-04, CHK-05

```gherkin
Escenario: Datos válidos
  Dado que estoy en el paso 1 del checkout
  Cuando completo nombre, apellido y código postal y pulso "Continue"
  Entonces se abre el resumen de la compra

Esquema del escenario: Campo obligatorio vacío
  Dado que estoy en el paso 1 del checkout
  Cuando dejo vacío "<campo>", completo el resto y pulso "Continue"
  Entonces veo "<mensaje>"

  Ejemplos:
    | campo        | mensaje                           |
    | First Name   | Error: First Name is required     |
    | Last Name    | Error: Last Name is required      |
    | Postal Code  | Error: Postal Code is required    |

Escenario: Todos los campos vacíos
  Cuando pulso "Continue" sin completar nada
  Entonces veo "Error: First Name is required"
```

### HU-12 – Revisar el resumen antes de pagar
**Como** comprador, **quiero** ver un resumen con subtotal, impuesto y total **para** confirmar cuánto voy a pagar.

**Prioridad:** Must · **Requisitos:** RF-CHK-07 a RF-CHK-11, RN-03, RN-04 · **Casos:** CHK-08, CHK-09, CHK-10

```gherkin
Escenario: El resumen coincide con el carrito
  Dado que estoy en el resumen de la compra
  Entonces veo los mismos productos, cantidades y precios que en el carrito
  Y veo el pago "SauceCard #31337" y el envío "Free Pony Express Delivery!"

Escenario: Subtotal correcto
  Dado que compro 3 productos
  Entonces "Item total" es igual a la suma de sus precios

Escenario: Impuesto y total
  Entonces "Tax" es el 8 % del "Item total"
  Y "Total" es "Item total" más "Tax"
```

### HU-13 – Confirmar la compra
**Como** comprador, **quiero** finalizar mi pedido **para** recibir la confirmación de que fue registrado.

**Prioridad:** Must · **Requisitos:** RF-CHK-13 a RF-CHK-15, RN-05 · **Casos:** CHK-01, CHK-11

```gherkin
Escenario: Compra completa
  Dado que estoy en el resumen con productos en el carrito
  Cuando pulso "Finish"
  Entonces veo "Thank you for your order!"
  Y el carrito queda vacío

Escenario: Volver al inicio tras comprar
  Dado que finalicé una compra
  Cuando pulso "Back Home"
  Entonces regreso al listado con el carrito en 0
```

### HU-14 – Cancelar el checkout
**Como** comprador, **quiero** cancelar el proceso de compra **para** corregir mi carrito o seguir comprando.

**Prioridad:** Should · **Requisitos:** RF-CHK-06, RF-CHK-12 · **Casos:** CHK-06, CHK-07

```gherkin
Escenario: Cancelar en el paso 1
  Dado que estoy en el paso 1 del checkout
  Cuando pulso "Cancel"
  Entonces regreso al carrito

Escenario: Cancelar en el resumen
  Dado que estoy en el resumen de la compra
  Cuando pulso "Cancel"
  Entonces regreso al listado de productos
```

> **Pendiente de definición (producto):** el comportamiento al iniciar el checkout con el carrito vacío no está
> especificado (documento funcional, punto 11.1). Se cubre con el caso exploratorio CHK-12 hasta que se defina una
> historia o criterio de aceptación.

---

## E5 – Navegación

### HU-15 – Navegar con el menú lateral
**Como** comprador, **quiero** usar un menú lateral **para** moverme rápido por la tienda.

**Prioridad:** Could · **Requisitos:** RF-MEN-01, RF-MEN-02, RF-MEN-03 · **Casos:** MEN-01, MEN-02, MEN-03

```gherkin
Escenario: Abrir y cerrar el menú
  Cuando pulso el botón ☰
  Entonces se abre un menú con 4 opciones
  Cuando pulso la X
  Entonces el menú se cierra

Escenario: All Items
  Dado que estoy en el detalle de un producto
  Cuando elijo "All Items" en el menú
  Entonces regreso al listado de productos

Escenario: About
  Cuando elijo "About" en el menú
  Entonces se abre el sitio de Sauce Labs
```

### HU-16 – Reiniciar el estado de la aplicación
**Como** comprador, **quiero** reiniciar la aplicación **para** vaciar mi carrito y empezar de cero.

**Prioridad:** Could · **Requisitos:** RF-MEN-05 · **Casos:** MEN-04

```gherkin
Escenario: Reset App State
  Dado que tengo productos en el carrito
  Cuando elijo "Reset App State" en el menú
  Entonces el carrito queda en 0
  Y los botones de los productos vuelven a "Add to cart"
```

---

## E6 – Usuarios de prueba

### HU-17 – Detectar comportamientos anómalos de los usuarios de prueba
**Como** QA, **quiero** ejecutar los flujos principales con los usuarios `problem_user`, `performance_glitch_user`,
`error_user` y `visual_user` **para** verificar que las anomalías de cada uno se detectan y se reportan.

**Prioridad:** Could · **Requisitos:** RF-USR-01 · **Casos:** USR-01 a USR-07

```gherkin
Escenario: Comparación contra el usuario estándar
  Dado que ejecuto un flujo con un usuario de prueba especial
  Cuando comparo el resultado con el obtenido con "standard_user"
  Entonces toda diferencia se registra como hallazgo, con evidencia y pasos para reproducirla
```

> Los defectos de estos usuarios son intencionales. El criterio de éxito es que el QA los encuentre y los
> documente, no que el sistema los corrija.

---

## Trazabilidad: historia → requisito → casos

| Historia | Requisitos | Casos de prueba | Prioridad |
|----------|-----------|-----------------|-----------|
| HU-01 | RF-LOG-01, 02 | LOG-01 | Must |
| HU-02 | RF-LOG-03, 04, 08 | LOG-02, 03, 04, 10 | Must |
| HU-03 | RF-LOG-05, 06, 07 | LOG-05, 06, 07, 08 | Should |
| HU-04 | RF-LOG-09 | LOG-09 | Must |
| HU-05 | RF-MEN-04, RF-LOG-10 | OUT-01, OUT-02 | Must |
| HU-06 | RF-PRO-01, 02 | PRO-01 | Must |
| HU-07 | RF-PRO-03 | PRO-02 a PRO-05 | Should |
| HU-08 | RF-PRO-04, 07, 09 | PRO-06, 07, 08 | Must |
| HU-09 | RF-PRO-05, 06, 08, RF-CAR-01 | CAR-01, 02, 03, 09 | Must |
| HU-10 | RF-CAR-02 a 07 | CAR-04 a CAR-08 | Must |
| HU-11 | RF-CHK-01 a 05 | CHK-01 a CHK-05 | Must |
| HU-12 | RF-CHK-07 a 11 | CHK-08, 09, 10 | Must |
| HU-13 | RF-CHK-13 a 15 | CHK-01, CHK-11 | Must |
| HU-14 | RF-CHK-06, 12 | CHK-06, CHK-07 | Should |
| HU-15 | RF-MEN-01, 02, 03 | MEN-01, 02, 03 | Could |
| HU-16 | RF-MEN-05 | MEN-04 | Could |
| HU-17 | RF-USR-01 | USR-01 a USR-07 | Could |

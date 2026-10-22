# Edge cases – Compra (modo COMPLETO)

Estado inicial: sesión como `standard_user`, carrito en 0 salvo que se indique.

## Checkout

| Caso | Acción | Resultado esperado | Requisito |
|------|--------|--------------------|-----------|
| CHK-03 | Last Name vacío (resto completo), Continue | `Error: Last Name is required` | RF-CHK-03 |
| CHK-04 | Zip vacío (resto completo), Continue | `Error: Postal Code is required` | RF-CHK-04 |
| CHK-05 | Todo vacío, Continue | `Error: First Name is required` | RF-CHK-02 |
| CHK-06 | En el paso 1, Cancel | Vuelve a `/cart.html` | RF-CHK-06 |
| CHK-07 | En el resumen, Cancel | Vuelve a `/inventory.html` | RF-CHK-12 |
| CHK-11 | Tras comprar, Back Home | Inventario con el carrito en 0 | RF-CHK-15 |
| CHK-12 | Carrito vacío → Checkout | **A verificar:** duda 11.1; registrar como WARNING con lo observado | – |

## Carrito y productos

| Caso | Acción | Resultado esperado | Requisito |
|------|--------|--------------------|-----------|
| CAR-02 | Agregar 3 productos | Badge `3` | RF-CAR-01 |
| CAR-03 | "Remove" desde el listado | Botón vuelve a "Add to cart" y baja el badge | RF-PRO-06 |
| CAR-04 | Ver el carrito con 2 productos | Ambos con cantidad y precio | RF-CAR-02 |
| CAR-06 | Abrir el carrito vacío | Lista vacía; Continue Shopping funciona | RF-CAR-07 |
| CAR-07 | Continue Shopping desde el carrito | Vuelve al listado conservando los productos | RF-CAR-04 |
| CAR-08 | Ir al detalle y volver | El carrito conserva los productos | RF-CAR-05 |
| CAR-09 | "Add to cart" desde el detalle | Se agrega y el badge sube | RF-PRO-08 |
| PRO-02/03/05 | Probar los otros órdenes del selector | Orden correcto | RF-PRO-03 |
| PRO-06/07/08 | Abrir el detalle por nombre e imagen; Back to products | Detalle correcto; vuelve al listado | RF-PRO-04, 07, 09 |

## Para romper (extra)

- Abrir `/checkout-step-two.html` directamente con el carrito vacío o sin pasar por el paso 1.
- Agregar un producto, ir al checkout y volver con "atrás" varias veces.
- Recargar la página en el resumen y observar el estado.
- Logout con productos en el carrito y nuevo login (duda 11.6).

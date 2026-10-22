# 02 – Compra completa y cálculos

| Campo | Valor |
|-------|-------|
| Épica | Compra |
| Casos | CHK-01, CHK-08, CHK-09, CHK-10 |
| Requisitos | RF-CAR-06, RF-CHK-05, RF-CHK-07…RF-CHK-11, RF-CHK-13, RF-CHK-14 |
| Modo | TURBO |
| Usuario | `standard_user` |
| Prioridad | A |

## Precondiciones

- Sesión iniciada, carrito en 0, precios de pantalla anotados (ver `01`).

## Pasos

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Agregar 3 productos distintos (por nombre) | Badge `3` | |
| 2 | Abrir el carrito | Los 3 productos con sus precios | |
| 3 | Pulsar Checkout | `/checkout-step-one.html` con First Name, Last Name y Zip/Postal Code | |
| 4 | Completar con los datos válidos y pulsar Continue | `/checkout-step-two.html` | |
| 5 | Comparar productos y precios con el carrito (CHK-10) | Idénticos | |
| 6 | Calcular `Item total` a mano (CHK-08) | Coincide con "Item total" de la pantalla | |
| 7 | Calcular `Tax = Item total × 0.08` y `Total` (CHK-09) | Coinciden con "Tax" y "Total" de la pantalla | |
| 8 | Verificar pago y envío | `SauceCard #31337` y `Free Pony Express Delivery!`. `TODO(verificar)` | |
| 9 | Pulsar Finish | `/checkout-complete.html` con `Thank you for your order!` | |
| 10 | Revisar el badge | Oculto (carrito en 0) | |

## Cálculo (completar en la ejecución)

| Concepto | Esperado | Real |
|----------|----------|------|
| Item total | | |
| Tax (8 %) | | |
| Total | | |

## Auditoría (modo COMPLETO)

- Red y consola en cada paso del checkout.
- "Back Home" (CHK-11): vuelve a `/inventory.html` con el carrito en 0.

## Resultado final

(completar) — registrar en `99-resumen-ejecucion.md` con los valores del cálculo.

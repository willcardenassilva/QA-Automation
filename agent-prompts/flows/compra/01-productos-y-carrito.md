# 01 – Productos y carrito

| Campo | Valor |
|-------|-------|
| Épica | Compra |
| Casos | PRO-01, PRO-04, CAR-01, CAR-05 |
| Requisitos | RF-PRO-01, RF-PRO-02, RF-PRO-03, RF-PRO-05, RF-CAR-01, RF-CAR-03 |
| Modo | TURBO |
| Usuario | `standard_user` |
| Prioridad | A |

## Precondiciones

- Sesión iniciada, carrito en 0 (Reset App State).

## Escenario A – Listado (PRO-01)

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Observar `/inventory.html` | 6 productos con imagen, nombre, descripción, precio y botón "Add to cart" | |
| 2 | Revisar el orden inicial | `Name (A to Z)` | |
| 3 | Anotar nombre y precio de los 6 productos | Tabla de precios de la ejecución | |

## Escenario B – Orden por precio (PRO-04)

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Selector → `Price (low to high)` | Los precios quedan en orden ascendente | |
| 2 | Comparar el primero y el último | Primero el más barato, último el más caro | |

## Escenario C – Agregar y quitar (CAR-01, CAR-05)

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | "Add to cart" en un producto (localizado por nombre) | Botón pasa a "Remove" y el badge muestra `1` | |
| 2 | Abrir el carrito (ícono) | `/cart.html` lista ese producto con su precio | |
| 3 | "Remove" en el carrito | El producto desaparece y el badge se oculta | |

## Auditoría (modo COMPLETO)

- Red y consola en inventario y carrito (imágenes y recursos).
- Estado del carrito en el almacenamiento tras cada acción.

## Resultado final

(completar) — un resultado por escenario en `99-resumen-ejecucion.md`.

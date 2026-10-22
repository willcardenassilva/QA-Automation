---
name: saucedemo-checkout
description: Soporte para probar el módulo crítico de compra de SauceDemo: carrito, los tres pasos del checkout, validación de campos, y verificación de cálculos (item total, impuesto del 8 %, total) con la suma hecha a mano. Úsala cuando el usuario pida probar la compra, el checkout, el carrito, los totales o el impuesto, o cuando un flujo de compra falle y haya que aislar la causa.
---

# Módulo crítico: compra

La compra es el flujo que más dinero mueve en cualquier tienda; por eso se prueba con datos conocidos y se calcula todo a mano, sin confiar en lo que muestra la pantalla.

## Datos de apoyo

Catálogo esperado (documento funcional, sección 6; **por verificar contra la app**):

| Producto | Precio |
|----------|--------|
| Sauce Labs Backpack | 29.99 |
| Sauce Labs Bike Light | 9.99 |
| Sauce Labs Bolt T-Shirt | 15.99 |
| Sauce Labs Fleece Jacket | 49.99 |
| Sauce Labs Onesie | 7.99 |
| Test.allTheThings() T-Shirt (Red) | 15.99 |

Datos de formulario válidos de prueba: nombre `Ana`, apellido `Pérez`, código postal `1000`. (La app no valida formato; ver duda 11.3.)

## Verificación de cálculos

1. Anota los precios que ve la **pantalla de productos** antes de agregar (no los del catálogo).
2. Agrega los productos y llega al resumen (paso 2).
3. `Item total esperado` = suma de los precios anotados.
4. `Tax esperado` = `Item total × 0.08`, redondeado a 2 decimales. Si el redondeo es ambiguo (medio centavo), anótalo como WARNING, no como FAIL.
5. `Total esperado` = Item total + Tax.
6. Compara con la pantalla y registra los tres valores esperados y los tres reales.

Prueba al menos: 1 producto, 3 productos y los 6 productos, para detectar errores de acumulación.

## Orden y validaciones del checkout (paso 1)

First Name → Last Name → Postal Code. Mensajes exactos: `Error: First Name is required`, `Error: Last Name is required`, `Error: Postal Code is required`. Con todo vacío debe verse el de First Name.

## Casos relacionados

CAR-01 a CAR-09, CHK-01 a CHK-12 y las historias HU-09 a HU-14 (ver `casos-manuales/` y `documentacion/`). Para un flujo completo usa `agent-prompts/flows/compra/`.

## Si algo falla

Aísla la causa: ¿falla el cálculo, el carrito o el formulario? Repite con `standard_user`; si solo falla con `problem_user` o `error_user`, es una falla intencional del usuario de prueba. Reporta con la regla `github-bug-creation`.

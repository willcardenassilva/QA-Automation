# 03 – Validación del formulario de checkout

| Campo | Valor |
|-------|-------|
| Épica | Compra |
| Casos | CHK-02 (TURBO); CHK-03, CHK-04, CHK-05 en `_edge-cases/` |
| Requisitos | RF-CHK-01, RF-CHK-02 |
| Modo | TURBO |
| Usuario | `standard_user` |
| Prioridad | A |

## Precondiciones

- Sesión iniciada con 1 producto en el carrito; en `/checkout-step-one.html`.

## Pasos

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Dejar First Name vacío, completar Last Name y Zip, Continue | `Error: First Name is required` | |
| 2 | Verificar que sigue en el paso 1 | URL `/checkout-step-one.html` | |
| 3 | Revisar el estado visual del error | Mensaje visible con la X y campos marcados en rojo (VIS-13) | |

## Resultado final

(completar) — registrar en `99-resumen-ejecucion.md`.

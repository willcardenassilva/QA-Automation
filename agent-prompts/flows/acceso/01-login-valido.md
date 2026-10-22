# 01 – Login válido

| Campo | Valor |
|-------|-------|
| Épica | Acceso |
| Casos | LOG-01 |
| Requisitos | RF-LOG-01, RF-LOG-02 |
| Modo | TURBO |
| Usuario | `standard_user` |
| Prioridad | A |

## Precondiciones

- Sin sesión iniciada; pestaña en `https://www.saucedemo.com/`.

## Pasos

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Abrir `/` | Se ven los campos Username y Password y el botón Login | |
| 2 | Escribir `standard_user` en Username | El campo contiene el texto | |
| 3 | **[PERSONA]** Escribir la contraseña de demo en Password | El texto aparece enmascarado | |
| 4 | Pulsar Login | La URL pasa a `/inventory.html` | |
| 5 | Observar la página | Título "Products" y 6 productos | |

## Auditoría (modo COMPLETO)

- Red y consola tras cargar `/inventory.html`: sin recursos con error; imágenes de productos cargadas.
- Cookie `session-username` presente con el valor `standard_user`. `TODO(verificar)`.

## Resultado final

(completar) — registrar en `99-resumen-ejecucion.md`.

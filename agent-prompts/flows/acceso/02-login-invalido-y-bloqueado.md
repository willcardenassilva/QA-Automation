# 02 – Login inválido y usuario bloqueado

| Campo | Valor |
|-------|-------|
| Épica | Acceso |
| Casos | LOG-02, LOG-03, LOG-04 |
| Requisitos | RF-LOG-03, RF-LOG-04 |
| Modo | TURBO |
| Prioridad | A |

## Precondiciones

- Sin sesión iniciada; pestaña en `/`. Recargar `/` entre un escenario y otro.
- Todos los escenarios escriben una contraseña en el formulario: **[PERSONA]** la escribe en cada uno; el agente escribe el usuario, pulsa Login y verifica el mensaje y la URL.

## Escenario A – Contraseña incorrecta (LOG-02)

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Username `standard_user`, Password `wrong_password`, Login | Mensaje exacto: `Epic sadface: Username and password do not match any user in this service` | |
| 2 | Observar la URL | Sigue en `/` | |

## Escenario B – Usuario inexistente (LOG-03)

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Username `usuario_inexistente`, contraseña de demo, Login | El mismo mensaje de credenciales inválidas | |

## Escenario C – Usuario bloqueado (LOG-04)

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Username `locked_out_user`, contraseña de demo, Login | Mensaje exacto: `Epic sadface: Sorry, this user has been locked out.` | |
| 2 | Observar la URL | Sigue en `/`, sin acceso al inventario | |

## Resultado final

(completar) — un resultado por escenario en `99-resumen-ejecucion.md`.

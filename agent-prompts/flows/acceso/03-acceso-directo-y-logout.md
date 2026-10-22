# 03 – Acceso directo sin sesión y logout

| Campo | Valor |
|-------|-------|
| Épica | Acceso |
| Casos | LOG-09, OUT-01 |
| Requisitos | RF-LOG-09, RF-MEN-04 |
| Modo | TURBO |
| Usuario | `standard_user` |
| Prioridad | A |

## Escenario A – Acceso directo sin sesión (LOG-09)

Precondición: sin sesión (cookie `session-username` ausente).

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Abrir `https://www.saucedemo.com/inventory.html` directamente | Se muestra el login, no los productos | |
| 2 | Leer el mensaje | `Epic sadface: You can only access '/inventory.html' when you are logged in.` | |

## Escenario B – Logout desde el menú (OUT-01)

Precondición: sesión iniciada como `standard_user` (login asistido como en `01`; la contraseña la escribe la **[PERSONA]**).

| # | Acción | Resultado esperado | Resultado |
|---|--------|--------------------|-----------|
| 1 | Pulsar ☰ | Se abre el menú con 4 opciones | |
| 2 | Pulsar Logout | Vuelve a `/` con los campos vacíos | |
| 3 | Revisar la cookie `session-username` | Ausente o vacía. `TODO(verificar)` | |

## Resultado final

(completar) — un resultado por escenario en `99-resumen-ejecucion.md`.

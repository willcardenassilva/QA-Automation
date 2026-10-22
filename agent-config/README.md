# agent-config

Configuración que usa el agente y que no pertenece a las skills.

| Qué | Archivo |
|-----|---------|
| Usuarios y contraseña de demo de SauceDemo | [credentials/saucedemo-users.md](credentials/saucedemo-users.md) |

## Reglas

- Las skills y los flujos **no** llevan credenciales: las leen de `credentials/`.
- SauceDemo publica sus usuarios y contraseña de demo en la propia página de login, por eso este archivo sí se versiona.
- Cualquier otro secreto (tokens, claves, contraseñas de otros servicios) va en un archivo **no versionado** dentro de
  `credentials/`. El `.gitignore` del repo ignora todo ese directorio salvo `saucedemo-users.md`.
- Nunca pegues una contraseña real en un chat, flujo o issue.

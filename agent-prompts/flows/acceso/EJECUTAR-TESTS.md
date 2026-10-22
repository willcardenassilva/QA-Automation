# Ejecutar la épica Acceso

Lee antes: `.claude/skills/saucedemo-tester/SKILL.md`, `agent-prompts/ECOSYSTEM-CONTEXT.md`. Credenciales en `agent-config/credentials/saucedemo-users.md`.

## Modos

- **TURBO:** ejecuta `01`, `02` y `03`, en ese orden. Sin auditoría de red.
- **COMPLETO:** TURBO + todos los archivos de `_edge-cases/` + captura de red y consola tras cargar `/` y `/inventory.html`.
- **REGRESIÓN:** solo los archivos cuyos casos figuren como FAIL/WARNING en `99-resumen-ejecucion.md`.

## Quién hace qué

Los pasos que escriben una contraseña están marcados **[PERSONA]**: los hace la persona en el panel del navegador (el agente no escribe contraseñas). El agente escribe el usuario, observa, verifica mensajes y URL y registra el resultado. Ver "Login y contraseñas" en `saucedemo-tester`.

## Orden y estado

1. Estado inicial: sin sesión (abre `/` en una pestaña limpia o haz logout).
2. Los casos son independientes salvo `03`, que necesita sesión iniciada (se inicia dentro del propio archivo).
3. Entre casos negativos, recarga `/` para limpiar el formulario y el mensaje de error.

## Resultado

Completa `99-resumen-ejecucion.md`: una fila por caso con PASS/FAIL/WARNING y evidencia. Para cada FAIL, redacta un borrador de bug (regla `github-bug-creation`) y espera la confirmación antes de crearlo. No cierres el navegador al terminar.

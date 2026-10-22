# Guía rápida de configuración de una ejecución

## 1. Herramientas

- **Playwright MCP** (recomendado): se declara en `.mcp.json` y se lanza con `npx @playwright/mcp@0.0.83`. Requiere Node.
  La primera vez Claude Code pide aprobar el servidor del proyecto.
- **Navegador integrado** de la app de Claude: alternativa sin instalación. Las mismas reglas aplican.

## 2. Elegir la épica y el modo

| Épica | Carpeta | Usuario |
|-------|---------|---------|
| Acceso | `flows/acceso/` | `standard_user`, `locked_out_user` |
| Compra | `flows/compra/` | `standard_user` |

| Modo | Qué ejecuta | Cuándo |
|------|-------------|--------|
| **TURBO** | Solo los casos marcados `TURBO` de cada flujo, sin edge cases | Pasada rápida, tras un cambio |
| **COMPLETO** | Todos los pasos numerados + `_edge-cases/` + auditoría de red | Antes de cerrar una versión |
| **REGRESIÓN** | Los casos que antes fallaron o se corrigieron (ver `99-resumen-ejecucion.md`) | Después de un fix |

## 3. Estado inicial

1. Sesión cerrada o pestaña limpia. El panel del navegador debe estar visible. El login es asistido: el agente escribe el
   usuario y tú escribes la contraseña (el agente no escribe contraseñas); sin intervención, solo con Playwright en código.
2. Carrito vacío (menú → Reset App State).
3. Navegador y resolución anotados (por defecto Chrome, 1920×1080).

## 4. Ejecutar y reportar

Pide: `Ejecuta el flujo agent-prompts/flows/<épica> en modo <MODO>`. El resultado queda en el
`99-resumen-ejecucion.md` de la épica. Los bugs se redactan como borrador y se crean en GitHub solo con tu confirmación.

## 5. Datos que debes proveer

- Épicas prioritarias adicionales.
- Navegadores y resoluciones oficiales (duda 11.5).
- Si quieres instalar `gh` (GitHub CLI) para crear issues desde la terminal.

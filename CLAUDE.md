# QA-Automation – SauceDemo (Swag Labs)

Sistema de QA con agente: documentación y casos de prueba versionados, flujos ejecutables y skills que guían al agente.
Producto bajo prueba: https://www.saucedemo.com (sitio de demostración público; no hay entorno de staging separado).

## Dónde está cada cosa

| Qué | Dónde |
|-----|-------|
| Documento funcional (fuente de requisitos RF/RNF) | `documentacion/documento-funcional-saucedemo.md` |
| Historias de usuario | `documentacion/historias-de-usuario-saucedemo.md` |
| Casos de prueba manuales (77) | `casos-manuales/casos-de-prueba-saucedemo.md` |
| Contexto del producto para el agente | `agent-prompts/ECOSYSTEM-CONTEXT.md` |
| Flujos ejecutables por épica | `agent-prompts/flows/<épica>/` |
| Credenciales y configuración | `agent-config/` |
| Pruebas automáticas (Playwright, el código inicia sesión solo) | `automatizacion/`, `playwright.config.ts` (ver `automatizacion/README.md`) |
| Skills de proceso (análisis y diseño) | `.claude/skills/` (`flujo-qa`, `documento-funcional`, `historias-de-usuario`, `casos-de-prueba`, `trazabilidad-qa`) |
| Skills de ejecución (agente) | `.claude/skills/saucedemo-tester`, `saucedemo-testing-method`, `saucedemo-checkout` |
| Skill de detalle y todos los usuarios (reutilizable en otros proyectos) | `.claude/skills/qa-exhaustivo` |

## Reglas del proyecto

@.claude/rules/doc-vs-app-and-locators.md
@.claude/rules/browser-network-capture.md
@.claude/rules/github-bug-creation.md
@.claude/rules/login-y-contrasenas.md
@.claude/rules/prueba-detallista.md

## Cómo trabajar

- Antes de ejecutar, lee el flujo en `agent-prompts/flows/` y la skill `saucedemo-tester`.
- Navegador: usa Playwright MCP (`mcp__playwright__browser_*`) si está disponible; si no, el navegador integrado
  (`mcp__Claude_Browser__*`). Los dos siguen las mismas reglas.
- No inventes URLs, credenciales ni datos de prueba. Los usuarios de demo están en `agent-config/credentials/`.
- **El agente no escribe contraseñas** en formularios de login (ni la de demo): la persona la escribe en el panel del
  navegador y el agente continúa. Los pasos así se marcan `[PERSONA]` en los flujos (ver skill `saucedemo-tester`).
- Los textos de la interfaz están en **inglés**; la traducción automática del navegador no es parte del producto.
- No cierres el navegador al terminar salvo que el usuario lo pida.
- Commit y push solo cuando el usuario lo confirma. Crear un issue en GitHub también requiere confirmación.

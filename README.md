# QA-Automation

[![Smoke test diario](https://github.com/willcardenassilva/QA-Automation/actions/workflows/smoke.yml/badge.svg)](https://github.com/willcardenassilva/QA-Automation/actions/workflows/smoke.yml)

**Calidad de software de punta a punta sobre una tienda en línea de demostración (SauceDemo).** Proyecto de práctica que
simula el trabajo de un QA en una empresa real: parte de la documentación, diseña las pruebas, las automatiza con
Playwright y TypeScript, las ejecuta todos los días en la nube y reporta los defectos con evidencia medida. Está hecho con
apoyo de un asistente de IA (Claude Code), y cada resultado fue verificado por mí.

> **Sobre el producto probado:** https://www.saucedemo.com es un sitio público de demostración para practicar
> automatización. Algunos de sus usuarios (`problem_user`, `error_user`, `performance_glitch_user`, `visual_user`) fallan
> **a propósito**. Por eso la matriz de bugs separa los defectos del producto de los defectos intencionales.

## Qué demuestra este proyecto

| Competencia | Cómo se ve en el repositorio |
|-------------|------------------------------|
| Análisis de requisitos | Documento funcional con requisitos numerados, reglas de negocio y dudas para producto |
| Diseño de pruebas | 89 casos manuales con trazabilidad requisito → historia → caso |
| Automatización | 98 pruebas en Playwright con TypeScript; el código inicia sesión solo |
| Integración continua | Smoke diario y regresión semanal en GitHub Actions, configurables desde GitHub |
| Pruebas visuales y de accesibilidad | Comprobaciones medidas: posiciones, imágenes, contraste, resoluciones, zoom |
| Pruebas con todos los perfiles | Matriz de 6 usuarios × 16 verificaciones comparadas contra el usuario base |
| Gestión de defectos | Matriz de 21 hallazgos con severidad, categoría, origen, capturas y medidas |
| Trabajo con IA | Skills y reglas propias que ordenan el trabajo del asistente |

## Resultados en cifras

| Qué | Cantidad |
|-----|----------|
| Casos de prueba manuales | **89** (funcionales, negativos, visuales y hallazgos adicionales) |
| Historias de usuario | **17**, en 6 épicas, con criterios Gherkin |
| Pruebas automatizadas | **98** en 12 archivos, todas en verde |
| Usuarios probados | **6** (los 6 que ofrece el sitio) × 16 verificaciones |
| Hallazgos documentados | **21**: 2 bloqueantes, 7 visuales, 12 no bloqueantes |
| Evidencias | **24** capturas más un archivo de medidas |
| Issues reportados en GitHub | **4** (los defectos reales del producto) |
| Smoke test en la nube | 6 casos críticos, unos 40 segundos por ejecución |
| Skills y reglas para el asistente | **9** skills y **5** reglas |

## El flujo, de la documentación a los defectos

```
Documento funcional → Historias de usuario → Casos de prueba → Revisión de trazabilidad
        → Ejecución asistida por IA → Automatización (Playwright) → Ejecución en la nube → Matriz de bugs
```

1. **Documento funcional.** Alcance, roles, mapa de navegación, wireframes en texto de cada pantalla, requisitos `RF-` y
   `RNF-`, reglas de negocio con fórmulas, catálogo de mensajes y lista de dudas. Se actualizó a la versión 1.1 después de
   ejecutar las pruebas, porque la aplicación mostró diferencias con lo documentado.
2. **Historias de usuario.** Escritas como "Como… quiero… para…", con escenarios Gherkin y prioridad MoSCoW.
3. **Casos de prueba.** Funcionales, negativos y visuales por vista, con precondición, pasos, resultado esperado,
   prioridad, requisito y resultado real. Incluye el camino crítico y el subconjunto de smoke.
4. **Ejecución asistida por IA.** Flujos ejecutables para un agente que prueba en el navegador, con modos rápido, completo y
   de regresión, y un resumen de ejecución por épica.
5. **Automatización.** Pruebas con Playwright y TypeScript, con el ID del caso en el título de cada test.
6. **Ejecución en la nube.** GitHub Actions: smoke diario y regresión completa semanal.
7. **Matriz de bugs.** Cada hallazgo con categoría, severidad, origen, pasos, esperado, observado, impacto y evidencia.

## Estructura del repositorio

```
documentacion/        Documento funcional, historias de usuario, evaluación y matriz de bugs (con evidencias/)
casos-manuales/       Casos de prueba y su resultado real
agent-prompts/        Contexto del producto y flujos ejecutables por épica (acceso, compra, menú, usuarios, visuales)
agent-config/         Usuarios públicos de demo
automatizacion/       Pruebas de Playwright (tests/), soporte (support/) y herramientas (herramientas/)
.claude/skills/       Skills del asistente: proceso de QA y ejecución
.claude/rules/        Reglas del proyecto
.github/workflows/    Smoke diario y regresión semanal
```

## Cómo ejecutar las pruebas

Requisitos: Node.js 18 o superior.

```bash
npm install
```

```bash
npx playwright install chromium
```

```bash
npm test
```

```bash
npm run smoke
```

`npm run smoke` corre solo los 6 casos críticos. Con `npm test` se ejecutan los 98. El informe se abre con
`npm run report`. En Windows PowerShell, si aparece "no se puede cargar el archivo", usa `npm.cmd` y `npx.cmd` en lugar de
`npm` y `npx`. Los detalles están en [automatizacion/README.md](automatizacion/README.md).

## Ejecución diaria en la nube

El workflow [smoke.yml](.github/workflows/smoke.yml) ejecuta el smoke test sin que ninguna máquina esté encendida, y
[regresion.yml](.github/workflows/regresion.yml) corre la regresión completa cada semana. El smoke se puede encender, apagar
y cambiar de hora desde GitHub (**Settings → Secrets and variables → Actions → Variables**) con `SMOKE_ACTIVO`, `SMOKE_HORA`
y `SMOKE_ZONA`, sin editar código. Las ejecuciones aparecen en la pestaña **Actions** y los informes quedan como artefactos.

## Hallazgos principales

La [matriz de bugs](documentacion/matriz-de-bugs.md) clasifica los 21 hallazgos. Lo más relevante:

- **Ningún defecto del producto bloquea el flujo principal** con el usuario normal. Los 2 bloqueantes son fallos
  intencionales de `problem_user` y `error_user`.
- **Defectos reales del producto (reportados):** se puede iniciar el checkout con el carrito vacío
  ([#1](https://github.com/willcardenassilva/QA-Automation/issues/1)), "Reset App State" no restaura los botones
  ([#2](https://github.com/willcardenassilva/QA-Automation/issues/2)), una camiseta con nombre en forma de código e imagen de
  suéter ([#3](https://github.com/willcardenassilva/QA-Automation/issues/3)) y un mensaje de error con contraste de 4,68:1
  ([#4](https://github.com/willcardenassilva/QA-Automation/issues/4)).
- **Diferencias entre el documento y la aplicación:** el menú tenía una opción más de las documentadas ("Dynamic Catalog",
  una función sin documentar) y el pie decía "X" en lugar de Twitter. Se corrigió el documento y se dejaron las dudas
  abiertas para producto.
- **Hallazgos medidos:** un ícono inclinado 3° (con una clase llamada `visual_failure`), precios que cambian en cada carga,
  un login de 5,2 s frente a 0,17 s del usuario estándar y un botón desplazado 87 px del centro.

## Lo que aprendí

**Sobre cómo probar**
- **Medir, no mirar.** Un ícono inclinado pasó desapercibido cuando medí solo el botón: el defecto estaba en la imagen que
  lleva dentro. Ahora reviso el elemento, sus hijos y sus estilos calculados, y registro la medida (posición, contraste,
  tiempo) como evidencia.
- **El detalle es la diferencia.** Probar que la función anda no basta. Los hallazgos que más valor tuvieron fueron
  visuales y de contenido: nombres, imágenes, precios, alineaciones y contraste.
- **Probar con todos los usuarios.** Una matriz de usuarios × verificaciones muestra a la vez qué falla en quién y qué cambia
  frente al usuario base. Me llevó a descubrir fallos que no habría visto con un solo usuario.
- **Abrir todo.** Una función no documentada ("Dynamic Catalog") estaba en un submenú que nadie había abierto.
- **La documentación no es la verdad absoluta.** Cuando la aplicación difiere, se reporta y se registra la duda; no se
  inventa el resultado esperado.
- **Distinguir el origen del defecto.** No es lo mismo un defecto del producto que uno intencional de un usuario de prueba.
  Clasificar bien (bloqueante, visual, no bloqueante) evita exagerar y ayuda a priorizar.

**Sobre automatizar**
- **Verificar mis propias pruebas antes de culpar al producto.** Varios fallos fueron míos: un selector que coincidía con
  varios elementos, imágenes medidas antes de cargar, o una búsqueda por texto que encontraba la linterna "red light" en
  lugar de la camiseta roja.
- **Los defectos conocidos se dejan como fallos esperados.** Con `test.fail` y su motivo, el test registra el defecto y avisa
  si el sitio un día lo corrige.
- **Las pruebas visuales deben sobrevivir al sistema operativo.** Las capturas píxel a píxel cambian entre Windows y Linux;
  por eso uso comprobaciones estructurales (posiciones, tamaños, imágenes, desbordes) que dan el mismo resultado en la nube.
- **Un smoke test corto y con sentido.** Seis casos críticos cubren login, acceso protegido, catálogo, carrito, compra y
  cierre de sesión, en unos 40 segundos. La regresión completa va aparte.
- **Esperar condiciones, no segundos.** Esperar a que carguen las imágenes eliminó pruebas inestables.

**Sobre integración continua**
- **GitHub no permite una hora variable en un cron.** Resolví el control de encendido y hora con variables del repositorio
  y un job que decide si corresponde correr; el costo es una ejecución corta por hora.
- **Cada ejecución es una fila del historial.** Conviene decidir qué eventos disparan el workflow para no llenar la lista.
- **Detalles del entorno importan:** el alojamiento en GitHub Pages responde 404 en direcciones directas antes de cargar, y
  PowerShell puede bloquear `npm.ps1`. Documentarlos ahorra tiempo.

**Sobre trabajar con IA**
- La IA acelera, pero **no reemplaza el criterio**: cada hallazgo se verificó con medidas y los errores del asistente se
  corrigieron antes de concluir.
- Los límites del asistente se diseñan en el flujo. Por ejemplo, no escribe contraseñas en formularios de inicio de sesión;
  la solución fue que el login lo haga el código de Playwright.
- Un buen conjunto de **skills y reglas** hace que el asistente trabaje igual en cada sesión: qué medir, cómo clasificar
  y cuándo pedir confirmación.
- Lo que aporta la persona que prueba es insustituible: varios de los mejores hallazgos salieron de la exploración manual
  y se confirmaron después con medidas.

## Límites y próximos pasos

- Es un proyecto de práctica sobre un sitio de demostración; los defectos de los usuarios de prueba son intencionales.
- Las capturas comparables píxel a píxel con línea base (por sistema operativo) están pendientes.
- Falta probar en más navegadores (hoy se usa Chromium) y ampliar los casos de rendimiento con umbrales definidos por
  producto.
- Quedan dudas abiertas para producto en la sección 11 del documento funcional (checkout vacío, comportamiento de "atrás"
  con sesión activa, función Dynamic Catalog).

## Documentación y evidencias

| Documento | Para qué |
|-----------|----------|
| [Documento funcional](documentacion/documento-funcional-saucedemo.md) | Requisitos, wireframes, reglas de negocio y dudas |
| [Historias de usuario](documentacion/historias-de-usuario-saucedemo.md) | Historias con criterios Gherkin |
| [Casos de prueba](casos-manuales/casos-de-prueba-saucedemo.md) | 89 casos con su resultado real |
| [Evaluación de bugs](documentacion/evaluacion-de-bugs.md) | Hallazgos manuales contra los del agente |
| [Matriz de bugs](documentacion/matriz-de-bugs.md) | 21 hallazgos con evidencias |
| [Pruebas automáticas](automatizacion/README.md) | Estructura, comandos y control del smoke |
| [Mapa del proyecto para el asistente](CLAUDE.md) | Cómo está organizado y qué reglas sigue |

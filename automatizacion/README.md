# Automatización con Playwright

Pruebas automáticas del camino crítico de SauceDemo. El código inicia sesión por su cuenta con los usuarios públicos de
demo, así que no requiere intervención manual.

## Requisitos

- Node.js 18 o superior.

## Primer uso

```bash
npm install
```

```bash
npx playwright install chromium
```

## Ejecutar

```bash
npm test
```

```bash
npm run report
```

## Smoke test

Los 6 tests marcados con `@smoke` responden "¿el sitio está vivo y el flujo principal funciona?" en unos 15 segundos:

| Caso | Qué confirma |
|------|--------------|
| LOG-01 | Login válido |
| LOG-09 | Las pantallas protegidas siguen protegidas |
| PRO-01 | El catálogo carga con los 6 productos |
| CAR-01 | Agregar un producto al carrito |
| CHK-01 | Compra completa de punta a punta |
| OUT-01 | Cierre de sesión |

```bash
npm run smoke
```

Se ejecuta también el login previo (`auth.setup.ts`), que lleva la misma etiqueta. Por eso el informe muestra 7 tests.

## Ejecución diaria en GitHub Actions

El workflow [`.github/workflows/smoke.yml`](../.github/workflows/smoke.yml) ejecuta el smoke test en la nube, sin que
ninguna máquina local esté encendida. El resultado aparece en la pestaña **Actions** del repositorio. Si falla, GitHub
envía un correo, y el informe HTML con capturas y trace queda como artefacto `informe-smoke` durante 14 días. En CI se
permite 1 reintento para absorber cortes de red momentáneos hacia el sitio.

### Encender, apagar y elegir la hora (desde GitHub, sin tocar código)

En el repositorio: **Settings → Secrets and variables → Actions → pestaña Variables → New repository variable**.

| Variable | Valores | Qué controla | Si no existe |
|----------|---------|--------------|--------------|
| `SMOKE_ACTIVO` | `true` / `false` | Enciende o apaga la corrida diaria y la de cada push | `true` |
| `SMOKE_HORA` | `0` a `23` | Hora **local** de la corrida diaria | `9` |
| `SMOKE_ZONA` | zona horaria, p. ej. `America/Argentina/Buenos_Aires`, `America/Santiago`, `America/Mexico_City` | Zona en la que se interpreta `SMOKE_HORA` | `America/Argentina/Buenos_Aires` |

Ejemplos:
- Apagarlo: crear `SMOKE_ACTIVO` con valor `false`. Volver a encenderlo: cambiarlo a `true`.
- Correrlo a las 7:00 de Chile: `SMOKE_HORA` = `7` y `SMOKE_ZONA` = `America/Santiago`.

Otras formas de controlarlo:
- **Ejecutar ahora:** pestaña **Actions** → "Smoke test diario" → **Run workflow**. Funciona siempre, aunque esté apagado.
- **Pausa completa del workflow:** pestaña **Actions** → "Smoke test diario" → menú **⋯** → **Disable workflow**
  (y **Enable workflow** para reactivarlo).

Cómo funciona: GitHub no permite una hora variable dentro del `cron`, así que el workflow se despierta **cada hora**
(minuto 17) y su primer job, "¿Corresponde ejecutar?", compara la hora local con `SMOKE_HORA`. Si no coincide, termina en
segundos y el smoke no corre. Por eso en la pestaña Actions verás una ejecución corta cada hora. GitHub puede retrasar las
ejecuciones programadas varios minutos en horas de mucha carga: se recomienda no elegir una hora justo antes del cambio
de hora que le importa.

Condiciones de GitHub: los workflows programados corren desde la rama por defecto (`main`), y en repositorios públicos
GitHub los desactiva tras 60 días sin actividad en el repo (se reactivan desde la pestaña Actions).

`npm test` corre primero `auth.setup.ts` (login con `standard_user`, sesión en `automatizacion/.auth/`, no se versiona) y
luego los tests. `npm run report` abre el informe HTML.

## Estructura

| Ruta | Contenido |
|------|-----------|
| `auth.setup.ts` | Login único y sesión guardada |
| `support/data.ts` | Usuarios, mensajes literales y datos de prueba |
| `support/helpers.ts` | Login, agregar al carrito, cálculos y pasos del checkout |
| `tests/acceso.spec.ts` | LOG-01…LOG-11, OUT-01, OUT-02 (sin sesión previa) |
| `tests/inventario.spec.ts` | PRO-01, PRO-04 |
| `tests/inventario-detalle.spec.ts` | PRO-02, 03, 05, 06, 07, 08 |
| `tests/carrito.spec.ts` | CAR-01, CAR-05 |
| `tests/carrito-regresion.spec.ts` | CAR-02, 03, 04, 06, 07, 08, 09 |
| `tests/checkout.spec.ts` | CHK-01, CHK-02, CHK-08, CHK-09 |
| `tests/checkout-regresion.spec.ts` | CHK-03…07, CHK-10, CHK-11, CHK-12 |
| `tests/menu.spec.ts` | MEN-01…04 |
| `tests/usuarios-especiales.spec.ts` | USR-01…07, 02b, 02c, 03b, 05b, 07c, 07d, 07e (defectos intencionales, fallos esperados) |
| `tests/visual.spec.ts` | VIS-01…VIS-24 y VIS-26 (comprobaciones visuales estructurales) |
| `tests/todos-los-usuarios.spec.ts` | Matriz de los 6 usuarios × 16 verificaciones, comparadas con el estándar (MAT-…) |
| `herramientas/capturar-evidencias.mjs` | Script (no es un test) que regenera las capturas y medidas de `documentacion/evidencias/` |
| `tests/dynamic-catalog.spec.ts` | DYN-01…DYN-03 (función "Dynamic Catalog", no documentada) |

El ID del caso (`LOG-01`, `CHK-08`…) va al inicio del título de cada test para mantener la trazabilidad con
`casos-manuales/casos-de-prueba-saucedemo.md`.

## Fallos esperados

Los tests que documentan un defecto conocido (usuarios especiales, CHK-12, MEN-01b, MEN-04b) llevan `test.fail()` con el
motivo. El informe los cuenta como **aprobados** porque el defecto se confirmó; si el sitio lo corrige, el test pasa a
fallar y avisa. Se ven en el informe con la anotación del motivo.

## Convenciones

- Los textos esperados son los **originales en inglés** (catálogo de mensajes del documento funcional).
- Localizadores por `data-test` (`getByTestId`). Los precios se leen de la pantalla y no se escriben a mano.
- Los selectores se confirmaron contra el sitio real (2026-10-22). Si un test falla por un selector, primero se revisa si
  el sitio cambió su HTML antes de considerarlo un bug del producto.

## Ejecución en la nube

- **Smoke diario:** `.github/workflows/smoke.yml` (los 6 casos `@smoke`).
- **Regresión completa semanal:** `.github/workflows/regresion.yml` (todos los tests, lunes 13:00 UTC o a mano desde Actions).

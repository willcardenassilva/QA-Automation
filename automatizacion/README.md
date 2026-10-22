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

`npm test` corre primero `auth.setup.ts` (login con `standard_user`, sesión en `automatizacion/.auth/`, no se versiona) y
luego los tests. `npm run report` abre el informe HTML.

## Estructura

| Ruta | Contenido |
|------|-----------|
| `auth.setup.ts` | Login único y sesión guardada |
| `support/data.ts` | Usuarios, mensajes literales y datos de prueba |
| `support/helpers.ts` | Login, agregar al carrito, cálculos y pasos del checkout |
| `tests/acceso.spec.ts` | LOG-01…LOG-10, OUT-01, OUT-02 (sin sesión previa) |
| `tests/inventario.spec.ts` | PRO-01, PRO-04 |
| `tests/carrito.spec.ts` | CAR-01, CAR-05 |
| `tests/checkout.spec.ts` | CHK-01, CHK-02, CHK-08, CHK-09 |

El ID del caso (`LOG-01`, `CHK-08`…) va al inicio del título de cada test para mantener la trazabilidad con
`casos-manuales/casos-de-prueba-saucedemo.md`.

## Convenciones

- Los textos esperados son los **originales en inglés** (catálogo de mensajes del documento funcional).
- Localizadores por `data-test` (`getByTestId`). Los precios se leen de la pantalla y no se escriben a mano.
- Los selectores y textos del checkout y del menú vienen del conocimiento del sitio y **se confirman en la primera
  ejecución**: un fallo de selector es un ajuste del test, no un bug del producto, hasta revisarlo.

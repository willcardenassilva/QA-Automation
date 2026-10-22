# agent-prompts

Material que el agente lee antes de ejecutar pruebas en SauceDemo.

| Qué | Archivo |
|-----|---------|
| Mapa del producto, navegación, conceptos | [ECOSYSTEM-CONTEXT.md](ECOSYSTEM-CONTEXT.md) |
| Cómo preparar una ejecución (épica, usuario, estado) | [QUICK-SETUP-GUIDE.md](QUICK-SETUP-GUIDE.md) |
| Plantillas para nuevos flujos y secciones de red | [templates/](templates/) |
| Flujos ejecutables por épica | [flows/](flows/) |
| Datos de prueba | [test-data/](test-data/) |

## Épicas disponibles

| Épica | Carpeta | Casos que cubre |
|-------|---------|-----------------|
| Acceso | [flows/acceso/](flows/acceso/) | LOG-01, LOG-02, LOG-04, LOG-09, OUT-01 |
| Compra | [flows/compra/](flows/compra/) | PRO-01…08, CAR-01…09, CHK-01…12 |
| Menú lateral | [flows/menu/](flows/menu/) | MEN-01…04 |
| Usuarios especiales | [flows/usuarios-especiales/](flows/usuarios-especiales/) | USR-01…07 |
| Pruebas visuales | [flows/visuales/](flows/visuales/) | VIS-01…24 (VIS-25 en usuarios especiales) |

## Prompt diario

- `Ejecuta el flujo agent-prompts/flows/acceso en modo TURBO`
- `Haz la pasada rápida de SauceDemo`
- `Prueba exhaustiva de la pantalla de checkout`

Las skills `saucedemo-tester` y `saucedemo-testing-method` se activan solas con estas frases.

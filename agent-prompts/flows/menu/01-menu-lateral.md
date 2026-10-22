# 01 – Menú lateral

| Campo | Valor |
|-------|-------|
| Épica | Menú lateral |
| Casos | MEN-01, MEN-02, MEN-03, MEN-04 |
| Requisitos | RF-MEN-01, RF-MEN-02, RF-MEN-03, RF-MEN-05 |
| Usuario | `standard_user` |

| # | Acción | Resultado esperado |
|---|--------|--------------------|
| 1 | Pulsar ☰ | Se abre el menú. **Documento: 4 opciones. App observada: 5** (All Items, Dynamic Catalog, About, Logout, Reset App State) |
| 2 | Pulsar la X | El menú se cierra |
| 3 | Desde el detalle de un producto, menú → All Items | Vuelve a `/inventory.html` con los 6 productos |
| 4 | Menú → About | El enlace apunta a saucelabs.com (se verifica el destino, sin navegar) |
| 5 | Agregar 2 productos, menú → Reset App State | El contador se vacía. **Hallazgo:** los botones siguen en "Remove" hasta recargar la página |

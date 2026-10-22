# 02 – performance_glitch_user, error_user, visual_user

| # | Caso | Usuario | Acción | Esperado | Observado (2026-10-22) |
|---|------|---------|--------|----------|------------------------|
| 1 | USR-05 | `performance_glitch_user` | Medir login → inventario | Menos de 3 s (umbral de prueba; duda 11.4) | Unos 5,6 s (estándar: 0,6 s) |
| 2 | USR-06 | `error_user` | Completar una compra | Pantalla "Thank you for your order!" | Finish no completa: queda en el resumen. También fallan el orden por precio y los botones, como `problem_user` |
| 3 | USR-07a | `visual_user` | Comparar precios con el usuario estándar | Idénticos | Distintos (cambian en cada carga) |
| 4 | USR-07b | `visual_user` | Comparar la posición del ícono del carrito | Misma posición | Desplazado y de otro tamaño |

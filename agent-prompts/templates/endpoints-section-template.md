# Contrato observado – <Vista>

| Campo | Valor |
|-------|-------|
| Vista | <nombre> |
| URL | <ruta> |
| Usuario | <usuario> |
| Fecha / navegador | <fecha, navegador, resolución> |

## Peticiones tras cargar la vista

| Método | URL | Código | Tipo | Observación |
|--------|-----|--------|------|-------------|
| GET | <url> | 200 | documento / script / imagen / tercero | <ok o problema> |

> Si no hubo llamadas relevantes, escribe "Sin llamadas a API propia; solo recursos estáticos". No inventes endpoints.

## Consola

- <errores propios de la app / de terceros / ninguno>

## Estado del navegador

| Elemento | Valor observado |
|----------|-----------------|
| Cookie `session-username` | <valor o ausente> |
| Carrito (almacenamiento local) | <contenido> |

## Conclusión de la capa Back

PASS / FAIL / WARNING — <una línea>.

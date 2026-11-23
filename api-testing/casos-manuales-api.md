# Casos manuales de API: Restful-Booker

Base: `https://restful-booker.herokuapp.com`. Los ejecuto en Postman con la colección de `postman/`.
El resultado esperado es el razonable según buenas prácticas; cuando la API se comporta distinto, lo registro como hallazgo (marcado como "Observado").
Ejecuté los 17 casos a mano en Postman y comparé lo esperado con lo obtenido. Los resultados coincidieron con los de la automatización (colección de Postman con validaciones y suite de Playwright), así que no los repito en esta tabla para no duplicar información.

| ID | Caso | Petición | Esperado |
|---|---|---|---|
| API-01 | Health check | `GET /ping` | 201 (la API documenta 201), body `Created` |
| API-02 | Login válido | `POST /auth` `{"username":"admin","password":"password123"}` | 200 y `token` en el body |
| API-03 | Login con clave mala | `POST /auth` con `password:"x"` | 401. **Observado:** 200 + `{"reason":"Bad credentials"}` |
| API-04 | Listar reservas | `GET /booking` | 200, arreglo de objetos con `bookingid` |
| API-05 | Leer reserva existente | `GET /booking/{id}` | 200, campos `firstname`, `lastname`, `totalprice`, `depositpaid`, `bookingdates` |
| API-06 | Leer reserva inexistente | `GET /booking/999999999` | 404 |
| API-07 | Crear reserva válida | `POST /booking` (body completo, `Accept: application/json`) | 200/201, `bookingid` y el mismo `booking` enviado |
| API-08 | Crear reserva con body vacío | `POST /booking` `{}` | 400. **Observado:** 500 |
| API-09 | Verificar lo creado | `GET /booking/{id creado}` | Los datos coinciden con API-07 |
| API-10 | Actualizar completo | `PUT /booking/{id}` + token (header `Cookie: token=...`) | 200, datos nuevos |
| API-11 | Actualizar parcial | `PATCH /booking/{id}` + token, solo `firstname` | 200, solo cambia `firstname` |
| API-12 | Actualizar sin token | `PUT /booking/{id}` sin token | 403 |
| API-13 | Borrar con token | `DELETE /booking/{id}` + token | 201 (documentado), luego GET da 404 |
| API-14 | Borrar sin token | `DELETE /booking/1` | 403 |
| API-15 | Filtrar por nombre | `GET /booking?firstname=Ana` | 200, incluye la reserva creada |
| API-16 | Tiempo de respuesta | cualquier GET | menor a 2000 ms |
| API-17 | Login con formato incorrecto | `POST /auth` con body **form-data** | 4xx. **Observado:** 200 + `{"reason":"Bad credentials"}` |

Orden de ejecución que uso: API-02 → 07 → 09 → 10 → 11 → 13 → 06 (el GET tras borrar). El resto son independientes.

## Notas

- Es una API compartida: otras personas la usan y se reinicia periódicamente. Uso nombres como `Ana QA`, nunca datos reales.
- Si algo falla una vez, lo repito antes de concluir (puede ser lentitud del servidor).

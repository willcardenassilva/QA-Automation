# Pruebas de API: Restful-Booker

Proyecto de práctica en el que pruebo una API REST pública hecha para practicar QA: [Restful-Booker](https://restful-booker.herokuapp.com) ([documentación](https://restful-booker.herokuapp.com/apidoc/index.html)). Primero diseñé y ejecuté las pruebas a mano en Postman y después las automaticé con Playwright y TypeScript.

Es un proyecto de aprendizaje sobre una API de demostración, no una prueba sobre un sistema en producción.

## Resumen

| | |
|---|---|
| Casos manuales diseñados | 17 |
| Pruebas automatizadas (Playwright + TypeScript) | 15, se ejecutan en unos 8 a 9 segundos |
| Hallazgos documentados | 3 |

## Qué probé

- **Autenticación**: login válido con token, credenciales inválidas y formato de datos incorrecto.
- **CRUD completo**: crear, leer, actualizar (completo con `PUT` y parcial con `PATCH`) y borrar reservas, verificando que lo creado se pueda leer y que lo borrado deje de existir.
- **Filtros**: búsqueda de reservas por nombre.
- **Seguridad básica**: modificar o borrar sin token debe responder 403 y no cambiar nada.
- **Casos negativos**: body vacío e id inexistente.
- **Tiempo de respuesta**: menor a 2000 ms.

En cada respuesta valido el código de estado, la estructura del body (campos y valores) y el tiempo.

## Cómo lo trabajé

1. **Casos manuales.** Diseñé 17 casos con ID, petición y resultado esperado (ver [`casos-manuales-api.md`](casos-manuales-api.md)) y los ejecuté a mano en Postman, comparando lo esperado con lo obtenido. Los resultados coincidieron con los de la automatización, por eso no los repito en la tabla.
2. **Postman.** Armé una colección con entorno y variables, organizada en cinco carpetas. Cada petición tiene validaciones automáticas de código de estado, estructura y tiempo. La colección y el entorno están en [`postman/`](postman).
3. **Automatización con Playwright.** Pasé los mismos casos a pruebas de API con el cliente `request` de Playwright, sin navegador. Cada prueba crea sus propios datos y los limpia al terminar, así que ninguna depende de otra. Los tests están en [`tests/`](tests) y las ayudas en [`support/api.ts`](support/api.ts).

## Hallazgos

Son comportamientos reales de esta API. Los registro como hallazgos y no los "arreglo": en la suite están marcados con `test.fail`, de modo que pasan mientras la API siga fallando así y avisan si algún día la corrigen.

| ID | Qué esperaba | Qué pasó | Por qué importa |
|---|---|---|---|
| API-03 | Login con contraseña incorrecta: 401 | Responde **200** con `{"reason":"Bad credentials"}` | Un cliente que solo mira el código de estado podría creer que se autenticó |
| API-08 | `POST /booking` con body vacío: 400 | Responde **500** | Un dato inválido del cliente se reporta como falla del servidor |
| API-17 | Login con formato de datos incorrecto (`form-data`): rechazo 4xx | Responde **200** con `{"reason":"Bad credentials"}` | Un formato que la API no soporta no se rechaza de forma explícita |

## Cómo ejecutarlo

Requisitos: Node.js.

```bash
npm install
npm run test:api
```

Resultado esperado: 15 pruebas ejecutadas. Los tres hallazgos aparecen como fallos esperados.

Para repetir la parte manual en Postman:

1. Importar `api-testing/postman/restful-booker.postman_collection.json` y `api-testing/postman/restful-booker.postman_environment.json`.
2. Elegir el entorno **Restful-Booker**.
3. Ejecutar las peticiones en orden, de la carpeta 01 a la 05. Las validaciones se ven en la pestaña de resultados de cada petición.

## Estructura

```
api-testing/
├── README.md                 este documento
├── casos-manuales-api.md     los 17 casos diseñados
├── postman/                  colección y entorno de Postman
├── support/api.ts            ayudas para las pruebas (cliente, datos, token)
└── tests/                    pruebas de Playwright (auth, booking, negativos)
```

## Alcance

La API es compartida y se reinicia periódicamente, así que uso datos de prueba como `Ana QA`, nunca datos reales. Si una prueba falla una sola vez, la repito antes de concluir, porque puede ser lentitud del servidor.

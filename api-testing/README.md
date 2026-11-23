# Pruebas de API (Restful-Booker)

Ruta de aprendizaje: **entender → probar a mano en Postman → automatizar → subir a GitHub**.
API bajo prueba: https://restful-booker.herokuapp.com (pública, hecha para practicar QA; documentación: https://restful-booker.herokuapp.com/apidoc/index.html).

## 1. Qué es una API (lo mínimo)

Una API es la "puerta" por la que el front (la web) habla con el back (el servidor). En SauceDemo probabas lo que
**se ve**; aquí pruebas lo que **responde el servidor**, sin pantalla.

Cada petición tiene:

| Parte | Ejemplo | Para qué |
|---|---|---|
| Método | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Qué quieres hacer: leer, crear, reemplazar, modificar, borrar |
| URL | `/booking/1` | Sobre qué recurso |
| Headers | `Content-Type: application/json` | Metadatos (formato, token) |
| Body | `{"firstname":"Ana"}` | Los datos que envías (en POST/PUT/PATCH) |

Cada respuesta tiene: **código de estado**, **headers**, **body** y **tiempo**.

| Código | Significa |
|---|---|
| 200 | OK |
| 201 | Creado |
| 400 | Petición mal hecha (error del cliente) |
| 401 / 403 | Sin autenticar / sin permiso |
| 404 | No existe |
| 500 | Error del servidor (casi siempre un bug) |

## 2. Qué se valida en una prueba de API

1. **Código de estado** correcto.
2. **Body**: campos, tipos y valores correctos.
3. **Headers** (ej. `Content-Type`).
4. **Tiempo** de respuesta razonable.
5. **Seguridad básica**: sin token no debe dejar modificar/borrar.
6. **Negativos**: datos vacíos, inválidos, ids que no existen.

## 3. Fase 1: manual con Postman

1. Instala Postman (https://www.postman.com/downloads/) e inicia sesión o usa "Lightweight API client".
2. `Import` → `postman/restful-booker.postman_collection.json` y `postman/restful-booker.postman_environment.json`.
3. Elige el entorno **Restful-Booker** (arriba a la derecha).
4. Ejecuta las peticiones **en orden** (carpeta 01 → 05) y compara con `casos-manuales-api.md`.
5. Anota el resultado real en esa tabla.

## 4. Fases siguientes

- **Fase 2 (automatizar):** hecha con Playwright (cliente de API `request`, sin navegador). Tests en
  `api-testing/tests/`, ayudas en `api-testing/support/api.ts`. Se ejecuta con `npm run test:api`.
  Los hallazgos conocidos (API-03, API-08, API-17) están como `test.fail`: pasan mientras la API siga fallando así.
- **Fase 3 (GitHub):** commit y push cuando tú lo confirmes.

## Hallazgos ya observados (a confirmar tú en Postman)

- `POST /auth` con credenciales malas responde **200** con `{"reason":"Bad credentials"}` (lo esperable sería 401).
- `POST /booking` con body vacío responde **500** (lo esperable sería 400).

Son comportamientos reales de esta API de práctica: se registran como hallazgos, no se "arreglan".

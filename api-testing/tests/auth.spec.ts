import { test, expect } from '@playwright/test';
import { obtenerToken } from '../support/api';

test.describe('Salud y login', () => {
  test('API-01 ping responde 201', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('API-02 login valido devuelve token', async ({ request }) => {
    const token = await obtenerToken(request);
    expect(typeof token).toBe('string');
  });

  // Hallazgo conocido: la API responde 200 + {"reason":"Bad credentials"} en vez de 401.
  // test.fail = "se espera que falle": si algun dia la API devuelve 401, este test avisa.
  test('API-03 login con clave mala deberia dar 401 [hallazgo]', async ({ request }) => {
    test.fail(true, 'Hallazgo: responde 200 con {"reason":"Bad credentials"} en vez de 401');
    const res = await request.post('/auth', { data: { username: 'admin', password: 'x' } });
    expect(res.status()).toBe(401);
  });

  // Caso negativo extra visto en Postman: formato incorrecto (form-data) no se rechaza.
  test('API-17 login con multipart deberia rechazarse [hallazgo]', async ({ request }) => {
    test.fail(true, 'Hallazgo: con form-data responde 200 + Bad credentials en vez de un 4xx');
    const res = await request.post('/auth', { multipart: { username: 'admin', password: 'password123' } });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});

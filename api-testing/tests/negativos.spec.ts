import { test, expect } from '@playwright/test';
import { obtenerToken, crearReserva, borrarReserva, reserva } from '../support/api';

test.describe('Casos negativos y seguridad', () => {
  test('API-06b leer un id inexistente da 404', async ({ request }) => {
    const res = await request.get('/booking/999999999');
    expect(res.status()).toBe(404);
  });

  // Hallazgo conocido: body vacio da 500 (error del servidor) en vez de 400.
  test('API-08 crear con body vacio deberia dar 400 [hallazgo]', async ({ request }) => {
    test.fail(true, 'Hallazgo: responde 500 en vez de 400');
    const res = await request.post('/booking', { data: {} });
    expect(res.status()).toBe(400);
  });

  test('API-12 PUT sin token da 403 y no modifica', async ({ request }) => {
    const token = await obtenerToken(request);
    const id = await crearReserva(request, 'Ana');
    try {
      const res = await request.put(`/booking/${id}`, { data: reserva('Hack') });
      expect(res.status()).toBe(403);
      const despues = await (await request.get(`/booking/${id}`)).json();
      expect(despues.firstname).toBe('Ana'); // no cambio
    } finally {
      await borrarReserva(request, id, token);
    }
  });

  test('API-14 DELETE sin token da 403 y la reserva sigue existiendo', async ({ request }) => {
    const token = await obtenerToken(request);
    const id = await crearReserva(request, 'Ana');
    try {
      const res = await request.delete(`/booking/${id}`);
      expect(res.status()).toBe(403);
      expect((await request.get(`/booking/${id}`)).status()).toBe(200);
    } finally {
      await borrarReserva(request, id, token);
    }
  });
});

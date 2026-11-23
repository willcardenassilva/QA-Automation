import { test, expect } from '@playwright/test';
import { obtenerToken, crearReserva, borrarReserva, reserva } from '../support/api';

// Cada test crea SU reserva y la borra al terminar: no dependen unos de otros.
test.describe('Reservas (CRUD)', () => {
  let token: string;
  let id: number;

  test.beforeEach(async ({ request }) => {
    token = await obtenerToken(request);
    id = await crearReserva(request, 'Ana');
  });

  test.afterEach(async ({ request }) => {
    await borrarReserva(request, id, token);
  });

  test('API-07 y API-09 crear y leer lo creado', async ({ request }) => {
    const res = await request.get(`/booking/${id}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject(reserva('Ana'));
  });

  test('API-04 listar reservas devuelve un arreglo con bookingid', async ({ request }) => {
    const res = await request.get('/booking');
    expect(res.status()).toBe(200);
    const lista = await res.json();
    expect(Array.isArray(lista)).toBe(true);
    expect(lista[0]).toHaveProperty('bookingid');
  });

  test('API-15 filtrar por nombre incluye la reserva creada', async ({ request }) => {
    const res = await request.get('/booking', { params: { firstname: 'Ana', lastname: 'QA' } });
    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(id);
  });

  test('API-10 PUT reemplaza la reserva completa', async ({ request }) => {
    const res = await request.put(`/booking/${id}`, {
      data: reserva('Beatriz'),
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).firstname).toBe('Beatriz');
  });

  test('API-11 PATCH cambia solo el nombre', async ({ request }) => {
    const res = await request.patch(`/booking/${id}`, {
      data: { firstname: 'Carla' },
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.firstname).toBe('Carla');
    expect(body.lastname).toBe('QA'); // lo demas no cambia
  });

  test('API-13 y API-06 borrar con token y luego la reserva no existe', async ({ request }) => {
    const del = await request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
    expect(del.status()).toBe(201);
    const get = await request.get(`/booking/${id}`);
    expect(get.status()).toBe(404);
  });

  test('API-16 tiempo de respuesta menor a 2000 ms', async ({ request }) => {
    const inicio = Date.now();
    const res = await request.get(`/booking/${id}`);
    expect(res.status()).toBe(200);
    expect(Date.now() - inicio).toBeLessThan(2000);
  });
});

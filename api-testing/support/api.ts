import { APIRequestContext, expect } from '@playwright/test';

// Datos de prueba: nunca reales. La API es pública y compartida.
export const reserva = (firstname = 'Ana') => ({
  firstname,
  lastname: 'QA',
  totalprice: 100,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
});

// Pide un token (equivale a la petición API-02 de Postman).
export async function obtenerToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/auth', {
    data: { username: 'admin', password: 'password123' },
  });
  expect(res.status()).toBe(200);
  const { token } = await res.json();
  expect(token, 'la API debe devolver un token').toBeTruthy();
  return token;
}

// Crea una reserva y devuelve su id (equivale a API-07).
export async function crearReserva(request: APIRequestContext, firstname = 'Ana'): Promise<number> {
  const res = await request.post('/booking', { data: reserva(firstname) });
  expect(res.status()).toBe(200);
  return (await res.json()).bookingid;
}

// Borra una reserva (limpieza al terminar cada test). Ignora si ya no existe.
export async function borrarReserva(request: APIRequestContext, id: number, token: string) {
  await request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
}

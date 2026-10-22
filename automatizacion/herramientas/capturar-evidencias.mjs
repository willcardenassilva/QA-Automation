// Genera las capturas y medidas que respaldan la matriz de bugs (documentacion/matriz-de-bugs.md).
// Uso:  node automatizacion/herramientas/capturar-evidencias.mjs
// Escribe en documentacion/evidencias/: una imagen por hallazgo y mediciones.json con los datos numéricos.
// No forma parte de la suite de tests: se ejecuta a mano cuando hay que renovar las evidencias.
import { chromium, selectors } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

selectors.setTestIdAttribute('data-test');

const OUT = path.resolve('documentacion/evidencias');
fs.mkdirSync(OUT, { recursive: true });
const PASSWORD = 'secret_sauce'; // contraseña pública de demo de SauceDemo
const BASE = 'https://www.saucedemo.com';
const measures = { generado: new Date().toISOString(), navegador: 'Chromium (Playwright)', resolucion: '1280x800' };
const failures = [];

const browser = await chromium.launch();

async function session(username, viewport = { width: 1280, height: 800 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  await page.goto(BASE);
  if (username) {
    const start = Date.now();
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await page.getByTestId('inventory-container').waitFor({ timeout: 30000 });
    page.loginMs = Date.now() - start;
  }
  return { context, page };
}

async function images(page) {
  await page.waitForFunction(() => [...document.images].every((i) => i.complete)).catch(() => {});
}

async function capture(id, work) {
  try {
    await work();
    console.log('ok  ', id);
  } catch (error) {
    failures.push(id);
    console.log('FALLA', id, String(error).split('\n')[0]);
  }
}

const shot = (page, name, options = {}) => page.screenshot({ path: path.join(OUT, `${name}.png`), ...options });

// ---------- Defectos del producto (standard_user) ----------
await capture('BUG-01', async () => {
  const { context, page } = await session('standard_user');
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('firstName').waitFor();
  measures['BUG-01'] = { url: page.url(), productosEnCarrito: 0 };
  await shot(page, 'BUG-01');
  await context.close();
});

await capture('BUG-02', async () => {
  const { context, page } = await session('standard_user');
  await images(page);
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  await page.locator('#react-burger-menu-btn').click();
  await page.getByTestId('reset-sidebar-link').click();
  await page.locator('#react-burger-cross-btn').click();
  await page.waitForTimeout(600);
  measures['BUG-02'] = {
    badgeVisible: await page.getByTestId('shopping-cart-badge').count(),
    botonesRemoveVisibles: await page.locator('.inventory_item button', { hasText: 'Remove' }).count(),
  };
  await shot(page, 'BUG-02');
  await context.close();
});

await capture('BUG-03', async () => {
  const { context, page } = await session('standard_user');
  await images(page);
  const card = page.locator('.inventory_item').nth(5);
  await card.scrollIntoViewIfNeeded();
  await images(page);
  measures['BUG-03'] = {
    nombre: await card.locator('.inventory_item_name').innerText(),
    imagen: await card.locator('img').getAttribute('src'),
  };
  await card.screenshot({ path: path.join(OUT, 'BUG-03.png') });
  await context.close();
});

await capture('BUG-04', async () => {
  const { context, page } = await session(null);
  await page.getByTestId('login-button').click();
  await page.getByTestId('error').waitFor();
  measures['BUG-04'] = await page.evaluate(() => {
    const text = document.querySelector('[data-test="error"]');
    const box = text.closest('.error-message-container');
    const rgb = (css) => (css.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const lum = ([r, g, b]) => {
      const [a, c, d] = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * a + 0.7152 * c + 0.0722 * d;
    };
    const fg = getComputedStyle(text).color;
    const bg = getComputedStyle(box).backgroundColor;
    const l1 = lum(rgb(fg)), l2 = lum(rgb(bg));
    return { colorTexto: fg, colorFondo: bg, tamanoPx: getComputedStyle(text).fontSize, contraste: ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2) + ':1' };
  });
  await shot(page, 'BUG-04');
  await context.close();
});

await capture('BUG-05', async () => {
  const { context, page } = await session('standard_user');
  await page.goBack();
  await page.waitForTimeout(600);
  measures['BUG-05'] = { urlTrasAtras: page.url(), formularioLoginVisible: await page.getByTestId('login-button').count(), cookieSesion: (await context.cookies()).some((c) => c.name === 'session-username') };
  await shot(page, 'BUG-05');
  await context.close();
});

await capture('BUG-06', async () => {
  const { context, page } = await session('standard_user', { width: 1920, height: 1080 });
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('firstName').fill('Ana');
  await page.getByTestId('lastName').fill('Pérez');
  await page.getByTestId('postalCode').fill('1000');
  await page.getByTestId('continue').click();
  await page.getByTestId('finish').click();
  await page.getByTestId('complete-header').waitFor();
  const b = await page.getByTestId('back-to-products').boundingBox();
  const h = await page.getByTestId('complete-header').boundingBox();
  measures['BUG-06'] = {
    viewport: '1920x1080',
    centroBotonX: Math.round(b.x + b.width / 2),
    centroPaginaX: 960,
    centroEncabezadoX: Math.round(h.x + h.width / 2),
    desplazamientoPx: Math.round(b.x + b.width / 2 - 960),
  };
  await shot(page, 'BUG-06');
  await context.close();
});

await capture('BUG-07', async () => {
  const { context, page } = await session('standard_user', { width: 1280, height: 800 });
  await page.locator('#react-burger-menu-btn').click();
  await page.getByTestId('dynamic-catalog-sidebar-link').click();
  await page.getByText('Lazy Load', { exact: true }).click();
  await page.waitForTimeout(2500);
  const count = () => page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && /^\$\d+\.\d{2}$/.test(e.textContent.trim())).length);
  const counts = [await count()];
  for (let i = 0; i < 14; i++) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(600);
    counts.push(await count());
  }
  const names = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && /^(Sauce Labs|Test\.allTheThings)/.test(e.textContent.trim())).map((e) => e.textContent.trim()));
  measures['BUG-07'] = { tarjetasPorScroll: counts, tarjetasFinal: counts.at(-1), nombresDistintos: new Set(names).size };
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
  await shot(page, 'BUG-07');
  await context.close();
});

// ---------- problem_user ----------
await capture('BUG-08/09/10/11', async () => {
  const { context, page } = await session('problem_user');
  await images(page);
  const sources = await page.locator('.inventory_item img').evaluateAll((els) => els.map((e) => e.getAttribute('src')));
  measures['BUG-08'] = { imagenesDistintas: new Set(sources).size, de: sources.length };
  await shot(page, 'BUG-08');

  await page.getByTestId('product-sort-container').selectOption('lohi');
  await page.waitForTimeout(800);
  measures['BUG-09'] = { preciosTrasOrdenarMenorAMayor: await page.getByTestId('inventory-item-price').allTextContents() };
  await shot(page, 'BUG-09');

  const buttons = page.locator('.inventory_item button');
  for (let i = 0; i < 6; i++) await buttons.nth(i).click();
  measures['BUG-10'] = {
    contadorTrasAgregar6: await page.getByTestId('shopping-cart-badge').innerText().catch(() => '0'),
    botones: await page.locator('.inventory_item button').allTextContents(),
  };
  await shot(page, 'BUG-10');
  await context.close();

  const second = await session('problem_user');
  await second.page.locator('.inventory_item button').first().click();
  await second.page.getByTestId('shopping-cart-link').click();
  await second.page.getByTestId('checkout').click();
  await second.page.getByTestId('firstName').fill('Ana');
  await second.page.getByTestId('lastName').fill('Pérez');
  await second.page.getByTestId('postalCode').fill('1000');
  measures['BUG-11'] = {
    escrito: { nombre: 'Ana', apellido: 'Pérez', postal: '1000' },
    enLosCampos: {
      nombre: await second.page.getByTestId('firstName').inputValue(),
      apellido: await second.page.getByTestId('lastName').inputValue(),
      postal: await second.page.getByTestId('postalCode').inputValue(),
    },
  };
  await second.page.getByTestId('continue').click();
  await second.page.waitForTimeout(500);
  measures['BUG-11'].tras_continuar = { url: second.page.url(), error: await second.page.getByTestId('error').innerText().catch(() => null) };
  await shot(second.page, 'BUG-11');
  await second.context.close();
});

// ---------- error_user ----------
await capture('BUG-12/13/14', async () => {
  const { context, page } = await session('error_user');
  const dialogs = [];
  page.on('dialog', async (d) => { dialogs.push(d.message()); await d.dismiss(); });
  await page.getByTestId('product-sort-container').selectOption('za');
  await page.waitForTimeout(800);
  measures['BUG-12'] = { avisoMostrado: dialogs, nombresTrasOrdenarZA: await page.getByTestId('inventory-item-name').allTextContents() };
  await shot(page, 'BUG-12');

  const buttons = page.locator('.inventory_item button');
  for (let i = 0; i < 6; i++) await buttons.nth(i).click();
  measures['BUG-13'] = {
    contadorTrasAgregar6: await page.getByTestId('shopping-cart-badge').innerText().catch(() => '0'),
    botones: await page.locator('.inventory_item button').allTextContents(),
  };
  await shot(page, 'BUG-13');
  await context.close();

  const second = await session('error_user');
  await second.page.locator('.inventory_item button').first().click();
  await second.page.getByTestId('shopping-cart-link').click();
  await second.page.getByTestId('checkout').click();
  await second.page.getByTestId('firstName').fill('Ana');
  await second.page.getByTestId('lastName').fill('Pérez');
  await second.page.getByTestId('postalCode').fill('1000');
  measures['BUG-14'] = {
    enLosCampos: {
      nombre: await second.page.getByTestId('firstName').inputValue(),
      apellido: await second.page.getByTestId('lastName').inputValue(),
      postal: await second.page.getByTestId('postalCode').inputValue(),
    },
  };
  await second.page.getByTestId('continue').click();
  await second.page.getByTestId('finish').click();
  await second.page.waitForTimeout(1000);
  measures['BUG-14'].trasFinish = { url: second.page.url(), seCompletoLaCompra: second.page.url().includes('complete') };
  await shot(second.page, 'BUG-14');
  await second.context.close();
});

// ---------- performance_glitch_user ----------
await capture('BUG-15/16', async () => {
  const timings = {};
  for (const user of ['standard_user', 'performance_glitch_user']) {
    const { context, page } = await session(user);
    const t = { loginMs: page.loginMs };
    let start = Date.now();
    await page.getByTestId('product-sort-container').selectOption('lohi');
    await page.waitForFunction(() => {
      const v = [...document.querySelectorAll('[data-test="inventory-item-price"]')].map((e) => Number(e.textContent.replace('$', '')));
      return v.length > 0 && v.every((x, i) => i === 0 || v[i - 1] <= x);
    }, null, { timeout: 20000 }).catch(() => {});
    t.ordenarMs = Date.now() - start;
    start = Date.now();
    await page.goto(`${BASE}/inventory.html`);
    await page.getByTestId('inventory-container').waitFor({ timeout: 30000 });
    t.recargaInventarioMs = Date.now() - start;
    t.abrirMenuMs = await (async () => { const s = Date.now(); await page.locator('#react-burger-menu-btn').click(); await page.getByTestId('logout-sidebar-link').waitFor(); return Date.now() - s; })();
    timings[user] = t;
    if (user === 'performance_glitch_user') await shot(page, 'BUG-15');
    await context.close();
  }
  measures['BUG-15'] = timings;
  measures['BUG-16'] = timings;
});

// ---------- visual_user ----------
await capture('BUG-17/18/19/20/21', async () => {
  const std = await session('standard_user');
  await images(std.page);
  const stdPrices = await std.page.getByTestId('inventory-item-price').allTextContents();
  const stdCart = await std.page.getByTestId('shopping-cart-link').boundingBox();
  await std.page.getByTestId('shopping-cart-link').click();
  const stdCheckout = await std.page.getByTestId('checkout').boundingBox();
  await shot(std.page, 'BUG-20-estandar');
  await std.context.close();

  const a = await session('visual_user');
  await images(a.page);
  const first = await a.page.getByTestId('inventory-item-price').allTextContents();
  const firstImage = await a.page.locator('.inventory_item img').first().getAttribute('src');
  await shot(a.page, 'BUG-17a');
  await a.page.reload();
  await a.page.getByTestId('inventory-container').waitFor();
  await images(a.page);
  const second = await a.page.getByTestId('inventory-item-price').allTextContents();
  await shot(a.page, 'BUG-17b');
  measures['BUG-17'] = { preciosEstandar: stdPrices, preciosVisualCarga1: first, preciosVisualCarga2: second };

  await a.page.getByTestId('product-sort-container').selectOption('lohi');
  await a.page.waitForTimeout(1200);
  measures['BUG-17'].preciosVisualTrasOrdenarMenorAMayor = await a.page.getByTestId('inventory-item-price').allTextContents();
  await shot(a.page, 'BUG-17c-ordenado');

  const cart = await a.page.getByTestId('shopping-cart-link').boundingBox();
  const sort = await a.page.getByTestId('product-sort-container').boundingBox();
  measures['BUG-19'] = {
    carritoEstandar: { x: Math.round(stdCart.x), y: Math.round(stdCart.y) },
    carritoVisual: { x: Math.round(cart.x), y: Math.round(cart.y), alto: Math.round(cart.height) },
    solapamientoConSelectorPx: Math.max(0, Math.round(cart.y + cart.height - sort.y)),
  };
  await shot(a.page, 'BUG-19', { clip: { x: 900, y: 0, width: 380, height: 120 } });
  measures['BUG-18'] = { primeraImagenVisual: firstImage };
  const card = a.page.locator('.inventory_item').first();
  await card.screenshot({ path: path.join(OUT, 'BUG-18.png') });

  const burger = await a.page.locator('.bm-burger-button img').evaluate((el) => ({ transform: getComputedStyle(el).transform, clase: el.className, ancho: el.getBoundingClientRect().width }));
  measures['BUG-21'] = burger;
  await a.context.close();

  const big = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 6 });
  for (const user of ['standard_user', 'visual_user']) {
    const p = await big.newPage();
    await p.goto(BASE);
    await p.getByTestId('username').fill(user);
    await p.getByTestId('password').fill(PASSWORD);
    await p.getByTestId('login-button').click();
    await p.getByTestId('inventory-container').waitFor();
    await p.screenshot({ path: path.join(OUT, `BUG-21-${user === 'standard_user' ? 'estandar' : 'visual'}.png`), clip: { x: 0, y: 0, width: 70, height: 60 } });
    await p.close();
  }
  await big.close();

  const b = await session('visual_user');
  await b.page.getByTestId('shopping-cart-link').click();
  await b.page.getByTestId('checkout').waitFor();
  const co = await b.page.getByTestId('checkout').boundingBox();
  measures['BUG-20'] = { botonCheckoutEstandar: { x: Math.round(stdCheckout.x), y: Math.round(stdCheckout.y) }, botonCheckoutVisual: { x: Math.round(co.x), y: Math.round(co.y) } };
  await shot(b.page, 'BUG-20');
  await b.context.close();
});

await browser.close();
fs.writeFileSync(path.join(OUT, 'mediciones.json'), JSON.stringify(measures, null, 2));
console.log(failures.length ? `Terminado con fallos en: ${failures.join(', ')}` : 'Terminado sin fallos');

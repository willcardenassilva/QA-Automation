import { test, expect, type Page } from '@playwright/test';
import { CHECKOUT_INFO, PRODUCT } from '../support/data';
import { addToCart, fillCheckoutInfo, goToCheckoutStepOne, openMenu } from '../support/helpers';

// Pruebas visuales estructurales: posiciones, tamaños, imágenes y desbordes. Son deterministas y no dependen
// del sistema operativo, a diferencia de las capturas píxel a píxel. Cada vista adjunta una captura como evidencia.

async function evidence(page: Page, name: string) {
  await test.info().attach(name, { body: await page.screenshot(), contentType: 'image/png' });
}

type Box = { x: number; y: number; width: number; height: number };

// Espera a que todas las imágenes de la página terminen de cargar antes de medirlas
async function waitForImages(page: Page) {
  await page.waitForFunction(() => [...document.images].every((img) => img.complete));
}

async function box(page: Page, testId: string): Promise<Box> {
  const found = await page.getByTestId(testId).first().boundingBox();
  if (!found) throw new Error(`No se pudo medir el elemento "${testId}"`);
  return found;
}

async function boxOf(page: Page, selector: string): Promise<Box> {
  const found = await page.locator(selector).first().boundingBox();
  if (!found) throw new Error(`No se pudo medir "${selector}"`);
  return found;
}

// Sin scroll horizontal y con todos los elementos interactivos dentro del ancho visible
async function expectNoHorizontalOverflow(page: Page, view: string) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth, `${view}: scroll horizontal`).toBeLessThanOrEqual(overflow.clientWidth + 1);

  const outside = await page.evaluate(() => {
    const limit = document.documentElement.clientWidth + 1;
    return [...document.querySelectorAll('button, a, input, select')]
      .filter((el) => !el.closest('.bm-menu-wrap')) // el menú cerrado está fuera de pantalla a propósito
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.right > limit || r.left < -1);
      })
      .map((el) => el.id || el.getAttribute('data-test') || el.tagName);
  });
  expect(outside, `${view}: elementos fuera del ancho visible`).toEqual([]);
}

test.describe('Visual – vistas sin sesión', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
  });

  test('VIS-01 Login: composición general', async ({ page }) => {
    await expect(page.locator('.login_logo')).toBeVisible();
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('login-credentials')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();

    // Orden vertical: logo, usuario, contraseña, botón; todo centrado horizontalmente
    const [logo, user, pass, button] = [
      await boxOf(page, '.login_logo'),
      await box(page, 'username'),
      await box(page, 'password'),
      await box(page, 'login-button'),
    ];
    expect(logo.y).toBeLessThan(user.y);
    expect(user.y + user.height).toBeLessThanOrEqual(pass.y);
    expect(pass.y + pass.height).toBeLessThanOrEqual(button.y);
    const viewportCenter = 1920 / 2;
    for (const b of [user, pass, button]) {
      expect(Math.abs(b.x + b.width / 2 - viewportCenter)).toBeLessThan(20);
    }
    await evidence(page, 'login');
  });

  test('VIS-02 Login: estado de error visible y legible', async ({ page }) => {
    await page.getByTestId('login-button').click();

    const error = page.getByTestId('error');
    await expect(error).toBeVisible();
    await expect(page.locator('.error-button')).toBeVisible();
    await expect(page.getByTestId('username')).toHaveClass(/error/);
    await expect(page.getByTestId('password')).toHaveClass(/error/);

    // El texto no se corta: el contenido cabe en el banner
    const clipped = await error.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(clipped).toBe(false);
    await evidence(page, 'login-error');
  });

  // Hallazgo manual: "el mensaje de error no se aprecia bien". Se mide el contraste real del texto contra su fondo.
  // Mínimo WCAG AA para texto normal: 4,5:1. El banner cumple por poco (texto de 14 px, blanco sobre rojo).
  test('VIS-26 Login: el contraste del mensaje de error cumple el mínimo AA (4,5:1)', async ({ page }) => {
    await page.getByTestId('login-button').click();

    const ratio = await page.evaluate(() => {
      const text = document.querySelector('[data-test="error"]') as HTMLElement;
      const background = text.closest('.error-message-container') as HTMLElement;
      const channels = (css: string) => (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const luminance = ([r, g, b]: number[]) => {
        const [lr, lg, lb] = [r, g, b].map((v) => {
          const c = v / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
      };
      const l1 = luminance(channels(getComputedStyle(text).color));
      const l2 = luminance(channels(getComputedStyle(background).backgroundColor));
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    });

    test.info().annotations.push({ type: 'contraste', description: `${ratio.toFixed(2)}:1 (AA exige 4,5:1; AAA, 7:1)` });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('VIS-03 Login: la contraseña se enmascara y los campos tienen texto de ayuda', async ({ page }) => {
    await expect(page.getByTestId('password')).toHaveAttribute('type', 'password');
    await expect(page.getByTestId('username')).toHaveAttribute('placeholder', 'Username');
    await expect(page.getByTestId('password')).toHaveAttribute('placeholder', 'Password');
  });
});

test.describe('Visual – vistas con sesión', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/inventory.html');
  });

  test('VIS-04 Inventario: encabezado y título', async ({ page }) => {
    const burger = await boxOf(page, '#react-burger-menu-btn');
    const logo = await boxOf(page, '.app_logo');
    const cart = await box(page, 'shopping-cart-link');
    const sort = await box(page, 'product-sort-container');

    expect(burger.x).toBeLessThan(logo.x);
    expect(logo.x).toBeLessThan(cart.x);
    expect(cart.x).toBeGreaterThan(1920 / 2);
    expect(sort.x).toBeGreaterThan(1920 / 2); // selector alineado a la derecha
    await expect(page.getByTestId('title')).toHaveText('Products');
    await evidence(page, 'inventario');
  });

  test('VIS-05 Inventario: cuadrícula de 6 tarjetas uniformes con imágenes cargadas', async ({ page }) => {
    const cards = page.getByTestId('inventory-item');
    await expect(cards).toHaveCount(6);
    await waitForImages(page);

    const boxes: Box[] = [];
    for (const card of await cards.all()) {
      boxes.push((await card.boundingBox())!);
    }
    // Mismo tamaño y sin superposición entre tarjetas
    for (const b of boxes) {
      expect(Math.abs(b.width - boxes[0].width)).toBeLessThanOrEqual(1);
      expect(Math.abs(b.height - boxes[0].height)).toBeLessThanOrEqual(1);
    }
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const overlap =
          boxes[i].x < boxes[j].x + boxes[j].width &&
          boxes[j].x < boxes[i].x + boxes[i].width &&
          boxes[i].y < boxes[j].y + boxes[j].height &&
          boxes[j].y < boxes[i].y + boxes[i].height;
        expect(overlap, `tarjetas ${i} y ${j} superpuestas`).toBe(false);
      }
    }

    // Imágenes cargadas y sin deformarse
    const images = await page.locator('.inventory_item img').evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).map((img) => ({
        loaded: img.complete && img.naturalWidth > 0,
        natural: img.naturalWidth / img.naturalHeight,
        shown: img.getBoundingClientRect().width / img.getBoundingClientRect().height,
      })),
    );
    for (const img of images) {
      expect(img.loaded).toBe(true);
      expect(Math.abs(img.natural - img.shown) / img.natural).toBeLessThan(0.05);
    }
    for (const price of await page.getByTestId('inventory-item-price').allTextContents()) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  test('VIS-06 Inventario: estado del botón y badge sobre el ícono del carrito', async ({ page }) => {
    const addButton = page.getByTestId(`add-to-cart-${PRODUCT.backpack}`);
    const classBefore = await addButton.getAttribute('class');

    await addButton.click();

    const removeButton = page.getByTestId(`remove-${PRODUCT.backpack}`);
    await expect(removeButton).toBeVisible();
    expect(await removeButton.getAttribute('class')).not.toBe(classBefore); // estilo distinto

    const badge = await box(page, 'shopping-cart-badge');
    const cart = await box(page, 'shopping-cart-link');
    const badgeCenterX = badge.x + badge.width / 2;
    const badgeCenterY = badge.y + badge.height / 2;
    expect(badgeCenterX).toBeGreaterThanOrEqual(cart.x - 5);
    expect(badgeCenterX).toBeLessThanOrEqual(cart.x + cart.width + 5);
    expect(badgeCenterY).toBeGreaterThanOrEqual(cart.y - 5);
    expect(badgeCenterY).toBeLessThanOrEqual(cart.y + cart.height + 5);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('VIS-07 Inventario: el selector muestra la opción activa y las 4 opciones', async ({ page }) => {
    const select = page.getByTestId('product-sort-container');
    await expect(select.locator('option')).toHaveText([
      'Name (A to Z)',
      'Name (Z to A)',
      'Price (low to high)',
      'Price (high to low)',
    ]);
    await expect(page.getByTestId('active-option')).toHaveText('Name (A to Z)');
  });

  test('VIS-08 Detalle: composición con imagen a la izquierda y datos a la derecha', async ({ page }) => {
    await page.getByTestId('inventory-item-name').first().click();

    await expect(page.getByTestId('back-to-products')).toBeVisible();
    await waitForImages(page);
    const back = await box(page, 'back-to-products');
    const image = await boxOf(page, '.inventory_details_img');
    const name = await box(page, 'inventory-item-name');
    const price = await box(page, 'inventory-item-price');

    expect(back.y).toBeLessThan(image.y); // "Back" arriba
    expect(image.x + image.width).toBeLessThanOrEqual(name.x + 1); // imagen a la izquierda del texto
    expect(name.y).toBeLessThan(price.y);

    const ratio = await page.locator('.inventory_details_img').evaluate((el) => {
      const img = el as HTMLImageElement;
      const shown = img.getBoundingClientRect();
      return Math.abs(img.naturalWidth / img.naturalHeight - shown.width / shown.height);
    });
    expect(ratio).toBeLessThan(0.05);
    await evidence(page, 'detalle');
  });

  test('VIS-09 Detalle: el botón pasa a "Remove" y aparece el badge', async ({ page }) => {
    await page.getByTestId('inventory-item-name').first().click();
    const addClass = await page.getByTestId('add-to-cart').getAttribute('class');

    await page.getByTestId('add-to-cart').click();

    await expect(page.getByTestId('remove')).toBeVisible();
    expect(await page.getByTestId('remove').getAttribute('class')).not.toBe(addClass);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('VIS-10 Carrito con productos: cabeceras, filas alineadas y botones', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight);
    await page.getByTestId('shopping-cart-link').click();

    await expect(page.getByTestId('cart-quantity-label')).toHaveText('QTY');
    await expect(page.getByTestId('cart-desc-label')).toHaveText('Description');
    await expect(page.getByTestId('continue-shopping')).toBeVisible();
    await expect(page.getByTestId('checkout')).toBeVisible();

    const quantities = await page.getByTestId('item-quantity').all();
    const xs = await Promise.all(quantities.map(async (q) => (await q.boundingBox())!.x));
    expect(xs).toHaveLength(2);
    expect(Math.abs(xs[0] - xs[1])).toBeLessThanOrEqual(1); // columna alineada

    const continueBox = await box(page, 'continue-shopping');
    const checkoutBox = await box(page, 'checkout');
    expect(continueBox.x).toBeLessThan(checkoutBox.x);
    await evidence(page, 'carrito');
  });

  test('VIS-11 Carrito vacío: cabeceras y botones visibles, sin badge', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();

    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
    await expect(page.getByTestId('cart-quantity-label')).toBeVisible();
    await expect(page.getByTestId('continue-shopping')).toBeVisible();
    await expect(page.getByTestId('checkout')).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });

  test('VIS-12 Checkout paso 1: formulario alineado', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);

    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
    const first = await box(page, 'firstName');
    const last = await box(page, 'lastName');
    const zip = await box(page, 'postalCode');
    for (const b of [last, zip]) {
      expect(Math.abs(b.x - first.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(b.width - first.width)).toBeLessThanOrEqual(1);
    }
    expect(first.y).toBeLessThan(last.y);
    expect(last.y).toBeLessThan(zip.y);

    const cancel = await box(page, 'cancel');
    const next = await box(page, 'continue');
    expect(cancel.x).toBeLessThan(next.x);
    await evidence(page, 'checkout-paso-1');
  });

  test('VIS-13 Checkout paso 1: estado de error', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);

    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.locator('.error-button')).toBeVisible();
    await expect(page.getByTestId('firstName')).toHaveClass(/error/);
    const clipped = await page.getByTestId('error').evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(clipped).toBe(false);
  });

  test('VIS-14 Checkout paso 2: resumen con pago, envío y totales', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight);
    await goToCheckoutStepOne(page);
    await fillCheckoutInfo(page);

    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
    await expect(page.getByTestId('payment-info-value')).toHaveText('SauceCard #31337');
    await expect(page.getByTestId('shipping-info-value')).toHaveText('Free Pony Express Delivery!');
    for (const id of ['subtotal-label', 'tax-label', 'total-label']) {
      await expect(page.getByTestId(id)).toHaveText(/\$\d+\.\d{2}$/);
    }
    const subtotal = await box(page, 'subtotal-label');
    const tax = await box(page, 'tax-label');
    const total = await box(page, 'total-label');
    expect(subtotal.y).toBeLessThan(tax.y);
    expect(tax.y).toBeLessThan(total.y);
    await expect(page.getByTestId('cancel')).toBeVisible();
    await expect(page.getByTestId('finish')).toBeVisible();
    await evidence(page, 'checkout-paso-2');
  });

  test('VIS-15 Checkout paso 3: confirmación centrada', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);
    await fillCheckoutInfo(page);
    await page.getByTestId('finish').click();

    await expect(page.locator('.pony_express')).toBeVisible();
    const loaded = await page.locator('.pony_express').evaluate((el) => (el as HTMLImageElement).naturalWidth > 0);
    expect(loaded).toBe(true);
    await expect(page.getByTestId('complete-header')).toBeVisible();
    await expect(page.getByTestId('complete-text')).toBeVisible();
    const header = await box(page, 'complete-header');
    const pony = await boxOf(page, '.pony_express');
    const back = await box(page, 'back-to-products');
    expect(Math.abs(header.x + header.width / 2 - 1920 / 2)).toBeLessThan(20);
    expect(Math.abs(pony.x + pony.width / 2 - 1920 / 2)).toBeLessThan(20);
    // El wireframe asume el botón centrado; se registra su desplazamiento real como observación
    const offset = Math.round(back.x + back.width / 2 - 1920 / 2);
    test.info().annotations.push({ type: 'observación', description: `Back Home desplazado ${offset} px del centro` });
    expect(back.x).toBeGreaterThanOrEqual(0);
    expect(back.x + back.width).toBeLessThanOrEqual(1920);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    await evidence(page, 'checkout-completo');
  });

  test('VIS-16 Menú lateral: panel con sus opciones legibles', async ({ page }) => {
    await openMenu(page);

    for (const id of ['inventory-sidebar-link', 'about-sidebar-link', 'logout-sidebar-link', 'reset-sidebar-link']) {
      const link = page.getByTestId(id);
      await expect(link).toBeVisible();
      const b = (await link.boundingBox())!;
      expect(b.x).toBeLessThan(400); // panel pegado al borde izquierdo
      const fontSize = await link.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThanOrEqual(14); // legible
    }
    await expect(page.locator('#react-burger-cross-btn')).toBeVisible();
    await evidence(page, 'menu');
  });

  test('VIS-17 Encabezado y pie consistentes en todas las vistas', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    const views = [
      async () => {},
      async () => page.getByTestId('shopping-cart-link').click(),
      async () => page.getByTestId('checkout').click(),
    ];
    const headers: Box[] = [];
    for (const go of views) {
      await go();
      await expect(page.getByTestId('title')).toBeVisible(); // la vista terminó de cargar
      headers.push(await box(page, 'primary-header'));

      await expect(page.getByTestId('social-x')).toBeVisible();
      await expect(page.getByTestId('social-facebook')).toBeVisible();
      await expect(page.getByTestId('social-linkedin')).toBeVisible();
      await expect(page.getByTestId('footer-copy')).toContainText('Sauce Labs');
      const footer = await box(page, 'footer');
      expect(footer.y + footer.height).toBeGreaterThanOrEqual(1080 - 2); // pegado al fondo
    }
    for (const h of headers) {
      expect(h.height).toBe(headers[0].height);
      expect(h.width).toBe(headers[0].width);
    }
  });

  test('VIS-18 Consistencia de estilo: misma tipografía y estilo de título entre vistas', async ({ page }) => {
    const styles: { font: string; titleSize: string; titleColor: string }[] = [];
    await addToCart(page, PRODUCT.backpack);
    for (const go of [
      async () => {},
      async () => page.getByTestId('shopping-cart-link').click(),
      async () => page.getByTestId('checkout').click(),
    ]) {
      await go();
      styles.push(
        await page.evaluate(() => {
          const title = document.querySelector('[data-test="title"]')!;
          const cs = getComputedStyle(title);
          return {
            font: getComputedStyle(document.body).fontFamily,
            titleSize: cs.fontSize,
            titleColor: cs.color,
          };
        }),
      );
    }
    for (const s of styles) {
      expect(s).toEqual(styles[0]);
    }
  });

  test('VIS-24 Imágenes y recursos sin errores', async ({ page }) => {
    const failed: string[] = [];
    const consoleErrors: string[] = [];
    page.on('response', (response) => {
      // Las direcciones directas (/inventory.html) las sirve la página 404 de GitHub Pages: no cuentan como error
      const isPage = response.request().resourceType() === 'document';
      if (!isPage && response.url().startsWith('https://www.saucedemo.com') && response.status() >= 400) {
        failed.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on('console', (msg) => {
      // El 404 de las direcciones directas (/xxx.html) también llega a la consola: no es un error de la aplicación
      const url = msg.location().url;
      if (msg.type() === 'error' && url.startsWith('https://www.saucedemo.com') && !url.endsWith('.html')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await addToCart(page, PRODUCT.backpack);
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.waitForLoadState('networkidle');

    const brokenImages = await page.evaluate(() =>
      [...document.images].filter((img) => !(img.complete && img.naturalWidth > 0)).map((img) => img.src),
    );
    expect(brokenImages, 'imágenes rotas').toEqual([]);
    expect(failed, 'recursos propios con error').toEqual([]);
    expect(consoleErrors, 'errores de consola propios').toEqual([]);
  });
});

// VIS-19 a VIS-22: sin desbordes en cada resolución, recorriendo todas las vistas
const RESOLUTIONS = [
  { id: 'VIS-19', name: 'Escritorio 1920x1080', width: 1920, height: 1080 },
  { id: 'VIS-20', name: 'Laptop 1366x768', width: 1366, height: 768 },
  { id: 'VIS-21', name: 'Tablet 768x1024', width: 768, height: 1024 },
  { id: 'VIS-22', name: 'Móvil 375x812', width: 375, height: 812 },
] as const;

test.describe('Visual – resoluciones', () => {
  for (const res of RESOLUTIONS) {
    test(`${res.id} ${res.name}: todas las vistas sin desbordes`, async ({ page, browser }) => {
      await page.setViewportSize({ width: res.width, height: res.height });

      // Login (sin sesión) en un contexto aparte
      const anonymous = await browser.newContext({ viewport: { width: res.width, height: res.height } });
      const loginPage = await anonymous.newPage();
      await loginPage.goto('/');
      await expectNoHorizontalOverflow(loginPage, 'login');
      await anonymous.close();

      await page.goto('/inventory.html');
      await expectNoHorizontalOverflow(page, 'inventario');
      await evidence(page, `inventario-${res.width}`);

      await page.getByTestId('inventory-item-name').first().click();
      await expectNoHorizontalOverflow(page, 'detalle');
      await page.getByTestId('back-to-products').click();

      await addToCart(page, PRODUCT.backpack);
      await page.getByTestId('shopping-cart-link').click();
      await expectNoHorizontalOverflow(page, 'carrito');

      await page.getByTestId('checkout').click();
      await expectNoHorizontalOverflow(page, 'checkout paso 1');
      await fillCheckoutInfo(page, CHECKOUT_INFO);
      await expectNoHorizontalOverflow(page, 'checkout paso 2');

      await page.getByTestId('finish').click();
      await expectNoHorizontalOverflow(page, 'checkout completo');
    });
  }

  test('VIS-23 Zoom al 200 %: la compra sigue siendo operable', async ({ page }) => {
    // Un zoom del 200 % en una pantalla de 1920x1080 equivale a un viewport de 960x540
    await page.setViewportSize({ width: 960, height: 540 });
    await page.goto('/inventory.html');
    await expectNoHorizontalOverflow(page, 'inventario a 200 %');

    await addToCart(page, PRODUCT.backpack);
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await fillCheckoutInfo(page);
    await page.getByTestId('finish').click();

    await expect(page.getByTestId('complete-header')).toBeVisible();
  });
});

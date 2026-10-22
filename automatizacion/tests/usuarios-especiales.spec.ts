import { test, expect } from '@playwright/test';
import { CHECKOUT_INFO, MSG, USERS } from '../support/data';
import { goToCheckoutStepOne, listPrices, login } from '../support/helpers';

// Los usuarios problem_user, performance_glitch_user, error_user y visual_user fallan a propósito.
// Cada test escribe el comportamiento CORRECTO (el del documento funcional) y se marca con test.fail():
// el defecto queda registrado como "fallo esperado" y, si el sitio lo corrige un día, el test avisa.
const INTENTIONAL = 'Defecto intencional del usuario de prueba';

test.describe('Usuarios especiales – defectos intencionales', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('USR-01 problem_user: cada producto debería mostrar su propia imagen', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: las 6 imágenes del listado son la misma`);
    await login(page, USERS.problem);

    const sources = await page.locator('.inventory_item img').evaluateAll((imgs) =>
      imgs.map((img) => img.getAttribute('src')),
    );
    expect(sources).toHaveLength(6);
    expect(new Set(sources).size).toBe(6);
  });

  test('USR-02 problem_user: todos los botones deberían agregar al carrito', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: solo algunos botones "Add to cart" responden`);
    await login(page, USERS.problem);

    const buttons = page.locator('.inventory_item button');
    for (let i = 0; i < 6; i++) {
      await buttons.nth(i).click();
    }

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('6');
  });

  test('USR-03 problem_user: el orden por precio debería funcionar', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: el selector de orden por precio no ordena`);
    await login(page, USERS.problem);

    await page.getByTestId('product-sort-container').selectOption('lohi');

    const prices = await listPrices(page);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('USR-04 problem_user: los datos del checkout deberían quedar en su campo', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: el apellido se escribe en el campo del nombre`);
    await login(page, USERS.problem);
    await page.locator('.inventory_item button').first().click();
    await goToCheckoutStepOne(page);

    await page.getByTestId('firstName').fill(CHECKOUT_INFO.firstName);
    await page.getByTestId('lastName').fill(CHECKOUT_INFO.lastName);
    await page.getByTestId('postalCode').fill(CHECKOUT_INFO.postalCode);

    await expect(page.getByTestId('firstName')).toHaveValue(CHECKOUT_INFO.firstName);
    await expect(page.getByTestId('lastName')).toHaveValue(CHECKOUT_INFO.lastName);
  });

  // Duda 11.4: el documento no define un tiempo máximo. Se usa 3 s como umbral razonable de prueba
  // (el usuario estándar tarda alrededor de 1 s; este usuario, 5 s o más).
  test('USR-05 performance_glitch_user: el login debería cargar en menos de 3 segundos', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: demora varios segundos en cargar el inventario`);

    const start = Date.now();
    await login(page, USERS.performanceGlitch);
    await expect(page.getByTestId('inventory-container')).toBeVisible({ timeout: 15_000 });
    const elapsed = Date.now() - start;

    test.info().annotations.push({ type: 'tiempo de carga', description: `${elapsed} ms` });
    expect(elapsed).toBeLessThan(3000);
  });

  test('USR-06 error_user: debería poder completar una compra', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: el botón Finish no completa la compra`);
    await login(page, USERS.error);
    await page.locator('.inventory_item button').first().click();
    await goToCheckoutStepOne(page);
    await page.getByTestId('firstName').fill(CHECKOUT_INFO.firstName);
    await page.getByTestId('lastName').fill(CHECKOUT_INFO.lastName);
    await page.getByTestId('postalCode').fill(CHECKOUT_INFO.postalCode);
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);

    await page.getByTestId('finish').click();

    await expect(page.getByTestId('complete-header')).toHaveText(MSG.orderComplete);
  });

  test('USR-07a visual_user: los precios deberían coincidir con los del usuario estándar', async ({ page, browser }) => {
    test.fail(true, `${INTENTIONAL}: los precios cambian respecto al usuario estándar`);

    const standardContext = await browser.newContext();
    const standardPage = await standardContext.newPage();
    await login(standardPage, USERS.standard);
    const standardPrices = await listPrices(standardPage);
    await standardContext.close();

    await login(page, USERS.visual);
    expect(await listPrices(page)).toEqual(standardPrices);
  });

  test('USR-07b visual_user: el ícono del carrito debería estar en la misma posición', async ({ page, browser }) => {
    test.fail(true, `${INTENTIONAL}: el ícono del carrito está desplazado`);

    const standardContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const standardPage = await standardContext.newPage();
    await login(standardPage, USERS.standard);
    const standardBox = await standardPage.getByTestId('shopping-cart-link').boundingBox();
    await standardContext.close();

    await page.setViewportSize({ width: 1280, height: 800 });
    await login(page, USERS.visual);
    const visualBox = await page.getByTestId('shopping-cart-link').boundingBox();

    expect(Math.round(visualBox!.x)).toBe(Math.round(standardBox!.x));
    expect(Math.round(visualBox!.y)).toBe(Math.round(standardBox!.y));
  });

  test('USR-02b error_user: todos los botones deberían agregar al carrito', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: solo algunos botones "Add to cart" responden`);
    await login(page, USERS.error);

    const buttons = page.locator('.inventory_item button');
    for (let i = 0; i < 6; i++) {
      await buttons.nth(i).click();
    }

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('6');
  });

  test('USR-02c error_user: debería poder quitar desde el listado un producto agregado', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: el botón "Remove" del listado no quita el producto (solo se puede quitar desde el carrito)`);
    await login(page, USERS.error);

    await page.locator('.inventory_item button').first().click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await page.locator('.inventory_item button').first().click();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });

  test('USR-03b error_user: ordenar no debería mostrar un aviso de error', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: al ordenar aparece "Sorting is broken! This error has been reported to Backtrace."`);
    const dialogs: string[] = [];
    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });
    await login(page, USERS.error);

    await page.getByTestId('product-sort-container').selectOption('za');
    await page.waitForTimeout(500);

    test.info().annotations.push({ type: 'aviso mostrado', description: dialogs.join(' | ') || 'ninguno' });
    expect(dialogs).toEqual([]);
  });

  // Duda 11.4: sin umbral definido; se usa 3 s (el usuario estándar ordena en menos de 100 ms).
  test('USR-05b performance_glitch_user: ordenar debería tardar menos de 3 segundos', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: ordenar por precio tarda unos 5 s`);
    await login(page, USERS.performanceGlitch);
    await expect(page.getByTestId('inventory-container')).toBeVisible({ timeout: 15_000 });

    const start = Date.now();
    await page.getByTestId('product-sort-container').selectOption('lohi');
    await page.waitForFunction(
      () => document.querySelector('[data-test="inventory-item-price"]')?.textContent === '$7.99',
      null,
      { timeout: 20_000 },
    );
    const elapsed = Date.now() - start;

    test.info().annotations.push({ type: 'tiempo de orden', description: `${elapsed} ms` });
    expect(elapsed).toBeLessThan(3000);
  });

  test('USR-07c visual_user: la imagen del primer producto debería ser la del usuario estándar', async ({ page, browser }) => {
    test.fail(true, `${INTENTIONAL}: el primer producto muestra otra imagen`);

    const standardContext = await browser.newContext();
    const standardPage = await standardContext.newPage();
    await login(standardPage, USERS.standard);
    const standardSrc = await standardPage.locator('.inventory_item img').first().getAttribute('src');
    await standardContext.close();

    await login(page, USERS.visual);
    await expect(page.locator('.inventory_item img').first()).toHaveAttribute('src', standardSrc!);
  });

  test('USR-07d visual_user: el botón Checkout del carrito debería estar en la misma posición', async ({ page, browser }) => {
    test.fail(true, `${INTENTIONAL}: el botón Checkout del carrito aparece desplazado a la esquina superior derecha`);

    const standardContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const standardPage = await standardContext.newPage();
    await login(standardPage, USERS.standard);
    await standardPage.getByTestId('shopping-cart-link').click();
    const standardBox = await standardPage.getByTestId('checkout').boundingBox();
    await standardContext.close();

    await page.setViewportSize({ width: 1280, height: 800 });
    await login(page, USERS.visual);
    await page.getByTestId('shopping-cart-link').click();
    const visualBox = await page.getByTestId('checkout').boundingBox();

    expect(Math.round(visualBox!.x)).toBe(Math.round(standardBox!.x));
    expect(Math.round(visualBox!.y)).toBe(Math.round(standardBox!.y));
  });

  // Hallazgo manual confirmado: el ícono del menú de visual_user está inclinado (rotación de 3 grados y 1 px más grande).
  test('USR-07e visual_user: el ícono del menú no debería estar inclinado', async ({ page }) => {
    test.fail(true, `${INTENTIONAL}: el ícono del menú está rotado unos 3 grados y es 1 px más grande`);
    await login(page, USERS.visual);

    const transform = await page.locator('.bm-burger-button img').evaluate((el) => getComputedStyle(el).transform);

    test.info().annotations.push({ type: 'transformación del ícono', description: transform });
    expect(transform).toBe('none');
  });
});

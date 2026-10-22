import { test, expect } from '@playwright/test';
import { MSG, PRODUCT } from '../support/data';
import {
  addToCart,
  fillCheckoutInfo,
  goToCheckoutStepOne,
  parseMoney,
} from '../support/helpers';

test.describe('Checkout – regresión', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('CHK-03 apellido vacío muestra el error de Last Name', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);

    await page.getByTestId('firstName').fill('Ana');
    await page.getByTestId('postalCode').fill('1000');
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toHaveText(MSG.lastNameRequired);
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('CHK-04 código postal vacío muestra el error de Postal Code', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);

    await page.getByTestId('firstName').fill('Ana');
    await page.getByTestId('lastName').fill('Pérez');
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toHaveText(MSG.postalCodeRequired);
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('CHK-05 todos los campos vacíos muestran el error de First Name', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);

    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toHaveText(MSG.firstNameRequired);
  });

  test('CHK-06 "Cancel" en el paso 1 vuelve al carrito', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);

    await page.getByTestId('cancel').click();

    await expect(page).toHaveURL(/\/cart\.html$/);
  });

  test('CHK-07 "Cancel" en el resumen vuelve al listado', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);
    await fillCheckoutInfo(page);

    await page.getByTestId('cancel').click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('CHK-10 el resumen muestra los mismos productos y precios que el carrito', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight);
    await page.getByTestId('shopping-cart-link').click();
    const cartNames = await page.getByTestId('inventory-item-name').allTextContents();
    const cartPrices = (await page.getByTestId('inventory-item-price').allTextContents()).map(parseMoney);

    await page.getByTestId('checkout').click();
    await fillCheckoutInfo(page);

    expect(await page.getByTestId('inventory-item-name').allTextContents()).toEqual(cartNames);
    expect(
      (await page.getByTestId('inventory-item-price').allTextContents()).map(parseMoney),
    ).toEqual(cartPrices);
  });

  test('CHK-11 "Back Home" vuelve al listado con el carrito en 0', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);
    await fillCheckoutInfo(page);
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);

    await page.getByTestId('back-to-products').click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });

  // Duda 11.1 del documento funcional: el comportamiento con carrito vacío no está definido.
  // Se escribe la expectativa razonable (no debería poder comprarse sin productos) y se marca como
  // fallo esperado: si el sitio deja avanzar, queda registrado como posible defecto sin romper la ejecución.
  test('CHK-12 con el carrito vacío no debería avanzar al checkout', async ({ page }) => {
    test.fail(true, 'Posible defecto conocido (duda 11.1): SauceDemo permite iniciar el checkout sin productos');

    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();

    await expect(page).not.toHaveURL(/\/checkout-step-one\.html$/);
  });
});

import { test, expect } from '@playwright/test';
import { MSG, PRODUCT, TAX_RATE } from '../support/data';
import {
  addToCart,
  fillCheckoutInfo,
  goToCheckoutStepOne,
  parseMoney,
  round2,
} from '../support/helpers';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('CHK-01 compra completa (camino feliz)', { tag: '@smoke' }, async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);
    await fillCheckoutInfo(page);

    await page.getByTestId('finish').click();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByTestId('complete-header')).toHaveText(MSG.orderComplete);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });

  test('CHK-02 nombre vacío muestra el error de First Name', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await goToCheckoutStepOne(page);

    await page.getByTestId('lastName').fill('Pérez');
    await page.getByTestId('postalCode').fill('1000');
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toHaveText(MSG.firstNameRequired);
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('CHK-08 el subtotal es la suma de los precios de los productos', async ({ page }) => {
    const products = [PRODUCT.backpack, PRODUCT.bikeLight, PRODUCT.boltTShirt];

    // Los precios se leen de la pantalla del listado, no se escriben a mano
    const prices: number[] = [];
    for (const product of products) {
      const card = page
        .getByTestId('inventory-item')
        .filter({ has: page.getByTestId(`add-to-cart-${product}`) });
      prices.push(parseMoney(await card.getByTestId('inventory-item-price').innerText()));
    }
    const expectedSubtotal = round2(prices.reduce((sum, p) => sum + p, 0));

    await addToCart(page, ...products);
    await goToCheckoutStepOne(page);
    await fillCheckoutInfo(page);

    const subtotal = parseMoney(await page.getByTestId('subtotal-label').innerText());
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
  });

  test('CHK-09 el impuesto es el 8 % del subtotal y el total los suma', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight, PRODUCT.boltTShirt);
    await goToCheckoutStepOne(page);
    await fillCheckoutInfo(page);

    const subtotal = parseMoney(await page.getByTestId('subtotal-label').innerText());
    const tax = parseMoney(await page.getByTestId('tax-label').innerText());
    const total = parseMoney(await page.getByTestId('total-label').innerText());

    expect(tax).toBeCloseTo(round2(subtotal * TAX_RATE), 2);
    expect(total).toBeCloseTo(round2(subtotal + tax), 2);
  });
});

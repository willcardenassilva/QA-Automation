import { test, expect } from '@playwright/test';
import { PRODUCT } from '../support/data';
import { addToCart, parseMoney } from '../support/helpers';

test.describe('Carrito – regresión', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('CAR-02 agregar varios productos suma el contador', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight, PRODUCT.boltTShirt);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');
  });

  test('CAR-03 quitar desde el listado vuelve el botón y baja el contador', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    await page.getByTestId(`remove-${PRODUCT.backpack}`).click();

    await expect(page.getByTestId(`add-to-cart-${PRODUCT.backpack}`)).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId(`remove-${PRODUCT.bikeLight}`).click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });

  test('CAR-04 el carrito muestra cantidad, nombre y precio de cada producto', async ({ page }) => {
    const prices: Record<string, string> = {};
    for (const product of [PRODUCT.backpack, PRODUCT.bikeLight]) {
      const card = page
        .getByTestId('inventory-item')
        .filter({ has: page.getByTestId(`add-to-cart-${product}`) });
      prices[product] = await card.getByTestId('inventory-item-price').innerText();
    }
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight);

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);

    const rows = page.getByTestId('inventory-item');
    await expect(rows).toHaveCount(2);
    for (const row of await rows.all()) {
      await expect(row.getByTestId('item-quantity')).toHaveText('1');
      await expect(row.getByTestId('inventory-item-name')).not.toBeEmpty();
      await expect(row.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
    }
    const cartPrices = (await page.getByTestId('inventory-item-price').allTextContents()).map(parseMoney);
    expect(cartPrices.sort()).toEqual(Object.values(prices).map(parseMoney).sort());
  });

  test('CAR-06 el carrito vacío no lista productos y permite seguir comprando', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);

    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('CAR-07 "Continue Shopping" conserva los productos del carrito', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);
    await page.getByTestId('shopping-cart-link').click();

    await page.getByTestId('continue-shopping').click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await expect(page.getByTestId(`remove-${PRODUCT.backpack}`)).toBeVisible();
  });

  test('CAR-08 el carrito se conserva al ir al detalle y volver', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);

    await page.getByTestId('inventory-item-name').first().click();
    await page.getByTestId('back-to-products').click();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await expect(page.getByTestId(`remove-${PRODUCT.backpack}`)).toBeVisible();
  });

  test('CAR-09 agregar desde el detalle sube el contador', async ({ page }) => {
    await page.getByTestId('inventory-item-name').first().click();
    await expect(page).toHaveURL(/\/inventory-item\.html/);

    await page.getByTestId('add-to-cart').click();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await expect(page.getByTestId('remove')).toBeVisible();
  });
});

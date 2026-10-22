import { test, expect } from '@playwright/test';
import { PRODUCT } from '../support/data';
import { addToCart } from '../support/helpers';

test.describe('Carrito', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('CAR-01 agregar un producto cambia el botón y sube el contador', { tag: '@smoke' }, async ({ page }) => {
    await addToCart(page, PRODUCT.backpack);

    await expect(page.getByTestId(`remove-${PRODUCT.backpack}`)).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('CAR-05 quitar un producto desde el carrito lo elimina y baja el contador', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(2);

    await page.getByTestId(`remove-${PRODUCT.backpack}`).click();

    await expect(page.getByTestId('inventory-item')).toHaveCount(1);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });
});

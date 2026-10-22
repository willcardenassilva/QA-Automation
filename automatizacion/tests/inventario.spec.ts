import { test, expect } from '@playwright/test';
import { parseMoney } from '../support/helpers';

test.describe('Inventario – listado de productos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('PRO-01 se listan los 6 productos con todos sus datos', async ({ page }) => {
    const items = page.getByTestId('inventory-item');
    await expect(items).toHaveCount(6);

    for (const item of await items.all()) {
      await expect(item.getByTestId('inventory-item-name')).not.toBeEmpty();
      await expect(item.getByTestId('inventory-item-desc')).not.toBeEmpty();
      await expect(item.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
      await expect(item.locator('img')).toBeVisible();
      // Los enlaces de imagen y título también tienen role="button"; el botón del producto es un <button>
      await expect(item.locator('button')).toHaveText('Add to cart');
    }
  });

  test('PRO-04 orden por precio de menor a mayor', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('lohi');

    const texts = await page.getByTestId('inventory-item-price').allTextContents();
    const prices = texts.map(parseMoney);
    expect(prices).toHaveLength(6);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});

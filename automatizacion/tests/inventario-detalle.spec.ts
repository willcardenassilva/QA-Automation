import { test, expect } from '@playwright/test';
import { listNames, listPrices } from '../support/helpers';

test.describe('Inventario – orden y detalle de producto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('PRO-02 orden por nombre de A a Z', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('az');
    const names = await listNames(page);
    expect(names).toHaveLength(6);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('PRO-03 orden por nombre de Z a A', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('za');
    const names = await listNames(page);
    expect(names).toHaveLength(6);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('PRO-05 orden por precio de mayor a menor', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('hilo');
    const prices = await listPrices(page);
    expect(prices).toHaveLength(6);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('PRO-06 el detalle por nombre muestra los datos del producto', async ({ page }) => {
    const firstItem = page.getByTestId('inventory-item').first();
    const name = await firstItem.getByTestId('inventory-item-name').innerText();
    const desc = await firstItem.getByTestId('inventory-item-desc').innerText();
    const price = await firstItem.getByTestId('inventory-item-price').innerText();

    await firstItem.getByTestId('inventory-item-name').click();

    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(name);
    await expect(page.getByTestId('inventory-item-desc')).toHaveText(desc);
    await expect(page.getByTestId('inventory-item-price')).toHaveText(price);
    await expect(page.locator('.inventory_details_img')).toBeVisible();
  });

  test('PRO-07 el detalle por imagen abre el mismo producto', async ({ page }) => {
    const firstItem = page.getByTestId('inventory-item').first();
    const name = await firstItem.getByTestId('inventory-item-name').innerText();

    await firstItem.locator('img').click();

    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(name);
  });

  test('PRO-08 "Back to products" regresa al listado', async ({ page }) => {
    await page.getByTestId('inventory-item-name').first().click();
    await expect(page).toHaveURL(/\/inventory-item\.html/);

    await page.getByTestId('back-to-products').click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });
});

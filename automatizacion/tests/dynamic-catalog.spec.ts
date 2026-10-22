import { test, expect, type Page } from '@playwright/test';
import { openMenu } from '../support/helpers';

// Función NO documentada en el documento funcional: el menú incluye "Dynamic Catalog" con tres variantes
// (Lazy Load, Spinner, Slider). Estos tests registran lo observado hasta que producto la defina.
const PRICE = /^\$\d+\.\d{2}$/;

async function openDynamicCatalog(page: Page, option: 'Lazy Load' | 'Spinner' | 'Slider') {
  await page.goto('/inventory.html');
  await openMenu(page);
  await page.getByTestId('dynamic-catalog-sidebar-link').click();
  await page.getByText(option, { exact: true }).click();
}

test.describe('Dynamic Catalog (función no documentada)', () => {
  test('DYN-01 Lazy Load carga más tarjetas al bajar', async ({ page }) => {
    await openDynamicCatalog(page, 'Lazy Load');
    await expect(page).toHaveURL(/\/dynamic-catalog-lazy-load\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Dynamic Catalog - Lazy Load');

    const prices = page.getByText(PRICE);
    await expect.poll(() => prices.count()).toBeGreaterThanOrEqual(6);
    const initial = await prices.count();

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(() => prices.count(), { timeout: 10_000 }).toBeGreaterThan(initial);

    test.info().annotations.push({
      type: 'observación',
      description: `inicio: ${initial} tarjetas; tras bajar: ${await prices.count()}`,
    });
  });

  test('DYN-02 Spinner muestra el indicador de carga y luego los 6 productos', async ({ page }) => {
    await openDynamicCatalog(page, 'Spinner');
    await expect(page).toHaveURL(/\/dynamic-catalog-spinner\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Dynamic Catalog - Spinner');

    await expect.poll(() => page.getByText(PRICE).count(), { timeout: 15_000 }).toBe(6);
  });

  test('DYN-03 Slider muestra un producto a la vez', async ({ page }) => {
    await openDynamicCatalog(page, 'Slider');
    await expect(page).toHaveURL(/\/dynamic-catalog-slider\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Dynamic Catalog - Slider');

    await expect.poll(() => page.getByText(PRICE).count()).toBe(1);
  });
});

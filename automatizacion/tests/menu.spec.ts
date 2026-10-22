import { test, expect } from '@playwright/test';
import { PRODUCT } from '../support/data';
import { addToCart, openMenu } from '../support/helpers';

test.describe('Menú lateral', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('MEN-01 el menú se abre con 4 opciones y se cierra con la X', async ({ page }) => {
    await openMenu(page);

    await expect(page.getByTestId('inventory-sidebar-link')).toBeVisible();
    await expect(page.getByTestId('about-sidebar-link')).toBeVisible();
    await expect(page.getByTestId('logout-sidebar-link')).toBeVisible();
    await expect(page.getByTestId('reset-sidebar-link')).toBeVisible();

    await page.locator('#react-burger-cross-btn').click();
    await expect(page.getByTestId('logout-sidebar-link')).toBeHidden();
  });

  // RF-MEN-01 (documento 1.1): cinco opciones. La quinta, "Dynamic Catalog", se agregó al documento tras la ejecución.
  test('MEN-01b el menú tiene exactamente las 5 opciones del documento', async ({ page }) => {
    await openMenu(page);

    await expect(page.locator('.bm-item-list a')).toHaveText([
      'All Items',
      'Dynamic Catalog',
      'About',
      'Logout',
      'Reset App State',
    ]);
  });

  test('MEN-02 "All Items" desde el detalle vuelve al listado', async ({ page }) => {
    await page.getByTestId('inventory-item-name').first().click();
    await expect(page).toHaveURL(/\/inventory-item\.html/);

    await openMenu(page);
    await page.getByTestId('inventory-sidebar-link').click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('MEN-03 "About" apunta al sitio de Sauce Labs', async ({ page }) => {
    await openMenu(page);
    // Se verifica el destino del enlace sin navegar a un sitio externo
    await expect(page.getByTestId('about-sidebar-link')).toHaveAttribute('href', /saucelabs\.com/);
  });

  test('MEN-04 "Reset App State" vacía el carrito (los botones se restauran al recargar)', async ({ page }) => {
    await addToCart(page, PRODUCT.backpack, PRODUCT.bikeLight);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    await openMenu(page);
    await page.getByTestId('reset-sidebar-link').click();
    await page.locator('#react-burger-cross-btn').click();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);

    await page.reload();
    await expect(page.getByTestId(`add-to-cart-${PRODUCT.backpack}`)).toBeVisible();
    await expect(page.getByTestId(`add-to-cart-${PRODUCT.bikeLight}`)).toBeVisible();
  });

  // RF-MEN-05: tras el reset, los botones deben volver a "Add to cart" sin recargar.
  // Hallazgo: el contador se vacía pero los botones siguen en "Remove" hasta recargar la página.
  // Se marca como fallo esperado para dejarlo registrado; si el sitio lo corrige, este test avisará.
  test('MEN-04b tras el reset los botones vuelven a "Add to cart" sin recargar', async ({ page }) => {
    test.fail(true, 'Defecto observado: Reset App State no actualiza los botones del listado hasta recargar');

    await addToCart(page, PRODUCT.backpack);
    await openMenu(page);
    await page.getByTestId('reset-sidebar-link').click();
    await page.locator('#react-burger-cross-btn').click();

    await expect(page.getByTestId(`add-to-cart-${PRODUCT.backpack}`)).toBeVisible();
  });
});

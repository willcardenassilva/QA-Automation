import { test, expect, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { CHECKOUT_INFO, MSG, USERS } from '../support/data';
import { goToCheckoutStepOne, login, parseMoney } from '../support/helpers';

// Matriz "todos los usuarios × las mismas verificaciones".
// Cada usuario pasa por las mismas comprobaciones y se compara contra el usuario estándar. El test de cada usuario
// declara qué verificaciones DEBEN fallar (defectos intencionales conocidos): si aparece un fallo nuevo, o un defecto
// deja de ocurrir, el test falla y avisa. La tabla completa se adjunta al informe.

const VIEWPORT = { width: 1280, height: 800 };
const THRESHOLD_MS = 3000; // duda 11.4: umbral de prueba, el documento no define un tiempo máximo

const CHECKS = {
  C01: 'Inicia sesión y abre el inventario',
  C02: 'Lista los 6 productos',
  C03: 'Cada producto muestra una imagen distinta',
  C04: 'Los precios coinciden con los del usuario estándar',
  C05: 'Ordenar Z–A funciona',
  C06: 'Ordenar por precio (menor a mayor) funciona',
  C07: 'Se pueden agregar los 6 productos (contador en 6)',
  C08: 'Se puede quitar un producto desde el listado',
  C09: 'El formulario del checkout conserva lo escrito en cada campo',
  C10: 'Se completa la compra',
  C11: 'El login carga en menos de 3 s',
  C12: 'Ordenar tarda menos de 3 s',
  C13: 'El ícono del carrito está donde el del estándar',
  C14: 'El botón Checkout del carrito está donde el del estándar',
  C15: 'El ícono del menú no está rotado',
  C16: 'La imagen del primer producto es la del estándar',
} as const;
type CheckId = keyof typeof CHECKS;

// Fallos esperados por usuario (defectos intencionales observados el 2026-10-22)
const EXPECTED_FAILURES: Record<string, CheckId[]> = {
  standard_user: [],
  // C12 no aplica cuando el orden no funciona (C05/C06): no se puede medir cuánto tarda algo que no ocurre.
  // problem_user: todas sus imágenes son una sola, por eso también falla C16.
  problem_user: ['C03', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C16'],
  performance_glitch_user: ['C11', 'C12'],
  error_user: ['C05', 'C06', 'C07', 'C08', 'C09', 'C10'],
  // visual_user: los precios mostrados son aleatorios y cambian en cada render, por eso al ordenar quedan desordenados (C06).
  visual_user: ['C04', 'C06', 'C13', 'C14', 'C15', 'C16'],
};

type Baseline = {
  prices: number[];
  firstImage: string | null;
  cart: { x: number; y: number };
  checkoutButton: { x: number; y: number };
};
let baseline: Baseline;

async function openSession(browser: Browser, username: string) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  const start = Date.now();
  await login(page, username);
  await expect(page.getByTestId('inventory-container')).toBeVisible({ timeout: 20_000 });
  return { context, page, loginMs: Date.now() - start };
}

async function prices(page: Page): Promise<number[]> {
  return (await page.getByTestId('inventory-item-price').allTextContents()).map(parseMoney);
}

async function position(page: Page, testId: string) {
  const box = await page.getByTestId(testId).first().boundingBox();
  if (!box) throw new Error(`No se pudo medir "${testId}"`);
  return { x: Math.round(box.x), y: Math.round(box.y) };
}

async function cartPageCheckoutPosition(page: Page) {
  await page.getByTestId('shopping-cart-link').click();
  await expect(page.getByTestId('checkout')).toBeVisible();
  return position(page, 'checkout');
}

test.describe('Matriz de todos los usuarios', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeAll(async ({ browser }) => {
    const { context, page } = await openSession(browser, USERS.standard);
    baseline = {
      prices: await prices(page),
      firstImage: await page.locator('.inventory_item img').first().getAttribute('src'),
      cart: await position(page, 'shopping-cart-link'),
      checkoutButton: await cartPageCheckoutPosition(page),
    };
    await context.close();
  });

  test('MAT-locked_out_user no puede iniciar sesión (comportamiento esperado)', async ({ page }) => {
    await login(page, USERS.lockedOut);
    await expect(page.getByTestId('error')).toHaveText(MSG.lockedOut);
    await expect(page.getByTestId('inventory-container')).toHaveCount(0);
  });

  for (const username of Object.keys(EXPECTED_FAILURES)) {
    test(`MAT-${username} cumple las verificaciones esperadas`, async ({ browser }) => {
      test.setTimeout(180_000);
      const failed = new Set<CheckId>();
      const notApplicable = new Set<CheckId>();
      const detail: Record<string, string> = {};

      const check = async (id: CheckId, run: () => Promise<void>) => {
        try {
          await run();
        } catch (error) {
          failed.add(id);
          detail[id] = String(error instanceof Error ? error.message : error).split('\n')[0].slice(0, 160);
        }
      };

      // Sesión de solo lectura: login, listado, precios, imágenes, orden y posiciones
      let session: { context: BrowserContext; page: Page; loginMs: number } | undefined;
      await check('C01', async () => {
        session = await openSession(browser, username);
      });
      if (session) {
        const { page, loginMs } = session;
        await check('C11', async () => expect(loginMs).toBeLessThan(THRESHOLD_MS));
        await check('C02', async () => expect(page.getByTestId('inventory-item')).toHaveCount(6));
        await check('C03', async () => {
          const sources = await page.locator('.inventory_item img').evaluateAll((imgs) =>
            imgs.map((img) => img.getAttribute('src')),
          );
          expect(new Set(sources).size).toBe(6);
        });
        await check('C16', async () => {
          await expect(page.locator('.inventory_item img').first()).toHaveAttribute('src', baseline.firstImage!);
        });
        await check('C04', async () => expect(await prices(page)).toEqual(baseline.prices));
        await check('C13', async () => expect(await position(page, 'shopping-cart-link')).toEqual(baseline.cart));
        await check('C15', async () => {
          const transform = await page.locator('.bm-burger-button img').evaluate((el) => getComputedStyle(el).transform);
          expect(transform).toBe('none');
        });
        await check('C05', async () => {
          await page.getByTestId('product-sort-container').selectOption('za');
          const names = await page.getByTestId('inventory-item-name').allTextContents();
          expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
        });
        await check('C12', async () => {
          const start = Date.now();
          await page.getByTestId('product-sort-container').selectOption('lohi');
          const sorted = await page
            .waitForFunction(
              () => {
                const values = [...document.querySelectorAll('[data-test="inventory-item-price"]')].map((e) =>
                  Number(e.textContent!.replace('$', '')),
                );
                return values.length > 0 && values.every((v, i) => i === 0 || values[i - 1] <= v);
              },
              null,
              { timeout: 7000 },
            )
            .then(() => true, () => false);
          if (!sorted) {
            notApplicable.add('C12'); // el orden no funciona: no hay tiempo que medir
            return;
          }
          expect(Date.now() - start).toBeLessThan(THRESHOLD_MS);
        });
        await check('C06', async () => {
          await page.waitForTimeout(500);
          const values = await prices(page);
          expect(values).toEqual([...values].sort((a, b) => a - b));
        });
        await check('C14', async () => {
          expect(await cartPageCheckoutPosition(page)).toEqual(baseline.checkoutButton);
        });
        await session.context.close();
      }

      // Agregar los 6 productos (sesión propia)
      await check('C07', async () => {
        const { context, page } = await openSession(browser, username);
        const buttons = page.locator('.inventory_item button');
        for (let i = 0; i < 6; i++) await buttons.nth(i).click();
        const badge = await page.getByTestId('shopping-cart-badge').innerText().catch(() => '0');
        await context.close();
        expect(badge).toBe('6');
      });

      // Quitar desde el listado (sesión propia)
      await check('C08', async () => {
        const { context, page } = await openSession(browser, username);
        await page.locator('.inventory_item button').first().click();
        await page.locator('.inventory_item button').first().click();
        const badges = await page.getByTestId('shopping-cart-badge').count();
        await context.close();
        expect(badges).toBe(0);
      });

      // Checkout: datos del formulario y compra completa (sesión propia)
      await check('C09', async () => {
        const { context, page } = await openSession(browser, username);
        await page.locator('.inventory_item button').first().click();
        await goToCheckoutStepOne(page);
        await page.getByTestId('firstName').fill(CHECKOUT_INFO.firstName);
        await page.getByTestId('lastName').fill(CHECKOUT_INFO.lastName);
        await page.getByTestId('postalCode').fill(CHECKOUT_INFO.postalCode);
        const values = [
          await page.getByTestId('firstName').inputValue(),
          await page.getByTestId('lastName').inputValue(),
          await page.getByTestId('postalCode').inputValue(),
        ];
        await context.close();
        expect(values).toEqual([CHECKOUT_INFO.firstName, CHECKOUT_INFO.lastName, CHECKOUT_INFO.postalCode]);
      });
      await check('C10', async () => {
        const { context, page } = await openSession(browser, username);
        await page.locator('.inventory_item button').first().click();
        await goToCheckoutStepOne(page);
        await page.getByTestId('firstName').fill(CHECKOUT_INFO.firstName);
        await page.getByTestId('lastName').fill(CHECKOUT_INFO.lastName);
        await page.getByTestId('postalCode').fill(CHECKOUT_INFO.postalCode);
        await page.getByTestId('continue').click();
        await expect(page).toHaveURL(/\/checkout-step-two\.html$/, { timeout: 5000 });
        await page.getByTestId('finish').click();
        await expect(page.getByTestId('complete-header')).toHaveText(MSG.orderComplete, { timeout: 5000 });
        await context.close();
      });

      const table = (Object.keys(CHECKS) as CheckId[])
        .map((id) => {
          const status = failed.has(id) ? 'FALLA' : notApplicable.has(id) ? 'n/a  ' : 'ok   ';
          return `${id} | ${status} | ${CHECKS[id]}${detail[id] ? ` → ${detail[id]}` : ''}`;
        })
        .join('\n');
      await test.info().attach(`matriz-${username}`, { body: table, contentType: 'text/plain' });
      test.info().annotations.push({
        type: 'verificaciones que fallan',
        description: [...failed].sort().join(', ') || 'ninguna',
      });

      expect([...failed].sort(), 'verificaciones que fallan').toEqual([...EXPECTED_FAILURES[username]].sort());
    });
  }
});


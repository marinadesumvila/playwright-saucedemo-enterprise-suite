import products from '../../src/data/products.json';
import users from '../../src/data/users.json';
import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('SauceDemo/06_ACCT', () => {
  test('[C-ACCT-01] Debería mostrar comportamientos de error con problem_user', async ({
    loginPage,
    productListPage,
    page,
  }) => {
    await loginPage.loginAs(users.problemUser);
    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(productListPage.inventoryItems).toHaveCount(products.inventory.expectedCount);

    const sources = await productListPage.imageSources();
    const uniqueSources = new Set(sources.filter((src) => src.length > 0));
    const brokenImages = await productListPage.brokenImageCount();

    expect(brokenImages > 0 || uniqueSources.size < products.inventory.expectedCount).toBe(true);
  });

  test('[C-ACCT-02] Debería registrar latencia al navegar con performance_glitch_user', async ({
    loginPage,
    productListPage,
    page,
  }) => {
    test.setTimeout(90_000);
    await loginPage.open();

    const started = Date.now();
    await loginPage.login(users.performanceGlitchUser.username, users.performanceGlitchUser.password);
    await expect(page).toHaveURL(/\/inventory\.html/, { timeout: 30_000 });
    const loginMs = Date.now() - started;

    const navigationStarted = Date.now();
    await productListPage.openProduct(products.backpack.name);
    await expect(page).toHaveURL(/inventory-item\.html/, { timeout: 30_000 });
    const navigationMs = Date.now() - navigationStarted;

    expect(Math.max(loginMs, navigationMs)).toBeGreaterThan(1000);
  });

  test('[C-ACCT-03] Debería reiniciar el estado de la aplicación desde el menú', async ({
    loginPage,
    productListPage,
    cartPage,
    page,
  }) => {
    await loginPage.loginAs(users.standardUser);
    await productListPage.addToCart(products.backpack.slug);
    await productListPage.addToCart(products.bikeLight.slug);
    await expect(productListPage.header.cart.badge).toHaveText('2');

    await productListPage.navbar.resetAppState();

    await expect(productListPage.header.cart.badge).toHaveCount(0);
    await cartPage.open();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(cartPage.items).toHaveCount(0);
  });
});

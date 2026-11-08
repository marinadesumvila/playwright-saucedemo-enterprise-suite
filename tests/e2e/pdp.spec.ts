import products from '../../src/data/products.json';
import users from '../../src/data/users.json';
import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('SauceDemo/03_PDP', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.loginAs(users.standardUser);
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('[C-PDP-01] Debería navegar al detalle desde el PLP', async ({ productListPage, productDetailPage, page }) => {
    await productListPage.openProduct(products.backpack.name);

    await expect(page).toHaveURL(new RegExp(`/inventory-item\\.html\\?id=${products.backpack.id}`));
    await expect(productDetailPage.name).toHaveText(products.backpack.name);
  });

  test('[C-PDP-02] Debería mantener la consistencia de datos entre PLP y PDP', async ({
    productListPage,
    productDetailPage,
  }) => {
    const listed = await productListPage.snapshot(products.backpack.name);
    await productListPage.openProduct(products.backpack.name);
    const detail = await productDetailPage.snapshot();

    expect(detail.name).toBe(listed.name);
    expect(detail.description).toBe(listed.description);
    expect(detail.price).toBe(listed.price);
    expect(detail.imageSrc).toBe(listed.imageSrc);
  });

  test('[C-PDP-03] Debería agregar y quitar un producto desde el PDP', async ({
productListPage,
  productDetailPage,
}) => {
  await productListPage.openProduct(products.backpack.name);

  // Agregar al carrito y validar transición a 'Remove'
  await productDetailPage.addToCart();
  await expect(productDetailPage.removeButton).toHaveText('Remove');
  await expect(productDetailPage.header.cart.badge).toHaveText('1');

  // Quitar del carrito y validar retorno estricto a 'Add to cart'
  await productDetailPage.removeFromCart();
  await expect(productDetailPage.addButton).toHaveText('Add to cart', { timeout: 10_000 });
  await expect(productDetailPage.header.cart.badge).toBeHidden();
});

  test('[C-PDP-04] Debería volver al listado desde el PDP conservando el carrito', async ({
    productListPage,
    productDetailPage,
    page,
  }) => {
    await productListPage.openProduct(products.bikeLight.name);
    await productDetailPage.addToCart();
    await expect(productDetailPage.header.cart.badge).toHaveText('1');

    await productDetailPage.backToProducts();

    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(productListPage.inventoryItems).toHaveCount(products.inventory.expectedCount);
    await expect(productListPage.header.cart.badge).toHaveText('1');
    await expect(productListPage.removeButton(products.bikeLight.slug)).toBeVisible();
  });
});

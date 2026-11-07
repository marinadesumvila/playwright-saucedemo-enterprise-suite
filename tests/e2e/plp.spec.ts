import products from '../../src/data/products.json';
import users from '../../src/data/users.json';
import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('SauceDemo/02_PLP', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.loginAs(users.standardUser);
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('[C-PLP-01] Debería renderizar el catálogo de productos', async ({ productListPage }) => {
    await expect(productListPage.inventoryItems).toHaveCount(products.inventory.expectedCount);
    await expect(productListPage.footer.root).toBeVisible();

    const items = await productListPage.inventoryItems.all();
    expect(items).toHaveLength(products.inventory.expectedCount);

    for (const item of items) {
      await expect(item.locator('.inventory_item_name')).not.toBeEmpty();
      await expect(item.locator('.inventory_item_desc')).not.toBeEmpty();
      await expect(item.locator('.inventory_item_price')).toContainText('$');
      await expect(item.locator('img')).toBeVisible();
    }
  });

  test('[C-PLP-02] Debería ordenar los productos por nombre (A-Z / Z-A)', async ({ productListPage }) => {
    await productListPage.sortBy({ label: 'Name (Z to A)', value: 'za' });
    await expect(productListPage.itemNames.first()).toHaveText(products.inventory.nameDescFirst);

    const descending = await productListPage.names();
    const descendingSorted = [...descending].sort((a, b) => b.localeCompare(a));
    expect(descending).toEqual(descendingSorted);

    await productListPage.sortBy({ label: 'Name (A to Z)', value: 'az' });
    await expect(productListPage.itemNames.first()).toHaveText(products.inventory.nameAscFirst);

    const ascending = await productListPage.names();
    const ascendingSorted = [...ascending].sort((a, b) => a.localeCompare(b));
    expect(ascending).toEqual(ascendingSorted);
  });

  test('[C-PLP-03] Debería ordenar los productos por precio (menor a mayor / mayor a menor)', async ({
    productListPage,
  }) => {
    await productListPage.sortBy({ label: 'Price (low to high)', value: 'lo' });
    await expect(productListPage.itemNames.first()).toHaveText(products.inventory.priceAscFirst);

    await productListPage.sortBy({ label: 'Price (high to low)', value: 'hi' });
    await expect(productListPage.itemNames.first()).toHaveText(products.inventory.priceDescFirst);

    const prices = await productListPage.inventoryItems
      .locator('.inventory_item_price')
      .allTextContents();
    const amounts = prices.map((price) => Number(price.replace('$', '')));
    const highToLow = [...amounts].sort((a, b) => b - a);
    expect(amounts).toEqual(highToLow);
  });

  test('[C-PLP-04] Debería agregar un producto al carrito desde el PLP y actualizar el badge', async ({
    productListPage,
  }) => {
    await productListPage.addToCart(products.backpack.slug);

    await expect(productListPage.removeButton(products.backpack.slug)).toHaveText('Remove');
    await expect(productListPage.header.cart.badge).toHaveText('1');
  });

  test('[C-PLP-05] Debería quitar un producto del carrito desde el PLP', async ({ productListPage }) => {
    await productListPage.addToCart(products.backpack.slug);
    await expect(productListPage.header.cart.badge).toHaveText('1');

    await productListPage.removeFromCart(products.backpack.slug);

    await expect(productListPage.addButton(products.backpack.slug)).toHaveText('Add to cart');
    await expect(productListPage.header.cart.badge).toHaveCount(0);
  });
});

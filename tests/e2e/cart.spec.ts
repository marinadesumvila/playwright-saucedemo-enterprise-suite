import products from '../../src/data/products.json';
import users from '../../src/data/users.json';
import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('SauceDemo/04_CART', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.loginAs(users.standardUser);
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('[C-CART-01] Debería listar en el carrito los productos agregados', async ({
    productListPage,
    cartPage,
    page,
  }) => {
    await productListPage.addToCart(products.backpack.slug);
    await productListPage.addToCart(products.bikeLight.slug);
    await cartPage.open();

    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.bikeLight.name]);
  });

  test('[C-CART-02] Debería persistir el carrito al navegar entre páginas', async ({
    productListPage,
    productDetailPage,
    cartPage,
    page,
  }) => {
    await productListPage.addToCart(products.backpack.slug);
    await productListPage.addToCart(products.bikeLight.slug);
    await productListPage.openProduct(products.backpack.name);
    await expect(page).toHaveURL(/inventory-item\.html/);
    await productDetailPage.backToProducts();
    await cartPage.open();

    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemNames).toContainText([products.backpack.name, products.bikeLight.name]);
  });

  test('[C-CART-03] Debería eliminar un producto desde la vista del carrito', async ({
    productListPage,
    cartPage,
  }) => {
    await productListPage.addToCart(products.backpack.slug);
    await productListPage.addToCart(products.bikeLight.slug);
    await cartPage.open();

    await cartPage.remove(products.backpack.slug);

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText([products.bikeLight.name]);
    await expect(cartPage.header.cart.badge).toHaveText('1');
  });

  test('[C-CART-04] Debería volver al catálogo con Continue Shopping sin perder el carrito', async ({
    productListPage,
    cartPage,
    page,
  }) => {
    await productListPage.addToCart(products.backpack.slug);
    await cartPage.open();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(productListPage.header.cart.badge).toHaveText('1');

    await cartPage.open();
    await expect(cartPage.itemNames).toHaveText([products.backpack.name]);
  });

  test('[C-CART-05] Debería continuar al checkout desde el carrito', async ({
    productListPage,
    cartPage,
    page,
  }) => {
    await productListPage.addToCart(products.backpack.slug);
    await cartPage.open();
    await cartPage.checkout();

    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
  });
});

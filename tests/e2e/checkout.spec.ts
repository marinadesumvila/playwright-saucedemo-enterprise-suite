import checkoutData from '../../src/data/checkoutData.json';
import products from '../../src/data/products.json';
import users from '../../src/data/users.json';
import { test, expect } from '../../src/fixtures/test.fixture';
import { summarizeOrder } from '../../src/utils/apiHelpers';

test.describe('SauceDemo/05_CHK', () => {
  test.beforeEach(async ({ loginPage, productListPage, cartPage, page }) => {
    await loginPage.loginAs(users.standardUser);
    await productListPage.addToCart(products.backpack.slug);
    await cartPage.open();
    await cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
  });

  test('[C-CHK-01] Debería validar los campos obligatorios del checkout', async ({ checkoutPage }) => {
    await checkoutPage.continue();

    await expect(checkoutPage.error).toHaveText('Error: First Name is required');
  });

  test('[C-CHK-02] Debería completar la información del usuario y avanzar al resumen', async ({
    checkoutPage,
    page,
  }) => {
    await checkoutPage.fillInformation(checkoutData.validCustomer);
    await checkoutPage.continue();

    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(checkoutPage.subtotal).toContainText(products.backpack.price);
  });

  test('[C-CHK-03] Debería calcular el total como suma de subtotal e impuesto', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(checkoutData.validCustomer);
    await checkoutPage.continue();

    const summary = summarizeOrder(
      await checkoutPage.subtotal.innerText(),
      await checkoutPage.tax.innerText(),
      await checkoutPage.total.innerText(),
    );

    expect(summary.subtotal).toBeCloseTo(29.99, 2);
    expect(summary.total).toBeCloseTo(summary.subtotal + summary.tax, 2);
  });

  test('[C-CHK-04] Debería cancelar el checkout y regresar al carrito o al catálogo', async ({
    checkoutPage,
    cartPage,
    page,
  }) => {
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(cartPage.itemNames).toHaveText([products.backpack.name]);

    await cartPage.checkout();
    await checkoutPage.fillInformation(checkoutData.validCustomer);
    await checkoutPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);

    await checkoutPage.cancel();
    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(cartPage.header.cart.badge).toHaveText('1');
  });

  test('[C-CHK-05] Debería completar el pedido y mostrar la confirmación', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInformation(checkoutData.validCustomer);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText(/thank you for your order/i);
  });
});

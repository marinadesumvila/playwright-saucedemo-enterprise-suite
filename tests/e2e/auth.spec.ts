import users from '../../src/data/users.json';
import { test, expect } from '../../src/fixtures/test.fixture';
import { readSessionUsername } from '../../src/utils/apiHelpers';

test.describe('SauceDemo/01_AUTH', () => {
  test('[C-AUTH-01] Debería iniciar sesión correctamente', async ({ homePage, loginPage, page }) => {
    await homePage.open();
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.loginWrapper).toBeVisible();

    await loginPage.login(users.standardUser.username, users.standardUser.password);

    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(loginPage.header.logo).toHaveText('Swag Labs');
    await expect(await readSessionUsername(page)).toBe(users.standardUser.username);
  });

  test('[C-AUTH-02] Debería mostrar error al iniciar sesión con usuario bloqueado', async ({
    loginPage,
    page,
  }) => {
    await loginPage.loginAs(users.lockedUser);

    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.error).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('[C-AUTH-03] Debería rechazar credenciales inválidas', async ({ loginPage, page }) => {
    await loginPage.loginAs(users.invalidUser);

    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(loginPage.error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('[C-AUTH-04] Debería exigir los campos obligatorios del formulario de login', async ({
    loginPage,
  }) => {
    await loginPage.open();
    await loginPage.loginButton.click();

    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
    await expect(loginPage.error).toHaveText('Epic sadface: Username is required');
  });

  test('[C-AUTH-05] Debería cerrar sesión desde el menú lateral', async ({ loginPage, page }) => {
    await loginPage.loginAs(users.standardUser);
    await expect(page).toHaveURL(/\/inventory\.html/);

    await loginPage.navbar.logout();

    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});

import { Locator, Page } from '@playwright/test';

export class Navbar {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;
  readonly inventoryLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
    this.inventoryLink = page.locator('#inventory_sidebar_link');
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
  await this.openMenu();

  await this.resetLink.click();

  // Esperar a que el carrito quede vacío
  await this.page.locator('.shopping_cart_badge')
    .waitFor({ state: 'detached' });

  // Cerrar el menú
  await this.page.locator('#react-burger-cross-btn').click();
  }
}

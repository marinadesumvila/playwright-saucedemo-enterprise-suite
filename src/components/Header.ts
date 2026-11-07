import { Locator, Page } from '@playwright/test';
import { CartDrawer } from './CartDrawer';

export class Header {
  readonly page: Page;
  readonly logo: Locator;
  readonly cart: CartDrawer;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('.app_logo');
    this.cart = new CartDrawer(page);
  }
}

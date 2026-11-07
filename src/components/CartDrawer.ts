import { Locator, Page } from '@playwright/test';

/** Cart entry point in the header. SauceDemo opens a full cart page rather than a slide-over. */
export class CartDrawer {
  readonly page: Page;
  readonly link: Locator;
  readonly badge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.link = page.locator('.shopping_cart_link');
    this.badge = page.locator('.shopping_cart_badge');
  }

  async open(): Promise<void> {
    await this.link.click();
  }

  async badgeText(): Promise<string> {
    if ((await this.badge.count()) === 0) {
      return '0';
    }
    return (await this.badge.innerText()).trim();
  }
}

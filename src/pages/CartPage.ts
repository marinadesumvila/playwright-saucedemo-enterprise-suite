import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('.cart_item');
    this.itemNames = page.locator('.cart_item .inventory_item_name');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async open(): Promise<void> {
    await this.header.cart.open();
  }

  async names(): Promise<string[]> {
    return (await this.itemNames.allTextContents()).map((name) => name.trim());
  }

  removeButton(slug: string): Locator {
    return this.page.locator(`[data-test="remove-${slug}"]`);
  }

  async remove(slug: string): Promise<void> {
    await this.removeButton(slug).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

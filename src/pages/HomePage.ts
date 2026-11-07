import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Storefront landing. On SauceDemo the public entry route is the login screen. */
export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly loginWrapper: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.login_logo');
    this.loginWrapper = page.locator('.login_wrapper');
  }

  async open(): Promise<void> {
    await this.goto('/');
  }
}

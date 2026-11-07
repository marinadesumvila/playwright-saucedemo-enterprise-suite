import { Locator, Page } from '@playwright/test';

export class Footer {
  readonly page: Page;
  readonly root: Locator;
  readonly copy: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('footer.footer');
    this.copy = page.locator('.footer_copy');
  }
}

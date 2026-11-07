import { Page } from '@playwright/test';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

export class BasePage {
  readonly page: Page;
  readonly header: Header;
  readonly navbar: Navbar;
  readonly footer: Footer;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.navbar = new Navbar(page);
    this.footer = new Footer(page);
  }

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }
}

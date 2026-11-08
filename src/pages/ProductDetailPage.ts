import { Locator, Page } from '@playwright/test';
import { ProductSnapshot } from '../types/product.types';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.name = page.locator('.inventory_details_name');
    this.description = page.locator('.inventory_details_desc');
    this.price = page.locator('.inventory_details_price');
    this.image = page.locator('img.inventory_details_img');
    
    // 🟢 CAMBIO 1: Garantiza capturar únicamente el botón de la PDP (evita ambigüedades con el header/cart)
    this.addButton = page.locator('.inventory_details_desc_container [data-test^="add-to-cart"]');
    
    // 🟢 CAMBIO 2: Lo mismo para el botón Remove dentro del contenedor del producto
    this.removeButton = page.locator('.inventory_details_desc_container [data-test^="remove"]');
    
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async openById(id: number): Promise<void> {
    await this.goto(`/inventory-item.html?id=${id}`);
  }

  async snapshot(): Promise<ProductSnapshot> {
    return {
      name: (await this.name.innerText()).trim(),
      description: (await this.description.innerText()).trim(),
      price: (await this.price.innerText()).trim(),
      imageSrc: (await this.image.getAttribute('src')) ?? '',
    };
  }

  async addToCart(): Promise<void> {
    await this.addButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backButton.click();
  }
}
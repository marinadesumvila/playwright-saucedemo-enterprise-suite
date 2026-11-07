import { Locator, Page } from '@playwright/test';
import { FilterCriteria, ProductSnapshot } from '../types/product.types';
import { BasePage } from './BasePage';

export class ProductListPage extends BasePage {
  readonly inventoryItems: Locator;
  readonly sortSelect: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('.inventory_item_name');
  }

  itemByName(name: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: name }),
    });
  }

  addButton(slug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`);
  }

  removeButton(slug: string): Locator {
    return this.page.locator(`[data-test="remove-${slug}"]`);
  }

  async sortBy(option: FilterCriteria): Promise<void> {
    await this.sortSelect.selectOption({ label: option.label });
  }

  async names(): Promise<string[]> {
    return (await this.itemNames.allTextContents()).map((name) => name.trim());
  }

  async snapshot(name: string): Promise<ProductSnapshot> {
    const item = this.itemByName(name);
    return {
      name: (await item.locator('.inventory_item_name').innerText()).trim(),
      description: (await item.locator('.inventory_item_desc').innerText()).trim(),
      price: (await item.locator('.inventory_item_price').innerText()).trim(),
      imageSrc: (await item.locator('img').getAttribute('src')) ?? '',
    };
  }

  async imageSources(): Promise<string[]> {
    return this.inventoryItems.locator('img').evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).currentSrc || image.getAttribute('src') || ''),
    );
  }

  async brokenImageCount(): Promise<number> {
    return this.inventoryItems.locator('img').evaluateAll((images) =>
      images.filter((image) => {
        const img = image as HTMLImageElement;
        const src = img.currentSrc || img.getAttribute('src') || '';
        return img.naturalWidth === 0 || /sl-404|WithGarbage/i.test(src);
      }).length,
    );
  }

  async openProduct(name: string): Promise<void> {
    await this.itemByName(name).locator('.inventory_item_name').click();
  }

  async addToCart(slug: string): Promise<void> {
    await this.addButton(slug).click();
  }

  async removeFromCart(slug: string): Promise<void> {
    await this.removeButton(slug).click();
  }
}

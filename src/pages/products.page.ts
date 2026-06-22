import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class ProductsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly productCards: Locator;
  readonly productLinks: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading   = page.locator('h2').filter({ hasText: /our products/i });
    this.productCards  = page.locator('.portfolio-grid-item-wrapper, .summary-item, [class*="portfolio"], [class*="summary-item"]');
    this.productLinks  = page.locator('a[href*="/products/"]');
    this.cartIcon      = page.locator('a[href="/cart"], [class*="cart"]');
  }

  async navigateToProducts(): Promise<void> {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async getProductTitles(): Promise<string[]> {
    const links = this.productLinks;
    const count  = await links.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await links.nth(i).textContent())?.trim() ?? '';
      if (text) titles.push(text);
    }
    return titles;
  }

  async clickProductByIndex(index: number): Promise<void> {
    await this.productLinks.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickProductByName(name: string): Promise<void> {
    await this.productLinks.filter({ hasText: new RegExp(name, 'i') }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export const PRODUCT_SLUGS = {
  tuneni:              '/products/big-kids-pt3d3',
  tws:                 '/products/little-kids-cb7lh',
  courses:             '/products/new-portfolio-item',
  wildernessAssistant: '/products/wilderness-medicine-simulator',
} as const;

export type ProductSlug = (typeof PRODUCT_SLUGS)[keyof typeof PRODUCT_SLUGS];

export class ProductDetailPage extends BasePage {
  readonly productHeading: Locator;
  readonly featureSections: Locator;
  readonly backToProductsLink: Locator;
  readonly nextProductLink: Locator;
  readonly prevProductLink: Locator;
  readonly productImages: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    // Tuneni page uses h2 for the product name; TWS uses h1 — cover both
    this.productHeading      = page.locator('h1, h2').first();
    // Squarespace product pages use h2 for feature section titles
    this.featureSections     = page.locator('h2, h3, h4');
    this.backToProductsLink  = page.locator('a').filter({ hasText: /back to all products/i });
    this.nextProductLink     = page.locator('a').filter({ hasText: /next/i }).last();
    this.prevProductLink     = page.locator('a').filter({ hasText: /previous|prev/i }).first();
    this.productImages       = page.locator('main img, [class*="content"] img, [role="main"] img');
  }

  async navigateToProduct(slug: ProductSlug): Promise<void> {
    await this.page.goto(slug, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getHeadingText(): Promise<string> {
    return (await this.productHeading.textContent())?.trim() ?? '';
  }

  async getFeatureCount(): Promise<number> {
    return this.featureSections.count();
  }

  async clickBackToProducts(): Promise<void> {
    await this.backToProductsLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNextProduct(): Promise<void> {
    await this.nextProductLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

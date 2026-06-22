/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@site-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { ProductsPage } from '@pages/products.page';
import { AboutPage } from '@pages/about.page';
import { ProductDetailPage } from '@pages/product-detail.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** ProductsPage page object (does not auto-navigate) */
  productsPage: ProductsPage;
  /** AboutPage page object (does not auto-navigate) */
  aboutPage: AboutPage;
  /** ProductDetailPage page object (does not auto-navigate) */
  productDetailPage: ProductDetailPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  productsPage: async ({ page, siteConfig }, use) => {
    const productsPage = new ProductsPage(page, siteConfig);
    await use(productsPage);
  },

  aboutPage: async ({ page, siteConfig }, use) => {
    const aboutPage = new AboutPage(page, siteConfig);
    await use(aboutPage);
  },

  productDetailPage: async ({ page, siteConfig }, use) => {
    const productDetailPage = new ProductDetailPage(page, siteConfig);
    await use(productDetailPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };

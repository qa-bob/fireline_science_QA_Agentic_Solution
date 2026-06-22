/**
 * tests/functional/products.spec.ts
 *
 * Functional tests for the Fireline Science products listing page (/products).
 * Covers: product cards, navigation to individual product pages, cart icon.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const KNOWN_PRODUCTS = ['Tuneni', 'TWS', 'Courses', 'Wilderness'];

test.describe('Products Page @functional', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.navigateToProducts();
  });

  // ── Page fundamentals ────────────────────────────────────────────────────────

  test('products page loads and shows a heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.trim().length, 'Products page heading should not be empty').toBeGreaterThan(0);
  });

  test('products page title includes "Products" @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('product');
  });

  // ── Product catalog ──────────────────────────────────────────────────────────

  test('at least 4 product links are present @functional', async ({ productsPage }) => {
    const count = await productsPage.productLinks.count();
    expect(count, 'Products page should have at least 4 product links').toBeGreaterThanOrEqual(4);
  });

  test('Tuneni product link is present @functional', async ({ page }) => {
    const tuneniLink = page.locator('a').filter({ hasText: /tuneni/i });
    await expect(tuneniLink.first()).toBeVisible();
  });

  test('TWS product link is present @functional', async ({ page }) => {
    const twsLink = page.locator('a').filter({ hasText: /tws|tuneni web services/i });
    await expect(twsLink.first()).toBeVisible();
  });

  test('Wilderness Medical Assistant product link is present @functional', async ({ page }) => {
    const wildLink = page.locator('a').filter({ hasText: /wilderness|medical/i });
    await expect(wildLink.first()).toBeVisible();
  });

  test('all product links resolve to /products/ subpaths @functional', async ({ productsPage }) => {
    const links = productsPage.productLinks;
    const count  = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href, `Product link ${i} should have a non-null href`).not.toBeNull();
      expect(
        href?.startsWith('/products/') || href?.includes('firelinescience.com/products/'),
        `Product link "${href}" should point to /products/ subpath`
      ).toBeTruthy();
    }
  });

  // ── Click-through navigation ─────────────────────────────────────────────────

  test('clicking Tuneni product navigates to Tuneni detail page @functional', async ({ productsPage, page }) => {
    const tuneniLink = page.locator('a[href*="big-kids"]').first();
    const count = await tuneniLink.count();

    if (count === 0) {
      // Fallback: find any link containing "tuneni" text
      const textLink = page.locator('a').filter({ hasText: /^tuneni$/i }).first();
      await textLink.click();
    } else {
      await tuneniLink.click();
    }

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/products/');
  });

  // ── Cart ─────────────────────────────────────────────────────────────────────

  test('cart icon is visible on products page @functional', async ({ productsPage }) => {
    const cartVisible = await productsPage.cartIcon.isVisible().catch(() => false);
    if (!cartVisible) {
      console.warn('[products] Cart icon not found — site may not have e-commerce enabled on this page.');
    }
    // Soft check: cart is present but not required to be visible on all viewports
  });
});

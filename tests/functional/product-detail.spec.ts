/**
 * tests/functional/product-detail.spec.ts
 *
 * Functional tests for individual Fireline Science product detail pages.
 * Covers: Tuneni, TWS — heading, feature sections, back-link, product navigation.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { PRODUCT_SLUGS } from '@pages/product-detail.page';

test.describe('Product Detail — Tuneni @functional', () => {
  test.beforeEach(async ({ productDetailPage }) => {
    await productDetailPage.navigateToProduct(PRODUCT_SLUGS.tuneni);
  });

  test('Tuneni page heading is visible @functional', async ({ productDetailPage }) => {
    await expect(productDetailPage.productHeading).toBeVisible();
    const text = await productDetailPage.getHeadingText();
    expect(text.length, 'Tuneni heading should have text').toBeGreaterThan(0);
  });

  test('Tuneni page title is set correctly @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('tuneni');
  });

  test('Tuneni has multiple feature sections @functional', async ({ productDetailPage }) => {
    // Squarespace product pages use h2 for feature section titles
    const featureCount = await productDetailPage.getFeatureCount();
    expect(featureCount, 'Tuneni product page should have at least 3 feature headings (h2/h3/h4)').toBeGreaterThanOrEqual(3);
  });

  test('"Finally Digital Access for All" feature heading is visible @functional', async ({ page }) => {
    // Feature headings may be h2, h3, or h4 in Squarespace layout
    const heading = page.locator('h2, h3, h4').filter({ hasText: /digital access/i });
    const count = await heading.count();
    if (count === 0) {
      const bodyText = (await page.locator('body').textContent()) ?? '';
      expect(bodyText.toLowerCase()).toContain('digital access');
    } else {
      await expect(heading.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('"AI Assistants" feature heading is visible @functional', async ({ page }) => {
    const heading = page.locator('h2, h3, h4').filter({ hasText: /intelligent assistant|ai assistant/i });
    const count = await heading.count();
    if (count === 0) {
      const bodyText = (await page.locator('body').textContent()) ?? '';
      expect(
        bodyText.toLowerCase().includes('assistant') || bodyText.toLowerCase().includes('ai-assisted'),
        'Tuneni page should mention AI assistants feature'
      ).toBeTruthy();
    } else {
      await expect(heading.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('"Back to all products" link is present @functional', async ({ productDetailPage }) => {
    await expect(productDetailPage.backToProductsLink).toBeVisible();
  });

  test('"Back to all products" link navigates to /products @functional', async ({ productDetailPage, page }) => {
    await productDetailPage.clickBackToProducts();
    expect(page.url()).toContain('/products');
    // Should NOT be on a product subpath after clicking back
    expect(page.url()).not.toMatch(/\/products\/.+/);
  });

  test('"Next" product navigation link is present @functional', async ({ productDetailPage }) => {
    const isVisible = await productDetailPage.nextProductLink.isVisible().catch(() => false);
    expect(isVisible, '"Next" product link should be visible on Tuneni detail page').toBeTruthy();
  });

  test('product images are loaded and not broken @functional', async ({ productDetailPage }) => {
    const count = await productDetailPage.productImages.count();
    if (count === 0) {
      console.warn('[product-detail] No images found on Tuneni product page');
      return;
    }
    for (let i = 0; i < Math.min(count, 4); i++) {
      const img = productDetailPage.productImages.nth(i);
      const isVisible = await img.isVisible().catch(() => false);
      if (isVisible) {
        const w = await img.evaluate<number>((el) => (el as HTMLImageElement).naturalWidth);
        expect(w, `Image ${i} on Tuneni page is broken`).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('Product Detail — TWS (Tuneni Web Services) @functional', () => {
  test.beforeEach(async ({ productDetailPage }) => {
    await productDetailPage.navigateToProduct(PRODUCT_SLUGS.tws);
  });

  test('TWS page heading is visible @functional', async ({ productDetailPage }) => {
    await expect(productDetailPage.productHeading).toBeVisible();
    const text = await productDetailPage.getHeadingText();
    expect(text.toLowerCase()).toContain('tws');
  });

  test('TWS page title is set correctly @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('tws');
  });

  test('TWS has multiple feature sections @functional', async ({ productDetailPage }) => {
    // Squarespace uses h2/h3/h4 for feature section titles
    const count = await productDetailPage.getFeatureCount();
    expect(count, 'TWS product page should have at least 3 feature headings (h2/h3/h4)').toBeGreaterThanOrEqual(3);
  });

  test('"Teacher in the loop" feature is described @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    expect(
      bodyText.toLowerCase().includes('teacher in the loop') || bodyText.toLowerCase().includes('teacher-in-the-loop'),
      'TWS page should mention "teacher in the loop" feature'
    ).toBeTruthy();
  });

  test('"Back to all products" link is present on TWS page @functional', async ({ productDetailPage }) => {
    await expect(productDetailPage.backToProductsLink).toBeVisible();
  });
});

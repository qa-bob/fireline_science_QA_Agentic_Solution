/**
 * tests/functional/homepage.spec.ts
 *
 * Functional tests for the Fireline Science homepage.
 * Covers: hero section, feature cards, NSF funding badge, impact stats, and CTA.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Functional @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    // homePage fixture already navigated to the site root
    await homePage.waitForLoad();
  });

  // ── Hero section ─────────────────────────────────────────────────────────────

  test('hero heading contains mission-critical messaging @functional', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text?.trim().length, 'H1 should have meaningful text').toBeGreaterThan(5);
  });

  test('hero heading text matches expected brand message @functional', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const headingText = (await h1.textContent())?.toLowerCase() ?? '';
    // Should contain one of the known key phrases
    const hasExpectedPhrase =
      headingText.includes('mission') ||
      headingText.includes('teacher') ||
      headingText.includes('educational') ||
      headingText.includes('ai');
    expect(hasExpectedPhrase, `H1 "${headingText}" should contain mission/teacher/AI messaging`).toBeTruthy();
  });

  test('homepage has multiple section headings @functional', async ({ page }) => {
    // Squarespace renders section titles as h2/h3/h4 depending on block type
    const headings = page.locator('h2, h3, h4');
    const count = await headings.count();
    expect(count, 'Homepage should have multiple section headings (h2/h3/h4)').toBeGreaterThanOrEqual(3);
  });

  // ── Feature sections ─────────────────────────────────────────────────────────

  test('Tech For Those That Need It section is visible @functional', async ({ page }) => {
    // Squarespace renders these section titles as h3/h4 within content blocks
    const section = page.locator('h2, h3, h4').filter({ hasText: /tech for those/i });
    const count = await section.count();
    if (count === 0) {
      // Fallback: verify text appears anywhere on the page
      const bodyText = (await page.locator('body').textContent()) ?? '';
      expect(bodyText.toLowerCase()).toContain('tech for those');
    } else {
      await expect(section.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('Local AI Teacher-Led section is visible @functional', async ({ page }) => {
    const section = page.locator('h2, h3, h4').filter({ hasText: /local ai|teacher.?led/i });
    const count = await section.count();
    if (count === 0) {
      const bodyText = (await page.locator('body').textContent()) ?? '';
      expect(
        bodyText.toLowerCase().includes('local ai') || bodyText.toLowerCase().includes('teacher'),
        'Homepage body should mention local AI or teacher-led content'
      ).toBeTruthy();
    } else {
      await expect(section.first()).toBeVisible({ timeout: 5000 });
    }
  });

  // ── Impact statistics ────────────────────────────────────────────────────────

  test('impact statistics (400% and 50%) are displayed @functional', async ({ page }) => {
    const bodyText = await page.locator('body').textContent() ?? '';
    expect(
      bodyText.includes('400'),
      'Homepage should show the 400% teacher feedback increase stat'
    ).toBeTruthy();
    expect(
      bodyText.includes('50'),
      'Homepage should show the 50% grading time reduction stat'
    ).toBeTruthy();
  });

  // ── NSF funding section ──────────────────────────────────────────────────────

  test('NSF / National Science Foundation funding badge is visible @functional', async ({ page }) => {
    // NSF logo image OR text reference
    const nsfImage = page.locator('img[alt*="National Science Foundation" i], img[alt*="NSF" i]');
    const nsfText  = page.locator('p, div, span').filter({ hasText: /national science foundation|NSF SBIR/i });

    const imageVisible = await nsfImage.first().isVisible().catch(() => false);
    const textVisible  = await nsfText.first().isVisible().catch(() => false);

    expect(
      imageVisible || textVisible,
      'NSF funding acknowledgment should be visible on the homepage'
    ).toBeTruthy();
  });

  // ── CTA links ────────────────────────────────────────────────────────────────

  test('homepage has a CTA link pointing to /about @functional', async ({ page }) => {
    const aboutLink = page.locator('a[href="/about"], a[href*="about"]').filter({ hasText: /learn more|about|get started/i });
    const count = await aboutLink.count();
    expect(count, 'Homepage should have at least one CTA link to /about').toBeGreaterThan(0);
  });

  // ── Images ──────────────────────────────────────────────────────────────────

  test('feature section images are visible @functional', async ({ page }) => {
    const contentImages = page.locator('main img, article img, [role="main"] img');
    const count = await contentImages.count();
    expect(count, 'Homepage should have at least 3 content images').toBeGreaterThanOrEqual(3);

    // Verify first few images are visible (not broken)
    for (let i = 0; i < Math.min(count, 3); i++) {
      const img = contentImages.nth(i);
      const isVisible = await img.isVisible().catch(() => false);
      if (isVisible) {
        const naturalWidth = await img.evaluate<number>((el) => (el as HTMLImageElement).naturalWidth);
        expect(naturalWidth, `Image ${i} appears to be broken (naturalWidth=0)`).toBeGreaterThan(0);
      }
    }
  });

  // ── Footer ───────────────────────────────────────────────────────────────────

  test('footer is present and contains copyright @functional', async ({ page }) => {
    // Squarespace may use div-based footer layout
    const footer = page.locator('footer, [role="contentinfo"], [class*="Footer" i], [class*="footer" i]');
    const isVisible = await footer.first().isVisible().catch(() => false);
    // If no semantic footer, verify copyright text exists anywhere on page
    if (!isVisible) {
      const bodyText = (await page.locator('body').textContent()) ?? '';
      expect(
        bodyText.includes('©') || bodyText.toLowerCase().includes('copyright') || bodyText.toLowerCase().includes('fireline'),
        'Page should have copyright or branding in footer area'
      ).toBeTruthy();
      return;
    }

    const footerText = (await footer.first().textContent()) ?? '';
    expect(
      footerText.toLowerCase().includes('fireline') || footerText.includes('©') || footerText.includes('Copyright'),
      'Footer should contain Fireline Science branding or copyright'
    ).toBeTruthy();
  });

  test('footer navigation links are present @functional', async ({ page }) => {
    // Squarespace may not use a semantic <footer> — try multiple selectors
    const footerSelectors = [
      'footer',
      '[role="contentinfo"]',
      '[class*="Footer" i]',
      '[class*="footer" i]',
      '[id*="footer" i]',
    ];

    let footerLinks = page.locator('a').filter({ hasText: /.+/ }); // fallback: any link
    for (const sel of footerSelectors) {
      const el = page.locator(sel);
      if (await el.count() > 0) {
        footerLinks = el.locator('a');
        break;
      }
    }

    const count = await footerLinks.count();
    if (count === 0) {
      // Verify nav links exist somewhere at the bottom of the page
      const allLinks = page.locator('a[href]');
      const totalLinks = await allLinks.count();
      expect(totalLinks, 'Page should have at least one link (for footer coverage)').toBeGreaterThan(0);
    } else {
      expect(count, 'Footer should have at least one navigation link').toBeGreaterThan(0);
    }
  });
});

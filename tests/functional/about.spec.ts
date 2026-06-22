/**
 * tests/functional/about.spec.ts
 *
 * Functional tests for the Fireline Science About page (/about).
 * Covers: mission statement, team bios, impact stats, student testimonial, images.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('About Page @functional', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.navigateToAbout();
  });

  // ── Page basics ──────────────────────────────────────────────────────────────

  test('about page loads and has a heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('about page title includes "About" @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('about');
  });

  // ── Mission statement ────────────────────────────────────────────────────────

  test('mission statement is visible @functional', async ({ aboutPage }) => {
    const isVisible = await aboutPage.missionStatement.isVisible().catch(() => false);
    if (!isVisible) {
      // Fallback: check body text for mission keywords
      const body = await aboutPage.page.locator('body').textContent() ?? '';
      expect(
        body.toLowerCase().includes('mission') || body.toLowerCase().includes('expertise'),
        'About page should contain mission statement'
      ).toBeTruthy();
    } else {
      await expect(aboutPage.missionStatement).toBeVisible();
    }
  });

  test('amplifies human expertise messaging is present @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    expect(
      bodyText.toLowerCase().includes('amplifies') || bodyText.toLowerCase().includes('human expertise'),
      'About page should mention amplifying human expertise'
    ).toBeTruthy();
  });

  // ── Team members ─────────────────────────────────────────────────────────────

  test('Dr. Collin Sellman is mentioned on the about page @functional', async ({ aboutPage }) => {
    const isVisible = await aboutPage.teamMemberCollin.isVisible().catch(() => false);
    if (!isVisible) {
      const bodyText = (await aboutPage.page.locator('body').textContent()) ?? '';
      expect(
        bodyText.toLowerCase().includes('collin') || bodyText.toLowerCase().includes('sellman'),
        'About page should mention Collin Sellman'
      ).toBeTruthy();
    } else {
      await expect(aboutPage.teamMemberCollin).toBeVisible();
    }
  });

  test('Sean Schaefer is mentioned on the about page @functional', async ({ aboutPage }) => {
    const isVisible = await aboutPage.teamMemberSean.isVisible().catch(() => false);
    if (!isVisible) {
      const bodyText = (await aboutPage.page.locator('body').textContent()) ?? '';
      expect(
        bodyText.toLowerCase().includes('sean') || bodyText.toLowerCase().includes('schaefer'),
        'About page should mention Sean Schaefer'
      ).toBeTruthy();
    } else {
      await expect(aboutPage.teamMemberSean).toBeVisible();
    }
  });

  // ── Impact statistics ────────────────────────────────────────────────────────

  test('impact statistics (400% and 50%) are present @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    expect(
      bodyText.includes('400'),
      'About page should display the 400% teacher feedback increase'
    ).toBeTruthy();
    expect(
      bodyText.includes('50'),
      'About page should display the 50% grading time reduction'
    ).toBeTruthy();
  });

  // ── Student testimonial ──────────────────────────────────────────────────────

  test('student testimonial is present @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    // Key phrase from the testimonial: "I am capable"
    expect(
      bodyText.toLowerCase().includes('capable') || bodyText.toLowerCase().includes('python class'),
      'About page should include the student testimonial'
    ).toBeTruthy();
  });

  // ── Teacher-in-the-loop infrastructure ──────────────────────────────────────

  test('teacher-in-the-loop concept is mentioned @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    expect(
      bodyText.toLowerCase().includes('teacher-in-the-loop') ||
      bodyText.toLowerCase().includes('teacher in the loop'),
      'About page should mention teacher-in-the-loop learning infrastructure'
    ).toBeTruthy();
  });

  // ── Underserved communities focus ────────────────────────────────────────────

  test('mentions underserved communities or rural/tribal context @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    const mentionsContext =
      bodyText.toLowerCase().includes('rural') ||
      bodyText.toLowerCase().includes('tribal') ||
      bodyText.toLowerCase().includes('correctional') ||
      bodyText.toLowerCase().includes('disadvantaged') ||
      bodyText.toLowerCase().includes('austere');
    expect(mentionsContext, 'About page should describe the target communities').toBeTruthy();
  });

  // ── Images ───────────────────────────────────────────────────────────────────

  test('about page images are loaded and not broken @functional', async ({ page }) => {
    // Use all img tags (Squarespace doesn't always nest under main/article)
    const allImages = page.locator('img');
    const count = await allImages.count();
    if (count === 0) {
      console.warn('[about] No images found on /about page');
      return;
    }

    // Scroll to trigger lazy loading before checking image dimensions
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    let brokenCount = 0;
    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = allImages.nth(i);
      const isVisible = await img.isVisible().catch(() => false);
      if (!isVisible) continue;

      const src = await img.getAttribute('src') ?? '';
      // Skip SVG and tracking pixels (1×1 images)
      if (src.includes('.svg') || src.includes('pixel') || src.includes('1x1')) continue;

      const w = await img.evaluate<number>((el) => (el as HTMLImageElement).naturalWidth);
      if (w === 0) brokenCount++;
    }

    expect(brokenCount, `${brokenCount} images on About page appear broken after scrolling`).toBe(0);
  });
});

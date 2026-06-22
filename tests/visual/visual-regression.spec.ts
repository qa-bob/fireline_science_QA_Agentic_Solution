/**
 * tests/visual/visual-regression.spec.ts
 *
 * Visual regression tests — compare screenshots against stored baselines.
 * Run `npm run baseline` to capture new baselines after intentional design changes.
 *
 * Tag: @visual
 */

import { test, expect } from '@fixtures/site.fixture';
import { dismissCookieBanner } from '@utils/visual-helper';

// Shared screenshot options applied to all visual tests
const SCREENSHOT_OPTIONS = {
  maxDiffPixels: 1000,
  animations: 'disabled',
  caret: 'hide',
  // fullPage omitted — viewport-only captures are more stable on animated Squarespace sites
} as const;

/** Freeze page animations and pause videos so screenshots are stable. */
async function freezeAnimations(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => {
    // Pause all video/audio elements
    document.querySelectorAll<HTMLVideoElement>('video, audio').forEach(m => m.pause());
    // Forcibly pause CSS keyframe animations (supplement to Playwright's own animation disabling)
    const style = document.createElement('style');
    style.id = '__pw-freeze-animations';
    style.textContent =
      '*, *::before, *::after { animation-play-state: paused !important; transition-duration: 0s !important; }';
    if (!document.getElementById('__pw-freeze-animations')) {
      document.head.appendChild(style);
    }
  });
}

test.describe('Visual Regression @visual', () => {
  // Skip entire suite when site config opts out
  test.beforeEach(async ({ siteConfig }) => {
    if (siteConfig.skipVisual) {
      test.skip(true, `Visual regression skipped for "${siteConfig.name}" (skipVisual: true)`);
    }
  });

  // ── Desktop ─────────────────────────────────────────────────────────────────

  test('homepage visual regression - desktop @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });

    // Dismiss any cookie/consent banners that would interfere with comparison
    await dismissCookieBanner(page);

    // Freeze JS animations and pause videos before capturing
    await freezeAnimations(page);

    // Allow remaining transitions to settle
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      ...SCREENSHOT_OPTIONS,
    });
  });

  // ── Mobile ──────────────────────────────────────────────────────────────────

  test('homepage visual regression - mobile @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });

    await dismissCookieBanner(page);
    await freezeAnimations(page);
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      ...SCREENSHOT_OPTIONS,
    });
  });

  // ── Tablet ──────────────────────────────────────────────────────────────────

  test('homepage visual regression - tablet @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });

    await dismissCookieBanner(page);
    await freezeAnimations(page);
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      ...SCREENSHOT_OPTIONS,
    });
  });
});

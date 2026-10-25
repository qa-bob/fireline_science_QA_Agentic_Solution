/**
 * tests/visual/visual-regression.spec.ts
 *
 * Visual regression tests — compare screenshots against stored baselines.
 * Run `npm run baseline` to capture new baselines after intentional design changes.
 *
 * Each test runs only in the Playwright project whose viewport it targets, and
 * is skipped (not failed) until a baseline has been captured for it.
 *
 * Tag: @visual
 */

import * as fs from 'fs';
import { test, expect } from '@fixtures/site.fixture';
import { dismissCookieBanner } from '@utils/visual-helper';

// Shared screenshot options applied to all visual tests
const SCREENSHOT_OPTIONS = {
  maxDiffPixels: 1000,
  animations: 'disabled',
  caret: 'hide',
  // fullPage omitted — viewport-only captures are more stable on animated Squarespace sites
} as const;

const VISUAL_CASES = [
  { label: 'desktop', project: 'chromium-desktop', snapshot: 'homepage-desktop.png' },
  { label: 'mobile', project: 'mobile-chrome', snapshot: 'homepage-mobile.png' },
  { label: 'tablet', project: 'tablet', snapshot: 'homepage-tablet.png' },
] as const;

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

  for (const { label, project, snapshot } of VISUAL_CASES) {
    test(`homepage visual regression - ${label} @visual`, async ({ page, siteConfig }, testInfo) => {
      test.skip(testInfo.project.name !== project, `Runs only in the "${project}" project`);

      // Only `--update-snapshots` (all/changed) should create a missing baseline
      const isUpdating = ['all', 'changed'].includes(testInfo.config.updateSnapshots);
      const baselinePath = testInfo.snapshotPath(snapshot, { kind: 'screenshot' });
      test.skip(
        !isUpdating && !fs.existsSync(baselinePath),
        `No baseline at ${baselinePath} — run "npm run baseline" to capture one`
      );

      await page.goto(siteConfig.url, { waitUntil: 'load' });

      // Dismiss any cookie/consent banners that would interfere with comparison
      await dismissCookieBanner(page);

      // Freeze JS animations and pause videos before capturing
      await freezeAnimations(page);

      await expect(page).toHaveScreenshot(snapshot, { ...SCREENSHOT_OPTIONS });
    });
  }
});

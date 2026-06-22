import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class AboutPage extends BasePage {
  readonly pageHeading: Locator;
  readonly missionStatement: Locator;
  readonly teamMemberCollin: Locator;
  readonly teamMemberSean: Locator;
  readonly studentTestimonial: Locator;
  readonly impactStats: Locator;
  readonly bodyImages: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    // Squarespace renders headings as standard h2/h3/h4 inside content blocks
    this.pageHeading        = page.locator('h2').filter({ hasText: /about us/i });
    this.missionStatement   = page.locator('h3, p').filter({ hasText: /mission|amplifies human expertise|teacher-in-the-loop/i }).first();
    this.teamMemberCollin   = page.locator('h4, h3, p, strong').filter({ hasText: /collin sellman/i }).first();
    this.teamMemberSean     = page.locator('h4, h3, p, strong').filter({ hasText: /sean schaefer/i }).first();
    this.studentTestimonial = page.locator('blockquote, [class*="quote"], p').filter({ hasText: /capable|python class/i }).first();
    this.impactStats        = page.locator('p, div, span').filter({ hasText: /400%|50%/i }).first();
    this.bodyImages         = page.locator('main img, article img, [class*="content"] img, [role="main"] img');
  }

  async navigateToAbout(): Promise<void> {
    await this.page.goto('/about', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }
}

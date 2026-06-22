# GitHub Copilot Instructions

This is a **Playwright + TypeScript** automated test suite for [Fireline Science](https://www.firelinescience.com), following the **Page Object Model (POM)** architecture.

---

## Project Summary

- **Target site:** `https://www.firelinescience.com` (read from `site.config.json`)
- **Test runner:** Playwright with TypeScript strict mode
- **Pattern:** Page Object Model — one class per page in `src/pages/`
- **Fixtures:** Custom Playwright fixtures in `src/fixtures/site.fixture.ts`
- **Viewports:** Desktop (1280×720), Mobile Chrome (390×844), Tablet iPad (768×1024)

---

## Coding Rules

### Page Objects (`src/pages/`)

- All page classes **extend `BasePage`** from `./base.page`
- Locators are **`readonly Locator`** properties declared in the constructor
- Methods represent **user actions only** — no `expect()` inside page objects
- File naming: `<page-name>.page.ts` (e.g., `pricing.page.ts`)

```typescript
// Pattern to follow
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class PricingPage extends BasePage {
  readonly pageHeading: Locator;
  readonly planCards: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h1');
    this.planCards   = page.locator('[data-testid="plan-card"]');
  }

  async selectPlan(planName: string): Promise<void> {
    await this.planCards.filter({ hasText: planName }).click();
  }
}
```

### Test Files (`tests/`)

- Import via fixture: `import { test, expect } from '@fixtures/site.fixture'`
- **Never** use raw `page.locator()` in test bodies — use page object properties
- **Never** hardcode the site URL — use `baseURL` from the Playwright config
- **Never** call `page.waitForTimeout()` — use Playwright's auto-waiting
- **Never** submit forms — test field interactions and validation only
- Tag every test: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`

```typescript
// Pattern to follow
import { test, expect } from '@fixtures/site.fixture';

test.describe('Pricing page @functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('shows at least one pricing plan @functional', async ({ pricingPage }) => {
    await expect(pricingPage.planCards.first()).toBeVisible();
  });
});
```

### TypeScript

- Strict mode is on — avoid `any`; if necessary add `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
- Run `npx tsc --noEmit` before finishing any file change
- All locator properties must be typed as `readonly Locator`

---

## File Locations Quick Reference

| What | Where |
|------|-------|
| Site URL | `site.config.json` → `url` |
| Base class | `src/pages/base.page.ts` |
| Fixtures | `src/fixtures/site.fixture.ts` |
| Utilities | `src/utils/` |
| Type definitions | `src/types/site-config.types.ts` |
| Test config | `playwright.config.ts` |

---

## What NOT to Generate

- `page.waitForTimeout()` calls
- `page.locator()` calls inside test spec files (use page objects instead)
- Hardcoded URLs like `'https://www.firelinescience.com'` — use `baseURL`
- `expect()` calls inside page object methods
- Form submission steps (`page.click('button[type="submit"]')`)
- `any` typed variables without justification

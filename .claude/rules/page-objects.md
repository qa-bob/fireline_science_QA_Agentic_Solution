---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

These rules apply whenever Claude is reading or writing page object classes under `src/pages/`.

## Class structure

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ExamplePage extends BasePage {
  // 1. Declare all locators as readonly Locator properties
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page) {
    super(page);
    // 2. Initialize in constructor with real selectors from the live site
    this.heading   = page.locator('h1');
    this.ctaButton = page.locator('[data-testid="cta-primary"]');
  }

  // 3. Methods = user actions only — no assertions
  async clickPrimaryCTA(): Promise<void> {
    await this.ctaButton.click();
  }

  async getHeadingText(): Promise<string> {
    return this.heading.textContent() ?? '';
  }
}
```

## Naming conventions

- File: `<page-name>.page.ts` (e.g., `pricing.page.ts`, `about.page.ts`)
- Class: `<PageName>Page` (e.g., `PricingPage`, `AboutPage`)
- Locator properties: noun or noun phrase describing the element (`heroHeading`, `navLinks`, `contactForm`)
- Methods: verb or verb phrase describing the user action (`clickSubmit`, `fillEmailField`, `openMobileMenu`)

## Required

- All classes must `extend BasePage`
- All locator properties must be typed `readonly Locator`
- Constructors must call `super(page)` as the first statement
- Selectors must be based on real HTML from the live site — use `WebFetch` to verify before writing

## Prohibited

- `expect()` calls inside any page object method
- `page.waitForTimeout()` — return the action promise and let Playwright auto-wait
- Hardcoded URLs or base paths — navigation belongs in fixtures or test `beforeEach`
- Generic placeholder selectors like `.btn`, `.container`, `div:nth-child(2)`

## When to create a new page object vs. extend an existing one

- **New page object:** a distinct page with its own URL (e.g., `/about`, `/pricing`, `/contact`)
- **Extend existing:** a section or component that appears on multiple pages (add shared locators to `BasePage`)
- **New method on existing class:** a new interaction on a page that already has a class

## Export pattern

Always use named exports (not default exports):

```typescript
// Correct
export class PricingPage extends BasePage { ... }

// Wrong — avoid default exports for page objects
export default class PricingPage extends BasePage { ... }
```

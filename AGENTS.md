# AGENTS.md — AI Agent Guide

This file provides context for **all AI coding agents** working in this repository (Claude Code, GitHub Copilot, Cursor, Aider, etc.).

> Claude Code users: Claude reads `CLAUDE.md` as its primary instruction source. This file provides complementary context for non-Claude agents and serves as a human-readable agent reference.

---

## Repository Purpose

This is a **Playwright + TypeScript** automated test suite for [Fireline Science](https://www.firelinescience.com) — a digital learning platform for disadvantaged schools. The test suite validates the public-facing website across desktop, mobile, and tablet viewports.

**Target site:** `https://www.firelinescience.com`
**Config file:** `site.config.json`

---

## Architecture Summary

| Pattern | Implementation |
|---------|---------------|
| Page Object Model (POM) | One class per page/section in `src/pages/` |
| OOP Inheritance | All page classes extend `BasePage` (`src/pages/base.page.ts`) |
| Fixtures | Custom Playwright fixtures in `src/fixtures/site.fixture.ts` |
| TypeScript strict mode | `tsconfig.json` — no implicit `any` |
| Test tagging | `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive` |

---

## Claude Code Sub-Agents

These agents are defined in `.claude/agents/` and are invoked automatically by Claude Code when a task matches their description.

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

**When Claude uses it:** When asked to analyze a live website, inspect site structure, or update `site.config.json`. Triggered by `/analyze-site`.

**What it does:**
1. Navigates to the site URL from `site.config.json`
2. Extracts nav items, forms, meta tags, headings, CTAs
3. Detects authentication requirements and redirect chains
4. Outputs an updated `site.config.json`

**Tools it uses:** `WebFetch`, `Read`, `Write`

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`

**When Claude uses it:** When asked to generate site-specific test files beyond the shared framework's generic tests. Triggered by `/generate-full-suite`.

**What it does:**
1. Reads `site.config.json` to understand site structure
2. Identifies gaps in existing test coverage
3. Generates page object additions or new page object classes
4. Writes `tests/custom/<feature>.spec.ts` files

**Tools it uses:** `Read`, `Write`, `WebFetch`, `Glob`, `Grep`

---

## Slash Commands (Skills)

These commands are defined in `.claude/commands/` and are invoked with `/command-name` in Claude Code.

| Command | File | Description |
|---------|------|-------------|
| `/analyze-site` | `analyze-site.md` | Crawl the site and update `site.config.json` |
| `/generate-full-suite` | `generate-full-suite.md` | Generate complete POM classes and test files |
| `/run-smoke` | `run-smoke.md` | Run smoke tests and display pass/fail table |
| `/update-baseline` | `update-baseline.md` | Refresh visual regression baseline screenshots |
| `/generate-report` | `generate-report.md` | Parse results and print a structured summary |

---

## Coding Conventions (for AI Agents)

### Page Object Rules

```typescript
// CORRECT — locators as readonly properties, methods as user actions
export class MyPage extends BasePage {
  readonly heading: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();  // Action only — no assertions here
  }
}
```

```typescript
// WRONG — do not put assertions in page objects
async verifyHeading(): Promise<void> {
  await expect(this.heading).toBeVisible(); // ← NEVER do this
}
```

### Test File Rules

```typescript
// CORRECT — import via fixture, use page object methods
import { test, expect } from '@fixtures/site.fixture';

test('heading is visible @smoke', async ({ homePage }) => {
  await expect(homePage.heroHeading).toBeVisible();
});
```

```typescript
// WRONG — raw page.locator() in test body
test('heading is visible', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible(); // ← bypass POM — not allowed
});
```

### Selector Strategy (in priority order)

1. `data-testid` attributes (most stable)
2. ARIA roles: `page.getByRole('button', { name: 'Contact' })`
3. Visible text: `page.getByText('Submit')`
4. CSS classes only when semantic selectors unavailable

### What Agents Must Never Do

- Submit any form (`page.click('button[type="submit"]')` is forbidden)
- Create accounts or enter real credentials
- Hardcode `https://www.firelinescience.com` in test files (use `baseURL`)
- Use `page.waitForTimeout()` (use `waitForSelector` or auto-waiting)
- Add `expect()` calls inside page object methods
- Use `any` type without an explicit `// eslint-disable-next-line` justification

---

## Test File Generation Pattern

When generating a new test file, always follow this structure:

```typescript
/**
 * Tests for: <Feature Name>
 * Site: Fireline Science (https://www.firelinescience.com)
 * Coverage: <what this tests and why it is needed>
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('<Feature> @<tag>', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');  // or the relevant path
  });

  test('<specific assertion> @<tag>', async ({ page, homePage }) => {
    // Use page object methods and locators
    await expect(homePage.heroHeading).toBeVisible();
  });
});
```

---

## Path Map (Quick Reference for AI Agents)

| What you need | Where to find it |
|---------------|-----------------|
| Target site URL | `site.config.json` → `url` |
| Base page class | `src/pages/base.page.ts` |
| Custom fixtures | `src/fixtures/site.fixture.ts` |
| TypeScript config | `tsconfig.json` |
| Test scripts | `package.json` → `scripts` |
| Playwright config | `playwright.config.ts` |
| Visual snapshots | `__snapshots__/` |
| Test results | `test-results/results.json` |
| HTML report | `playwright-report/index.html` |

---

## GitHub Copilot Instructions

See `.github/copilot-instructions.md` for Copilot-specific context and code completion guidance.

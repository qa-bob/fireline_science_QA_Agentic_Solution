---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Playwright Test Rules

These rules apply whenever Claude is reading or writing test spec files under `tests/`.

## Required: Test structure

- Import via the custom fixture: `import { test, expect } from '@fixtures/site.fixture'`
- Never use raw `page.locator()` inside test bodies — use page object properties from the fixture
- Never hardcode the base URL — use `baseURL` from the Playwright config (set from `site.config.json`)
- Wrap related tests in a `test.describe()` block with the feature name and a tag in the title
- Use `test.beforeEach()` for navigation shared across tests in a describe block

## Required: Test tagging

Every test must carry at least one tag in its title string:

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, HTTPS, title present, no critical JS errors |
| `@navigation` | Nav links, routing, menus, breadcrumbs |
| `@forms` | Form fields, validation, error states |
| `@functional` | Business features: accordions, video, CTAs, search |
| `@visual` | Screenshot regression via `toHaveScreenshot()` |
| `@responsive` | Layout at specific viewport sizes |

Example: `test('hero CTA is visible @smoke @functional', async ({ homePage }) => {`

## Prohibited

- `page.waitForTimeout()` — use `await expect(locator).toBeVisible()` or `waitForSelector`
- Submitting any form — test interaction and validation only
- Credentials, account creation, or real user data
- `expect()` calls inside imported page object methods
- Hardcoded timeouts beyond what Playwright's `expect.timeout` config sets

## Visual tests

- Use `await expect(page).toHaveScreenshot('descriptive-name.png', { fullPage: false })`
- Run `/update-baseline` after intentional design changes before committing
- Visual tests should use `test.skip()` when `siteConfig.skipVisual` is true

## Selector fallback order (when page objects don't have what you need)

1. `getByTestId()` — `data-testid` attributes
2. `getByRole()` — ARIA roles with name
3. `getByText()` — visible text
4. `locator('[data-testid="..."]')` — explicit test ID
5. CSS class selectors (last resort — fragile)

# Fireline Science — QA Agentic Solution

Automated regression test suite for [Fireline Science](https://www.firelinescience.com) built with **Playwright + TypeScript**, following the **Page Object Model (POM)** design pattern and **Object-Oriented Programming (OOP)** principles.

This repository is optimized for agentic execution by Claude Code and supports AI-assisted test generation, analysis, and maintenance.

---

## Company

| Field | Details |
|-------|---------|
| **Company** | Fireline Science |
| **Website** | [firelinescience.com](https://www.firelinescience.com) |
| **Description** | Digital learning platform for disadvantaged schools |
| **Founded** | 2019 |
| **Leaders** | Collin Sellman (CEO), Sean Schaefer (CTO) |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation and test runner |
| TypeScript (strict) | Type-safe test code |
| Page Object Model | OOP abstraction layer for UI interactions |
| GitHub Actions | CI/CD — automated test runs on every PR |
| Claude Code | Agentic test generation and maintenance |

---

## Development Environment Setup

### Prerequisites

- **Node.js 18+** ([download](https://nodejs.org/))
- **npm 9+** (bundled with Node.js)
- **Git**
- **Claude Code** (for agentic workflows) — install from [code.claude.com](https://code.claude.com)

### 1. Clone the repository

```bash
git clone https://github.com/<org>/fireline_science_QA_Agentic_Solution.git
cd fireline_science_QA_Agentic_Solution
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install --with-deps
```

### 4. Verify the site configuration

Open `site.config.json` — it is pre-configured for Fireline Science:

```json
{
  "name": "Fireline Science",
  "url": "https://www.firelinescience.com",
  "hasContactForm": true,
  "viewports": ["desktop", "mobile", "tablet"]
}
```

No changes needed for standard Fireline Science testing.

### 5. (Optional) Copy the environment file

```bash
cp .env.example .env
```

See `.env.example` for available environment variables (e.g., `SITE_URL` override).

---

## Running Tests

```bash
npm test                    # All tests (desktop + mobile + tablet)
npm run test:smoke          # @smoke — site availability
npm run test:navigation     # @navigation — nav links, routing
npm run test:forms          # @forms — form validation
npm run test:visual         # @visual — screenshot regression
npm run test:responsive     # @responsive — viewport layout
npm run test:headed         # Run with visible browser (debug)
npm run report              # Open the Playwright HTML report
npm run baseline            # Update visual regression baselines
npm run lint                # ESLint
npm run typecheck           # TypeScript check (no emit)
```

> Tests run across **three Playwright projects**: `chromium-desktop` (1280×720), `mobile-chrome` (390×844), and `tablet` (768×1024).

---

## Architecture

### Page Object Model (POM)

Every page or major UI section has a dedicated class in `src/pages/`. Classes encapsulate locators and user-action methods. Tests consume page objects via custom fixtures — never raw `page.locator()` calls in spec files.

```
OOP Hierarchy
─────────────
BasePage (src/pages/base.page.ts)
  ├── HomePage        (src/pages/home.page.ts)
  ├── NavigationPage  (src/pages/navigation.page.ts)
  └── ContactFormPage (src/pages/contact.page.ts)
       └── <DiscoveredPage>.page.ts  (generated per site feature)
```

**POM Pattern:**

```typescript
// src/pages/home.page.ts
export class HomePage extends BasePage {
  readonly heroHeading: Locator;   // Encapsulated locator
  readonly ctaButton: Locator;     // Encapsulated locator

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.locator('h1');
    this.ctaButton  = page.locator('[data-testid="hero-cta"]');
  }

  // Method = user action, not assertion
  async clickPrimaryCTA(): Promise<void> {
    await this.ctaButton.click();
  }
}
```

**Test consuming the page object:**

```typescript
// tests/functional/hero.spec.ts
import { test, expect } from '@fixtures/site.fixture';

test('CTA button is visible @functional', async ({ homePage }) => {
  await expect(homePage.ctaButton).toBeVisible();
});
```

### Project Directory Layout

```
fireline_science_QA_Agentic_Solution/
│
├── site.config.json            # Target site URL and feature flags
├── playwright.config.ts        # Playwright projects (desktop/mobile/tablet)
├── global-setup.ts             # Pre-test reachability check
│
├── src/
│   ├── pages/
│   │   ├── base.page.ts        # BasePage — shared helpers and navigation
│   │   ├── home.page.ts        # HomePage
│   │   ├── navigation.page.ts  # NavigationPage
│   │   └── contact.page.ts     # ContactFormPage
│   ├── fixtures/
│   │   └── site.fixture.ts     # Custom fixtures exposing page objects
│   ├── utils/
│   │   ├── link-checker.ts     # HTTP status checker for nav links
│   │   └── visual-helper.ts    # Screenshot helpers
│   └── types/
│       └── site-config.types.ts # SiteConfig TypeScript interface
│
├── tests/
│   ├── smoke/
│   │   └── site-availability.spec.ts   # @smoke
│   ├── navigation/
│   │   └── nav-links.spec.ts           # @navigation
│   ├── forms/
│   │   └── contact-form.spec.ts        # @forms
│   ├── functional/
│   │   └── <feature>.spec.ts           # @functional (one per feature)
│   ├── visual/
│   │   └── visual-regression.spec.ts   # @visual
│   └── responsive/
│       └── layout.spec.ts              # @responsive
│
├── .claude/
│   ├── agents/                 # Claude Code sub-agent definitions
│   │   ├── site-analyzer.md    # Crawls site, updates site.config.json
│   │   └── test-generator.md  # Generates site-specific test files
│   ├── commands/               # Slash command implementations
│   │   ├── analyze-site.md     # /analyze-site
│   │   ├── generate-full-suite.md # /generate-full-suite
│   │   ├── run-smoke.md        # /run-smoke
│   │   ├── update-baseline.md  # /update-baseline
│   │   └── generate-report.md  # /generate-report
│   ├── rules/                  # Path-scoped coding rules
│   │   ├── playwright-tests.md # Rules that apply to tests/**/*.spec.ts
│   │   └── page-objects.md     # Rules that apply to src/pages/**/*.ts
│   └── hooks/
│       └── pre-test.sh         # Pre-test hook (lint/type-check gate)
│
└── .github/
    ├── workflows/
    │   ├── playwright.yml      # Full test suite on PR / push to main
    │   └── smoke.yml           # Daily smoke test against live site
    ├── ISSUE_TEMPLATE/
    │   ├── bug-report.md       # Bug report template
    │   └── test-request.md     # New test coverage request
    ├── PULL_REQUEST_TEMPLATE.md
    ├── CODEOWNERS
    └── copilot-instructions.md # GitHub Copilot context
```

---

## Test Categories

| Tag | Directory | Purpose |
|-----|-----------|---------|
| `@smoke` | `tests/smoke/` | Site loads, HTTPS, title present, no critical JS errors |
| `@navigation` | `tests/navigation/` | Nav links resolve, no 404s, routing works |
| `@forms` | `tests/forms/` | Form field interactions and validation (never submit) |
| `@functional` | `tests/functional/` | Business features: accordions, video embeds, CTAs |
| `@visual` | `tests/visual/` | Screenshot regression via `toHaveScreenshot()` |
| `@responsive` | `tests/responsive/` | Layout integrity at mobile, tablet, and desktop |

---

## Agents, Skills, and Commands

This repo is configured for **Claude Code agentic execution**. The following reference files explain all available automation:

| File | Description |
|------|-------------|
| [`AGENTS.md`](./AGENTS.md) | All AI agents (Claude Code + GitHub Copilot) and when to use them |
| [`SKILLS.md`](./SKILLS.md) | All slash commands/skills and their step-by-step behavior |
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code project instructions (read by Claude at session start) |
| [`.claude/agents/`](./.claude/agents/) | Sub-agent YAML + prompt definitions |
| [`.claude/commands/`](./.claude/commands/) | Slash command implementations |
| [`.claude/rules/`](./.claude/rules/) | Path-scoped coding rules |

### Quick Command Reference

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawl the live site and update `site.config.json` |
| `/generate-full-suite` | Analyze the site and generate all POM classes + test files |
| `/run-smoke` | Run smoke tests and display a formatted pass/fail table |
| `/update-baseline` | Refresh visual regression baseline screenshots |
| `/generate-report` | Parse `test-results/results.json` and print a summary |

---

## .github Folder Reference

| Path | Purpose |
|------|---------|
| `workflows/playwright.yml` | Runs the full test suite on every PR and push to `main` |
| `workflows/smoke.yml` | Scheduled daily smoke test (06:00 UTC) |
| `PULL_REQUEST_TEMPLATE.md` | Pre-filled PR checklist for contributors |
| `ISSUE_TEMPLATE/bug-report.md` | Structured bug report (links to failing test, selector, expected behavior) |
| `ISSUE_TEMPLATE/test-request.md` | Request for new or expanded test coverage |
| `CODEOWNERS` | Auto-assigns reviewers based on changed file paths |
| `copilot-instructions.md` | Context file read by GitHub Copilot for AI-assisted code authoring |

---

## Contributor Rules

### Workflow

1. Create a feature branch: `git checkout -b feat/test-<feature-name>`
2. Read `site.config.json` before writing any selectors
3. Use real selectors from the live site — never placeholder CSS classes
4. Write or update the relevant page object class in `src/pages/`
5. Write tests that consume the page object via the site fixture
6. Run `npm run typecheck` and `npm run lint` — both must pass
7. Run the relevant test suite: `npm run test:<category>`
8. Open a PR using the provided template (`.github/PULL_REQUEST_TEMPLATE.md`)
9. At least one reviewer approval required before merge

### Absolute Rules

| Rule | Why |
|------|-----|
| Never submit any form | Avoids sending junk data to the real site |
| Never create accounts or log in | Auth tests require explicit config; see `auth.required` in `site.config.json` |
| Never hardcode the base URL | Always use `baseURL` from Playwright config |
| Never put `expect()` in page objects | Assertions belong in test files only |
| Never use `page.waitForTimeout()` | Use Playwright's auto-waiting or `waitForSelector` |
| Never use `any` without a comment | TypeScript strict mode is enforced |
| Tag every test | At least one of `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive` |

---

## CI/CD

GitHub Actions runs tests automatically:

- **On every PR** — full suite across desktop, mobile, tablet (3 Playwright projects)
- **Daily at 06:00 UTC** — smoke tests against the live site
- **On push to `main`** — full regression suite

Reports and traces are uploaded as GitHub Actions artifacts on every run.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Selector errors | Run `/analyze-site` — the site may have changed |
| Visual test failures | Intentional redesign? Run `/update-baseline` to refresh baselines |
| `npm install` fails | Verify Node.js 18+ is installed: `node --version` |
| Playwright browser errors | Run `npx playwright install --with-deps` |
| TypeScript errors | Run `npm run typecheck`; fix all errors before committing |
| Tests time out | Check site reachability; increase `timeout` in `playwright.config.ts` if needed |

---

*Part of the Phoenix Startup QA Agentic Solutions project.*

# SKILLS.md — Claude Code Slash Commands Reference

This file documents all slash commands (skills) available in this repository when using **Claude Code**.

Skills are defined as markdown files in `.claude/commands/`. Invoke them by typing `/command-name` in a Claude Code session.

---

## Available Commands

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Crawls the live Fireline Science website and produces an updated `site.config.json`.

**When to use:**
- Onboarding this repo for the first time
- After a site redesign that may have changed nav structure, forms, or page content
- When tests fail due to selector drift

**Steps Claude takes:**
1. Reads `site.config.json` for the current URL
2. Navigates to the site using `WebFetch`
3. Extracts: page title, meta description, nav links, forms, H1, CTAs
4. Checks `/contact`, `/contact-us` for form presence
5. Assesses HTTPS, responsiveness, and auth requirements
6. Outputs an updated `site.config.json` + an issues checklist

**Output:** Updated JSON block + issues list with confidence rating

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyzes the live site and generates a complete set of Page Object Model classes and test files covering all discoverable features.

**When to use:**
- Initial setup of test coverage for a new site or redesign
- When significant new features have been added to the site

**Steps Claude takes:**
1. Runs `/analyze-site` internally to get current site structure
2. Identifies all pages linked from the main nav
3. Crawls each page to discover: forms, accordions, videos, pricing tables, modals, CTAs
4. Creates or updates page object classes in `src/pages/`
5. Writes test files in `tests/smoke/`, `tests/navigation/`, `tests/forms/`, `tests/functional/`, `tests/visual/`, `tests/responsive/`
6. Runs `npx tsc --noEmit` to verify TypeScript compiles

**Output:** List of all generated/updated files + TypeScript compile status

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs the smoke test suite (`@smoke`) and displays a formatted pass/fail summary.

**When to use:**
- Quick sanity check after site changes
- Daily health check
- Before merging a PR that doesn't touch selectors

**Steps Claude takes:**
1. Runs `npm run test:smoke`
2. Parses `test-results/results.json`
3. Displays a formatted table: Test | Status | Duration
4. Lists any failures with error messages and suggested fixes
5. Exits with the same code as the test runner (0 = pass, 1 = fail)

**Suggested fixes by failure type:**

| Failure | Suggestion |
|---------|-----------|
| HTTP 4xx/5xx | Check hosting/DNS — site may be down |
| Load time > 10s | Run Lighthouse audit; check large images or blocking JS |
| Console errors | Inspect DevTools on the live site |
| HTTP (not HTTPS) | Configure SSL/TLS on the host |
| Missing meta description | Add `<meta name="description">` to site `<head>` |

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Captures new visual regression baseline screenshots after intentional design changes.

**When to use:**
- After a deliberate redesign or content update has been verified
- After changing viewport sizes in `playwright.config.ts`
- First time setting up visual tests for this repo

**Steps Claude takes:**
1. Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
2. Lists all updated files in `__snapshots__/`
3. Reminds you to review new screenshots before committing

**Important:** Always visually review baselines before committing. Committing unreviewed baselines defeats the purpose of visual regression testing.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses the latest Playwright results and displays a structured test summary.

**When to use:**
- After any test run to get a quick overview
- To identify flaky tests or patterns in failures
- For sharing test results with stakeholders

**Steps Claude takes:**
1. Parses `test-results/results.json`
2. Displays a table grouped by test suite (`@smoke`, `@navigation`, etc.)
3. Lists all failed tests with error messages
4. Lists flaky tests with retry information
5. Suggests next steps for failures

**Output format:**

```
+------------------+-------+--------+---------+-------+
| Suite            | Total | Passed | Failed  | Flaky |
+------------------+-------+--------+---------+-------+
| @smoke           |     5 |      5 |       0 |     0 |
| @navigation      |     4 |      3 |       1 |     0 |
...
```

---

## How Claude Decides When to Use a Sub-Agent vs. a Skill

| Mechanism | How it works | Use for |
|-----------|-------------|---------|
| **Skills** (slash commands) | Invoked explicitly with `/command-name` | Repeatable workflows you trigger on demand |
| **Sub-agents** | Claude automatically delegates tasks that match the agent's `description` | Specialized tasks Claude handles internally |

Sub-agents are defined in `.claude/agents/`. They run in their own context window, preserving the main conversation window for your work.

---

## Writing a New Skill

To add a new slash command:

1. Create a file at `.claude/commands/<command-name>.md`
2. Use the first H1 as the command name: `# /command-name`
3. Include sections: **Usage**, **What this command does** (numbered steps), **Output format**
4. Keep commands focused on one workflow

Example skeleton:

```markdown
# /my-command

Brief description of what this command does.

## Usage

\`\`\`
/my-command [optional-args]
\`\`\`

## What this command does

1. Step one
2. Step two
3. Step three

## Output format

Description of what Claude will display when done.
```

---

## Related Files

| File | Purpose |
|------|---------|
| [`AGENTS.md`](./AGENTS.md) | All agents (sub-agents + skills) overview |
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code project instructions |
| [`.claude/agents/`](./.claude/agents/) | Sub-agent definitions |
| [`.claude/commands/`](./.claude/commands/) | Slash command implementations |
| [`.claude/rules/`](./.claude/rules/) | Path-scoped coding rules |

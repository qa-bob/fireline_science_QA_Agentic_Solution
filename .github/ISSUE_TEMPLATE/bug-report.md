---
name: Bug report — failing test
about: Report a test that is failing incorrectly or a test framework bug
title: 'fix: <test name> fails on <project/viewport>'
labels: bug, test-failure
assignees: ''
---

## Failing test

**Test file:** `tests/<category>/<filename>.spec.ts`
**Test name:** (paste the full test title)
**Playwright project:** chromium-desktop / mobile-chrome / tablet

## Error output

```
Paste the full error from the Playwright terminal or HTML report here
```

## Steps to reproduce

1. Run `npm run test:<category>` (or `npm test`)
2. Observe the failure in the `<test name>` test

## Expected behavior

<!-- What should the test assert, and what outcome do you expect? -->

## Actual behavior

<!-- What is actually happening? Selector not found? Wrong text? Timeout? -->

## Environment

- **Node.js version:** (run `node --version`)
- **Playwright version:** (run `npx playwright --version`)
- **OS:** Windows / macOS / Ubuntu
- **Branch:** `main` / `feat/...`

## Possible cause

<!-- Is this a selector drift (site changed HTML)? A timing issue? A logic error in the test? -->
- [ ] Site HTML changed — selector no longer exists
- [ ] Test logic error — assertion is incorrect
- [ ] Timing/flakiness — test is unstable
- [ ] Environment issue — works locally but fails in CI
- [ ] Other (describe below)

## Suggested fix

<!-- Optional: What change do you think would fix this? -->

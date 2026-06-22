## Summary

<!-- What does this PR change and why? -->

## Type of change

- [ ] New test coverage (new spec file or new tests in existing file)
- [ ] Page object update (new locators or methods in `src/pages/`)
- [ ] Bug fix (correcting a failing or flaky test)
- [ ] Visual baseline update (updated screenshots in `__snapshots__/`)
- [ ] Config/infrastructure change (workflow, Playwright config, fixtures)
- [ ] Documentation update

## Test categories affected

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

## Checklist

### Authoring

- [ ] Selectors are based on the live site's actual HTML (not placeholders)
- [ ] All new tests are tagged with at least one of the tags above
- [ ] Page objects in `src/pages/` are used — no raw `page.locator()` in test bodies
- [ ] No hardcoded URLs — `baseURL` is used throughout
- [ ] No `page.waitForTimeout()` calls — Playwright auto-waiting is used
- [ ] No form submissions — only field interactions and validation are tested
- [ ] No credentials or account creation in any test

### Code quality

- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run lint` passes with no errors or warnings
- [ ] TypeScript strict mode — no `any` types without justification

### Test results

- [ ] Ran `npm run test:<category>` locally — all tests pass
- [ ] If visual tests changed: baselines reviewed and intentional (`/update-baseline` was run)
- [ ] No regressions in test categories not directly related to this PR

## Related issues

<!-- Closes #<issue-number> -->

## Screenshots / Playwright report excerpts (optional)

<!-- Paste a snippet from the Playwright HTML report or attach a screenshot if relevant -->

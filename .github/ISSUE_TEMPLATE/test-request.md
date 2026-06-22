---
name: Test coverage request
about: Request new or expanded test coverage for a site feature
title: 'feat: add tests for <feature name>'
labels: enhancement, test-request
assignees: ''
---

## Feature to test

**Page / URL path:** (e.g., `/about`, `/resources`)
**Feature name:** (e.g., "Team section", "Resource download links", "FAQ accordion")

## What should be tested

<!-- Describe the specific behaviors, elements, or interactions that need test coverage -->

- [ ] Page loads without errors
- [ ] Navigation links are reachable
- [ ] Form fields and validation
- [ ] Interactive elements (accordion, tabs, video, modal)
- [ ] Layout at mobile / tablet / desktop
- [ ] Visual regression snapshot
- [ ] Other: ___

## Why this coverage is needed

<!-- What risk does this test address? What could break without it? -->

## Suggested test category

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

## Additional context

<!-- Screenshots, links to the feature, or notes about edge cases to consider -->

## Acceptance criteria

<!-- What must be true for this issue to be considered done? -->

- [ ] Page object class created or updated in `src/pages/`
- [ ] Test file created in `tests/<category>/`
- [ ] All new tests tagged appropriately
- [ ] `npm run typecheck` and `npm run lint` pass
- [ ] Tests pass locally across all three Playwright projects

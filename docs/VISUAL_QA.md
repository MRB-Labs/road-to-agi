# Visual QA

The site has several automated guards, but visuals still need a deliberate
human pass before publishing important changes.

## Required viewports

- Desktop: 1440 x 950.
- Tablet-ish: 1024 x 768.
- Mobile: 390 x 844.

## Required themes

- Light.
- Dark.

## Required pages

- Overview.
- The infrastructure.
- Investor space.
- Projects.
- Method.
- Sources.

## Overview-specific checks

- Atlas loads.
- Earth is independent and no rectangular image background is visible.
- Atlas labels do not overlap card symbols.
- Route labels are not cut off.
- Search highlights the expected layer/cards/routes.
- ESC/click outside clears a selected search or layer.
- The loop section matches the current theme.
- The chokepoint/moat section matches the current theme.

## What automation covers

- `scripts/check-visual-contract.py` protects selectors and theme tokens that
  the design depends on.
- `scripts/check-a11y.py` protects basic shell accessibility.
- `scripts/check-performance.py` prevents accidental heavy assets.
- `scripts/check-site-links.py` prevents broken local links/assets.
- `scripts/check-browsers.py` (run in CI) loads every public page in Chromium,
  Firefox and WebKit at 1440 and 390 wide. It fails on script errors, failed or
  remote requests, a page wider than a phone, an atlas that does not draw, and
  a planet that does not open, close or that shows a focus rectangle. It also
  runs axe-core against `content/a11y-baseline.json`, which may only improve.

None of these are screenshot diffs. Now that CI has a browser dependency,
screenshot comparison is the natural next step.


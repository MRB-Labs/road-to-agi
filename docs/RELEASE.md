# Release checklist

Use this before a public revision, and whenever a large visual/content change
lands. The goal is boring releases: every step should be repeatable.

## 1. Content and data

- Run `python3 build-content.py --check`.
- Run `python3 brand/build-companies.py --check`.
- Run `python3 check-content.py`.
- Run `python3 scripts/check-figures.py`.
- If wording changes are intentional, accept only the affected baseline after
  reviewing the diff.
- If figures change, confirm the source date or leave the claim covered by its
  existing layer-level as-of statement.

## 2. Site integrity

- Run `python3 scripts/check-site-links.py`.
- Run `python3 scripts/check-metadata.py`.
- Run `python3 scripts/check-offline.py`.
- Run `python3 scripts/check-public-surface.py`.
- Run `python3 scripts/check-performance.py`.
- Run `python3 scripts/check-a11y.py`.
- Run `python3 scripts/check-visual-contract.py`.
- Run `python3 scripts/check-browsers.py` if Playwright is installed locally.
  CI always runs it: every page in Chromium, Firefox and WebKit, at desktop and
  phone width, plus an accessibility audit that may only improve.

## 3. Atlas and visuals

- Run `python3 scripts/check-atlas.py`.
- Preview the overview at desktop and mobile widths.
- Check both light and dark themes.
- Click several atlas cards and search at least one company ticker.
- Open the loop and matrix sections and check they still match the theme.

See `docs/VISUAL_QA.md` for the visual pass.

## 4. Cache and publish

- Run `python3 bump-assets.py` after any CSS, JS, image or footer change.
- Run `git diff --check`.
- Push to a branch and open a pull request when the change is not trivial.
  CI runs every guard and the browser tests on it without deploying.
- Let CI pass.
- Merge/push to `main`.
- Confirm the deploy went green.
- Run the live canary manually after important releases:

```bash
python3 scripts/check-live.py
```

- The external citation checker runs by itself every Monday
  (`.github/workflows/links.yml`) and keeps one "Dead source links" issue
  open while anything is dead. To run it by hand:

```bash
python3 scripts/check-links.py
```

## 5. Revision discipline

- Bump `content/REVISION` only for a named public revision, and move the
  **Unreleased** section of `CHANGELOG.md` under that revision's heading.
- Use `python3 bump-assets.py --today` only when you want the public updated
  date to move.
- Tag named revisions:

```bash
git tag -a v10 -m "Revision 10"
git push --tags
```

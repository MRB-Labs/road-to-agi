# Publishing model

The site is a static report published by GitHub Pages from `main`.

## Environments

- `main` is production.
- `preview` is for work that should receive CI checks before production.
- Local editing happens through the files in this repository and, for the atlas,
  through the local visual editor at `http://127.0.0.1:8766/atlas-editor.html`.

## Public surface

The deploy workflow stages a clean `_site` directory and excludes:

- `.git/`
- `.github/`
- `_site/`
- `CLEAN/`
- `.DS_Store`
- `atlas-editor.*`
- `*.py`

That means the visual editor and build scripts are development tools, not part
of the published site. `scripts/check-public-surface.py` guards this boundary.

## Deployment

Every push to `main` runs the same guard job before Pages deploys. If a guard
fails, the old site stays live. This is intentional: production should fail
closed.

The live canary runs daily against the published URL. It checks that the site,
core assets, sitemap and fundamentals data are reachable after deployment.

## Domain migration later

When a custom domain is chosen, update:

- Canonical URLs in every page.
- Open Graph URLs and image URLs.
- `robots.txt`.
- `sitemap.xml`.
- `scripts/check-live.py` base URL.
- Any deployment settings in GitHub Pages.

Then run the full release checklist.


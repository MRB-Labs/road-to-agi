# Road to AGI

An infrastructure investment thesis: what artificial intelligence is physically
built on, layer by layer, and where in each value chain an investor can capture
value. Published with GitHub Pages from `main`.

## The pages

| Page | What it holds |
|---|---|
| `index.html` | The interactive AI infrastructure atlas, the loop, and the chokepoint-and-moat scatter |
| `stack.html` | The ten layers: description, value chain and materials for each |
| `investor.html` | Thesis, companies and risks for each layer, and the general risk case |
| `markets.html` | Deployment, integration and end markets — the commercial system |
| `environment.html` | Environmental impact by layer, with what is measured badly |
| `projects.html` | Two fully costed build projects |
| `method.html` | Method, evidence hierarchy and the full source register |
| `sources.html` | The standalone source register, linked from Method |

## Working on it

There is no build step for the site itself — the pages load `style.css` and
`script.js` directly. What there is, is a set of generators and guards.

```bash
python3 brand/build-companies.py     # company map, from brand/COMPANY_VALUE_CHAIN_DATABASE.md
python3 build-content.py             # split the content per page, write the no-script summaries
python3 bump-assets.py               # re-stamp cache-busting hashes — run this last, always
python3 bump-assets.py --today       # …and move the footer's last-updated date
```

### Before pushing

```bash
python3 build-content.py --check         # the per-page content files are current
python3 scripts/check-atlas.py           # the atlas layout is sound
python3 brand/build-companies.py --check # the company map matches its database
python3 check-content.py                 # wording matches the approved baseline
python3 scripts/check-figures.py         # no new figure lacks a date
python3 scripts/check-offline.py         # no page fetches assets from another server
python3 scripts/check-site-links.py      # local links, anchors and assets resolve
python3 scripts/check-metadata.py        # SEO/social metadata and icons are present
python3 scripts/check-a11y.py            # basic accessibility shell is sound
python3 scripts/check-visual-contract.py # load-bearing visual selectors exist
python3 scripts/check-performance.py     # size budgets are respected
python3 scripts/check-public-surface.py  # local editor/tools stay out of deploy
```

All guards run in CI, and **the site is published only if they all pass** — the
deploy is a job in the same workflow, so a broken commit leaves the previous
version live rather than replacing it. If a guard reports a change you
intended, approve it with `--accept`.

`scripts/check-live.py` runs on a daily schedule against the published page: it
is the only guard that can catch a deploy that half-worked, an asset that
404s, or the market refresh quietly stopping.

`scripts/check-links.py` is the slower external citation checker. It is useful
for link-rot reviews, but is not part of the deploy gate because source sites
can block robots or be temporarily unreachable.

### Publishing a revision

Pages serves `main` directly, so a push is a deploy. Tag each published
revision so there is something to go back to:

```bash
git tag -a v10 -m "Revision 10" && git push --tags
```

Bump `content/REVISION` when the number changes; `bump-assets.py` writes it
into the footer of every page.

### Branches

`main` is published. Work on `preview` and open a pull request — CI runs the
guards there, which is the point of the branch.

## Where things are decided

| Question | Answer lives in |
|---|---|
| What the ten layers are, and why | `assets/taxonomy.js`, and each layer's own description |
| Which companies appear at each stage | `brand/COMPANY_VALUE_CHAIN_DATABASE.md` |
| Where a database position maps to | `brand/stage_map.py` |
| How the overview's atlas is built | `assets/atlas/README.md` |
| The atlas/data model in one page | `docs/ATLAS_DATA_MODEL.md` |
| The public release checklist | `docs/RELEASE.md` |
| Publishing and deployment rules | `docs/PUBLISHING.md` |
| Ongoing maintenance routine | `docs/MAINTENANCE.md` |
| Manual visual QA checklist | `docs/VISUAL_QA.md` |
| The exact wording of everything | `content/copy-snapshot.json` |
| Company logos and their rights | `brand/README.md` |
| The rules Claude Code works to here | `CLAUDE.md` |
| What may be reused, and on what terms | `LICENSE` |
| How many figures still lack a date | `content/figures-baseline.json` |
| Which content tables each page needs | `content/page-tables.json`, derived per `scripts/probe-page-deps.md` |
| What is deliberately not in the repo | the source databases, kept outside the repository |
| Open work | `TODO.md` |

## Data and rights

Market quotes and charts come from TradingView, embedded in the company
dialog — the only third-party runtime dependency, declared in
`scripts/check-offline.py`. Fundamentals come from Financial Modeling Prep
through a scheduled job, and are stored in `assets/market/fundamentals.json`;
coverage is partial and stated on the page.

Company logos in `assets/logos/` are vendored, not hotlinked, and remain the
trademarks of their owners; they identify the businesses named and are not an
endorsement. Element photographs are from Chemical Elements — A Virtual Museum
under CC BY 3.0, credited on the Method page.

Nothing here is investment advice.

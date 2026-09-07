# Company identity and the market map

This report carries its own company data and its own identity assets. Nothing
here reaches a logo API, a CDN, a company website or any other provider — at
build time or at run time.

```bash
python3 brand/build-companies.py           # rebuild assets, registry and site data
python3 brand/build-companies.py --check   # fail if the repository is out of date
python3 bump-assets.py                     # re-stamp the asset hashes afterwards
```

## What is generated

| Output | What it is |
|---|---|
| `assets/company-logos/<id>/icon.svg` | One local SVG identity tile per entity |
| `brand/company_registry.csv` | One row per entity: id, status, ticker, country, domain, asset, origin, rights |
| `script.js` (between markers) | `BRAND`, `MARKET_MAP` and the `CT` additions |

The block inside `script.js` sits between `BEGIN generated-company-data` and
`END generated-company-data`. **Do not edit it there** — `--check` will tell you
if someone has, and the next build would overwrite it.

## Sources

`AI_INFRASTRUCTURE_COMPANY_AND_LOGO_DATABASE_V2/` is the source of truth for
companies, tickers, entity status and value-chain placement. It is a curated
market map, not an exhaustive registry, and inclusion means relevance rather
than market leadership, endorsement or investment suitability.

It does not carry every company this report already names — Ajinomoto and
Fujikura among them, and Ajinomoto is a named sole-source chokepoint in layer 3.
Those entities keep working: the builder generates a tile for them in the same
deterministic style, and the registry records `origin=report` rather than
`origin=database` so the difference stays visible.

## The marks are not logos

Every tile is a **neutral identifier** — initials on a colour derived from the
entity id — not an official trademark. That is deliberate: it is what makes the
report self-contained and free of anyone's usage terms.

An official mark may replace a tile only after it has been obtained from the
company's own brand or media kit, and only once its source URL, retrieval date,
licence, variant and checksum are recorded in the registry. Until then the
`rights_status` column says exactly what the asset is. Logos remain the
trademarks of their owners.

Generic groups — "Hyperscalers", "Utilities", "Frontier labs" and the like —
get no mark at all. They are categories, not companies, and giving one an
identity would be inventing something that does not exist.

## How the market map reaches the chains

The database uses its own value-chain positions; this report's chains were
written to the `AUDIT/` brief and carry their own prose, ordering and
chokepoint qualifications. Neither is wrong, so `brand/stage_map.py` maps every
database position onto the stage it belongs to here, by hand, with the
deliberate omissions marked `None` and their reason given.

In a stage, the curated entries come first and carry the argument — what that
company supplies at that point. The rest follow in a collapsed block that
carries coverage. Conflating the two would lose the distinction.

## What this does not cover

Market quotes and fundamentals still come from outside: the company dialog
embeds TradingView, and `scripts/fetch_fundamentals.py` calls Financial
Modeling Prep from a scheduled job. Neither is a logo or company-identity
dependency, and neither is addressed by this database — see the note in the
project README before assuming the site is fully provider-free.

# Companies in the value chains

`brand/COMPANY_VALUE_CHAIN_DATABASE.md` decides which companies appear at each
stage. The builder reads that file directly — names, tickers and value-chain
positions all come from it. Edit the tables there to change the company map;
nothing else needs touching.

```bash
python3 brand/build-companies.py           # rebuild the market map and CT rows
python3 brand/build-companies.py --check   # fail if script.js is out of date
python3 brand/build-companies.py --logos   # list named companies with no logo
python3 bump-assets.py                     # re-stamp the asset hashes afterwards
```

It writes a block into `script.js` between `BEGIN generated-company-data` and
`END generated-company-data` holding `MARKET_MAP` and the `CT` rows those
companies need, plus `brand/company_registry.csv` for reference. **Do not edit
the block in `script.js`** — `--check` will say so, and the next build would
overwrite it.

## Logos are not generated here

Company marks come from `assets/logos/`, vendored from CompaniesLogo.com and
from company sites. This builder does not touch them and never creates one.

A company with no mark shows a **blank plate** with its name and ticker. That is
the correct behaviour. An earlier version of this script generated neutral
initial tiles for every entity, and it was a mistake: a generated tile sits in
the same place as a real logo and reads as the company's own mark, so the
reader cannot tell which marks are real. No mark is honest; an invented one is
not.

Currently 696 of the 841 companies the database names have no logo. To add one,
put the file in `assets/logos/` and add the entry to `LOGO` in `script.js`;
`--logos` lists what is missing.

Generic groups — "Hyperscalers", "Utilities", "Frontier labs" — are excluded
from the registry entirely. They are categories, not companies.

## How positions map onto this report's chains

The database uses its own value-chain positions; this report's chains were
written to their own brief and carry their own prose, ordering and
chokepoint qualifications. Neither is wrong, so `brand/stage_map.py` maps all
126 database positions onto the stage each belongs to here, by hand, with
deliberate omissions marked `None` and their reason given.

In a stage the curated entries come first and carry the argument — what that
company supplies at that point. The rest follow in a collapsed block carrying
coverage. Conflating the two would lose the distinction.

## Interpretation

The database is a curated global market map, not an exhaustive registry.
Inclusion means relevance to the stage, not market leadership, endorsement or
investment suitability. A company can appear at several stages and in several
layers. Ownership and listing status are time-sensitive and should be refreshed
before publication.

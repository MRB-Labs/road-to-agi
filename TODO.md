# Open work

Numbered requests and known gaps, so they survive outside a chat window.
Closed items move to the bottom with the commit that closed them.

## Data coverage

- [ ] **Logos for the market map.** 696 of the 841 companies named by the
      value-chain database have no mark in `assets/logos/`. List them with
      `python3 brand/build-companies.py --logos`. Official domains for ~320 of
      them are recorded in `CLEAN/AI_INFRASTRUCTURE_COMPANY_AND_LOGO_DATABASE_V2/logo_database/private_logo_sources.csv`,
      which is where to start. Do not generate stand-in marks.
- [ ] **Fundamentals coverage.** `assets/market/fundamentals.json` holds 144
      companies against ~549 with tickers. The free Financial Modeling Prep
      plan is US-only, so the 46 international listings in the curated set —
      ASML, TSMC, Samsung, SK hynix among them — cannot be filled without a
      paid tier. `--retry-all` re-enables them if that changes.
- [ ] **TradingView symbols.** 175 of ~549 tickered companies have one, so most
      company rows do not open a market view. Either widen `TVSYM` or narrow
      what looks clickable.

## Sourcing

- [ ] **Dates on time-sensitive figures.** The 35 chokepoints carry the full
      qualification the audit asked for. Figures in the thesis prose do not
      carry a per-claim date, only the layer-level as-of line. Each one needs a
      source and a date before it gets one — do not date a figure that has not
      been checked.
- [ ] **Refresh cadence.** `AUDIT/` and `brand/COMPANY_VALUE_CHAIN_DATABASE.md`
      are both 2026-09-07 snapshots and are now load-bearing for the taxonomy
      and the company map. Set a review date and record it in each file.
- [ ] **Market capitalisations.** `MCAP` and its FX snapshot are maintained by
      hand at a single date. Now written by the scheduled job where the data
      allows; the rest still drift.

## Structure

- [ ] **Taxonomy in one place.** Layer names, numbers and colours are read from
      `assets/taxonomy.js` by the site, but a few prose references still spell
      layer numbers out. Renumbering again would need a prose sweep.
- [ ] **`script.js` size.** Content tables are split out; the remaining file is
      still large and mixes rendering with per-page controllers.

## Closed

- [x] Guards run in CI on every push and pull request — `checks.yml`.
- [x] Root `README.md` explaining the project and the build sequence.
- [x] `check-offline.py` proves no page fetches assets from another server.

# The report's wording

`copy-snapshot.json` records every user-facing string in the report — the layer
descriptions, the tab copy, every stage, every box on every page. It is the
record of what the report currently says.

```bash
python3 check-content.py            # report anything that has changed
python3 check-content.py --accept   # approve the current wording as the baseline
```

Run the check before publishing. A wording change is then never silent: an edit
made by mistake shows up as a diff naming the exact string, and an edit made on
purpose is approved explicitly with `--accept`.

## What it covers

- The prose tables in `script.js` — `LAYERS`, `CHAIN`, `HOWTO`, `TABINTRO`,
  `LAYER_MATERIALS`, `LAYER_RISKS`, `LAYER_ELEMENTS`, `MOATWHY`, `SOURCES`,
  `ENVIRO`, `DEPLOY` and the rest.
- The visible text of every page, with markup, scripts and styles stripped.

Very short strings and obvious non-wording — file paths, URLs, bare numbers,
CSS fragments — are filtered out. Everything else is covered, including tab
labels and button text.

Changing that filter re-keys the snapshot, because keys carry an ordinal within
their table. Widening it once produced 855 apparent changes that were nothing
of the sort. If you change it, compare the *strings* rather than the keys
before re-accepting, or you will approve a real edit by accident.

Keys look like `script.js/HOWTO/6/75` or `stack.html/12`, which is enough to
find the string being reported.

## What it does not do

It is a tripwire, not a lock. It does not prevent an edit; it makes one
visible. If a check reports a change you did not intend, revert it — the
snapshot holds the previous text, so the original wording is recoverable from
this file alone.

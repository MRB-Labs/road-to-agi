# How `content/page-tables.json` was derived

Which content tables a page needs is not obvious from reading `script.js`: the
builders are top-level, they share helpers, and several tables are touched only
when a reader opens a tab or hovers a diagram. Guessing produces either a blank
section or a page that still ships everything.

So it was measured, not read.

## The method

1. Serve the site from a small proxy that, given `?drop=NAME`, rewrites
   `assets/content.js` on the fly with that one table replaced by an empty
   object or array of the same kind, and injects an error collector into the
   page's `<head>`.
2. Load each page in an iframe and let it settle.
3. **Exercise it**: click every button and every `[role="tab"]`, and dispatch
   `mouseenter` and `focusin` on every `#mapsvg [data-node]`, `#loopsvg
   .loop-node` and `.mx-pt`. This step is what makes the result trustworthy —
   `MOATWHY` and `LOOPWHY` are used by the overview only on hover, and without
   it both looked unused.
4. Fingerprint the result: the length of `body.innerText` with digits stripped,
   plus the element count. Digits are stripped because market capitalisations
   arrive asynchronously and jitter by a character or two.
5. A table is needed by that page if dropping it changes the element count,
   moves the text length by more than 20 characters, or raises an error.

## Re-running it

Re-derive after adding a builder or a mount point. The probe server and the
driving script are not committed — they are twenty lines each and are quicker
to rewrite than to keep working. What matters is the method above and the two
safety nets below.

## Why a wrong answer is not fatal

Every generated file declares **all** the table names; the ones the page does
not use are declared empty. A false negative therefore renders an empty section
rather than throwing a `ReferenceError` and taking out the page, and the page
still loads. `scripts/check-live.py` asserts the headline content is present on
the published site, which is the backstop.

The map in `content/page-tables.json` is also deliberately a little generous:
`MCAP_ASOF` travels with `MCAP`, `ELMAP` with `LAYER_ELEMENTS`, and a few
cheap tables are included on pages where the probe did not demand them.

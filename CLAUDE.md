# Road to AGI — working rules

A ten-layer infrastructure investment thesis, published with GitHub Pages from
`main`. Static site, no build step for the pages themselves — generators and
guards instead.

---

## Standing constraints

These came from Mark directly. They override convenience.

1. **Never expose a private API key in frontend JavaScript.** Keys live in
   GitHub Actions secrets; the workflow writes a data file, the page reads it.
2. **Never insert a remote logo or asset URL.** Every production asset is
   vendored inside this repository. No CDN, no hotlinking. `check-offline.py`
   enforces it.
3. **Never generate a placeholder or stand-in company mark.** Fake logos once
   shipped here and had to be reverted; a company with no real mark shows its
   name alone. `brand/build-companies.py --logos` lists the ones still missing.
4. **Wording is preserved unless Mark says otherwise.** Every user-facing string
   is snapshotted in `content/copy-snapshot.json`. If `check-content.py` reports
   a change you did not intend, you broke something — do not `--accept` your way
   past it.
5. **When Mark has to do something by hand, give numbered click-by-click
   steps**: the exact URL, what he will see, which button to press, the exact
   text to paste in a copyable block, the one thing most likely to go wrong, and
   how to verify it worked. Say whether he is creating or editing a file.
6. **Do not date a figure that has not been checked.** A date implies
   verification. Where a claim is time-sensitive and unverified, it carries the
   layer-level as-of line and nothing more.

---

## Generated files — never edit these by hand

| Generated | Canonical source | Regenerate with |
|---|---|---|
| the `<svg id="mapsvg">` block in `index.html` | `diagrams/infrastructure-map.svg` | `python3 build-diagram.py` |
| the company block in `assets/content.js` | `brand/COMPANY_VALUE_CHAIN_DATABASE.md` | `python3 brand/build-companies.py` |
| the footer on every page | `content/footer.html` + `content/REVISION` | `python3 bump-assets.py` |
| `?v=` hashes on every asset link | file contents | `python3 bump-assets.py` |
| `assets/market/fundamentals.json` | Financial Modeling Prep | `.github/workflows/fundamentals.yml` |
| `assets/images/social-card.png` | `style.css` palette | `python3 scripts/build-social-card.py` |

Generated blocks sit between `BEGIN`/`END` markers. Editing inside one is
silently overwritten on the next build, which is what the `--check` flags exist
to catch.

---

## Before every push

```bash
python3 build-diagram.py --check          # the page matches the diagram source
python3 scripts/check-grid.py             # the schematic is on its 8-unit grid
python3 scripts/check-crossings.py        # no arrow crosses another unbridged
python3 scripts/check-marks.py            # every layer mark has clear space
python3 brand/build-companies.py --check  # the company map matches its database
python3 check-content.py                  # wording matches the approved baseline
python3 scripts/check-offline.py          # no page fetches from another server
python3 bump-assets.py                    # re-stamp the hashes — always last
```

`bump-assets.py` runs **last**, after any change to `style.css`, `script.js`,
`assets/*.js` or the footer. Skipping it ships a page pointing at a stale hash.

---

## Where things are decided

| Question | Answer lives in |
|---|---|
| What the ten layers are and what colour each is | `assets/taxonomy.js` |
| Which companies appear at each value-chain stage | `brand/COMPANY_VALUE_CHAIN_DATABASE.md` |
| Where a database position maps to a site stage | `brand/stage_map.py` |
| What the schematic asserts, and every rule for drawing it | `diagrams/MAINTAINING-THE-SCHEMATIC.md` |
| The exact wording of everything | `content/copy-snapshot.json` |
| Logos, their rights and what is still missing | `brand/README.md` |
| Open work and known gaps | `TODO.md` |

`assets/content.js` holds all prose and data tables; `script.js` holds logic
only. Adding copy to `script.js` is how the wording guard lost eighteen strings
once — put it in `content.js`.

`CLEAN/` is gitignored. It holds the source databases the site was built from,
kept for provenance, not loaded by anything.

---

## Things that have gone wrong here before

Written down because each cost real time.

- **`typeof X` does not protect a `let` or `const` in its temporal dead zone** —
  it throws. Reading a hoisted-looking constant before its declaration took out
  every panel on the page.
- **`getBBox()` is local, `getBoundingClientRect()` is screen.** Comparing one
  against the other silently always passes. That is why an icon-clash checker
  reported success while a mark sat under its title.
- **Verify the paint, not the property.** An element filter looked correct
  because `hidden` was set; a class rule was beating the UA `[hidden]` rule and
  nothing actually hid.
- **A hidden browser pane pauses CSS transitions**, so a computed `opacity` read
  mid-transition is the value it started from. Disable the transition before
  measuring, or you will conclude a working rule is broken.
- **`.slice(-1)` on `#layer-N` broke at ten layers** — `#layer-10` ends in `0`,
  which is the physical world. Parse with a regex.
- **A selector is dead if *any* class it requires is never emitted**, not only
  if its first class is unused.
- **zsh does not word-split an unquoted `$c`** — a loop running guard commands
  reported five false failures until each was `eval`'d.

---

## Publishing

GitHub Pages serves `main` directly, so a push is a deploy and CI reports
*after* the fact. Tag each published revision (`git tag v10 && git push --tags`)
so there is something to go back to, and bump `content/REVISION` when the
revision number changes.

The token in use **cannot write to `.github/workflows/`**. Any workflow change
has to be pasted by Mark through the GitHub web editor — give him the numbered
steps and the exact block.

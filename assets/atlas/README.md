# The AI infrastructure atlas

The interactive map on the overview. It replaced the hand-drawn schematic that
is now archived in `diagrams/archive/`.

## The files, and what each decides

| File | Holds |
|---|---|
| `atlas-layout.js` | **Geometry only.** Region and card rectangles, the planet's circle, the flow families, and the routes between cards. Not one word of prose. |
| `atlas-geometry.js` | Anchors and the orthogonal route builder. |
| `space.jpg` | The background photograph: grid, dotted world, stars, orbital arcs and the planet, all in one asset. |
| `atlas-data.js` | The adapter. The only file that knows how the report's tables are shaped. |
| `atlas.js` | The component: builds the markup, then wires hover, focus, selection, filters, search, pan, zoom and the panel. |
| `atlas-earth.js` | The continent and cloud paths from the previous schematic's globe. Unused by the current background; kept for the dotted-world helper. |
| `atlas.css` | Tokens and every rule, all scoped to `.atlas`. |

## Where to change things

- **Move a card, resize a region, add a route** — `atlas-layout.js`. The routes
  re-derive from the card edges, so nothing else needs touching. Run
  `scripts/check-atlas.py` afterwards: it replays the router in Python and
  fails if any route now runs through a card. A line through a name is the one
  flaw that makes a diagram unreadable, and it is easy to introduce by moving
  something innocent.
- **Colours, glow, spacing, motion** — the token block at the top of
  `atlas.css`. Nothing else in the atlas carries a literal colour.
- **Card labels, region names, the planet's caption, the two route labels** —
  `ATLAS_CARDS`, `ATLAS_REGIONS_TEXT`, `ATLAS_WORLD_TEXT` and
  `ATLAS_ROUTE_TEXT` in `assets/content.js`, like all other copy.
- **The background** — `space.jpg`, painted on `.atlas-world` so it pans and
  zooms with the map. **The canvas shares the photograph's aspect exactly
  (1672×941 → 1760×990)**, which is what makes the planet in the picture land
  on `ATLAS_WORLD`'s coordinates at every size. Change the picture and you must
  re-measure that centre and radius, or change the canvas to match. A blurred
  900px copy, `space-wash.jpg`, sits behind the whole site on the dark theme.
- **What the detail panel shows** — `AtlasData.detail`. It reads existing
  fields and returns `undefined` for any the report does not have; the panel
  renders only the sections that came back with something.

## How the report's data reaches the map

```
LAYERS[n]        → the panel: role (lede), core metric (facts[0]),
                   binding constraint (choke), what to watch, key companies
ATLAS_CARDS[id]  → the card's own short title and descriptor lines
LAYER_ICONS[n]   → the layer mark, drawn by the report's own layerIcon()
```

A card's `layer` is the site layer it opens. Several cards share one on
purpose: layer 4 runs in the hall and at the edge, layer 1 is the grid and the
battery in the machine.

Pages other than the overview receive a **trimmed** `LAYERS` — see
`build-content.py`. `facts`, `watch` and `co` are cut to the columns the panel
actually reads, which is the difference between an 11KB overview and a 47KB one.

## Rules worth keeping

- **Anything the markup template calls must be a function declaration**, not a
  const arrow. The template runs partway down `atlas.js`, and a `const` is
  unreachable before its own line. This has cost three debugging rounds.
- The atlas is deep-space in both site themes. It is a lit instrument, like a
  photograph; inverting it would cost the depth the design rests on.
- **A route is coloured by the box it leaves**, not by what it carries: energy
  out of the grid is the grid's amber, materials out of layer 2 its brown. What
  it carries is still said, by the dash pattern — which is why the flow chips
  show a dash rather than a colour, and why `--atlas-energy` and friends are now
  only the chips' business. `tone` in the layout overrides the colour; only the
  two runs out of the planet use it.
- **An enclosure stands for everything inside it.** Pointing at the machine
  lights every run in and out of its six blocks, not only the ones that name the
  frame. `selfIds()` is where that is decided.
- **A fork is one line that branches, never two lines side by side.** Two runs
  leaving the same card on the same side for the same reason carry the same
  `trunk` key: they keep one anchor between them, take the same first guides,
  and split where they part company. Trunk-mates must agree on card, side and
  flow — a shared line whose branches carry different things would be a lie
  about what flows along it, and `check-atlas.py` refuses it.
- **An arrow is centred on its card only when it is the only arrow.** Two on
  one edge leaving from the same point cannot be told apart, so `AtlasGeom.fan`
  spreads every route end sharing a (card, side) evenly about the centre,
  ordered by where the far end sits across that edge — which is what stops a
  fan crossing itself. A `dx` or `tx` written into the layout still wins; it is
  there because that run had to clear something. Nothing in the layout needs to
  be offset by hand any more just to separate two arrows.
- **A card is coloured by the layer it opens, not by the region it sits in.**
  Layer 1 is amber wherever it appears — the grid, the plant in the hall, the
  battery in the machine — the way the hand-drawn schematic read it. The ten
  hues are `--atlas-l1` … `--atlas-l10` in `atlas.css`; regions keep their own
  `--r-*` for their frame and title.
- **The search is a company search**: names and tickers, nothing else. It reads
  `ATLAS_TICKERS`, generated by `build-content.py` from `CHAIN` and `TVSYM` —
  442 rows of `[name, ticker, layer]`, because the two tables it comes from are
  80KB together and the overview needs neither. Each layer answers with its main
  card, or a company drawn at three cards would be found three times.
- **A pressed flow chip unpresses.** The filters are switches, not a one-way
  choice you have to undo through "All flows".
- **Unlit runs fall to 4.5%**, not 9%. At 9% the leftover corridors round the
  foundations washed to grey and drew a pale rectangle that looked deliberate —
  it was the first thing anyone noticed when the planet was selected.
- **The panel closes three ways** — its own button, Escape, and a click that is
  neither on it nor on a card. The last is measured from where the pointer went
  down, so dragging the map never closes it, and it does not pull focus back to
  the card, which would scroll the page.
- **The physical world is not a layer**, so it has no row in `LAYERS`. Its panel
  comes from `AtlasData.worldDetail()`, out of `ATLAS_WORLD_TEXT`, and carries
  the globe mark where a layer would show its number. Its label hangs below the
  planet: above it, the two dashed lines leaving the top ran through their own
  caption.
- **`fill:none` cannot be hit; `fill:transparent` can.** The planet's rings are
  unfilled, so it carries a `.pw-hit` disc of its own. And `.atlas-nodes` is a
  full-canvas div sitting over the SVG: it must stay `pointer-events:none`
  with the cards themselves `auto`, or it swallows every click on the planet.
- `scripts/check-atlas.py` guards the layout: cards inside their regions, no
  overlaps, nothing under a region title, every route endpoint real, every
  layer present, every card labelled — and, by replaying the router, that no
  route crosses a card, that no two arrows share a departure or arrival point,
  and that no two run far enough along the same row or column to read as one
  line. The replay includes its own copy of `fan`; if the two drift, the guard
  is checking a diagram that is not the one that ships.

## Not implemented, and why

The reference image shows a **cybersecurity layer** as an arc across the top.
The report has no cybersecurity layer — security appears only as part of layer
5's remit. Inventing one would have meant inventing content, so it is left out.
It is the one thing in the reference that needs a product decision before it
can be built.

## The machine is an enclosure

`l10` carries `encl:1` and is sized to hold the six blocks inside it — sensors,
edge compute, local models, agent and control, actuators, battery and power.
They are siblings in the DOM, drawn after it, so they take their own clicks
while the frame behind them stays hoverable as layer 10.
`check-atlas.py` allows that one overlap and instead asserts the blocks sit
*fully* inside the frame.

## Route options

| key | meaning |
|---|---|
| `side` | which edge to leave and which to arrive on |
| `dx` / `dy` | offset the departure / arrival along that edge, overriding the fan |
| `tx` | the arrival offset, named for routes aiming at a whole group |
| `via` | guides in order: `{x:…}` turns the run vertical there, `{y:…}` horizontal |
| `trunk` | a fork: runs sharing a key leave as one line and branch where they part |
| `icon` | (on a card) draw a different mark than its layer's — `'1p'` is the plant |
| `core` | part of the main sequence: bright at rest, and carries a moving particle |
| `ends` | extra cards that light this route, beyond its two ends |
| `tone` | override the colour, which otherwise comes from the `from` card |
| `dash` | override the flow family's dash pattern |

A route may aim at a whole macro-system, written `#key` — the two lines out of
the physical world do, because what they feed is the group that turns nature
into supply, not one card inside it.

Particles run on the `core` routes at rest and move to whatever is lit when
something is hovered or filtered — never on everything at once, and never while
the tab is hidden or reduced motion is asked for.

# Maintaining the infrastructure map

`infrastructure-map.svg` is the canonical drawing. The copy inside `index.html`
is generated from it and must never be edited there.

```bash
python3 build-diagram.py            # inject the canonical file into the pages
python3 build-diagram.py --check    # fail if a page has drifted from it
python3 scripts/check-grid.py       # fail if a coordinate is off the grid
python3 scripts/check-crossings.py  # fail if two arrows cross without a bridge
python3 scripts/check-marks.py      # fail if a layer mark sits under a label
python3 check-content.py            # the drawing's labels are part of the copy
python3 bump-assets.py              # re-stamp the asset hashes afterwards
```

The drawing is inline rather than an `<img>` for two reasons: it is painted
with the site's CSS custom properties, so it follows the light and dark themes,
and every card is a link whose hover drives the reading panel beside it.

---

## 1 · What the drawing asserts

Three claims, not a stack. It rules out the reading in which every layer buys
from the layer below it.

1. **What must physically exist** — the industrial supply base on the left.
2. **Where each capability runs** — the two enclosures, centre and right.
3. **What moves between them** — the arrows, which are typed.

### Groupings

A dashed box is a grouping, not a layer.

| Box | Contains | Label |
|---|---|---|
| Natural resources conversion | Layers 1, 2 | `Natural resources conversion` |
| Device manufacture | Layer 3 | `Device manufacture` |
| The data centre | Layer 5 and its contents | `Land · building · operations · security` |
| The network | Layer 6 | `Internet · telecommunications` |
| The machine | Layer 10 and its contents | `Deployed robots and smart devices` |

Inside the data centre, two solid sub-frames separate what is made of metal
(`Physical plant and machines`) from what is made of information (`Data, models
and software`).

### Containment

Layer 5 contains the on-site part of layer 1, central layer 4, and layers 7, 8
and 9 running on it. Layer 10 contains sensors, an edge layer 4, local 8 and 9,
actuators, and a layer 1 battery and thermal system.

**Layers 1, 4, 8 and 9 appear twice on purpose.** The same capability class runs
at two physical scales. Containment is not ownership: different companies may
own the land, the building, the plant, the hardware and the workload.

### Prose belongs under the drawing, not in it

Anything that is a sentence rather than a label goes in the `.d-cap` paragraph
below the figure. The drawing carries names, not arguments.

---

## 2 · The grid

Imagine a dot grid behind the drawing and put everything on it. Spacing,
symmetry and alignment are then decided once, not nudged per edit.
`scripts/check-grid.py` enforces this.

| Tier | Applies to | Rule |
|---|---|---|
| **Module 8** | rect `x`/`y`/`width`/`height`, every corner an arrow turns at | multiple of 8 |
| **Half-module 4** | centre lines, and an arrowhead's stop | multiple of 4 |
| **Exempt** | arc bridges, the drawn globe | freehand |

A box of even module width has its centre on the half-module, which is why 4 is
allowed there and nowhere else. Text inside a box is exempt: 8 units is far too
coarse for 11–16px type, so **type follows its box** — move a box and its
contents move by the same delta, never independently.

### Nesting steps

Frames step inward by a fixed amount at each level, so the rhythm is the same
everywhere:

```
dashed group  →  solid enclosure   24
enclosure     →  sub-frame         16
sub-frame     →  card               8
```

### Gutters, corridors and lanes

- Vertical corridors outside the frames are **24 apart**, on both sides, and the
  outermost sits **16 inside the viewBox**. Two arrows whose vertical runs do
  not overlap share one corridor rather than taking two: nearly-parallel columns
  a short distance apart read as a misalignment, not as a pair. The left and right gutters mirror
  each other; they must not drift apart.
- Horizontal supply lanes under the drawing are **32 apart**, because each
  carries a label in the gap above it.
- Padding at the edge of the canvas is 16 on all four sides.

The checker prints the corridor and lane inventory on every run and fails if the
spacing is not uniform.

---

## 3 · Rules for arrows

### Draw one only for a specific relationship

Physical supply, electricity, data, a model or software update, or physical
interaction. Two subjects being related is not a reason to connect them.

### Families, kept visually distinct

| Class | Meaning | Style |
|---|---|---|
| `.pw` | Electricity, cooling, water — layer 1 | solid, amber |
| `.mt2` | Physical material — layer 2 | solid, orange |
| `.ln-s` | Semiconductor devices — layer 3 | solid, rose |
| `.ln-d` | Data returning from the edge — layer 7 | dashed, teal |
| `.ln-m` | Validated model and software updates — layer 8 | dashed, aqua |
| `.ln-g` | Cloud agents reaching the fleet — layer 9 | dashed, violet |
| `.ln-i` | The machine's internal loop, and supervision | solid, neutral |
| `.wl`, `.wl2` | Primary sources out of the physical world | dashed |

Highlighting brightens and thickens an arrow; it must never repaint it. The
colour says which family the flow belongs to, and recolouring it to whichever
layer is under the cursor destroys exactly what the colour encodes.

### Where an arrow attaches

- On the **centre line** of the box it feeds, wherever the geometry allows.
- A **pair running in opposite directions straddles that centre** instead,
  symmetrically — 16 apart is the usual offset.
- It stops **8 short of the edge** it points at (4 in a 16-unit gap); the
  arrowhead fills the rest. It must reach the box it names, never float.
- Where several arrows share one edge, space them evenly and keep at least 12
  clear of the corners.
- An arrow must not run through a label. If it would, take it outside the frame
  and give it its own corridor.

### Draw whole paths, not continuations

Where a source feeds two places along the same route, draw **two whole paths
that share the corridor**, not one path plus a continuation from its midpoint.
Two identical strokes overlap invisibly, and it is the only way the far end can
light back to its source without dragging in the other destination's arrowhead.

### Bridge a crossing, do not accept it

Where a run has to cross a line it does not meet, hop over it:

```
H1313 A7 7 0 0 1 1327 1008 H …
```

A 7-unit arc centred on the crossed corridor, sweep `1` on a left-to-right run,
bulges upward and reads as a bridge rather than a junction. **The horizontal
hops the vertical**, never the other way round. Its two endpoints are the
corridor ±7 and so are exempt from the grid.

### Keep the lanes nested

The supply runs share the band beneath the diagram. They do not cross because of
one rule: **the deeper the lane, the further left it leaves the supply base and
the further right it rises.** Break that ordering and they intersect.

---

## 4 · Hover behaviour

Hovering is keyed on **box ids, not layer numbers**. A layer number cannot
identify a box: layer 1 is drawn three times — the grid outside, the plant in
the hall, the battery in the machine — and pointing at the battery used to
light the power lane running off to connectivity.

| attribute | goes on | meaning |
|---|---|---|
| `data-node` | a box (`a.node`, `a.worldnode`) | its id: `l1`, `l1p`, `l1b`, `dc`, `mach`, `sens`, … |
| `data-ends` | an arrow **or its label** | space-separated ids that light this element |
| `data-link` | an arrow only | the arrow's two real ends, deciding which *boxes* light |
| `data-neighbours` | an enclosure | boxes it names directly, drawing no arrow itself |

Pointing at a box lights **that box, its arrows in and out, and the boxes at the
far end of them**. Everything else fades to 30%.

`data-link` defaults to `data-ends` and is only written where a flow is shared.
The power lane into connectivity is lit from the battery as well, so the lane
reads whole — but its ends are energy and connectivity, so pointing at the
battery must not drag connectivity into the highlight.

Labels carry `data-ends` so they appear with their flow, and are ignored when
working out which boxes to light: a label connects nothing.

**Every label is hidden at rest** and shown only while its flow is highlighted,
except `lb-a` and `lb-wf` — actuators and sensors — which are pinned visible in
`style.css` and must stay the same size as each other.

The reading panel is `#mapinfo`, filled from `LAYERS` in `script.js`. Layer
marks come from `LAYER_ICONS`, hydrated into `g.lic[data-icon]`; keys are
normally the layer number, and `1p` is the on-site plant, which is layer 1 drawn
differently so the indoor and outdoor instances read apart.

---

## 5 · Constraints to preserve

- viewBox is `-80 -112 1888 1200`. The negative top is where the primary-source
  lines run; the bottom band is where the supply lanes run. Keep
  `#mapsvg{min-height}` under the height that ratio gives at full width, or the
  box letterboxes.
- Every card is an `<a class="node" href="stack.html#layer-N">`. The controller
  parses N with a regex — not from the last character, which breaks at layer 10.
- Colours come from `--l1` … `--l10`, and the globe from `--globe-*`. No literal
  hex belongs in this file.
- Two-line labels need 20 units of leading, not 16, or their boxes touch.
- A layer mark needs 10 units clear of every label; `check-marks.py` enforces it.

## 6 · Checklist after any edit

1. `python3 scripts/check-grid.py` — everything on the grid, gutters even.
2. `python3 scripts/check-crossings.py` — no unbridged crossings.
3. `python3 scripts/check-marks.py` — no mark under a label.
4. In the browser: no label collides with another, nothing overflows a card,
   nothing falls outside the viewBox. Measure it rather than eyeballing it —
   `getBBox()` on every `text`, compared pairwise and against the card rects.
   Remember that a hidden pane pauses CSS transitions, so a computed `opacity`
   read mid-transition is the value it started from, not the one it is heading to.
5. Check both themes, and hover every box.
6. `python3 build-diagram.py && python3 check-content.py && python3 bump-assets.py`.

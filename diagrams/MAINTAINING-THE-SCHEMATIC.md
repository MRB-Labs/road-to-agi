# Maintaining the infrastructure map

`infrastructure-map.svg` is the canonical drawing. The copy inside `index.html`
is generated from it and must never be edited there.

```bash
python3 build-diagram.py            # inject the canonical file into the pages
python3 build-diagram.py --check    # fail if a page has drifted from it
python3 scripts/check-crossings.py  # fail if two arrows cross without a bridge
python3 bump-assets.py              # re-stamp the asset hashes afterwards
```

Run all four before publishing. `--check` is the guard against editing the
inline copy, which would otherwise be silently overwritten on the next build.

The drawing is inline rather than an `<img>` for two reasons: it is painted
with the site's CSS custom properties, so it follows the light and dark themes,
and every card is a link whose hover drives the reading panel beside it.

---

## 1 · What the drawing asserts

Three claims, not a stack. The brief this was written to rules out the earlier
reading in which every layer bought from the layer below it.

1. **What must physically exist** — the industrial supply base on the left.
2. **Where each capability runs** — the two enclosures, centre and right.
3. **What moves between them** — the arrows, which are typed.

### Groupings

Four dashed boxes. A dashed box is a grouping, not a layer.

| Box | Contains | Label |
|---|---|---|
| Industrial supply base | Layers 1, 2, 3 | `Industrial supply base` |
| The data centre | Layer 5 and its contents | `Land · building · operations · security` |
| The network | Layer 6 | `Internet · telecommunications` |
| The machine | Layer 10 and its contents | `Deployed robots and smart devices` |

### Containment

Layer 5 contains the on-site part of layer 1, central layer 4, and layers 7, 8
and 9 running on it. Layer 10 contains sensors, an edge layer 4, local 8 and 9,
actuators, and a layer 1 battery and thermal system.

**Layers 1, 4, 8 and 9 appear twice on purpose.** The same capability class runs
at two physical scales. Containment is not ownership: different companies may
own the land, the building, the plant, the hardware and the workload.

---

## 2 · Rules for arrows

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
| `.ln-i` | The machine's internal loop | solid, neutral |
| `.wl`, `.wl2` | Primary sources out of the physical world | dashed, always visible |

### Prefer one trunk that forks

Where a source feeds two places along the same route, draw one trunk and fork
it, rather than two parallel runs. A fork is two paths meeting at a point: the
second starts exactly where the first turns away. Energy, materials and
semiconductors each do this once, at the point where connectivity and the
machine part company.

### Bridge a crossing, do not accept it

Where a fork has to cross a line that has already turned, hop over it:

```
H 1297 A7 7 0 0 1 1311 900 H …
```

A 7-unit radius arc, sweep `1`, on a left-to-right run, bulges upward and reads
as a bridge rather than a junction. **The horizontal hops the vertical**, never
the other way round. `scripts/check-crossings.py` recognises an arc as an
intended crossing and counts it separately.

### Keep the lanes nested

The six supply runs share a band beneath the diagram. They do not cross because
of one rule: **the deeper the lane, the further left it leaves the supply base
and the further right it rises.** Break that ordering and they intersect.

---

## 3 · Hover behaviour

`data-from` on an arrow or label carries a **space-separated list** of the
layers it belongs to, not a single layer. The sensors arrow belongs to both the
physical world and the machine; each bridge arrow belongs to the layer at either
end. Pointing at any one of them lights the arrow.

The reading panel is `#mapinfo`, filled from `LAYERS` in `script.js`.

Layer marks come from `LAYER_ICONS`, hydrated into `g.lic[data-icon]`. Keys are
normally the layer number; `1p` is the on-site plant, which is layer 1 drawn
differently so the indoor and outdoor instances read apart.

---

## 4 · Constraints to preserve

- viewBox is `0 -80 1700 1180`. The negative top is where the primary-source
  lines run; the bottom band is where the supply lanes run.
- Every card is an `<a class="node" href="stack.html#layer-N">`. The controller
  parses N with a regex — not from the last character, which breaks at layer 10.
- Colours come from `--l1` … `--l10`, and the globe from `--globe-*`. No literal
  hex belongs in this file.
- Two-line labels need 20 units of leading, not 16, or their bounding boxes
  touch.

## 5 · Checklist after any edit

1. `python3 scripts/check-crossings.py` — no unbridged crossings.
2. In the browser: no label collides with another, nothing overflows a card,
   nothing falls outside the viewBox. Measure it rather than eyeballing it —
   `getBBox()` on every `text`, compared pairwise and against the card rects.
3. Check both themes.
4. `python3 build-diagram.py && python3 bump-assets.py`.
5. `python3 check-content.py` — the drawing's labels are part of the report's
   wording and are snapshotted with everything else.

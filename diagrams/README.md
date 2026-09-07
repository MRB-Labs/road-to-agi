# The infrastructure map

`infrastructure-map.svg` is the canonical schematic. The copy inside
`index.html` is generated from it and must not be edited there.

```bash
python3 build-diagram.py           # inject the canonical file into the pages
python3 build-diagram.py --check   # fail if a page has drifted from it
python3 bump-assets.py             # re-stamp the asset hashes afterwards
```

`--check` is the guard: it fails loudly if someone edits the inline copy, which
would otherwise be silently overwritten on the next build.

The drawing is inline rather than an `<img>` for two reasons. It is painted
with the site's CSS custom properties, so it follows the light and dark themes;
and every card is a link with hover behaviour that drives the reading panel
beside it.

---

## What the drawing asserts

Read it as three claims, not as a stack. The audit brief in `AUDIT/` rules out
the earlier reading in which every layer bought from the layer below it.

1. **What must physically exist** — the industrial supply base on the left.
2. **Where each capability runs** — the two enclosures, centre and right.
3. **What moves between them** — the arrows, which are typed.

### Groupings

Four dashed boxes. A dashed box is a grouping, not a layer.

| Box | Contains | Label |
|---|---|---|
| Industrial supply base | Layers 1, 2, 3 | `Industrial supply base` |
| The data centre | Layer 5 and everything inside it | `Land · building · operations · security` |
| The network | Layer 6 | `Internet · telecommunications` |
| The machine | Layer 10 and everything inside it | `Deployed robots and smart devices` |

### Containment

Layer 5 physically contains the on-site part of layer 1, central layer 4, and
layers 7, 8 and 9 running on it. Layer 10 contains sensors, an edge instance of
layer 4, local instances of 8 and 9, actuators, and a layer 1 battery and
thermal system.

**Layers 1, 4, 8 and 9 therefore appear twice.** That is deliberate: the same
capability class runs at two physical scales. Containment is not ownership —
different companies may own the land, the building, the plant, the hardware and
the workload.

### Arrow families

Four, kept visually distinct because they mean different things.

| Class | Meaning | Style |
|---|---|---|
| `.pw` | Electricity, cooling and water — layer 1 | solid, amber |
| `.mt2` | Physical material — layer 2 | solid, orange |
| `.ln-s` | Semiconductor devices — layer 3 | solid, rose |
| `.ln-d` | Data returning from the edge — layer 7 | dashed, teal |
| `.ln-m` | Validated model and software updates — layer 8 | dashed, aqua |
| `.ln-i` | The internal loop of the machine | solid, neutral |
| `.wl`, `.wl2` | Primary sources out of the physical world | dashed, always visible |

An arrow is drawn only where there is a specific relationship: physical supply,
electricity, data, a model or software update, or physical interaction. Two
subjects being related is not sufficient reason to connect them.

### Where each arrow goes

- **Layer 1** → 2, 3, 5, the racks inside 5, 6, and the charging stations behind 10.
- **Layer 2** → 1, 3, 5, 6, 10.
- **Layer 3** → 5.
- **Layer 5 ↔ 6 ↔ 10** — the bridge, carrying updates out and experience data back.
- **The physical world** → 1 and 2, dashed, because nothing is bought at that
  step. It is captured or extracted.
- **Machine internals** — sensors → edge compute → local models → agent and
  control → actuators, with the battery supporting all of them.
- **The world ↔ the machine** — actuators change it, sensors read it.

### Hover behaviour

`data-from` on an arrow or label carries a **space-separated list** of the
layers it belongs to, not a single layer. The sensors arrow belongs to both the
physical world and the machine; each bridge arrow belongs to the layer at either
end. Pointing at any one of them lights the arrow.

The reading panel is `#mapinfo`, filled from `LAYERS` in `script.js`.

### Constraints to preserve when editing

- viewBox is `0 -80 1700 1120`. The negative top is where the primary-source
  lines run.
- The bottom lanes at y≈900–996 carry supply that bypasses the data centre.
  Keep them clear of the boxes above.
- Every card is an `<a class="node" href="stack.html#layer-N">`. The controller
  parses N out of the href with a regex — not from the last character, which
  breaks at layer 10.
- Colours come from `--l1` … `--l10` and the globe from `--globe-*`. No literal
  hex belongs in this file.
- After any change, verify no label collides, nothing overflows a card, and
  nothing falls outside the viewBox.

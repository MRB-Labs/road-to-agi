# Atlas and data model

The overview atlas is intentionally split into geometry, data and rendering.

## Geometry

`assets/atlas/atlas-layout.js`

- `ATLAS_CANVAS`: the coordinate system.
- `ATLAS_REGIONS`: the six macro regions.
- `ATLAS_WORLD`: Earth position and radius.
- `ATLAS_NODES`: cards, boxes and embedded subcards.
- `ATLAS_FLOWS`: flow labels and dash patterns.
- `ATLAS_ROUTES`: route endpoints and bend guides.

No prose belongs here.

## Routing

`assets/atlas/atlas-geometry.js`

Builds orthogonal paths from cards, regions and route guides. The Python guard
replays the same layout to catch routes through cards.

## Content

`assets/content.js`

- `ATLAS_CARDS`
- `ATLAS_REGIONS_TEXT`
- `ATLAS_WORLD_TEXT`
- `ATLAS_ROUTE_TEXT`
- layer and company data used by `AtlasData`

`build-content.py` writes per-page slices from the source content file.

## Rendering

`assets/atlas/atlas.js`

Builds the DOM/SVG and wires selection, search, filters, pan, zoom and detail
panel behavior.

`assets/atlas/atlas.css`

Owns the visual system. The Earth is `assets/atlas/earth.webp`; the rest of the
atlas background is CSS.

## Visual editor

`atlas-editor.html`, `assets/atlas/atlas-editor.js`,
`assets/atlas/atlas-editor.css` and `scripts/atlas-editor-server.py`.

The editor can move cards, regions, route bends, icons and Earth, edit atlas
text, save, run guards, commit and push. It is local-only and excluded from the
public deploy.

## Common footgun

Card ids do not always match layer numbers after the renumbering. Trust a
card's `layer:` field, not its id.


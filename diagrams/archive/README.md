# The previous schematic

`infrastructure-map.svg` was the report's hand-drawn infrastructure map from
revisions 1 to 10. It was replaced on the overview by the interactive atlas in
`assets/atlas/`, and is kept here because it is the origin of several things
still in use:

- the card titles and descriptor lines, now in `ATLAS_CARDS` in
  `assets/content.js`;
- the continent and cloud paths, now in `assets/atlas/atlas-earth.js`, which
  draw both the planet and the faint world behind the stack;
- `MAINTAINING-THE-SCHEMATIC.md`, whose rules on grids, arrow attachment,
  bridging and flow families shaped the atlas layout.

Nothing loads these files at run time. The generator and the five guards that
kept the drawing honest — `build-diagram.py`, `check-grid.py`,
`check-crossings.py`, `check-marks.py` and `check-geometry.py` — were retired
with it; `scripts/check-atlas.py` guards what replaced them.

To bring it back, restore it from the tag `v10.1-before-schematic-redesign`.

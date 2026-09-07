# Diagrams

`infrastructure-map.svg` is the canonical infrastructure map. The copy inside
`index.html` is generated from it — never edit it there.

See **[MAINTAINING-THE-SCHEMATIC.md](MAINTAINING-THE-SCHEMATIC.md)** for what the
drawing asserts, the rules for arrows, and the checks to run after any edit.

```bash
python3 build-diagram.py --check    # has a page drifted from the canonical file?
python3 scripts/check-crossings.py  # do two arrows cross without a bridge?
```

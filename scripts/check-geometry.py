#!/usr/bin/env python3
"""Guard the schematic's geometry against accidental movement.

check-grid.py asserts the *rules* — everything on the module, gutters evenly
spaced. This asserts the *values*: that nothing moved without someone meaning
it to. Between them, an edit made by mistake in a part of the drawing nobody
happened to look at cannot reach the site.

    python3 scripts/check-geometry.py           report anything that moved
    python3 scripts/check-geometry.py --accept  approve the current geometry

Deliberately not a screenshot diff: that needs a browser in CI, is flaky on
font rendering, and puts binaries in the repository. Coordinates are exact,
diff to one line, and are what actually changed.
"""
import json, re, sys, pathlib, xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parent.parent
SVG  = ROOT / 'diagrams' / 'infrastructure-map.svg'
SNAP = ROOT / 'diagrams' / 'geometry-snapshot.json'
NS   = '{http://www.w3.org/2000/svg}'

# What counts as geometry. Anything else — colours, aria, hrefs — is guarded
# elsewhere or is not position.
GEOM = ('x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry',
        'd', 'transform', 'points', 'viewBox')
# The drawn globe is freehand art: dozens of bezier paths whose exact control
# points carry no meaning. Its placement is snapshotted through its parent's
# transform, which is the part that matters.
SKIP_CLASS = {'g-land', 'g-cloud', 'g-sea', 'g-ice', 'g-grid', 'g-edge'}


def identity(el):
    """A key that names the element rather than its position in the file, so a
       coordinate change reads as one moved element, not as a renumbering."""
    a = el.attrib
    text = ''.join(el.itertext()).strip()[:60]
    return '|'.join([el.tag.replace(NS, ''), a.get('class', ''), a.get('data-node', ''),
                     a.get('data-ends', ''), a.get('data-icon', ''), text])


def collect():
    root = ET.parse(SVG).getroot()
    snap, seen = {}, {}
    def visit(el):
        a = el.attrib
        if a.get('class') in SKIP_CLASS:
            return
        g = {k: a[k] for k in GEOM if k in a}
        if g:
            base = identity(el)
            n = seen.get(base, 0); seen[base] = n + 1
            snap[base if n == 0 else '%s#%d' % (base, n)] = ' '.join(
                '%s=%s' % (k, re.sub(r'\s+', ' ', v.strip())) for k, v in sorted(g.items()))
        for kid in el:
            visit(kid)
    visit(root)
    return snap


def main():
    now = collect()
    if '--accept' in sys.argv:
        SNAP.write_text(json.dumps(now, indent=1, ensure_ascii=False, sort_keys=True) + '\n')
        print('baseline accepted: %d elements recorded' % len(now))
        return 0
    if not SNAP.exists():
        print('no baseline yet. Run: python3 scripts/check-geometry.py --accept')
        return 1
    was = json.loads(SNAP.read_text())
    moved  = [k for k in now if k in was and now[k] != was[k]]
    added  = [k for k in now if k not in was]
    gone   = [k for k in was if k not in now]
    if not (moved or added or gone):
        print('geometry unchanged: %d elements match the snapshot' % len(now))
        return 0
    for title, keys, fmt in (
            ('MOVED',   moved, lambda k: '- %s\n      + %s' % (was[k], now[k])),
            ('ADDED',   added, lambda k: now[k]),
            ('REMOVED', gone,  lambda k: was[k])):
        if not keys:
            continue
        print('\n%s (%d)' % (title, len(keys)))
        for k in keys[:30]:
            print('  %s\n      %s' % (k, fmt(k)))
        if len(keys) > 30:
            print('  … and %d more' % (len(keys) - 30))
    print('\nIf these changes are intended: python3 scripts/check-geometry.py --accept')
    return 1


if __name__ == '__main__':
    sys.exit(main())

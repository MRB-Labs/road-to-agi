#!/usr/bin/env python3
"""Check every layer mark on the schematic has clear space around it.

The marks are the fastest way to tell one box from another, so a mark sitting
under a word is worse than no mark. This measures each one against every text
on the diagram in the same coordinate space — an earlier version compared a
mark's local coordinates against global text coordinates and therefore always
reported success, which is why a crowded mark reached the page.

    python3 scripts/check-marks.py          report marks with less than 10px clear
"""
import re, sys, pathlib

CLEAR = 10.0          # user units of required clearance
SVG = pathlib.Path(__file__).parent.parent / 'diagrams' / 'infrastructure-map.svg'

# the artboard content of every mark sits inside this box, measured from the
# icon definitions in assets/content.js
ART = (6.0, 6.0, 38.0, 38.0)


def marks(s):
    for m in re.finditer(r'<g class="lic" data-icon="([^"]+)"[^>]*transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([\d.]+)\)"', s):
        icon, x, y, sc = m.group(1), float(m.group(2)), float(m.group(3)), float(m.group(4))
        yield icon, (x + ART[0]*sc, y + ART[1]*sc, x + ART[2]*sc, y + ART[3]*sc)


def texts(s):
    """Approximate each text's box. Width per character is deliberately
       generous, so a pass here means real clearance on the page."""
    per = {'bt': 8.4, 'bt2': 8.0, 'bt3': 7.4, 'bs': 6.0, 'bs2': 5.6,
           'mg-note': 6.4, 'mg-h': 7.6, 'mg-label': 7.0, 'bn': 6.0, 'bn2': 5.4}
    size = {'bt': 18, 'bt2': 17, 'bt3': 15, 'bs': 13, 'bs2': 12,
            'mg-note': 12, 'mg-h': 16, 'mg-label': 12, 'bn': 12, 'bn2': 11}
    for m in re.finditer(r'<text class="([^"]*)"([^>]*)>([^<]*)</text>', s):
        cls = m.group(1).split()[0]
        if cls not in per:
            continue
        attrs, body = m.group(2), m.group(3)
        xm = re.search(r'x="([-\d.]+)"', attrs); ym = re.search(r'y="([-\d.]+)"', attrs)
        if not xm or not ym:
            continue
        x, y = float(xm.group(1)), float(ym.group(1))
        w = len(body) * per[cls]
        if 'text-anchor="middle"' in attrs: x -= w / 2
        elif 'text-anchor="end"' in attrs:  x -= w
        yield body[:34], (x, y - size[cls] * 0.8, x + w, y + size[cls] * 0.25)


def gap(a, b):
    dx = max(b[0] - a[2], a[0] - b[2])
    dy = max(b[1] - a[3], a[1] - b[3])
    if dx >= 0 or dy >= 0:
        return max(dx, dy)
    return -1.0          # overlapping


def main():
    s = SVG.read_text()
    tx = list(texts(s))
    bad = []
    for icon, box in marks(s):
        worst, who = 1e9, None
        for body, tb in tx:
            g = gap(box, tb)
            if g < worst:
                worst, who = g, body
        if worst < CLEAR:
            bad.append((icon, worst, who))
    if bad:
        print('Marks with less than %.0f units clear:' % CLEAR)
        for icon, g, who in bad:
            print('  mark %-3s %6.1f from "%s"' % (icon, g, who))
        return 1
    print('all %d marks have at least %.0f units clear' % (len(list(marks(s))), CLEAR))
    return 0


if __name__ == '__main__':
    sys.exit(main())

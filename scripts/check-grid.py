"""Hold the schematic to its 8-unit grid.

Every structural coordinate sits on a grid so that spacing, symmetry and
alignment are decided once rather than nudged per edit. Three tiers:

  module 8   rect x/y/width/height, and every corner an arrow turns at
  module 4   centre lines only — a box of even module width has its centre on
             the half-module, and an arrowhead stops 4 short of what it meets
  exempt     arc bridges (corridor ±7 by construction) and the drawn globe,
             which is freehand art rather than structure
"""
import re, sys

M = 8
svg = open('diagrams/infrastructure-map.svg').read()
body = svg[svg.index('<!-- ══ the physical world'):]
bad, half, horiz, vert = [], [], [], []

# ── rects ──────────────────────────────────────────────────────────────────
for m in re.finditer(r'<rect class="([^"]+)"([^/]*)/>', body):
    cls, attrs = m.group(1), m.group(2)
    for k in ('x', 'y', 'width', 'height'):
        v = re.search(r'\b%s="([-\d.]+)"' % k, attrs)
        if v and float(v.group(1)) % M:
            bad.append('rect .%s %s=%s' % (cls, k, v.group(1)))

# ── paths ──────────────────────────────────────────────────────────────────
for m in re.finditer(r'<path class="(?!g-)([^"]+)"[^>]*?\sd="([^"]+)"', body):
    cls, d = m.group(1), m.group(2)
    # An arc is a bridge: its endpoint and the H that leads into it are the
    # crossed corridor ±7, so neither can sit on the grid.
    core = re.sub(r'H[-\d.]+\s+A7 7 0 0 [01] [-\d.]+ [-\d.]+', ' ', d)
    horiz += [float(v) for v in re.findall(r'H([-\d.]+)', core)]
    vert  += [float(v) for v in re.findall(r'V([-\d.]+)', core)]
    for n in re.findall(r'[-\d.]+', core.replace('M', ' ', 1)):
        v = float(n)
        if v % M == 0:      continue
        if v % (M // 2) == 0: half.append('%s %g' % (cls, v)); continue
        bad.append('path .%s coordinate %s' % (cls, n))

# ── the gutters, which have to stay evenly spaced ──────────────────────────
def spacing(name, vals):
    vals = sorted(set(vals))
    gaps = {vals[i + 1] - vals[i] for i in range(len(vals) - 1)}
    print('  %-22s %-28s gap %s' % (name, vals, sorted(gaps)))
    if len(gaps) > 1:
        bad.append('%s are not evenly spaced: %s' % (name, sorted(gaps)))

print('gutters and lanes')
LEFT, RIGHT = 24, 1424        # the outer edges of the left and right frames
lx = [v for v in horiz if v < LEFT]
rx = [v for v in horiz if v > RIGHT + 296]
spacing('left corridors',  lx)
spacing('right corridors', rx)
spacing('supply lanes',    [v for v in vert if v > 900])

print('\nmodule %d, half-module used %d time(s) for centre lines' % (M, len(half)))
if bad:
    for b in sorted(set(bad)):
        print('  OFF GRID  ' + b)
    sys.exit(1)
print('every structural coordinate is on the grid')

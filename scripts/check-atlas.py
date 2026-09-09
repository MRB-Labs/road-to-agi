#!/usr/bin/env python3
"""Hold the atlas layout to its own rules.

The previous schematic was hand-drawn, so its guards checked a file of literal
coordinates. The atlas is generated from a layout config, so the things worth
checking are different: that every card sits inside the region it claims, that
no two cards overlap, that nothing runs under a region's title, that every
route names ends that exist, and that every card maps to a real layer.

    python3 scripts/check-atlas.py
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
LAYOUT = (ROOT / 'assets' / 'atlas' / 'atlas-layout.js').read_text()
CARDS  = (ROOT / 'assets' / 'content.js').read_text()

TITLE_BAND = 76      # the space a region keeps for its own title and subtitle
GUTTER     = 8       # the least clear space between a card and its region edge

def num(v): return int(float(v))

canvas = re.search(r'ATLAS_CANVAS = \{w: *(\d+), *h: *(\d+)\}', LAYOUT)
W, H = num(canvas.group(1)), num(canvas.group(2))

regions = {m[0]: dict(x=num(m[1]), y=num(m[2]), w=num(m[3]), h=num(m[4]))
           for m in re.findall(
               r"\{key:'(\w+)',[^}]*?x:(-?\d+),\s+y:(\d+), w:(\d+), h:(\d+)\}",
               LAYOUT, re.S)}
nodes = [dict(id=m[0], layer=num(m[1]), region=m[2], x=num(m[3]), y=num(m[4]),
              w=num(m[5]), h=num(m[6]))
         for m in re.findall(
             r"\{id:'(\w+)',\s+layer:(\d+),\s+region:'(\w+)',\s+x:(\d+),\s+y:(\d+), w:(\d+), h:(\d+)",
             LAYOUT)]
routes = re.findall(r"\{from:'(\w+)',\s+to:'(\w+)',\s+flow:'(\w+)'", LAYOUT)
flows  = set(re.findall(r'^  (\w+): *\{label:', LAYOUT, re.M))
world  = re.search(r'ATLAS_WORLD = \{cx:(\d+), cy:(\d+), r:(\d+)', LAYOUT)
wx, wy, wr = num(world.group(1)), num(world.group(2)), num(world.group(3))

bad = []

# ── every card inside its region, clear of the title, and of every other card ──
for n in nodes:
    r = regions.get(n['region'])
    if not r:
        bad.append('%s claims region %s, which does not exist' % (n['id'], n['region'])); continue
    if n['x'] < r['x'] + GUTTER or n['x'] + n['w'] > r['x'] + r['w'] - GUTTER:
        bad.append('%s sticks out of %s horizontally' % (n['id'], n['region']))
    if n['y'] + n['h'] > r['y'] + r['h'] - GUTTER:
        bad.append('%s runs past the bottom of %s' % (n['id'], n['region']))
    if n['y'] < r['y'] + TITLE_BAND:
        bad.append('%s sits under the %s title' % (n['id'], n['region']))

for i, a in enumerate(nodes):
    for b in nodes[i + 1:]:
        if (a['x'] < b['x'] + b['w'] and b['x'] < a['x'] + a['w'] and
                a['y'] < b['y'] + b['h'] and b['y'] < a['y'] + a['h']):
            bad.append('%s and %s overlap' % (a['id'], b['id']))

# ── the regions themselves must not collide, or with the planet ──────────────
rs = sorted(regions.items(), key=lambda kv: kv[1]['x'])
for (ka, a), (kb, b) in zip(rs, rs[1:]):
    if a['x'] + a['w'] > b['x']:
        bad.append('regions %s and %s overlap' % (ka, kb))
last = rs[-1][1]
if last['x'] + last['w'] > wx - wr:
    bad.append('the last region runs into the planet')
if wx + wr > W or wy + wr > H:
    bad.append('the planet falls outside the canvas')

# ── routes must connect things that exist, and name a real flow ──────────────
ids = {n['id'] for n in nodes} | {'world'}
for f, t, flow in routes:
    for end in (f, t):
        if end not in ids:
            bad.append('a route names %s, which is not a card' % end)
    if flow not in flows:
        bad.append('a route uses flow %s, which is not declared' % flow)

# ── every card must map to a layer the report actually has ───────────────────
taxonomy = (ROOT / 'assets' / 'taxonomy.js').read_text()
# layer 0 is the physical world, which the atlas draws as the planet rather
# than as a card — every other layer must appear somewhere on the map
layers = {num(x) for x in re.findall(r'\{n:(\d+),\s+key:', taxonomy)} - {0}
for n in nodes:
    if n['layer'] not in layers:
        bad.append('%s maps to layer %d, which is not in the taxonomy' % (n['id'], n['layer']))
missing = layers - {n['layer'] for n in nodes}
if missing:
    bad.append('no card for layer(s) %s' % sorted(missing))

# ── every card must have its label ───────────────────────────────────────────
labelled = set(re.findall(r"^ (\w+)\s*:\{t:", CARDS, re.M))
for n in nodes:
    if n['id'] not in labelled:
        bad.append('%s has no entry in ATLAS_CARDS' % n['id'])

print('atlas: %d regions, %d cards, %d routes, %d flows, canvas %dx%d'
      % (len(regions), len(nodes), len(routes), len(flows), W, H))
if bad:
    for b in sorted(set(bad)):
        print('  ' + b)
    sys.exit(1)
print('layout is sound')

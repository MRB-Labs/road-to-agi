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
              w=num(m[5]), h=num(m[6]), encl='encl' in m[7], sub='sub' in m[7])
         for m in re.findall(
             r"\{id:'(\w+)',\s+layer:(\d+),\s+region:'(\w+)',\s+x:(\d+),\s+y:(\d+), w:(\d+), h:(\d+)(.*)",
             LAYOUT)]
routes = re.findall(r"\{from:'([#\w]+)',\s+to:'([#\w]+)',\s+flow:'(\w+)'", LAYOUT)
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
    if n['sub'] and not any(e['encl'] and e['region'] == n['region'] for e in nodes):
        bad.append('%s is marked as a block inside an enclosure that does not exist' % n['id'])

def inside(inner, outer):
    return (outer['x'] <= inner['x'] and outer['y'] <= inner['y'] and
            inner['x'] + inner['w'] <= outer['x'] + outer['w'] and
            inner['y'] + inner['h'] <= outer['y'] + outer['h'])

for i, a in enumerate(nodes):
    for b in nodes[i + 1:]:
        if not (a['x'] < b['x'] + b['w'] and b['x'] < a['x'] + a['w'] and
                a['y'] < b['y'] + b['h'] and b['y'] < a['y'] + a['h']):
            continue
        # an enclosure is meant to contain its region's blocks — but it has to
        # contain them properly, not clip them
        if a['encl'] and b['sub'] and a['region'] == b['region']:
            if not inside(b, a):
                bad.append('%s is not fully inside %s' % (b['id'], a['id']))
            continue
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
# a route may aim at a whole macro-system, written '#key'
ids = {n['id'] for n in nodes} | {'world'} | {'#' + k for k in regions}
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

# ── no route may run through a card ──────────────────────────────────────────
# The router in atlas-geometry.js is deterministic — anchors, guides, one elbow
# — so it can be replayed here and tested against every card. This is the guard
# the previous schematic had as check-crossings.py: a line through a name is the
# one flaw that makes a diagram unreadable.
STUB = 18
CLEAR = 4          # a route may graze a card's edge, never cross into it

by_id = {n['id']: n for n in nodes}
by_id['world'] = dict(id='world', x=wx - wr, y=wy - wr, w=wr * 2, h=wr * 2)
for _k, _g in regions.items():
    by_id['#' + _k] = dict(id='#' + _k, **_g)


def anchor(n, side, off):
    if side == 'left':  return (n['x'], n['y'] + n['h'] / 2 + off), (-1, 0)
    if side == 'right': return (n['x'] + n['w'], n['y'] + n['h'] / 2 + off), (1, 0)
    if side == 'top':   return (n['x'] + n['w'] / 2 + off, n['y']), (0, -1)
    return (n['x'] + n['w'] / 2 + off, n['y'] + n['h']), (0, 1)


def replay(spec):
    a, b = by_id[spec['from']], by_id[spec['to']]
    sa, sb = spec.get('side', ['right', 'left'])
    A, na = anchor(a, sa, spec.get('dx', 0))
    B, nb = anchor(b, sb, spec.get('tx', spec.get('dy', 0)))
    pts = [A, (A[0] + na[0] * STUB, A[1] + na[1] * STUB)]
    for g in spec.get('via', []):
        cur = pts[-1]
        pts.append((g['x'], cur[1]) if 'x' in g else (cur[0], g['y']))
    Bo = (B[0] + nb[0] * STUB, B[1] + nb[1] * STUB)
    cur = pts[-1]
    if cur[0] != Bo[0] and cur[1] != Bo[1]:
        pts.append((cur[0], Bo[1]) if nb[0] != 0 else (Bo[0], cur[1]))
    return pts + [Bo, B]



def fan(specs):
    """The mirror of AtlasGeom.fan. Route ends sharing a (card, side) are spread
       evenly about its centre, ordered by where the far end sits across that
       edge. If this drifts from the JavaScript the guard checks a diagram that
       is not the one that ships, so the two are written to match line for line."""
    by, off = {}, [dict() for _ in specs]
    for i, sp in enumerate(specs):
        sa, sb = sp.get('side', ['right', 'left'])
        for ident, side, prop in ((sp['from'], sa, 'dx'), (sp['to'], sb, 'tx')):
            by.setdefault((ident, side), []).append((i, prop, ident, side))
    for (ident, side), lst in by.items():
        host = by_id.get(ident)
        if host is None:
            continue
        vert = side in ('left', 'right')

        def across(e):
            sp = specs[e[0]]
            far = by_id.get(sp['to'] if e[1] == 'dx' else sp['from'])
            if far is None:
                return 0
            return far['y'] + far['h'] / 2 if vert else far['x'] + far['w'] / 2

        def keep(e, auto=None):
            sp = specs[e[0]]
            given = sp.get('dx') if e[1] == 'dx' else sp.get('tx', sp.get('dy'))
            v = given if given is not None else auto
            if v is not None:
                off[e[0]][e[1]] = v

        # a fork takes one slot, not one per branch
        slots, seen = [], {}
        for e in lst:
            t = specs[e[0]].get('trunk') if e[1] == 'dx' else None
            if t is not None and t in seen:
                slots[seen[t]].append(e); continue
            if t is not None:
                seen[t] = len(slots)
            slots.append([e])
        if len(slots) < 2:
            for sl in slots:
                for e in sl:
                    keep(e)
            continue
        slots.sort(key=lambda sl: (sum(across(e) for e in sl) / len(sl), sl[0][0]))
        n, extent = len(slots), (host['h'] if vert else host['w'])
        step = min(40, max(12, (extent - 40) / (n - 1)))
        for j, sl in enumerate(slots):
            for e in sl:
                keep(e, round((j - (n - 1) / 2) * step))
    return off


def spec_of(text):
    out = {'from': re.search(r"from:'([#\w]+)'", text).group(1),
           'to':   re.search(r"to:'([#\w]+)'", text).group(1),
           'flow': re.search(r"flow:'(\w+)'", text).group(1)}
    m = re.search(r"trunk:'([\w-]+)'", text)
    if m:
        out['trunk'] = m.group(1)
    m = re.search(r"side:\['(\w+)','(\w+)'\]", text)
    if m:
        out['side'] = [m.group(1), m.group(2)]
    for k in ('dx', 'dy', 'tx'):
        m = re.search(r"\b%s:(-?\d+)" % k, text)
        if m:
            out[k] = num(m.group(1))
    out['via'] = [({'x': num(v)} if ax == 'x' else {'y': num(v)})
                  for ax, v in re.findall(r"\{([xy]):(-?\d+)\}", text)]
    return out


def hits(seg, r):
    (x1, y1), (x2, y2) = seg
    lo, hi = sorted((x1, x2))
    tlo, thi = sorted((y1, y2))
    return (lo < r['x'] + r['w'] - CLEAR and r['x'] + CLEAR < hi and
            tlo < r['y'] + r['h'] - CLEAR and r['y'] + CLEAR < thi)


def route_specs(text):
    """Each route object, whole. A regex cannot do this: `via` contains its own
       braces, so any non-greedy match stops at the first one."""
    out, i = [], 0
    while True:
        i = text.find("{from:'", i)
        if i < 0:
            return out
        depth, j = 0, i
        while j < len(text):
            if text[j] == '{':
                depth += 1
            elif text[j] == '}':
                depth -= 1
                if depth == 0:
                    out.append(text[i:j + 1]); i = j + 1; break
            j += 1
        else:
            return out


_body = LAYOUT[LAYOUT.index('const ATLAS_ROUTES'):]
_specs = [spec_of(t) for t in route_specs(_body)]
_off = fan(_specs)
_checked = 0
_paths = []
for _spec, _o in zip(_specs, _off):
    _spec = dict(_spec, **_o)
    _pts = [(round(x, 2), round(y, 2)) for x, y in replay(_spec)]
    _paths.append((_spec['from'] + ' to ' + _spec['to'], _pts))
    _checked += 1
    _ends = {_spec['from'], _spec['to']}
    for _i in range(len(_pts) - 1):
        _seg = (_pts[_i], _pts[_i + 1])
        for _n in nodes:
            if _n['id'] in _ends or _n['encl']:
                continue
            if hits(_seg, _n):
                bad.append('the %s route runs through %s'
                           % (_spec['from'] + ' to ' + _spec['to'], _n['id']))

# ── two arrows must not leave, arrive, or travel on the same line ────────────
# Centring an arrow on its card reads well until a second one lands on the same
# point, and then neither can be followed. Coincident ends are exact; a shared
# lane is two runs on the same row or column overlapping far enough to look
# like one line. OVERLAP is generous, because short shared stubs are normal.
OVERLAP = 40

# A fork is the one place two runs are meant to coincide. Trunk-mates must
# agree on where they leave and why, or the shared line would be a lie about
# what is flowing along it.
_trunks = {}
for _s in _specs:
    if _s.get('trunk'):
        _trunks.setdefault(_s['trunk'], []).append(_s)
for _t, _mates in _trunks.items():
    if len({(m['from'], tuple(m.get('side', ['right', 'left'])[:1]), m['flow'])
            for m in _mates}) > 1:
        bad.append('the %s fork joins runs that do not leave the same card, '
                   'side and flow' % _t)
    if len(_mates) < 2:
        bad.append('the %s fork has only one branch' % _t)

_starts, _arrivals = {}, {}
for _i, (_name, _pts) in enumerate(_paths):
    _starts.setdefault(_pts[0], []).append(_i)
    _arrivals.setdefault(_pts[-1], []).append(_i)
for _where, _table in (('leave from', _starts), ('arrive at', _arrivals)):
    for _pt, _who in _table.items():
        _who = [i for i in _who if _where == 'arrive at' or not _specs[i].get('trunk')]
        if len(_who) > 1:
            bad.append('%s %s the same point'
                       % (' and '.join(sorted(_paths[i][0] for i in _who)), _where))


def segments(pts):
    for i in range(len(pts) - 1):
        (x1, y1), (x2, y2) = pts[i], pts[i + 1]
        if x1 == x2 and y1 != y2:
            yield ('v', x1, min(y1, y2), max(y1, y2))
        elif y1 == y2 and x1 != x2:
            yield ('h', y1, min(x1, x2), max(x1, x2))


for _i in range(len(_paths)):
    for _j in range(_i + 1, len(_paths)):
        _na, _nb = _paths[_i][0], _paths[_j][0]
        _ta, _tb = _specs[_i].get('trunk'), _specs[_j].get('trunk')
        if _ta is not None and _ta == _tb:
            continue                      # a fork: the shared run is the point
        for _a in segments(_paths[_i][1]):
            for _b in segments(_paths[_j][1]):
                if _a[0] != _b[0] or _a[1] != _b[1]:
                    continue
                if min(_a[3], _b[3]) - max(_a[2], _b[2]) > OVERLAP:
                    bad.append('%s and %s share a lane' % (_na, _nb))

print('atlas: %d regions, %d cards, %d routes replayed, %d flows, canvas %dx%d'
      % (len(regions), len(nodes), _checked, len(flows), W, H))
if bad:
    for b in sorted(set(bad)):
        print('  ' + b)
    sys.exit(1)
print('layout is sound')

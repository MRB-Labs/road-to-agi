#!/usr/bin/env python3
"""Check the published site is actually up and actually says what it should.

Every other guard runs against the repository. This one runs against the live
page, which is the only thing that can tell you a deploy silently half-worked,
an asset 404s, or the market data quietly stopped refreshing months ago.

    python3 scripts/check-live.py                     the published site
    python3 scripts/check-live.py --base http://localhost:8777/

Standard library only, so it needs nothing installed in CI.
"""
import argparse, json, re, sys, urllib.request, urllib.error
from datetime import datetime, timezone

BASE = 'https://mrb-labs.github.io/road-to-agi/'
STALE_DAYS = 4          # the fundamentals workflow runs daily; four days is a fault

PAGES = ['', 'stack.html', 'investor.html', 'markets.html',
         'environment.html', 'projects.html', 'method.html', 'sources.html']
ASSETS = ['style.css', 'script.js', 'assets/content.js', 'assets/taxonomy.js',
          'robots.txt', 'sitemap.xml', 'assets/images/social-card.png']
# (page, what must appear, why it matters)
CONTENT = [
    ('',            r'<svg id="mapsvg"',            'the infrastructure map'),
    ('',            r'The physical infrastructure', 'the headline'),
    ('stack.html',  r'id="rail"',                   'the layer rail'),
    ('investor.html', r'<h1[ >]',                   'a top-level heading'),
    ('method.html', r'<h1[ >]',                     'a top-level heading'),
]


def get(url, timeout=30):
    req = urllib.request.Request(url, headers={'User-Agent': 'road-to-agi-canary'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default=BASE)
    a = ap.parse_args()
    base = a.base if a.base.endswith('/') else a.base + '/'
    bad, bodies = [], {}

    for path in PAGES + ASSETS:
        url = base + path
        try:
            status, body = get(url)
            if status != 200:
                bad.append('%s returned %s' % (url, status))
            elif path in PAGES:
                bodies[path] = body.decode('utf-8', 'replace')
        except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
            bad.append('%s could not be fetched: %s' % (url, e))

    for path, pattern, why in CONTENT:
        body = bodies.get(path)
        if body is None:
            continue                       # already reported as unreachable
        if not re.search(pattern, body):
            bad.append('%s%s is missing %s' % (base, path, why))

    # every page a search engine is told about has to exist
    try:
        _, sm = get(base + 'sitemap.xml')
        for loc in re.findall(r'<loc>([^<]+)</loc>', sm.decode()):
            try:
                if get(loc)[0] != 200:
                    bad.append('sitemap lists %s, which does not resolve' % loc)
            except Exception as e:
                bad.append('sitemap lists %s, which failed: %s' % (loc, e))
    except Exception as e:
        bad.append('sitemap.xml could not be read: %s' % e)

    # the market data is refreshed by a schedule nobody watches
    try:
        _, raw = get(base + 'assets/market/fundamentals.json')
        data = json.loads(raw)
        n = len(data.get('companies') or {})
        age = (datetime.now(timezone.utc)
               - datetime.fromisoformat(data['generated'])).days
        if n == 0:
            bad.append('fundamentals.json carries no companies')
        if age > STALE_DAYS:
            bad.append('fundamentals.json is %d days old — the daily refresh has '
                       'stopped' % age)
        print('fundamentals: %d companies, %d day(s) old' % (n, age))
    except Exception as e:
        bad.append('fundamentals.json could not be read: %s' % e)

    if bad:
        print('\nLive site problems:')
        for b in bad:
            print('  ' + b)
        return 1
    print('live site healthy: %d pages, %d assets, sitemap resolves'
          % (len(PAGES), len(ASSETS)))
    return 0


if __name__ == '__main__':
    sys.exit(main())

#!/usr/bin/env python3
"""Hold the site to its Content Security Policy.

The policy lives in content/csp.txt, and Cloudflare serves it verbatim. It allows
scripts only from this site and from TradingView, so the browser refuses any
inline <script> and any onclick="…"-style attribute — including one built by
JavaScript. This guard fails if either creeps back in, if the code loads a script
from a host the policy does not name, or if the policy itself is loosened.
check-browsers.py serves every page under the same policy, so whatever this
cannot see statically, a real browser does.

    python3 scripts/check-csp.py                          the repository
    python3 scripts/check-csp.py --live https://stacktoagi.com/
                                                          the live header matches
"""
import pathlib
import re
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSP = (ROOT / 'content' / 'csp.txt').read_text().strip()
EVENTS = r'(?:click|dblclick|load|error|change|input|submit|focus|blur|key\w+|mouse\w+|pointer\w+|touch\w+)'


def directive(name):
    for part in CSP.split(';'):
        bits = part.split()
        if bits and bits[0] == name:
            return bits[1:]
    return []


def norm(p):
    return '; '.join(' '.join(x.split()) for x in p.strip().rstrip(';').split(';'))


def live(url):
    req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'stack-to-agi-canary'})
    got = urllib.request.urlopen(req, timeout=30).headers.get('Content-Security-Policy')
    if not got:
        print('no Content-Security-Policy header on %s yet — set it from content/csp.txt' % url)
        return 0
    if norm(got) != norm(CSP):
        print('the live Content-Security-Policy differs from content/csp.txt')
        print('  live: ' + norm(got)); print('  repo: ' + norm(CSP))
        return 1
    print('live Content-Security-Policy matches content/csp.txt')
    return 0


def main():
    if '--live' in sys.argv:
        return live(sys.argv[sys.argv.index('--live') + 1])
    bad = []
    scripts = directive('script-src')
    if "'unsafe-inline'" in scripts or "'unsafe-eval'" in scripts:
        bad.append("csp.txt: script-src must not allow 'unsafe-inline' or 'unsafe-eval'")
    for p in sorted(ROOT.glob('*.html')):
        if p.name.startswith('atlas-editor'):          # local tool, not deployed
            continue
        html = p.read_text()
        for m in re.finditer(r'<script\b([^>]*)>', html):
            if 'src=' not in m.group(1) and 'application/ld+json' not in m.group(1):
                bad.append('%s: inline <script> — move it into a file' % p.name)
        for ev in re.findall(r'<[a-zA-Z][^>]*?\s(on' + EVENTS + r')\s*=', html):
            bad.append('%s: inline %s= handler — use addEventListener' % (p.name, ev))
        for host in re.findall(r'<script[^>]+src="https://([^/"]+)', html):
            if 'https://' + host not in scripts:
                bad.append('%s: loads a script from %s, which script-src does not allow' % (p.name, host))
    js = [ROOT / 'script.js'] + [p for p in sorted((ROOT / 'assets').rglob('*.js'))
                                 if 'atlas-editor' not in p.name]
    for f in js:
        src = f.read_text()
        rel = f.relative_to(ROOT)
        for m in re.finditer(r'(?<![.\w$])(on' + EVENTS + r')\s*=\s*\\?["\']', src):
            line = src.count('\n', 0, m.start()) + 1
            bad.append('%s:%d: %s= inside generated HTML — the policy blocks it' % (rel, line, m.group(1)))
        for host in set(re.findall(r'https://([a-z0-9.-]+)/[^\'"\s`]*\.js\b', src)):
            if 'https://' + host not in scripts:
                bad.append('%s: loads a script from %s, which script-src does not allow' % (rel, host))
    if bad:
        print('Content Security Policy problems:')
        for b in bad:
            print('  ' + b)
        return 1
    print('content security policy holds: no inline script or handler, every script host allowed')
    return 0


if __name__ == '__main__':
    sys.exit(main())

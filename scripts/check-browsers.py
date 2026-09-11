#!/usr/bin/env python3
"""Open every public page in Chromium, Firefox and WebKit, and fail on what a
reader would actually meet: a script error, a failed or remote request, a
page wider than a phone, an atlas that does not draw, a planet that does not
open. Then audit accessibility with axe-core, held to a baseline that may only
improve — the same ratchet as the wording and the figures.

    python3 scripts/check-browsers.py                     all three engines
    python3 scripts/check-browsers.py --engines chromium  just one
    python3 scripts/check-browsers.py --accept-a11y       record axe results as the baseline

Needs:  pip install playwright==1.47.0 axe-playwright-python==0.1.4
        python -m playwright install --with-deps chromium firefox webkit
CI installs both; locally the check is optional.

Why WebKit: the white rectangle round the planet was a Safari-only focus ring,
and it survived three rounds of review because only Chromium was ever looked at.

The accessibility baseline is CI's, not a Mac's. Contrast is judged on laid-out
text, and Linux wraps some lines differently with its own fallback fonts: the
Method page shows 27 contrast failures there against 25 on macOS. A local run
that finds fewer is reported as an improvement and still passes; a baseline
lowered from a Mac can make CI fail, so lower it only by CI's numbers.
"""
import functools
import http.server
import json
import os
import pathlib
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'stack.html', 'markets.html', 'environment.html',
         'investor.html', 'projects.html', 'method.html', 'sources.html']
BASELINE = ROOT / 'content' / 'a11y-baseline.json'
DESKTOP = {'width': 1440, 'height': 950}
PHONE = {'width': 390, 'height': 844}


def serve():
    """The repository on a free local port, quietly."""
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, 'http://127.0.0.1:%d/' % srv.server_address[1]


def visit(browser, base, page_name, viewport, bad, tag):
    """Load one page and record everything wrong with it into `bad`."""
    ctx = browser.new_context(viewport=viewport)
    page = ctx.new_page()
    say = lambda msg: bad.append('%s %s: %s' % (tag, page_name, msg))
    page.on('pageerror', lambda e: say('script error — %s' % str(e).splitlines()[0][:160]))
    page.on('console', lambda m: m.type == 'error' and say('console error — %s' % m.text[:160]))

    def on_request(req):
        # Nothing may be fetched from another server on load. TradingView is
        # the one declared exception, and it only loads when a company is opened.
        if not req.url.startswith(base) and not req.url.startswith(('data:', 'blob:', 'about:')):
            say('remote request — %s' % req.url[:120])
    page.on('request', on_request)
    page.on('response', lambda r: r.url.startswith(base) and r.status >= 400
            and say('%d for %s' % (r.status, r.url[len(base):])))

    page.goto(base + page_name, wait_until='load')
    page.wait_for_timeout(400)

    wide = page.evaluate('document.documentElement.scrollWidth - innerWidth')
    if wide > 1:
        say('%dpx wider than the %dpx viewport' % (wide, viewport['width']))

    if page_name == 'index.html':
        drawn, expected = page.evaluate(
            "[document.querySelectorAll('#atlas .nd').length,"
            " typeof ATLAS_NODES === 'undefined' ? -1 : ATLAS_NODES.length]")
        if drawn != expected or drawn <= 0:
            say('atlas drew %d cards, expected %d' % (drawn, expected))
        if viewport is DESKTOP:
            check_planet(page, say)
    ctx.close()
    return page


def check_planet(page, say):
    """The planet must open its panel, close on Escape, and never show the
       browser's rectangular focus outline."""
    pw = page.locator('#atlas .pw-node')
    pw.scroll_into_view_if_needed()
    pw.click(force=True)            # the hit disc sits under the halo ring
    try:
        page.wait_for_selector('#atlas-panel.is-open', timeout=2500)
    except Exception:
        say('clicking the planet did not open its panel')
        return
    outline = page.evaluate(
        "getComputedStyle(document.querySelector('#atlas .pw-node')).outlineStyle")
    if outline not in ('none', ''):
        say('the focused planet draws a %s outline — the white rectangle is back' % outline)
    page.keyboard.press('Escape')
    page.wait_for_timeout(400)
    if page.evaluate("document.querySelector('#atlas-panel').classList.contains('is-open')"):
        say('Escape did not close the planet panel')


def audit(browser, base):
    """axe-core on every page, desktop, Chromium: {page: {rule: nodes}}."""
    from axe_playwright_python.sync_playwright import Axe
    axe, found = Axe(), {}
    for name in PAGES:
        ctx = browser.new_context(viewport=DESKTOP)
        page = ctx.new_page()
        page.goto(base + name, wait_until='load')
        page.wait_for_timeout(400)
        res = axe.run(page).response
        found[name] = {v['id']: len(v['nodes']) for v in res.get('violations', [])}
        ctx.close()
    return found


def main():
    args = sys.argv[1:]
    engines = (args[args.index('--engines') + 1].split(',') if '--engines' in args
               else ['chromium', 'firefox', 'webkit'])
    srv, base = serve()
    bad = []
    with sync_playwright() as p:
        for eng in engines:
            browser = getattr(p, eng).launch()
            for name in PAGES:
                visit(browser, base, name, DESKTOP, bad, '[%s desktop]' % eng)
                if eng != 'firefox':    # Firefox has no phones worth testing
                    visit(browser, base, name, PHONE, bad, '[%s phone]' % eng)
            browser.close()
        # accessibility is engine-independent; one engine keeps it fast and stable
        browser = p.chromium.launch()
        found = audit(browser, base)
        browser.close()
    srv.shutdown()

    if '--accept-a11y' in args:
        BASELINE.write_text(json.dumps(found, indent=1, sort_keys=True) + '\n')
        print('accessibility baseline recorded: %d violations across %d pages'
              % (sum(sum(v.values()) for v in found.values()), len(found)))
    else:
        was = json.loads(BASELINE.read_text()) if BASELINE.exists() else {}
        better = []
        for name, rules in found.items():
            for rule, n in rules.items():
                old = was.get(name, {}).get(rule, 0)
                if n > old:
                    bad.append('[a11y] %s: %s rose from %d to %d elements' % (name, rule, old, n))
            for rule, old in was.get(name, {}).items():
                if rules.get(rule, 0) < old:
                    better.append('%s %s %d→%d' % (name, rule, old, rules.get(rule, 0)))
        if better:
            print('accessibility improved (%s) — ratchet it down with --accept-a11y'
                  % ', '.join(better))

    if bad:
        print('%d problem(s):' % len(bad))
        for b in sorted(set(bad)):
            print('  ' + b)
            # In CI, each problem also becomes an annotation on the run, which
            # anyone can read without logging in — the raw log needs a token.
            if os.environ.get('GITHUB_ACTIONS'):
                print('::error title=check-browsers::%s' % b.replace('%', '%25'))
        return 1
    total = sum(sum(v.values()) for v in found.values())
    print('browsers OK: %d pages in %s, desktop and phone; axe %d known violations, none new'
          % (len(PAGES), ', '.join(engines), total))
    return 0


if __name__ == '__main__':
    sys.exit(main())

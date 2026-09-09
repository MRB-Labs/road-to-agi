#!/usr/bin/env python3
"""Stamp every page with the asset hashes and the canonical footer.

Two jobs, both about things that drift silently:

  Asset hashes — without them a reader who has visited before keeps the
  browser's cached copy after a deploy and sees old markup against new styles.

  The footer — it carries the revision, the last-updated date and the rights
  statement. Maintained by hand across eight pages it drifts, and it had:
  method.html said revision 9 while every other page said 10, and credited a
  logo source the others did not. It now comes from content/footer.html, with
  the revision from content/REVISION and the date from the last commit.

Idempotent. Run it after changing style.css, script.js or the footer.
"""
import datetime, sys
import hashlib, re, glob, subprocess, pathlib

ROOT = pathlib.Path(__file__).parent

def h(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()[:8]

MONTHS = ['January','February','March','April','May','June','July',
          'August','September','October','November','December']
UPDATED = ROOT / 'content' / 'UPDATED'


def pretty(iso):
    y, m, d = iso.split('-')
    return '%s %s %s' % (int(d), MONTHS[int(m) - 1], y)


def updated_date():
    """The footer's date, read from content/UPDATED.

    It used to come from the last commit, which made this script's output
    depend on when it ran: the date changed the moment you committed, so CI
    regenerated a different footer and the asset-hash guard failed on a commit
    that had touched nothing. The date is recorded now, and moving it is a
    deliberate act — `python3 bump-assets.py --today` — which is what a
    "last updated" line should mean anyway.
    """
    if '--today' in sys.argv:
        UPDATED.write_text(datetime.date.today().isoformat() + '\n')
    if UPDATED.exists():
        return pretty(UPDATED.read_text().strip())
    return 'an undated working copy'

ver = {'style.css': h('style.css'), 'script.js': h('script.js'),
       'assets/taxonomy.js': h('assets/taxonomy.js')}
# Each page loads its own slice of the content, so stamp them all; the source
# file is not loaded by anything and needs no hash.
for f in sorted(glob.glob('assets/content-*.js')):
    ver[f] = h(f)
# the atlas ships as its own small set of files, stamped the same way
for f in sorted(glob.glob('assets/atlas/*.css')) + sorted(glob.glob('assets/atlas/*.js')):
    ver[f] = h(f)
revision = (ROOT / 'content' / 'REVISION').read_text().strip()
footer = (ROOT / 'content' / 'footer.html').read_text().strip()
footer = footer.replace('{revision}', revision).replace('{updated}', updated_date())
FOOTER_HTML = '<footer><div class="wrap">%s</div></footer>' % footer

# The four workspace pages (index, stack, investor, projects) are fixed-viewport
# app shells and carry no footer by design; only the document pages do.
pages = feet = nofoot = 0
for f in sorted(glob.glob('*.html')):
    t = o = open(f).read()
    for asset, v in ver.items():
        t = re.sub(r'(?<=["\'])' + re.escape(asset) + r'(\?v=[0-9a-f]+)?(?=["\'])',
                   '%s?v=%s' % (asset, v), t)
    if '<footer>' not in t:
        nofoot += 1
    t2 = re.sub(r'<footer>.*?</footer>', lambda _: FOOTER_HTML, t, flags=re.S)
    if t2 != t: feet += 1
    t = t2
    if t != o:
        open(f, 'w').write(t); pages += 1

print('stamped %d page(s): %s' % (pages, ', '.join('%s?v=%s' % (k, v) for k, v in ver.items())))
print('footer: revision %s, updated %s — %d page(s) rewritten, %d app shells have none by design'
      % (revision, updated_date(), feet, nofoot))

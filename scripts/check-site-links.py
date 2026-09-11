#!/usr/bin/env python3
"""Check local links, anchors and static asset references.

External citations are allowed; this guard only checks things the repository
itself should be able to serve.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
HTML = sorted(p for p in ROOT.glob('*.html') if p.name != 'atlas-editor.html')
ASSET_ATTRS = {'href', 'src', 'data', 'poster'}
SKIP_SCHEMES = {'http', 'https', 'mailto', 'tel', 'data', 'javascript'}
CSS_URL = re.compile(r'url\(\s*["\']?([^"\')]+)', re.I)


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        for key in ASSET_ATTRS:
            if attrs.get(key):
                self.refs.append((tag, key, attrs[key]))


def clean_url(value):
    parsed = urlparse(value.strip())
    if not value or parsed.scheme in SKIP_SCHEMES:
        return None
    return parsed


def local_path(base_file, parsed):
    path = unquote(parsed.path)
    if not path and parsed.fragment:
        return base_file.resolve()
    if path.startswith('/road-to-agi/'):
        path = path[len('/road-to-agi/'):]
    elif path.startswith('/'):
        path = path[1:]
    if not path:
        path = 'index.html'
    return (base_file.parent / path).resolve()


def main():
    bad = []
    ids_by_file = {}
    refs_by_file = {}
    for html in HTML:
        parser = Parser()
        parser.feed(html.read_text(encoding='utf-8'))
        ids_by_file[html.resolve()] = parser.ids
        refs_by_file[html] = parser.refs

    for html, refs in refs_by_file.items():
        for tag, attr, raw in refs:
            parsed = clean_url(raw)
            if not parsed:
                continue
            target = local_path(html, parsed)
            if not target.exists():
                bad.append('%s: %s %s="%s" is missing' % (html.name, tag, attr, raw))
                continue
            if parsed.fragment and target.suffix == '.html':
                if parsed.fragment not in ids_by_file.get(target.resolve(), set()):
                    bad.append('%s: #%s is not present in %s' %
                               (html.name, parsed.fragment, target.relative_to(ROOT)))

    for css in [ROOT / 'style.css', ROOT / 'assets' / 'atlas' / 'atlas.css']:
        text = css.read_text(encoding='utf-8')
        for raw in CSS_URL.findall(text):
            parsed = clean_url(raw)
            if parsed and not local_path(css, parsed).exists():
                bad.append('%s: url(%s) is missing' % (css.relative_to(ROOT), raw))

    if bad:
        print('Broken local links or assets:')
        for b in bad:
            print('  ' + b)
        return 1
    print('site links: %d pages and CSS asset URLs OK' % len(HTML))
    return 0


if __name__ == '__main__':
    sys.exit(main())

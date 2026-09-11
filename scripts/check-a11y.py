#!/usr/bin/env python3
"""Small static accessibility guard for the report shell."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = [
    'index.html', 'stack.html', 'markets.html', 'environment.html',
    'investor.html', 'projects.html', 'method.html', 'sources.html',
]


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.main = False
        self.skip = False
        self.imgs = []
        self.buttons = []
        self.svg = []
        self.positive_tabindex = []
        self.current_button = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1':
            self.h1 += 1
        if tag == 'main':
            self.main = True
        if tag == 'a' and attrs.get('href') == '#main':
            self.skip = True
        if tag == 'img':
            self.imgs.append(attrs)
        if tag == 'button':
            self.buttons.append(attrs)
            self.current_button = attrs
        if tag == 'svg':
            self.svg.append(attrs)
        if attrs.get('tabindex') and re.match(r'^[1-9]\d*$', attrs['tabindex']):
            self.positive_tabindex.append((tag, attrs['tabindex']))

    def handle_data(self, data):
        if self.current_button is not None:
            self.current_button['_text'] = (self.current_button.get('_text', '') + data).strip()

    def handle_endtag(self, tag):
        if tag == 'button':
            self.current_button = None


def main():
    bad = []
    for name in PUBLIC:
        p = ROOT / name
        parser = Parser()
        parser.feed(p.read_text(encoding='utf-8'))
        prefix = name + ': '
        if not parser.main:
            bad.append(prefix + 'missing <main>')
        if name != 'sources.html' and not parser.skip:
            bad.append(prefix + 'missing skip link to #main')
        if parser.h1 != 1:
            bad.append(prefix + 'expected exactly one h1, found %d' % parser.h1)
        for img in parser.imgs:
            if 'alt' not in img and img.get('aria-hidden') != 'true':
                bad.append(prefix + '<img> missing alt or aria-hidden')
        for button in parser.buttons:
            if not (button.get('aria-label') or button.get('aria-labelledby') or button.get('_text')):
                bad.append(prefix + '<button> has no accessible name')
        for tag, tabindex in parser.positive_tabindex:
            bad.append(prefix + '<%s tabindex="%s"> uses positive tabindex' % (tag, tabindex))

    if bad:
        print('Accessibility shell problems:')
        for b in bad:
            print('  ' + b)
        return 1
    print('accessibility shell: %d public pages OK' % len(PUBLIC))
    return 0


if __name__ == '__main__':
    sys.exit(main())

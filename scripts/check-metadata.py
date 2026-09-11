#!/usr/bin/env python3
"""Static metadata guard for the publishable pages.

This is intentionally small and dependency-free: it checks the exact things a
public static report tends to lose during hand edits — title, description,
canonical URL, social card metadata, theme colour and favicon.
"""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = [
    'index.html', 'stack.html', 'markets.html', 'environment.html',
    'investor.html', 'projects.html', 'method.html', 'sources.html',
]
BASE = 'https://mrb-labs.github.io/road-to-agi/'
SOCIAL = ROOT / 'assets' / 'images' / 'social-card.png'
FAVICON = ROOT / 'assets' / 'images' / 'favicon.svg'


class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ''
        self.meta = {}
        self.links = []
        self.html_lang = None
        self.theme_fixed = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.html_lang = attrs.get('lang')
        if tag == 'title':
            self.in_title = True
        if tag == 'meta':
            key = attrs.get('name') or attrs.get('property')
            if key:
                self.meta[key] = attrs.get('content', '')
        if tag == 'link':
            self.links.append(attrs)

    def handle_data(self, data):
        if self.in_title:
            self.title += data

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False


def expected_canonical(name):
    return BASE if name == 'index.html' else BASE + name


def png_size(path):
    raw = path.read_bytes()[:24]
    if raw[:8] != b'\x89PNG\r\n\x1a\n':
        return None
    return int.from_bytes(raw[16:20], 'big'), int.from_bytes(raw[20:24], 'big')


def main():
    bad = []
    if not SOCIAL.exists():
        bad.append('assets/images/social-card.png is missing')
    elif png_size(SOCIAL) != (1200, 630):
        bad.append('assets/images/social-card.png must be 1200x630')
    if not FAVICON.exists():
        bad.append('assets/images/favicon.svg is missing')

    for name in PUBLIC:
        p = ROOT / name
        h = HeadParser()
        h.feed(p.read_text(encoding='utf-8'))
        prefix = name + ': '

        if h.html_lang != 'en':
            bad.append(prefix + '<html lang="en"> is missing')
        if not h.title.strip():
            bad.append(prefix + 'title is missing')
        if len(h.meta.get('description', '').strip()) < 50:
            bad.append(prefix + 'description is missing or too short')
        canon = [l.get('href') for l in h.links if l.get('rel') == 'canonical']
        if canon != [expected_canonical(name)]:
            bad.append(prefix + 'canonical URL is wrong')
        icon = [l.get('href') for l in h.links if 'icon' in (l.get('rel') or '').split()]
        if icon != ['assets/images/favicon.svg']:
            bad.append(prefix + 'favicon link is missing')

        required_meta = [
            'og:type', 'og:site_name', 'og:url', 'og:title', 'og:description',
            'og:image', 'og:image:width', 'og:image:height', 'og:image:alt',
            'twitter:card', 'twitter:title', 'twitter:description',
            'theme-color',
        ]
        for key in required_meta:
            if not h.meta.get(key):
                bad.append(prefix + key + ' is missing')
        if h.meta.get('og:url') != expected_canonical(name):
            bad.append(prefix + 'og:url does not match canonical')
        if h.meta.get('og:image') != BASE + 'assets/images/social-card.png':
            bad.append(prefix + 'og:image must point to the social card')
        if h.meta.get('og:image:width') != '1200' or h.meta.get('og:image:height') != '630':
            bad.append(prefix + 'social-card dimensions are wrong')
        if h.meta.get('twitter:card') != 'summary_large_image':
            bad.append(prefix + 'twitter:card must be summary_large_image')

    if bad:
        print('Metadata problems:')
        for b in bad:
            print('  ' + b)
        return 1
    print('metadata: %d public pages, favicon and social card OK' % len(PUBLIC))
    return 0


if __name__ == '__main__':
    sys.exit(main())

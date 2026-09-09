#!/usr/bin/env python3
"""Draw the link-preview card, in the site's own dark palette.

A link to the report used to unfurl as a bare URL. This renders the 1200x630
card that Slack, X, LinkedIn and iMessage show instead. Colours are read out of
style.css rather than retyped, so the ten layer swatches cannot drift from the
palette they are meant to be.

    python3 scripts/build-social-card.py     → assets/images/social-card.png
"""
import re, pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS  = (ROOT / 'style.css').read_text()

# style.css carries several [data-theme="dark"] blocks — one of them only sets
# the globe. Take the last that actually defines the layer palette: that is the
# one the cascade lands on, and reading an earlier one gives stale colours.
blocks = [CSS[m.end():CSS.index('\n}', m.end())]
          for m in re.finditer(r'\[data-theme="dark"\]\{', CSS)]
block = [b for b in blocks if '--l10:' in b][-1]
var   = lambda n: re.search(r'--%s:\s*(#[0-9A-Fa-f]{6})' % n, block).group(1)

BG, INK, MUTED, ACCENT = var('bg'), var('ink'), var('muted'), var('accent')
LAYERS = [var('l%d' % n) for n in range(1, 11)]

W, H, PAD = 1200, 630, 84
FONTS = '/System/Library/Fonts/Supplemental/'
def font(name, size):
    for p in (FONTS + name, '/System/Library/Fonts/' + name):
        if pathlib.Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default(size)

img = Image.new('RGB', (W, H), BG)
d   = ImageDraw.Draw(img)

d.text((PAD, PAD), 'ROAD TO AGI', font=font('Arial Bold.ttf', 26), fill=ACCENT)

y = 176
for line in ['The physical infrastructure', 'behind AI']:
    d.text((PAD, y), line, font=font('Arial Bold.ttf', 76), fill=INK)
    y += 92

d.text((PAD, 392), 'Ten layers, the companies inside each, and where the',
       font=font('Arial.ttf', 30), fill=MUTED)
d.text((PAD, 434), 'binding constraints actually sit.',
       font=font('Arial.ttf', 30), fill=MUTED)

# the ten layers, in order, in their own colours
sw_w, gap = 92, 12
x = PAD
for i, c in enumerate(LAYERS):
    d.rounded_rectangle([x, 520, x + sw_w, 534], radius=7, fill=c)
    d.text((x, 552), str(i + 1), font=font('Arial Bold.ttf', 22), fill=c)
    x += sw_w + gap

out = ROOT / 'assets' / 'images' / 'social-card.png'
out.parent.mkdir(parents=True, exist_ok=True)
img.save(out, optimize=True)
print('%s  %dx%d  %.0f KB' % (out.relative_to(ROOT), W, H, out.stat().st_size / 1024))

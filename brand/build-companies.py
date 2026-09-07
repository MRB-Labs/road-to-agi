#!/usr/bin/env python3
"""Map the company database onto this report's value chains.

Source of truth is brand/COMPANY_VALUE_CHAIN_DATABASE.md, read directly:
company names, tickers and value-chain positions all come from that file.
brand/stage_map.py says where each of its positions belongs in this report's
own chains.

This script writes a generated block into script.js containing MARKET_MAP (the
companies for each stage) and the CT rows they need, plus a registry for
reference. It does NOT touch company logos and never generates one.

    python3 brand/build-companies.py           rebuild
    python3 brand/build-companies.py --check   fail if script.js is out of date
    python3 brand/build-companies.py --logos   list named companies with no mark
"""
from __future__ import annotations
import csv, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from stage_map import STAGE_MAP

ROOT = Path(__file__).parent.parent
MD   = Path(__file__).parent / 'COMPANY_VALUE_CHAIN_DATABASE.md'
REGISTRY = ROOT / 'brand' / 'company_registry.csv'
SCRIPT   = ROOT / 'assets' / 'content.js'

BEGIN = '/* BEGIN generated-company-data — built by brand/build-companies.py, do not edit here */'
END   = '/* END generated-company-data */'

# Groups rather than companies. Never given a ticker, a row or a mark.
GENERIC = {
 'Hyperscalers','Neoclouds','Governments','Enterprises','Model labs','Frontier labs',
 'Sovereign programmes','Licensed corpora','Open weights','Synthetic generation',
 'Enterprise APIs','On-robot selection','Logistics operators','Maintenance depots',
 'Utilities','Transformer makers','Turbine OEMs','Wafer makers','Magnet motor makers',
 'China separation capacity',
}

# Ticker suffix -> (country, stockanalysis exchange segment). Only the suffixes
# the database actually uses; anything else is left without a quote link rather
# than guessed at.
SUFFIX = {
 'SW':('Switzerland','swx'), 'L':('United Kingdom','lon'), 'DE':('Germany','etr'),
 'PA':('France','epa'),      'MI':('Italy','bit'),         'AS':('Netherlands','ams'),
 'MC':('Spain','bme'),       'CO':('Denmark','cph'),       'ST':('Sweden','sto'),
 'HE':('Finland','hel'),     'OL':('Norway','osl'),        'BR':('Belgium','ebr'),
 'VI':('Austria','vie'),     'T':('Japan','tyo'),          'KS':('South Korea','krx'),
 'KQ':('South Korea','krx'), 'TW':('Taiwan','tpe'),        'TWO':('Taiwan','tpe'),
 'HK':('Hong Kong','hkg'),   'SS':('China','sha'),         'SZ':('China','she'),
 'TO':('Canada','tsx'),      'V':('Canada','cve'),         'AX':('Australia','asx'),
 'NS':('India','nse'),       'BO':('India','bom'),         'SI':('Singapore','sgx'),
 'TA':('Israel','tlv'),      'SA':('Brazil','bvmf'),       'MX':('Mexico','bmv'),
 'IS':('Turkey','ist'),      'JO':('South Africa','jse'),  'NZ':('New Zealand','nzx'),
}


def parse_md():
    """[(layer, position, [(name, ticker, status)])] straight from the markdown."""
    rows, layer = [], None
    for line in MD.read_text().split('\n'):
        m = re.match(r'^# Layer (\d+)', line)
        if m: layer = m.group(1); continue
        if re.match(r'^# Cross-Stack', line, re.I): layer = 'X'; continue
        if re.match(r'^# (Commercial|Database)', line, re.I): layer = None; continue
        if not layer or not line.startswith('|') or '---' in line: continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if len(cells) < 4 or cells[0] in ('Value-chain position','Security domain','Code'):
            continue
        found = []
        for cell, status in ((cells[1], 'Public'), (cells[2], 'Private/other')):
            for part in cell.split(';'):
                part = part.strip()
                if not part or part in ('—','-','n/a','None'): continue
                ticks = re.findall(r'`([^`]+)`', part)
                name = re.sub(r'`[^`]*`', '', part)
                name = re.sub(r'\([^)]*\)', '', name).strip(' .,')
                if name:
                    found.append((name, ticks[0] if ticks else '', status))
        rows.append((layer, cells[0], found))
    return rows


def ticker_facts(tick):
    if not tick: return '', ''
    base, _, suf = tick.partition('.')
    if not suf:
        return 'United States', 'stocks/%s' % base.lower()
    if suf.upper() in SUFFIX:
        country, seg = SUFFIX[suf.upper()]
        return country, 'quote/%s/%s' % (seg, base.lower())
    return '', ''


def existing_ct(js):
    i = js.index('const CT='); k = js.index('{', i); depth = 0; j = k
    while j < len(js):
        c = js[j]
        if c in '"\'':
            q = c; j += 1
            while j < len(js):
                if js[j] == '\\': j += 2; continue
                if js[j] == q: break
                j += 1
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: break
        j += 1
    seg = js[k:j]
    names = set(re.findall(r"[\n{]\s*'([^']+)':\[", seg))
    names |= set(re.findall(r'[\n{]\s*"([^"]+)":\[', seg))
    return names


def main():
    check = '--check' in sys.argv
    js = SCRIPT.read_text()
    known = existing_ct(js)

    market, entities, unmapped = {}, {}, []
    for layer, position, found in parse_md():
        key = '%s::%s' % (layer, position)
        if key not in STAGE_MAP:
            unmapped.append(key); continue
        target = STAGE_MAP[key]
        if not target: continue
        for name, tick, status in found:
            if name in GENERIC: continue
            rec = entities.setdefault(name, {'name':name,'ticker':tick,'status':status})
            if tick and not rec['ticker']: rec['ticker'] = tick
            market.setdefault(target, []).append(name)
    for k in market: market[k] = sorted(set(market[k]))

    ct_add = {}
    for rec in entities.values():
        if rec['name'] in known: continue
        country, sa = ticker_facts(rec['ticker'])
        ct_add[rec['name']] = [rec['ticker'] or None, sa or None, country or None]

    if '--logos' in sys.argv:
        logo_names = set(re.findall(r"^\s*'([^']+)':'", js[js.index('const LOGO={'):], re.M))
        missing = sorted(n for n in entities if n not in logo_names)
        print('named by the database, no logo in assets/logos (%d):' % len(missing))
        for n in missing: print('  ', n)
        return 0

    block = (BEGIN + '\n'
      "/* The wider market map, read from the company value-chain database and\n"
      "   mapped onto this report's own stages by brand/stage_map.py. Curated\n"
      "   entries in CHAIN are shown first; these follow, so the chain keeps its\n"
      "   argument and still names the field. Companies without a logo in\n"
      "   assets/logos show a blank plate — see brand/README.md. */\n"
      'const MARKET_MAP=' + json.dumps(market, ensure_ascii=False, sort_keys=True) + ';\n'
      'Object.assign(CT,' + json.dumps(ct_add, ensure_ascii=False, sort_keys=True) + ');\n'
      + END)

    a = js.find(BEGIN); b = js.find(END)
    if a < 0:
        anchor = js.index('\n', js.index('};', js.index('const CT='))) + 1
        new_js = js[:anchor] + '\n' + block + '\n\n' + js[anchor:]
    else:
        new_js = js[:a] + block + js[b+len(END):]

    if check:
        ok = (a >= 0 and js[a:b+len(END)] == block)
        print('script.js: %s' % ('up to date' if ok else 'OUT OF DATE — run brand/build-companies.py'))
        return 0 if ok else 1

    SCRIPT.write_text(new_js)
    with REGISTRY.open('w', newline='') as fh:
        w = csv.writer(fh)
        w.writerow(['display_name','entity_status','ticker','country','stockanalysis_path'])
        for rec in sorted(entities.values(), key=lambda r: r['name'].lower()):
            country, sa = ticker_facts(rec['ticker'])
            w.writerow([rec['name'], rec['status'], rec['ticker'], country, sa])

    if unmapped:
        print('unmapped positions (skipped): %d' % len(unmapped))
        for k in unmapped: print('   ', k)
    print('companies:     %d from the database' % len(entities))
    print('stages mapped: %d carrying %d placements'
          % (len(market), sum(len(v) for v in market.values())))
    print('new CT rows:   %d' % len(ct_add))
    return 0


if __name__ == '__main__':
    sys.exit(main())

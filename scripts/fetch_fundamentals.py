#!/usr/bin/env python3
"""Refresh assets/market/fundamentals.json from Financial Modeling Prep.

Runs in GitHub Actions, never in the browser: the API key comes from the
FMP_API_KEY secret and never reaches the published site. The site reads only
the JSON this writes.

Call budget
-----------
FMP's free tier allows roughly 250 calls a day, and there are ~144 companies.
Quotes and profiles are batched (50 symbols a call, so ~6 calls covers
everything). Statements are per-symbol and cannot be batched, so each run
refreshes only the stalest companies within --budget. Quotes therefore stay
current daily while statements rotate through the set over several runs, which
is ample for numbers that change quarterly.

Usage
-----
    FMP_API_KEY=... python3 scripts/fetch_fundamentals.py --budget 200
    python3 scripts/fetch_fundamentals.py --selftest    # no key, no network
"""
import argparse, json, os, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SYMBOLS = os.path.join(ROOT, 'assets', 'market', 'symbols.json')
OUT = os.path.join(ROOT, 'assets', 'market', 'fundamentals.json')
BASE = 'https://financialmodelingprep.com/stable'

class Budget:
    """Call allowance, plus the two conditions that should end a run early:
    the provider's daily quota being spent, and wall-clock time."""
    def __init__(self, n, seconds=600):
        self.left = n; self.used = 0
        self.deadline = time.monotonic() + seconds
        self.rate_limited = 0; self.stopped = None
    def take(self, n=1):
        if self.stopped: return False
        if self.rate_limited >= 3:
            self.stopped = 'daily quota reached'; return False
        if time.monotonic() > self.deadline:
            self.stopped = 'time budget reached'; return False
        if self.left < n:
            self.stopped = 'call budget reached'; return False
        self.left -= n; self.used += n; return True

def get(path, key, budget, params=None):
    """One call against FMP's current /stable API. Everything is a query
    parameter there; the older /api/v3 path style is legacy."""
    if not budget.take(): return None
    q = dict(params or {}); q['apikey'] = key
    url = f'{BASE}/{path}?{urllib.parse.urlencode(q)}'
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'road-to-agi-fundamentals'})
            with urllib.request.urlopen(req, timeout=20) as r:
                budget.rate_limited = 0
                return json.loads(r.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                # three of these in a row means the daily allowance is gone;
                # sleeping through the rest of the symbols helps nobody
                budget.rate_limited += 1
                if budget.rate_limited >= 3: return None
                time.sleep(2); continue
            if e.code in (401, 403):
                print(f'::error::FMP rejected the key ({e.code}). Check the FMP_API_KEY secret.')
                sys.exit(1)
            return None
        except Exception:
            time.sleep(1); continue
    return None

def chunks(xs, n):
    for i in range(0, len(xs), n): yield xs[i:i + n]

def pick(d, *names):
    """First present key of several. Guards against FMP field renames."""
    for n in names:
        if n in d and d[n] is not None: return d[n]
    return None

def num(v):
    try:
        f = float(v)
        return None if f != f else f          # drop NaN
    except (TypeError, ValueError):
        return None

def refresh(key, budget, retry_all=False):
    # first response of each kind has its field names recorded, so a rename in
    # FMP's API shows up in the job summary instead of silently emptying a column
    seen_keys = {'quote': [], 'profile': [], 'income': [], 'cashflow': []}
    skipped = set()
    syms = json.load(open(SYMBOLS))['symbols']
    prev = {}
    if os.path.exists(OUT):
        try: prev = json.load(open(OUT)).get('companies', {})
        except Exception: prev = {}

    by_symbol = {}
    for name, sym in syms.items(): by_symbol.setdefault(sym, []).append(name)
    out = {n: dict(prev.get(n, {})) for n in syms}

    # ── quotes, one symbol at a time ─────────────────────────────────────────
    # batch-quote is not in the free plan: it returned nothing for all 144
    # symbols on the first run while per-symbol calls worked. Symbols that have
    # missed repeatedly are skipped so they stop consuming the daily budget.
    for sym in sorted(by_symbol):
        if budget.left < 1: break
        names = by_symbol[sym]
        if not retry_all and out[names[0]].get('misses', 0) >= 3 and out[names[0]].get('price') is None:
            skipped.add(sym); continue
        data = get('quote', key, budget, {'symbol': sym}) or []
        if data and not seen_keys['quote']: seen_keys['quote'] = sorted(data[0].keys())
        if not data:
            for name in names: out[name]['misses'] = out[name].get('misses', 0) + 1
            continue
        for q in data:
            for name in names:
                out[name].update({
                    'price': num(pick(q, 'price')),
                    'change': num(pick(q, 'change')),
                    'changePct': num(pick(q, 'changesPercentage', 'changePercentage')),
                    'marketCap': num(pick(q, 'marketCap', 'marketCapitalization')),
                    'pe': num(pick(q, 'pe', 'peRatio')),
                    'eps': num(pick(q, 'eps')),
                    'volume': num(pick(q, 'volume')),
                    'avgVolume': num(pick(q, 'avgVolume', 'averageVolume')),
                    'yearHigh': num(pick(q, 'yearHigh')), 'yearLow': num(pick(q, 'yearLow')),
                    'exchange': pick(q, 'exchange', 'exchangeShortName'),
                    'quoteAt': datetime.now(timezone.utc).isoformat(timespec='seconds'),
                    'misses': 0,
                })
    for sym in sorted(by_symbol):
        if budget.left < 1: break
        names = by_symbol[sym]
        if all(out[n].get('beta') is not None for n in names): continue  # profile is static
        if not retry_all and out[names[0]].get('misses', 0) >= 3 and out[names[0]].get('price') is None:
            continue
        data = get('profile', key, budget, {'symbol': sym}) or []
        if data and not seen_keys['profile']: seen_keys['profile'] = sorted(data[0].keys())
        for p in data:
            for name in names:
                out[name].update({'beta': num(pick(p, 'beta')),
                                  'currency': pick(p, 'currency'),
                                  'site': pick(p, 'website') or None})

    # ── per-symbol: statements, stalest first, only while budget allows ────────
    order = sorted(syms, key=lambda n: out[n].get('statementsAt') or '')
    refreshed = 0
    for name in order:
        if budget.left < 2: break
        sym = syms[name]
        if not retry_all and out[name].get('misses', 0) >= 3 and out[name].get('price') is None:
            continue
        inc = get('income-statement', key, budget, {'symbol': sym, 'limit': 1, 'period': 'annual'}) or []
        cf = get('cash-flow-statement', key, budget, {'symbol': sym, 'limit': 1, 'period': 'annual'}) or []
        if inc and not seen_keys['income']: seen_keys['income'] = sorted(inc[0].keys())
        if cf and not seen_keys['cashflow']: seen_keys['cashflow'] = sorted(cf[0].keys())
        if inc:
            r = inc[0]
            rev, gp = num(pick(r, 'revenue')), num(pick(r, 'grossProfit'))
            out[name].update({
                'revenue': rev, 'netIncome': num(pick(r, 'netIncome')),
                'grossMargin': (gp / rev) if (rev and gp is not None and rev != 0) else None,
                'fiscalYear': pick(r, 'calendarYear', 'fiscalYear'),
                'reportCurrency': pick(r, 'reportedCurrency'),
            })
        if cf:
            out[name]['freeCashFlow'] = num(pick(cf[0], 'freeCashFlow'))
        if inc or cf:
            out[name]['statementsAt'] = datetime.now(timezone.utc).isoformat(timespec='seconds')
            refreshed += 1

    have_quote = sum(1 for v in out.values() if v.get('price') is not None)
    have_stmt = sum(1 for v in out.values() if v.get('revenue') is not None)
    intl = {n for n, sym in syms.items() if '.' in sym}
    missing = sorted(n for n, v in out.items() if v.get('price') is None)
    missing_us = [n for n in missing if n not in intl]
    missing_intl = [n for n in missing if n in intl]
    expected = {'quote': ['marketCap', 'eps', 'pe', 'avgVolume', 'yearHigh', 'yearLow'],
                'profile': ['beta', 'website'], 'income': ['revenue', 'netIncome', 'grossProfit'],
                'cashflow': ['freeCashFlow']}
    unknown = {k: [f for f in v if seen_keys[k] and f not in seen_keys[k]]
               for k, v in expected.items()}
    unknown = {k: v for k, v in unknown.items() if v}
    return {
        'generated': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'source': 'Financial Modeling Prep',
        'companies': out,
    }, {'calls': budget.used, 'quotes': have_quote, 'statements': have_stmt,
        'refreshedStatements': refreshed, 'total': len(syms), 'missing': missing,
        'missingUS': missing_us, 'missingIntl': missing_intl,
        'skipped': len(skipped), 'unknownFields': unknown, 'stopped': budget.stopped}

def selftest():
    """Exercise the shaping logic with no key and no network."""
    assert num('12.5') == 12.5 and num(None) is None and num('x') is None
    assert pick({'a': 1}, 'z', 'a') == 1 and pick({'a': None}, 'a', 'b') is None
    assert BASE.endswith('/stable'), 'should target the current API, not /api/v3'
    assert list(chunks([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]
    b = Budget(2)
    assert b.take() and b.take() and not b.take() and b.stopped == 'call budget reached'
    b = Budget(10); b.rate_limited = 3
    assert not b.take() and b.stopped == 'daily quota reached'
    b = Budget(10, seconds=-1)
    assert not b.take() and b.stopped == 'time budget reached'
    syms = json.load(open(SYMBOLS))['symbols']
    assert len(syms) > 100, 'symbol map looks empty'
    bad = [s for s in syms.values() if not s or ' ' in s]
    assert not bad, f'malformed symbols: {bad[:5]}'
    print(f'selftest ok — {len(syms)} symbols, shaping and budget logic sound')

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--budget', type=int, default=200, help='max API calls this run')
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--seconds', type=int, default=600,
                    help='wall-clock limit, so a run can never hang the workflow')
    ap.add_argument('--retry-all', action='store_true',
                    help='ignore the miss counter — use after upgrading the FMP plan')
    a = ap.parse_args()
    if a.selftest: selftest(); raise SystemExit(0)
    key = os.environ.get('FMP_API_KEY')
    if not key:
        print('::error::FMP_API_KEY is not set'); raise SystemExit(1)
    payload, stats = refresh(key, Budget(a.budget, a.seconds), retry_all=a.retry_all)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as f:
        json.dump(payload, f, ensure_ascii=False, separators=(',', ':'), sort_keys=True)
    if stats['stopped']:
        print(f"::notice::Run ended early — {stats['stopped']}. Progress is saved; the next run continues.")
    print(f"calls={stats['calls']} quotes={stats['quotes']}/{stats['total']} "
          f"statements={stats['statements']}/{stats['total']} "
          f"refreshed={stats['refreshedStatements']}")
    print(f"no quote: {len(stats['missingUS'])} US, {len(stats['missingIntl'])} non-US "
          f"(free plan is US-only); skipped {stats['skipped']} known-missing symbols")
    if stats['missingUS']:
        print(f"US misses: {', '.join(stats['missingUS'][:20])}")
    if stats['unknownFields']:
        print(f"::warning::FMP fields missing from responses: {stats['unknownFields']}")
    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if summary:
        with open(summary, 'a') as f:
            f.write(f"## Fundamentals refresh\n\n"
                    + (f"> Ended early: **{stats['stopped']}**. Progress is saved and the "
                       f"next run picks up where this one stopped.\n\n" if stats['stopped'] else "")
                    + f"- API calls: **{stats['calls']}**\n"
                    f"- Quotes: **{stats['quotes']}/{stats['total']}**\n"
                    f"- Statements: **{stats['statements']}/{stats['total']}** "
                    f"({stats['refreshedStatements']} refreshed this run)\n")
            if stats['skipped']:
                f.write(f"- Skipped **{stats['skipped']}** symbols that have missed "
                        f"three times (re-run with `--retry-all` after a plan change)\n")
            if stats['missingIntl']:
                f.write(f"\n**{len(stats['missingIntl'])} non-US listings have no data.** "
                        f"FMP's free plan covers US markets only; these need a paid plan "
                        f"or they stay on the TradingView widgets alone.\n")
            if stats['missingUS']:
                f.write(f"\n**{len(stats['missingUS'])} US listings returned nothing** — "
                        f"these are worth investigating: {', '.join(stats['missingUS'][:30])}\n")
            if stats['unknownFields']:
                f.write("\n**FMP field names have changed** — these were expected but absent, "
                        "so their columns will be empty until the script is updated:\n\n")
                for k, v in stats['unknownFields'].items():
                    f.write(f"- `{k}`: {', '.join(v)}\n")

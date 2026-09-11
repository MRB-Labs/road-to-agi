/* ══════════════════════════════════════════════════════════════════════════
   ATLAS — THE COMPONENT
   Builds the map from ATLAS_REGIONS / ATLAS_NODES / ATLAS_ROUTES, and wires
   hover, focus, selection, filtering, search, pan, zoom and the detail panel.
   Content comes through AtlasData; geometry through AtlasGeom. Nothing here
   contains prose, and nothing here decides where a card sits.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  const host = document.getElementById('atlas');
  if (!host || typeof ATLAS_NODES === 'undefined' || !AtlasData.ready()) return;

  const W = ATLAS_CANVAS.w, H = ATLAS_CANVAS.h;
  const svgNS = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* nodes by id, plus the planet as a target routes can aim at */
  const N = {};
  ATLAS_NODES.forEach(n => N[n.id] = n);
  N.world = {id:'world', layer:0, x:ATLAS_WORLD.cx - ATLAS_WORLD.r,
             y:ATLAS_WORLD.cy - ATLAS_WORLD.r, w:ATLAS_WORLD.r * 2, h:ATLAS_WORLD.r * 2};
  /* A route may aim at a whole macro-system, written '#key'. The two lines out
     of the physical world do: what they feed is the group that turns nature
     into supply, not one card inside it. */
  ATLAS_REGIONS.forEach(g => N['#' + g.key] = Object.assign({id:'#' + g.key}, g));
  const regionOf = k => ATLAS_REGIONS.find(r => r.key === k);

  /* Route paths are derived before the markup is built, because the markup
     asks for them: a `const` read ahead of its declaration throws. */
  /* Departures and arrivals are fanned out along each edge first — see
     AtlasGeom.fan — so two arrows never leave a card from the same point. */
  const SPREAD = AtlasGeom.fan(N, ATLAS_ROUTES);
  /* An arrow is coloured by the box it leaves, not by what it carries: energy
     out of the grid is the grid's amber, materials out of layer 2 its brown.
     What it carries is still said — by the dash pattern, which is the flow's.
     `tone` in the layout overrides it, for the two runs out of the planet:
     they are the supply of layers 1 and 2 and must be told apart, and the
     world has only one colour of its own. */
  function routeTone(r) {
    if (r.tone) return r.tone;
    const a = N[r.from];
    if (!a || a.id === 'world') return 'world';
    return a.layer ? 'l' + a.layer : 'world';
  }

  const ROUTES = ATLAS_ROUTES.map((r, i) => {
    const a = N[r.from], b = N[r.to];
    if (!a || !b) return null;
    const o = Object.assign({}, r, SPREAD[i], {i, tone: routeTone(r)});
    return Object.assign(o, {d: AtlasGeom.route(a, b, o)});
  }).filter(Boolean);

  /* ── markup ──────────────────────────────────────────────────────────────
     Everything the template below calls must be a *function declaration*, not
     a const arrow: the template runs at this point in the file, and a const is
     unreachable before its own line. That has already cost three debugging
     rounds — ROUTES, pc, regionText. If you add a helper the markup uses,
     write `function name()`. */
  host.className = 'atlas';
  host.innerHTML = `
    <div class="atlas-bg" aria-hidden="true">
      <div class="atlas-bg-photo"></div>
      <div class="atlas-bg-tint"></div>
    </div>
    ${toolbar()}
    <div class="atlas-stage" id="atlas-stage">
      <div class="atlas-world" id="atlas-world">
        <svg class="atlas-canvas" viewBox="0 0 ${W} ${H}">
          ${defs()}
          <g class="atlas-regions" aria-hidden="true">${regions()}</g>
          <g class="atlas-routes" aria-hidden="true">${routes()}</g>
          ${planet()}
        </svg>
        <div class="atlas-nodes" id="atlas-nodes">${cards()}</div>
      </div>
    </div>
    <p class="atlas-hint">Drag to explore &middot; ${modKey()}&#8202;+&#8202;scroll to zoom &middot; Click a layer</p>
    <div class="atlas-controls">
      <button type="button" data-zoom="in"    aria-label="Zoom in">+</button>
      <button type="button" data-zoom="out"   aria-label="Zoom out">&minus;</button>
      <button type="button" data-zoom="reset" aria-label="Fit the whole map">&#9634;</button>
    </div>
    <aside class="atlas-panel" id="atlas-panel" role="dialog" aria-modal="false"
           aria-labelledby="atlas-panel-title" hidden></aside>`;

  const stage  = host.querySelector('#atlas-stage');
  host.classList.remove('is-loading');
  host.style.setProperty('--atlas-w', W + 'px');
  host.style.setProperty('--atlas-h', H + 'px');
  /* One scale for the card layer, matched to the SVG's own viewBox scaling. */
  const fitNodes = () => host.style.setProperty('--atlas-k',
    String((stage.clientWidth || W) / W));
  addEventListener('resize', fitNodes);
  const world  = host.querySelector('#atlas-world');
  const panel  = host.querySelector('#atlas-panel');
  const canvas = host.querySelector('.atlas-canvas');

  /* ── background ────────────────────────────────────────────────────────── */

  function defs() {
    /* One arrowhead per colour actually used. A marker cannot inherit the
       colour of the path that references it, so each tone needs its own. */
    const tones = [...new Set(ROUTES.map(r => r.tone))];
    const flows = tones.map(k =>
      `<marker id="atlasArrow-${k}" viewBox="0 0 10 10" refX="8" refY="5"
               markerWidth="5" markerHeight="5" orient="auto-start-reverse">
         <path d="M1 1.5 L8 5 L1 8.5" fill="none" stroke="var(--atlas-${k})"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
       </marker>`).join('');
    return `<defs>
      ${flows}
      <clipPath id="atlasGlobeClip"><circle r="52"/></clipPath>
      <radialGradient id="atlasHalo">
        <stop offset="55%" stop-color="#3aa7ff" stop-opacity="0"/>
        <stop offset="72%" stop-color="#3aa7ff" stop-opacity=".22"/>
        <stop offset="100%" stop-color="#0a2b4d" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="atlasSea" cx="32%" cy="30%">
        <stop offset="0%"   stop-color="#2e86c8"/>
        <stop offset="55%"  stop-color="#14538c"/>
        <stop offset="100%" stop-color="#062744"/>
      </radialGradient>
      <linearGradient id="atlasLand" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="#5fbf7f"/>
        <stop offset="100%" stop-color="#2f7d63"/>
      </linearGradient>
      <radialGradient id="atlasNight" cx="26%" cy="28%">
        <stop offset="42%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#020a14" stop-opacity=".82"/>
      </radialGradient>
      <filter id="atlasSoft" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="6"/>
      </filter>
    </defs>`;
  }

  /* The planet is the one in the photograph — the canvas shares its aspect, so
     it lands on these coordinates at every size. All that is drawn here is the
     hit area, a rim that answers to hover, and the label.

     The label hangs below the planet, not above it: the two dashed lines that
     leave the top of the world for the foundations used to run straight
     through their own caption. */
  function planet() {
    const t = (typeof ATLAS_WORLD_TEXT !== 'undefined') ? ATLAS_WORLD_TEXT
            : {t:'The physical world', s:''};
    const w = Object.assign({}, ATLAS_WORLD, {label:t.t, sub:t.s});
    const subParts = String(w.sub || '').split(',').map(s => s.trim()).filter(Boolean);
    const subLines = subParts.length >= 4
      ? [`${subParts[0]}, ${subParts[1]},`, `${subParts[2]}, ${subParts.slice(3).join(', ')}`]
      : [w.sub];
    const subText = subLines.map((line, i) =>
      `<tspan x="${w.cx}" ${i ? 'dy="14"' : ''}>${esc(line)}</tspan>`).join('');
    return `<g class="pw-node" tabindex="0" role="button" data-node="world"
               aria-label="${esc(w.label)} — open it in the infrastructure">
      <circle class="pw-hit"  cx="${w.cx}" cy="${w.cy}" r="${w.r + 18}"/>
      <circle class="pw-halo" cx="${w.cx}" cy="${w.cy}" r="${w.r + 26}"/>
      <circle class="pw-rim"  cx="${w.cx}" cy="${w.cy}" r="${w.r}"/>
      <text class="pw-label" x="${w.cx}" y="${w.cy + w.r + 44}" text-anchor="middle">${esc(w.label)}</text>
      <text class="pw-sub"   x="${w.cx}" y="${w.cy + w.r + 66}" text-anchor="middle">${subText}</text>
    </g>`;
  }

  /* ── regions, routes, cards ────────────────────────────────────────────── */
  function regionText(k) {
    return (typeof ATLAS_REGIONS_TEXT !== 'undefined' && ATLAS_REGIONS_TEXT[k])
        || {t: k, s: []};
  }

  /* Region subtitles are set in small caps in a narrow column, so they are
     broken to fit rather than left to overflow the region they name. */
  function wrapSub(r) {
    const max = Math.max(12, Math.floor((r.w - 40) / 5.4));
    const out = [];
    (r.s || []).forEach(line => {
      let cur = '';
      line.split(' ').forEach(w => {
        if ((cur + ' ' + w).trim().length > max) { out.push(cur.trim()); cur = w; }
        else cur += ' ' + w;
      });
      if (cur.trim()) out.push(cur.trim());
    });
    return out;
  }

  function regions() {
    return ATLAS_REGIONS.map(r => Object.assign({}, r, regionText(r.key))).map(r => `
      <g class="rg" data-region="${r.key}" style="color:var(--r-${r.key})">
        <rect class="rg-glow" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/>
        <rect class="rg-box"  x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/>
        <text class="rg-title" x="${r.x + 20}" y="${r.y + 38}">${esc(r.t)}</text>
        ${wrapSub(r).map((s, i) =>
          `<text class="rg-sub" x="${r.x + 20}" y="${r.y + 60 + i * 13}">${esc(s)}</text>`).join('')}
      </g>`).join('');
  }

  function routes() {
    return ROUTES.map(r => `
      <g class="rt-g" data-flow="${r.flow}" data-from="${r.from}" data-to="${r.to}"
         data-ends="${esc([r.from, r.to, r.ends || ''].join(' ').trim())}"
         style="color:var(--atlas-${r.tone})"
         ${r.core ? 'data-core="1"' : ''}>
        <path class="rt-hit" d="${r.d}"/>
        ${routeLabel(r)}
        <path class="rt${r.core ? ' is-core' : ''}" d="${r.d}" stroke="currentColor"
              ${(r.dash || ATLAS_FLOWS[r.flow].dash)
                  ? `stroke-dasharray="${r.dash || ATLAS_FLOWS[r.flow].dash}"` : ''}
              marker-end="url(#atlasArrow-${r.tone})"/>
        <circle class="rt-dot" fill="currentColor" r="3"/>
      </g>`).join('');
  }

  /* Grouped by region so the narrow layout can print a heading before each
     one: the left-to-right journey becomes a top-to-bottom read, in order. */
  /* A few routes carry a word of their own — the two between the machine and
     the world. The label sits on the run, and is written into the SVG at build
     time from a point the path itself reports. */
  function routeLabel(r) {
    const txt = (typeof ATLAS_ROUTE_TEXT !== 'undefined')
      && ATLAS_ROUTE_TEXT[r.from + '>' + r.to];
    if (!txt) return '';
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', r.d);
    const m = p.getTotalLength() / 2, pt = p.getPointAtLength(m);
    return `<text class="rt-label" x="${pt.x.toFixed(0)}" y="${(pt.y - 9).toFixed(0)}"
             text-anchor="middle" fill="currentColor">${esc(txt)}</text>`;
  }

  function cards() {
    return ATLAS_REGIONS.map(r =>
      `<p class="nd-region" aria-hidden="true">${esc(regionText(r.key).t)}</p>` +
      ATLAS_NODES.filter(n => n.region === r.key).map(card1).join('')).join('');
  }

  function card1(n) {
    return (function () {
      const c = AtlasData.card(n), small = !!n.sub;
      return `<button type="button" class="nd${small ? ' is-small' : ''}${n.encl ? ' is-encl' : ''}"
        data-node="${n.id}" data-layer="${n.layer}"
        style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px;
               --nd-ix:${n.ix || 0}px;--nd-iy:${n.iy || 0}px;--nd-is:${(n.iz || 100) / 100};
               color:var(--atlas-l${n.layer});--nd-c:var(--atlas-l${n.layer})"
        aria-label="${esc(c.title)} — layer ${n.layer}, open its detail">
        ${c.icon}
        <span class="nd-head">
          <span class="nd-num">${n.layer}</span>
          <span class="nd-name">${esc(c.title)}</span>
        </span>
        ${c.lines.length ? `<span class="nd-sub">${c.lines.map(l =>
            `<span>${esc(l)}</span>`).join('')}</span>` : ''}
      </button>`;
    })();
  }


  function toolbar() {
    /* The swatch shows the dash pattern *and* the colour of the layer the flow
       stands for — energy is layer 1's amber, control layer 9's — so the legend
       reads in the same colours as the map. The dash is what tells two flows
       apart when they leave the same card. */
    const swatch = d => `<span class="fl-dash" style="background:${d
      ? `repeating-linear-gradient(90deg,var(--fl-c) 0 ${d.split(' ')[0]}px,transparent 0 ${
          (+d.split(' ')[0]) + (+d.split(' ')[1])}px)`
      : 'var(--fl-c)'}"></span>`;
    const fl = Object.entries(ATLAS_FLOWS).map(([k, f]) =>
      `<button type="button" class="fl-btn" data-filter="${k}" aria-pressed="false"
               style="--fl-c:var(--atlas-l${f.layer})">
         ${swatch(f.dash)}${esc(f.label)}</button>`).join('');
    return `<div class="atlas-top">
      <div class="atlas-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke-width="2"/>
          <path d="M16.5 16.5 21 21" stroke-width="2" stroke-linecap="round"/></svg>
        <input type="search" id="atlas-q" autocomplete="off" role="combobox"
               aria-expanded="false" aria-controls="atlas-results"
               placeholder="Search tickers or company names" aria-label="Search tickers or company names">
        <ul class="atlas-results" id="atlas-results" role="listbox"></ul>
      </div>
    </div>
    <div class="atlas-filters" role="group" aria-label="Filter by flow">
      <button type="button" class="fl-btn fl-all" data-filter="all" aria-pressed="true">All flows</button>
      ${fl}
    </div>`;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function modKey() { return /Mac|iP(hone|ad)/.test(navigator.platform) ? '⌘' : 'Ctrl'; }

  /* ══ interaction ═══════════════════════════════════════════════════════ */
  const nodeEls  = [...host.querySelectorAll('.nd')];
  const worldEl  = host.querySelector('.pw-node');
  const routeEls = [...host.querySelectorAll('.rt-g')];
  const allTargets = () => [...host.querySelectorAll('.nd')]
    .concat(worldEl ? [worldEl] : []);
  let selected = null, searchSelection = [], activeFilter = 'all';

  const touches = (r, id) => r.dataset.from === id || r.dataset.to === id ||
    (r.dataset.ends || '').split(' ').includes(id);
  const farEnd  = (r, id) => r.dataset.from === id ? r.dataset.to : r.dataset.from;
  const restorePaint = () => {
    if (searchSelection.length && !selected) paintSearch(searchSelection);
    else paint(selected);
  };

  /* What counts as "this box". An enclosure stands for everything inside it,
     so pointing at the machine lights every run in and out of its blocks —
     not only the two or three that name the frame itself. */
  function selfIds(id) {
    const out = new Set(id ? [id] : []);
    const node = id && N[id];
    if (node && node.encl)
      ATLAS_NODES.filter(n => n.region === node.region && n.id !== id)
                 .forEach(n => out.add(n.id));
    return out;
  }

  function lightFor(ids) {
    const self = new Set();
    (Array.isArray(ids) ? ids : [ids]).filter(Boolean)
      .forEach(id => selfIds(id).forEach(x => self.add(x)));
    const lit = new Set(), near = new Set(self);
    routeEls.forEach(r => {
      if (activeFilter !== 'all' && r.dataset.flow !== activeFilter) return;
      const end = [...self].find(s => touches(r, s));
      if (!end) return;
      lit.add(r);
      const far = farEnd(r, end);
      if (far && far[0] !== '#') { near.add(far); return; }
      /* The far end is a whole macro-system, not a card — the two runs out of
         the planet land on the dashed foundations group. Light what they
         actually feed, named in `ends`, or the planet's own click leaves that
         column a field of empty boxes. */
      (r.dataset.ends || '').split(' ').forEach(x => {
        if (x && x[0] !== '#' && x !== end && N[x]) near.add(x);
      });
    });
    return {lit, near};
  }

  function paint(id) {
    const ids = Array.isArray(id) ? id : (id ? [id] : []);
    const {lit, near} = ids.length ? lightFor(ids) : {lit:new Set(), near:new Set()};
    const filtering = activeFilter !== 'all' || ids.length > 0;
    host.classList.toggle('is-filtered', filtering);
    routeEls.forEach(r => {
      const byFilter = activeFilter !== 'all' && r.dataset.flow === activeFilter;
      r.querySelector('.rt').classList.toggle('is-lit', lit.has(r) || (!ids.length && byFilter));
    });
    allTargets().forEach(el => {
      const nid = el.dataset.node;
      const onFilter = activeFilter !== 'all' &&
        routeEls.some(r => r.dataset.flow === activeFilter && touches(r, nid));
      el.classList.toggle('is-lit', ids.length ? near.has(nid) : onFilter);
    });
    runDots();
  }

  function paintSearch(ids) {
    paint(ids);
    const set = new Set(ids);
    allTargets().forEach(el => el.classList.toggle('is-selected', set.has(el.dataset.node)));
  }

  function clearSearch() {
    if (!searchSelection.length) return;
    searchSelection = [];
    if (results) results.innerHTML = '';
    if (q) q.setAttribute('aria-expanded', 'false');
    allTargets().forEach(e => e.classList.remove('is-selected'));
    paint(null);
  }

  const hoverOff = restorePaint;
  allTargets().forEach(el => {
    el.addEventListener('mouseenter', () => paint(el.dataset.node));
    el.addEventListener('mouseleave', hoverOff);
    el.addEventListener('focus', () => paint(el.dataset.node));
    el.addEventListener('blur', hoverOff);
    el.addEventListener('click', e => { e.preventDefault(); searchSelection = []; select(el.dataset.node); });
    if (el === worldEl) el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select('world'); }
    });
  });

  /* ── filters ───────────────────────────────────────────────────────────── */
  host.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
    /* A pressed filter unpresses: clicking the flow you are already on puts
       the whole map back, so the chips work as switches rather than a
       one-way choice you have to undo through "All flows". */
    activeFilter = (activeFilter === b.dataset.filter) ? 'all' : b.dataset.filter;
    host.querySelectorAll('[data-filter]').forEach(o =>
      o.setAttribute('aria-pressed', String(o.dataset.filter === activeFilter)));
    restorePaint();
  }));

  /* ── the detail panel ──────────────────────────────────────────────────── */
  function select(id) {
    searchSelection = [];
    const el = allTargets().find(e => e.dataset.node === id);
    selected = id;
    allTargets().forEach(e => e.classList.toggle('is-selected', e === el));
    const d = id === 'world' ? AtlasData.worldDetail()
                            : AtlasData.detail(N[id].layer);
    if (!d) { hidePanel(); paint(id); return; }
    panel.innerHTML = panelHTML(d, N[id] || null);
    panel.hidden = false;
    /* A forced reflow, not requestAnimationFrame: rAF does not fire while the
       tab is hidden, and the panel would then never get its open state. */
    void panel.offsetWidth;
    panel.classList.add('is-open');
    panel.querySelector('.pn-close').addEventListener('click', () => closePanel(true));
    paint(id);
  }

  function hidePanel() {
    panel.classList.remove('is-open');
    setTimeout(() => { panel.hidden = true; panel.innerHTML = ''; }, 240);
  }

  function closePanel(restoreFocus) {
    const el = allTargets().find(e => e.dataset.node === selected);
    selected = null;
    allTargets().forEach(e => e.classList.remove('is-selected'));
    hidePanel();
    paint(null);
    if (restoreFocus && el) el.focus();
  }

  /* Three ways out, and they must all work: the close button, Escape, and a
     click anywhere that is not the panel or a card. The last one is measured
     against where the pointer went down, so dragging the map shut is not a
     thing that can happen by accident. */
  let downAt = null;
  host.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY, e.target]; });
  host.addEventListener('pointerup', e => {
    if ((!selected && !searchSelection.length) || !downAt) return;
    const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]);
    const onChrome = t => t instanceof Element &&
      t.closest('.nd, .pw-node, .atlas-panel, .atlas-top, .atlas-search, .atlas-filters, .atlas-controls');
    if (moved < 5 && !onChrome(downAt[2]) && !onChrome(e.target)) {
      if (selected) closePanel(false);
      else clearSearch();
    }
    downAt = null;
  });
  document.addEventListener('pointerdown', e => {
    if (selected && !host.contains(e.target)) closePanel(false);
    else if (searchSelection.length && !host.contains(e.target)) clearSearch();
  });

  function panelHTML(d, node) {
    const tone = node ? `var(--atlas-l${node.layer})` : 'var(--r-world)';
    const sec = (title, body, wide) => body
      ? `<section class="pn-sec${wide ? ' is-wide' : ''}"><h5>${esc(title)}</h5>${body}</section>` : '';
    const chips = a => a && a.length
      ? `<ul class="pn-chips">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
    const metric = d.metric ? `<div class="pn-metric"><b>${esc(d.metric.value)}</b>
        <span>${esc(d.metric.label)}</span>
        ${d.metric.asOf ? `<em>As of ${esc(d.metric.asOf)}${d.metric.source ? ' &middot; ' + esc(d.metric.source) : ''}</em>` : ''}
      </div>` : '';
    return `
      <header class="pn-head" style="color:${tone};--nd-c:${tone}">
        ${d.n ? `<span class="pn-num">${d.n}</span>` : `<span class="pn-globe">${d.icon || ''}</span>`}
        <span class="pn-id">
          <h4 id="atlas-panel-title">${esc(d.title)}</h4>
          ${d.moat ? `<p>${esc(d.moat)}</p>` : ''}
        </span>
        <button type="button" class="pn-close" aria-label="Close the layer detail">&times;</button>
      </header>
      <div class="pn-body">
        ${sec('Role', d.role ? `<p>${d.role}</p>` : '', true)}
        ${sec('Core metric', metric)}
        ${sec('Binding constraint', d.choke ? `<p>${d.choke}</p>` : '')}
        ${sec(d.n ? 'What to watch' : 'What it reaches', chips(d.watch))}
        ${sec('Key companies', chips(d.companies))}
        ${d.facts.length ? sec('Also measured',
          `<ul class="pn-chips">${d.facts.map(f =>
            `<li><b>${esc(f.value)}</b> &nbsp;${esc(f.label)}</li>`).join('')}</ul>`, true) : ''}
        ${d.n ? `<p class="pn-more"><a href="stack.html#layer-${d.n}">Open layer ${d.n} in full &rarr;</a></p>` : ''}
      </div>`;
  }

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (selected) { e.stopPropagation(); closePanel(true); }
    else if (searchSelection.length) { e.stopPropagation(); clearSearch(); }
  });

  /* ── search ────────────────────────────────────────────────────────────── */
  const index = AtlasData.searchIndex(ATLAS_NODES);
  const q = host.querySelector('#atlas-q'), results = host.querySelector('#atlas-results');
  q.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase();
    if (v.length < 2) { results.innerHTML = ''; q.setAttribute('aria-expanded', 'false'); return; }
    /* A ticker matches from the front — typing NV should find NVDA, not every
       company with an n and a v in its name. */
    const hits = index.filter(r => r.label.toLowerCase().includes(v) ||
                                   r.ticker.toLowerCase().startsWith(v)).slice(0, 8);
    results.innerHTML = hits.map(r =>
      `<li role="option"><button type="button" data-go="${esc(r.nodes.join(' '))}">${esc(r.label)}
        <small>${r.ticker ? '<b>' + esc(r.ticker) + '</b> &middot; ' : ''}${esc(r.hint)}</small>
        </button></li>`).join('');
    q.setAttribute('aria-expanded', String(hits.length > 0));
  });
  function applySearchResult(b, clear = true) {
    if (!b) return;
    searchSelection = b.dataset.go.split(/\s+/).filter(Boolean);
    selected = null; hidePanel();
    const el = allTargets().find(x => x.dataset.node === searchSelection[0]);
    if (el && el.scrollIntoView) el.scrollIntoView({block:'nearest', inline:'nearest'});
    paintSearch(searchSelection);
    if (clear) {
      results.innerHTML = ''; q.value = ''; q.setAttribute('aria-expanded', 'false');
    }
  }
  q.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const b = results.querySelector('[data-go]');
    if (!b) return;
    e.preventDefault();
    applySearchResult(b);
  });
  results.addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    e.stopPropagation();
    applySearchResult(b);
  });
  results.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    e.stopPropagation();
    e.preventDefault();
    applySearchResult(b, false);
  });
  document.addEventListener('click', e => {
    if (e.target.closest('.atlas-search')) return;
    results.innerHTML = '';
    if (searchSelection.length && !e.target.closest('.atlas')) clearSearch();
  });

  /* ── pan and zoom ──────────────────────────────────────────────────────── */
  let z = 1, tx = 0, ty = 0, drag = null;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  function apply(anim) {
    world.classList.toggle('is-dragging', !anim);
    world.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
  }
  function setZoom(next, cx, cy) {
    const r = stage.getBoundingClientRect();
    const px = cx == null ? r.width / 2 : cx, py = cy == null ? r.height / 2 : cy;
    const k = clamp(next, 1, 3);
    tx = px - (px - tx) * (k / z); ty = py - (py - ty) * (k / z); z = k;
    const maxX = 0, minX = r.width - r.width * z;
    const maxY = 0, minY = r.height - r.height * z;
    tx = clamp(tx, minX, maxX); ty = clamp(ty, minY, maxY);
    apply(true);
  }
  host.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.zoom;
    if (k === 'reset') { z = 1; tx = ty = 0; apply(true); }
    else setZoom(z * (k === 'in' ? 1.35 : 1 / 1.35));
  }));
  stage.addEventListener('wheel', e => {
    /* Only with a modifier, so an ordinary scroll always moves the page. */
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const r = stage.getBoundingClientRect();
    setZoom(z * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX - r.left, e.clientY - r.top);
  }, {passive:false});
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('.nd, .pw-node, .atlas-panel')) return;
    drag = {x:e.clientX - tx, y:e.clientY - ty};
    stage.classList.add('is-panning'); stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const r = stage.getBoundingClientRect();
    tx = clamp(e.clientX - drag.x, r.width - r.width * z, 0);
    ty = clamp(e.clientY - drag.y, r.height - r.height * z, 0);
    apply(false);
  });
  const endDrag = () => { drag = null; stage.classList.remove('is-panning'); };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  addEventListener('resize', () => apply(true));

  /* ── particles: one loop, only on lit routes, stopped when unseen ──────── */
  let raf = null, lengths = new WeakMap();
  function runDots() {
    /* At rest the core sequence keeps moving, so the map reads as something
       running rather than something drawn. Point at anything and the particles
       move to what is lit instead: never everything at once. */
    const anyLit = routeEls.some(r => r.querySelector('.rt').classList.contains('is-lit'));
    const lit = routeEls.filter(r => anyLit
      ? r.querySelector('.rt').classList.contains('is-lit')
      : r.dataset.core === '1');
    routeEls.forEach(r => r.querySelector('.rt-dot').classList.remove('is-on'));
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    if (!lit.length || reduced.matches || document.hidden) return;
    lit.forEach(r => r.querySelector('.rt-dot').classList.add('is-on'));
    const t0 = performance.now();
    (function step(t) {
      const phase = ((t - t0) / 2600) % 1;
      lit.forEach((r, i) => {
        const path = r.querySelector('.rt'), dot = r.querySelector('.rt-dot');
        let L = lengths.get(path);
        if (L == null) { L = path.getTotalLength(); lengths.set(path, L); }
        const p = path.getPointAtLength(((phase + i * 0.13) % 1) * L);
        dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
      });
      raf = requestAnimationFrame(step);
    })(t0);
  }
  document.addEventListener('visibilitychange', runDots);
  reduced.addEventListener('change', runDots);

  fitNodes();
  apply(true);
  paint(null);
})();

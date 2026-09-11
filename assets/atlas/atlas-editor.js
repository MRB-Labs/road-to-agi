/* Atlas visual editor. This file is loaded only by atlas-editor.html. */
(function () {
  const host = document.getElementById('atlas');
  if (!host || typeof ATLAS_NODES === 'undefined' || typeof AtlasGeom === 'undefined') return;

  const fields = document.querySelector('[data-ed-fields]');
  const status = document.querySelector('[data-ed-status]');
  const snapBox = document.querySelector('[data-ed-snap]');
  const saveBtn = document.querySelector('[data-ed-action="save"]');
  const gridBtn = document.querySelector('[data-ed-action="toggle-grid"]');
  const fitBtn = document.querySelector('[data-ed-action="reset-view"]');
  const stage = host.querySelector('#atlas-stage');
  const world = host.querySelector('#atlas-world');
  const canvas = host.querySelector('.atlas-canvas');
  const grid = document.createElement('div');
  const svgNS = 'http://www.w3.org/2000/svg';
  const STUB = 18;
  let selected = null;
  let drag = null;
  let serverReady = false;
  let textDirty = false;
  const dirtyRoutes = new Set();

  host.classList.add('is-editing');
  grid.className = 'atlas-editor-grid';
  world.appendChild(grid);

  setStatus('Drag an item, edit text, then press Save + GitHub.', 'ok');
  pingServer();

  function setStatus(text, tone) {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('is-ok', tone === 'ok');
    status.classList.toggle('is-bad', tone === 'bad');
  }

  function pxScale() {
    const wr = world.getBoundingClientRect();
    return wr.width / ATLAS_CANVAS.w || 1;
  }

  function snap(v) {
    if (!snapBox || !snapBox.checked) return Math.round(v);
    return Math.round(v / 8) * 8;
  }

  function nodeById(id) {
    return ATLAS_NODES.find(n => n.id === id);
  }

  function regionByKey(key) {
    return ATLAS_REGIONS.find(r => r.key === key);
  }

  function regionText(key) {
    return (typeof ATLAS_REGIONS_TEXT !== 'undefined' && ATLAS_REGIONS_TEXT[key])
      || {t:key, s:[]};
  }

  function cardText(id) {
    return (typeof ATLAS_CARDS !== 'undefined' && ATLAS_CARDS[id])
      || {t:id, s:[]};
  }

  function routeTextKey(r) {
    return `${r.from}>${r.to}`;
  }

  function select(type, data, el) {
    selected = Object.assign({type, el}, data);
    host.querySelectorAll('.ed-selected').forEach(x => x.classList.remove('ed-selected'));
    if (el) el.classList.add('ed-selected');
    renderFields();
  }

  function selectedData() {
    if (!selected) return null;
    if (selected.type === 'node') return nodeById(selected.id);
    if (selected.type === 'icon') return nodeById(selected.id);
    if (selected.type === 'region') return regionByKey(selected.key);
    if (selected.type === 'world') return ATLAS_WORLD;
    if (selected.type === 'route') return ATLAS_ROUTES[selected.routeIndex]?.via?.[selected.guideIndex];
    return null;
  }

  function renderFields() {
    if (!fields) return;
    const data = selectedData();
    if (!selected || !data) {
      fields.innerHTML = '<p class="ed-empty">Select something on the map.</p>';
      return;
    }
    fields.innerHTML = [
      `<p class="ed-empty"><b>${escapeHTML(selectedLabel())}</b> selected</p>`,
      geometryFields(data),
      textFields(),
    ].filter(Boolean).join('');
    bindGeometryFields();
    bindTextFields();
  }

  function selectedLabel() {
    if (!selected) return '';
    if (selected.type === 'node') return selected.id;
    if (selected.type === 'icon') return `${selected.id} icon`;
    if (selected.type === 'region') return selected.key;
    if (selected.type === 'route') {
      const r = ATLAS_ROUTES[selected.routeIndex];
      return `${r.from} -> ${r.to} bend ${selected.guideIndex + 1}`;
    }
    return 'Earth';
  }

  function geometryFields(data) {
    const props = selected.type === 'world' ? ['cx', 'cy', 'r']
      : selected.type === 'icon' ? ['ix', 'iy', 'iz']
      : selected.type === 'route' ? (data.x !== undefined ? ['x'] : ['y'])
      : ['x', 'y', 'w', 'h'];
    return props.map(p => fieldForProp(data, p)).join('');
  }

  function fieldForProp(data, p) {
    const labels = {
      x:'X', y:'Y', w:'Width', h:'Height', cx:'Center X', cy:'Center Y', r:'Radius',
      ix:'Move X', iy:'Move Y', iz:'Icon size'
    };
    const value = p === 'iz' ? Math.round(data[p] || 100) : Math.round(data[p] || 0);
    if (p === 'iz') {
      return `<div class="ed-field is-range">
        <label for="ed-${p}">${labels[p]}</label>
        <input id="ed-${p}" data-ed-prop="${p}" type="range" min="60" max="170" step="5" value="${value}">
        <output>${value}%</output>
      </div>`;
    }
    return `<div class="ed-field">
      <label for="ed-${p}">${labels[p] || p}</label>
      <input id="ed-${p}" data-ed-prop="${p}" type="number" step="1" value="${value}">
    </div>`;
  }

  function textFields() {
    if (selected.type === 'node' || selected.type === 'icon') {
      const c = cardText(selected.id);
      return `<div class="ed-text-fields">
        <label>Title <input data-ed-text="card-title" value="${attr(c.t || '')}"></label>
        <label>Line 1 <input data-ed-text="card-line-0" value="${attr((c.s || [])[0] || '')}"></label>
        <label>Line 2 <input data-ed-text="card-line-1" value="${attr((c.s || [])[1] || '')}"></label>
      </div>`;
    }
    if (selected.type === 'region') {
      const r = regionText(selected.key);
      return `<div class="ed-text-fields">
        <label>Title <input data-ed-text="region-title" value="${attr(r.t || '')}"></label>
        <label>Subtitle <input data-ed-text="region-sub-0" value="${attr((r.s || [])[0] || '')}"></label>
        <label>Subtitle 2 <input data-ed-text="region-sub-1" value="${attr((r.s || [])[1] || '')}"></label>
      </div>`;
    }
    if (selected.type === 'world') {
      const w = typeof ATLAS_WORLD_TEXT !== 'undefined' ? ATLAS_WORLD_TEXT : {t:'', s:''};
      return `<div class="ed-text-fields">
        <label>Title <input data-ed-text="world-title" value="${attr(w.t || '')}"></label>
        <label>Caption <input data-ed-text="world-sub" value="${attr(w.s || '')}"></label>
      </div>`;
    }
    if (selected.type === 'route') {
      const r = ATLAS_ROUTES[selected.routeIndex];
      const txt = (typeof ATLAS_ROUTE_TEXT !== 'undefined' && ATLAS_ROUTE_TEXT[routeTextKey(r)]) || '';
      return `<div class="ed-text-fields">
        <label>Route label <input data-ed-text="route-label" value="${attr(txt)}"></label>
      </div>`;
    }
    return '';
  }

  function bindGeometryFields() {
    fields.querySelectorAll('[data-ed-prop]').forEach(input => {
      input.addEventListener('input', () => {
        const data = selectedData();
        const value = Number(input.value);
        if (!data || !Number.isFinite(value)) return;
        data[input.dataset.edProp] = value;
        markDirty(selected);
        applySelected(false);
        const out = input.parentElement?.querySelector('output');
        if (out && input.dataset.edProp === 'iz') out.textContent = `${Math.round(value)}%`;
      });
    });
  }

  function bindTextFields() {
    fields.querySelectorAll('[data-ed-text]').forEach(input => {
      input.addEventListener('input', () => {
        updateText(input.dataset.edText, input.value);
        textDirty = true;
        markDirty(selected);
        applyText(selected);
        refreshRoutes();
        setStatus('Unsaved changes. Press Save layout when it looks right.', 'ok');
      });
    });
  }

  function updateText(kind, value) {
    if (kind.startsWith('card-')) {
      const c = cardText(selected.id);
      if (!ATLAS_CARDS[selected.id]) ATLAS_CARDS[selected.id] = c;
      if (kind === 'card-title') c.t = value;
      else {
        const i = Number(kind.split('-').pop());
        c.s = c.s || [];
        c.s[i] = value;
      }
    } else if (kind.startsWith('region-')) {
      const r = regionText(selected.key);
      if (!ATLAS_REGIONS_TEXT[selected.key]) ATLAS_REGIONS_TEXT[selected.key] = r;
      if (kind === 'region-title') r.t = value;
      else {
        const i = Number(kind.split('-').pop());
        r.s = r.s || [];
        r.s[i] = value;
      }
    } else if (kind === 'world-title') {
      ATLAS_WORLD_TEXT.t = value;
    } else if (kind === 'world-sub') {
      ATLAS_WORLD_TEXT.s = value;
    } else if (kind === 'route-label') {
      const r = ATLAS_ROUTES[selected.routeIndex];
      ATLAS_ROUTE_TEXT[routeTextKey(r)] = value;
    }
  }

  function markDirty(sel) {
    if (sel && sel.type === 'route') {
      dirtyRoutes.add(sel.routeIndex);
      ATLAS_ROUTES[sel.routeIndex]._editorVirtualVia = false;
    }
    if (sel && sel.el) sel.el.classList.add('ed-dirty');
  }

  function applySelected(updatePanel = true) {
    if (!selected) return;
    if (selected.type === 'node') applyNode(nodeById(selected.id));
    if (selected.type === 'icon') applyIcon(nodeById(selected.id));
    if (selected.type === 'region') applyRegion(regionByKey(selected.key));
    if (selected.type === 'world') applyWorld();
    if (selected.type === 'route') applyRouteHandle(selected.routeIndex, selected.guideIndex);
    refreshRoutes();
    if (updatePanel) renderFields();
  }

  function applyText(sel) {
    if (!sel) return;
    if (sel.type === 'node' || sel.type === 'icon') updateCardText(sel.id);
    if (sel.type === 'region') updateRegionText(sel.key);
    if (sel.type === 'world') updateWorldText();
  }

  function updateCardText(id) {
    const el = host.querySelector(`.nd[data-node="${cssEscape(id)}"]`);
    const c = cardText(id);
    if (!el) return;
    const name = el.querySelector('.nd-name');
    if (name) name.textContent = c.t || '';
    const sub = el.querySelector('.nd-sub');
    if (sub) {
      sub.innerHTML = (c.s || []).filter(Boolean).map(s => `<span>${escapeHTML(s)}</span>`).join('');
    }
    el.setAttribute('aria-label', `${c.t || id} -- layer ${el.dataset.layer}, open its detail`);
  }

  function updateRegionText(key) {
    const el = canvas.querySelector(`.rg[data-region="${cssEscape(key)}"]`);
    const r = regionText(key);
    if (!el) return;
    const title = el.querySelector('.rg-title');
    if (title) title.textContent = r.t || '';
    const subs = el.querySelectorAll('.rg-sub');
    (r.s || []).forEach((line, i) => {
      if (subs[i]) subs[i].textContent = line;
    });
  }

  function updateWorldText() {
    const el = canvas.querySelector('.pw-node');
    if (!el) return;
    const w = ATLAS_WORLD_TEXT;
    const label = el.querySelector('.pw-label');
    const sub = el.querySelector('.pw-sub');
    if (label) label.textContent = w.t || '';
    if (sub) sub.innerHTML = worldSubLines(w.s || '').map((line, i) =>
      `<tspan x="${ATLAS_WORLD.cx}" ${i ? 'dy="14"' : ''}>${escapeHTML(line)}</tspan>`).join('');
  }

  function worldSubLines(text) {
    const parts = String(text || '').split(',').map(s => s.trim()).filter(Boolean);
    return parts.length >= 4
      ? [`${parts[0]}, ${parts[1]},`, `${parts[2]}, ${parts.slice(3).join(', ')}`]
      : [text];
  }

  function applyNode(n) {
    if (!n) return;
    const el = host.querySelector(`.nd[data-node="${cssEscape(n.id)}"]`);
    if (!el) return;
    el.style.left = `${n.x}px`;
    el.style.top = `${n.y}px`;
    el.style.width = `${n.w}px`;
    el.style.height = `${n.h}px`;
    applyNodeResizeHandle(n);
  }

  function applyIcon(n) {
    if (!n) return;
    const el = host.querySelector(`.nd[data-node="${cssEscape(n.id)}"]`);
    if (!el) return;
    el.style.setProperty('--nd-ix', `${n.ix || 0}px`);
    el.style.setProperty('--nd-iy', `${n.iy || 0}px`);
    el.style.setProperty('--nd-is', `${(n.iz || 100) / 100}`);
  }

  function applyRegion(r) {
    if (!r) return;
    const el = canvas.querySelector(`.rg[data-region="${cssEscape(r.key)}"]`);
    if (!el) return;
    el.querySelectorAll('.rg-hit, .rg-box').forEach(rect => {
      rect.setAttribute('x', r.x);
      rect.setAttribute('y', r.y);
      rect.setAttribute('width', r.w);
      rect.setAttribute('height', r.h);
    });
    el.querySelector('.rg-title')?.setAttribute('x', r.x + 20);
    el.querySelector('.rg-title')?.setAttribute('y', r.y + 38);
    el.querySelectorAll('.rg-sub').forEach((sub, i) => {
      sub.setAttribute('x', r.x + 20);
      sub.setAttribute('y', r.y + 60 + i * 13);
    });
    applyRegionResizeHandle(r);
  }

  function applyWorld() {
    const el = canvas.querySelector('.pw-node');
    const w = ATLAS_WORLD;
    if (!el) return;
    el.querySelector('.pw-hit')?.setAttribute('r', w.r + 18);
    el.querySelector('.pw-halo')?.setAttribute('r', w.r + 26);
    el.querySelector('.pw-rim')?.setAttribute('r', w.r);
    ['pw-hit', 'pw-halo', 'pw-rim'].forEach(cls => {
      const c = el.querySelector(`.${cls}`);
      if (!c) return;
      c.setAttribute('cx', w.cx);
      c.setAttribute('cy', w.cy);
    });
    const label = el.querySelector('.pw-label');
    const sub = el.querySelector('.pw-sub');
    if (label) {
      label.setAttribute('x', w.cx);
      label.setAttribute('y', w.cy + w.r + 44);
    }
    if (sub) {
      sub.setAttribute('x', w.cx);
      sub.setAttribute('y', w.cy + w.r + 66);
      sub.querySelectorAll('tspan').forEach(t => t.setAttribute('x', w.cx));
    }
  }

  function routeTone(nodes, r) {
    if (r.tone) return r.tone;
    const a = nodes[r.from];
    if (!a || a.id === 'world') return 'world';
    return a.layer ? `l${a.layer}` : 'world';
  }

  function routeNodes() {
    const out = {};
    ATLAS_NODES.forEach(n => { out[n.id] = n; });
    out.world = {
      id:'world',
      layer:0,
      x:ATLAS_WORLD.cx - ATLAS_WORLD.r,
      y:ATLAS_WORLD.cy - ATLAS_WORLD.r,
      w:ATLAS_WORLD.r * 2,
      h:ATLAS_WORLD.r * 2
    };
    ATLAS_REGIONS.forEach(r => { out[`#${r.key}`] = Object.assign({id:`#${r.key}`}, r); });
    return out;
  }

  function refreshRoutes() {
    const nodes = routeNodes();
    const spread = AtlasGeom.fan(nodes, ATLAS_ROUTES);
    ATLAS_ROUTES.forEach((r, i) => {
      const a = nodes[r.from], b = nodes[r.to];
      if (!a || !b) return;
      const opts = Object.assign({}, r, spread[i], {i, tone:routeTone(nodes, r)});
      const d = AtlasGeom.route(a, b, opts);
      const group = routeGroup(r);
      if (!group) return;
      group.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
      const txt = typeof ATLAS_ROUTE_TEXT !== 'undefined' ? ATLAS_ROUTE_TEXT[routeTextKey(r)] : '';
      let label = group.querySelector('.rt-label');
      if (txt && !label) {
        label = document.createElementNS(svgNS, 'text');
        label.classList.add('rt-label');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', 'currentColor');
        group.insertBefore(label, group.querySelector('.rt'));
      }
      if (label) {
        if (!txt) { label.remove(); }
        else {
          const probe = document.createElementNS(svgNS, 'path');
          probe.setAttribute('d', d);
          const pt = probe.getPointAtLength(probe.getTotalLength() / 2);
          label.setAttribute('x', pt.x.toFixed(0));
          label.setAttribute('y', (pt.y - 9).toFixed(0));
          label.textContent = txt;
        }
      }
    });
    renderRouteHandles();
  }

  function routeGroup(r) {
    return host.querySelector(`.rt-g[data-from="${cssEscape(r.from)}"][data-to="${cssEscape(r.to)}"]`);
  }

  function routeGuidePoint(nodes, r, spread, guideIndex) {
    const a = nodes[r.from], b = nodes[r.to];
    if (!a || !b || !r.via || !r.via[guideIndex]) return null;
    const opts = Object.assign({}, r, spread, {i:0, tone:routeTone(nodes, r)});
    const side = opts.side || ['right', 'left'];
    const A = AtlasGeom.anchor(a, side[0], opts.dx);
    let cur = [A.p[0] + A.n[0] * STUB, A.p[1] + A.n[1] * STUB];
    for (let i = 0; i <= guideIndex; i++) {
      const g = r.via[i];
      cur = g.x !== undefined ? [g.x, cur[1]] : [cur[0], g.y];
    }
    return {x:cur[0], y:cur[1]};
  }

  function renderRouteHandles() {
    canvas.querySelectorAll('.ed-route-handle').forEach(el => el.remove());
    const nodes = routeNodes();
    const spread = AtlasGeom.fan(nodes, ATLAS_ROUTES);
    ATLAS_ROUTES.forEach((r, routeIndex) => {
      if (!r.via || !r.via.length) ensureRouteGuide(routeIndex, nodes, spread[routeIndex]);
      (r.via || []).forEach((guide, guideIndex) => {
        const p = routeGuidePoint(nodes, r, spread[routeIndex], guideIndex);
        if (p) addRouteHandle(routeIndex, guideIndex, p);
      });
    });
  }

  function ensureRouteGuide(routeIndex, nodes, spread) {
    const r = ATLAS_ROUTES[routeIndex], a = nodes[r.from], b = nodes[r.to];
    if (!a || !b) return;
    const opts = Object.assign({}, r, spread, {i:routeIndex, tone:routeTone(nodes, r)});
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', AtlasGeom.route(a, b, opts));
    const pt = path.getPointAtLength(path.getTotalLength() / 2);
    const side = r.side || ['right', 'left'];
    r.via = (side[0] === 'left' || side[0] === 'right') ? [{x:Math.round(pt.x)}] : [{y:Math.round(pt.y)}];
    r._editorVirtualVia = true;
  }

  function addRouteHandle(routeIndex, guideIndex, p) {
    const g = document.createElementNS(svgNS, 'g');
    g.classList.add('ed-route-handle');
    if (selected && selected.type === 'route' &&
        selected.routeIndex === routeIndex && selected.guideIndex === guideIndex) {
      g.classList.add('ed-selected');
    }
    g.setAttribute('transform', `translate(${p.x} ${p.y})`);
    g.dataset.routeIndex = String(routeIndex);
    g.dataset.guideIndex = String(guideIndex);
    g.innerHTML = '<circle r="9"/><path d="M-4 0H4M0 -4V4"/>';
    g.addEventListener('pointerdown', e => startRouteDrag(e, routeIndex, guideIndex, g), true);
    canvas.appendChild(g);
  }

  function addNodeResizeHandle(el) {
    if (el.querySelector(':scope > .ed-resize-handle')) return;
    const handle = document.createElement('span');
    handle.className = 'ed-resize-handle';
    handle.setAttribute('aria-hidden', 'true');
    el.appendChild(handle);
    handle.addEventListener('pointerdown', e =>
      startDrag(e, 'resize-node', {id:el.dataset.node}, el), true);
  }

  function applyNodeResizeHandle(n) {
    const el = host.querySelector(`.nd[data-node="${cssEscape(n.id)}"]`);
    const handle = el?.querySelector(':scope > .ed-resize-handle');
    if (!handle) return;
    handle.style.transform = 'none';
  }

  function addRegionResizeHandle(r) {
    const el = canvas.querySelector(`.rg[data-region="${cssEscape(r.key)}"]`);
    if (!el || el.querySelector(':scope > .ed-region-resize')) return;
    const handle = document.createElementNS(svgNS, 'rect');
    handle.classList.add('ed-region-resize');
    handle.setAttribute('width', 16);
    handle.setAttribute('height', 16);
    handle.setAttribute('rx', 4);
    handle.setAttribute('aria-hidden', 'true');
    handle.addEventListener('pointerdown', e =>
      startDrag(e, 'resize-region', {key:r.key}, el), true);
    el.appendChild(handle);
    applyRegionResizeHandle(r);
  }

  function applyRegionResizeHandle(r) {
    const el = canvas.querySelector(`.rg[data-region="${cssEscape(r.key)}"]`);
    const handle = el?.querySelector(':scope > .ed-region-resize');
    if (!handle) return;
    handle.setAttribute('x', r.x + r.w - 18);
    handle.setAttribute('y', r.y + r.h - 18);
  }

  function applyRouteHandle(routeIndex, guideIndex) {
    const nodes = routeNodes();
    const spread = AtlasGeom.fan(nodes, ATLAS_ROUTES);
    const p = routeGuidePoint(nodes, ATLAS_ROUTES[routeIndex], spread[routeIndex], guideIndex);
    const el = canvas.querySelector(`.ed-route-handle[data-route-index="${routeIndex}"][data-guide-index="${guideIndex}"]`);
    if (p && el) el.setAttribute('transform', `translate(${p.x} ${p.y})`);
  }

  function startDrag(e, type, data, el) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const selectType = type === 'resize-node' ? 'node'
      : type === 'resize-region' ? 'region'
      : type;
    select(selectType, data, el);
    const d = selectedData();
    if (!d) return;
    drag = {
      pointerId:e.pointerId,
      type,
      sx:e.clientX,
      sy:e.clientY,
      x:d.x || 0,
      y:d.y || 0,
      cx:d.cx || 0,
      cy:d.cy || 0,
      ix:d.ix || 0,
      iy:d.iy || 0,
      w:d.w || 0,
      h:d.h || 0,
      moved:false
    };
    el.setPointerCapture?.(e.pointerId);
  }

  function startRouteDrag(e, routeIndex, guideIndex, el) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    select('route', {routeIndex, guideIndex}, el);
    const d = selectedData();
    drag = {
      pointerId:e.pointerId,
      type:'route',
      sx:e.clientX,
      sy:e.clientY,
      x:d.x,
      y:d.y,
      moved:false
    };
    el.setPointerCapture?.(e.pointerId);
  }

  function moveDrag(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    e.preventDefault();
    const data = selectedData();
    if (!data) return;
    const k = pxScale();
    const dx = (e.clientX - drag.sx) / k;
    const dy = (e.clientY - drag.sy) / k;
    const before = JSON.stringify(data);
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 2) drag.moved = true;
    if (drag.type === 'route') {
      if (data.x !== undefined) data.x = snap(drag.x + dx);
      if (data.y !== undefined) data.y = snap(drag.y + dy);
    } else if (drag.type === 'world') {
      data.cx = snap(drag.cx + dx);
      data.cy = snap(drag.cy + dy);
    } else if (drag.type === 'icon') {
      data.ix = snap(drag.ix + dx);
      data.iy = snap(drag.iy + dy);
    } else if (drag.type === 'resize-node') {
      data.w = Math.max(72, snap(drag.w + dx));
      data.h = Math.max(44, snap(drag.h + dy));
    } else if (drag.type === 'resize-region') {
      data.w = Math.max(120, snap(drag.w + dx));
      data.h = Math.max(140, snap(drag.h + dy));
    } else {
      data.x = snap(drag.x + dx);
      data.y = snap(drag.y + dy);
    }
    if (JSON.stringify(data) === before) return;
    markDirty(selected);
    applySelected();
  }

  function endDrag(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const moved = drag.moved;
    drag = null;
    if (moved) setStatus('Unsaved changes. Press Save + GitHub when it looks right.', 'ok');
  }

  host.querySelectorAll('.nd[data-node]').forEach(el => {
    addNodeResizeHandle(el);
    el.addEventListener('pointerdown', e => {
      if (e.target.closest('.nd-icon, .ed-resize-handle')) return;
      startDrag(e, 'node', {id:el.dataset.node}, el);
    }, true);
  });
  host.querySelectorAll('.nd[data-node] .nd-icon').forEach(icon => {
    icon.style.pointerEvents = 'auto';
    const node = icon.closest('.nd');
    icon.addEventListener('pointerdown', e => startDrag(e, 'icon', {id:node.dataset.node}, node), true);
  });
  host.querySelectorAll('.rg[data-region]').forEach(el => {
    addRegionResizeHandle(regionByKey(el.dataset.region));
    el.addEventListener('pointerdown', e => {
      if (e.target.closest('.ed-region-resize')) return;
      startDrag(e, 'region', {key:el.dataset.region}, el);
    }, true);
  });
  const worldNode = host.querySelector('.pw-node');
  if (worldNode) {
    worldNode.addEventListener('pointerdown', e => startDrag(e, 'world', {}, worldNode), true);
  }
  host.addEventListener('click', e => {
    if (!e.target.closest('.nd, .rg, .pw-node, .ed-route-handle')) return;
    e.preventDefault();
    e.stopPropagation();
  }, true);
  addEventListener('pointermove', moveDrag, true);
  addEventListener('pointerup', endDrag, true);
  addEventListener('pointercancel', endDrag, true);

  document.addEventListener('keydown', e => {
    if (!selected || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    const keys = {ArrowLeft:[-1, 0], ArrowRight:[1, 0], ArrowUp:[0, -1], ArrowDown:[0, 1]};
    const d = keys[e.key];
    if (!d) return;
    e.preventDefault();
    const data = selectedData();
    const step = e.shiftKey ? 10 : 1;
    if (selected.type === 'route') {
      if (data.x !== undefined) data.x += d[0] * step;
      if (data.y !== undefined) data.y += d[1] * step;
    } else if (selected.type === 'world') {
      data.cx += d[0] * step;
      data.cy += d[1] * step;
    } else if (selected.type === 'icon') {
      data.ix = (data.ix || 0) + d[0] * step;
      data.iy = (data.iy || 0) + d[1] * step;
    } else {
      data.x += d[0] * step;
      data.y += d[1] * step;
    }
    markDirty(selected);
    applySelected();
    setStatus('Unsaved changes. Press Save + GitHub when it looks right.', 'ok');
  });

  gridBtn?.addEventListener('click', () => {
    const hidden = grid.classList.toggle('is-hidden');
    gridBtn.setAttribute('aria-pressed', String(!hidden));
  });

  fitBtn?.addEventListener('click', () => {
    host.querySelector('[data-zoom="reset"]')?.click();
  });

  saveBtn?.addEventListener('click', async () => {
    if (!serverReady) {
      setStatus('Save needs the editor server. Run python3 scripts/atlas-editor-server.py --port 8766, then open this page from http://127.0.0.1:8766/atlas-editor.html.', 'bad');
      return;
    }
    setStatus('Saving, committing, and pushing to GitHub...', 'ok');
    try {
      const res = await fetch('/__atlas_editor/save', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(Object.assign({
          nodes:ATLAS_NODES.map(stripNode),
          regions:ATLAS_REGIONS.map(stripRegion),
          routes:ATLAS_ROUTES.map(stripRoute),
          world:{cx:Math.round(ATLAS_WORLD.cx), cy:Math.round(ATLAS_WORLD.cy), r:Math.round(ATLAS_WORLD.r)}
        }, textDirty ? {text:stripText()} : {}))
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed');
      if (!data.git) {
        throw new Error('Files were saved, but this editor server is old and cannot commit. Stop it with Ctrl+C, start it again, then click Save + GitHub.');
      }
      dirtyRoutes.clear();
      textDirty = false;
      host.querySelectorAll('.ed-dirty').forEach(x => x.classList.remove('ed-dirty'));
      const git = data.git || {};
      const noun = data.changed === 1 ? 'change' : 'changes';
      if (git.committed && git.pushed) {
        setStatus(`Saved ${data.changed} ${noun}, committed ${git.commit}, and pushed to GitHub.`, 'ok');
      } else {
        setStatus(data.changed ? `Saved ${data.changed} ${noun}. ${git.message || 'No Git commit was needed.'}` : (git.message || 'No changes to save.'), 'ok');
      }
    } catch (err) {
      setStatus(err.message || String(err), 'bad');
    }
  });

  async function pingServer() {
    try {
      const res = await fetch('/__atlas_editor/ping', {cache:'no-store'});
      const data = res.ok ? await res.json() : {};
      serverReady = res.ok && Array.isArray(data.features) && data.features.includes('git-push');
      if (serverReady) setStatus('Editor server connected. Drag items, edit text, then Save + GitHub.', 'ok');
      else setStatus('Restart the editor server with python3 scripts/atlas-editor-server.py --port 8766 so Save + GitHub is enabled.', 'bad');
    } catch (err) {
      serverReady = false;
      setStatus('Open through scripts/atlas-editor-server.py to enable saving.', 'bad');
    }
  }

  function stripNode(n) {
    return {
      id:n.id,
      x:Math.round(n.x),
      y:Math.round(n.y),
      w:Math.round(n.w),
      h:Math.round(n.h),
      ix:Math.round(n.ix || 0),
      iy:Math.round(n.iy || 0),
      iz:Math.round(n.iz || 100)
    };
  }

  function stripRegion(r) {
    return {key:r.key, x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.w), h:Math.round(r.h)};
  }

  function stripRoute(r, index) {
    return {
      index,
      from:r.from,
      to:r.to,
      via:(r._editorVirtualVia && !dirtyRoutes.has(index))
        ? []
        : (r.via || []).map(g => g.x !== undefined ? {x:Math.round(g.x)} : {y:Math.round(g.y)})
    };
  }

  function stripText() {
    return {
      cards:Object.fromEntries(Object.entries(ATLAS_CARDS || {}).map(([id, c]) => [
        id, {t:c.t || '', s:(c.s || []).filter(Boolean)}
      ])),
      regions:Object.fromEntries(Object.entries(ATLAS_REGIONS_TEXT || {}).map(([key, r]) => [
        key, {t:r.t || '', s:(r.s || []).filter(Boolean)}
      ])),
      world:{t:ATLAS_WORLD_TEXT.t || '', s:ATLAS_WORLD_TEXT.s || ''},
      routes:Object.assign({}, ATLAS_ROUTE_TEXT || {})
    };
  }

  function cssEscape(v) {
    return window.CSS && CSS.escape ? CSS.escape(v) : String(v).replace(/"/g, '\\"');
  }

  function escapeHTML(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[ch]);
  }

  function attr(v) {
    return escapeHTML(v);
  }

  renderRouteHandles();
})();

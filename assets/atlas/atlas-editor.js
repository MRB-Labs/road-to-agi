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
  const changed = {nodes:new Set(), regions:new Set(), routes:new Set(), world:false};
  let selected = null;
  let drag = null;
  let serverReady = false;
  const STUB = 18;

  host.classList.add('is-editing');
  grid.className = 'atlas-editor-grid';
  world.appendChild(grid);

  setStatus('Drag an item, then press Save layout.', 'ok');
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

  function select(type, id, el) {
    selected = {type, id, el};
    host.querySelectorAll('.ed-selected').forEach(x => x.classList.remove('ed-selected'));
    if (el) el.classList.add('ed-selected');
    renderFields();
  }

  function selectedData() {
    if (!selected) return null;
    if (selected.type === 'node') return nodeById(selected.id);
    if (selected.type === 'region') return regionByKey(selected.id);
    if (selected.type === 'route') return ATLAS_ROUTES[selected.routeIndex]?.via?.[selected.guideIndex];
    return ATLAS_WORLD;
  }

  function renderFields() {
    if (!fields) return;
    const data = selectedData();
    if (!selected || !data) {
      fields.innerHTML = '<p class="ed-empty">Select something on the map.</p>';
      return;
    }
    const label = selectedLabel();
    const props = selected.type === 'world' ? ['cx', 'cy', 'r']
      : selected.type === 'route' ? (data.x !== undefined ? ['x'] : ['y'])
      : ['x', 'y', 'w', 'h'];
    fields.innerHTML = `<p class="ed-empty"><b>${escapeHTML(label)}</b> selected</p>` +
      props.map(p => `<div class="ed-field">
        <label for="ed-${p}">${p}</label>
        <input id="ed-${p}" data-ed-prop="${p}" type="number" step="1" value="${Math.round(data[p])}">
      </div>`).join('');
    fields.querySelectorAll('[data-ed-prop]').forEach(input => {
      input.addEventListener('input', () => {
        const value = Number(input.value);
        if (!Number.isFinite(value)) return;
        data[input.dataset.edProp] = value;
        markDirty(selected);
        applySelected(false);
      });
    });
  }

  function selectedLabel() {
    if (!selected) return '';
    if (selected.type === 'node') return selected.id;
    if (selected.type === 'region') return selected.id;
    if (selected.type === 'route') {
      const r = ATLAS_ROUTES[selected.routeIndex];
      return `${r.from} -> ${r.to} bend ${selected.guideIndex + 1}`;
    }
    return 'Earth';
  }

  function markDirty(sel) {
    if (!sel) return;
    if (sel.type === 'node') changed.nodes.add(sel.id);
    if (sel.type === 'region') changed.regions.add(sel.id);
    if (sel.type === 'route') changed.routes.add(String(sel.routeIndex));
    if (sel.type === 'world') changed.world = true;
    if (sel.el) sel.el.classList.add('ed-dirty');
  }

  function applySelected(updatePanel = true) {
    if (!selected) return;
    if (selected.type === 'node') applyNode(nodeById(selected.id));
    if (selected.type === 'region') applyRegion(regionByKey(selected.id));
    if (selected.type === 'world') applyWorld();
    if (selected.type === 'route') applyRouteHandle(selected.routeIndex, selected.guideIndex);
    refreshRoutes();
    if (updatePanel) renderFields();
  }

  function applyNode(n) {
    if (!n) return;
    const el = host.querySelector(`.nd[data-node="${cssEscape(n.id)}"]`);
    if (!el) return;
    el.style.left = `${n.x}px`;
    el.style.top = `${n.y}px`;
    el.style.width = `${n.w}px`;
    el.style.height = `${n.h}px`;
  }

  function applyRegion(r) {
    if (!r) return;
    const el = canvas.querySelector(`.rg[data-region="${cssEscape(r.key)}"]`);
    if (!el) return;
    el.querySelectorAll('rect').forEach(rect => {
      rect.setAttribute('x', r.x);
      rect.setAttribute('y', r.y);
      rect.setAttribute('width', r.w);
      rect.setAttribute('height', r.h);
    });
    const title = el.querySelector('.rg-title');
    if (title) {
      title.setAttribute('x', r.x + 20);
      title.setAttribute('y', r.y + 38);
    }
    el.querySelectorAll('.rg-sub').forEach((sub, i) => {
      sub.setAttribute('x', r.x + 20);
      sub.setAttribute('y', r.y + 60 + i * 13);
    });
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
      const group = host.querySelector(`.rt-g[data-from="${cssEscape(r.from)}"][data-to="${cssEscape(r.to)}"]`);
      if (!group) return;
      group.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
      const label = group.querySelector('.rt-label');
      if (label) {
        const probe = document.createElementNS(svgNS, 'path');
        probe.setAttribute('d', d);
        const pt = probe.getPointAtLength(probe.getTotalLength() / 2);
        label.setAttribute('x', pt.x.toFixed(0));
        label.setAttribute('y', (pt.y - 9).toFixed(0));
      }
    });
    renderRouteHandles();
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
      (r.via || []).forEach((guide, guideIndex) => {
        const p = routeGuidePoint(nodes, r, spread[routeIndex], guideIndex);
        if (!p) return;
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
      });
    });
  }

  function applyRouteHandle(routeIndex, guideIndex) {
    const nodes = routeNodes();
    const spread = AtlasGeom.fan(nodes, ATLAS_ROUTES);
    const p = routeGuidePoint(nodes, ATLAS_ROUTES[routeIndex], spread[routeIndex], guideIndex);
    const el = canvas.querySelector(`.ed-route-handle[data-route-index="${routeIndex}"][data-guide-index="${guideIndex}"]`);
    if (p && el) el.setAttribute('transform', `translate(${p.x} ${p.y})`);
  }

  function startDrag(e, type, id, el) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    select(type, id, el);
    const data = selectedData();
    if (!data) return;
    drag = {
      pointerId:e.pointerId,
      type,
      id,
      sx:e.clientX,
      sy:e.clientY,
      x:data.x,
      y:data.y,
      cx:data.cx,
      cy:data.cy,
      moved:false
    };
    el.setPointerCapture?.(e.pointerId);
  }

  function startRouteDrag(e, routeIndex, guideIndex, el) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    selected = {type:'route', routeIndex, guideIndex, el};
    host.querySelectorAll('.ed-selected').forEach(x => x.classList.remove('ed-selected'));
    el.classList.add('ed-selected');
    renderFields();
    const data = selectedData();
    drag = {
      pointerId:e.pointerId,
      type:'route',
      routeIndex,
      guideIndex,
      sx:e.clientX,
      sy:e.clientY,
      x:data.x,
      y:data.y,
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
    if (moved) setStatus('Unsaved changes. Press Save layout when it looks right.', 'ok');
  }

  host.querySelectorAll('.nd[data-node]').forEach(el => {
    el.addEventListener('pointerdown', e => startDrag(e, 'node', el.dataset.node, el), true);
  });
  host.querySelectorAll('.rg[data-region]').forEach(el => {
    el.addEventListener('pointerdown', e => startDrag(e, 'region', el.dataset.region, el), true);
  });
  const worldNode = host.querySelector('.pw-node');
  if (worldNode) {
    worldNode.addEventListener('pointerdown', e => startDrag(e, 'world', 'world', worldNode), true);
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
    } else {
      data.x += d[0] * step;
      data.y += d[1] * step;
    }
    markDirty(selected);
    applySelected();
    setStatus('Unsaved changes. Press Save layout when it looks right.', 'ok');
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
      setStatus('Save needs the editor server. Run python3 scripts/atlas-editor-server.py --port 8766.', 'bad');
      return;
    }
    setStatus('Saving layout...', 'ok');
    try {
      const res = await fetch('/__atlas_editor/save', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          nodes:ATLAS_NODES.map(stripNode),
          regions:ATLAS_REGIONS.map(stripRegion),
          routes:ATLAS_ROUTES.map(stripRoute),
          world:{cx:Math.round(ATLAS_WORLD.cx), cy:Math.round(ATLAS_WORLD.cy), r:Math.round(ATLAS_WORLD.r)}
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed');
      changed.nodes.clear();
      changed.regions.clear();
      changed.routes.clear();
      changed.world = false;
      host.querySelectorAll('.ed-dirty').forEach(x => x.classList.remove('ed-dirty'));
      setStatus(`Saved ${data.changed} value${data.changed === 1 ? '' : 's'} to assets/atlas/atlas-layout.js.`, 'ok');
    } catch (err) {
      setStatus(err.message || String(err), 'bad');
    }
  });

  async function pingServer() {
    try {
      const res = await fetch('/__atlas_editor/ping', {cache:'no-store'});
      serverReady = res.ok;
      if (serverReady) setStatus('Editor server connected. Drag items and save when ready.', 'ok');
      else setStatus('Open through scripts/atlas-editor-server.py to enable saving.', 'bad');
    } catch (err) {
      serverReady = false;
      setStatus('Open through scripts/atlas-editor-server.py to enable saving.', 'bad');
    }
  }

  function stripNode(n) {
    return {id:n.id, x:Math.round(n.x), y:Math.round(n.y), w:Math.round(n.w), h:Math.round(n.h)};
  }

  function stripRegion(r) {
    return {key:r.key, x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.w), h:Math.round(r.h)};
  }

  function stripRoute(r, index) {
    return {
      index,
      from:r.from,
      to:r.to,
      via:(r.via || []).map(g => g.x !== undefined ? {x:Math.round(g.x)} : {y:Math.round(g.y)})
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

  renderRouteHandles();
})();

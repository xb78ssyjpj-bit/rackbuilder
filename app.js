import {
  renderDevice, renderPanel, renderHalfPanel, el,
  CONNECTOR_TYPES, CONNECTOR_GROUPS, PATCH_GROUPS, typeLabel,
  patchRU, patchCols, patchRows, patchFit, shortCode, renderEarsOnly,
  hasRear, renderNoRear, cardsFor, cardById,
  U, FACE_L, FACE_R, HALF_W, HALF_L, HALF_R, HALF_EAR_W, HALF_INSET,
} from './panel.js';
import { SEED_DEVICES } from './devices.js';
import { CATEGORIES } from './devices/_lib.js';
import { createFlow, FAMILIES } from './flow.js';
import { VERSION } from './version.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const STORE = 'rackbuilder.v1';
const GROUP_COLORS = ['none', '#35b39a', '#5b9bd5', '#e0a34a', '#d16b8a', '#8f7fd1', '#7cc45e'];

const uid = () => 'i' + Math.random().toString(36).slice(2, 9);

// ---------------------------------------------------------------- state ----
let state;

const blankRack = (n = 1) => ({
  id: uid(), name: `RACK ${n}`, ru: 12, items: [],
});

function blankProject() {
  return { name: 'New Tour', racks: [blankRack()], custom: [] };
}

function load() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupt store — fall through to a fresh project */ }
  return blankProject();
}

function save() {
  try { localStorage.setItem(STORE, JSON.stringify(state.project)); } catch { /* quota */ }
}

state = { project: load(), rack: 0, view: 'front', sel: null,
          libCat: 'all', libQ: '', zoom: 1, sideZoom: 1 };
if (!state.project.custom) state.project.custom = [];

// A library device can be corrected without touching devices.js. The fix is
// stored against the device's id and applied on the way out, so it reaches
// everything already using that device — a rack item keeps its uid and simply
// starts drawing the corrected panel. It lives in the project file, so it
// travels with a saved .json but does NOT reach the shared library; Copy JSON
// into devices.js is what makes a correction everybody's.
const edits = () => (state.project.edits ||= {});
const library = () => [
  ...SEED_DEVICES.map((d) => edits()[d.id] || d),
  ...state.project.custom,
];
const devById = (id) => library().find((d) => d.id === id);
const isSeed = (id) => SEED_DEVICES.some((d) => d.id === id);
const isEdited = (id) => !!edits()[id];
const rack = () => state.project.racks[state.rack];

// A patch-panel item can override the device's U height, so every occupancy,
// layout and summary calculation must go through this rather than dev.ru.
function itemRU(it) {
  const d = devById(it.devId);
  if (!d) return 1;
  return d.patch ? patchRU(d, it) : d.ru;
}
const itemWeight = (it) => {
  const d = devById(it.devId);
  if (!d) return 0;
  return d.patch ? (d.weight / (d.ru || 1)) * itemRU(it) : (d.weight || 0);
};

// Bands are stored as "GB: 606 - 678 MHz"; the part before the colon is the
// band name on its own, for places too narrow to carry the range as well.
const bandName = (b) => String(b).split(':')[0].trim();

// ------------------------------------------------------------- library ----
// Which brand groups are expanded. Kept out of the project file — it is a view
// preference, not part of the drawing, and should not travel in a saved .json.
const LIB_OPEN = 'rackbuilder.libopen';
let libOpen = new Set();
try { libOpen = new Set(JSON.parse(localStorage.getItem(LIB_OPEN) || '[]')); } catch { /* ignore */ }
const saveLibOpen = () => {
  try { localStorage.setItem(LIB_OPEN, JSON.stringify([...libOpen])); } catch { /* quota */ }
};

function renderLib() {
  const list = $('#libList');
  const q = state.libQ.toLowerCase().trim();
  const all = library();
  const items = all.filter((d) => {
    if (state.libCat !== 'all' && d.category !== state.libCat) return false;
    if (!q) return true;
    // Search the category label too, so "power" finds the power gear whichever
    // brand it happens to sit under.
    const cat = CATEGORIES[d.category] || d.category;
    return `${d.brand} ${d.model} ${cat}`.toLowerCase().includes(q);
  });

  const byBrand = {};
  items.forEach((d) => (byBrand[d.brand] ||= []).push(d));
  const brands = Object.keys(byBrand).sort((a, b) => a.localeCompare(b));

  list.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'libempty';
    empty.textContent = q ? `Nothing matches “${state.libQ.trim()}”.`
                          : 'No devices in this category yet.';
    list.appendChild(empty);
  }

  // A search cuts straight through the collapse — you should never have to open
  // a group to find what you just typed.
  const searching = !!q;

  brands.forEach((b) => {
    const open = searching || libOpen.has(b);

    const h = document.createElement('button');
    h.type = 'button';
    h.className = 'libgroup' + (open ? ' open' : '');
    h.setAttribute('aria-expanded', String(open));
    h.innerHTML = `<span class="tw" aria-hidden="true"></span>`
      + `<span class="gn">${esc(b)}</span>`
      + `<span class="gc">${byBrand[b].length}</span>`;
    if (!searching) {
      h.onclick = () => {
        if (libOpen.has(b)) libOpen.delete(b); else libOpen.add(b);
        saveLibOpen(); renderLib();
      };
    }
    list.appendChild(h);
    if (!open) return;

    byBrand[b].forEach((d) => {
      const row = document.createElement('div');
      row.className = 'libitem';
      row.dataset.dev = d.id;
      // The category tag only earns its space while the category filter is off;
      // once you have filtered, every row would say the same thing.
      const cat = state.libCat === 'all'
        ? `<span class="cat">${esc(CATEGORIES[d.category] || d.category)}</span>` : '';
      row.innerHTML = `<span class="b">${esc(d.model)}</span>${cat}`
        + (isEdited(d.id) ? '<span class="edited" title="Corrected in this project">•</span>' : '')
        + `<span class="ru">${d.ru}U</span>`;

      const ed = document.createElement('button');
      ed.className = 'edit'; ed.textContent = '✎';
      ed.title = isSeed(d.id) ? 'Correct this device' : 'Edit this device';
      ed.onclick = (ev) => { ev.stopPropagation(); openDraft(d); };
      row.appendChild(ed);

      if (state.project.custom.some((c) => c.id === d.id)) {
        const del = document.createElement('button');
        del.className = 'del'; del.textContent = '×';
        del.title = 'Remove from library';
        del.onclick = (ev) => {
          ev.stopPropagation();
          state.project.custom = state.project.custom.filter((c) => c.id !== d.id);
          save(); renderLib();
        };
        row.appendChild(del);
      }
      list.appendChild(row);
    });
  });

  const shut = brands.filter((b) => !libOpen.has(b)).length;
  $('#libCount').innerHTML =
    `<span>${items.length} of ${all.length}</span>`
    + (brands.length && !searching
      ? `<button type="button" id="libToggleAll">${shut ? 'Expand all' : 'Collapse all'}</button>`
      : '');
  const t = $('#libToggleAll');
  if (t) {
    t.onclick = () => {
      if (shut) brands.forEach((b) => libOpen.add(b)); else libOpen.clear();
      saveLibOpen(); renderLib();
    };
  }
}

function renderCats() {
  const wrap = $('#libCats');
  wrap.innerHTML = '';
  const mk = (key, label) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = state.libCat === key ? 'on' : '';
    b.onclick = () => { state.libCat = key; renderCats(); renderLib(); };
    wrap.appendChild(b);
  };
  mk('all', 'All');
  Object.entries(CATEGORIES).forEach(([k, v]) => mk(k, v));
}

// Some embedded browsers suppress window.alert/confirm — confirm() returns false
// instantly and nothing is shown, which silently killed every destructive
// action. Nothing here depends on native dialogs any more.
let toastTimer;
function toast(msg, bad) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast show' + (bad ? ' bad' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
}

// Click once to arm, again within 4 s to commit.
function armed(btn, armLabel, run) {
  const original = btn.dataset.label || btn.textContent;
  btn.dataset.label = original;
  let live = false, timer;
  const reset = () => {
    live = false; clearTimeout(timer);
    btn.textContent = original; btn.classList.remove('arm');
  };
  btn.onclick = (e) => {
    e.stopPropagation();
    if (!live) {
      live = true;
      btn.textContent = armLabel;
      btn.classList.add('arm');
      timer = setTimeout(reset, 4000);
      return;
    }
    reset();
    run();
  };
  return reset;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------------- racks ----
function renderTabs() {
  const t = $('#rackTabs');
  t.innerHTML = '';
  state.project.racks.forEach((r, i) => {
    const b = document.createElement('button');
    b.textContent = r.name;
    b.className = i === state.rack ? 'on' : '';
    b.onclick = () => { state.rack = i; state.sel = null; renderAll(); };
    t.appendChild(b);
  });
}

function renderRack() {
  const wrap = $('#rackWrap');
  const r = rack();
  wrap.innerHTML = '';

  const ruler = document.createElement('div');
  ruler.className = 'ruler';
  for (let u = 1; u <= r.ru; u++) {
    const d = document.createElement('div');
    d.textContent = u;
    ruler.appendChild(d);
  }

  const bay = document.createElement('div');
  bay.className = 'bay' + (state.view === 'rear' ? ' rear' : '');
  const slots = document.createElement('div');
  slots.className = 'slots';
  slots.id = 'slots';
  bay.appendChild(slots);

  // empty-slot grid (drop targets)
  for (let u = 1; u <= r.ru; u++) {
    const s = document.createElement('div');
    s.className = 'uslot';
    s.dataset.u = u;
    s.style.top = `calc(var(--u) * ${u - 1})`;
    slots.appendChild(s);
  }

  // What is visible from this side, ordered back-to-front so nearer gear draws
  // over the far face. Shelves first within each group.
  const visible = visibleFrom(r.items, state.view);
  const shelfFirst = (list) => [...list].sort((a, b) =>
    isShelfDev(devById(a.devId)) === isShelfDev(devById(b.devId))
      ? 0 : (isShelfDev(devById(a.devId)) ? -1 : 1));
  const facingHere = (it) => itemPlane(it) === state.view;
  [...shelfFirst(visible.filter((x) => !facingHere(x))),
   ...shelfFirst(visible.filter(facingHere))]
    .forEach((it) => {
    const dev = devById(it.devId);
    if (!dev) return;
    const node = document.createElement('div');
    const carrying = isShelfDev(dev) && shelfIsCarrying(it);
    const ears = earSide(it, dev, state.view);
    node.className = 'item' + (state.sel === it.uid ? ' sel' : '')
      + (dev.half ? ` half ${it.side === 'right' ? 'right' : 'left'}` : '')
      + (ears ? ' eared' : '')
      + (needsShelf(it) ? ' noshelf' : '')
      + (carrying ? ' earsonly' : '');
    node.dataset.uid = it.uid;
    node.style.top = `calc(var(--u) * ${it.u - 1})`;
    node.style.height = `calc(var(--u) * ${itemRU(it)})`;
    if (needsShelf(it)) node.title = 'No shelf underneath';
    // A device mounted on this face shows its front panel; one mounted on the
    // far face shows us its back.
    const facing = itemPlane(it) === state.view;
    const showRear = !facing;
    node.classList.toggle('backof', showRear);
    const bg = bayBg();
    node.appendChild(carrying
      ? renderEarsOnly(itemRU(it), { bg })
      : (showRear && !dev.patch && !hasRear(dev)
        ? renderNoRear(dev, itemRU(it),
            { bg, ears, quiet: partlyCovered(it, state.view, r.items) })
        : renderDevice(dev, showRear ? 'rear' : 'front', it,
                       { bg, ears, hatch: showRear && !dev.patch })));

    if (it.color && it.color !== 'none') {
      const g = document.createElement('div');
      g.className = 'grp';
      g.style.background = it.color;
      node.appendChild(g);
    }
    slots.appendChild(node);
  });

  // Labels live in their own column beside the rack rather than on top of the
  // panels — anywhere inside the face eventually collides with a connector.
  const labels = document.createElement('div');
  labels.className = 'labelcol';
  labelSet(r.items, state.view).forEach((it) => {
    const dev = devById(it.devId);
    if (!dev) return;
    const facing = itemPlane(it) === state.view;
    const hasHidden = r.items.some((o) => o !== it
      && itemPlane(o) !== itemPlane(it) && slotsOverlap(o, it));
    if (!it.label && !it.band && facing && !hasHidden) return;
    const l = document.createElement('div');
    // Two half-width units share a U, so their labels share the row: left on
    // the top half, right on the bottom half.
    const half = !!dev.half;
    const side = it.side === 'right' ? 'right' : 'left';
    l.className = 'lbl' + (half ? ` half ${side}` : '');
    const ru = itemRU(it);
    l.style.top = half
      ? `calc(var(--u) * ${it.u - 1} + var(--u) * ${ru} * ${side === 'right' ? 0.5 : 0})`
      : `calc(var(--u) * ${it.u - 1})`;
    l.style.height = `calc(var(--u) * ${half ? ru / 2 : ru})`;
    if (it.color && it.color !== 'none') l.style.borderLeftColor = it.color;

    const l1 = document.createElement('span');
    l1.className = 'l1';
    l1.textContent = it.label || dev.model;
    l.appendChild(l1);

    // RF band is a property of the individual unit, not the model — two of the
    // same receiver in one rack are routinely on different bands.
    if (it.band) {
      const lb = document.createElement('span');
      lb.className = 'lband';
      // The band name alone on screen — the range is what makes it too long for
      // the column, and the tooltip and the export sheet both carry it in full.
      lb.textContent = bandName(it.band);
      l.appendChild(lb);
    }

    // Anything occluded by this device still needs to be on the drawing —
    // you can't see it from here, but it is in the rack.
    const behind = r.items.filter((o) => o !== it
      && itemPlane(o) !== itemPlane(it) && slotsOverlap(o, it));

    // Looking at the back of something tells you very little — name it.
    const facingHere2 = itemPlane(it) === state.view;
    if (!facingHere2) {
      const l2 = document.createElement('span');
      const undocumented = !dev.patch && !hasRear(dev);
      l2.className = 'l2' + (undocumented ? ' norear' : '');
      // l1 already shows the label, or the model when there is no label.
      // Half-width rows are half height and sit side by side, so their second
      // line has to stay very short.
      if (dev.half) {
        l2.textContent = undocumented ? 'no rear' : 'rear';
      } else {
        l2.textContent = it.label
          ? (undocumented ? `${dev.model} · no rear panel` : `rear of ${dev.model}`)
          : (undocumented ? 'no rear panel' : 'rear');
      }
      l.appendChild(l2);
    }
    if (behind.length) {
      const l3 = document.createElement('span');
      l3.className = 'l3';
      const names = behind.map((o) => devById(o.devId).model).join(', ');
      l3.textContent = (dev.half ? '↳ ' : 'behind: ') + names;
      l.appendChild(l3);
    }

    l.title = `${dev.brand} ${dev.model}`
      + (it.band ? `\nband ${it.band}` : '')
      + (behind.length ? `\nbehind: ${behind.map((o) =>
          devById(o.devId).model).join(', ')}` : '');
    labels.appendChild(l);
  });

  wrap.appendChild(ruler);
  wrap.appendChild(bay);
  wrap.appendChild(labels);
  sizeU();
}

// A panel is 1000 wide x 100 per U, so 1U renders at (face width / 10).
// Default is fit-to-window; `state.zoom` scales away from that.
const BAY_PAD = 24;      // .bay horizontal padding, must match styles.css
const BAY_MAX = 820;     // widest the bay is drawn at zoom 1

function sizeU() {
  const slots = $('#slots');
  if (!slots) return;
  const bay = slots.closest('.bay');
  const canvas = $('#canvas');
  // Measuring a hidden canvas yields zero and would bake a nonsense --u; the
  // flow view hides it, and applyView() re-sizes on the way back.
  if (canvas.hidden) return;
  const wrap = $('#rackWrap');
  const ru = rack().ru;

  // Measure the real gutters rather than assuming — the ruler and the label
  // column both sit outside the bay and must not be counted as bay width.
  const cs = getComputedStyle(canvas);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const gutters = (wrap.querySelector('.ruler')?.offsetWidth || 30)
                + (wrap.querySelector('.labelcol')?.offsetWidth || 0)
                + 24;                                   // the two flex gaps

  const availW = Math.max(160, canvas.clientWidth - padX - gutters);
  const availH = Math.max(120, canvas.clientHeight - padY);

  // fit: the largest bay that fits both dimensions, then apply the zoom factor
  let w = Math.min(BAY_MAX, availW);
  if ((w - BAY_PAD) / 10 * ru > availH) w = (availH / ru) * 10 + BAY_PAD;
  w = Math.max(240, w) * state.zoom;

  bay.style.width = w + 'px';
  const px = (w - BAY_PAD) / 10;
  document.documentElement.style.setProperty('--u', px + 'px');
  slots.style.height = (px * ru) + 'px';

  $('#zFit').textContent = Math.abs(state.zoom - 1) < 0.01
    ? 'Fit' : Math.round(state.zoom * 100) + '%';
}
addEventListener('resize', sizeU);

const setZoom = (z) => { state.zoom = Math.min(4, Math.max(0.25, z)); sizeU(); };

// The side view scales through its own viewBox, so it needs a zoom of its own
// rather than the --u machinery the bays use. Same three buttons, different
// target depending on which view is up.
const setSideZoom = (z) => {
  state.sideZoom = Math.min(5, Math.max(0.4, z));
  applySideZoom();
};
function applySideZoom() {
  const svg = $('.sidesvg');
  if (svg) svg.style.width = (state.sideZoom * 100) + '%';
  $('#zFit').textContent = Math.abs(state.sideZoom - 1) < 0.01
    ? 'Fit' : Math.round(state.sideZoom * 100) + '%';
}
const inSide = () => state.view === 'side';

// Trackpad pinch arrives as a wheel event with ctrlKey set; ctrl/cmd+scroll is
// the mouse equivalent. Plain scrolling is left alone so the canvas still pans.
$('#canvas').addEventListener('wheel', (e) => {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  // A trackpad pinch sends many small deltas; a mouse wheel sends one huge one.
  // Clamping keeps a single notch from jumping several hundred percent.
  const d = Math.max(-40, Math.min(40, e.deltaY));
  setZoom(state.zoom * Math.exp(-d * 0.006));
}, { passive: false });
$('#zIn').onclick = () =>
  (inSide() ? setSideZoom(state.sideZoom * 1.25) : setZoom(state.zoom * 1.25));
$('#zOut').onclick = () =>
  (inSide() ? setSideZoom(state.sideZoom / 1.25) : setZoom(state.zoom / 1.25));
$('#zFit').onclick = () => (inSide() ? setSideZoom(1) : setZoom(1));

// A new rack item. Patch panels get their own hole grid so each instance can
// be punched differently.
function newItem(dev, u, side) {
  const it = { uid: uid(), devId: dev.id, u, label: '', color: 'none' };
  if (state.view === 'rear') it.plane = 'rear';   // placing from the back
  if (dev.half) it.side = side || 'left';
  if (dev.patch) {
    it.ru = dev.ru;
    it.rows = dev.ru;
    it.cols = dev.cols || 12;
    it.slots = new Array(it.rows * it.cols).fill(null);
  }
  return it;
}

// ------------------------------------------------------------ occupancy ----
// `side` is set only when placing a half-width device; `isShelf` when placing a
// shelf. Rules:
//   - a full-width device blocks the whole U
//   - two half-width devices share a U if they are on opposite sides
//   - a shelf and half-width devices share a U — the devices sit ON the shelf
function occupied(u, ru, exceptUid, side, isShelf, plane = 'front', depth = 0) {
  const r = rack();
  if (u < 1 || u + ru - 1 > r.ru) return true;
  return r.items.some((it) => {
    if (it.uid === exceptUid) return false;
    const d = devById(it.devId);
    if (!d) return false;
    if (!(u < it.u + itemRU(it) && it.u < u + ru)) return false;

    // Opposite face of the rack: they only fight over depth, not the U.
    if (itemPlane(it) !== plane) {
      if (!r.depth) return false;           // depth not recorded, so allow it
      if (isShelf || d.shelf) return false; // a shelf is shallow furniture
      // only competing for depth if they share the same half of the same U
      const sameHalf = (!side || !d.half) ? true : (it.side || 'left') === side;
      if (!sameHalf) return false;
      return depth + itemDepth(it) > r.depth;
    }

    if (isShelf && d.half) return false;    // gear sits on the shelf
    if (side && d.shelf) return false;      // ...and the shelf takes gear
    if (!side || !d.half) return true;      // either party is full width
    return (it.side || 'left') === side;
  });
}

// Every U where the front and rear devices together exceed the rack depth.
function depthClashes() {
  const r = rack();
  if (!r.depth) return [];
  const out = [];
  r.items.forEach((a) => {
    if (itemPlane(a) !== 'front') return;
    r.items.forEach((b) => {
      if (itemPlane(b) !== 'rear') return;
      if (!slotsOverlap(a, b)) return;
      const total = itemDepth(a) + itemDepth(b);
      if (total > r.depth) {
        out.push({ u: Math.max(a.u, b.u), total,
                   a: devById(a.devId).model, b: devById(b.devId).model });
      }
    });
  });
  return out;
}

// --- side elevation --------------------------------------------------------
// The one view drawn in true millimetres on both axes: 44.45 mm per U vertically
// and real depth horizontally. That is the whole point of it — the depth model
// already exists (rack.depth, per-item depth, the front/rear clash check) but
// until now it only ever surfaced as a line of text in the summary.
const U_MM_H = 44.45;
// Where the last side drawing put things, so a drag can turn screen pixels back
// into a U and a face. Rewritten by every renderSide().
let sideGeom = null;
let sideDrag = null;

function renderSide() {
  const wrap = $('#sideWrap');
  const r = rack();
  wrap.innerHTML = '';

  const items = r.items.slice();
  const deepest = items.reduce((m, it) => Math.max(m, itemDepth(it)), 0);
  // With no rack depth recorded, show enough to hold the deepest device rather
  // than inventing a case size — and say so.
  const assumed = !r.depth;
  const depth = r.depth || Math.max(300, Math.ceil((deepest + 80) / 50) * 50);

  const PAD = 26, RAIL = 8;
  const H = r.ru * U_MM_H;
  const W = depth;
  const vbW = W + PAD * 2 + 54, vbH = H + PAD * 2 + 26;
  const p = [];
  const esc2 = (s) => esc(String(s));
  const x0 = PAD + 54, y0 = PAD;
  sideGeom = { x0, y0, W, H, vbW, vbH, ru: r.ru, depth };

  p.push(`<svg viewBox="0 0 ${vbW.toFixed(1)} ${vbH.toFixed(1)}" `
    + `class="sidesvg" xmlns="http://www.w3.org/2000/svg">`);

  // U ruler and the horizontal rules between rack units
  for (let u = 1; u <= r.ru; u++) {
    const y = y0 + (u - 1) * U_MM_H;
    p.push(`<text x="${x0 - 10}" y="${(y + U_MM_H / 2 + 3).toFixed(1)}" `
      + `class="sru" text-anchor="end">${u}</text>`);
    p.push(`<line x1="${x0}" y1="${y.toFixed(1)}" x2="${x0 + W}" y2="${y.toFixed(1)}" `
      + `class="sgrid"/>`);
  }

  // the case: front rail on the left, rear on the right
  p.push(`<rect x="${x0}" y="${y0}" width="${W}" height="${H.toFixed(1)}" class="scase"/>`);
  p.push(`<rect x="${x0}" y="${y0}" width="${RAIL}" height="${H.toFixed(1)}" class="srail"/>`);
  p.push(`<rect x="${x0 + W - RAIL}" y="${y0}" width="${RAIL}" height="${H.toFixed(1)}" `
    + `class="srail"/>`);
  p.push(`<text x="${x0 + 2}" y="${(y0 + H + 15).toFixed(1)}" class="sax">FRONT</text>`);
  p.push(`<text x="${x0 + W - 2}" y="${(y0 + H + 15).toFixed(1)}" class="sax" `
    + `text-anchor="end">REAR</text>`);
  p.push(`<text x="${(x0 + W / 2).toFixed(1)}" y="${(y0 + H + 15).toFixed(1)}" `
    + `class="sax${assumed ? ' warn' : ''}" text-anchor="middle">`
    + `${depth} mm${assumed ? ' (assumed — no rack depth set)' : ''}</text>`);

  // Which pairs clash, so the boxes involved can be called out individually.
  const clashing = new Set();
  if (r.depth) {
    items.forEach((a) => {
      if (itemPlane(a) !== 'front') return;
      items.forEach((b) => {
        if (itemPlane(b) !== 'rear' || !slotsOverlap(a, b)) return;
        if (itemDepth(a) + itemDepth(b) > r.depth) { clashing.add(a.uid); clashing.add(b.uid); }
      });
    });
  }

  items.forEach((it) => {
    const dev = devById(it.devId);
    if (!dev) return;
    const ru = itemRU(it);
    const d = itemDepth(it);
    const rear = itemPlane(it) === 'rear';
    const y = y0 + (it.u - 1) * U_MM_H;
    const x = rear ? x0 + W - d : x0;
    const bad = clashing.has(it.uid);
    const half = dev.half ? ' half' : '';
    const moving = sideDrag && sideDrag.uid === it.uid;
    const selected = state.sel === it.uid;
    p.push(`<g class="sitem${bad ? ' bad' : ''}${half}`
      + `${moving ? ' moving' : ''}${selected ? ' sel' : ''}" data-uid="${it.uid}">`);
    p.push(`<rect x="${x.toFixed(1)}" y="${(y + 1.2).toFixed(1)}" width="${d}" `
      + `height="${(ru * U_MM_H - 2.4).toFixed(1)}" rx="2"/>`);
    // The group colour, as the bays and the export sheet already draw it. Here
    // it sits at the RAIL rather than always on the left — front gear is
    // anchored to the front rail and rear gear to the rear one, so putting the
    // stripe on the outside edge keeps it out of the gap down the middle, which
    // is the thing this view exists to show. Clamped to the box: a device with
    // no depth draws nothing at all, and a stripe would be the only mark on it.
    // Inline style, not fill=: a presentation attribute loses to the
    // `.sitem rect` rule, and to `.sitem.bad rect` on a clashing item.
    if (it.color && it.color !== 'none') {
      const sw = Math.min(3, d);
      p.push(`<rect class="sgrp" x="${(rear ? x + d - sw : x).toFixed(1)}" `
        + `y="${(y + 1.2).toFixed(1)}" width="${sw}" `
        + `height="${(ru * U_MM_H - 2.4).toFixed(1)}" rx="1.2" `
        + `style="fill:${esc2(it.color)};stroke:none"/>`);
    }
    // Trim to what the box can hold rather than letting the name run out over
    // the neighbouring gear — a shallow device is exactly where a long model
    // name would otherwise sit on top of whatever is behind it.
    const full = `${it.label || dev.model}${d ? `  ${d} mm` : ''}`;
    const room = Math.floor((d - 9) / 4.5);
    const label = room < 3 ? '' : full.length <= room ? full
      : `${full.slice(0, Math.max(1, room - 1))}…`;
    if (label) {
      p.push(`<text x="${(x + 5).toFixed(1)}" `
        + `y="${(y + ru * U_MM_H / 2 + 3.2).toFixed(1)}" `
        + `class="slab"><title>${esc2(full)}</title>${esc2(label)}</text>`);
    }
    p.push(`</g>`);
  });

  p.push('</svg>');
  wrap.innerHTML = p.join('');

  if (!items.length) {
    wrap.insertAdjacentHTML('beforeend',
      '<p class="sempty">Nothing in this rack yet.</p>');
  }
  applySideZoom();
}

// Screen point -> the U and the face under it. Returns null outside the case.
function sideHit(ev) {
  const svg = $('.sidesvg');
  if (!svg || !sideGeom) return null;
  const rc = svg.getBoundingClientRect();
  if (!rc.width) return null;
  const k = rc.width / sideGeom.vbW;          // the viewBox does all the scaling
  const x = (ev.clientX - rc.left) / k;
  const y = (ev.clientY - rc.top) / k;
  const row = Math.floor((y - sideGeom.y0) / U_MM_H);
  return {
    row: Math.max(0, Math.min(sideGeom.ru - 1, row)),
    plane: x > sideGeom.x0 + sideGeom.W / 2 ? 'rear' : 'front',
    inside: y >= sideGeom.y0 - 20 && y <= sideGeom.y0 + sideGeom.H + 20,
  };
}

// Dragging here moves a device up and down the rack and flips it between faces
// — crossing the midline is the whole gesture, because the midline is what the
// two faces are either side of.
$('#sideWrap').addEventListener('pointerdown', (ev) => {
  if (ev.button !== 0) return;
  const g = ev.target.closest('.sitem');
  if (!g) return;
  const it = rack().items.find((i) => i.uid === g.dataset.uid);
  if (!it) return;
  ev.preventDefault();
  state.sel = it.uid;
  sideDrag = { uid: it.uid, u0: it.u, plane0: itemPlane(it) };
  renderInspector();
  renderSide();

  const move = (e) => {
    const hit = sideHit(e);
    if (!hit || !hit.inside) return;
    const ru = itemRU(it);
    const u = Math.max(1, Math.min(sideGeom.ru - ru + 1, hit.row + 1));
    if (u === it.u && hit.plane === itemPlane(it)) return;
    const dev = devById(it.devId);
    // A clash no longer refuses the move — it is reported afterwards by
    // slotClashes() instead. Same rule as the bays, so the views still agree.
    if (isShelfDev(dev)) moveShelfLoad(it, u);
    it.u = u;
    if (hit.plane === 'rear') it.plane = 'rear'; else delete it.plane;
    renderSide();
  };
  const up = () => {
    removeEventListener('pointermove', move);
    removeEventListener('pointerup', up);
    removeEventListener('pointercancel', up);
    const moved = it.u !== sideDrag.u0 || itemPlane(it) !== sideDrag.plane0;
    sideDrag = null;
    if (moved) { save(); renderAll(); } else renderSide();
  };
  addEventListener('pointermove', move);
  addEventListener('pointerup', up);
  addEventListener('pointercancel', up);
});

// Right-click removes here too, with the same two-step confirmation.
$('#sideWrap').addEventListener('contextmenu', (ev) => {
  const g = ev.target.closest('.sitem');
  if (!g) { disarmRemove(); return; }
  ev.preventDefault();
  requestRemove(g.dataset.uid);
});

// Panels are filled with the bay colour so a device genuinely occludes whatever
// sits behind it, instead of both sets of line art showing through each other.
const bayBg = () => getComputedStyle(document.documentElement)
  .getPropertyValue('--bg-1').trim() || '#111415';

const isShelfDev = (dev) => !!(dev && dev.shelf);

// Which face of the rack a device is bolted to. `side` stays left/right and is
// always expressed as seen from the FRONT, so the rear mirror handles both.
const itemPlane = (it) => it.plane || 'front';

// Which side of the DRAWING an eared half-rack unit's ear goes on. Sides are
// always recorded as seen from the front, and the rear view mirrors positions —
// so from the back, a left-hand unit is on your right and its ear with it.
// Returns null for anything that isn't an eared half-rack device.
function earSide(it, dev, view) {
  if (!dev || !dev.half || !dev.ears) return null;
  const side = it.side === 'right' ? 'right' : 'left';
  if (view !== 'rear') return side;
  return side === 'right' ? 'left' : 'right';
}
const itemDepth = (it) => (devById(it.devId) || {}).depth || 0;

// Do two items share the same left/right column? (Ignores U rows.)
function sameColumn(a, b) {
  const da = devById(a.devId), db = devById(b.devId);
  if (!da || !db) return false;
  if (isShelfDev(da) && db.half) return false;
  if (isShelfDev(db) && da.half) return false;
  if (!da.half || !db.half) return true;
  return (a.side || 'left') === (b.side || 'left');
}

// Do two items compete for the same physical slot? Same column AND same U rows.
function slotsOverlap(a, b) {
  if (!(a.u < b.u + itemRU(b) && b.u < a.u + itemRU(a))) return false;
  return sameColumn(a, b);
}

// A device on the far face is hidden only where something nearer covers it.
// Checking per-U matters: a 1U panel doesn't hide all of a 2U device behind it.
function fullyCovered(it, view, items) {
  const facing = (x) => itemPlane(x) === view;
  const ru = itemRU(it);
  for (let u = it.u; u < it.u + ru; u++) {
    const covered = items.some((o) => o !== it && facing(o) && sameColumn(o, it)
      && u >= o.u && u < o.u + itemRU(o));
    if (!covered) return false;
  }
  return true;
}

// Which items get a side marking. Anything with something nearer over it is
// named by that item's "behind:" line instead, so the column never doubles up.
function labelSet(items, view) {
  const facing = (x) => itemPlane(x) === view;
  return items.filter((it) => {
    // A shelf under half-width gear is drawn as ears only and its row already
    // carries that gear's two labels — a third would land on top of them.
    const d = devById(it.devId);
    if (isShelfDev(d) && shelfIsCarrying(it, items)) return false;
    return facing(it)
      || !items.some((o) => o !== it && facing(o) && slotsOverlap(o, it));
  });
}

// Partly hidden: some of it shows, some doesn't.
function partlyCovered(it, view, items) {
  const facing = (x) => itemPlane(x) === view;
  return items.some((o) => o !== it && facing(o) && slotsOverlap(o, it));
}

// Everything you can see from one side, far face first so nearer gear draws over it.
function visibleFrom(items, view) {
  const facing = (x) => itemPlane(x) === view;
  const far = items.filter((it) => !facing(it) && !fullyCovered(it, view, items));
  const near = items.filter(facing);
  return [...far, ...near];
}

// True when half-rack gear sits on this shelf: the shelf body is then hidden
// behind the gear and only its mounting ears are drawn.
// `items` must be the list the shelf actually belongs to. It defaults to the
// selected rack for on-screen use, but the export walks every rack, so it has to
// pass its own — reading rack() there judged each rack by whichever tab was open.
function shelfIsCarrying(shelfItem, items = rack().items) {
  return itemsOnShelf(shelfItem, items).length > 0;
}

// The half-width gear actually SITTING ON a shelf — sharing its U span, not
// merely near it. `needsShelf` also accepts a shelf directly below, but that
// gear is standing on the rails' own furniture rather than on this shelf, so
// it is not picked up when the shelf moves.
function itemsOnShelf(shelfItem, items = rack().items) {
  const sru = itemRU(shelfItem);
  return items.filter((o) => {
    const od = devById(o.devId);
    return od && od.half && o.uid !== shelfItem.uid
      && o.u < shelfItem.u + sru && shelfItem.u < o.u + itemRU(o);
  });
}

// Move a shelf and take its load with it. Gear that would fall outside the
// rack is left where it is rather than clamped, because silently stacking two
// boxes into one U is worse than leaving one behind visibly.
function moveShelfLoad(shelfItem, newU) {
  const delta = newU - shelfItem.u;
  if (!delta) return;
  for (const o of itemsOnShelf(shelfItem)) {
    const nu = o.u + delta;
    if (nu >= 1 && nu + itemRU(o) - 1 <= rack().ru) o.u = nu;
  }
}

// Every pair of devices that overlap in the same U on the same face. Dropping
// on top of something is allowed — see `occupied`'s callers — so this is what
// reports it afterwards.
function slotClashes() {
  const r = rack();
  const out = [];
  r.items.forEach((a, i) => {
    const da = devById(a.devId);
    if (!da) return;
    r.items.slice(i + 1).forEach((b) => {
      const db = devById(b.devId);
      if (!db) return;
      if (itemPlane(a) !== itemPlane(b)) return;
      if (!(a.u < b.u + itemRU(b) && b.u < a.u + itemRU(a))) return;
      // The legal sharings: gear on a shelf, and two half-width boxes on
      // opposite sides of the same U.
      if ((isShelfDev(da) && db.half) || (isShelfDev(db) && da.half)) return;
      if (da.half && db.half && (a.side || 'left') !== (b.side || 'left')) return;
      out.push({ u: Math.max(a.u, b.u), a: da.model, b: db.model,
                 plane: itemPlane(a) });
    });
  });
  return out;
}

// Items sticking out past the top of the rack.
function overhangs() {
  const r = rack();
  return r.items.filter((it) => it.u + itemRU(it) - 1 > r.ru)
    .map((it) => ({ u: it.u, model: (devById(it.devId) || {}).model || '?' }));
}

function firstFree(ru, side, isShelf, plane, depth) {
  for (let u = 1; u + ru - 1 <= rack().ru; u++) {
    if (!occupied(u, ru, null, side, isShelf, plane, depth)) return u;
  }
  return null;
}

// A half-width device isn't rack-mounted, so it wants a shelf — either one
// sharing its U (sitting on it) or one immediately underneath. `noShelf` on the
// item opts out, for gear with rack ears or stacked on another device.
function needsShelf(it) {
  const d = devById(it.devId);
  // `ears: true` means the unit ships with rack ears and bolts straight in, so
  // there is nothing to warn about — most half-rack RF gear is like this.
  if (!d || !d.half || it.noShelf || d.ears) return false;
  const ru = itemRU(it);
  return !rack().items.some((o) => {
    const od = devById(o.devId);
    if (!od || !od.shelf) return false;
    const oru = itemRU(o);
    const shares = o.u < it.u + ru && it.u < o.u + oru;
    const directlyBelow = o.u === it.u + ru;
    return shares || directlyBelow;
  });
}

// ----------------------------------------------------------------- drag ----
let drag = null;

// A press has to travel before it counts as a drag. Without it, the smallest
// twitch while clicking a device threw a ghost up and armed a move — and on a
// trackpad, a click that does not move at all is the exception.
const DRAG_SLOP = 5;

function startDrag(ev, payload) {
  ev.preventDefault();
  const ghost = document.createElement('div');
  ghost.className = 'ghost';
  ghost.appendChild(renderDevice(payload.dev, state.view, payload.item));
  ghost.hidden = true;                       // shown once the press has travelled
  document.body.appendChild(ghost);

  drag = { ...payload, ghost, x0: ev.clientX, y0: ev.clientY, live: false };

  moveGhost(ev);
  addEventListener('pointermove', onDragMove);
  addEventListener('pointerup', onDragEnd, { once: true });
}

// True once this press has moved far enough to mean it. Marks the source item
// at the moment it becomes a real drag, not before.
function dragLive(ev) {
  if (drag.live) return true;
  if (Math.hypot(ev.clientX - drag.x0, ev.clientY - drag.y0) < DRAG_SLOP) return false;
  drag.live = true;
  drag.ghost.hidden = false;
  if (drag.uid) $(`.item[data-uid="${drag.uid}"]`)?.classList.add('drag');
  return true;
}

function moveGhost(ev) {
  const g = drag.ghost;
  g.style.left = (ev.clientX - 150) + 'px';
  g.style.top = (ev.clientY - (g.offsetHeight || 30) / 2) + 'px';
}

function targetU(ev) {
  const slots = $('#slots');
  if (!slots) return null;
  const rc = slots.getBoundingClientRect();
  if (ev.clientX < rc.left - 40 || ev.clientX > rc.right + 40) return null;
  const uh = rc.height / rack().ru;
  const u = Math.floor((ev.clientY - rc.top) / uh) + 1;
  return Math.max(1, Math.min(rack().ru, u));
}

// Dropping a rack item back onto the library removes it.
const overLibrary = (ev) => {
  const r = $('.lib').getBoundingClientRect();
  return ev.clientX >= r.left && ev.clientX <= r.right
      && ev.clientY >= r.top && ev.clientY <= r.bottom;
};

// Which half of the bay the pointer is over. The rear view mirrors the bay,
// so the visual left is the logical right.
function targetSide(ev) {
  const slots = $('#slots');
  if (!slots) return 'left';
  const rc = slots.getBoundingClientRect();
  const left = ev.clientX < rc.left + rc.width / 2;
  return (state.view === 'rear' ? !left : left) ? 'left' : 'right';
}

function onDragMove(ev) {
  if (!dragLive(ev)) return;
  moveGhost(ev);
  $$('.uslot').forEach((s) =>
    s.classList.remove('hot', 'bad', 'halfleft', 'halfright'));

  // only an item already in the rack can be dragged out to remove it
  const canRemove = !!drag.uid && overLibrary(ev);
  $('.lib').classList.toggle('dropremove', canRemove);
  drag.ghost.classList.toggle('removing', canRemove);
  if (canRemove) return;

  const u = targetU(ev);
  if (u == null) return;
  const ru = drag.ru;
  const side = drag.dev.half ? targetSide(ev) : null;
  const bad = occupied(u, ru, drag.uid, side, drag.shelf, drag.plane, drag.depth);
  for (let i = 0; i < ru; i++) {
    const s = $(`.uslot[data-u="${u + i}"]`);
    if (!s) continue;
    s.classList.add(bad ? 'bad' : 'hot');
    s.classList.toggle('halfleft', side === 'left');
    s.classList.toggle('halfright', side === 'right');
  }
}

function onDragEnd(ev) {
  removeEventListener('pointermove', onDragMove);
  $$('.uslot').forEach((s) =>
    s.classList.remove('hot', 'bad', 'halfleft', 'halfright'));
  $('.lib').classList.remove('dropremove');
  drag.ghost.remove();

  // Never travelled far enough to be a drag — that was a click. Selecting the
  // device already happened on pointerdown, so there is nothing left to do.
  if (!drag.live) { drag = null; renderRack(); return; }

  if (drag.uid && overLibrary(ev)) {          // dragged out of the rack — remove
    rack().items = rack().items.filter((i) => i.uid !== drag.uid);
    if (state.sel === drag.uid) state.sel = null;
    save();
    drag = null;
    renderAll();
    return;
  }

  const u = targetU(ev);
  const ru = drag.ru;
  const side = drag.dev.half ? targetSide(ev) : null;
  if (u != null) {
    if (drag.uid) {
      const it = rack().items.find((i) => i.uid === drag.uid);
      if (it) {
        if (drag.shelf) moveShelfLoad(it, u);
        it.u = u; if (side) it.side = side;
      }
    } else if (drag.copyOf) {
      // A fresh uid, and the punched slots copied rather than shared — the same
      // rule rack duplication follows, and for the same reason.
      const src = drag.copyOf;
      const copy = { ...src, uid: uid(), u,
                     ...(side ? { side } : {}),
                     ...(src.slots ? { slots: src.slots.slice() } : {}),
                     ...(src.cards ? { cards: { ...src.cards } } : {}) };
      if (drag.plane === 'rear') copy.plane = 'rear'; else delete copy.plane;
      rack().items.push(copy);
      state.sel = copy.uid;
      toast(`Copied ${src.label || drag.dev.model} to U${u}.`);
    } else {
      rack().items.push(newItem(drag.dev, u, side));
      state.sel = rack().items.at(-1).uid;
    }
    save();
  }
  drag = null;
  renderAll();
}

document.addEventListener('pointerdown', (ev) => {
  // Primary button only. A right-press used to start a drag it could never
  // finish — the context menu swallowed the pointerup, `onDragEnd` never ran,
  // and the ghost stayed on screen looking like a shrunken duplicate device.
  if (ev.button !== 0) return;
  const lib = ev.target.closest('.libitem');
  if (lib && !ev.target.closest('.del')) {
    const dev = devById(lib.dataset.dev);
    if (dev) startDrag(ev, { dev, ru: dev.ru, shelf: isShelfDev(dev),
                             plane: state.view, depth: dev.depth || 0 });
    return;
  }
  const item = ev.target.closest('.item');
  if (item) {
    const it = rack().items.find((i) => i.uid === item.dataset.uid);
    const dev = it && devById(it.devId);
    if (!dev) return;
    state.sel = it.uid;
    renderInspector();
    $$('.item').forEach((n) => n.classList.toggle('sel', n.dataset.uid === it.uid));
    // Shift-drag copies rather than moves. Dropping a copy is a placement, not a
    // move, so `uid` is left off the payload — that is what tells onDragEnd to
    // create rather than relocate — and `copyOf` carries the settings across.
    startDrag(ev, ev.shiftKey
      ? { dev, copyOf: it, ru: itemRU(it), shelf: isShelfDev(dev),
          plane: itemPlane(it), depth: dev.depth || 0 }
      : { dev, uid: it.uid, item: it, ru: itemRU(it),
          shelf: isShelfDev(dev), plane: itemPlane(it), depth: dev.depth || 0 });
    return;
  }
  if (ev.target.closest('.uslot') || ev.target.closest('.canvas')) {
    if (!ev.target.closest('.item')) { state.sel = null; renderInspector(); renderRack(); }
  }
});

// Right-click a rack item to remove it — but ask first. Right-click is far
// easier to land by accident than the Delete key or a drag to the library, and
// there is still no undo, so this one gets a confirmation the others do not.
// Same two-step shape as the destructive buttons: right-click again within 4 s.
let armedRemove = null;   // { uid, timer }

function disarmRemove(redraw = true) {
  if (!armedRemove) return;
  clearTimeout(armedRemove.timer);
  const uid = armedRemove.uid;
  armedRemove = null;
  if (redraw) {
    document.querySelectorAll(`.item[data-uid="${uid}"], .sitem[data-uid="${uid}"]`)
      .forEach((n) => n.classList.remove('armdel'));
  }
}

// Shared by the bays and the side view, which is why it takes a uid rather than
// reading the event.
function requestRemove(uid) {
  const it = rack().items.find((i) => i.uid === uid);
  if (!it) return;
  const dev = devById(it.devId);
  const name = it.label || (dev ? dev.model : 'device');

  if (!armedRemove || armedRemove.uid !== uid) {
    disarmRemove();
    armedRemove = { uid, timer: setTimeout(() => disarmRemove(), 4000) };
    document.querySelectorAll(`.item[data-uid="${uid}"], .sitem[data-uid="${uid}"]`)
      .forEach((n) => n.classList.add('armdel'));
    toast(`Right-click again to remove ${name} from U${it.u}.`);
    return;
  }

  disarmRemove(false);
  rack().items = rack().items.filter((i) => i.uid !== uid);
  if (state.sel === uid) state.sel = null;
  save(); renderAll();
  toast(`Removed ${name} from U${it.u}.`);
}

document.addEventListener('contextmenu', (ev) => {
  // Belt and braces: if a ghost ever survives an interrupted drag, clear it
  // rather than leaving it stranded over the canvas.
  if (drag) { drag.ghost.remove(); drag = null; renderRack(); }

  const item = ev.target.closest('.item');
  if (!item || state.view === 'flow') { disarmRemove(); return; }
  ev.preventDefault();
  requestRemove(item.dataset.uid);
});

// double-click a library row to drop it in the first free slot
document.addEventListener('dblclick', (ev) => {
  const lib = ev.target.closest('.libitem');
  if (!lib) return;
  const dev = devById(lib.dataset.dev);
  const side = dev.half ? 'left' : null;
  const u = firstFree(dev.ru, side, isShelfDev(dev), state.view, dev.depth || 0);
  if (u == null) return;
  rack().items.push(newItem(dev, u, side));
  state.sel = rack().items.at(-1).uid;
  save(); renderAll();
});

// ------------------------------------------------------------ inspector ----
function renderInspector() {
  const box = $('#inspBox');
  const it = rack().items.find((i) => i.uid === state.sel);
  if (!it) {
    box.innerHTML = '<h3>Nothing selected</h3>' +
      '<p class="hint">Drag a device from the library into the rack. ' +
      'Double-click adds it to the first free slot.</p>';
    return;
  }
  const dev = devById(it.devId);
  box.innerHTML =
    `<h3>${esc(dev.brand)} ${esc(dev.model)}</h3>` +
    `<label class="row"><span>Label</span><input id="iLabel" value="${esc(it.label || '')}"
       placeholder="e.g. MON A"></label>` +
    `<label class="row"><span>Position</span><input id="iU" type="number" min="1"
       max="${rack().ru}" value="${it.u}"></label>` +
    '<div class="row"><span>Group</span><div class="swatches" id="iCols"></div></div>' +
    '<div class="row btns"><button class="btn sm" id="iEditDev">Edit device</button>' +
    '<button class="btn sm danger" id="iDel">Remove</button></div>';

  $('#iLabel').oninput = (e) => {
    it.label = e.target.value; save();
    const n = $(`.item[data-uid="${it.uid}"] .lbl`);
    if (n) n.textContent = it.label;
    else renderRack();
  };
  $('#iU').onchange = (e) => {
    const u = Math.max(1, Math.min(rack().ru, +e.target.value || 1));
    if (isShelfDev(dev)) moveShelfLoad(it, u);
    it.u = u; save();
    renderAll();
  };
  // RF gear ships as one product in many band SKUs. Rather than a library entry
  // per band, the band is picked per unit here and travels in the project file.
  if (dev.bands && dev.bands.length) {
    const row = document.createElement('label');
    row.className = 'row';
    row.innerHTML = '<span>Band</span><select id="iBand">'
      + `<option value="">${dev.bandLabel || 'Not set'}</option>`
      + dev.bands.map((b) =>
          `<option value="${esc(b)}"${it.band === b ? ' selected' : ''}>${esc(b)}</option>`)
        .join('')
      + '</select>';
    box.insertBefore(row, $('#iCols').closest('.row'));
    $('#iBand').onchange = (e) => {
      if (e.target.value) it.band = e.target.value; else delete it.band;
      save(); renderRack();
    };
  }

  // Option-card slots. Fitted per unit, not per library entry, because two
  // SQ-Racks in the same tour are routinely built differently — and the card's
  // sockets become this unit's sockets, so they draw on the rear and patch in
  // the flow view exactly like the ones that were soldered in at the factory.
  (dev.slots || []).forEach((s) => {
    const opts = cardsFor(s.fmt);
    const row = document.createElement('label');
    row.className = 'row';
    row.innerHTML = `<span>${esc(s.name || 'Slot')}</span>`
      + `<select data-slot="${esc(s.id)}">`
      + `<option value="">Empty (blanking plate)</option>`
      + opts.map((c) => `<option value="${esc(c.id)}"`
          + `${(it.cards || {})[s.id] === c.id ? ' selected' : ''}>`
          + `${esc(c.model)}</option>`).join('')
      + '</select>';
    box.insertBefore(row, $('#iCols').closest('.row'));
    row.querySelector('select').onchange = (e) => {
      const v = e.target.value;
      if (v) (it.cards = it.cards || {})[s.id] = v;
      else if (it.cards) delete it.cards[s.id];
      if (it.cards && !Object.keys(it.cards).length) delete it.cards;
      save(); renderAll();
    };
    const fitted = cardById((it.cards || {})[s.id]);
    if (fitted && fitted.note) {
      const n = document.createElement('p');
      n.className = 'hint';
      n.textContent = fitted.note;
      box.insertBefore(n, $('#iCols').closest('.row'));
    }
  });

  if (dev.half) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = '<span>Side</span><div class="seg sm" id="iSide">'
      + '<button data-side="left">Left</button>'
      + '<button data-side="right">Right</button></div>';
    box.insertBefore(row, $('#iCols').closest('.row'));
    $$('#iSide button').forEach((b) => {
      b.classList.toggle('on', (it.side || 'left') === b.dataset.side);
      b.onclick = () => {
        const side = b.dataset.side;
        if (side === (it.side || 'left')) return;
        if (occupied(it.u, itemRU(it), it.uid, side, false,
                     itemPlane(it), dev.depth || 0)) {
          // Allowed, not refused — the summary carries the clash from here.
          toast(`Something else is already on the ${side} at U${it.u}.`, true);
        }
        it.side = side; save(); renderAll();
      };
    });
    // Gear that ships with its own ears has nothing to decide here.
    if (dev.ears) {
      const earRow = document.createElement('div');
      earRow.className = 'row';
      earRow.innerHTML = '<span>Mounting</span><span class="ok">Rack ears fitted</span>';
      box.appendChild(earRow);
    } else {
      const shelfRow = document.createElement('div');
      shelfRow.className = 'row';
      shelfRow.innerHTML = '<span>Shelf</span>'
        + `<button class="btn sm${it.noShelf ? '' : ' primary'}" id="iShelf">`
        + `${it.noShelf ? 'Not required' : 'Required'}</button>`;
      box.appendChild(shelfRow);
      $('#iShelf').onclick = () => {
        // for gear with rack ears, or stacked on another device
        if (it.noShelf) delete it.noShelf; else it.noShelf = true;
        save(); renderAll();
      };
    }

    if (needsShelf(it)) {
      const w = document.createElement('p');
      w.className = 'warn';
      w.textContent = 'No shelf on or beneath this U. Set Shelf to "Not required" '
        + 'if it has rack ears or sits on another unit.';
      box.appendChild(w);
    }
  }

  const planeRow = document.createElement('div');
  planeRow.className = 'row';
  planeRow.innerHTML = '<span>Mounted</span><div class="seg sm" id="iPlane">'
    + '<button data-plane="front">Front</button>'
    + '<button data-plane="rear">Rear</button></div>';
  box.insertBefore(planeRow, $('#iCols').closest('.row'));
  $$('#iPlane button').forEach((b) => {
    b.classList.toggle('on', itemPlane(it) === b.dataset.plane);
    b.onclick = () => {
      const p = b.dataset.plane;
      if (p === itemPlane(it)) return;
      if (occupied(it.u, itemRU(it), it.uid,
                   dev.half ? (it.side || 'left') : null,
                   isShelfDev(dev), p, dev.depth || 0)) {
        // Allowed, not refused — the summary carries the clash from here.
        toast(`Doesn't fit on the ${p} at U${it.u} — moved anyway.`, true);
      }
      if (p === 'front') delete it.plane; else it.plane = 'rear';
      save(); renderAll();
    };
  });

  const cols = $('#iCols');
  GROUP_COLORS.forEach((c) => {
    const b = document.createElement('button');
    b.style.background = c === 'none' ? 'transparent' : c;
    if (c === 'none') b.style.boxShadow = 'inset 0 0 0 1px #444';
    b.className = (it.color || 'none') === c ? 'on' : '';
    b.onclick = () => { it.color = c; save(); renderAll(); };
    cols.appendChild(b);
  });
  $('#iEditDev').onclick = () => editDevice(it.devId);
  $('#iDel').onclick = () => {
    rack().items = rack().items.filter((i) => i.uid !== it.uid);
    state.sel = null; save(); renderAll();
  };

  if (dev.patch) renderPatchEditor(box, it, dev);
}

// ------------------------------------------------------- patch panel edit ---
let patchBrush = 'xlrf';
let patchAnchor = null;      // last clicked cell, for shift-click ranges

// Drag state must live outside the render closure: painting re-renders the rack,
// which rebuilds the grid, which would otherwise wipe the in-progress drag.
let patchCtx = null;         // { it, cols, ru }
let patchPaint = { active: false, value: null };

const cellAbbr = (t) => (t ? shortCode(t) : '');

// Punch one hole and refresh only what changed — never the inspector, or the
// grid node under the pointer would be replaced mid-drag.
function punch(i, value) {
  if (!patchCtx) return;
  const { it } = patchCtx;
  if (it.slots[i] === value) return;
  it.slots[i] = value;
  const c = $(`.pcell[data-i="${i}"]`);
  if (c) {
    c.classList.toggle('on', !!value);
    const abbr = cellAbbr(value);
    c.textContent = abbr;
    c.classList.toggle('long', abbr.length > 4);
    c.title = value ? typeLabel(value) : 'empty';
  }
  renderRack();
  renderSummary();
}

document.addEventListener('pointerover', (e) => {
  if (!patchPaint.active) return;
  const c = e.target.closest?.('.pcell');
  if (c) punch(+c.dataset.i, patchPaint.value);
});

// Ending a drag is when the fit warning and the saved project catch up.
addEventListener('pointerup', () => {
  if (!patchPaint.active) return;
  patchPaint.active = false;
  save();
  renderInspector();
});

function renderPatchEditor(box, it, dev) {
  const ru = patchRU(dev, it);
  const rows = patchRows(dev, it);
  const cols = patchCols(dev, it);

  const wrap = document.createElement('div');
  wrap.className = 'patchedit';
  wrap.innerHTML =
    '<h3>Punch pattern</h3>' +
    '<label class="row"><span>Plate (U)</span><select id="pRu"></select></label>' +
    '<label class="row"><span>Rows</span><select id="pRows"></select></label>' +
    '<label class="row"><span>Per row</span><select id="pCols"></select></label>' +
    '<label class="row"><span>Place</span><select id="pType"></select></label>' +
    '<div class="pgrid" id="pGrid"></div>' +
    '<p class="hint">Drag across holes to punch a run. Shift-click extends from ' +
    'the last hole. Click a punched hole to clear it; right-click clears any hole.</p>' +
    '<div class="row btns"><button class="btn sm" id="pFill">Fill row</button>' +
    '<button class="btn sm" id="pClear">Clear all</button></div>';
  box.appendChild(wrap);

  const opt = (sel, v, label, on) => {
    const o = document.createElement('option');
    o.value = v; o.textContent = label; o.selected = on;
    sel.appendChild(o);
  };

  const ruSel = $('#pRu', wrap);
  [1, 2, 3, 4].forEach((n) => opt(ruSel, n, `${n}U`, n === ru));
  const rowSel = $('#pRows', wrap);
  // one row on a 2U plate is the normal way to mount big CEE / Socapex
  [1, 2, 3, 4].filter((n) => n <= ru).forEach((n) =>
    opt(rowSel, n, n === 1 ? '1 (centred)' : n, n === rows));
  const colSel = $('#pCols', wrap);
  [2, 3, 4, 6, 8, 12, 16, 24].forEach((n) => opt(colSel, n, n, n === cols));

  const tSel = $('#pType', wrap);
  PATCH_GROUPS.forEach(([name, list]) => {
    const og = document.createElement('optgroup');
    og.label = name;
    list.forEach(([v, label]) => {
      const o = document.createElement('option');
      o.value = v; o.textContent = label; o.selected = v === patchBrush;
      og.appendChild(o);
    });
    tSel.appendChild(og);
  });
  tSel.onchange = () => { patchBrush = tSel.value; };

  // Resizing keeps whatever holes still fit rather than silently dropping them.
  const resize = (nRu, nRows, nCols) => {
    nRows = Math.min(nRows, nRu);
    const old = it.slots || [];
    const next = new Array(nRows * nCols).fill(null);
    for (let r = 0; r < nRows; r++) {
      for (let c = 0; c < nCols; c++) {
        if (c < cols && r < rows) next[r * nCols + c] = old[r * cols + c] ?? null;
      }
    }
    it.ru = nRu; it.rows = nRows; it.cols = nCols; it.slots = next;
    patchAnchor = null;
    if (it.u + nRu - 1 > rack().ru) it.u = Math.max(1, rack().ru - nRu + 1);
    save(); renderAll();
  };
  ruSel.onchange = () => resize(+ruSel.value, rows, cols);
  rowSel.onchange = () => resize(ru, +rowSel.value, cols);
  colSel.onchange = () => resize(ru, rows, +colSel.value);

  // --- the grid, with drag-paint and shift-click range -----------------------
  const grid = $('#pGrid', wrap);
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  patchCtx = { it, ru, rows, cols };

  const apply = (idxs, value) => {
    idxs.forEach((i) => { it.slots[i] = value; });
    save(); renderAll();
  };

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('button');
    const t = it.slots?.[i] || null;
    const abbr = cellAbbr(t);
    cell.className = 'pcell' + (t ? ' on' : '') + (abbr.length > 4 ? ' long' : '');
    cell.dataset.i = i;
    cell.textContent = abbr;
    cell.title = t ? typeLabel(t) : 'empty';

    cell.oncontextmenu = (e) => { e.preventDefault(); apply([i], null); };

    cell.onpointerdown = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      if (e.shiftKey && patchAnchor != null) {
        const [a, b] = [patchAnchor, i].sort((m, n) => m - n);
        const run = [];
        for (let k = a; k <= b; k++) run.push(k);
        apply(run, patchBrush);
        return;
      }
      // clicking a hole that already holds the brush type clears it; that value
      // then becomes the brush for the rest of the drag
      patchPaint = { active: true, value: it.slots[i] === patchBrush ? null : patchBrush };
      patchAnchor = i;
      punch(i, patchPaint.value);
    };

    grid.appendChild(cell);
  }

  // --- physical fit ---------------------------------------------------------
  // Connectors are drawn at true size, so a row can fail two ways: too wide for
  // the 407 mm usable face, or taller than the 44.45 mm row itself.
  const problems = patchFit(ru, rows, cols, it.slots).filter((r) => r.tooWide || r.tooTall);
  if (problems.length) {
    const w = document.createElement('p');
    w.className = 'warn';
    w.innerHTML = problems.map((r) => {
      const bits = [];
      if (r.tooWide) bits.push(`needs ${r.widthPct}% of the panel width`);
      if (r.tooTall) bits.push(`tallest connector is ${r.tallestMM} mm in a ${r.rowMM} mm row`);
      const fix = r.tooTall
        ? (rows > 1 ? ' Try fewer rows.' : ' Try a taller plate.')
        : ' Try more rows, or a wider spread.';
      return `Row ${r.row} won't fit: ${bits.join('; ')}.${fix}`;
    }).join('<br>');
    grid.after(w);
  }

  $('#pFill', wrap).onclick = () => apply(it.slots.map((_, i) => i), patchBrush);
  $('#pClear', wrap).onclick = () => apply(it.slots.map((_, i) => i), null);
}


// -------------------------------------------------------------- summary ----
function renderSummary() {
  const r = rack();
  // Two totals, because one number cannot answer both questions a rack poses:
  // what it sits there drawing, and what the feed has to survive. A D80 idles
  // at 180 W and peaks at 7000.
  //
  // Both are reported in AMPS. Watts is what the manufacturers publish and what
  // the library stores, but nobody sizes a distro in watts — you size it in
  // amps against a breaker, so the conversion belongs here rather than in the
  // reader's head.
  let w = 0, p = 0, pk = 0, maxD = 0, approx = false, noPower = 0, noPeak = 0;
  // Count U rows actually occupied — two half-width units sharing a row are 1U,
  // not 2U.
  const rowsUsed = new Set();
  r.items.forEach((it) => {
    const d = devById(it.devId);
    if (!d) return;
    w += itemWeight(it); p += d.power || 0;
    // A device with no `power` field at all is one the manufacturer doesn't
    // publish a figure for — quite common on RF gear. That is NOT zero watts,
    // and letting it total silently would under-report the whole rack.
    if (d.power === undefined || d.power === null) noPower++;
    // Falling back to `power` keeps the peak total honest for gear that draws
    // what it draws — a switch has no meaningful peak. Only devices with no
    // figure at all are counted as missing.
    pk += (d.powerMax ?? d.power) || 0;
    if (d.powerMax === undefined || d.powerMax === null) noPeak++;
    for (let k = 0; k < itemRU(it); k++) rowsUsed.add(it.u + k);
    maxD = Math.max(maxD, d.depth || 0);
    if (d.approx) approx = true;
  });
  const usedU = rowsUsed.size;
  const amps = p / 230;
  const peakAmps = pk / 230;
  const over = usedU > r.ru;
  const caseKg = Number(r.weight) || 0;
  $('#summary').innerHTML = `
    <tr><td>Devices</td><td>${r.items.length}</td></tr>
    <tr><td>U used</td><td${over ? ' style="color:var(--danger)"' : ''}>${usedU} / ${r.ru}${
      over ? ' ⚠' : ''}</td></tr>
    <tr><td>Max depth</td><td>${maxD} mm${r.depth ? ` / ${r.depth}` : ''}</td></tr>
    <tr><td>Idle @230V</td><td>${amps.toFixed(1)} A${noPower ? '+' : ''}</td></tr>
    <tr><td>Peak @230V</td><td>${peakAmps.toFixed(1)} A${noPeak ? '+' : ''}</td></tr>
    <tr><td>Kit weight</td><td>${w.toFixed(1)} kg</td></tr>` +
    (caseKg ? `<tr><td>Case</td><td>${caseKg.toFixed(1)} kg</td></tr>
    <tr><td>Total</td><td>${(w + caseKg).toFixed(1)} kg</td></tr>` : '');
  $('#approxWarn').hidden = !approx;

  let pw = $('#powerWarn');
  if (!pw) {
    pw = document.createElement('p');
    pw.id = 'powerWarn';
    pw.className = 'warn';
    $('#approxWarn').before(pw);
  }
  pw.hidden = !noPower;
  if (noPower) {
    pw.textContent = `${noPower} device${noPower > 1 ? 's' : ''} publish no draw `
      + 'figure, so the amps above are a floor, not a total. Hence the +.';
  }

  const clashes = depthClashes();
  let dw = $('#depthWarn');
  if (!dw) {
    dw = document.createElement('p');
    dw.id = 'depthWarn';
    dw.className = 'warn';
    $('#summary').after(dw);
  }
  const slots = slotClashes();
  const past = overhangs();
  let sw = $('#slotWarn');
  if (!sw) {
    sw = document.createElement('p');
    sw.id = 'slotWarn';
    sw.className = 'warn';
    $('#summary').after(sw);
  }
  sw.hidden = !slots.length && !past.length;
  sw.textContent = [
    ...slots.map((c) => `U${c.u} ${c.plane}: ${c.a} and ${c.b} are in the same slot.`),
    ...past.map((o) => `${o.model} at U${o.u} runs past the top of the rack.`),
  ].join(' ');

  dw.hidden = !clashes.length;
  if (clashes.length) {
    dw.textContent = clashes.map((c) =>
      `U${c.u}: ${c.a} + ${c.b} need ${c.total} mm in a ${r.depth} mm rack.`).join(' ');
  }
}

// ---------------------------------------------------------------- export ---
// A document rather than a snapshot: header, then every rack front AND rear
// with its side markings, then the numbers.
const EX = {
  M: 48,          // page margin
  GUT: 62,        // U-number gutter
  PANEL: 1000,
  LBL: 430,       // side markings
  GAP: 64,        // between the two elevations
  HEAD: 156,      // document header (must clear the rule under it)
  TITLE: 52,      // rack title strip
  SUM: 104,       // per-rack summary strip
  RACKGAP: 74,
  CABHEAD: 108,   // cable-schedule title strip + column headings
  CABROW: 34,
};
EX.COL = EX.GUT + EX.PANEL + 22 + EX.LBL;
EX.W = EX.M * 2 + EX.COL * 2 + EX.GAP;

const xml = (s) => esc(s);
const tx = (s, x, y, o = {}) =>
  `<text x="${x}" y="${y}" font-family="Helvetica,Arial,sans-serif" `
  + `font-size="${o.size || 20}" fill="${o.fill || '#000'}"`
  + `${o.anchor ? ` text-anchor="${o.anchor}"` : ''}`
  + `${o.weight ? ` font-weight="${o.weight}"` : ''}`
  + `${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${xml(s)}</text>`;

// What you can see of one rack from one side.
function visibleIn(r, view) {
  return visibleFrom(r.items, view);
}

function elevation(r, view, ox, oy) {
  const p = [];
  const px = ox + EX.GUT;                       // panel left edge
  const lx = px + EX.PANEL + 22;                // side markings left edge
  const H = r.ru * 100;

  p.push(tx(view === 'rear' ? 'REAR' : 'FRONT', px, oy - 22,
            { size: 21, weight: 600, ls: 2 }));
  p.push(`<rect x="${px - 7}" y="${oy - 7}" width="${EX.PANEL + 14}" `
    + `height="${H + 14}" fill="none" stroke="#bbb" stroke-width="2" rx="5"/>`);

  for (let u = 1; u <= r.ru; u++) {
    p.push(tx(String(u), px - 14, oy + (u - 1) * 100 + 60,
              { size: 20, fill: '#999', anchor: 'end' }));
  }

  const facing = (x) => itemPlane(x) === view;
  const labelled = new Set(labelSet(r.items, view).map((x) => x.uid));

  visibleIn(r, view).forEach((it) => {
    const d = devById(it.devId);
    if (!d) return;
    const iru = itemRU(it);
    const y = oy + (it.u - 1) * 100;
    const showRear = !facing(it);

    const ears = earSide(it, d, view);
    const svg = isShelfDev(d) && shelfIsCarrying(it, r.items)
      ? renderEarsOnly(iru, { bg: '#fff' })
      : (showRear && !d.patch && !hasRear(d)
        ? renderNoRear(d, iru,
            { bg: '#fff', ears, quiet: partlyCovered(it, view, r.items) })
        : renderDevice(d, showRear ? 'rear' : 'front', it,
                       { bg: '#fff', ears, hatch: showRear && !d.patch }));
    const inner = svg.innerHTML.replaceAll('currentColor', '#000');

    const onRight = view === 'rear' ? it.side !== 'right' : it.side === 'right';
    // An eared half unit spans rail to centre line, so it is half the full panel
    // and starts at the rail rather than at the interior edge.
    const vw = d.half ? (ears ? HALF_EAR_W + HALF_W : HALF_W) : EX.PANEL;
    const vx = px + (d.half
      ? (ears ? (onRight ? HALF_EAR_W + HALF_W : 0) : (onRight ? HALF_R : HALF_L))
      : 0);
    p.push(`<svg x="${vx}" y="${y}" width="${vw}" height="${iru * 100}" `
      + `viewBox="0 0 ${vw} ${iru * 100}" preserveAspectRatio="none">${inner}</svg>`);

    // --- side markings -------------------------------------------------
    if (!labelled.has(it.uid)) return;
    const behind = r.items.filter((o) => o !== it
      && itemPlane(o) !== itemPlane(it) && slotsOverlap(o, it));
    const half = !!d.half;
    const bandH = half ? iru * 50 : iru * 100;
    const bandY = half && it.side === 'right' ? y + iru * 50 : y;

    if (it.color && it.color !== 'none') {
      p.push(`<rect x="${lx}" y="${bandY + 5}" width="7" height="${bandH - 10}" `
        + `rx="3" fill="${it.color}"/>`);
    }
    const undoc = !d.patch && !hasRear(d);
    const behindTxt = behind.length
      ? `behind: ${behind.map((o) => devById(o.devId).model).join(', ')}` : null;
    const rearTxt = showRear
      ? (undoc ? 'rear not documented' : `rear of ${d.model}`) : null;

    if (half) {
      // A half-width band is only 50 units tall — two lines is all that fits,
      // so the secondary bits share one line.
      p.push(tx(it.label || d.model, lx + 17, bandY + 16,
                { size: 17, weight: 600 }));
      const sub = [it.band ? bandName(it.band) : null,
                   showRear ? (undoc ? 'no rear' : 'rear') : null, behindTxt]
        .filter(Boolean).join(' · ');
      if (sub) p.push(tx(sub, lx + 17, bandY + 34, { size: 13, fill: '#777' }));
    } else {
      let ty = bandY + 34;
      p.push(tx(it.label || d.model, lx + 17, ty, { size: 21, weight: 600 }));
      if (it.band) {
        ty += 24;
        p.push(tx(it.band, lx + 17, ty, { size: 17, fill: '#444' }));
      }
      if (rearTxt) {
        ty += 25;
        p.push(tx(rearTxt, lx + 17, ty, { size: 17, fill: '#666' }));
      }
      if (behindTxt) {
        ty += 24;
        p.push(tx(behindTxt, lx + 17, ty, { size: 16, fill: '#888' }));
      }
    }
  });
  return p;
}

function rackStats(r) {
  let w = 0, pw = 0, pk = 0, maxD = 0, noPower = 0, noPeak = 0;
  const rows = new Set();
  r.items.forEach((it) => {
    const d = devById(it.devId);
    if (!d) return;
    w += itemWeight(it); pw += d.power || 0;
    if (d.power === undefined || d.power === null) noPower++;
    pk += (d.powerMax ?? d.power) || 0;
    if (d.powerMax === undefined || d.powerMax === null) noPeak++;
    for (let k = 0; k < itemRU(it); k++) rows.add(it.u + k);
    maxD = Math.max(maxD, d.depth || 0);
  });
  return { w, pw, pk, maxD, noPower, noPeak, usedU: rows.size, n: r.items.length,
           caseKg: Number(r.weight) || 0 };
}

function buildExportSVG() {
  const proj = state.project;
  const racks = proj.racks;
  const date = new Date().toLocaleDateString(undefined,
    { year: 'numeric', month: 'short', day: 'numeric' });

  // The schedule is a read-out of the graph, so it costs nothing to include and
  // is the half of the document a crew actually works from.
  const cables = flow.cableRows();
  const cabH = cables.length ? EX.CABHEAD + cables.length * EX.CABROW + 46 : 0;

  const blockH = (r) => EX.TITLE + r.ru * 100 + EX.SUM + EX.RACKGAP;
  const totalH = EX.HEAD + racks.reduce((a, r) => a + blockH(r), 0)
                 + 120 + cabH + EX.M;   // + project totals + cable schedule

  const p = [];
  p.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${EX.W}" `
    + `height="${totalH}" viewBox="0 0 ${EX.W} ${totalH}">`);
  p.push(`<rect width="${EX.W}" height="${totalH}" fill="#fff"/>`);

  // ---- document header ----
  p.push(tx(proj.name || 'Untitled project', EX.M, EX.M + 34,
            { size: 40, weight: 700 }));
  p.push(tx(`${racks.length} rack${racks.length === 1 ? '' : 's'} · `
    + `${racks.reduce((a, r) => a + r.items.length, 0)} devices`,
    EX.M, EX.M + 66, { size: 20, fill: '#666' }));
  p.push(tx(date, EX.W - EX.M, EX.M + 34, { size: 20, fill: '#666', anchor: 'end' }));
  p.push(tx('Rack Builder', EX.W - EX.M, EX.M + 62,
            { size: 17, fill: '#999', anchor: 'end' }));
  p.push(`<line x1="${EX.M}" y1="${EX.HEAD - 22}" x2="${EX.W - EX.M}" `
    + `y2="${EX.HEAD - 22}" stroke="#222" stroke-width="2"/>`);

  // ---- one block per rack, front and rear side by side ----
  let y = EX.HEAD;
  let totKit = 0, totCase = 0, totW = 0, totPk = 0, totNoPower = 0, totNoPeak = 0;
  racks.forEach((r, i) => {
    const s = rackStats(r);
    totKit += s.w; totCase += s.caseKg; totW += s.pw; totNoPower += s.noPower;
    totPk += s.pk; totNoPeak += s.noPeak;

    p.push(tx(r.name || `Rack ${i + 1}`, EX.M, y + 30, { size: 27, weight: 700 }));
    p.push(tx(`${r.ru}U`, EX.M + 300, y + 30, { size: 21, fill: '#666' }));

    const top = y + EX.TITLE + 26;
    p.push(...elevation(r, 'front', EX.M, top));
    p.push(...elevation(r, 'rear', EX.M + EX.COL + EX.GAP, top));

    const sy = top + r.ru * 100 + 40;
    const bits = [
      `${s.n} devices`,
      `${s.usedU}/${r.ru}U`,
      `${s.w.toFixed(1)} kg kit`,
      s.caseKg ? `${s.caseKg.toFixed(1)} kg case` : null,
      s.caseKg ? `${(s.w + s.caseKg).toFixed(1)} kg total` : null,
      `${(s.pw / 230).toFixed(1)} A idle${s.noPower ? '+' : ''}`,
      `${(s.pk / 230).toFixed(1)} A peak${s.noPeak ? '+' : ''}`,
      `max depth ${s.maxD} mm${r.depth ? ` of ${r.depth}` : ''}`,
      s.noPower ? `${s.noPower} device${s.noPower > 1 ? 's' : ''} publish no draw figure` : null,
    ].filter(Boolean);
    p.push(`<line x1="${EX.M}" y1="${sy - 24}" x2="${EX.W - EX.M}" y2="${sy - 24}" `
      + `stroke="#ddd" stroke-width="2"/>`);
    p.push(tx(bits.join('   ·   '), EX.M, sy + 4, { size: 20 }));

    const clash = (() => {
      const keep = state.rack;
      state.rack = i;
      const c = depthClashes();
      state.rack = keep;
      return c;
    })();
    if (clash.length) {
      p.push(tx(clash.map((c) => `U${c.u}: ${c.a} + ${c.b} = ${c.total} mm`).join('  '),
                EX.M, sy + 32, { size: 18, fill: '#c0392b' }));
    }
    y += blockH(r);
  });

  // ---- cable schedule ----
  if (cables.length) {
    p.push(`<line x1="${EX.M}" y1="${y - 8}" x2="${EX.W - EX.M}" y2="${y - 8}" `
      + `stroke="#222" stroke-width="2"/>`);
    p.push(tx('CABLE SCHEDULE', EX.M, y + 34, { size: 21, weight: 700, ls: 2 }));
    p.push(tx(`${cables.length} cable${cables.length === 1 ? '' : 's'}`,
              EX.M + 300, y + 34, { size: 20, fill: '#666' }));

    // Column x positions, all relative to the margin so the block travels with
    // the page width if the sheet is ever re-proportioned.
    const CN = EX.M + 6, CT = EX.M + 96, CS = EX.M + 400,
          CA = EX.M + 1480, CD = EX.M + 1560;
    const hy = y + 74;
    ['CABLE', 'TYPE', 'FROM', '', 'TO'].forEach((h, i) => {
      const cx = [CN, CT, CS, CA, CD][i];
      if (h) p.push(tx(h, cx, hy, { size: 16, fill: '#999', ls: 1.4 }));
    });
    p.push(`<line x1="${EX.M}" y1="${hy + 14}" x2="${EX.W - EX.M}" y2="${hy + 14}" `
      + `stroke="#ddd" stroke-width="2"/>`);

    let cy = y + EX.CABHEAD + 18;
    cables.forEach((c, i) => {
      // Banding beats hairlines when a sheet is photocopied or read on a phone.
      if (i % 2) {
        p.push(`<rect x="${EX.M}" y="${cy - 22}" width="${EX.W - EX.M * 2}" `
          + `height="${EX.CABROW}" fill="#f4f5f6"/>`);
      }
      const col = FAMILIES[c.fam] ? FAMILIES[c.fam].color : '#888';
      p.push(`<circle cx="${CN + 7}" cy="${cy - 7}" r="7" fill="${col}"/>`);
      p.push(tx(String(c.c.n), CN + 26, cy, { size: 19, weight: 700 }));
      p.push(tx(FAMILIES[c.fam] ? FAMILIES[c.fam].label : c.fam, CT, cy,
                { size: 17, fill: '#666' }));
      p.push(tx(`${c.srcNode} — ${c.srcPort}`, CS, cy, { size: 19 }));
      p.push(tx(c.srcMeta, CS + 700, cy, { size: 16, fill: '#999' }));
      p.push(tx('→', CA, cy, { size: 19, fill: '#666' }));
      p.push(tx(`${c.dstNode} — ${c.dstPort}`, CD, cy, { size: 19 }));
      p.push(tx(c.dstMeta, CD + 700, cy, { size: 16, fill: '#999' }));
      if (c.c.label) p.push(tx(c.c.label, CD + 980, cy, { size: 16, fill: '#666' }));
      cy += EX.CABROW;
    });

    p.push(tx('Socket numbers are the order the connectors are declared in the '
      + 'library, not silkscreen numbering, unless the socket is named.',
      EX.M, cy + 18, { size: 16, fill: '#999' }));
    y += cabH;
  }

  // ---- project totals ----
  p.push(`<line x1="${EX.M}" y1="${y - 8}" x2="${EX.W - EX.M}" y2="${y - 8}" `
    + `stroke="#222" stroke-width="2"/>`);
  p.push(tx('PROJECT TOTAL', EX.M, y + 30, { size: 21, weight: 700, ls: 2 }));
  p.push(tx([`${totKit.toFixed(1)} kg kit`,
             totCase ? `${totCase.toFixed(1)} kg cases` : null,
             `${(totKit + totCase).toFixed(1)} kg all in`,
             `${(totW / 230).toFixed(1)} A idle${totNoPower ? '+' : ''}`,
             `${(totPk / 230).toFixed(1)} A peak${totNoPeak ? '+' : ''}`]
            .filter(Boolean).join('   ·   '), EX.M + 260, y + 30, { size: 20 }));
  p.push(tx('Figures marked approximate in the library are not datasheet-verified.'
            + (totNoPower ? `  ${totNoPower} device${totNoPower > 1 ? 's' : ''} publish `
              + 'no draw figure, so the amps are a floor (+), not a total.' : ''),
            EX.M, y + 62, { size: 16, fill: '#999' }));

  p.push('</svg>');
  return p.join('\n');
}


function download(name, blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

const exportName = () => (state.project.name || 'project')
  .replace(/[^\w\-. ]+/g, '').trim() || 'project';

function exportSVG() {
  download(`${exportName()}.svg`,
    new Blob([buildExportSVG()], { type: 'image/svg+xml' }));
}

function exportPNG() {
  const svg = buildExportSVG();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const img = new Image();
  img.onload = () => {
    const scale = 1.5;   // the sheet is already ~2900 units wide
    const c = document.createElement('canvas');
    c.width = img.width * scale; c.height = img.height * scale;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    c.toBlob((b) => download(`${exportName()}.png`, b));
    URL.revokeObjectURL(url);
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast('PNG export failed.', true); };
  img.src = url;
}

// ----------------------------------------------------------------- menus ---
$('#btnFile').onclick = (e) => {
  e.stopPropagation();
  const m = $('#fileMenu');
  m.hidden = !m.hidden;
};
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu')) $('#fileMenu').hidden = true;
});

armed($('#fileMenu button[data-act="new"]'), 'Discard project?', () => {
  $('#fileMenu').hidden = true;
  state.project = blankProject(); state.rack = 0; state.sel = null;
  save(); renderAll();
  toast('New project started.');
});

$('#fileMenu').onclick = (e) => {
  const act = e.target.dataset.act;
  if (!act || act === 'new') return;      // 'new' has its own two-step handler
  $('#fileMenu').hidden = true;

  if (act === 'save') {
    download(`${state.project.name}.json`,
      new Blob([JSON.stringify(state.project, null, 2)], { type: 'application/json' }));
  }
  if (act === 'load') $('#fileInput').click();
  if (act === 'svg') exportSVG();
  if (act === 'png') exportPNG();
  if (act === 'print') {
    // Print the export sheet, not the live UI.
    const host = $('#printArea');
    host.innerHTML = buildExportSVG();
    const done = () => { host.innerHTML = ''; removeEventListener('afterprint', done); };
    addEventListener('afterprint', done);
    window.print();
  }
};

$('#fileInput').onchange = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const p = JSON.parse(rd.result);
      if (!p.racks || !Array.isArray(p.racks)) throw new Error('no racks');
      state.project = { custom: [], ...p };
      state.rack = 0; state.sel = null;
      save(); renderAll();
    } catch (err) { toast('Not a Rack Builder project: ' + err.message, true); }
  };
  rd.readAsText(f);
  e.target.value = '';
};

// --- resizable side panels -------------------------------------------------
// Widths are a view preference, like the library's open groups, so they live in
// their own localStorage key rather than travelling in a saved .json.
const PANE_W = 'rackbuilder.panes';
const PANE_MIN = 190, PANE_MAX = 620;
let paneW = { lib: 264, insp: 272 };
try { Object.assign(paneW, JSON.parse(localStorage.getItem(PANE_W) || '{}')); } catch { /* ignore */ }

// Dragging a panel below its minimum collapses it to nothing rather than
// stopping at the minimum — the canvas is the point of the app, and on a laptop
// 530 px of chrome is most of the screen. A tab on the edge brings it back.
const PANE_HIDE = 120;

function applyPanes() {
  const r = document.documentElement.style;
  r.setProperty('--lib-w', (paneW.libOff ? 0 : paneW.lib) + 'px');
  r.setProperty('--insp-w', (paneW.inspOff ? 0 : paneW.insp) + 'px');
  document.body.classList.toggle('lib-off', !!paneW.libOff);
  document.body.classList.toggle('insp-off', !!paneW.inspOff);
  $('#showLib').hidden = !paneW.libOff;
  $('#showInsp').hidden = !paneW.inspOff;
}

function setPane(key, off) {
  paneW[`${key}Off`] = off;
  applyPanes();
  try { localStorage.setItem(PANE_W, JSON.stringify(paneW)); } catch { /* quota */ }
  if (state.view !== 'flow') sizeU();
}
applyPanes();

function dragPane(handle, key, edge) {
  handle.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    handle.classList.add('on');
    document.body.classList.add('rzing');
    const x0 = ev.clientX, w0 = paneW[key];
    // Tracked on the window rather than through setPointerCapture: capture
    // fails outright for a synthetic pointer, and a drag that leaves the 9 px
    // handle — which every drag does — must keep working either way.
    const move = (e) => {
      // `edge` is which way the panel grows: the library grows rightwards, the
      // inspector leftwards, so one of them takes the delta negated.
      const w = w0 + (e.clientX - x0) * edge;
      if (w < PANE_HIDE) {                    // dragged shut
        paneW[`${key}Off`] = true;
        applyPanes();
        return;
      }
      paneW[`${key}Off`] = false;
      paneW[key] = Math.round(Math.min(PANE_MAX, Math.max(PANE_MIN, w)));
      applyPanes();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      handle.classList.remove('on');
      document.body.classList.remove('rzing');
      try { localStorage.setItem(PANE_W, JSON.stringify(paneW)); } catch { /* quota */ }
      // The rack is sized to the canvas, so it has to be re-fitted afterwards.
      if (state.view !== 'flow') sizeU();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
  // Keyboard: the handle is a real button, so it should be operable without a
  // pointer.
  handle.addEventListener('keydown', (ev) => {
    const step = ev.shiftKey ? 40 : 12;
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    ev.preventDefault();
    const d = (ev.key === 'ArrowRight' ? 1 : -1) * edge * step;
    paneW[key] = Math.round(Math.min(PANE_MAX, Math.max(PANE_MIN, paneW[key] + d)));
    applyPanes();
    try { localStorage.setItem(PANE_W, JSON.stringify(paneW)); } catch { /* quota */ }
    if (state.view !== 'flow') sizeU();
  });
}
dragPane($('#rzLib'), 'lib', 1);
dragPane($('#rzInsp'), 'insp', -1);
$('#showLib').onclick = () => setPane('lib', false);
$('#showInsp').onclick = () => setPane('insp', false);
$('#hideLib').onclick = () => setPane('lib', true);
$('#hideInsp').onclick = () => setPane('insp', true);

// The flow canvas is a third view rather than a separate page: it shares the
// project, so a device dropped into a rack turns up on the graph immediately.
const flow = createFlow({ state, save, devById, toast, esc, uid });
flow.mount();

function applyView() {
  const isFlow = state.view === 'flow';
  const isSide = state.view === 'side';
  $('#canvas').hidden = isFlow;
  $('#rackBar').hidden = isFlow;
  $('#flowView').hidden = !isFlow;
  $('#flowBar').hidden = !isFlow;
  $('#rackWrap').hidden = isSide;
  $('#sideWrap').hidden = !isSide;
  if (isFlow) flow.open();
  else if (isSide) { renderSide(); applySideZoom(); }
  else sizeU();
}

$$('.bar .seg button').forEach((b) => {
  b.onclick = () => {
    state.view = b.dataset.view;
    $$('.bar .seg button').forEach((x) => x.classList.toggle('on', x === b));
    // The bay only understands front and rear; side and flow draw themselves.
    if (state.view === 'front' || state.view === 'rear') renderRack();
    applyView();
  };
});

$('#libSearch').oninput = (e) => { state.libQ = e.target.value; renderLib(); };
$('#projName').oninput = (e) => { state.project.name = e.target.value; save(); };

$('#rackName').onchange = (e) => { rack().name = e.target.value || 'RACK'; save(); renderAll(); };
$('#rackW').oninput = (e) => {
  const v = e.target.value.trim();
  // Optional: blank means "not recorded", which is different from 0 kg.
  if (v === '') delete rack().weight; else rack().weight = Math.max(0, +v || 0);
  save(); renderSummary();
};

$('#rackD').oninput = (e) => {
  const v = e.target.value.trim();
  // Optional: without it, front/rear pairs are allowed without a depth check.
  if (v === '') delete rack().depth; else rack().depth = Math.max(0, +v || 0);
  save(); renderSummary();
};

$('#rackU').onchange = (e) => {
  const n = Math.max(1, Math.min(52, +e.target.value || 12));
  const overflow = rack().items.filter((it) => {
    const d = devById(it.devId);
    return d && it.u + itemRU(it) - 1 > n;
  });
  // Shrinking is refused rather than quietly binning gear — move it first.
  if (overflow.length) {
    e.target.value = rack().ru;
    toast(`${overflow.length} device(s) sit below ${n}U. Move or remove them first.`, true);
    return;
  }
  rack().ru = n; save(); renderAll();
};

$('#btnAddRack').onclick = () => {
  state.project.racks.push(blankRack(state.project.racks.length + 1));
  state.rack = state.project.racks.length - 1;
  state.sel = null; save(); renderAll();
};
// Copy a rack, contents and all. Two identical amp racks or a pair of matching
// stage racks is the normal case, not the exception.
//
// Every item gets a fresh uid, because a uid identifies one physical device: the
// flow graph keys cables off it, so reusing them would silently patch the copy's
// sockets to the original's cables. Punched patch panels get their slot array
// copied rather than shared, for the same reason.
$('#btnDupRack').onclick = () => {
  const src = rack();
  const copy = {
    ...src,
    id: uid(),
    name: nextCopyName(src.name),
    items: src.items.map((it) => ({
      ...it,
      uid: uid(),
      ...(it.slots ? { slots: it.slots.slice() } : {}),
      ...(it.cards ? { cards: { ...it.cards } } : {}),
    })),
  };
  state.project.racks.splice(state.rack + 1, 0, copy);
  state.rack += 1;
  state.sel = null; save(); renderAll();
  toast(`Duplicated ${src.name} — ${copy.items.length} device`
    + `${copy.items.length === 1 ? '' : 's'} copied.`);
};

// "RACK 1" -> "RACK 2" where that is free, otherwise "RACK 1 copy", then
// "RACK 1 copy 2". Never silently collides with a name already in use.
function nextCopyName(name) {
  const taken = new Set(state.project.racks.map((r) => r.name));
  const m = /^(.*?)(\d+)\s*$/.exec(name);
  if (m) {
    for (let n = +m[2] + 1; n < +m[2] + 60; n++) {
      const c = `${m[1]}${n}`;
      if (!taken.has(c)) return c;
    }
  }
  if (!taken.has(`${name} copy`)) return `${name} copy`;
  for (let n = 2; n < 60; n++) {
    if (!taken.has(`${name} copy ${n}`)) return `${name} copy ${n}`;
  }
  return `${name} copy`;
}

const resetDelRack = armed($('#btnDelRack'), 'Confirm delete', () => {
  state.project.racks.splice(state.rack, 1);
  state.rack = Math.max(0, state.rack - 1);
  state.sel = null; save(); renderAll();
  toast('Rack deleted.');
});

// Empties the rack of gear but keeps the rack itself — both faces, since a
// front-only clear would leave rear-mounted kit behind and look like a bug.
const resetClearRack = armed($('#btnClearRack'), 'Confirm clear', () => {
  const n = rack().items.length;
  const name = rack().name;
  rack().items = [];
  state.sel = null; save(); renderAll();
  toast(`Cleared ${n} device${n === 1 ? '' : 's'} from ${name}.`);
});

// ------------------------------------------------------- add-device form ---
const dlgAdd = $('#dlgAdd');

// The device editor is the patch-panel punch grid applied to a whole device:
// one grid per face, click to place, and every cell you fill becomes a real
// element at a real coordinate. It replaces a list of "8 of these, 2 of those",
// which could only ever produce an auto-layout — fine for inventory, useless
// for saying WHERE anything is, and with no way at all to describe a rear.
//
// A cell holds one of:
//   null                    empty
//   { t, lbl }              a connector, `lbl` being its real name on the panel
//   { text }                a piece of panel lettering
const BLANK_FACE = () => ({ rows: 1, cols: 8, cells: [], keep: null });
const clone = (o) => (o == null ? null : JSON.parse(JSON.stringify(o)));

// Read an existing face back into the grid, so a device can be edited rather
// than rebuilt. Returns null when the panel cannot honestly be put on a uniform
// grid — a hand-placed drawing at irregular pitch, or an `auto` declaration,
// which has no positions at all. That null is not a failure: the caller keeps
// the original spec untouched, and only replaces it if you actually draw on it.
function gridFromSpec(spec, ru, width) {
  if (!spec || !Array.isArray(spec.elements)) return null;
  const half = width !== 'full';
  const L = half ? HALF_INSET : FACE_L;
  const R = half ? HALF_W - HALF_INSET : FACE_R;
  const TOL = 7;                       // ~3.4 mm, tighter than any real pitch

  const items = [];
  for (const e of spec.elements) {
    const n = e.n || 1, gap = e.gap || 0;
    for (let i = 0; i < n; i++) {
      const lbl = Array.isArray(e.lbl) ? e.lbl[i]
        : (e.lbl && n > 1 ? `${e.lbl} ${i + 1}` : e.lbl);
      items.push({ t: e.t, x: e.x + i * gap, y: e.y, lbl });
    }
  }
  for (const l of spec.labels || []) items.push({ text: l.text, x: l.x, y: l.y });
  if (!items.length) return { rows: 1, cols: 8, cells: new Array(8).fill(null), keep: null };

  const ys = [...new Set(items.map((i) => Math.round(i.y)))].sort((a, b) => a - b);
  const rows = ys.length;
  if (rows > ru * 2) return null;
  for (let r = 0; r < rows; r++) {
    if (Math.abs(ys[r] - (ru * U * (r + 0.5)) / rows) > TOL) return null;
  }
  const rowOf = (y) => ys.indexOf(Math.round(y));

  for (const cols of [2, 3, 4, 6, 8, 10, 12, 16, 20, 24]) {
    const cellX = (c) => L + ((R - L) * (c + 0.5)) / cols;
    const cells = new Array(rows * cols).fill(null);
    let ok = true;
    for (const it of items) {
      let best = -1, bestD = Infinity;
      for (let c = 0; c < cols; c++) {
        const d = Math.abs(it.x - cellX(c));
        if (d < bestD) { bestD = d; best = c; }
      }
      const i = rowOf(it.y) * cols + best;
      // Too far from any cell centre, or two things claiming one cell, and this
      // column count is not the grid this panel was drawn on.
      if (bestD > TOL || cells[i]) { ok = false; break; }
      cells[i] = it.text ? { text: it.text }
                         : { t: it.t, ...(it.lbl ? { lbl: it.lbl } : {}) };
    }
    if (ok) return { rows, cols, cells, keep: null };
  }
  return null;
}
let draft = null;            // the device being built
let draftFace = 'front';     // which face the grid is showing
let draftMode = 'grid';      // 'grid' places by position, 'list' edits the IO
let draftSel = null;         // index of the selected cell
let draftBrush = 'xlrf';     // what clicking a cell places
let draftAnchor = null;      // last cell clicked, for shift-click runs
let draftPaint = { active: false, value: undefined };

const faceOf = () => draft[draftFace];
const cellCount = (f) => f.rows * f.cols;

// Grid cell -> panel coordinate. Full-width faces use the usable face between
// the ears; a half-width body has no ears and its own narrower bounds.
function draftXY(i) {
  const f = faceOf();
  const half = draft.width !== 'full';
  const L = half ? HALF_INSET : FACE_L;
  const R = half ? HALF_W - HALF_INSET : FACE_R;
  const r = Math.floor(i / f.cols), c = i % f.cols;
  return {
    x: Math.round(L + ((R - L) * (c + 0.5)) / f.cols),
    y: Math.round((draft.ru * U * (r + 0.5)) / f.rows),
  };
}

// One face as the `elements` / `labels` a panel spec wants. Connectors keep the
// name they were given; lettering becomes a label at the same cell centre.
function faceSpec(name) {
  const f = draft[name];
  const elements = [], labels = [];
  const save = draftFace;
  draftFace = name;
  for (let i = 0; i < cellCount(f); i++) {
    const cell = f.cells[i];
    if (!cell) continue;
    const { x, y } = draftXY(i);
    if (cell.text) labels.push({ text: cell.text, x, y, size: 13, ls: .8, anchor: 'middle' });
    else elements.push({ t: cell.t, x, y, ...(cell.lbl ? { lbl: cell.lbl } : {}) });
  }
  draftFace = save;
  return { elements, labels };
}

const faceUsed = (name) => (draft[name].cells || []).some(Boolean);

// The record exactly as devices.js holds one, so it can be pasted into the
// library file or into another builder's Find specs box unchanged.
//
// When editing, the ORIGINAL record is the starting point rather than a blank
// one. A library device carries fields this editor knows nothing about — `src`,
// `slots`, `bands`, `patch`, `shelf` — and rebuilding from scratch would
// quietly strip them, which is a far worse bug than whatever was being fixed.
function draftRecord() {
  const rec = { ...(draft.base || {}) };
  rec.id = draft.base ? draft.base.id : 'u-' + uid();
  rec.brand = draft.brand || 'Generic';
  rec.model = draft.model || 'Device';
  rec.category = draft.category;
  rec.ru = draft.ru;
  rec.depth = draft.depth;
  rec.weight = draft.weight;
  rec.power = draft.power;
  if (!draft.base) rec.approx = true;

  if (draft.width === 'full') { delete rec.half; delete rec.ears; }
  else {
    rec.half = true;
    if (draft.width === 'half-ears') rec.ears = true; else delete rec.ears;
  }

  ['front', 'rear'].forEach((n) => {
    const f = draft[n];
    if (!faceUsed(n)) {
      // Nothing drawn on the grid: the face is whatever it already was, with
      // any list edits already applied to that same object. This is how a panel
      // too irregular to grid survives — and now also how its IO gets fixed.
      if (f.keep) rec[n] = f.keep; else delete rec[n];
      return;
    }
    const s = faceSpec(n);
    rec[n] = { elements: s.elements, ...(s.labels.length ? { labels: s.labels } : {}) };
  });
  // A device with nothing on either face is a labelled block, and an explicitly
  // empty elements array is how this library says exactly that.
  if (!rec.front && !rec.rear) rec.front = { elements: [] };
  return rec;
}

// Through renderDevice, the same path the rack draws with. It already handles
// every shape a face can be — hand-placed elements, an `auto` list, half width,
// ears, or nothing at all — which the preview must too now that editing can
// leave a face as the `auto` declaration it arrived as.
function renderDraftPreview() {
  const box = $('#addPreview');
  box.innerHTML = '';
  const rec = draftRecord();
  box.appendChild(renderDevice(rec, draftFace, null,
    draft.width === 'half-ears' ? { ears: 'left' } : {}));
}

// --- the grid ---------------------------------------------------------------
function placeCell(i, value) {
  const f = faceOf();
  const before = JSON.stringify(f.cells[i] ?? null);
  f.cells[i] = value;
  if (JSON.stringify(value ?? null) === before) return;
  paintCell(i);
  renderDraftPreview();
}

function cellFace(cell) {
  if (!cell) return { txt: '', cls: '', title: 'empty' };
  if (cell.text) return { txt: cell.text.slice(0, 8), cls: ' on text', title: `Label: ${cell.text}` };
  return {
    txt: cell.lbl || shortCode(cell.t),
    cls: ' on',
    title: cell.lbl ? `${typeLabel(cell.t)} — "${cell.lbl}"` : typeLabel(cell.t),
  };
}

function paintCell(i) {
  const el = $(`#addGrid .pcell[data-i="${i}"]`);
  if (!el) return;
  const cell = faceOf().cells[i];
  const { txt, cls, title } = cellFace(cell);
  el.className = 'pcell' + cls + (txt.length > 4 ? ' long' : '')
    + (draftSel === i ? ' sel' : '');
  el.textContent = txt;
  el.title = title;
}

function renderDraftGrid() {
  const f = faceOf();
  const grid = $('#addGrid');
  grid.style.gridTemplateColumns = `repeat(${f.cols}, 1fr)`;
  grid.innerHTML = '';
  for (let i = 0; i < cellCount(f); i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pcell';
    b.dataset.i = i;
    b.oncontextmenu = (e) => { e.preventDefault(); placeCell(i, null); selectCell(null); };
    b.onpointerdown = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const cur = f.cells[i];
      // A filled cell you press again is one you want to look at, not overwrite.
      if (cur && !e.shiftKey) { selectCell(i); return; }
      if (e.shiftKey && draftAnchor != null) {
        const [a, z] = [draftAnchor, i].sort((m, n) => m - n);
        for (let k = a; k <= z; k++) placeCell(k, newCell());
        return;
      }
      draftPaint = { active: true, value: newCell() };
      draftAnchor = i;
      placeCell(i, draftPaint.value);
      selectCell(i);
    };
    b.onpointerenter = () => {
      if (draftPaint.active) placeCell(i, newCell());
    };
    grid.appendChild(b);
    paintCell(i);
  }
}

// A fresh cell of whatever the brush currently is. Labels carry their own text,
// so each one is its own object rather than a shared reference.
function newCell() {
  if (draftBrush === '__text') {
    const t = $('#addText').value.trim();
    return t ? { text: t } : null;
  }
  return { t: draftBrush };
}

// --- the socket list --------------------------------------------------------
// The grid can only draw a face that sits on a uniform grid, and most of this
// library does not — 208 of 220 hand-placed faces and every `auto` face are
// kept as they are. Without a second way in, their IO could not be corrected at
// all, which is most of the reason you would open this dialog.
//
// So the list edits whatever shape the face actually has:
//   cells     the grid's own cells, when the face is grid-backed
//   auto      an `auto` declaration list — order IS panel order
//   elements  hand-placed elements, positions untouched
// A run declared as `n: 8, gap: 58` stays one row with a count, so editing it
// keeps the source's shape instead of exploding into eight separate elements.
const KNOWN_CONN = new Set(CONNECTOR_TYPES.map(([v]) => v));

function faceShape(name) {
  const f = draft[name];
  if (f.keep && Array.isArray(f.keep.elements)) return 'elements';
  if (f.keep && f.keep.auto) return 'auto';
  return 'cells';
}

// Every editable entry on a face, as a uniform row the list can render.
function faceEntries(name) {
  const f = draft[name];
  const kind = faceShape(name);
  if (kind === 'auto') {
    return f.keep.auto.map((e, i) => ({ i, kind, t: e.t, n: e.n || 1, lbl: e.lbl, ref: e }));
  }
  if (kind === 'elements') {
    const out = f.keep.elements.map((e, i) => ({ i, kind, t: e.t, n: e.n || 1, lbl: e.lbl, ref: e }));
    (f.keep.labels || []).forEach((l, i) =>
      out.push({ i, kind: 'label', text: l.text, ref: l }));
    return out;
  }
  const out = [];
  (f.cells || []).forEach((c, i) => {
    if (!c) return;
    if (c.text) out.push({ i, kind: 'label', text: c.text, ref: c });
    else out.push({ i, kind, t: c.t, n: 1, lbl: c.lbl, ref: c });
  });
  return out;
}

// A change that alters the SHAPE of the list — a type swapped, a row added,
// removed or moved. Rebuilds everything, which is fine because all of those
// come from a click rather than from typing.
function ioChanged() {
  if (faceShape(draftFace) === 'cells') renderDraftGrid();
  renderIOList(); refreshFaceNote(); renderDraftPreview();
}

// A change made WHILE TYPING — a socket name, a count. Deliberately does not
// call renderIOList(): that rebuilds every row including the input under the
// cursor, so the field is destroyed and refocused between keystrokes and you
// get one character per click. Everything a keystroke can affect is updated
// directly instead.
function ioTyped(e) {
  if (faceShape(draftFace) === 'cells') paintCell(e.i);
  renderDraftPreview();
  const foot = $('#addIoTotal');
  if (foot) foot.textContent = ioTotalText();
}

function ioTotalText() {
  const total = faceEntries(draftFace).filter((e) => e.kind !== 'label')
    .reduce((a, e) => a + (e.n || 1), 0);
  return `${total} socket${total === 1 ? '' : 's'} on this face.`;
}

function addEntry() {
  const f = faceOf();
  const kind = faceShape(draftFace);
  if (kind === 'auto') { f.keep.auto.push({ t: draftBrush === '__text' ? 'xlrf' : draftBrush, n: 1 }); }
  else if (kind === 'elements') {
    // A hand-placed face has no free cell to drop into, so a new socket lands
    // just right of the rightmost thing on the busiest row, at that row's own
    // pitch. It is a guess about position and only about position — say so.
    const els = f.keep.elements;
    const last = els.reduce((a, b) => (b.x + (b.n || 1) * (b.gap || 0) > a.x + (a.n || 1) * (a.gap || 0) ? b : a),
      els[0] || { x: FACE_L, y: draft.ru * U / 2, n: 1, gap: 0 });
    const pitch = last.gap || 70;
    els.push({ t: draftBrush === '__text' ? 'xlrf' : draftBrush,
               x: Math.min(FACE_R - 20, last.x + ((last.n || 1) - 1) * (last.gap || 0) + pitch),
               y: last.y, n: 1 });
    toast('Added at the end of that row — check where it landed.');
  } else {
    const i = (f.cells || []).findIndex((c, k) => !c && k < cellCount(f));
    if (i < 0) { toast('No free cell on this face — add a row or column.', true); return; }
    f.cells[i] = newCell() || { t: 'xlrf' };
  }
  ioChanged();
}

function removeEntry(e) {
  const f = faceOf();
  if (e.kind === 'cells') f.cells[e.i] = null;
  else if (e.kind === 'label' && faceShape(draftFace) === 'cells') f.cells[e.i] = null;
  else if (e.kind === 'label') f.keep.labels.splice(e.i, 1);
  else if (e.kind === 'auto') f.keep.auto.splice(e.i, 1);
  else f.keep.elements.splice(e.i, 1);
  draftSel = null; selectCell(null);
  ioChanged();
}

// Order is meaningful on an `auto` face — autoLayout flows the list left to
// right as seen from behind — so moving a row moves the socket on the panel.
function moveEntry(e, dir) {
  const f = faceOf();
  const arr = e.kind === 'auto' ? f.keep.auto
    : e.kind === 'elements' ? f.keep.elements : null;
  if (!arr) {                       // grid-backed: swap the two cells
    const cells = f.cells, from = e.i;
    let to = from + dir;
    while (to >= 0 && to < cellCount(f) && !cells[to]) to += dir;
    if (to < 0 || to >= cellCount(f)) return;
    [cells[from], cells[to]] = [cells[to], cells[from]];
    ioChanged(); return;
  }
  const to = e.i + dir;
  if (to < 0 || to >= arr.length) return;
  [arr[e.i], arr[to]] = [arr[to], arr[e.i]];
  ioChanged();
}

function renderIOList() {
  const box = $('#addList');
  if (draftMode !== 'list') { box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = '';

  const kind = faceShape(draftFace);
  const entries = faceEntries(draftFace);

  const head = document.createElement('p');
  head.className = 'hint';
  head.textContent = kind === 'auto'
    ? 'Generated layout — the order here is the order across the panel, left to '
      + 'right as seen from behind the rack.'
    : kind === 'elements'
      ? 'Hand-placed panel. Types, counts and names are editable; the positions '
        + 'are the ones the drawing was made with and are left alone.'
      : 'Every socket placed on the grid.';
  box.appendChild(head);

  if (!entries.length) {
    const p = document.createElement('p');
    p.className = 'libempty';
    p.textContent = 'Nothing on this face yet.';
    box.appendChild(p);
  }

  entries.forEach((e) => {
    const row = document.createElement('div');
    row.className = 'iorow';

    if (e.kind === 'label') {
      row.innerHTML = '<span class="iotag">TEXT</span>';
      const t = document.createElement('input');
      t.value = e.text; t.className = 'ioname';
      t.oninput = () => { e.ref.text = t.value; renderDraftPreview(); };
      row.appendChild(t);
    } else if (!KNOWN_CONN.has(e.t)) {
      // Something this editor does not own — an option-card slot is the case
      // that exists today. A <select> of connector types has no entry for it,
      // so it renders showing 'XLR female' and one stray click turns a card
      // aperture into an XLR. Shown as what it is, and left alone.
      const slot = (draft.base && draft.base.slots || [])
        .find((s) => s.id === e.ref.slot);
      const what = e.t === 'slot'
        ? `SLOT · ${slot ? slot.name : (e.ref.slot || '?')}`
        : String(e.t).toUpperCase();
      row.innerHTML = `<span class="iotag lock">${esc(what)}</span>`
        + '<span class="lockmsg">not editable here</span>';
    } else {
      const sel = document.createElement('select');
      CONNECTOR_TYPES.forEach(([v, label]) => {
        const o = document.createElement('option');
        o.value = v; o.textContent = label; o.selected = v === e.t;
        sel.appendChild(o);
      });
      sel.onchange = () => { e.ref.t = sel.value; ioChanged(); };
      row.appendChild(sel);

      // A count only means anything where one declaration stands for a run.
      if (kind !== 'cells') {
        const n = document.createElement('input');
        n.type = 'number'; n.min = '1'; n.max = '64'; n.value = e.n; n.className = 'ion';
        n.title = 'How many';
        n.oninput = () => {
          const v = Math.max(1, Math.min(64, +n.value || 1));
          if (v === 1) delete e.ref.n; else e.ref.n = v;
          if (kind === 'elements' && v > 1 && !e.ref.gap) e.ref.gap = 70;
          e.n = v;
          ioTyped(e);
        };
        row.appendChild(n);
      }

      const nm = document.createElement('input');
      nm.className = 'ioname';
      nm.placeholder = 'name, e.g. AES50 A';
      nm.value = Array.isArray(e.lbl) ? e.lbl.join(', ') : (e.lbl || '');
      nm.title = 'One name, or a comma-separated list to name each socket';
      nm.oninput = () => {
        const v = nm.value.trim();
        if (!v) delete e.ref.lbl;
        else e.ref.lbl = v.includes(',') ? v.split(',').map((s) => s.trim()) : v;
        e.lbl = e.ref.lbl;
        ioTyped(e);
      };
      row.appendChild(nm);
    }

    const up = document.createElement('button');
    up.type = 'button'; up.className = 'iomove'; up.textContent = '↑';
    up.title = 'Move earlier'; up.onclick = () => moveEntry(e, -1);
    const dn = document.createElement('button');
    dn.type = 'button'; dn.className = 'iomove'; dn.textContent = '↓';
    dn.title = 'Move later'; dn.onclick = () => moveEntry(e, 1);
    const rm = document.createElement('button');
    rm.type = 'button'; rm.className = 'iodel'; rm.textContent = '×';
    rm.title = 'Remove'; rm.onclick = () => removeEntry(e);
    row.append(up, dn, rm);
    box.appendChild(row);
  });

  const add = document.createElement('button');
  add.type = 'button'; add.className = 'btn sm';
  add.textContent = '+ Add socket';
  add.onclick = addEntry;
  box.appendChild(add);

  const foot = document.createElement('p');
  foot.className = 'hint';
  foot.id = 'addIoTotal';
  foot.textContent = ioTotalText();
  box.appendChild(foot);
}

// --- selected cell ----------------------------------------------------------
// Selecting a socket and naming it is the whole point of the exercise: an
// etherCON on an A&H box is 'AES50', on a Yamaha it is 'Dante', and a drawing
// that just says 'EC 1' has thrown that away.
function selectCell(i) {
  const prev = draftSel;
  draftSel = i;
  if (prev != null) paintCell(prev);
  if (i != null) paintCell(i);
  const box = $('#addSel');
  const cell = i == null ? null : faceOf().cells[i];
  if (!cell) { box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  if (cell.text) {
    box.innerHTML = '<label>Label text<input id="selText"></label>'
      + '<div class="row btns"><button type="button" class="btn sm danger" id="selDel">Remove</button></div>';
    const inp = $('#selText', box);
    inp.value = cell.text;
    inp.oninput = () => { cell.text = inp.value; paintCell(i); renderDraftPreview(); };
  } else {
    box.innerHTML = `<p class="selwhat">${esc(typeLabel(cell.t))}</p>`
      + '<label>Socket name<input id="selName" placeholder="e.g. AES50 A"></label>'
      + '<p class="hint">What the panel actually calls it. Blank uses the '
      + 'connector\'s own short code.</p>'
      + '<div class="row btns"><button type="button" class="btn sm danger" id="selDel">Remove</button></div>';
    const inp = $('#selName', box);
    inp.value = cell.lbl || '';
    inp.oninput = () => {
      const v = inp.value.trim();
      if (v) cell.lbl = v; else delete cell.lbl;
      paintCell(i); renderDraftPreview();
    };
  }
  $('#selDel', box).onclick = () => { placeCell(i, null); selectCell(null); };
}

// --- wiring -----------------------------------------------------------------
addEventListener('pointerup', () => { draftPaint.active = false; });

function syncDraftFromForm() {
  const f = $('#formAdd');
  draft.brand = f.brand.value.trim();
  draft.model = f.model.value.trim();
  draft.category = f.category.value;
  draft.ru = Math.max(1, Math.min(20, +f.ru.value || 1));
  draft.width = f.width.value;
  draft.depth = +f.depth.value || 0;
  draft.weight = +f.weight.value || 0;
  draft.power = +f.power.value || 0;
}

function rebuildGridOpts() {
  const f = faceOf();
  const rowSel = $('#addRows'), colSel = $('#addCols');
  const opt = (sel, v, label, on) => {
    const o = document.createElement('option');
    o.value = v; o.textContent = label; o.selected = on;
    sel.appendChild(o);
  };
  rowSel.innerHTML = '';
  // Rows are capped at 2 per U: a connector is 24-46 mm tall and a rack unit is
  // 44.45, so three rows in 1U is not a panel anybody could build.
  const maxRows = Math.max(1, draft.ru * 2);
  for (let n = 1; n <= maxRows; n++) opt(rowSel, n, n === 1 ? '1 (centred)' : n, n === f.rows);
  colSel.innerHTML = '';
  [2, 3, 4, 6, 8, 10, 12, 16, 20, 24].forEach((n) => opt(colSel, n, n, n === f.cols));
}

// Resizing keeps whatever cells still land in the new grid, the same rule the
// patch editor follows — silently dropping someone's work is not on.
function resizeFace(rows, cols) {
  const f = faceOf();
  const next = new Array(rows * cols).fill(null);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r < f.rows && c < f.cols) next[r * cols + c] = f.cells[r * f.cols + c] ?? null;
    }
  }
  f.rows = rows; f.cols = cols; f.cells = next;
  draftSel = null; draftAnchor = null;
  selectCell(null); renderDraftGrid(); renderDraftPreview();
}

function refreshFaceNote() {
  const other = draftFace === 'front' ? 'rear' : 'front';
  $('#addFaceNote').textContent = faceUsed(other)
    ? `${other} face has ${draft[other].cells.filter(Boolean).length} placed`
    : `${other} face empty`;

  // A face this editor could not read back onto a grid — a hand-placed drawing
  // at irregular pitch, or an `auto` declaration with no positions at all. It
  // is left exactly as it was unless you draw over it, and this says so rather
  // than presenting an empty grid that looks like the device has no panel.
  const keep = faceOf().keep;
  const warn = $('#addKeep');
  warn.hidden = !keep || faceUsed(draftFace) || draftMode !== 'grid';
  if (!warn.hidden) {
    const kind = Array.isArray(keep.elements) ? 'hand-placed drawing' : 'generated auto layout';
    warn.textContent = `This ${draftFace} is a ${kind} that does not sit on a `
      + `uniform grid, so the grid is empty and the panel is kept exactly as it `
      + `is. Use List to correct its sockets. Place anything here and you `
      + `replace the whole face.`;
  }
  // The grid cannot show a preserved face, so List is where the work happens.
  $('#addGrid').hidden = draftMode !== 'grid';
  $('#addGridHint').hidden = draftMode !== 'grid';
  $$('#addMode button').forEach((b) => b.classList.toggle('on', b.dataset.mode === draftMode));
  renderIOList();
}

function openDraft(existing = null) {
  const catSel = $('#addCat');
  catSel.innerHTML = '';
  Object.entries(CATEGORIES).forEach(([k, v]) => {
    const o = document.createElement('option');
    o.value = k; o.textContent = v;
    catSel.appendChild(o);
  });

  const tSel = $('#addType');
  tSel.innerHTML = '';
  const txt = document.createElement('option');
  txt.value = '__text'; txt.textContent = 'Text label';
  tSel.appendChild(txt);
  CONNECTOR_GROUPS.forEach(([name, list]) => {
    const og = document.createElement('optgroup');
    og.label = name;
    list.forEach(([v, label]) => {
      const o = document.createElement('option');
      o.value = v; o.textContent = label; o.selected = v === draftBrush;
      og.appendChild(o);
    });
    tSel.appendChild(og);
  });

  $('#formAdd').reset();
  // AFTER the reset, not before: reset() restores every control to its default,
  // and with no option carrying a `selected` attribute that is the first one —
  // which would silently arm the text-label brush every time the dialog opened.
  tSel.value = draftBrush;

  const width = existing && existing.half
    ? (existing.ears ? 'half-ears' : 'half') : 'full';
  draft = existing ? {
    base: existing,
    brand: existing.brand, model: existing.model,
    category: existing.category || 'audio',
    ru: existing.ru || 1, width,
    depth: existing.depth || 0, weight: existing.weight || 0, power: existing.power || 0,
    // `keep` is CLONED. It would otherwise be the live object out of
    // SEED_DEVICES, and editing its IO would rewrite the library in memory for
    // the rest of the session — including for projects that never asked.
    front: gridFromSpec(existing.front, existing.ru || 1, width)
      || { ...BLANK_FACE(), keep: clone(existing.front) },
    rear: gridFromSpec(existing.rear, existing.ru || 1, width)
      || { ...BLANK_FACE(), keep: clone(existing.rear) },
  } : {
    base: null,
    brand: '', model: '', category: 'audio', ru: 1, width: 'full',
    depth: 250, weight: 3, power: 30,
    front: BLANK_FACE(), rear: BLANK_FACE(),
  };

  const form = $('#formAdd');
  form.brand.value = draft.brand; form.model.value = draft.model;
  form.ru.value = draft.ru; form.width.value = draft.width;
  form.category.value = draft.category;
  form.depth.value = draft.depth;
  form.weight.value = draft.weight;
  form.power.value = draft.power;

  $('#addTitle').textContent = existing ? 'Edit device' : 'New device';
  $('#addOk').textContent = existing ? 'Save changes' : 'Add to library';
  $('#addOrigin').hidden = !(existing && isSeed(existing.id));
  $('#addRevert').hidden = !(existing && isEdited(existing.id));

  draftFace = 'front'; draftSel = null; draftAnchor = null;
  $$('#addFace button').forEach((b) => b.classList.toggle('on', b.dataset.face === 'front'));
  $('#addTextWrap').hidden = draftBrush !== '__text';
  rebuildGridOpts();
  renderDraftGrid();
  selectCell(null);
  refreshFaceNote();
  renderDraftPreview();
  dlgAdd.showModal();
}

$('#btnAdd').onclick = () => openDraft();

// Correct a device from wherever you noticed the problem — usually while
// looking at it in a rack rather than at the library list.
function editDevice(id) {
  const d = devById(id);
  if (d) openDraft(d);
}

$$('#addFace button').forEach((b) => {
  b.onclick = () => {
    draftFace = b.dataset.face;
    $$('#addFace button').forEach((x) => x.classList.toggle('on', x === b));
    draftSel = null; draftAnchor = null;
    rebuildGridOpts(); renderDraftGrid(); selectCell(null);
    refreshFaceNote(); renderDraftPreview();
  };
});

$$('#addMode button').forEach((b) => {
  b.onclick = () => { draftMode = b.dataset.mode; refreshFaceNote(); };
});

$('#addRows').onchange = () => resizeFace(+$('#addRows').value, faceOf().cols);
$('#addCols').onchange = () => resizeFace(faceOf().rows, +$('#addCols').value);
$('#addType').onchange = () => {
  draftBrush = $('#addType').value;
  $('#addTextWrap').hidden = draftBrush !== '__text';
};
$('#addClearFace').onclick = () => {
  faceOf().cells = new Array(cellCount(faceOf())).fill(null);
  draftSel = null; selectCell(null); renderDraftGrid();
  refreshFaceNote(); renderDraftPreview();
};

$('#formAdd').oninput = (e) => {
  // Everything below is inside the form, so its input events bubble to here.
  // The panes that own their own updating have to be excluded or this handler
  // re-renders them mid-keystroke — which is exactly how the socket-name field
  // ended up destroying and replacing itself after every character typed.
  if (e.target.closest('#addSel') || e.target.closest('#addList')
      || e.target.id === 'addText') return;
  const ru = draft.ru, width = draft.width;
  syncDraftFromForm();
  // Height and width change what a cell means, so the grid has to be re-laid.
  if (draft.ru !== ru || draft.width !== width) { rebuildGridOpts(); renderDraftGrid(); }
  refreshFaceNote(); renderDraftPreview();
};

// Cancel must not be a submit button: the form has `required` fields, so
// submitting fires HTML5 validation and the dialog refuses to close.
$('#addCancel').onclick = () => dlgAdd.close();

// The point of the JSON is that it travels: paste it into another builder's
// Find specs box, or straight into devices.js to make it part of the library
// everybody gets.
$('#addCopy').onclick = async () => {
  const rec = draftRecord();
  delete rec.id;          // the library assigns its own; a copied one collides
  const text = JSON.stringify(rec, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    toast('Device JSON copied — paste it into Find specs, or into devices.js.');
  } catch {
    // Clipboard needs a permission that a file:// page does not always have.
    $('#findSnippet').textContent = text;
    toast('Clipboard blocked — the JSON is in the Find specs box.', true);
  }
};

// Commit on the button rather than the dialog's `close` event — `close` does not
// fire reliably across browsers, and a silently dropped device is a bad failure.
$('#addOk').onclick = () => {
  const f = $('#formAdd');
  if (!f.reportValidity()) return;
  const rec = draftRecord();
  if (!draft.base) {
    state.project.custom.push(rec);
  } else if (isSeed(rec.id)) {
    // A library device is never mutated in place — devices.js is the shared
    // truth and this project has no business rewriting it. The correction is
    // stored against the id and applied on read.
    edits()[rec.id] = rec;
    toast(`${rec.brand} ${rec.model} corrected for this project. `
      + 'Copy JSON into devices.js to make it everybody\'s.');
  } else {
    const i = state.project.custom.findIndex((c) => c.id === rec.id);
    if (i >= 0) state.project.custom[i] = rec; else state.project.custom.push(rec);
  }
  save(); renderAll(); renderLib();
  dlgAdd.close();
};

// Drop the correction and go back to whatever devices.js says.
$('#addRevert').onclick = () => {
  if (!draft.base) return;
  delete edits()[draft.base.id];
  save(); renderAll(); renderLib();
  toast('Reverted to the library version.');
  dlgAdd.close();
};

// ------------------------------------------------------ find-specs form ----
const dlgFind = $('#dlgFind');

$('#btnFind').onclick = () => {
  $('#findSnippet').textContent =
    'Give me a Rack Builder device record for <BRAND> <MODEL> as JSON:\n' +
    '{ "brand", "model", "category" (audio|wireless|network|video|power|accessory),\n' +
    '  "ru", "depth" mm, "weight" kg, "power" W, "half": true for half-rack,\n' +
    '  "front": { "auto": [ {"t":"xlrf","n":8,"lbl":"MIC"}, {"t":"ethercon","n":2} ] },\n' +
    '  "rear":  { "auto": [ ... ] } }\n' +
    'Use only these connector types: ' + CONNECTOR_TYPES.map((c) => c[0]).join(', ') +
    '\nCite the datasheet URL you used for the figures.';
  $('#findHint').textContent =
    'This box also takes a record built with + Device — its Copy JSON button '
    + 'produces exactly this format, so a device drawn on one machine can be '
    + 'pasted straight into another, or into devices.js to reach everybody.';
  $('#findJson').value = '';
  $('#findErr').hidden = true;
  dlgFind.showModal();
};

$('#findCancel').onclick = () => dlgFind.close();

$('#findOk').onclick = () => {
  let list;
  try {
    const raw = JSON.parse($('#findJson').value);
    list = Array.isArray(raw) ? raw : [raw];
    list.forEach((d) => {
      if (!d.brand || !d.model || !d.ru) throw new Error('each record needs brand, model and ru');
    });
  } catch (err) {
    $('#findErr').textContent = 'Could not read that JSON: ' + err.message;
    $('#findErr').hidden = false;
    return;                       // keep the dialog open so the paste isn't lost
  }
  list.forEach((d) => state.project.custom.push({
    id: 'u-' + uid(),
    category: 'audio', depth: 0, weight: 0, power: 0, approx: true,
    ...d,
  }));
  save(); renderLib();
  dlgFind.close();
};

// ------------------------------------------------------------------ boot ---
function renderAll() {
  renderTabs();
  renderRack();
  if (state.view === 'flow') flow.render();
  if (state.view === 'side') renderSide();
  renderInspector();
  renderSummary();
  $('#rackName').value = rack().name;
  $('#rackU').value = rack().ru;
  const solo = state.project.racks.length === 1;
  $('#btnDelRack').disabled = solo;
  $('#btnDelRack').title = solo ? 'A project needs at least one rack' : '';
  resetDelRack();
  const bare = !rack().items.length;
  $('#btnClearRack').disabled = bare;
  $('#btnClearRack').title = bare ? 'This rack is already empty'
    : 'Removes every device from both faces';
  resetClearRack();
  $('#rackW').value = rack().weight ?? '';
  $('#rackD').value = rack().depth ?? '';
}

$('#ver').textContent = 'v' + VERSION;
$('#projName').value = state.project.name;
renderCats();
renderLib();
renderAll();

// Handy from the console: __rb.state, __rb.buildExportSVG(), __rb.library()
window.__rb = { state, library, buildExportSVG, renderAll, save, renderDevice, devById, flow };

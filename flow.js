// ---------------------------------------------------------------------------
// flow.js — the signal-flow canvas.
//
// A node-graph view of the project: every device that carries signal becomes a
// card, every socket on it becomes an addressable port, and a cable is a link
// between two ports. The cable list falls out of the graph rather than being
// typed by hand.
//
// Two things are worth knowing before reading further.
//
// Ports are derived, not authored. Nothing was added to devices.js for this —
// the sockets come from the same `elements` / `auto` panel declarations that
// drive the drawings, so all 160 devices that carry connectors arrive with
// their ports already mapped. The cost is that socket *identity* on an `auto`
// panel is ordinal, not physical: "rear XLRf 12" means the twelfth XLR female
// declared, which is the twelfth one drawn, but the library never claimed that
// is the socket silkscreened 12 on the real unit. Rename any port that matters.
//
// Direction is not in the library. A jack or a BNC does not say whether it is
// an input or an output, and inventing that for 3,205 sockets would be
// guesswork. So a cable's direction is simply the order you drew it: source
// where you started, target where you let go. XLR gender and the in/thru power
// variants do carry direction, and those are shown as a hint on the port row.
// ---------------------------------------------------------------------------

import {
  PATCH_TYPES, shortCode, typeLabel, autoLayout, patchRows, patchCols,
} from './panel.js';

const CONN = new Set(PATCH_TYPES.map(([v]) => v));

// --- signal families -------------------------------------------------------
// Coarser than the connector list and grouped by what actually travels down
// the cable, which is what you want to filter a patch list by. speakON is split
// out from "audio" because a line-level XLR and an amp output are not the same
// hazard, and BNC sits with video because that is what it is carrying most of
// the time in this library — wordclock and RF are the exceptions.
export const FAMILIES = {
  analogue: { label: 'Analogue audio', color: '#8f7fd1' },
  digital:  { label: 'Digital audio',  color: '#7cc45e' },
  aes3:     { label: 'AES3 / AES-EBU', color: '#4fb8c4' },
  speaker:  { label: 'Speaker',        color: '#e0a34a' },
  network:  { label: 'Network',        color: '#35b39a' },
  video:    { label: 'Video / coax',   color: '#5b9bd5' },
  control:  { label: 'Control / USB',  color: '#9aa4b2' },
  multipin: { label: 'Multipin',       color: '#c2803f' },
  power:    { label: 'Power',          color: '#d16b8a' },
};

const FAM_OF = {
  xlrf: 'analogue', xlrm: 'analogue', combo: 'analogue', jack: 'analogue',
  trs: 'analogue', ts: 'analogue',
  minijack: 'analogue', euroblock: 'analogue', rca: 'analogue', dsub: 'analogue',
  toslink: 'digital',
  nl2: 'speaker', nl4: 'speaker', nl8: 'speaker',
  rj45: 'network', ethercon: 'network', opticalcon: 'network',
  sfp: 'network', qsfp: 'network',
  bnc: 'video', hdmi: 'video',
  midi: 'control', usba: 'control', usbb: 'control', usbc: 'control',
  dcjack: 'control',
  socapex_in: 'multipin', socapex_thru: 'multipin',
  veam_in: 'multipin', veam_thru: 'multipin',
};

// AES3 has no connector of its own — it rides on an XLR, or on a BNC as AES3id.
// So it is a property of the *port*, declared with `sig`, not of the connector
// type. Anything that carries a signal the connector alone cannot imply belongs
// here rather than in FAM_OF.
const SIGNALS = new Set(['aes3']);

export const familyOf = (t, sig) =>
  (sig && SIGNALS.has(sig) ? sig : FAM_OF[t]) || 'power';
export const colorOf = (t, sig) => FAMILIES[familyOf(t, sig)].color;

// Where the connector itself settles the question. Everything else is unknown
// and stays unknown — the arrow you drew is the only claim being made.
const GENDER = {
  xlrf: 'in', xlrm: 'out',
  socket_in: 'in', iec_in: 'in', powercon_in: 'in', true1_in: 'in',
  cee16_in: 'in', cee32_1_in: 'in', cee32_3_in: 'in', cee63_1_in: 'in',
  cee125_3_in: 'in', powerlock_in: 'in', socapex_in: 'in', veam_in: 'in',
  bs13a_thru: 'out', socket_thru: 'out', iec_thru: 'out', powercon_thru: 'out',
  true1_thru: 'out', cee16_thru: 'out', cee32_1_thru: 'out',
  cee32_3_thru: 'out', cee63_1_thru: 'out', cee125_3_thru: 'out',
  powerlock_thru: 'out', socapex_thru: 'out', veam_thru: 'out',
};

// --- port enumeration ------------------------------------------------------
// Ports come out in physical reading order: front panel first, then rear, and
// within a panel top-to-bottom then left-to-right. A stacked jack bank
// therefore numbers along the top row and continues on the bottom, which is the
// order autoLayout draws it in.
// A declaration may name its own sockets with `lbl`: a string is used as a
// prefix and numbered when the run is longer than one, an array names each
// socket in turn. This is how a Dante port stops reading as "EC 1" and starts
// reading as "DANTE PRI" — the thing that makes a patch list worth printing.
const declaredName = (e) => {
  if (!e.lbl) return null;
  if (Array.isArray(e.lbl)) return e.lbl[e._i || 0] || null;
  return (e._n || 1) > 1 ? `${e.lbl} ${(e._i || 0) + 1}` : e.lbl;
};

function planePorts(spec, ru, plane, out, tally) {
  if (!spec) return;
  let placed;
  if (spec.elements) {
    placed = [];
    spec.elements.forEach((e) => {
      if (!CONN.has(e.t)) return;
      const n = e.n || 1, gap = e.gap || 0;
      for (let i = 0; i < n; i++) {
        placed.push({ t: e.t, x: e.x + i * gap, y: e.y,
                      lbl: e.lbl, sig: e.sig, _i: i, _n: n });
      }
    });
  } else if (spec.auto) {
    placed = autoLayout(spec.auto, ru).filter((e) => CONN.has(e.t));
  } else return;

  // Band by row so a two-deep bank reads across, not down.
  placed.sort((a, b) => (Math.round(a.y / 40) - Math.round(b.y / 40)) || (a.x - b.x));
  placed.forEach((e) => {
    const ord = (tally[e.t] = (tally[e.t] || 0) + 1);
    const port = { id: `${plane}:${e.t}:${ord}`, t: e.t, plane, ord };
    const name = declaredName(e);
    if (name) port.name = name;
    if (e.sig) port.sig = e.sig;
    out.push(port);
  });
}

// A punched patch panel is the one place where socket identity is real: the
// user put each connector in a specific hole, so ports follow the grid.
function patchPorts(dev, it, out) {
  const cols = patchCols(dev, it), rows = patchRows(dev, it);
  const tally = {};
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const t = it.slots && it.slots[i];
      if (!t || !CONN.has(t)) continue;
      const ord = (tally[t] = (tally[t] || 0) + 1);
      out.push({ id: `slot:${i}`, t, plane: 'front', ord, hole: i });
    }
  }
}

// Every socket on one device instance, in order. `it` may be omitted when all
// that is wanted is the device's own port count.
export function devicePorts(dev, it) {
  if (!dev) return [];
  const out = [];
  if (dev.patch) {
    if (it) patchPorts(dev, it, out);
    return out;
  }
  // A tally per panel, not per device: with two combos on the front and six on
  // the back, the first one on the back is "R CMB 1", not "CMB 3". The plane
  // prefix in the label is what keeps the two runs apart, and the port id
  // carries the plane too, so nothing collides.
  planePorts(dev.front, dev.ru, 'front', out, {});
  planePorts(dev.rear, dev.ru, 'rear', out, {});
  return out;
}

// Both panels populated? Then the plane belongs in the label, because "JK 3"
// on the front and "JK 3" on the back are different holes.
export function portLabel(p, both) {
  // A name the device declared is used verbatim — "DANTE PRI", not "R DANTE PRI".
  if (p.name) return p.name;
  const face = both ? (p.plane === 'rear' ? 'R ' : 'F ') : '';
  return `${face}${shortCode(p.t)} ${p.ord}`;
}

export const portTitle = (p) =>
  `${typeLabel(p.t)} — ${p.plane === 'rear' ? 'rear' : 'front'} panel, no. ${p.ord}`;

// --- geometry --------------------------------------------------------------
// Fixed so port anchor points can be computed rather than measured; the CSS
// below is written against the same numbers.
export const NODE_W = 208;
export const HEAD_H = 38;
export const ROW_H = 17;
export const PAD_B = 8;

export const nodeHeight = (visible) => HEAD_H + visible * ROW_H + PAD_B;
export const rowCY = (i) => HEAD_H + i * ROW_H + ROW_H / 2;

// ---------------------------------------------------------------------------
// The view. `ctx` hands over the bits of app.js the canvas needs rather than
// reaching back into it, so the graph never mutates project state directly
// except through the flow object it owns.
// ---------------------------------------------------------------------------
export function createFlow(ctx) {
  const { state, save, devById, toast, esc, uid } = ctx;
  const $ = (s, r = document) => r.querySelector(s);
  const SVGNS = 'http://www.w3.org/2000/svg';
  const sel = (n, a = {}) => {
    const e = document.createElementNS(SVGNS, n);
    for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };

  // --- persistent slice ----------------------------------------------------
  function flow() {
    const p = state.project;
    p.flow ||= {};
    const f = p.flow;
    f.pos ||= {};        // nodeKey -> {x, y}
    f.ext ||= [];        // external nodes
    f.cables ||= [];     // {id, n, a:{node,port}, b:{node,port}, label}
    f.labels ||= {};     // nodeKey -> portId -> label
    f.open ||= {};       // nodeKey -> bool (port list expanded)
    f.view ||= { x: 40, y: 40, k: 1 };
    f.order ||= {};      // nodeKey -> [portId] when reordered by hand
    f.seq ||= 0;         // last cable number handed out
    return f;
  }

  let nodes = [];                    // rebuilt every render
  let editing = null;                // nodeKey whose ports are being reordered
  const byKey = new Map();
  let selCable = null;
  let matrixOpen = false;
  // "I know, stop telling me" for the split-socket notice. A view preference,
  // so it lives beside the others rather than in the project file.
  const SPLIT_KEY = 'rackbuilder.splitnotice';
  let splitNoticeOff = false;
  try { splitNoticeOff = localStorage.getItem(SPLIT_KEY) === 'off'; } catch { /* ignore */ }
  let filterFam = 'all';
  let matrixQ = '';

  // --- node model ----------------------------------------------------------
  function buildNodes() {
    const f = flow();
    nodes = [];
    state.project.racks.forEach((r) => {
      r.items.forEach((it) => {
        const dev = devById(it.devId);
        if (!dev) return;
        const ports = devicePorts(dev, it);
        // A blank, a vent, a drawer or an empty patch panel carries no signal;
        // putting it on a signal-flow canvas is just clutter.
        if (!ports.length) return;
        const both = ports.some((p) => p.plane === 'front')
                  && ports.some((p) => p.plane === 'rear');
        nodes.push({
          key: it.uid, kind: 'item', ports, both,
          name: it.label || dev.model, sub: dev.brand,
          meta: `${r.name} · ${itLoc(it)}`,
        });
      });
    });
    f.ext.forEach((x) => {
      nodes.push({
        key: x.id, kind: 'ext', ports: x.ports, both: false,
        name: x.name, sub: x.sub || 'External', meta: '',
      });
    });
    byKey.clear();
    nodes.forEach((n) => byKey.set(n.key, n));

    // Anything that lost its device or rack drops its cables with it.
    const live = f.cables.filter((c) => byKey.has(c.a.node) && byKey.has(c.b.node));
    if (live.length !== f.cables.length) f.cables = live;

    nodes.forEach((n, i) => {
      f.pos[n.key] ||= { x: 40 + (i % 6) * (NODE_W + 90), y: 40 + Math.floor(i / 6) * 260 };
      n.pos = f.pos[n.key];
    });
  }

  const itLoc = (it) => (it.plane === 'rear' ? 'rear U' : 'U') + it.u;

  const labelFor = (n, p) =>
    (flow().labels[n.key] || {})[p.id] || portLabel(p, n.both);

  // A hand-set order wins over the declared one. Applied as a sort rather than
  // a replacement so a device whose ports changed since — a repunched patch
  // panel, an edited library entry — keeps its unknown sockets instead of
  // losing them.
  function ordered(n, ports) {
    const ord = flow().order[n.key];
    if (!ord || !ord.length) return ports;
    const at = new Map(ord.map((id, i) => [id, i]));
    return ports.slice().sort((a, b) =>
      (at.has(a.id) ? at.get(a.id) : 1e6) - (at.has(b.id) ? at.get(b.id) : 1e6));
  }

  const isOpen = (n) => {
    const f = flow();
    return f.open[n.key] ?? (n.ports.length <= 14);
  };

  const connectedIds = (key) => {
    const s = new Set();
    flow().cables.forEach((c) => {
      if (c.a.node === key) s.add(c.a.port);
      if (c.b.node === key) s.add(c.b.port);
    });
    return s;
  };

  // How many cables land on one socket. More than one is legal — a Y-split or a
  // passive splitter is a real thing — but it is worth showing, because on
  // paper it looks like a mistake and in the rack it needs hardware.
  function cableCounts(key) {
    const m = new Map();
    const bump = (id) => m.set(id, (m.get(id) || 0) + 1);
    flow().cables.forEach((c) => {
      if (c.a.node === key) bump(c.a.port);
      if (c.b.node === key) bump(c.b.port);
    });
    return m;
  }

  // Which port rows a node is currently showing, and where each sits.
  function visiblePorts(n) {
    // While reordering, every socket is shown — you cannot drag a row into a
    // position that is not on screen.
    if (editing === n.key || isOpen(n)) return ordered(n, n.ports);
    const on = connectedIds(n.key);
    return ordered(n, n.ports.filter((p) => on.has(p.id)));
  }

  function anchor(nodeKey, portId, side) {
    const n = byKey.get(nodeKey);
    if (!n) return null;
    const vis = visiblePorts(n);
    let i = vis.findIndex((p) => p.id === portId);
    // A port hidden by a collapsed node still needs somewhere to land: the
    // wire meets the header, so the connection stays visible as a connection.
    const y = n.pos.y + (i < 0 ? HEAD_H / 2 : rowCY(i));
    return { x: n.pos.x + (side === 'l' ? 0 : NODE_W), y };
  }

  // --- zones ---------------------------------------------------------------
  // One region per rack, drawn behind everything and following its members
  // wherever they are dragged. Without it a two-rack project reads as one pile
  // of cards: the U number in each header tells you where a device lives, but
  // only once you are close enough to read it.
  const ZONE_TINTS = ['#35b39a', '#5b9bd5', '#e0a34a', '#d16b8a', '#8f7fd1', '#7cc45e'];
  const zoneMembers = new Map();   // zone key -> node keys, set by drawZones

  function drawZones() {
    const host = $('#flowZones');
    if (!host) return;
    host.innerHTML = '';
    const f = flow();
    const groups = state.project.racks.map((r, i) => ({
      key: r.id || `rack${i}`, name: r.name,
      tint: ZONE_TINTS[i % ZONE_TINTS.length], keys: r.items.map((it) => it.uid),
    }));
    if (f.ext.length) {
      groups.push({ key: 'ext', name: 'External', ext: true, tint: '#8b9997',
                    keys: f.ext.map((x) => x.id) });
    }
    zoneMembers.clear();
    groups.forEach((g) => zoneMembers.set(g.key, g.keys));

    groups.forEach((g) => {
      const ns = g.keys.map((k) => byKey.get(k)).filter(Boolean);
      if (!ns.length) return;          // a rack of blanks has nothing to fence
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      ns.forEach((n) => {
        x0 = Math.min(x0, n.pos.x); y0 = Math.min(y0, n.pos.y);
        x1 = Math.max(x1, n.pos.x + NODE_W);
        y1 = Math.max(y1, n.pos.y + nodeHeight(visiblePorts(n).length));
      });
      const PAD = 18, CAP = 24;        // CAP leaves room for the title bar
      const d = document.createElement('div');
      d.className = 'fzone' + (g.ext ? ' ext' : '')
        + (zoneDrag && zoneDrag.zone === g.key ? ' moving' : '');
      d.style.cssText = `left:${x0 - PAD}px;top:${y0 - PAD - CAP}px;`
        + `width:${x1 - x0 + PAD * 2}px;height:${y1 - y0 + PAD * 2 + CAP}px;--z:${g.tint}`;
      // The title bar is a handle: drag it and the whole rack moves together.
      // Rearranging a graph a card at a time when what you mean is "this rack
      // goes over there" is the tedious part of tidying up.
      d.innerHTML = `<span class="zgrab" data-zone="${esc(g.key)}"`
        + ` title="Drag to move ${esc(g.name)} — every card in it moves together"`
        + `>${esc(g.name)}</span>`;
      host.appendChild(d);
    });
  }

  // --- wires ---------------------------------------------------------------
  // `bow` lifts the curve off the straight line between its endpoints. Cables
  // that share both endpoints — which happens whenever a node is collapsed and
  // several wires land on its header — would otherwise be drawn exactly on top
  // of one another and read as a single cable.
  // A cable between two sockets on the SAME card would otherwise be drawn
  // straight through the card — leaving from the right edge, arriving at the
  // left, crossing every port row on the way and reading as a cable to some
  // other device. So a self-patch loops out to the right instead, clear of the
  // card, which is what it physically is: a short jumper on one box.
  const SELF_OUT = 74;

  function wirePath(p1, p2, bow = 0, self = false) {
    if (self) {
      const out = SELF_OUT + Math.abs(bow) * 0.6;
      return `M${p1.x},${p1.y} C${p1.x + out},${p1.y} `
        + `${p2.x + out},${p2.y} ${p2.x},${p2.y}`;
    }
    const d = Math.max(46, Math.abs(p2.x - p1.x) * 0.45);
    return `M${p1.x},${p1.y} `
      + `C${p1.x + d},${p1.y + bow} ${p2.x - d},${p2.y + bow} ${p2.x},${p2.y}`;
  }
  // The cubic at t = 0.5, for the number chip.
  const wireMid = (p1, p2, bow = 0, self = false) => {
    if (self) {
      const out = SELF_OUT + Math.abs(bow) * 0.6;
      return { x: (p1.x + 3 * (p1.x + out) + 3 * (p2.x + out) + p2.x) / 8,
               y: (p1.y + 3 * p1.y + 3 * p2.y + p2.y) / 8 };
    }
    const d = Math.max(46, Math.abs(p2.x - p1.x) * 0.45);
    return { x: (p1.x + 3 * (p1.x + d) + 3 * (p2.x - d) + p2.x) / 8,
             y: (p1.y + 3 * (p1.y + bow) + 3 * (p2.y + bow) + p2.y) / 8 };
  };

  // Does the straight-ish run between two points cross a card it does not
  // belong to? Sampling the curve is cheap and exact enough — a cable drawn
  // through the middle of an unrelated device is the single worst thing on a
  // busy canvas, because it reads as a connection to that device.
  function crossings(p1, p2, bow, self, skip) {
    const cards = nodes
      .filter((n) => !skip.has(n.key))
      .map((n) => ({
        x0: n.pos.x - 3, y0: n.pos.y - 3,
        x1: n.pos.x + NODE_W + 3,
        y1: n.pos.y + nodeHeight(visiblePorts(n).length) + 3,
      }));
    if (!cards.length) return 0;
    const d = Math.max(46, Math.abs(p2.x - p1.x) * 0.45);
    const out = SELF_OUT + Math.abs(bow) * 0.6;
    const c1 = self ? { x: p1.x + out, y: p1.y } : { x: p1.x + d, y: p1.y + bow };
    const c2 = self ? { x: p2.x + out, y: p2.y } : { x: p2.x - d, y: p2.y + bow };
    let hits = 0;
    for (let i = 1; i < 16; i++) {
      const t = i / 16, u = 1 - t;
      const x = u * u * u * p1.x + 3 * u * u * t * c1.x
              + 3 * u * t * t * c2.x + t * t * t * p2.x;
      const y = u * u * u * p1.y + 3 * u * u * t * c1.y
              + 3 * u * t * t * c2.y + t * t * t * p2.y;
      if (cards.some((c) => x > c.x0 && x < c.x1 && y > c.y0 && y < c.y1)) hits++;
    }
    return hits;
  }

  // How far each cable is bowed: cables sharing a pair of endpoints fan out
  // symmetrically about the straight run, so a bundle of four reads as four.
  function bowOf(cables) {
    const groups = new Map();
    cables.forEach((c) => {
      const self = c.a.node === c.b.node;
      const a = anchor(c.a.node, c.a.port, 'r');
      const b = anchor(c.b.node, c.b.port, self ? 'r' : 'l');
      if (!a || !b) return;
      const k = `${self ? 'S' : ''}${Math.round(a.x)},${Math.round(a.y)}`
        + `|${Math.round(b.x)},${Math.round(b.y)}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(c.id);
    });
    const bow = new Map();
    groups.forEach((ids) => {
      if (ids.length < 2) { bow.set(ids[0], 0); return; }
      const step = Math.min(26, 90 / ids.length);
      ids.forEach((id, i) => bow.set(id, (i - (ids.length - 1) / 2) * step * 2));
    });

    // Second pass: steer around cards in the way. Both directions are tried at
    // each step and the better one kept, so a cable goes over or under whichever
    // is actually clearer rather than always picking the same way.
    cables.forEach((c) => {
      const self = c.a.node === c.b.node;
      const a = anchor(c.a.node, c.a.port, 'r');
      const b = anchor(c.b.node, c.b.port, self ? 'r' : 'l');
      if (!a || !b) return;
      const skip = new Set([c.a.node, c.b.node]);
      let best = bow.get(c.id) || 0;
      let bestHits = crossings(a, b, best, self, skip);
      if (!bestHits) return;
      for (let step = 40; step <= 320 && bestHits; step += 40) {
        for (const dir of [-1, 1]) {
          const cand = (bow.get(c.id) || 0) + dir * step;
          const hits = crossings(a, b, cand, self, skip);
          if (hits < bestHits) { bestHits = hits; best = cand; }
        }
      }
      bow.set(c.id, best);
    });
    return bow;
  }

  // Chips still collide when unrelated cables happen to cross mid-run, so slide
  // any that land on top of a chip already placed. Walking outward from the
  // midpoint keeps the chip on its own curve rather than floating free of it.
  function placeChip(p1, p2, bow, taken, self = false) {
    const CLEAR = 21;
    // A chip over a card is unreadable and hides a port row, so the node
    // rectangles are obstacles as much as the other chips are.
    const cards = nodes.map((n) => ({
      x0: n.pos.x - 4, y0: n.pos.y - 4,
      x1: n.pos.x + NODE_W + 4,
      y1: n.pos.y + nodeHeight(visiblePorts(n).length) + 4,
    }));
    const overCard = (pt) => cards.some((c) =>
      pt.x > c.x0 && pt.x < c.x1 && pt.y > c.y0 && pt.y < c.y1);

    const ts = [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74, 0.18, 0.82];
    let fallback = null;
    for (const t of ts) {
      const u = 1 - t;
      const d = Math.max(46, Math.abs(p2.x - p1.x) * 0.45);
      const out = SELF_OUT + Math.abs(bow) * 0.6;
      const c1 = self ? { x: p1.x + out, y: p1.y } : { x: p1.x + d, y: p1.y + bow };
      const c2 = self ? { x: p2.x + out, y: p2.y } : { x: p2.x - d, y: p2.y + bow };
      const pt = {
        x: u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x,
        y: u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y,
      };
      if (!fallback) fallback = pt;
      const clash = taken.some((q) =>
        Math.abs(q.x - pt.x) < CLEAR * 1.6 && Math.abs(q.y - pt.y) < CLEAR);
      if (!clash && !overCard(pt)) { taken.push(pt); return pt; }
    }
    // Nowhere clean on the curve — take the midpoint rather than drop the
    // number, because an unnumbered cable is worse than a crowded one.
    taken.push(fallback);
    return fallback;
  }

  function drawWires() {
    const svg = $('#flowWires');
    if (!svg) return;
    svg.innerHTML = '';
    const f = flow();
    // The wire layer covers the graph's real bounding box rather than a box
    // anchored at the origin. Nodes can sit at negative coordinates — `arrange`
    // puts the external group above y=0, and dragging is unbounded — and a
    // viewport starting at 0,0 would leave those cables outside it, relying on
    // overflow:visible to paint them and hoping they stayed clickable.
    // A viewBox at the same origin keeps path data in world coordinates.
    const PADW = 80;
    let x0 = 0, y0 = 0, x1 = 600, y1 = 400;
    nodes.forEach((n) => {
      x0 = Math.min(x0, n.pos.x - PADW);
      y0 = Math.min(y0, n.pos.y - PADW);
      x1 = Math.max(x1, n.pos.x + NODE_W + PADW);
      y1 = Math.max(y1, n.pos.y + nodeHeight(visiblePorts(n).length) + PADW);
    });
    svg.setAttribute('width', x1 - x0);
    svg.setAttribute('height', y1 - y0);
    svg.setAttribute('viewBox', `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
    svg.style.left = x0 + 'px';
    svg.style.top = y0 + 'px';

    const bows = bowOf(f.cables);
    const chips = [];
    f.cables.forEach((c) => {
      const self = c.a.node === c.b.node;
      const a = anchor(c.a.node, c.a.port, 'r');
      const b = anchor(c.b.node, c.b.port, self ? 'r' : 'l');
      if (!a || !b) return;
      const bow = bows.get(c.id) || 0;
      const col = FAMILIES[c.fam] ? FAMILIES[c.fam].color : '#888';
      const on = selCable === c.id;
      const g = sel('g', { class: 'wire' + (on ? ' on' : ''), 'data-cable': c.id });
      g.appendChild(sel('path', { d: wirePath(a, b, bow, self), class: 'hit' }));
      g.appendChild(sel('path', {
        d: wirePath(a, b, bow, self), stroke: col, fill: 'none',
        'stroke-width': on ? 3 : 1.8, 'stroke-linecap': 'round',
      }));
      const m = placeChip(a, b, bow, chips, self);
      g.appendChild(sel('rect', {
        x: m.x - 11, y: m.y - 8, width: 22, height: 16, rx: 4,
        fill: col, class: 'chip',
      }));
      const t = sel('text', {
        x: m.x, y: m.y + 4, 'text-anchor': 'middle', class: 'chipn',
      });
      t.textContent = c.n;
      g.appendChild(t);
      g.onclick = (e) => { e.stopPropagation(); selCable = c.id; render(); };
      svg.appendChild(g);
    });
  }

  // --- render --------------------------------------------------------------
  function render() {
    const world = $('#flowWorld');
    if (!world) return;
    buildNodes();
    [...world.querySelectorAll('.fnode')].forEach((e) => e.remove());

    const f = flow();
    nodes.forEach((n) => {
      const vis = visiblePorts(n);
      const open = isOpen(n);
      const on = connectedIds(n.key);
      const d = document.createElement('div');
      d.className = 'fnode' + (n.kind === 'ext' ? ' ext' : '');
      d.style.left = n.pos.x + 'px';
      d.style.top = n.pos.y + 'px';
      d.style.width = NODE_W + 'px';
      d.dataset.node = n.key;

      const hidden = n.ports.length - vis.length;
      d.innerHTML =
        `<header class="fhead" title="${esc(n.sub)} ${esc(n.name)} — drag to move">`
        + `<b>${esc(n.name)}</b>`
        + `<span>${esc(n.sub)}${n.meta ? ' · ' + esc(n.meta) : ''}</span>`
        + `<button type="button" class="fedit" title="${editing === n.key
             ? 'Done reordering' : 'Reorder sockets'}">`
        + `${editing === n.key ? 'done' : 'edit'}</button>`
        + (n.kind === 'ext'
            ? `<button type="button" class="fkill" title="Remove this node">&times;</button>`
            : '')
        + `</header>`
        + `<div class="fports"></div>`
        // A big device opens collapsed, and with nothing patched yet that means
        // no rows at all — so the button has to say what it is hiding, not just
        // "more".
        + (hidden > 0 || !open
            ? `<button type="button" class="fmore">${
                open ? 'Hide unused'
                : vis.length ? `${hidden} more socket${hidden === 1 ? '' : 's'}`
                : `Show ${n.ports.length} sockets`}</button>`
            : '');

      const counts = cableCounts(n.key);
      const editMode = editing === n.key;
      if (editMode) d.classList.add('editing');
      const list = d.querySelector('.fports');
      vis.forEach((p) => {
        const row = document.createElement('div');
        const nCables = counts.get(p.id) || 0;
        row.className = 'prow' + (on.has(p.id) ? ' used' : '')
          + (isPicked(n.key, p.id) ? ' picked' : '')
          + (editMode ? ' reorder' : '')
          + (nCables > 1 ? ' split' : '');
        row.dataset.node = n.key;
        row.dataset.port = p.id;
        row.title = portTitle(p);
        const g = GENDER[p.t];
        row.innerHTML = (editMode ? `<i class="pgrip" aria-hidden="true"></i>` : '')
          + (editMode ? '' : `<i class="pa l" data-side="l"></i>`)
          + `<span class="pdot" style="background:${colorOf(p.t, p.sig)}"></span>`
          + `<span class="plab">${esc(labelFor(n, p))}</span>`
          + (nCables > 1
              ? `<span class="psplit" title="${nCables} cables on this socket `
                + `— needs a Y-split or a passive splitter">${nCables}</span>`
              : '')
          + (g ? `<span class="pdir ${g}">${g}</span>` : '')
          + (editMode ? '' : `<i class="pa r" data-side="r"></i>`);
        list.appendChild(row);
      });

      const edit = d.querySelector('.fedit');
      if (edit) edit.onclick = (e) => {
        e.stopPropagation();
        editing = editing === n.key ? null : n.key;
        clearPick(false);
        render();
        if (editing) {
          toast('Drag sockets to reorder. The order is saved with the project.');
        }
      };

      // The header is the drag handle; a click on the "n more" button toggles.
      const more = d.querySelector('.fmore');
      if (more) more.onclick = (e) => {
        e.stopPropagation();
        f.open[n.key] = !isOpen(n);
        save(); render();
      };
      world.appendChild(d);
    });

    drawZones();
    drawWires();
    applyView();
    renderMatrix();
  }

  // --- pan / zoom ----------------------------------------------------------
  function applyView() {
    const f = flow(), w = $('#flowWorld');
    if (w) w.style.transform = `translate(${f.view.x}px, ${f.view.y}px) scale(${f.view.k})`;
    const btn = $('#fFit');
    if (btn) btn.textContent = Math.abs(f.view.k - 1) < 0.01
      ? 'Fit' : Math.round(f.view.k * 100) + '%';
  }

  function zoomAt(cx, cy, k2) {
    const f = flow();
    const k1 = f.view.k;
    k2 = Math.min(2.5, Math.max(0.2, k2));
    // Keep the point under the cursor fixed.
    f.view.x = cx - ((cx - f.view.x) / k1) * k2;
    f.view.y = cy - ((cy - f.view.y) / k1) * k2;
    f.view.k = k2;
    applyView(); save();
  }

  function fit() {
    const host = $('#flowView');
    if (!host || !nodes.length) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    nodes.forEach((n) => {
      x0 = Math.min(x0, n.pos.x); y0 = Math.min(y0, n.pos.y);
      x1 = Math.max(x1, n.pos.x + NODE_W);
      y1 = Math.max(y1, n.pos.y + nodeHeight(visiblePorts(n).length));
    });
    const r = host.getBoundingClientRect();
    // The matrix floats over the canvas, so fitting to the full width would
    // centre the graph underneath it. Fit to what is actually still visible.
    const box = $('#flowMatrix');
    const cover = matrixOpen && box ? box.getBoundingClientRect().width + 24 : 0;
    const usable = Math.max(200, r.width - cover);
    // Never fit *up*: a graph small enough to zoom past 1:1 should sit at its
    // natural size in the middle, not blown up to fill the window.
    const k = Math.min(1, Math.max(0.2,
      Math.min((usable - 80) / (x1 - x0), (r.height - 80) / (y1 - y0))));
    const f = flow();
    f.view.k = k;
    f.view.x = (usable - (x1 - x0) * k) / 2 - x0 * k;
    f.view.y = (r.height - (y1 - y0) * k) / 2 - y0 * k;
    applyView(); save();
  }

  // Lay the graph out by rack, one column per rack in rack order, so the
  // canvas opens looking like the project rather than a pile.
  function arrange() {
    const f = flow();
    let col = 0;
    const place = (keys) => {
      let y = 40;
      keys.forEach((k) => {
        const n = byKey.get(k);
        if (!n) return;
        f.pos[k] = { x: 40 + col * (NODE_W + 130), y };
        n.pos = f.pos[k];
        y += nodeHeight(visiblePorts(n).length) + 34;
      });
      col++;
    };
    if (f.ext.length) place(f.ext.map((x) => x.id));
    state.project.racks.forEach((r) => place(r.items.map((it) => it.uid)));
    save(); render(); fit();
  }

  // --- selecting a run of sockets ------------------------------------------
  // Patching a 32-way stagebox one drag at a time is the job nobody wants. So a
  // run of sockets can be picked first — click one, shift-click another on the
  // same node — and a single drag then patches the whole run, socket for socket,
  // onto consecutive sockets from wherever it is dropped.
  let pick = { node: null, ids: [] };

  const isPicked = (nodeKey, portId) =>
    pick.node === nodeKey && pick.ids.includes(portId);

  function clearPick(redraw = true) {
    if (!pick.ids.length) return;
    pick = { node: null, ids: [] };
    if (redraw) render();
  }

  // Shift extends over the sockets as they are shown, not as they are declared:
  // what you see between the two you clicked is what you get.
  function pickPort(nodeKey, portId, extend) {
    const n = byKey.get(nodeKey);
    if (!n) return;
    const vis = visiblePorts(n).map((p) => p.id);
    if (!extend || pick.node !== nodeKey || !pick.ids.length) {
      pick = { node: nodeKey, ids: [portId] };
    } else {
      const a = vis.indexOf(pick.ids[0]), b = vis.indexOf(portId);
      if (a < 0 || b < 0) { pick = { node: nodeKey, ids: [portId] }; return; }
      const [lo, hi] = a <= b ? [a, b] : [b, a];
      const run = vis.slice(lo, hi + 1);
      // Keep the anchor first so the run always maps in the direction picked.
      pick = { node: nodeKey, ids: a <= b ? run : run.slice().reverse() };
    }
  }

  // --- reordering sockets --------------------------------------------------
  // Dragging a row swaps it past its neighbours, so the list reorders under the
  // cursor and you can see the result as you go. The order is stored per node
  // instance, not per device: two copies of the same stagebox can be arranged
  // differently, because they are wired differently.
  function startReorder(row, ev) {
    const key = row.dataset.node;
    const n = byKey.get(key);
    if (!n) return;
    const f = flow();
    let ids = visiblePorts(n).map((p) => p.id);
    const world = $('#flowWorld');
    row.classList.add('lifting');

    const move = (e) => {
      const rows = [...world.querySelectorAll(`.fnode[data-node="${key}"] .prow`)];
      const from = ids.indexOf(row.dataset.port);
      // Which row is under the pointer now?
      let to = from;
      rows.forEach((r, i) => {
        const b = r.getBoundingClientRect();
        if (e.clientY >= b.top && e.clientY <= b.bottom) to = i;
      });
      if (to === from) return;
      ids.splice(to, 0, ids.splice(from, 1)[0]);
      f.order[key] = ids.slice();
      render();
      // render() rebuilt the DOM, so re-find the row we are carrying.
      const again = world.querySelector(
        `.fnode[data-node="${key}"] .prow[data-port="${row.dataset.port}"]`);
      if (again) { again.classList.add('lifting'); row = again; }
    };
    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      f.order[key] = ids.slice();
      save(); render();
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  }

  // --- patching ------------------------------------------------------------
  let link = null;   // { node, port, side, ghost }

  const worldPt = (ev) => {
    const f = flow();
    const r = $('#flowView').getBoundingClientRect();
    return { x: (ev.clientX - r.left - f.view.x) / f.view.k,
             y: (ev.clientY - r.top - f.view.y) / f.view.k };
  };

  function startLink(row, side, ev) {
    link = { node: row.dataset.node, port: row.dataset.port, side };
    const svg = $('#flowWires');
    link.ghost = sel('path', { class: 'ghostwire', fill: 'none' });
    svg.appendChild(link.ghost);
    moveLink(ev);
  }

  function moveLink(ev) {
    if (!link) return;
    link.last = { clientX: ev.clientX, clientY: ev.clientY };
    const a = anchor(link.node, link.port, link.side);
    const p = worldPt(ev);
    link.ghost.setAttribute('d', link.side === 'r' ? wirePath(a, p) : wirePath(p, a));
    edgePan(ev);
  }

  // Drag a cable to the edge and the canvas follows, so a patch to something
  // off-screen does not mean letting go, panning, and starting again. The band
  // is generous and the speed ramps with how far into it you are — a hard step
  // at the boundary feels like the canvas is fighting you.
  const EDGE = 56, EDGE_MAX = 15;
  let panTimer = null;

  function edgePan(ev) {
    const host = $('#flowView');
    if (!host) return;
    const r = host.getBoundingClientRect();
    const ramp = (d) => Math.min(1, Math.max(0, (EDGE - d) / EDGE)) ** 1.6;
    let dx = 0, dy = 0;
    if (ev.clientX - r.left < EDGE) dx = ramp(ev.clientX - r.left) * EDGE_MAX;
    else if (r.right - ev.clientX < EDGE) dx = -ramp(r.right - ev.clientX) * EDGE_MAX;
    if (ev.clientY - r.top < EDGE) dy = ramp(ev.clientY - r.top) * EDGE_MAX;
    else if (r.bottom - ev.clientY < EDGE) dy = -ramp(r.bottom - ev.clientY) * EDGE_MAX;

    stopEdgePan();
    if (!dx && !dy) return;
    panTimer = setInterval(() => {
      if (!link) { stopEdgePan(); return; }
      const f = flow();
      f.view.x += dx; f.view.y += dy;
      applyView();
      // Redraw the ghost against the moved canvas, or it lags behind the cursor.
      if (link.last) {
        const a2 = anchor(link.node, link.port, link.side);
        const p2 = worldPt(link.last);
        link.ghost.setAttribute('d',
          link.side === 'r' ? wirePath(a2, p2) : wirePath(p2, a2));
      }
    }, 16);
  }

  function stopEdgePan() {
    if (panTimer) { clearInterval(panTimer); panTimer = null; }
  }

  function endLink(ev) {
    if (!link) return;
    stopEdgePan();
    const ghost = link.ghost, from = link;
    link = null;
    ghost.remove();
    const el = document.elementFromPoint(ev.clientX, ev.clientY);
    const row = el && el.closest && el.closest('.prow');
    if (!row) return;
    const to = { node: row.dataset.node, port: row.dataset.port };
    if (to.node === from.node && to.port === from.port) return;

    // Dragging from anywhere in a picked run patches the whole run.
    if (pick.ids.length > 1 && pick.node === from.node
        && pick.ids.includes(from.port)) {
      patchRun(from, to);
      return;
    }
    patch(from, to);
  }

  // One cable, returning what happened so the bulk path can summarise.
  function patch(from, to, quiet = false) {
    const f = flow();
    const dup = f.cables.find((c) =>
      (c.a.node === from.node && c.a.port === from.port
        && c.b.node === to.node && c.b.port === to.port)
      || (c.b.node === from.node && c.b.port === from.port
        && c.a.node === to.node && c.a.port === to.port));
    if (dup) {
      if (!quiet) toast('Those two sockets are already patched.', true);
      return { ok: false, reason: 'duplicate' };
    }

    const na = byKey.get(from.node), nb = byKey.get(to.node);
    const pa = na && na.ports.find((p) => p.id === from.port);
    const pb = nb && nb.ports.find((p) => p.id === to.port);
    if (!pa || !pb) return { ok: false, reason: 'missing' };
    // Dragging from a left anchor means you grabbed the destination first.
    const [src, dst, ps] = from.side === 'l' ? [to, from, pb] : [from, to, pa];

    const mismatch = familyOf(pa.t, pa.sig) !== familyOf(pb.t, pb.sig);
    if (mismatch && !quiet) {
      toast(`Patched ${FAMILIES[familyOf(pa.t, pa.sig)].label.toLowerCase()} to `
          + `${FAMILIES[familyOf(pb.t, pb.sig)].label.toLowerCase()} — check that.`, true);
    }
    // Was either end already carrying something? Legal, but it means hardware.
    const busy = f.cables.some((c) =>
      (c.a.node === from.node && c.a.port === from.port)
      || (c.b.node === from.node && c.b.port === from.port)
      || (c.a.node === to.node && c.a.port === to.port)
      || (c.b.node === to.node && c.b.port === to.port));

    f.cables.push({
      id: uid(), n: ++f.seq, fam: familyOf(ps.t, ps.sig),
      a: { node: src.node, port: src.port },
      b: { node: dst.node, port: dst.port },
      label: '',
    });
    if (!quiet) { save(); render(); }
    if (busy && !quiet) showSplitNotice();
    return { ok: true, mismatch, split: busy };
  }

  // Map a picked run onto consecutive sockets from the drop point. Runs off the
  // end of the target rather than wrapping — sixteen into eight is eight cables
  // and a message saying so, not eight silent surprises.
  function patchRun(from, to) {
    const nb = byKey.get(to.node);
    if (!nb) return;
    const vis = visiblePorts(nb).map((p) => p.id);
    const start = vis.indexOf(to.port);
    if (start < 0) return;

    // Drag from anywhere in the run; the run still maps from its own start.
    const ids = pick.ids;
    let made = 0, dupes = 0, mismatched = 0, splits = 0;
    for (let i = 0; i < ids.length; i++) {
      const target = vis[start + i];
      if (!target) break;
      if (to.node === pick.node && target === ids[i]) continue;
      const r = patch({ node: pick.node, port: ids[i], side: from.side },
                      { node: to.node, port: target }, true);
      if (r.ok) { made++; if (r.mismatch) mismatched++; if (r.split) splits++; }
      else if (r.reason === 'duplicate') dupes++;
    }
    const short = ids.length - (made + dupes);
    save(); clearPick(false); render();

    if (!made) { toast('Nothing patched — those sockets are already linked.', true); return; }
    const notes = [];
    if (dupes) notes.push(`${dupes} already patched`);
    if (short > 0) notes.push(`ran out of sockets after ${made}`);
    if (mismatched) notes.push(`${mismatched} crossed signal families`);
    if (splits) { notes.push(`${splits} landed on a used socket`); showSplitNotice(); }
    toast(`Patched ${made} cable${made === 1 ? '' : 's'}`
      + (notes.length ? ` — ${notes.join(', ')}.` : '.'), !!(short > 0 || mismatched));
  }

  function dropCable(id) {
    const f = flow();
    const i = f.cables.findIndex((c) => c.id === id);
    if (i < 0) return;
    const n = f.cables[i].n;
    f.cables.splice(i, 1);
    if (selCable === id) selCable = null;
    save(); render();
    toast(`Removed cable ${n}.`);
  }

  // A notice rather than a toast: a toast slides away after four seconds, and
  // this is the kind of thing you want to still be there when you look up. It
  // is not a refusal — the patch is already made — so it explains and offers to
  // stop mentioning it.
  function showSplitNotice() {
    if (splitNoticeOff) return;
    const host = $('#flowView');
    if (!host || host.querySelector('.splitnote')) return;
    const box = document.createElement('div');
    box.className = 'splitnote';
    box.dataset.ui = 'notice';
    box.innerHTML =
      '<b>That socket now has more than one cable.</b>'
      + '<p>Which is fine on paper and needs hardware in the rack — a Y-split, '
      + 'or a passive splitter. Sockets carrying more than one cable are marked '
      + 'with a count.</p>'
      + '<menu><button type="button" class="btn sm" data-x="ok">Got it</button>'
      + '<button type="button" class="btn sm" data-x="never">Stop telling me</button>'
      + '</menu>';
    box.querySelectorAll('button').forEach((b) => {
      b.onclick = () => {
        if (b.dataset.x === 'never') {
          splitNoticeOff = true;
          try { localStorage.setItem(SPLIT_KEY, 'off'); } catch { /* quota */ }
        }
        box.remove();
      };
    });
    host.appendChild(box);
  }

  // --- connection matrix ---------------------------------------------------
  // The patch list is a read-out of the graph, not a second place to keep the
  // same facts. Editing happens on the canvas; this pane finds, filters and
  // prints.
  // Self-sufficient on purpose: the export sheet asks for this whether or not
  // the canvas has ever been opened, and without buildNodes() there is no node
  // map to resolve the two ends against.
  function cableRows() {
    buildNodes();
    const f = flow();
    return f.cables.map((c) => {
      const na = byKey.get(c.a.node), nb = byKey.get(c.b.node);
      const pa = na && na.ports.find((p) => p.id === c.a.port);
      const pb = nb && nb.ports.find((p) => p.id === c.b.port);
      if (!pa || !pb) return null;
      return {
        c, fam: c.fam,
        srcNode: na.name, srcPort: labelFor(na, pa), srcMeta: na.meta || na.sub,
        dstNode: nb.name, dstPort: labelFor(nb, pb), dstMeta: nb.meta || nb.sub,
      };
    }).filter(Boolean).sort((a, b) => a.c.n - b.c.n);
  }

  function renderMatrix() {
    const box = $('#flowMatrix');
    if (!box) return;
    box.hidden = !matrixOpen;
    const btn = $('#fMatrix');
    if (btn) {
      btn.classList.toggle('on', matrixOpen);
      btn.textContent = `Cables ${flow().cables.length}`;
    }
    if (!matrixOpen) return;

    const rows = cableRows();
    const counts = {};
    rows.forEach((r) => (counts[r.fam] = (counts[r.fam] || 0) + 1));
    const q = matrixQ.toLowerCase().trim();
    const shown = rows.filter((r) =>
      (filterFam === 'all' || r.fam === filterFam)
      && (!q || `${r.srcNode} ${r.srcPort} ${r.dstNode} ${r.dstPort} ${r.c.label}`
            .toLowerCase().includes(q)));

    const chip = (k, label, n, col) =>
      `<button type="button" class="fchip${filterFam === k ? ' on' : ''}" data-fam="${k}">`
      + (col ? `<i style="background:${col}"></i>` : '')
      + `${esc(label)} <b>${n}</b></button>`;

    box.innerHTML =
      `<header><h3>Connection matrix</h3>`
      + `<span>${rows.length} cable${rows.length === 1 ? '' : 's'}</span>`
      + `<button type="button" class="fx" id="mClose" title="Close">&times;</button></header>`
      + `<div class="fchips">${chip('all', 'All', rows.length, null)}`
      + Object.keys(FAMILIES).filter((k) => counts[k])
          .map((k) => chip(k, FAMILIES[k].label, counts[k], FAMILIES[k].color)).join('')
      + `</div>`
      + `<input id="mSearch" class="msearch" placeholder="Search connections…" value="${esc(matrixQ)}">`
      + (shown.length
          ? `<div class="mrows">` + shown.map((r) =>
              `<div class="mrow${selCable === r.c.id ? ' on' : ''}" data-cable="${r.c.id}">`
              + `<span class="mn" style="background:${FAMILIES[r.fam].color}">${r.c.n}</span>`
              + `<div class="mend"><b>${esc(r.srcNode)}</b><span>${esc(r.srcPort)}</span></div>`
              + `<span class="marr">&rarr;</span>`
              + `<div class="mend"><b>${esc(r.dstNode)}</b><span>${esc(r.dstPort)}</span></div>`
              + `<button type="button" class="mdel" data-del="${r.c.id}" title="Remove cable">&times;</button>`
              + `</div>`).join('')
            + `</div>`
          : `<p class="mempty">${rows.length ? 'Nothing matches that.'
              : 'No cables yet. Drag from a socket on one device to a socket on another.'}</p>`)
      + `<div class="mfoot"><button type="button" class="btn sm" id="mCsv">Export CSV</button></div>`;

    $('#mClose', box).onclick = () => { matrixOpen = false; renderMatrix(); };
    box.querySelectorAll('.fchip').forEach((b) => {
      b.onclick = () => { filterFam = b.dataset.fam; renderMatrix(); };
    });
    const s = $('#mSearch', box);
    s.oninput = (e) => { matrixQ = e.target.value; renderMatrix(); $('#mSearch', box).focus(); };
    box.querySelectorAll('.mrow').forEach((r) => {
      r.onclick = (e) => {
        if (e.target.closest('.mdel')) return;
        selCable = r.dataset.cable; drawWires(); renderMatrix();
      };
    });
    box.querySelectorAll('.mdel').forEach((b) => {
      b.onclick = (e) => { e.stopPropagation(); dropCable(b.dataset.del); };
    });
    $('#mCsv', box).onclick = exportCsv;
  }

  function exportCsv() {
    const rows = cableRows();
    if (!rows.length) { toast('No cables to export.', true); return; }
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = ['Cable,Type,Source,Source socket,Source location,'
               + 'Target,Target socket,Target location,Note']
      .concat(rows.map((r) => [
        r.c.n, FAMILIES[r.fam].label, r.srcNode, r.srcPort, r.srcMeta,
        r.dstNode, r.dstPort, r.dstMeta, r.c.label || '',
      ].map(q).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${state.project.name || 'project'} — cables.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Exported ${rows.length} cables.`);
  }

  // --- external nodes ------------------------------------------------------
  // Anything the racks do not contain: the console at FOH, the stage box, PA,
  // a mic position. Deliberately thin — a name and a set of sockets.
  function addExternal() {
    const dlg = $('#dlgExt');
    const form = $('#formExt');
    form.reset();
    const rows = $('#extRows');
    rows.innerHTML = '';
    const addRow = (t = 'xlrf', n = 2, label = '') => {
      const r = document.createElement('div');
      r.className = 'extrow';
      r.innerHTML = `<select class="et"></select>`
        + `<input class="en" type="number" min="1" max="64" value="${n}">`
        + `<input class="el" type="text" placeholder="Label prefix" value="${esc(label)}">`
        + `<button type="button" class="fx">&times;</button>`;
      const s = r.querySelector('.et');
      PATCH_TYPES.forEach(([v, l]) => {
        const o = document.createElement('option');
        o.value = v; o.textContent = l; o.selected = v === t;
        s.appendChild(o);
      });
      r.querySelector('.fx').onclick = () => r.remove();
      rows.appendChild(r);
    };
    addRow();
    $('#extAddRow').onclick = () => addRow();
    $('#extOk').onclick = () => {
      const name = form.elements.name.value.trim();
      if (!name) { toast('Give the node a name.', true); return; }
      const ports = [];
      const tally = {};
      [...rows.querySelectorAll('.extrow')].forEach((r) => {
        const t = r.querySelector('.et').value;
        const n = Math.max(1, Math.min(64, +r.querySelector('.en').value || 1));
        const pre = r.querySelector('.el').value.trim();
        for (let i = 0; i < n; i++) {
          const ord = (tally[t] = (tally[t] || 0) + 1);
          ports.push({ id: `x:${t}:${ord}`, t, plane: 'front', ord,
                       label: pre ? `${pre} ${i + 1}` : '' });
        }
      });
      if (!ports.length) { toast('Add at least one socket.', true); return; }
      const f = flow();
      const id = uid();
      f.ext.push({ id, name, sub: form.elements.sub.value.trim(), ports });
      // Drop it where you can see it rather than under whatever is at 0,0.
      f.pos[id] = { x: Math.round(-f.view.x / f.view.k) + 60,
                    y: Math.round(-f.view.y / f.view.k) + 60 };
      // Prefix labels become the port labels for this node.
      const lab = (f.labels[id] ||= {});
      ports.forEach((p) => { if (p.label) lab[p.id] = p.label; });
      save(); dlg.close(); render();
      toast(`Added ${name} with ${ports.length} socket${ports.length === 1 ? '' : 's'}.`);
    };
    $('#extCancel').onclick = () => dlg.close();
    dlg.showModal();
  }

  // --- input ---------------------------------------------------------------
  let drag = null;      // { key, dx, dy } while moving a node
  let zoneDrag = null;  // { keys, from, x0, y0 } while moving a whole rack
  let pan = null;       // { x, y, vx, vy } while panning the canvas

  // Capture keeps a drag alive when the pointer leaves the element, but it
  // throws if the browser has no active pointer with that id — and an exception
  // here would abort the handler before the drag ever starts, killing patching
  // outright. It is an optimisation, not a requirement: window-level move and
  // up listeners do the real work.
  const grabPointer = (el, id) => {
    try { el.setPointerCapture(id); } catch { /* not capturable; carry on */ }
  };

  function mount() {
    const host = $('#flowView');
    const world = $('#flowWorld');

    host.addEventListener('pointerdown', (ev) => {
      // Anything marked as chrome is chrome, and this handler keeps its hands
      // off it entirely.
      //
      // This rule exists because the same bug has now been fixed four separate
      // times: the matrix close button, the panel resizers, the card `edit`
      // button, and the split notice. Every one had the same shape — an overlay
      // control lives inside the canvas, the press falls through to the pan
      // branch, grabPointer() captures the pointer, and the browser retargets
      // the click to the host, so the button's onclick never runs. It fails
      // silently and only under a real pointer, which is why it kept surviving.
      //
      // So the rule is inverted: instead of listing what to ignore, anything
      // that is UI declares itself with `data-ui` and is skipped. Mark new
      // overlays with it and they work; forget to and they break the same way,
      // which is at least a known failure with a known fix.
      if (ev.target.closest('[data-ui]')) return;
      const row = ev.target.closest('.prow');
      const pa = ev.target.closest('.pa');
      // While a card is in edit mode its rows reorder instead of patching.
      if (row && row.classList.contains('reorder')) {
        ev.preventDefault(); ev.stopPropagation();
        startReorder(row, ev);
        return;
      }
      if (row && pa) {                       // start a cable
        ev.preventDefault(); ev.stopPropagation();
        grabPointer(host, ev.pointerId);
        startLink(row, pa.dataset.side, ev);
        return;
      }
      // A press on the row itself — not its anchors, and not its label, which
      // belongs to the rename handler — picks the socket, and shift extends the
      // run. This is what makes a 32-way patch one drag instead of thirty-two.
      if (row && !ev.target.closest('.plab') && !ev.target.closest('.fmore')) {
        ev.preventDefault(); ev.stopPropagation();
        pickPort(row.dataset.node, row.dataset.port, ev.shiftKey);
        render();
        return;
      }
      // Grab a zone's name strip and the whole rack moves as one.
      const zg = ev.target.closest('.zgrab');
      if (zg) {
        const keys = (zoneMembers.get(zg.dataset.zone) || [])
          .filter((k) => byKey.has(k));
        if (keys.length) {
          ev.preventDefault();
          grabPointer(host, ev.pointerId);
          const p0 = worldPt(ev);
          zoneDrag = {
            zone: zg.dataset.zone,
            keys,
            from: keys.map((k) => ({ k, x: byKey.get(k).pos.x, y: byKey.get(k).pos.y })),
            x0: p0.x, y0: p0.y,
          };
          drawZones();
          return;
        }
      }

      // A button in the header is a button, not a drag handle. Without this the
      // press starts a node drag and grabPointer() retargets the click away
      // from the button, so `edit` and the ext node's `x` never fired at all.
      // Same failure the matrix close button had.
      if (ev.target.closest('.fhead button')) return;

      const head = ev.target.closest('.fhead');
      if (head) {                            // move a node
        const key = head.parentElement.dataset.node;
        const n = byKey.get(key);
        const p = worldPt(ev);
        ev.preventDefault();
        grabPointer(host, ev.pointerId);
        drag = { key, dx: p.x - n.pos.x, dy: p.y - n.pos.y, el: head.parentElement };
        head.parentElement.classList.add('moving');
        return;
      }
      if (ev.target.closest('.fnode') || ev.target.closest('.wire')) return;
      const f = flow();                      // otherwise pan
      grabPointer(host, ev.pointerId);
      pan = { x: ev.clientX, y: ev.clientY, vx: f.view.x, vy: f.view.y };
      selCable = null;
      if (pick.ids.length) clearPick(); else drawWires();
      host.classList.add('panning');
    });

    host.addEventListener('pointermove', (ev) => {
      if (link) { moveLink(ev); return; }
      if (zoneDrag) {
        const p = worldPt(ev);
        const dx = p.x - zoneDrag.x0, dy = p.y - zoneDrag.y0;
        const f = flow();
        zoneDrag.from.forEach((o) => {
          const n = byKey.get(o.k);
          if (!n) return;
          n.pos.x = Math.round(o.x + dx);
          n.pos.y = Math.round(o.y + dy);
          f.pos[o.k] = n.pos;
          const el = world.querySelector(`.fnode[data-node="${o.k}"]`);
          if (el) { el.style.left = n.pos.x + 'px'; el.style.top = n.pos.y + 'px'; }
        });
        drawZones(); drawWires();
        return;
      }
      if (drag) {
        const p = worldPt(ev);
        const n = byKey.get(drag.key);
        // No clamp to the origin. The canvas is unbounded in every direction —
        // `arrange` already places the external group above y=0, and Fit works
        // off the actual bounding box, so nothing downstream needs a corner to
        // measure from. Pinning drags to positive space only ever meant you
        // could not put a rack up and to the left of the one it feeds.
        n.pos.x = Math.round(p.x - drag.dx);
        n.pos.y = Math.round(p.y - drag.dy);
        flow().pos[drag.key] = n.pos;
        drag.el.style.left = n.pos.x + 'px';
        drag.el.style.top = n.pos.y + 'px';
        drawZones();
        drawWires();
        return;
      }
      if (pan) {
        const f = flow();
        f.view.x = pan.vx + (ev.clientX - pan.x);
        f.view.y = pan.vy + (ev.clientY - pan.y);
        applyView();
      }
    });

    const finish = (ev) => {
      if (zoneDrag) { zoneDrag = null; drawZones(); save(); }
      if (link) endLink(ev);
      if (drag) { drag.el.classList.remove('moving'); drag = null; save(); }
      if (pan) { pan = null; host.classList.remove('panning'); save(); }
    };
    host.addEventListener('pointerup', finish);
    host.addEventListener('pointercancel', finish);

    host.addEventListener('wheel', (ev) => {
      ev.preventDefault();
      const f = flow();
      const r = host.getBoundingClientRect();
      zoomAt(ev.clientX - r.left, ev.clientY - r.top,
             f.view.k * Math.exp(-ev.deltaY * 0.0014));
    }, { passive: false });

    // Rename a socket in place. The default label is ordinal, so this is how a
    // port stops being "JK 7" and starts being "Wedge 3".
    world.addEventListener('dblclick', (ev) => {
      const lab = ev.target.closest('.plab');
      if (!lab) return;
      const row = lab.closest('.prow');
      const key = row.dataset.node, pid = row.dataset.port;
      const n = byKey.get(key);
      const p = n.ports.find((x) => x.id === pid);
      const inp = document.createElement('input');
      inp.className = 'pedit';
      inp.value = labelFor(n, p);
      lab.replaceWith(inp);
      inp.focus(); inp.select();
      const done = (keep) => {
        const f = flow();
        if (keep) {
          const v = inp.value.trim();
          const map = (f.labels[key] ||= {});
          if (!v || v === portLabel(p, n.both)) delete map[pid]; else map[pid] = v;
          save();
        }
        render();
      };
      inp.onblur = () => done(true);
      inp.onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); inp.blur(); }
        if (e.key === 'Escape') { e.preventDefault(); inp.onblur = null; done(false); }
      };
    });

    // Removing an external node takes its cables with it.
    world.addEventListener('click', (ev) => {
      const x = ev.target.closest('.fkill');
      if (!x) return;
      ev.stopPropagation();
      const key = x.closest('.fnode').dataset.node;
      const f = flow();
      f.ext = f.ext.filter((e) => e.id !== key);
      f.cables = f.cables.filter((c) => c.a.node !== key && c.b.node !== key);
      delete f.pos[key]; delete f.labels[key]; delete f.open[key];
      save(); render();
      toast('External node removed.');
    });

    document.addEventListener('keydown', (ev) => {
      if (state.view !== 'flow') return;
      if (ev.key === 'Escape' && pick.ids.length) {
        ev.preventDefault(); clearPick(); return;
      }
      if (!selCable) return;
      if (ev.key !== 'Delete' && ev.key !== 'Backspace') return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
      ev.preventDefault();
      dropCable(selCable);
    });

    $('#fArrange').onclick = arrange;
    $('#fAddNode').onclick = addExternal;
    $('#fMatrix').onclick = () => { matrixOpen = !matrixOpen; renderMatrix(); };
    $('#fFit').onclick = fit;
    $('#fIn').onclick = () => {
      const r = host.getBoundingClientRect();
      zoomAt(r.width / 2, r.height / 2, flow().view.k * 1.25);
    };
    $('#fOut').onclick = () => {
      const r = host.getBoundingClientRect();
      zoomAt(r.width / 2, r.height / 2, flow().view.k / 1.25);
    };
  }

  // First time the canvas is opened on a project that has never seen it, lay
  // the nodes out rather than dropping the user on a default grid.
  function open() {
    const f = flow();
    render();
    if (!f.laid && nodes.length) { f.laid = true; arrange(); }
  }

  return { mount, render, open, fit, cableRows, exportCsv };
}

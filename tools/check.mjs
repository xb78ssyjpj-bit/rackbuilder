// Syntax + sanity gate. Run it after editing anything.
//
//    node tools/check.mjs
//
// Use this, NOT `node --check` — that parses a file as CommonJS and will
// happily pass an ES module that cannot load. It reported clean on a
// devices.js with a `const` declared inside the device array literal, which
// then failed at import with "Unexpected token 'const'". Importing is the only
// check that means anything.

import { SEED_DEVICES as D } from '../devices.js';
import { CATEGORIES } from '../devices/_lib.js';
import { OPTION_CARDS as C } from '../devices/cards.js';
import {
  faceElements, sizeMM, heightMM, MM, FACE_L, FACE_R, PATCH_TYPES,
  isNarrow, bodyBounds, elemMM,
  SLOT_FORMATS, slotType, cardsFor,
} from '../panel.js';
import { devicePorts, portLabel, familyOf, FAMILIES } from '../flow.js';
import { readFileSync } from 'node:fs';

let fail = 0;
const bad = (msg) => { console.log(`  ${msg}`); fail++; };

console.log(`modules load — ${D.length} devices`);

// --- every category in use is declared -------------------------------------
const undeclared = [...new Set(D.map((d) => d.category))].filter((c) => !CATEGORIES[c]);
if (undeclared.length) bad(`category not in CATEGORIES: ${undeclared.join(', ')}`);

// --- every module actually parses ------------------------------------------
// node --check parses as CommonJS and will pass a file that cannot import, so
// this uses --input-type=module. It exists because app.js was never parsed by
// anything: a duplicate `const` shipped, app.js threw on load, and the whole
// application was a blank page while every other check still said "all pass".
{
  const { execFileSync } = await import('node:child_process');
  const { readFileSync } = await import('node:fs');
  for (const f of ['app.js', 'panel.js', 'flow.js', 'devices.js', 'version.js']) {
    try {
      execFileSync(process.execPath, ['--input-type=module', '--check'],
        { input: readFileSync(new URL(`../${f}`, import.meta.url)), stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      bad(`${f} does not parse as a module: ${String(e.stderr || e).split('\n').find((l) => l.includes('Error')) || ''}`);
    }
  }
}

// --- ids are unique ---------------------------------------------------------
const ids = new Set();
for (const d of D) {
  if (ids.has(d.id)) bad(`duplicate device id: ${d.id}`);
  ids.add(d.id);
  if (!d.brand || !d.model || !d.ru) bad(`${d.id}: missing brand/model/ru`);
}

// --- auto panels stay inside the face --------------------------------------
const CONN = new Set(PATCH_TYPES.map(([v]) => v));
let panels = 0;
for (const d of D) {
  for (const plane of ['front', 'rear']) {
    const L = d[plane];
    if (!L || !L.auto) continue;
    panels++;
    const ru = d.ru || 1;
    // A narrow device is laid out inside its own body, not the full face, so
    // the fit check has to measure against the same bounds the drawing uses.
    const narrow = isNarrow(d);
    const [nx0, nx1] = narrow ? bodyBounds(d) : [0, 0];
    const inset = FACE_L - 62;
    const left = d.half ? 12 : (narrow ? nx0 + inset : FACE_L);
    const right = d.half ? 426 : (narrow ? nx1 - inset : FACE_R);
    const out = faceElements(L, d, null, left, right);
    const L0 = d.half ? 6 : (narrow ? nx0 - 2 : 40);
    const R0 = d.half ? 432 : (narrow ? nx1 + 2 : 960);
    const B = ru * 100;
    for (const e of out) {
      const { w: wmm, h: hmm } = elemMM(e);
      const w = wmm * MM, h = hmm * MM;
      if (e.x - w / 2 < L0 - 0.5 || e.x + w / 2 > R0 + 0.5
          || e.y - h / 2 < 1 || e.y + h / 2 > B - 1) {
        bad(`${d.id} ${plane}: ${e.t} outside the panel`);
        break;
      }
    }
  }
}

// --- ports resolve, ids unique, labels unambiguous --------------------------
let sockets = 0, named = 0;
for (const d of D) {
  const ports = devicePorts(d, null);
  if (!ports.length) continue;
  sockets += ports.length;
  const both = ports.some((p) => p.plane === 'front') && ports.some((p) => p.plane === 'rear');
  const seenId = new Set(), seenLabel = new Map();
  for (const p of ports) {
    if (p.name) named++;
    if (!CONN.has(p.t)) bad(`${d.id}: ${p.t} is not a connector type`);
    if (!FAMILIES[familyOf(p.t)]) bad(`${d.id}: ${p.t} has no signal family`);
    if (seenId.has(p.id)) bad(`${d.id}: duplicate port id ${p.id}`);
    seenId.add(p.id);
    const l = portLabel(p, both);
    seenLabel.set(l, (seenLabel.get(l) || 0) + 1);
  }
  for (const [l, n] of seenLabel) {
    if (n > 1) bad(`${d.id}: ${n} sockets both labelled "${l}"`);
  }
}

// --- option cards ------------------------------------------------------------
// A card is a faceplate in a hole of a stated size, so the interesting check is
// the physical one: does what the card carries actually fit the aperture it
// claims to fit? That is the same reasoning that catches an impossible panel,
// and it is what would have caught a card given one connector too many.
const cardIds = new Set();
for (const c of C) {
  if (cardIds.has(c.id)) bad(`duplicate card id: ${c.id}`);
  cardIds.add(c.id);
  if (!c.brand || !c.model) bad(`${c.id}: missing brand/model`);
  const f = SLOT_FORMATS[c.fmt];
  if (!f) { bad(`${c.id}: unknown slot format ${c.fmt}`); continue; }

  for (const e of c.auto || []) {
    if (!CONN.has(e.t)) bad(`${c.id}: ${e.t} is not a connector type`);
  }
  // Widest honest arrangement: columns of `stack`, at true connector size.
  let cols = 0, tall = 0;
  for (const e of c.auto || []) {
    const n = e.n || 1, st = Math.max(1, Math.min(e.stack || 1, n));
    cols += Math.ceil(n / st);
    tall = Math.max(tall, st * (elemMM(e).h || 12));
  }
  // A portrait aperture holds a vertical card: its runs go DOWN the face, so
  // the width is the widest single connector and the height is the sum. Laid
  // out across, an Event Master Tri-combo would need 61 mm in a 31 mm card and
  // would be refused — correctly for a horizontal card, wrongly for this one.
  const portrait = f.mmH > f.mm;
  const wide = portrait
    ? (c.auto || []).reduce((a, e) => Math.max(a, elemMM(e).w || 12), 0)
    : (c.auto || []).reduce(
        (a, e) => a + Math.ceil((e.n || 1) / Math.max(1, Math.min(e.stack || 1, e.n || 1)))
                    * (elemMM(e).w || 12), 0);
  const high = portrait
    ? (c.auto || []).reduce((a, e) => a + (e.n || 1) * (elemMM(e).h || 12), 0)
    : tall;
  if (wide > f.mm) bad(`${c.id}: ${wide.toFixed(0)} mm of connectors in a ${f.mm} mm ${c.fmt} slot`);
  if (high > f.mmH) bad(`${c.id}: ${high.toFixed(0)} mm tall in a ${f.mmH} mm ${c.fmt} slot`);
  if (cols < 1) bad(`${c.id}: no connectors`);
}

// --- roles are spelled the same on both sides -------------------------------
// A slot's `accepts` and a card's `role` are matched by string, so a typo on
// either side fails silently: the dropdown simply offers nothing and the slot
// looks like it has no cards. Cheap to check, invisible to debug.
const ROLES = new Set(['in', 'out', 'link', 'mvr']);
for (const c of C) {
  if (c.role && !ROLES.has(c.role)) bad(`${c.id}: unknown card role "${c.role}"`);
}
for (const d of D) {
  for (const s of d.slots || []) {
    for (const r of s.accepts || []) {
      if (!ROLES.has(r)) bad(`${d.id}: slot ${s.id} accepts unknown role "${r}"`);
    }
    if (s.accepts && !cardsFor(s.fmt, s.accepts).length) {
      bad(`${d.id}: slot ${s.id} accepts [${s.accepts}] but no ${s.fmt} card has those roles`);
    }
  }
}

// --- every declared slot has a format, and every format has a card ----------
for (const d of D) {
  for (const s of d.slots || []) {
    if (!SLOT_FORMATS[s.fmt]) bad(`${d.id}: slot ${s.id} has unknown format ${s.fmt}`);
    else if (!cardsFor(s.fmt).length) bad(`${d.id}: slot ${s.id} has no cards to fit it`);
    // Both shapes of face, since v1.19.0: a slot can sit in a hand-placed
    // `elements` array as well as an `auto` list.
    const faces = [d.rear, d.front].filter(Boolean);
    const decl = JSON.stringify(faces.map((f) => [f.auto || [], f.elements || []]));
    if (!decl.includes(`"slot":"${s.id}"`)) {
      bad(`${d.id}: declares slot ${s.id} but no face places it`);
    }
  }
  // The aperture must not become something you can patch a cable to.
  for (const fmt of Object.keys(SLOT_FORMATS)) {
    if (CONN.has(slotType(fmt))) bad(`slot format ${fmt} is registered as a connector`);
  }
}

// --- ports stay unique with every card fitted -------------------------------
// Fitting a card can collide with a socket the chassis already has: an SQ-Rack
// has an SLink port, and the SLink card adds a second one. Checked per card
// rather than trusted, because the collision is silent — two rows in the flow
// view reading the same name, patched to different things.
for (const d of D) {
  for (const s of d.slots || []) {
    for (const card of cardsFor(s.fmt)) {
      const ports = devicePorts(d, { uid: 'x', devId: d.id, cards: { [s.id]: card.id } });
      const both = ports.some((p) => p.plane === 'front') && ports.some((p) => p.plane === 'rear');
      const seen = new Map();
      for (const p of ports) {
        if (!CONN.has(p.t)) bad(`${d.id}+${card.id}: ${p.t} is not a connector type`);
        const l = portLabel(p, both);
        seen.set(l, (seen.get(l) || 0) + 1);
      }
      for (const [l, n] of seen) {
        if (n > 1) bad(`${d.id} with ${card.id}: ${n} sockets both labelled "${l}"`);
      }
      const base = devicePorts(d, null).length;
      const want = (card.auto || []).reduce((a, e) => a + (e.n || 1), 0);
      if (ports.length !== base + want) {
        bad(`${d.id} with ${card.id}: ${ports.length - base} sockets added, expected ${want}`);
      }
    }
  }
}

// --- overlay controls must be reachable ------------------------------------
// The flow canvas swallows presses that are not marked as UI: the pointer gets
// captured and the click is retargeted, so the control silently stops working
// under a real pointer while still passing any test that calls .click().
// This has bitten four times, so it is checked rather than remembered.
const flowSrc = readFileSync(new URL('../flow.js', import.meta.url), 'utf8');
const htmlSrc = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

if (!flowSrc.includes("closest('[data-ui]')")) {
  bad('flow.js: the pointerdown handler no longer skips [data-ui] — every '
    + 'overlay control inside the canvas will stop responding');
}
// Every overlay that lives inside #flowView has to declare itself.
for (const [name, marker] of [['.matrix', 'data-ui'], ['.splitnote', 'dataset.ui']]) {
  const declared = name === '.matrix'
    ? /class="matrix"[^>]*data-ui/.test(htmlSrc)
    : /className = 'splitnote';\s*\n\s*\w+\.dataset\.ui/.test(flowSrc);
  if (!declared) bad(`${name} is inside the flow canvas but does not carry ${marker}`);
}

console.log(`${panels} auto panels, ${sockets} sockets, ${named} manufacturer-named`);
// Not a failure — a standing reminder. A slot whose aperture was derived rather
// than measured makes the fit checks above a sanity bound, not a guarantee.
for (const [fmt, f] of Object.entries(SLOT_FORMATS)) {
  if (f.approx) {
    console.log(`  note: ${fmt} is ${f.mm}x${f.mmH} mm DERIVED, not measured `
      + `— ${cardsFor(fmt).length} cards checked against a figure that could move`);
  }
}
console.log(fail ? `\n${fail} PROBLEM${fail === 1 ? '' : 'S'}` : 'all checks pass');
process.exit(fail ? 1 : 0);

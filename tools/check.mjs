// Syntax + sanity gate. Run it after editing anything.
//
//    node tools/check.mjs
//
// Use this, NOT `node --check` — that parses a file as CommonJS and will
// happily pass an ES module that cannot load. It reported clean on a
// devices.js with a `const` declared inside the device array literal, which
// then failed at import with "Unexpected token 'const'". Importing is the only
// check that means anything.

import { SEED_DEVICES as D, CATEGORIES } from '../devices.js';
import {
  autoLayout, sizeMM, heightMM, MM, FACE_L, FACE_R, PATCH_TYPES,
} from '../panel.js';
import { devicePorts, portLabel, familyOf, FAMILIES } from '../flow.js';

let fail = 0;
const bad = (msg) => { console.log(`  ${msg}`); fail++; };

console.log(`modules load — ${D.length} devices`);

// --- every category in use is declared -------------------------------------
const undeclared = [...new Set(D.map((d) => d.category))].filter((c) => !CATEGORIES[c]);
if (undeclared.length) bad(`category not in CATEGORIES: ${undeclared.join(', ')}`);

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
    const out = autoLayout(L.auto, ru, d.half ? 12 : FACE_L, d.half ? 426 : FACE_R);
    const L0 = d.half ? 6 : 40, R0 = d.half ? 432 : 960, B = ru * 100;
    for (const e of out) {
      const w = (sizeMM(e.t) || 20) * MM, h = (heightMM(e.t) || 20) * MM;
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

console.log(`${panels} auto panels, ${sockets} sockets, ${named} manufacturer-named`);
console.log(fail ? `\n${fail} PROBLEM${fail === 1 ? '' : 'S'}` : 'all checks pass');
process.exit(fail ? 1 : 0);

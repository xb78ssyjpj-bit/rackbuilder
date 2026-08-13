// Shared by more than one brand file.
//
// Everything here earns its place by being used across brands: the category
// vocabulary, and the one face generator that more than one manufacturer's
// gear is drawn with. A helper used by a single brand lives in that brand's
// file instead — see qsc.js, penn-elcom.js, allen-heath.js.

import { MM, FACE_L, FACE_R } from '../panel.js';

export const CATEGORIES = {
  audio: 'Audio',
  wireless: 'Wireless / RF',
  comms: 'Comms',
  charging: 'Charging',
  network: 'Network',
  computing: 'Computing',
  video: 'Video',
  power: 'Power',
  accessory: 'Accessories',
};

// A network switch face: RJ45 ports in two staggered rows the way real switches
// stack them, then the SFP/QSFP cages, with lettering on the left when the port
// count leaves room. Everything is laid out at TRUE pitch — 15 mm per stacked
// RJ45, 20 mm per SFP cage, 22 mm per QSFP — which is why a 48-port switch only
// just fits a 19" face and a 24-port one has room to be labelled.
//
// Built from NetBox devicetype-library specs; see tools/netbox-import.py.
export function switchFront({ rj45 = 0, sfp = 0, qsfp = 0, mgmt = 0, brand = '', model = '' }) {
  const P_RJ = 15 * MM, P_SFP = 20 * MM, P_QSFP = 22 * MM;
  const rjRows = rj45 > 12 ? 2 : 1;
  const rjPer = Math.ceil(rj45 / rjRows);
  const cages = sfp + qsfp;
  const cageRows = cages >= 4 ? 2 : 1;
  const sfpPer = Math.ceil(sfp / cageRows);
  const qsfpPer = Math.ceil(qsfp / cageRows);

  const rjW = rjPer * P_RJ;
  const cageW = sfpPer * P_SFP + qsfpPer * P_QSFP;
  // A 48-port face has almost no slack left once the ports are at true pitch,
  // so the gap between the numbered block and the cages is what gives way —
  // better a tight face than cages pushed off the end of the panel.
  const USABLE = FACE_R - FACE_L;
  const slack = USABLE - rjW - cageW;
  const GAP = cageW && rjW ? Math.min(30, Math.max(6, slack / 2)) : 0;
  const total = rjW + GAP + cageW;

  // Prefer to leave 150 units for lettering; give it up when the ports need it.
  const SPARE = USABLE - total;
  const x0 = FACE_L + (SPARE >= 150 ? 150 : Math.max(6, SPARE / 2));

  const y = rjRows === 2 || cageRows === 2 ? [34, 70] : [52, 52];
  const els = [];

  // Odd ports on the top row, even on the bottom — the usual switch convention.
  if (rj45) {
    const top = Math.ceil(rj45 / rjRows);
    els.push({ t: 'rj45', x: x0 + P_RJ / 2, y: y[0], n: top, gap: P_RJ });
    if (rjRows === 2 && rj45 - top > 0) {
      els.push({ t: 'rj45', x: x0 + P_RJ / 2, y: y[1], n: rj45 - top, gap: P_RJ });
    }
  }
  let cx = x0 + rjW + GAP;
  if (sfp) {
    const top = Math.ceil(sfp / cageRows);
    els.push({ t: 'sfp', x: cx + P_SFP / 2, y: y[0], n: top, gap: P_SFP });
    if (cageRows === 2 && sfp - top > 0) {
      els.push({ t: 'sfp', x: cx + P_SFP / 2, y: y[1], n: sfp - top, gap: P_SFP });
    }
    cx += sfpPer * P_SFP;
  }
  if (qsfp) {
    const top = Math.ceil(qsfp / cageRows);
    els.push({ t: 'qsfp', x: cx + P_QSFP / 2, y: y[0], n: top, gap: P_QSFP });
    if (cageRows === 2 && qsfp - top > 0) {
      els.push({ t: 'qsfp', x: cx + P_QSFP / 2, y: y[1], n: qsfp - top, gap: P_QSFP });
    }
  }
  // A dedicated management port sits in the lettering gutter, ahead of the
  // numbered block, so it is never mistaken for port 1. On a face with no
  // gutter left — a 48-port switch — it is dropped rather than drawn over the
  // rack ear. See TODO: that also removes it from the signal-flow graph.
  const gutter = SPARE >= 150;
  if (mgmt && gutter) els.push({ t: 'rj45', x: x0 - 46, y: 52, n: 1, gap: P_RJ });

  const labels = [];
  if (gutter) {
    labels.push({ text: brand.toUpperCase(), x: 76, y: 44, size: 10, ls: .8 });
    labels.push({ text: model, x: 76, y: 64, size: 8, ls: .4 });
    if (mgmt) labels.push({ text: 'MGMT', x: x0 - 46, y: 84, size: 6, ls: .3, anchor: 'middle' });
  }
  return { elements: els, labels };
}

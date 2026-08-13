// Seed device catalogue.
//
// SPEC ACCURACY: `ru` is reliable. Entries marked `approx: true` have weight/
// depth/power figures that are ballpark, not datasheet-verified — good enough for
// layout, NOT for truss loading or power distribution sign-off. Entries with a
// `src` field were checked against the linked manufacturer documentation.
//
// A device needs only { id, brand, model, category, ru } to be usable; the panel
// falls back to a labelled block. `front`/`rear` add drawing detail, either as
// hand-placed `elements` or as an `auto` connector list.

// Geometry constants, so generated panels can be laid out at true size.
// One-way dependency: panel.js never imports this file.
import { MM, FACE_L, FACE_R, registerCards } from './panel.js';

// Socket names for a bank that counts DOWN as the panel runs left to right —
// which is most rears, because the numbering is chosen to read correctly from
// the front. Auto-layout places declarations left to right as seen from BEHIND
// the rack, so a plain `lbl: 'IN'` would number these backwards.
const countDown = (prefix, n, last = {}) =>
  Array.from({ length: n }, (_, i) => `${prefix} ${last[n - i] || n - i}`);

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
function switchFront({ rj45 = 0, sfp = 0, qsfp = 0, mgmt = 0, brand = '', model = '' }) {
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

// dLive MixRacks have no front-panel controls at all — two ventilation grilles,
// a pair of status LEDs and the lettering. Drawn from the U height so one
// function covers DM0 through DM64.
const mixrackFront = (ru, model) => {
  const H = 100 * ru, cy = H / 2;
  return { elements: [
    { t: 'mesh', x: 250, y: cy, w: 340, h: H - 60 },
    { t: 'mesh', x: 750, y: cy, w: 340, h: H - 60 },
    { t: 'led', x: 470, y: cy + 46 }, { t: 'led', x: 530, y: cy + 46 },
  ], labels: [
    { text: 'ALLEN&HEATH', x: 500, y: cy - 12, size: 17, ls: 1, anchor: 'middle' },
    { text: model, x: 500, y: cy + 16, size: 14, ls: .6, anchor: 'middle' },
  ] };
};

const pldFront = (model) => ({ elements: [
  { t: 'button', x: 88, y: 100, w: 26, h: 26 },                 // soft power
  { t: 'button', x: 172, y: 52, w: 30, h: 18, n: 4, gap: 62 },  // MUTE
  { t: 'led', x: 172, y: 80, n: 4, gap: 62 },                   // limiter
  { t: 'led', x: 172, y: 102, n: 4, gap: 62 },                  // -10 dB
  { t: 'led', x: 172, y: 124, n: 4, gap: 62 },                  // -20 dB / clip
  { t: 'button', x: 172, y: 152, w: 30, h: 18, n: 4, gap: 62 }, // SELECT
  { t: 'display', x: 566, y: 100, w: 250, h: 118 },             // 400 x 240 TFT
  { t: 'button', x: 740, y: 56, w: 42, h: 20 },                 // HOME
  { t: 'button', x: 740, y: 86, w: 42, h: 20 },                 // ENTER
  { t: 'button', x: 740, y: 116, w: 42, h: 20 },                // EXIT
  { t: 'button', x: 740, y: 146, w: 42, h: 20 },                // GAIN
  { t: 'knob', x: 846, y: 100, r: 30 },                         // MASTER CONTROL
], labels: [
  { text: 'QSC', x: 78, y: 40, size: 13, ls: .9 },
  { text: model, x: 78, y: 168, size: 10, ls: .5 },
  { text: 'A    B    C    D', x: 234, y: 182, size: 8, ls: .5, anchor: 'middle' },
  { text: 'MASTER', x: 846, y: 152, size: 8, ls: .5, anchor: 'middle' },
] });

// Rear order is QSC's own: USB, four inputs, four link outputs, four speaker
// outputs, the bridged pair, then the locking IEC.
const pldRear = () => ({ auto: [
  { t: 'usbb', n: 1 },
  { t: 'xlrf', n: 4, lbl: 'IN' },
  { t: 'xlrm', n: 4, lbl: 'LINK OUT' },
  { t: 'nl4', n: 4, lbl: 'OUT' },
  { t: 'nl4', n: 2, lbl: 'BRIDGED' },
  { t: 'iec_in', n: 1 },
] });

// The legacy QSC two-channel amps — PLX, PLX2 and RMX. All long discontinued
// and all still everywhere in hire stock, which is why they are here.
//
// Front panels: QSC state the inventory (AC switch, two detented gain knobs,
// power / signal / clip LEDs, and on the HD models a protect LED) but publish no
// orthographic front view for any of them, so POSITIONS ARE INDICATIVE — same
// standard as the d&b and L-Acoustics fronts, and a step below the PLD, whose
// front comes from a numbered figure.
const qscLegacyFront = (ru, model, protect = false) => {
  const cy = ru * 50;
  const leds = [
    { t: 'led', x: 596, y: cy - 17 }, { t: 'led', x: 596, y: cy + 17 },
    { t: 'led', x: 626, y: cy - 17 }, { t: 'led', x: 626, y: cy + 17 },
  ];
  if (protect) {
    leds.push({ t: 'led', x: 656, y: cy - 17 }, { t: 'led', x: 656, y: cy + 17 });
  }
  return { elements: [
    { t: 'button', x: 122, y: cy, w: 30, h: 26 },              // AC switch
    { t: 'led', x: 180, y: cy },                               // power, green
    { t: 'mesh', x: 380, y: cy, w: 250, h: ru * 100 - 48 },    // intake grille
    ...leds,
    { t: 'knob', x: 782, y: cy, r: 27 },
    { t: 'knob', x: 868, y: cy, r: 27 },
  ], labels: [
    { text: 'QSC', x: 78, y: cy - 24, size: 13, ls: .9 },
    { text: model, x: 78, y: cy + 32, size: 10, ls: .5 },
    { text: 'SIG  CLIP', x: 611, y: cy + 46, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CH 1', x: 782, y: cy + 46, size: 8, ls: .5, anchor: 'middle' },
    { text: 'CH 2', x: 868, y: cy + 46, size: 8, ls: .5, anchor: 'middle' },
  ] };
};

// PLX and PLX2 take XLR and a parallel 1/4" TRS per channel; RMX adds a
// detachable barrier strip. Both ranges put out speakON plus touch-proof
// binding posts — the posts have no primitive and are not drawn, which is why
// the output count reads two rather than four.
const qscAmpRear = (barrier = false) => ({ auto: [
  { t: 'iec_in', n: 1 },
  ...(barrier ? [{ t: 'euroblock', n: 2, lbl: 'BARRIER' }] : []),
  { t: 'trs', n: 2, lbl: 'IN TRS' },
  { t: 'xlrf', n: 2, lbl: 'IN' },
  { t: 'nl4', n: 2, lbl: 'OUT' },
] });

// Penn Elcom 2U rack PDUs. The whole PDU16 range shares one front panel, drawn
// from Penn Elcom's own product photography: an M4 earth stud, the C-FORM (or
// TRUE1) mains inlet, Channel A's illuminated trip, the matching THRU LINK
// outlet, the LCD power monitor, Channel B's trip, and then — this is the part
// worth knowing before you plan a rack — exactly ONE of the eight outlets. The
// other seven are on the back panel, which Penn Elcom state outright for the
// TR1 and which the photographs confirm for the rest.
//
// `inlet`/`link` differ per model, `socket` is whichever outlet family it is.
// Positions are proportional to the photographs; every connector is drawn at
// its true size, so the fit is real even where the spacing is eyeballed.
const pdu16Front = ({ inlet, link, socket, model }) => ({
  elements: [
    { t: 'screw', x: 98, y: 118 },
    { t: inlet, x: inlet === 'cee32_1_in' ? 190 : 182, y: 100, lbl: 'MAINS IN' },
    { t: 'breaker', x: 304, y: 100 },
    { t: link, x: 423, y: 100, lbl: 'THRU LINK' },
    { t: 'display', x: 628, y: 100, w: 114, h: 62 },
    { t: 'breaker', x: 750, y: 100 },
    { t: socket, x: 835, y: 100, lbl: 'OUT 1' },
  ],
  labels: [
    { text: 'GROUND', x: 98, y: 86, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CHANNEL A', x: 304, y: 56, size: 7, ls: .4, anchor: 'middle' },
    { text: 'THRU LINK', x: 304, y: 70, size: 6, ls: .3, anchor: 'middle' },
    { text: 'POWER MONITOR', x: 628, y: 46, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CHANNEL B', x: 750, y: 56, size: 7, ls: .4, anchor: 'middle' },
    { text: '8 SOCKETS', x: 750, y: 70, size: 6, ls: .3, anchor: 'middle' },
    { text: model, x: 900, y: 44, size: 13, ls: .8, anchor: 'end' },
  ],
});

// The PDU32 two-channel units put NOTHING on the front but the inlet, the two
// bank trips and the monitor — all eight outputs are on the back, four per
// channel, colour coded A grey / B yellow.
const pdu32Front = (inlet) => ({
  elements: [
    { t: 'screw', x: 100, y: 118 },
    { t: inlet, x: 213, y: 100, lbl: 'MAINS IN' },
    { t: 'breaker', x: 382, y: 100 },
    { t: 'display', x: 568, y: 100, w: 114, h: 62 },
    { t: 'breaker', x: 745, y: 100 },
  ],
  labels: [
    { text: 'GROUND', x: 100, y: 86, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CHANNEL A', x: 382, y: 56, size: 7, ls: .4, anchor: 'middle' },
    { text: 'A1-A4', x: 382, y: 70, size: 6, ls: .3, anchor: 'middle' },
    { text: 'POWER MONITOR', x: 568, y: 46, size: 7, ls: .4, anchor: 'middle' },
    { text: 'CHANNEL B', x: 745, y: 56, size: 7, ls: .4, anchor: 'middle' },
    { text: 'B1-B4', x: 745, y: 70, size: 6, ls: .3, anchor: 'middle' },
    { text: 'PDU32', x: 900, y: 44, size: 13, ls: .8, anchor: 'end' },
  ],
});

// Seven of the eight outlets, on the back. Numbered from 2 because socket 1 is
// the one on the front.
const pdu16Rear = (socket) => ({ auto: [
  { t: socket, n: 7, lbl: ['OUT 2', 'OUT 3', 'OUT 4', 'OUT 5', 'OUT 6', 'OUT 7', 'OUT 8'] },
] });

const D = [

  // Hand-placed from the manufacturer's orthographic front view.
  // 2 RU x 19" x 460 mm, 10.8 kg. Front: 3.5" TFT upper left, SCROLL/EDIT
  // encoder on the lower recessed step, POWER rotary far right.
  // NOTE: power figure is NOT from the datasheet — set it from the manual.
  { id: 'db-d20', brand: 'd&b audiotechnik', model: 'D20', category: 'audio',
    ru: 2, depth: 460, weight: 10.8, power: 400, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/d20/',
    front: { elements: [
      { t: 'display', x: 161, y: 88, w: 154, h: 110 },
      // the recessed lower section runs right across the panel
      { t: 'line', x: 615, y: 128, w: 630 },
      { t: 'knob', x: 304, y: 165, r: 19 },
      { t: 'knob', x: 889, y: 165, r: 17 },
    ], labels: [
      { text: 'D20', x: 252, y: 52, size: 27, ls: 1 },
      { text: 'SCROLL', x: 330, y: 160, size: 10, ls: .5 },
      { text: 'EDIT', x: 330, y: 172, size: 10, ls: .5 },
      { text: 'POWER', x: 843, y: 170, size: 10, ls: .5, anchor: 'end' },
      { text: 'OFF', x: 866, y: 140, size: 9, ls: .5, anchor: 'end' },
      { text: 'ON', x: 906, y: 140, size: 9, ls: .5 },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrf', n: 2 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  // 4U, 430 x 214 x 173 mm (W x D x H), 5.8 kg. Faderless: 7" touchscreen,
  // 8 SoftKeys, 4 Soft Rotaries under an assignable LCD strip. I/O is on the rear.
  { id: 'ah-sq-rack', brand: 'Allen & Heath', model: 'SQ-Rack', category: 'audio',
    ru: 4, depth: 214, weight: 5.8, power: 75, approx: true,
    src: 'https://support.allen-heath.com/hc/en-gb/articles/41222924565777-SQ-Rack-Getting-Started-Guide',
    front: { elements: [
      // 8 SoftKeys, 2 columns x 4 rows, far left
      { t: 'button', x: 108, y: 96, w: 30, h: 22 },
      { t: 'button', x: 108, y: 148, w: 30, h: 22 },
      { t: 'button', x: 108, y: 200, w: 30, h: 22 },
      { t: 'button', x: 108, y: 252, w: 30, h: 22 },
      { t: 'button', x: 152, y: 96, w: 30, h: 22 },
      { t: 'button', x: 152, y: 148, w: 30, h: 22 },
      { t: 'button', x: 152, y: 200, w: 30, h: 22 },
      { t: 'button', x: 152, y: 252, w: 30, h: 22 },
      // main encoder + phones
      { t: 'encoder', x: 232, y: 200, r: 22 },
      { t: 'trs', x: 150, y: 330, lbl: 'PHONES' },
      // 7" touchscreen
      { t: 'display', x: 480, y: 170, w: 310, h: 220 },
      // function row beneath the screen
      { t: 'button', x: 430, y: 322, n: 6, gap: 44, w: 32, h: 22 },
      { t: 'knob', x: 836, y: 320, r: 20 },
      // right: LCD strip over 4 Soft Rotaries
      { t: 'display', x: 800, y: 132, w: 210, h: 40 },
      { t: 'knob', x: 722, y: 226, r: 22 },
      { t: 'knob', x: 774, y: 226, r: 22 },
      { t: 'knob', x: 826, y: 226, r: 22 },
      { t: 'knob', x: 878, y: 226, r: 22 },
    ], labels: [
      { text: 'SQ-Rack', x: 392, y: 328, size: 17, ls: 1, anchor: 'end' },
      { text: 'ALLEN&HEATH', x: 898, y: 72, size: 15, ls: 1, anchor: 'end' },
    ] },
    // Rear rebuilt from A&H's own rear-panel drawing (Getting Started Guide,
    // callouts 1-13). The previous entry had 16 XLR-F / 8 XLR-M / 2 etherCON
    // and no jacks at all, which is not this panel: the talkback input was
    // missing, four of the outputs were missing, the AES3 output was missing,
    // all seven 1/4" jacks were missing, and the Network port is an ordinary
    // RJ45 — only SLink is locking etherCON.
    //
    // Declared right to left in panel numbering because the panel itself counts
    // down as it runs left to right when viewed from behind. Mains is 75 W, off
    // the panel legend ("100-240V~ 50/60Hz 75W").
    slots: [{ id: 'io', name: 'I/O Port', short: 'I/O', fmt: 'ah-sq-io' }],
    rear: { auto: [
      { t: 'xlrf', n: 1, lbl: 'TALKBACK' },
      { t: 'xlrf', n: 16, lbl: countDown('IN', 16) },
      { t: 'trs', n: 4, stack: 2, lbl: ['ST2 L', 'ST2 R', 'ST1 L', 'ST1 R'] },
      { t: 'trs', n: 1, lbl: 'FOOTSWITCH' },
      { t: 'xlrm', n: 1, sig: 'aes3', lbl: 'AES OUT' },
      { t: 'trs', n: 2, stack: 2, lbl: ['A OUT', 'B OUT'] },
      { t: 'xlrm', n: 12, lbl: countDown('OUT', 12, { 12: '12/R', 11: '11/L' }) },
      { t: 'iec_in', n: 1 },
      { t: 'slot', slot: 'io' },
      { t: 'usbb', n: 1 },
      { t: 'rj45', n: 1, lbl: 'NETWORK' },
      { t: 'ethercon', n: 1, lbl: 'SLINK' },
    ] } },

  // 4U with the AB168-RK19 rack kit. 410 x 190 x 185 mm, 4.8 kg, 35 W.
  // Front: 16 XLR-F in (2 rows of 8) | Power + Ready LEDs | 8 XLR-M out (2 rows of 4).
  { id: 'ah-dx168', brand: 'Allen & Heath', model: 'DX168', category: 'audio',
    ru: 4, depth: 185, weight: 4.8, power: 35,
    src: 'https://www.allen-heath.com/hardware/everything-i-o/dx168/',
    front: { elements: [
      { t: 'xlrf', x: 120, y: 176, n: 8, gap: 58 },
      { t: 'xlrf', x: 120, y: 286, n: 8, gap: 58 },
      // status LEDs and the divider between the input and output blocks
      { t: 'led', x: 583, y: 176 },
      { t: 'led', x: 583, y: 286 },
      { t: 'vline', x: 612, y: 231, h: 190 },
      { t: 'xlrm', x: 668, y: 176, n: 4, gap: 72 },
      { t: 'xlrm', x: 668, y: 286, n: 4, gap: 72 },
    ], labels: [
      { text: 'ALLEN&HEATH', x: 96, y: 62, size: 15, ls: 1 },
      { text: 'INPUTS  1-16', x: 312, y: 118, size: 15, ls: 1.5, anchor: 'middle' },
      { text: 'Power', x: 566, y: 158, size: 9, ls: .5, anchor: 'end' },
      { text: 'Ready', x: 566, y: 268, size: 9, ls: .5, anchor: 'end' },
      { text: 'OUTPUTS  1-8', x: 770, y: 118, size: 15, ls: 1.5, anchor: 'middle' },
      { text: 'DX168  AudioRack', x: 906, y: 62, size: 14, ls: .5, anchor: 'end' },
    ] } },
  // 3U, 483 x 132 x 287 mm, 6.5 kg. 5" TFT flanked by button columns, six
  // encoders beneath it, big knobs and power to the right.
  // Derived from a product photo at a mild angle — layout is confident,
  // exact positions are within a few mm.
  { id: 'behringer-x32-rack', brand: 'Behringer', model: 'X32 RACK', category: 'audio',
    ru: 3, depth: 287, weight: 6.5, power: 45, approx: true,
    src: 'https://www.thomannmusic.com/behringer_x32_rack.htm',
    front: { elements: [
      { t: 'usba', x: 108, y: 145 },
      { t: 'meter', x: 190, y: 100, n: 10, h: 86 },
      { t: 'button', x: 168, y: 178, w: 26, h: 18 },
      { t: 'button', x: 208, y: 178, w: 26, h: 18 },
      { t: 'knob', x: 190, y: 240, r: 24 },
      // left function column
      { t: 'button', x: 268, y: 92, w: 46, h: 20 },
      { t: 'button', x: 268, y: 122, w: 46, h: 20 },
      { t: 'button', x: 268, y: 152, w: 46, h: 20 },
      { t: 'button', x: 268, y: 182, w: 46, h: 20 },
      { t: 'button', x: 268, y: 212, w: 46, h: 20 },
      // 5" TFT
      { t: 'display', x: 425, y: 148, w: 250, h: 168 },
      { t: 'meter', x: 578, y: 148, n: 14, h: 160 },
      // right function column
      { t: 'button', x: 642, y: 100, w: 52, h: 20 },
      { t: 'button', x: 642, y: 130, w: 52, h: 20 },
      { t: 'button', x: 642, y: 160, w: 52, h: 20 },
      { t: 'button', x: 642, y: 190, w: 52, h: 20 },
      { t: 'button', x: 642, y: 220, w: 52, h: 20 },
      // six encoders under the screen
      { t: 'encoder', x: 318, y: 262, n: 6, gap: 44, r: 18 },
      // navigation cluster
      { t: 'button', x: 596, y: 252, w: 18, h: 13 },
      { t: 'button', x: 596, y: 272, w: 18, h: 13 },
      { t: 'button', x: 574, y: 262, w: 18, h: 13 },
      { t: 'button', x: 618, y: 262, w: 18, h: 13 },
      // right-hand section
      { t: 'knob', x: 735, y: 112, r: 21 },
      { t: 'knob', x: 848, y: 118, r: 21 },
      { t: 'trs', x: 848, y: 200 },
      { t: 'button', x: 735, y: 196, w: 54, h: 20 },
      { t: 'knob', x: 735, y: 252, r: 24 },
      { t: 'button', x: 872, y: 262, w: 30, h: 34 },
    ], labels: [
      { text: 'X32 RACK', x: 78, y: 60, size: 19, ls: 1 },
      { text: 'DATA / AUDIO', x: 78, y: 172, size: 8, ls: .5 },
      { text: 'CHANNEL LEVEL', x: 190, y: 210, size: 8, ls: .5, anchor: 'middle' },
      { text: 'TALK', x: 735, y: 84, size: 9, ls: .5, anchor: 'middle' },
      { text: 'MONITOR', x: 848, y: 90, size: 9, ls: .5, anchor: 'middle' },
      { text: 'MAIN LR', x: 735, y: 222, size: 9, ls: .5, anchor: 'middle' },
      { text: 'POWER', x: 872, y: 232, size: 8, ls: .5, anchor: 'middle' },
    ] },
    // Rear per the X32 RACK manual: 16 XLR mic in, 8 XLR out, 6 aux sends and
    // 6 aux returns on balanced 1/4" TRS, AES50 A and B on etherCON, one
    // ULTRANET (P-16), one RJ45 for remote control, and MIDI in/out.
    // Deliberately NOT here: an AES/EBU output — the full X32 console has one,
    // this rack version does not. The expansion card slot is a slot, not a
    // socket, so the fitted card's own connector is not modelled.
    // The USB type-A is on the front panel, where it is already drawn.
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'midi', n: 2, lbl: ['MIDI IN', 'MIDI OUT'] },
      { t: 'rj45', n: 2, lbl: ['ULTRANET', 'REMOTE'] },
      { t: 'ethercon', n: 2, lbl: ['AES50 A', 'AES50 B'] },
      { t: 'trs', n: 12, lbl: 'AUX' },
      { t: 'xlrm', n: 8, lbl: 'OUT' }, { t: 'xlrf', n: 16, lbl: 'IN' },
    ] } },

  // 2U, 482 x 225 x 89 mm, 4.7 kg. Everything is on the front: 16 XLR-F in
  // (2 rows of 8), control section, then 8 XLR-M out along the bottom right.
  { id: 'behringer-s16', brand: 'Behringer', model: 'S16', category: 'audio',
    ru: 2, depth: 225, weight: 4.7, power: 40, approx: true,
    src: 'https://www.thomannmusic.com/behringer_s16.htm',
    front: { elements: [
      { t: 'xlrf', x: 106, y: 48, n: 8, gap: 50 },
      { t: 'xlrf', x: 106, y: 118, n: 8, gap: 50 },
      { t: 'led', x: 82, y: 158 },
      { t: 'vline', x: 492, y: 100, h: 170 },
      // control section
      { t: 'display', x: 652, y: 68, w: 46, h: 28 },
      { t: 'led', x: 590, y: 42, n: 5, gap: 18 },
      { t: 'button', x: 606, y: 112, w: 26, h: 16 },
      { t: 'button', x: 646, y: 112, w: 26, h: 16 },
      { t: 'button', x: 692, y: 112, w: 30, h: 16 },
      { t: 'encoder', x: 748, y: 82, r: 17 },
      { t: 'meter', x: 792, y: 82, n: 6, h: 46 },
      { t: 'knob', x: 838, y: 82, r: 17 },
      { t: 'trs', x: 892, y: 82 },
      // 8 XLR-M returns
      { t: 'xlrm', x: 524, y: 162, n: 8, gap: 53 },
    ], labels: [
      { text: 'S16', x: 512, y: 96, size: 22, ls: 1 },
      { text: 'PHANTOM', x: 96, y: 162, size: 8, ls: .5 },
      { text: 'HA CONTROL', x: 748, y: 52, size: 8, ls: .5, anchor: 'middle' },
      { text: 'PHONES', x: 892, y: 52, size: 8, ls: .5, anchor: 'middle' },
    ] },
    // Rear per the S16 manual's connector table: AES50 A and B on NEUTRIK
    // etherCON, one ULTRANET (P-16) port, two ADAT TOSLINK outs carrying 16
    // channels between them, MIDI in and out on 5-pin DIN, and a USB type-B
    // for firmware. The manual's table does not name the mains inlet; C14 is
    // the fitting on the unit and every other box of this class here.
    rear: { auto: [
      { t: 'iec_in', n: 1 }, { t: 'usbb', n: 1 },
      { t: 'midi', n: 2, lbl: ['MIDI IN', 'MIDI OUT'] },
      { t: 'toslink', n: 2, lbl: ['ADAT OUT 1-8', 'ADAT OUT 9-16'] },
      { t: 'rj45', n: 1, lbl: 'ULTRANET' },
      { t: 'ethercon', n: 2, lbl: ['AES50 A', 'AES50 B'] },
    ] } },

  // 1U, 44 x 483 x 189 mm, 1.9 kg, 35 W. Two main-input level knobs, then
  // eight channel strips: mode switches, level knob, 1/4" TRS out.
  { id: 'behringer-ha8000v2', brand: 'Behringer', model: 'POWERPLAY HA8000 V2',
    category: 'audio', ru: 1, depth: 189, weight: 1.9, power: 35,
    src: 'https://www.behringer.com/en/products/0835-AAI',
    front: { elements: [
      { t: 'knob', x: 104, y: 50, r: 14 },
      { t: 'knob', x: 152, y: 50, r: 14 },
      { t: 'vline', x: 186, y: 50, h: 60 },
      // eight channel strips
      { t: 'button', x: 206, y: 34, n: 8, gap: 88, w: 15, h: 11 },
      { t: 'button', x: 206, y: 62, n: 8, gap: 88, w: 15, h: 11 },
      { t: 'knob', x: 236, y: 50, n: 8, gap: 88, r: 13 },
      { t: 'trs', x: 270, y: 50, n: 8, gap: 88 },
    ], labels: [
      { text: 'MAIN 1', x: 104, y: 82, size: 8, ls: .5, anchor: 'middle' },
      { text: 'MAIN 2', x: 152, y: 82, size: 8, ls: .5, anchor: 'middle' },
    ] },
    // Rear: two stereo MAIN inputs feeding two independent mixes, a DIRECT
    // input per channel, and a second PHONES output per channel mirroring the
    // front — which is the point of the V2, sixteen pairs of headphones off one
    // box. Everything is 6.3 mm; the mains is an IEC inlet on a 100-240 V
    // switching supply.
    //
    // The one inference: "2 stereo main inputs" is taken as four jacks, L and R
    // apiece, because Behringer's own instruction is to use "TRS or TS" cables
    // into MAIN INPUTS (L/R) — a single stereo TRS could not take a TS cable.
    // The DIRECT inputs are one stereo TRS per channel, which is the standard
    // arrangement for a headphone distribution amp.
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'trs', n: 4, lbl: ['MAIN A L', 'MAIN A R', 'MAIN B L', 'MAIN B R'] },
      { t: 'trs', n: 8, lbl: 'DIRECT IN' },
      { t: 'trs', n: 8, lbl: 'PHONES OUT' },
    ] } },

  // 1U, 483 x 44.45 x 178 mm, 2.7 kg. Eight combo inputs with gain knobs above,
  // phantom switches, monitor level and two headphone outs.
  { id: 'presonus-quantum-2626', brand: 'PreSonus', model: 'Quantum 2626',
    category: 'audio', ru: 1, depth: 178, weight: 2.7, power: 30, approx: true,
    src: 'https://www.presonus.com/products/quantum-2626',
    front: { elements: [
      { t: 'knob', x: 106, y: 24, n: 8, gap: 62, r: 10 },
      { t: 'combo', x: 106, y: 64, n: 8, gap: 62 },
      { t: 'button', x: 610, y: 26, w: 26, h: 14 },
      { t: 'button', x: 646, y: 26, w: 26, h: 14 },
      { t: 'knob', x: 706, y: 50, r: 18 },
      { t: 'trs', x: 790, y: 56 },
      { t: 'trs', x: 848, y: 56 },
      { t: 'knob', x: 790, y: 22, r: 9 },
      { t: 'knob', x: 848, y: 22, r: 9 },
    ], labels: [
      { text: '48V', x: 628, y: 52, size: 8, ls: .5, anchor: 'middle' },
      { text: 'MONITOR', x: 706, y: 82, size: 8, ls: .5, anchor: 'middle' },
      { text: 'PHONES', x: 819, y: 82, size: 8, ls: .5, anchor: 'middle' },
    ] },
    // Rear inventory per PreSonus: 8 line out, stereo monitor out, ch 1-2
    // preamp out / line return, MIDI I/O, S/PDIF on RCA, ADAT optical I/O,
    // wordclock BNC, Thunderbolt 3 (a USB-C shell) and the IEC inlet.
    // The jack bank runs two rows deep on the real unit, hence `stack`.
    rear: { auto: [
      { t: 'iec_in', n: 1 }, { t: 'usbc', n: 1 }, { t: 'bnc', n: 2 },
      { t: 'toslink', n: 2 }, { t: 'rca', n: 2 }, { t: 'midi', n: 2 },
      { t: 'trs', n: 14, stack: 2 },
    ] } },

  // ----------------------------------------------------------- Sennheiser ---
  // Almost the whole evolution wireless range is a 212 mm half-rack box — which
  // is HALF_W to within a millimetre — carried in a GA 3 tray. So these are
  // `half: true` and want a shelf, exactly like the other half-rack gear.
  //
  // Band SKUs are NOT separate library entries: pick the band per unit in the
  // inspector. Two receivers in one rack are routinely on different bands.
  //
  // Front-panel element order for EW-D EM is straight from Sennheiser's own
  // product-overview page. The G3/G4 shells follow the "Operating Elements on
  // the Front of the Device" list in the evolution wireless manuals. Exact
  // positions are proportioned from those lists, not from a dimensioned drawing.

  { id: 'senn-em100-g3', brand: 'Sennheiser', model: 'EM 100 G3', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A: 516 - 558 MHz', 'B: 626 - 668 MHz', 'C: 734 - 776 MHz',
            'D: 780 - 822 MHz', 'E: 823 - 865 MHz', 'G: 566 - 608 MHz'],
    src: 'https://assets.sennheiser.com/global-downloads/file/10792/EM_300_G3_Manual_12_2016_EN.pdf',
    front: { elements: [
      { t: 'trs', x: 34, y: 54 },
      { t: 'knob', x: 66, y: 54, r: 9 },
      { t: 'bar', x: 94, y: 54, w: 13, h: 22, rx: 2 },
      { t: 'display', x: 200, y: 54, w: 150, h: 44 },
      { t: 'encoder', x: 308, y: 54, r: 16 },
      { t: 'button', x: 376, y: 54, w: 28, h: 18 },
    ], labels: [
      { text: 'sennheiser', x: 22, y: 22, size: 9, ls: .5 },
      { text: 'EM 100 G3', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  { id: 'senn-em300-g3', brand: 'Sennheiser', model: 'EM 300 G3', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A: 516 - 558 MHz', 'B: 626 - 668 MHz', 'C: 734 - 776 MHz',
            'D: 780 - 822 MHz', 'E: 823 - 865 MHz', 'G: 566 - 608 MHz'],
    src: 'https://assets.sennheiser.com/global-downloads/file/10792/EM_300_G3_Manual_12_2016_EN.pdf',
    front: { elements: [
      { t: 'trs', x: 34, y: 54 },
      { t: 'knob', x: 66, y: 54, r: 9 },
      { t: 'bar', x: 94, y: 54, w: 13, h: 22, rx: 2 },
      { t: 'display', x: 200, y: 54, w: 150, h: 44 },
      { t: 'encoder', x: 308, y: 54, r: 16 },
      { t: 'button', x: 376, y: 54, w: 28, h: 18 },
    ], labels: [
      { text: 'sennheiser', x: 22, y: 22, size: 9, ls: .5 },
      { text: 'EM 300 G3', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  // Same shell as the receivers — the IEM transmitter's audio is on the rear.
  { id: 'senn-sr300-iem-g3', brand: 'Sennheiser', model: 'SR 300 IEM G3',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A: 516 - 558 MHz', 'B: 626 - 668 MHz', 'C: 734 - 776 MHz',
            'D: 780 - 822 MHz', 'E: 823 - 865 MHz', 'G: 566 - 608 MHz'],
    src: 'https://assets.sennheiser.com/global-downloads/file/3078/SR_300_IEM_G3__03_2013.pdf',
    front: { elements: [
      { t: 'trs', x: 34, y: 54 },
      { t: 'knob', x: 66, y: 54, r: 9 },
      { t: 'bar', x: 94, y: 54, w: 13, h: 22, rx: 2 },
      { t: 'display', x: 200, y: 54, w: 150, h: 44 },
      { t: 'encoder', x: 308, y: 54, r: 16 },
      { t: 'button', x: 376, y: 54, w: 28, h: 18 },
    ], labels: [
      { text: 'sennheiser', x: 22, y: 22, size: 9, ls: .5 },
      { text: 'SR 300 IEM G3', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'combo', n: 2 }, { t: 'jack', n: 1 }, { t: 'bnc', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  // G4 adds a SYNC button and a warning LED to the G3 shell.
  { id: 'senn-em100-g4', brand: 'Sennheiser', model: 'EM 100 G4', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A1: 470 - 516 MHz', 'A: 516 - 558 MHz', 'AS: 520 - 558 MHz',
            'G: 566 - 608 MHz', 'GB: 606 - 648 MHz', 'B: 626 - 668 MHz',
            'C: 734 - 776 MHz', 'D: 780 - 822 MHz', '1G8: 1785 - 1800 MHz'],
    src: 'https://assets.sennheiser.com/global-downloads/file/10001/SP_1117_v2.0_EM_100_G4_Product_Specification_EN.pdf',
    front: { elements: [
      { t: 'trs', x: 32, y: 54 },
      { t: 'knob', x: 62, y: 54, r: 9 },
      { t: 'bar', x: 88, y: 54, w: 12, h: 22, rx: 2 },
      { t: 'led', x: 108, y: 54 },
      { t: 'display', x: 200, y: 54, w: 142, h: 44 },
      { t: 'encoder', x: 300, y: 54, r: 15 },
      { t: 'button', x: 376, y: 54, w: 24, h: 16 },
      { t: 'button', x: 410, y: 54, w: 22, h: 20 },
    ], labels: [
      { text: 'sennheiser', x: 20, y: 22, size: 9, ls: .5 },
      { text: 'EM 100 G4', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  { id: 'senn-em300-500-g4', brand: 'Sennheiser', model: 'EM 300-500 G4',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['AW+: 470 - 558 MHz', 'AS: 520 - 558 MHz', 'GW1: 558 - 608 MHz',
            'GW: 558 - 626 MHz', 'GBW: 606 - 678 MHz', 'BW: 626 - 698 MHz',
            'CW: 718 - 790 MHz', 'DW: 780 - 865 MHz'],
    src: 'https://www.manualslib.com/manual/1846086/Sennheiser-Evolution-Wireless-G4.html',
    front: { elements: [
      { t: 'trs', x: 32, y: 54 },
      { t: 'knob', x: 62, y: 54, r: 9 },
      { t: 'bar', x: 88, y: 54, w: 12, h: 22, rx: 2 },
      { t: 'led', x: 108, y: 54 },
      { t: 'display', x: 200, y: 54, w: 142, h: 44 },
      { t: 'encoder', x: 300, y: 54, r: 15 },
      { t: 'button', x: 344, y: 54, w: 24, h: 16 },
      { t: 'button', x: 376, y: 54, w: 24, h: 16 },
      { t: 'button', x: 410, y: 54, w: 22, h: 20 },
    ], labels: [
      { text: 'sennheiser', x: 20, y: 22, size: 9, ls: .5 },
      { text: 'EM 300-500 G4', x: 196, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  { id: 'senn-sr-iem-g4', brand: 'Sennheiser', model: 'SR IEM G4', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 202, weight: 0.98, power: 3.6, approx: true,
    bands: ['A1: 470 - 516 MHz', 'A: 516 - 558 MHz', 'AS: 520 - 558 MHz',
            'G: 566 - 608 MHz', 'GB: 606 - 648 MHz', 'B: 626 - 668 MHz',
            'C: 734 - 776 MHz', 'D: 780 - 822 MHz', '1G8: 1785 - 1800 MHz'],
    src: 'https://www.fullcompass.com/common/files/40342-SRIEMG4Datasheet.pdf',
    front: { elements: [
      { t: 'trs', x: 32, y: 54 },
      { t: 'knob', x: 62, y: 54, r: 9 },
      { t: 'bar', x: 88, y: 54, w: 12, h: 22, rx: 2 },
      { t: 'led', x: 108, y: 54 },
      { t: 'display', x: 200, y: 54, w: 142, h: 44 },
      { t: 'encoder', x: 300, y: 54, r: 15 },
      { t: 'button', x: 344, y: 54, w: 24, h: 16 },
      { t: 'button', x: 376, y: 54, w: 24, h: 16 },
      { t: 'button', x: 410, y: 54, w: 22, h: 20 },
    ], labels: [
      { text: 'sennheiser', x: 20, y: 22, size: 9, ls: .5 },
      { text: 'SR IEM G4', x: 200, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'combo', n: 2 }, { t: 'jack', n: 1 }, { t: 'bnc', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  // Front elements confirmed one-for-one against Sennheiser's product overview:
  // LINK and DATA LEDs, display, UP/DOWN/SET, SYNC, ESC, ON/OFF. There is NO
  // headphone output on the EW-D EM — that arrives with the EW-DX EM 2.
  { id: 'senn-ewd-em', brand: 'Sennheiser', model: 'EW-D EM', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 189, weight: 1.0, power: 3.6,
    bands: ['Q1-6: 470.2 - 526 MHz', 'R1-6: 520 - 576 MHz', 'R4-9: 552 - 607.8 MHz',
            'S1-7: 606.2 - 662 MHz', 'U1/5: 823.2 - 831.8 / 863.2 - 864.8 MHz',
            'V3-4: 925.2 - 937.3 MHz', 'Y1-3: 1785.2 - 1799.8 MHz'],
    src: 'https://docs.cloud.sennheiser.com/en-us/ew-d/ew-d/ew-d-em-overview.html',
    front: { elements: [
      { t: 'led', x: 30, y: 54 },
      { t: 'led', x: 50, y: 54 },
      { t: 'display', x: 170, y: 54, w: 160, h: 46 },
      { t: 'button', x: 272, y: 54, w: 20, h: 16 },
      { t: 'button', x: 298, y: 54, w: 20, h: 16 },
      { t: 'button', x: 324, y: 54, w: 20, h: 16 },
      { t: 'button', x: 350, y: 54, w: 20, h: 16 },
      { t: 'button', x: 380, y: 54, w: 20, h: 16 },
      { t: 'button', x: 412, y: 54, w: 22, h: 20 },
    ], labels: [
      { text: 'EW-D', x: 24, y: 22, size: 10, ls: .8 },
      { text: 'EW-D EM', x: 170, y: 22, size: 10, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'ts', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  // Two-channel: one OLED per channel, then headphone + volume, jog and standby.
  // 212 x 44 x 189 mm, 1.0 kg, max 12 W — from Sennheiser's own product page.
  { id: 'senn-ewdx-em2', brand: 'Sennheiser', model: 'EW-DX EM 2', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 189, weight: 1.0, power: 12,
    bands: ['Q1-9: 470.2 - 550 MHz', 'R1-9: 520 - 607.8 MHz',
            'S1-10: 606.2 - 693.8 MHz', 'S2-10: 614.2 - 693.8 MHz',
            'S4-10: 630 - 693.8 MHz',
            'U1/5: 823.2 - 831.8 / 863.2 - 864.8 MHz',
            'V3-4: 925.2 - 937.3 MHz', 'V5-7: 941.7 - 959.65 MHz',
            'Y1-3: 1785.2 - 1799.8 MHz'],
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/ew-dx-em-2/ew-dx-em-2-q1-9-509342',
    front: { elements: [
      { t: 'display', x: 92, y: 52, w: 118, h: 50 },
      { t: 'display', x: 218, y: 52, w: 118, h: 50 },
      { t: 'trs', x: 305, y: 54 },
      { t: 'knob', x: 342, y: 54, r: 10 },
      { t: 'encoder', x: 380, y: 54, r: 15 },
      { t: 'button', x: 416, y: 54, w: 18, h: 22 },
    ], labels: [
      { text: 'EW-DX EM 2', x: 30, y: 14, size: 9, ls: .5 },
      { text: '1', x: 92, y: 92, size: 8, anchor: 'middle' },
      { text: '2', x: 218, y: 92, size: 8, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'ts', n: 2 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  // Same chassis and front panel as the EM 2; the rear gains Dante ports.
  // Depth is taken from the EM 2 because the two share a housing — dealer
  // listings disagree on a shallower figure that could not be confirmed.
  { id: 'senn-ewdx-em2-dante', brand: 'Sennheiser', model: 'EW-DX EM 2 Dante',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 189, weight: 1.0, power: 12, approx: true,
    bands: ['Q1-9: 470.2 - 550 MHz', 'R1-9: 520 - 607.8 MHz',
            'S1-10: 606.2 - 693.8 MHz', 'S2-10: 614.2 - 693.8 MHz',
            'S4-10: 630 - 693.8 MHz',
            'U1/5: 823.2 - 831.8 / 863.2 - 864.8 MHz',
            'V3-4: 925.2 - 937.3 MHz', 'V5-7: 941.7 - 959.65 MHz',
            'Y1-3: 1785.2 - 1799.8 MHz'],
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/ew-dx-em-2-dante/ew-dx-em-2-dante-q1-9-509356',
    front: { elements: [
      { t: 'display', x: 92, y: 52, w: 118, h: 50 },
      { t: 'display', x: 218, y: 52, w: 118, h: 50 },
      { t: 'trs', x: 305, y: 54 },
      { t: 'knob', x: 342, y: 54, r: 10 },
      { t: 'encoder', x: 380, y: 54, r: 15 },
      { t: 'button', x: 416, y: 54, w: 18, h: 22 },
    ], labels: [
      { text: 'EW-DX EM 2 DANTE', x: 30, y: 14, size: 8, ls: .4 },
      { text: '1', x: 92, y: 92, size: 8, anchor: 'middle' },
      { text: '2', x: 218, y: 92, size: 8, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'rj45', n: 3 },
      { t: 'dcjack', n: 1 },
    ] } },

  // The only full-width unit in the range: 483 x 44 x 373 mm, 4.56 kg, max 37 W,
  // internal PSU on an IEC inlet, four assignable network ports and an
  // integrated antenna splitter that daisy-chains four units to 16 channels.
  { id: 'senn-ewdx-em4-dante', brand: 'Sennheiser', model: 'EW-DX EM 4 Dante',
    category: 'wireless', ru: 1, depth: 373, weight: 4.56, power: 37,
    bands: ['Q1-9: 470.2 - 550 MHz', 'R1-9: 520 - 607.8 MHz',
            'S1-10: 606.2 - 693.8 MHz', 'S2-10: 614.2 - 693.8 MHz',
            'S4-10: 630 - 693.8 MHz',
            'U1/5: 823.2 - 831.8 / 863.2 - 864.8 MHz',
            'V5-7: 941.7 - 959.65 MHz', 'Y1-3: 1785.2 - 1799.8 MHz'],
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/ew-dx-em-4-dante/ew-dx-em-4-dante-q1-9-509370',
    front: { elements: [
      { t: 'display', x: 300, y: 50, w: 300, h: 58 },
      { t: 'encoder', x: 500, y: 50, r: 19 },
      { t: 'button', x: 560, y: 50, w: 36, h: 20 },
      { t: 'button', x: 610, y: 50, w: 36, h: 20 },
      { t: 'led', x: 670, y: 50, n: 4, gap: 26 },
      { t: 'trs', x: 800, y: 50 },
      { t: 'knob', x: 852, y: 50, r: 12 },
      { t: 'button', x: 900, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'sennheiser', x: 70, y: 42, size: 11, ls: .5 },
      { text: 'EW-DX EM 4', x: 70, y: 64, size: 9, ls: .5 },
      { text: 'SYNC', x: 560, y: 76, size: 7, anchor: 'middle' },
      { text: 'ESC', x: 610, y: 76, size: 7, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 4 }, { t: 'rj45', n: 4 },
      { t: 'iec_in', n: 1 },
    ] } },

  // Antenna splitters. Sennheiser's product overview is explicit that the BNCs
  // are on the REAR — two rows of four outputs plus the antenna inputs, the
  // cascade output and DC in. The front is only a standby button and its LED.
  { id: 'senn-asa-214', brand: 'Sennheiser', model: 'ASA 214', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 168, weight: 1.09, power: 3.4,
    bands: ['ASA 214-UHF: 470 - 870 MHz', 'ASA 214-1G8: 1785 - 1805 MHz'],
    src: 'https://docs.cloud.sennheiser.com/en-us/ew-g4/ew-g4/specifications-asa214.html',
    front: { elements: [
      { t: 'button', x: 34, y: 54, w: 26, h: 20 },
      { t: 'led', x: 70, y: 54 },
    ], labels: [
      { text: 'sennheiser', x: 22, y: 22, size: 9, ls: .5 },
      { text: 'ASA 214', x: 250, y: 60, size: 15, ls: 1, anchor: 'middle' },
      { text: 'ACTIVE ANTENNA SPLITTER', x: 250, y: 78, size: 7, ls: .4,
        anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'bnc', n: 11 }, { t: 'dcjack', n: 1 }] } },

  { id: 'senn-ewd-asa', brand: 'Sennheiser', model: 'EW-D ASA', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 168, weight: 1.1, power: 2.9, approx: true,
    bands: ['Q-R-S: 470 - 694 MHz', 'T-U-V-W: 694 - 1075 MHz',
            'X-Y: 1350 - 1805 MHz'],
    src: 'https://docs.cloud.sennheiser.com/en-us/ew-d/ew-d/ew-d-asa-overview.html',
    front: { elements: [
      { t: 'button', x: 34, y: 54, w: 26, h: 20 },
      { t: 'led', x: 70, y: 54 },
    ], labels: [
      { text: 'EW-D', x: 24, y: 22, size: 10, ls: .8 },
      { text: 'EW-D ASA', x: 250, y: 60, size: 15, ls: 1, anchor: 'middle' },
      { text: 'ACTIVE ANTENNA SPLITTER', x: 250, y: 78, size: 7, ls: .4,
        anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'bnc', n: 11 }, { t: 'dcjack', n: 1 }] } },

  // The tray the half-rack units live in — mount one or two side by side, or one
  // unit plus an AM 2 to bring the antennas to the front. Modelled as a shelf so
  // the app's half-rack shelf rule applies to it.
  { id: 'senn-ga3', brand: 'Sennheiser', model: 'GA 3 rack tray', category: 'wireless',
    shelf: true, ru: 1, depth: 220, weight: 0.9, power: 0, approx: true,
    src: 'https://www.sennheiser.com/en-us/catalog/products/accessories/ga-3/',
    front: { elements: [{ t: 'line', x: 500, y: 72, w: 840 }] } },

  // Front antenna feed-through: fills the spare half of a GA 3 with two BNC
  // bulkheads so the antennas land on the front of the rack.
  { id: 'senn-am2', brand: 'Sennheiser', model: 'AM 2 antenna front mount',
    category: 'wireless', half: true,
    ru: 1, depth: 80, weight: 0.2, power: 0, approx: true,
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/am-2/am-2-009912',
    front: { elements: [
      { t: 'bnc', x: 176, y: 56, n: 2, gap: 86 },
    ], labels: [
      { text: 'AM 2', x: 30, y: 22, size: 9, ls: .5 },
      { text: 'ANT A', x: 176, y: 92, size: 7, ls: .3, anchor: 'middle' },
      { text: 'ANT B', x: 262, y: 92, size: 7, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'bnc', n: 2 }] } },

  // ------------------------------------------------------------- RF Venue ---
  // Every RF Venue rack unit puts ALL of its antenna I/O on the rear — there is
  // not a single front BNC in the range. Fronts are a logo, a vent field, model
  // silkscreen, a rocker switch and a power LED; the channel LEDs on the
  // combiners are the only per-channel front indication. Drawn from the numbered
  // front/rear elevations in each product's own spec sheet.

  { id: 'rfvenue-distro4', brand: 'RF Venue', model: 'DISTRO4', category: 'wireless',
    ru: 1, depth: 250, weight: 2.15, power: 60,
    src: 'https://www.rfvenue.com/hubfs/Spec%20Sheets/DISTRO4%20Specifications.pdf',
    front: { elements: [
      { t: 'mesh', x: 470, y: 50, w: 460, h: 44 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 150, y: 55, size: 14, ls: 1.4 },
      { text: 'DISTRO4', x: 720, y: 45, size: 13, ls: .8 },
      { text: 'Antenna Distribution', x: 720, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 12 }, { t: 'dcjack', n: 4 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'rfvenue-distro9-hdr', brand: 'RF Venue', model: 'DISTRO9 HDR',
    category: 'wireless', ru: 1, depth: 250, weight: 2.7, approx: true,
    // spec sheet gives 100-240 VAC / 2 A, which is a supply rating rather than
    // a consumption figure — left out rather than guessed at.
    src: 'https://www.rfvenue.com/hubfs/Spec%20Sheets/DISTRO9_spec_REV1.pdf',
    front: { elements: [
      { t: 'mesh', x: 480, y: 50, w: 480, h: 44 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 150, y: 55, size: 14, ls: 1.4 },
      { text: 'DISTRO9 HDR', x: 700, y: 45, size: 13, ls: .8 },
      { text: 'Antenna Distribution', x: 700, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 22 }, { t: 'dcjack', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  // Half-width chassis: ships with short and long ears plus a joining plate, so
  // it mounts solo or paired with another RF Venue half-rack unit.
  { id: 'rfvenue-distro5-hdr', brand: 'RF Venue', model: 'DISTRO5 HDR',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 224, weight: 1.7, approx: true,
    src: 'https://www.rfvenue.com/hubfs/DFUs/DISTRO5_HDR_Specifications.pdf',
    front: { elements: [
      { t: 'mesh', x: 222, y: 50, w: 140, h: 42 },
      { t: 'button', x: 400, y: 50, w: 18, h: 24 },
    ], labels: [
      { text: 'RF VENUE', x: 26, y: 55, size: 11, ls: 1.1 },
      { text: 'DISTRO5', x: 310, y: 45, size: 11, ls: .6 },
      { text: 'HDR', x: 310, y: 62, size: 9, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 12 }, { t: 'dcjack', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'rfvenue-combine4', brand: 'RF Venue', model: 'COMBINE4', category: 'wireless',
    ru: 1, depth: 250, weight: 2.3, power: 60,
    src: 'https://www.rfvenue.com/hubfs/DFU-00009%20rev%20A%2c%20COMBINE4%20Spec%20Sheet.pdf',
    front: { elements: [
      { t: 'mesh', x: 330, y: 50, w: 180, h: 44 },
      { t: 'led', x: 456, y: 44, n: 4, gap: 44 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 150, y: 55, size: 14, ls: 1.4 },
      { text: 'CH1', x: 456, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'CH2', x: 500, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'CH3', x: 544, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'CH4', x: 588, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'COMBINE4', x: 668, y: 45, size: 13, ls: .8 },
      { text: 'Transmitter Combiner', x: 668, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 5 }, { t: 'dcjack', n: 4 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'rfvenue-combine6-hdr', brand: 'RF Venue', model: 'COMBINE6 HDR',
    category: 'wireless', half: true, ears: true,
    ru: 1, depth: 224, weight: 1.6, power: 40, approx: true,
    // 40 W is the rating of the external supply in the box, not measured draw.
    bands: ['USA + Canada: 470 - 608 MHz', "International: 470 - 698 MHz"],
    src: 'https://info.rfvenue.com/hubfs/DFUs/COMBINE6_HDR_Specifications.pdf',
    front: { elements: [
      { t: 'led', x: 155, y: 44, n: 6, gap: 24 },
      { t: 'button', x: 410, y: 50, w: 18, h: 24 },
    ], labels: [
      { text: 'RF VENUE', x: 26, y: 55, size: 11, ls: 1.1 },
      { text: '1', x: 155, y: 68, size: 7, anchor: 'middle' },
      { text: '2', x: 179, y: 68, size: 7, anchor: 'middle' },
      { text: '3', x: 203, y: 68, size: 7, anchor: 'middle' },
      { text: '4', x: 227, y: 68, size: 7, anchor: 'middle' },
      { text: '5', x: 251, y: 68, size: 7, anchor: 'middle' },
      { text: '6', x: 275, y: 68, size: 7, anchor: 'middle' },
      { text: 'COMBINE6', x: 310, y: 45, size: 11, ls: .6 },
      { text: 'HDR', x: 310, y: 62, size: 9, ls: .6 },
    ] },
    rear: { auto: [{ t: 'bnc', n: 10 }, { t: 'dcjack', n: 1 }] } },

  { id: 'rfvenue-combine8', brand: 'RF Venue', model: 'COMBINE8', category: 'wireless',
    ru: 1, depth: 260, weight: 3.7, power: 84,
    bands: ['USA + Canada: 470 - 608 MHz', "International: 470 - 698 MHz"],
    src: 'https://www.rfvenue.com/hubfs/Spec%20Sheets/COMBINE8_Spec_REV2.pdf',
    front: { elements: [
      { t: 'led', x: 325, y: 44, n: 8, gap: 47 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 150, y: 55, size: 14, ls: 1.4 },
      { text: 'CH1', x: 325, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'CH8', x: 654, y: 70, size: 7, ls: .3, anchor: 'middle' },
      { text: 'COMBINE8', x: 700, y: 45, size: 13, ls: .8 },
      { text: 'Transmitter Combiner', x: 700, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 9 }, { t: 'dcjack', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  // The 8 front LEDs map one-for-one onto the 8 rear zone inputs. The Lock knob
  // and display cycle RF attenuation / DC power / input on-off per channel.
  { id: 'rfvenue-4zone', brand: 'RF Venue', model: '4 ZONE', category: 'wireless',
    ru: 1, depth: 250, weight: 2.5, approx: true,
    src: 'https://www.rfvenue.com/hubfs/Spec%20Sheets/4ZONE%20SpecificationsREV2.pdf',
    front: { elements: [
      { t: 'knob', x: 205, y: 50, r: 15 },
      { t: 'display', x: 290, y: 50, w: 64, h: 34 },
      { t: 'led', x: 360, y: 44, n: 4, gap: 35 },
      { t: 'led', x: 553, y: 44, n: 4, gap: 35 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 88, y: 44, size: 11, ls: 1.1 },
      { text: 'Lock', x: 205, y: 76, size: 7, anchor: 'middle' },
      { text: 'B1', x: 360, y: 70, size: 7, anchor: 'middle' },
      { text: 'B4', x: 465, y: 70, size: 7, anchor: 'middle' },
      { text: 'A4', x: 553, y: 70, size: 7, anchor: 'middle' },
      { text: 'A1', x: 658, y: 70, size: 7, anchor: 'middle' },
      { text: '4 ZONE', x: 700, y: 45, size: 13, ls: .8 },
      { text: 'Antenna Combiner', x: 700, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [{ t: 'bnc', n: 10 }, { t: 'iec_in', n: 1 }] } },

  { id: 'rfvenue-4zone-net', brand: 'RF Venue', model: '4 ZONE-Network',
    category: 'wireless', ru: 1, depth: 250, weight: 2.5, approx: true,
    // The network port is in the spec table but not on a labelled panel diagram;
    // placed on the rear with the rest of the I/O, which is where it should be.
    src: 'https://www.rfvenue.com/hubfs/4Zone%20Network%202025/Spec%20Sheet/4ZONE-NETWORK%20SpecificationsREV1.pdf',
    front: { elements: [
      { t: 'knob', x: 205, y: 50, r: 15 },
      { t: 'display', x: 290, y: 50, w: 64, h: 34 },
      { t: 'led', x: 360, y: 44, n: 4, gap: 35 },
      { t: 'led', x: 553, y: 44, n: 4, gap: 35 },
      { t: 'button', x: 852, y: 50, w: 20, h: 26 },
      { t: 'led', x: 890, y: 50 },
    ], labels: [
      { text: 'RF VENUE', x: 88, y: 44, size: 11, ls: 1.1 },
      { text: 'Lock', x: 205, y: 76, size: 7, anchor: 'middle' },
      { text: 'B1', x: 360, y: 70, size: 7, anchor: 'middle' },
      { text: 'B4', x: 465, y: 70, size: 7, anchor: 'middle' },
      { text: 'A4', x: 553, y: 70, size: 7, anchor: 'middle' },
      { text: 'A1', x: 658, y: 70, size: 7, anchor: 'middle' },
      { text: '4 ZONE-NETWORK', x: 676, y: 45, size: 12, ls: .6 },
      { text: 'Multi-Zone Combiner', x: 676, y: 63, size: 8, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 10 }, { t: 'rj45', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  // ---------------------------------------------------------------- Shure ---
  // Drawn from the orthographic line drawings in Shure's own user guides at
  // pubs.shure.com. AD4D and AD4Q were measured pixel-for-pixel off those
  // drawings; the rest are proportioned from the same class of drawing.
  //
  // Shure's half-rack chassis is 197 mm rather than the 212 mm Sennheiser uses,
  // so on screen they are drawn a few mm wide — see README.

  { id: 'shure-ad4d', brand: 'Shure', model: 'AD4D', category: 'wireless',
    ru: 1, depth: 333, weight: 4.6, power: 23, approx: true,
    // 23 W is the published maximum thermal dissipation, not a consumption spec.
    bands: ['G53: 470 - 510 MHz', 'G54: 479 - 565 MHz', 'G55: 470 - 636 MHz',
            'G56: 470 - 636 MHz', 'G57: 470 - 616 MHz', 'H54: 520 - 636 MHz',
            'K53: 606 - 698 MHz', 'K57: 606 - 790 MHz', 'L54: 630 - 787 MHz',
            'X55: 941 - 960 MHz'],
    src: 'https://pubs.shure.com/view/guide/AD4D/en-US.pdf',
    front: { elements: [
      { t: 'knob', x: 166, y: 32, r: 10 },
      { t: 'trs', x: 166, y: 74 },
      { t: 'bar', x: 205, y: 34, w: 14, h: 20, rx: 2 },
      { t: 'led', x: 205, y: 70 },
      { t: 'bar', x: 225, y: 34, w: 8, h: 8, rx: 1 },
      // channel 1
      { t: 'button', x: 250, y: 30, w: 22, h: 18 },
      { t: 'button', x: 250, y: 70, w: 22, h: 15 },
      { t: 'meter', x: 284, y: 50, n: 5, h: 44 },
      { t: 'meter', x: 306, y: 50, n: 5, h: 44 },
      { t: 'vline', x: 338, y: 50, h: 60 },
      // channel 2 — an identical repeat
      { t: 'button', x: 372, y: 30, w: 22, h: 18 },
      { t: 'button', x: 372, y: 70, w: 22, h: 15 },
      { t: 'meter', x: 406, y: 50, n: 5, h: 44 },
      { t: 'meter', x: 428, y: 50, n: 5, h: 44 },
      { t: 'display', x: 640, y: 50, w: 118, h: 56 },
      { t: 'button', x: 728, y: 32, w: 18, h: 16 },
      { t: 'button', x: 752, y: 32, w: 18, h: 16 },
      { t: 'button', x: 728, y: 68, w: 18, h: 16 },
      { t: 'button', x: 752, y: 68, w: 18, h: 16 },
      { t: 'button', x: 782, y: 32, w: 22, h: 16 },
      { t: 'button', x: 782, y: 68, w: 22, h: 16 },
      { t: 'encoder', x: 815, y: 50, r: 17 },
      { t: 'button', x: 850, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'SHURE', x: 82, y: 38, size: 12, ls: 1 },
      { text: 'AD4D', x: 82, y: 60, size: 10, ls: .6 },
      { text: '1', x: 250, y: 94, size: 7, anchor: 'middle' },
      { text: '2', x: 372, y: 94, size: 7, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 4 }, { t: 'xlrm', n: 3 }, { t: 'trs', n: 2 },
      { t: 'rj45', n: 4 }, { t: 'iec_in', n: 1 }, { t: 'iec_thru', n: 1 },
    ] } },

  { id: 'shure-ad4q', brand: 'Shure', model: 'AD4Q', category: 'wireless',
    ru: 1, depth: 333, weight: 4.8, power: 31, approx: true,
    bands: ['G53: 470 - 510 MHz', 'G54: 479 - 565 MHz', 'G55: 470 - 636 MHz',
            'G56: 470 - 636 MHz', 'G57: 470 - 616 MHz', 'H54: 520 - 636 MHz',
            'K53: 606 - 698 MHz', 'K57: 606 - 790 MHz', 'L54: 630 - 787 MHz',
            'X55: 941 - 960 MHz'],
    src: 'https://pubs.shure.com/view/guide/AD4Q/en-US.pdf',
    front: { elements: [
      { t: 'knob', x: 150, y: 32, r: 10 },
      { t: 'trs', x: 150, y: 74 },
      { t: 'bar', x: 188, y: 34, w: 14, h: 20, rx: 2 },
      { t: 'led', x: 188, y: 70 },
      // RX 1-4, four identical repeats
      { t: 'button', x: 228, y: 30, w: 20, h: 18 },
      { t: 'button', x: 228, y: 70, w: 20, h: 15 },
      { t: 'meter', x: 258, y: 50, n: 5, h: 44 },
      { t: 'meter', x: 276, y: 50, n: 5, h: 44 },
      { t: 'button', x: 298, y: 30, w: 20, h: 18 },
      { t: 'button', x: 298, y: 70, w: 20, h: 15 },
      { t: 'meter', x: 328, y: 50, n: 5, h: 44 },
      { t: 'meter', x: 346, y: 50, n: 5, h: 44 },
      { t: 'button', x: 368, y: 30, w: 20, h: 18 },
      { t: 'button', x: 368, y: 70, w: 20, h: 15 },
      { t: 'meter', x: 398, y: 50, n: 5, h: 44 },
      { t: 'meter', x: 416, y: 50, n: 5, h: 44 },
      { t: 'button', x: 438, y: 30, w: 20, h: 18 },
      { t: 'button', x: 438, y: 70, w: 20, h: 15 },
      { t: 'meter', x: 468, y: 50, n: 5, h: 44 },
      { t: 'meter', x: 486, y: 50, n: 5, h: 44 },
      { t: 'display', x: 620, y: 50, w: 110, h: 56 },
      { t: 'button', x: 706, y: 32, w: 18, h: 16 },
      { t: 'button', x: 730, y: 32, w: 18, h: 16 },
      { t: 'button', x: 706, y: 68, w: 18, h: 16 },
      { t: 'button', x: 730, y: 68, w: 18, h: 16 },
      { t: 'button', x: 762, y: 32, w: 22, h: 16 },
      { t: 'button', x: 762, y: 68, w: 22, h: 16 },
      { t: 'encoder', x: 800, y: 50, r: 17 },
      { t: 'button', x: 845, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'SHURE', x: 80, y: 38, size: 11, ls: 1 },
      { text: 'AD4Q', x: 80, y: 60, size: 10, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'trs', n: 4 },
      { t: 'rj45', n: 4 }, { t: 'iec_in', n: 1 }, { t: 'iec_thru', n: 1 },
    ] } },

  // Wideband — one model covers 174 MHz to 2 GHz, so there is no band dropdown.
  // Six antenna inputs on the rear.
  { id: 'shure-ad600', brand: 'Shure', model: 'AD600', category: 'wireless',
    ru: 1, depth: 286, weight: 3.7, approx: true,
    src: 'https://pubs.shure.com/view/guide/AD600/en-US.pdf',
    front: { elements: [
      { t: 'knob', x: 150, y: 32, r: 11 },
      { t: 'trs', x: 150, y: 74 },
      { t: 'vent', x: 228, y: 50, w: 64, h: 48, pitch: 12 },
      { t: 'display', x: 430, y: 50, w: 300, h: 58 },
      { t: 'button', x: 631, y: 32, w: 18, h: 16 },
      { t: 'button', x: 655, y: 32, w: 18, h: 16 },
      { t: 'button', x: 631, y: 68, w: 18, h: 16 },
      { t: 'button', x: 655, y: 68, w: 18, h: 16 },
      { t: 'button', x: 690, y: 32, w: 22, h: 16 },
      { t: 'button', x: 690, y: 68, w: 22, h: 16 },
      { t: 'encoder', x: 736, y: 50, r: 17 },
      { t: 'button', x: 786, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'SHURE', x: 80, y: 38, size: 11, ls: 1 },
      { text: 'AD600', x: 80, y: 60, size: 10, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 6 }, { t: 'rj45', n: 4 }, { t: 'usba', n: 1 },
      { t: 'iec_in', n: 1 }, { t: 'iec_thru', n: 1 },
    ] } },

  { id: 'shure-ulxd4', brand: 'Shure', model: 'ULXD4', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 171, weight: 0.91, approx: true,
    bands: ['V50: 174 - 216 MHz', 'G50: 470 - 534 MHz', 'H50: 534 - 598 MHz',
            'J50A: 572 - 608 / 614 - 616 MHz', 'L50: 632 - 696 MHz',
            'X52: 902 - 928 MHz'],
    src: 'https://pubs.shure.com/view/guide/ULXD/en-US.pdf',
    front: { elements: [
      { t: 'bar', x: 28, y: 34, w: 12, h: 18, rx: 2 },
      { t: 'led', x: 28, y: 70 },
      { t: 'led', x: 50, y: 30 },
      { t: 'led', x: 50, y: 48 },
      { t: 'display', x: 135, y: 52, w: 120, h: 48 },
      { t: 'button', x: 225, y: 26, w: 22, h: 15 },
      { t: 'button', x: 225, y: 52, w: 22, h: 15 },
      { t: 'button', x: 225, y: 78, w: 22, h: 15 },
      { t: 'encoder', x: 262, y: 52, r: 15 },
      { t: 'meter', x: 295, y: 52, n: 4, h: 36 },
      { t: 'meter', x: 313, y: 52, n: 4, h: 36 },
      { t: 'button', x: 338, y: 32, w: 14, h: 13 },
      { t: 'button', x: 338, y: 72, w: 14, h: 13 },
      { t: 'button', x: 375, y: 52, w: 18, h: 22 },
    ], labels: [
      { text: 'ULXD4', x: 135, y: 18, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'trs', n: 1 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  { id: 'shure-ulxd4d', brand: 'Shure', model: 'ULXD4D', category: 'wireless',
    ru: 1, depth: 274, weight: 3.36, approx: true,
    bands: ['V50: 174 - 216 MHz', 'G50: 470 - 534 MHz', 'H50: 534 - 598 MHz',
            'J50A: 572 - 608 / 614 - 616 MHz', 'L50: 632 - 696 MHz',
            'X52: 902 - 928 MHz'],
    src: 'https://pubs.shure.com/view/guide/ULXD-DQ/en-US.pdf',
    front: { elements: [
      { t: 'bar', x: 114, y: 34, w: 14, h: 20, rx: 2 },
      { t: 'led', x: 114, y: 70 },
      { t: 'led', x: 150, y: 30 },
      { t: 'led', x: 150, y: 48 },
      { t: 'display', x: 300, y: 50, w: 150, h: 54 },
      { t: 'button', x: 396, y: 26, w: 24, h: 15 },
      { t: 'button', x: 396, y: 50, w: 24, h: 15 },
      { t: 'button', x: 396, y: 74, w: 24, h: 15 },
      { t: 'encoder', x: 435, y: 50, r: 16 },
      // RX 1-2 in the same positions the ULXD4Q uses
      { t: 'button', x: 476, y: 30, w: 20, h: 16 },
      { t: 'meter', x: 506, y: 50, n: 5, h: 42 },
      { t: 'meter', x: 524, y: 50, n: 5, h: 42 },
      { t: 'button', x: 546, y: 32, w: 14, h: 13 },
      { t: 'button', x: 546, y: 70, w: 14, h: 13 },
      { t: 'button', x: 586, y: 30, w: 20, h: 16 },
      { t: 'meter', x: 616, y: 50, n: 5, h: 42 },
      { t: 'meter', x: 634, y: 50, n: 5, h: 42 },
      { t: 'button', x: 656, y: 32, w: 14, h: 13 },
      { t: 'button', x: 656, y: 70, w: 14, h: 13 },
      { t: 'button', x: 899, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'SHURE', x: 78, y: 32, size: 10, ls: .8 },
      { text: 'ULXD4D', x: 78, y: 54, size: 9, ls: .5 },
      { text: 'RX 1', x: 500, y: 94, size: 7, anchor: 'middle' },
      { text: 'RX 2', x: 610, y: 94, size: 7, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 4 }, { t: 'xlrm', n: 2 }, { t: 'rj45', n: 2 },
      { t: 'iec_in', n: 1 },
    ] } },

  { id: 'shure-ulxd4q', brand: 'Shure', model: 'ULXD4Q', category: 'wireless',
    ru: 1, depth: 274, weight: 3.45, approx: true,
    bands: ['V50: 174 - 216 MHz', 'G50: 470 - 534 MHz', 'H50: 534 - 598 MHz',
            'J50A: 572 - 608 / 614 - 616 MHz', 'L50: 632 - 696 MHz',
            'X52: 902 - 928 MHz'],
    src: 'https://pubs.shure.com/view/guide/ULXD-DQ/en-US.pdf',
    front: { elements: [
      { t: 'bar', x: 114, y: 34, w: 14, h: 20, rx: 2 },
      { t: 'led', x: 114, y: 70 },
      { t: 'led', x: 150, y: 30 },
      { t: 'led', x: 150, y: 48 },
      { t: 'display', x: 296, y: 50, w: 142, h: 54 },
      { t: 'button', x: 388, y: 26, w: 22, h: 15 },
      { t: 'button', x: 388, y: 50, w: 22, h: 15 },
      { t: 'button', x: 388, y: 74, w: 22, h: 15 },
      { t: 'encoder', x: 424, y: 50, r: 15 },
      { t: 'button', x: 462, y: 30, w: 18, h: 16 },
      { t: 'meter', x: 488, y: 50, n: 5, h: 42 },
      { t: 'meter', x: 504, y: 50, n: 5, h: 42 },
      { t: 'button', x: 524, y: 32, w: 13, h: 12 },
      { t: 'button', x: 524, y: 70, w: 13, h: 12 },
      { t: 'button', x: 556, y: 30, w: 18, h: 16 },
      { t: 'meter', x: 582, y: 50, n: 5, h: 42 },
      { t: 'meter', x: 598, y: 50, n: 5, h: 42 },
      { t: 'button', x: 618, y: 32, w: 13, h: 12 },
      { t: 'button', x: 618, y: 70, w: 13, h: 12 },
      { t: 'button', x: 650, y: 30, w: 18, h: 16 },
      { t: 'meter', x: 676, y: 50, n: 5, h: 42 },
      { t: 'meter', x: 692, y: 50, n: 5, h: 42 },
      { t: 'button', x: 712, y: 32, w: 13, h: 12 },
      { t: 'button', x: 712, y: 70, w: 13, h: 12 },
      { t: 'button', x: 744, y: 30, w: 18, h: 16 },
      { t: 'meter', x: 770, y: 50, n: 5, h: 42 },
      { t: 'meter', x: 786, y: 50, n: 5, h: 42 },
      { t: 'button', x: 806, y: 32, w: 13, h: 12 },
      { t: 'button', x: 806, y: 70, w: 13, h: 12 },
      { t: 'button', x: 899, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'SHURE', x: 78, y: 32, size: 10, ls: .8 },
      { text: 'ULXD4Q', x: 78, y: 54, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'rj45', n: 2 },
      { t: 'iec_in', n: 1 },
    ] } },

  { id: 'shure-qlxd4', brand: 'Shure', model: 'QLXD4', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 151, weight: 0.78, approx: true,
    bands: ['V50: 174 - 216 MHz', 'G50: 470 - 534 MHz', 'H50: 534 - 598 MHz',
            'J50A: 572 - 608 / 614 - 616 MHz'],
    src: 'https://pubs.shure.com/view/guide/QLXD/en-US.pdf',
    front: { elements: [
      { t: 'display', x: 152, y: 52, w: 128, h: 48 },
      { t: 'button', x: 246, y: 32, w: 16, h: 14 },
      { t: 'button', x: 246, y: 72, w: 16, h: 14 },
      { t: 'button', x: 282, y: 32, w: 26, h: 14 },
      { t: 'button', x: 282, y: 72, w: 26, h: 14 },
      { t: 'button', x: 324, y: 52, w: 22, h: 16 },
      { t: 'button', x: 370, y: 52, w: 20, h: 20 },
    ], labels: [
      { text: 'SHURE', x: 26, y: 42, size: 9, ls: .8 },
      { text: 'QLXD4', x: 26, y: 62, size: 8, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'trs', n: 1 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  { id: 'shure-slxd4', brand: 'Shure', model: 'SLXD4', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 152, weight: 0.82, approx: true,
    bands: ['G58: 470 - 514 MHz', 'G59: 470 - 514 MHz', 'G60: 470 - 510 MHz',
            'G61: 479 - 523 MHz', 'G62: 510 - 530 MHz', 'H55: 514 - 558 MHz',
            'H56: 518 - 562 MHz', 'H57: 520 - 564 MHz', 'J52: 558 - 616 MHz',
            'K59: 606 - 650 MHz'],
    src: 'https://pubs.shure.com/view/guide/SLXD/en-US.pdf',
    front: { elements: [
      { t: 'led', x: 34, y: 32 },
      { t: 'bar', x: 34, y: 66, w: 12, h: 16, rx: 2 },
      { t: 'display', x: 162, y: 52, w: 118, h: 48 },
      { t: 'button', x: 234, y: 32, w: 24, h: 15 },
      { t: 'button', x: 234, y: 72, w: 24, h: 15 },
      { t: 'encoder', x: 274, y: 52, r: 16 },
      { t: 'button', x: 314, y: 52, w: 20, h: 20 },
    ], labels: [
      { text: 'SLXD4', x: 162, y: 18, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'xlrm', n: 1 }, { t: 'trs', n: 1 },
      { t: 'rj45', n: 1 }, { t: 'dcjack', n: 1 },
    ] } },

  { id: 'shure-p10t', brand: 'Shure', model: 'P10T (PSM1000)', category: 'wireless',
    ru: 1, depth: 343, weight: 4.7, approx: true,
    bands: ['G10: 470 - 542 MHz', 'G11: 479 - 542 MHz', 'G62: 510 - 530 MHz',
            'H8Z: 518 - 582 MHz', 'J8: 554 - 626 MHz', 'J8A: 554 - 616 MHz',
            'K10E: 596 - 668 MHz', 'L8: 626 - 698 MHz'],
    src: 'https://pubs.shure.com/view/guide/PSM1000/en-US.pdf',
    front: { elements: [
      // transmitter 1
      { t: 'bar', x: 112, y: 34, w: 12, h: 18, rx: 2 },
      { t: 'button', x: 150, y: 52, w: 22, h: 16 },
      { t: 'meter', x: 190, y: 50, n: 5, h: 44 },
      { t: 'meter', x: 208, y: 50, n: 5, h: 44 },
      { t: 'display', x: 275, y: 50, w: 90, h: 46 },
      { t: 'button', x: 335, y: 32, w: 16, h: 13 },
      { t: 'button', x: 335, y: 70, w: 16, h: 13 },
      { t: 'vline', x: 366, y: 50, h: 60 },
      // transmitter 2 — an identical repeat
      { t: 'bar', x: 392, y: 34, w: 12, h: 18, rx: 2 },
      { t: 'button', x: 430, y: 52, w: 22, h: 16 },
      { t: 'meter', x: 470, y: 50, n: 5, h: 44 },
      { t: 'meter', x: 488, y: 50, n: 5, h: 44 },
      { t: 'display', x: 555, y: 50, w: 90, h: 46 },
      { t: 'button', x: 615, y: 32, w: 16, h: 13 },
      { t: 'button', x: 615, y: 70, w: 16, h: 13 },
      // shared monitor cluster
      { t: 'encoder', x: 665, y: 50, r: 18 },
      { t: 'button', x: 712, y: 50, w: 28, h: 16 },
      { t: 'trs', x: 762, y: 50 },
      { t: 'button', x: 812, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'SHURE', x: 78, y: 60, size: 10, ls: .8 },
      { text: 'PSM 1000  P10T', x: 275, y: 18, size: 8, ls: .5, anchor: 'middle' },
      { text: 'MONITOR', x: 712, y: 76, size: 7, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 2 }, { t: 'combo', n: 4 }, { t: 'jack', n: 2 },
      { t: 'rj45', n: 2 }, { t: 'iec_in', n: 1 }, { t: 'iec_thru', n: 1 },
    ] } },

  { id: 'shure-p9t', brand: 'Shure', model: 'P9T (PSM900)', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 177, weight: 0.85, approx: true,
    bands: ['G6: 460 - 506 MHz', 'G7: 506 - 542 MHz', 'K1: 596 - 632 MHz',
            'L6: 656 - 692 MHz'],
    src: 'https://pubs.shure.com/view/guide/PSM900/en-US.pdf',
    front: { elements: [
      { t: 'button', x: 30, y: 32, w: 14, h: 13 },
      { t: 'button', x: 30, y: 68, w: 14, h: 13 },
      { t: 'meter', x: 56, y: 50, n: 5, h: 44 },
      { t: 'display', x: 138, y: 52, w: 96, h: 46 },
      { t: 'button', x: 208, y: 32, w: 24, h: 15 },
      { t: 'button', x: 208, y: 72, w: 24, h: 15 },
      { t: 'button', x: 246, y: 52, w: 20, h: 16 },
      { t: 'knob', x: 284, y: 34, r: 12 },
      { t: 'trs', x: 284, y: 76 },
      { t: 'led', x: 316, y: 52 },
      { t: 'button', x: 348, y: 52, w: 20, h: 20 },
    ], labels: [
      { text: 'PSM 900  P9T', x: 138, y: 18, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 1 }, { t: 'combo', n: 2 }, { t: 'jack', n: 1 },
      { t: 'dcjack', n: 1 },
    ] } },

  { id: 'shure-p3t', brand: 'Shure', model: 'P3T (PSM300)', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 172, weight: 0.78, approx: true,
    bands: ['G20: 488 - 512 MHz', 'H8E: 518 - 542 MHz', 'H20: 518 - 542 MHz',
            'J13: 566 - 590 MHz', 'J10: 584 - 608 MHz', 'K3E: 606 - 630 MHz',
            'K12: 614 - 638 MHz', 'L18: 630 - 654 MHz', 'M16: 686 - 710 MHz'],
    src: 'https://pubs.shure.com/view/guide/PSM300/en-US.pdf',
    front: { elements: [
      { t: 'knob', x: 58, y: 40, r: 13 },
      { t: 'bar', x: 58, y: 78, w: 12, h: 12, rx: 2 },
      { t: 'button', x: 98, y: 52, w: 20, h: 16 },
      { t: 'display', x: 184, y: 52, w: 100, h: 46 },
      { t: 'button', x: 256, y: 52, w: 28, h: 16 },
      { t: 'button', x: 294, y: 52, w: 28, h: 16 },
      { t: 'button', x: 340, y: 52, w: 20, h: 20 },
    ], labels: [
      { text: 'PSM 300  P3T', x: 184, y: 18, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 1 }, { t: 'jack', n: 4 }, { t: 'dcjack', n: 1 },
    ] } },

  // Antenna distribution. The UA844+ is one of the few units in this whole
  // library with BNCs on its FRONT face — an antenna connection each side.
  { id: 'shure-ua844swb', brand: 'Shure', model: 'UA844+SWB', category: 'wireless',
    ru: 1, depth: 172, weight: 1.62, approx: true,
    bands: ['UA844+V: 174 - 216 MHz', 'UA844+SWB: 470 - 960 MHz',
            'UA844+Z16: 1240 - 1260 MHz', 'UA844+Z17: 1492 - 1525 MHz',
            'UA844+Z18: 1785 - 1805 MHz'],
    src: 'https://pubs.shure.com/view/guide/UA844SWBPLUS/en-US.pdf',
    front: { elements: [
      { t: 'bnc', x: 185, y: 50 },
      { t: 'led', x: 614, y: 50 },
      { t: 'button', x: 658, y: 50, w: 22, h: 20 },
      { t: 'bnc', x: 754, y: 50 },
    ], labels: [
      { text: 'SHURE', x: 440, y: 44, size: 13, ls: 1.2, anchor: 'middle' },
      { text: 'UA844+SWB', x: 440, y: 66, size: 9, ls: .5, anchor: 'middle' },
      { text: 'ANT A', x: 185, y: 88, size: 7, ls: .3, anchor: 'middle' },
      { text: 'ANT B', x: 754, y: 88, size: 7, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 12 }, { t: 'dcjack', n: 3 },
    ] } },

  { id: 'shure-ua845uwb', brand: 'Shure', model: 'UA845UWB', category: 'wireless',
    ru: 1, depth: 295, weight: 3.32, approx: true,
    // Renamed from UA845SWB. The front-panel band LEDs show which of the five
    // supported ranges is selected; front antenna mounts sit in the ear region.
    src: 'https://pubs.shure.com/view/guide/UA845UWB/en-US.pdf',
    front: { elements: [
      { t: 'bnc', x: 112, y: 50 },
      { t: 'led', x: 316, y: 34 },
      { t: 'led', x: 316, y: 68 },
      { t: 'led', x: 410, y: 50, n: 5, gap: 26 },
      { t: 'button', x: 580, y: 50, w: 20, h: 18 },
      { t: 'button', x: 700, y: 50, w: 22, h: 22 },
      { t: 'bnc', x: 790, y: 50 },
    ], labels: [
      { text: 'SHURE', x: 176, y: 34, size: 11, ls: 1 },
      { text: 'UA845UWB', x: 176, y: 76, size: 8, ls: .5 },
      { text: 'OL', x: 340, y: 54, size: 6 },
      { text: 'BAND', x: 462, y: 80, size: 6, ls: .3, anchor: 'middle' },
      { text: 'SET', x: 580, y: 80, size: 6, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 12 }, { t: 'dcjack', n: 4 },
      { t: 'iec_in', n: 1 }, { t: 'iec_thru', n: 1 },
    ] } },

  { id: 'shure-pa421b', brand: 'Shure', model: 'PA421B', category: 'wireless',
    ru: 1, depth: 365, weight: 4.3, power: 98,
    // 4-to-1 PSM combiner that also feeds DC to four transmitters. The chassis is
    // 401 mm; the integrated end brackets bring it to a standard 19" mount.
    bands: ['PA421B: 470 - 865 MHz', 'PA421BX: 865 - 960 MHz'],
    src: 'https://pubs.shure.com/view/guide/PA421B-PA821B/en-US.pdf',
    front: { elements: [
      { t: 'bnc', x: 218, y: 50 },
      { t: 'led', x: 262, y: 34, n: 2, gap: 20 },
      { t: 'led', x: 262, y: 68, n: 2, gap: 20 },
      { t: 'vent', x: 420, y: 50, w: 190, h: 48, pitch: 14 },
      { t: 'bnc', x: 570, y: 50 },
      { t: 'bnc', x: 620, y: 50 },
      { t: 'bnc', x: 670, y: 50 },
      { t: 'led', x: 720, y: 50 },
      { t: 'button', x: 760, y: 50, w: 22, h: 20 },
    ], labels: [
      { text: 'SHURE', x: 96, y: 36, size: 11, ls: 1 },
      { text: 'PA421B', x: 96, y: 58, size: 9, ls: .5 },
      { text: 'MAIN', x: 218, y: 88, size: 6, anchor: 'middle' },
      { text: 'EXPANSION', x: 620, y: 88, size: 6, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 4 }, { t: 'dcjack', n: 4 }, { t: 'iec_in', n: 1 },
    ] } },

  // 8-to-1 PSM combiner. Same chassis and front layout as the PA421B, but the
  // rear takes eight transmitters and it does NOT distribute DC.
  { id: 'shure-pa821b', brand: 'Shure', model: 'PA821B', category: 'wireless',
    ru: 1, depth: 365, weight: 4.8, power: 143,
    bands: ['PA821B: 470 - 865 MHz', 'PA821BX: 865 - 960 MHz'],
    src: 'https://pubs.shure.com/view/guide/PA421B-PA821B/en-US.pdf',
    front: { elements: [
      { t: 'bnc', x: 105, y: 50 },
      { t: 'led', x: 165, y: 34, n: 4, gap: 14 },
      { t: 'led', x: 165, y: 66, n: 4, gap: 14 },
      { t: 'vent', x: 478, y: 50, w: 250, h: 46, pitch: 14 },
      { t: 'bnc', x: 640, y: 50 },
      { t: 'bnc', x: 690, y: 50 },
      { t: 'bnc', x: 740, y: 50 },
      { t: 'led', x: 800, y: 50 },
      { t: 'button', x: 850, y: 50, w: 22, h: 22 },
    ], labels: [
      { text: 'MAIN OUT', x: 105, y: 88, size: 6, ls: .3, anchor: 'middle' },
      { text: 'SHURE', x: 240, y: 32, size: 11, ls: 1 },
      { text: 'ACTIVE COMBINER', x: 240, y: 54, size: 7.5, ls: .5 },
      { text: 'PA821B', x: 240, y: 74, size: 8, ls: .5 },
      { text: 'EXPANSION', x: 690, y: 88, size: 6, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'bnc', n: 8 }, { t: 'iec_in', n: 1 }] } },

  // Half-rack 4-channel combiner for PSM300, with DC distribution. Ships with a
  // rack kit, so it bolts in like the other half-rack RF gear.
  { id: 'shure-pa411', brand: 'Shure', model: 'PA411', category: 'wireless',
    half: true, ears: true, ru: 1, depth: 177, weight: 1.32, approx: true,
    bands: ['PA411: 470 - 865 MHz'],
    src: 'https://pubs.shure.com/view/guide/PA411/en-US.pdf',
    front: { elements: [
      { t: 'bnc', x: 48, y: 52 },
      { t: 'led', x: 110, y: 52, n: 4, gap: 16 },
      { t: 'vent', x: 250, y: 52, w: 130, h: 44, pitch: 12 },
      { t: 'led', x: 350, y: 52 },
      { t: 'button', x: 392, y: 52, w: 20, h: 18 },
    ], labels: [
      { text: 'PA411', x: 48, y: 20, size: 8, ls: .5, anchor: 'middle' },
      { text: 'INPUT SIGNAL', x: 133, y: 22, size: 6, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'bnc', n: 4 }, { t: 'dcjack', n: 2 }] } },

  // ------------------------------------------------------------- charging ---
  // The only Shure charger that rack mounts natively — everything else in the
  // range (SBC220/240, SBC450/850, SBC840/840M) is a desktop or wall unit.
  { id: 'shure-sbrc', brand: 'Shure', model: 'SBRC charge station', category: 'charging',
    ru: 1, depth: 366, weight: 4.4, power: 60, approx: true,
    // 60 W is the published DC output rating; no AC input wattage is published.
    src: 'https://pubs.shure.com/view/guide/SBRC/en-US.pdf',
    front: { elements: [
      { t: 'display', x: 200, y: 50, w: 84, h: 40 },
      { t: 'button', x: 266, y: 26, w: 22, h: 15 },
      { t: 'button', x: 266, y: 50, w: 22, h: 15 },
      { t: 'button', x: 266, y: 74, w: 22, h: 15 },
      // two module bays, then four handheld charging cups
      { t: 'bar', x: 350, y: 50, w: 120, h: 66, rx: 4 },
      { t: 'bar', x: 478, y: 50, w: 120, h: 66, rx: 4 },
      { t: 'led', x: 556, y: 50, n: 4, gap: 16 },
      { t: 'bar', x: 640, y: 50, w: 52, h: 62, rx: 26 },
      { t: 'bar', x: 700, y: 50, w: 52, h: 62, rx: 26 },
      { t: 'bar', x: 760, y: 50, w: 52, h: 62, rx: 26 },
      { t: 'bar', x: 820, y: 50, w: 52, h: 62, rx: 26 },
    ], labels: [
      { text: 'SHURE', x: 80, y: 30, size: 10, ls: .8 },
      { text: 'Charge System', x: 80, y: 52, size: 7, ls: .3 },
      { text: 'SBRC', x: 80, y: 72, size: 8, ls: .5 },
    ] },
    rear: { auto: [{ t: 'rj45', n: 1 }, { t: 'iec_in', n: 1 }] } },

  // Legacy analog Axient distro — still in plenty of touring racks.
  { id: 'shure-axt630', brand: 'Shure', model: 'AXT630', category: 'wireless',
    ru: 1, depth: 366, weight: 4.6, approx: true,
    bands: ['AXT630: 470 - 698 MHz', 'AXT631: 606 - 814 MHz',
            'AXT632: 470 - 510 / 630 - 787 MHz'],
    src: 'https://pubs.shure.com/view/guide/AXT630/en-US.pdf',
    front: { elements: [
      { t: 'display', x: 262, y: 50, w: 122, h: 50 },
      { t: 'button', x: 344, y: 28, w: 20, h: 15 },
      { t: 'button', x: 344, y: 50, w: 20, h: 15 },
      { t: 'button', x: 344, y: 72, w: 20, h: 15 },
      { t: 'button', x: 798, y: 50, w: 22, h: 22 },
    ], labels: [
      { text: 'SHURE', x: 96, y: 36, size: 11, ls: 1 },
      { text: 'AXT630', x: 96, y: 58, size: 9, ls: .5 },
      { text: 'ANTENNA DISTRIBUTION', x: 96, y: 78, size: 6, ls: .3 },
      { text: 'POWER', x: 798, y: 80, size: 6, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'bnc', n: 12 }, { t: 'rj45', n: 2 },
      { t: 'iec_in', n: 1 }, { t: 'iec_thru', n: 1 },
    ] } },

  // Sennheiser's bidirectional wideband flagship. Dimensions, weight and the
  // 70 W figure are from Sennheiser's own spec page; the front-panel INVENTORY
  // (OLED, jog wheel, headphone out with volume) is confirmed but the exact
  // positions are not — no orthographic front view could be obtained, so only
  // confirmed elements are drawn, in the EW-DX house style. See TODO.
  { id: 'senn-spectera-base', brand: 'Sennheiser', model: 'Spectera Base Station',
    category: 'wireless', ru: 1, depth: 373, weight: 6.3, power: 70, approx: true,
    src: 'https://docs.cloud.sennheiser.com/en-us/spectera-solution/spectera/spec-base-station.html',
    front: { elements: [
      { t: 'display', x: 400, y: 50, w: 300, h: 56 },
      { t: 'encoder', x: 620, y: 50, r: 19 },
      { t: 'button', x: 684, y: 50, w: 30, h: 20 },
      { t: 'trs', x: 780, y: 50 },
      { t: 'knob', x: 840, y: 50, r: 13 },
      { t: 'button', x: 895, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'sennheiser', x: 78, y: 42, size: 11, ls: .5 },
      { text: 'SPECTERA', x: 78, y: 66, size: 9, ls: .8 },
    ] },
    // RF distribution is done by the DAD antenna over Cat5e/PoE, not by a rack
    // splitter — there is no rack antenna unit in the Spectera range.
    rear: { auto: [
      { t: 'rj45', n: 7 }, { t: 'sfp', n: 2 }, { t: 'bnc', n: 2 },
      { t: 'iec_in', n: 1 },
    ] } },

  // ------------------------------------------------------------- charging ---
  // 19" 1U, four front-loading module bays. Each module (LM 6060/6061/6062 for
  // Digital 6000/9000, LM 6070 for EW-D/EW-DX/EW-DP) holds two packs, so a full
  // chassis charges eight. The modules are inserts, not rack units, so they are
  // not separate library entries — an empty bay ships with a dummy cap.
  { id: 'senn-l6000', brand: 'Sennheiser', model: 'L 6000 charging station',
    category: 'charging', ru: 1, depth: 373, weight: 5.1, power: 85, approx: true,
    src: 'https://www.sennheiser.com/en-us/catalog/products/wireless-systems/l-6000/l-6000-507300',
    front: { elements: [
      { t: 'bar', x: 245, y: 50, n: 4, gap: 190, w: 182, h: 78, rx: 4 },
      { t: 'bar', x: 200, y: 44, n: 4, gap: 190, w: 72, h: 44, rx: 3 },
      { t: 'bar', x: 290, y: 44, n: 4, gap: 190, w: 72, h: 44, rx: 3 },
      { t: 'led', x: 200, y: 80, n: 4, gap: 190 },
      { t: 'led', x: 290, y: 80, n: 4, gap: 190 },
    ], labels: [
      { text: 'sennheiser', x: 70, y: 44, size: 9, ls: .5 },
      { text: 'L 6000', x: 70, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [{ t: 'rj45', n: 1 }, { t: 'iec_in', n: 1 }] } },

  // --------------------------------------------------------------- Green-GO ---
  // Element inventories are from Green-GO's own product pages; the ARRANGEMENT
  // is mine, laid out to fit 1U honestly rather than measured off a drawing —
  // their manual site blocks automated access. The MCX's own page confirms
  // "32 multicolour push-buttons, three full colour TFT touchscreens, an
  // internal loudspeaker, a 3-pin XLR microphone input, a 4-pin XLR headset
  // connector", and the product photography shows the two XLRs at the right-hand
  // end, which is what is drawn. Depths are from dealer listings and are the
  // least reliable figure here. None publish a wattage; most are PoE powered.

  // Three screen-and-button clusters: 5 keys above and 5 below each screen makes
  // 30, with the two navigation keys by the encoder making up the 32.
  { id: 'greengo-mcx', brand: 'Green-GO', model: 'MCX rack station', category: 'comms',
    ru: 1, depth: 155, weight: 1.74, approx: true,
    src: 'https://www.greengocom.com/products/mcx',
    front: { elements: [
      { t: 'button', x: 103, y: 18, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'display', x: 175, y: 50, w: 175, h: 30 },
      { t: 'button', x: 103, y: 82, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'button', x: 298, y: 18, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'display', x: 370, y: 50, w: 175, h: 30 },
      { t: 'button', x: 298, y: 82, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'button', x: 493, y: 18, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'display', x: 565, y: 50, w: 175, h: 30 },
      { t: 'button', x: 493, y: 82, n: 5, gap: 36, w: 30, h: 18 },
      { t: 'button', x: 672, y: 30, w: 20, h: 16 },
      { t: 'button', x: 672, y: 70, w: 20, h: 16 },
      { t: 'encoder', x: 706, y: 50, r: 14 },
      { t: 'mesh', x: 748, y: 50, w: 40, h: 40 },
      { t: 'xlrf', x: 812, y: 52 },
      { t: 'xlrf', x: 878, y: 52 },
    ], labels: [
      { text: 'GREEN-GO', x: 748, y: 20, size: 7, ls: .5, anchor: 'middle' },
      { text: 'MIC', x: 812, y: 94, size: 6, ls: .3, anchor: 'middle' },
      { text: 'HEADSET', x: 878, y: 94, size: 6, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'dsub', n: 1 }, { t: 'dcjack', n: 1 }] } },

  // Four clusters of 6 keys around a screen = the published 24 channels.
  { id: 'greengo-mcxext', brand: 'Green-GO', model: 'MCXEXT rack extension',
    category: 'comms', ru: 1, depth: 155, weight: 1.67, approx: true,
    src: 'https://www.greengocom.com/products/mcxext',
    front: { elements: [
      { t: 'button', x: 128, y: 18, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'display', x: 178, y: 50, w: 168, h: 30 },
      { t: 'button', x: 128, y: 82, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'button', x: 306, y: 18, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'display', x: 356, y: 50, w: 168, h: 30 },
      { t: 'button', x: 306, y: 82, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'button', x: 484, y: 18, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'display', x: 534, y: 50, w: 168, h: 30 },
      { t: 'button', x: 484, y: 82, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'button', x: 662, y: 18, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'display', x: 712, y: 50, w: 168, h: 30 },
      { t: 'button', x: 662, y: 82, n: 3, gap: 50, w: 42, h: 18 },
      { t: 'mesh', x: 866, y: 50, w: 40, h: 40 },
    ], labels: [
      { text: 'GREEN-GO', x: 866, y: 20, size: 7, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'dcjack', n: 1 }] } },

  { id: 'greengo-bridgex', brand: 'Green-GO', model: 'BridgeX', category: 'comms',
    ru: 1, depth: 150, weight: 1.4, approx: true,
    src: 'https://www.greengocom.com/products/bridgex',
    front: { elements: [
      { t: 'display', x: 400, y: 50, w: 210, h: 40 },
      { t: 'encoder', x: 560, y: 50, r: 16 },
      { t: 'mesh', x: 860, y: 50, w: 40, h: 40 },
    ], labels: [
      { text: 'GREEN-GO', x: 110, y: 44, size: 11, ls: .8 },
      { text: 'BridgeX', x: 110, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 4 }, { t: 'dcjack', n: 1 }] } },

  { id: 'greengo-intx', brand: 'Green-GO', model: 'INTERFACEX', category: 'comms',
    ru: 1, depth: 150, weight: 1.4, approx: true,
    src: 'https://www.greengocom.com/products/interfacex',
    front: { elements: [
      { t: 'display', x: 400, y: 50, w: 210, h: 40 },
      { t: 'encoder', x: 560, y: 50, r: 16 },
      { t: 'button', x: 640, y: 50, w: 26, h: 18 },
      { t: 'mesh', x: 860, y: 50, w: 40, h: 40 },
    ], labels: [
      { text: 'GREEN-GO', x: 110, y: 44, size: 11, ls: .8 },
      { text: 'INTERFACEX', x: 110, y: 66, size: 9, ls: .5 },
      { text: '220R', x: 640, y: 78, size: 6, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 2 }, { t: 'xlrf', n: 3 }, { t: 'xlrm', n: 2 },
      { t: 'dsub', n: 2 }, { t: 'dcjack', n: 1 },
    ] } },

  { id: 'greengo-q4wr', brand: 'Green-GO', model: 'Q4WR quad 4-wire', category: 'comms',
    ru: 1, depth: 160, weight: 2.45, power: 5, approx: true,
    src: 'https://www.greengocom.com/products/q4wr',
    front: { elements: [
      { t: 'display', x: 400, y: 50, w: 210, h: 40 },
      { t: 'encoder', x: 560, y: 50, r: 16 },
      { t: 'mesh', x: 860, y: 50, w: 40, h: 40 },
    ], labels: [
      { text: 'GREEN-GO', x: 110, y: 44, size: 11, ls: .8 },
      { text: 'Q4WR', x: 110, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 1 }, { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 },
      { t: 'dsub', n: 4 }, { t: 'dcjack', n: 1 },
    ] } },

  // Six front-loading bays for NRGP packs, each with its own two-colour LED.
  { id: 'greengo-bc6', brand: 'Green-GO', model: 'BC6 battery charger (6 way)',
    category: 'charging', ru: 1, depth: 150, weight: 2.25, approx: true,
    src: 'https://www.greengocom.com/products/bc6',
    front: { elements: [
      { t: 'bar', x: 210, y: 48, n: 6, gap: 116, w: 100, h: 62, rx: 4 },
      { t: 'led', x: 210, y: 84, n: 6, gap: 116 },
    ], labels: [
      { text: 'GREEN-GO', x: 78, y: 44, size: 9, ls: .6 },
      { text: 'BC6', x: 78, y: 64, size: 8, ls: .5 },
    ] },
    rear: { auto: [{ t: 'dcjack', n: 1 }] } },
  // 1U tray for the slimline interfaces (RDX etc.), which are far narrower than
  // half rack and so are not library entries in their own right.
  { id: 'greengo-sishelve', brand: 'Green-GO', model: 'SISHELVE 1U tray',
    category: 'comms', shelf: true, ru: 1, depth: 130, weight: 1.0, power: 0,
    approx: true,
    front: { elements: [{ t: 'line', x: 500, y: 72, w: 840 }] } },

  // ------------------------------------------------------------- Clear-Com ---
  // The Eclipse HX frames are card-based and their datasheets carry straight-on
  // front views, so the slot counts and their groupings are from source. Note
  // the frames are REAR-connector: the front is card edges and PSUs.

  { id: 'clearcom-hx-median', brand: 'Clear-Com', model: 'Eclipse HX-Median',
    category: 'comms', ru: 6, depth: 410, weight: 20, power: 300, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'bar', x: 76, y: 320, n: 8, gap: 22, w: 18, h: 480, rx: 2 },
      { t: 'bar', x: 262, y: 320, w: 38, h: 480, rx: 2 },
      { t: 'bar', x: 306, y: 320, w: 38, h: 480, rx: 2 },
      { t: 'bar', x: 353, y: 320, n: 7, gap: 56, w: 50, h: 480, rx: 2 },
      { t: 'display', x: 830, y: 130, w: 150, h: 70 },
      { t: 'bar', x: 830, y: 300, w: 200, h: 160, rx: 4 },
      { t: 'bar', x: 830, y: 480, w: 200, h: 160, rx: 4 },
    ], labels: [
      { text: 'CLEAR-COM', x: 90, y: 50, size: 16, ls: 1.2 },
      { text: 'Eclipse HX-Median', x: 420, y: 50, size: 13, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'rj45', n: 4 }, { t: 'dsub', n: 4 }, { t: 'iec_in', n: 2 },
    ] } },

  { id: 'clearcom-hx-omega', brand: 'Clear-Com', model: 'Eclipse HX-Omega',
    category: 'comms', ru: 6, depth: 410, weight: 20, power: 300, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'bar', x: 90, y: 320, w: 34, h: 480, rx: 2 },
      { t: 'bar', x: 130, y: 320, w: 34, h: 480, rx: 2 },
      { t: 'bar', x: 175, y: 320, n: 15, gap: 46, w: 40, h: 480, rx: 2 },
      { t: 'bar', x: 890, y: 300, w: 80, h: 160, rx: 4 },
      { t: 'bar', x: 890, y: 480, w: 80, h: 160, rx: 4 },
    ], labels: [
      { text: 'CLEAR-COM', x: 90, y: 50, size: 16, ls: 1.2 },
      { text: 'Eclipse HX-Omega', x: 420, y: 50, size: 13, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'rj45', n: 3 }, { t: 'dsub', n: 4 },
      { t: 'iec_in', n: 2 },
    ] } },

  { id: 'clearcom-hx-delta', brand: 'Clear-Com', model: 'Eclipse HX-Delta',
    category: 'comms', ru: 3, depth: 445, weight: 12, power: 144, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'bar', x: 100, y: 175, n: 3, gap: 55, w: 48, h: 200, rx: 2 },
      { t: 'bar', x: 262, y: 175, w: 38, h: 200, rx: 2 },
      { t: 'bar', x: 306, y: 175, w: 38, h: 200, rx: 2 },
      { t: 'bar', x: 380, y: 175, n: 4, gap: 118, w: 100, h: 200, rx: 2 },
      { t: 'fan', x: 870, y: 175, r: 44 },
    ], labels: [
      { text: 'CLEAR-COM', x: 90, y: 50, size: 14, ls: 1.2 },
      { text: 'Eclipse HX-Delta', x: 420, y: 50, size: 11, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'rj45', n: 4 }, { t: 'dsub', n: 4 }, { t: 'dcjack', n: 2 },
    ] } },

  // HelixNet main station — 1U, four keyset displays with their call/talk keys.
  { id: 'clearcom-hms-4x', brand: 'Clear-Com', model: 'HelixNet HMS-4X',
    category: 'comms', ru: 1, depth: 320, weight: 2.65, power: 250, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'xlrf', x: 100, y: 40 },
      { t: 'usba', x: 160, y: 30 },
      { t: 'display', x: 300, y: 30, n: 4, gap: 120, w: 100, h: 30 },
      { t: 'button', x: 300, y: 66, n: 4, gap: 120, w: 60, h: 20 },
      { t: 'button', x: 760, y: 30, w: 44, h: 20 },
      { t: 'button', x: 760, y: 66, w: 44, h: 20 },
      { t: 'knob', x: 840, y: 48, r: 14 },
      { t: 'knob', x: 895, y: 48, r: 14 },
    ], labels: [
      { text: 'CLEAR-COM  HMS-4X', x: 300, y: 94, size: 7, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 3 }, { t: 'xlrm', n: 1 }, { t: 'jack', n: 1 },
      { t: 'dsub', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'clearcom-fse-base', brand: 'Clear-Com', model: 'FreeSpeak Edge Base',
    category: 'comms', ru: 1, depth: 353, weight: 3.3, power: 160, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'xlrf', x: 105, y: 52 },
      { t: 'usba', x: 172, y: 34 },
      { t: 'button', x: 172, y: 74, w: 30, h: 18 },
      { t: 'encoder', x: 260, y: 52, r: 16 },
      { t: 'display', x: 420, y: 52, w: 180, h: 50 },
      { t: 'display', x: 620, y: 52, w: 180, h: 50 },
      { t: 'encoder', x: 762, y: 52, r: 16 },
      { t: 'led', x: 820, y: 52 },
      { t: 'encoder', x: 880, y: 52, r: 16 },
    ], labels: [
      { text: 'FreeSpeak Edge', x: 420, y: 94, size: 7, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'rj45', n: 12 }, { t: 'sfp', n: 4 },
      { t: 'dsub', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'clearcom-lq-r2w4', brand: 'Clear-Com', model: 'LQ-R2W4-4W4',
    category: 'comms', ru: 1, depth: 224, weight: 1.95, power: 60, approx: true,
    src: 'https://clearcom.com/',
    front: { elements: [
      { t: 'display', x: 450, y: 52, w: 160, h: 44 },
      { t: 'button', x: 580, y: 52, n: 5, gap: 42, w: 32, h: 22 },
    ], labels: [
      { text: 'CLEAR-COM', x: 100, y: 44, size: 10, ls: .8 },
      { text: 'LQ SERIES', x: 100, y: 68, size: 8, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'ethercon', n: 4 }, { t: 'rj45', n: 2 },
      { t: 'dcjack', n: 2 },
    ] } },

  { id: 'clearcom-arcadia', brand: 'Clear-Com', model: 'Arcadia Central Station',
    category: 'comms', ru: 1, depth: 350, weight: 4, approx: true,
    // Clear-Com publish no dimensions or rear connector counts for Arcadia.
    src: 'https://www.clearcom.com/Products/Products-By-Name/Station-IC/arcadia-central-station',
    front: { elements: [
      { t: 'xlrf', x: 100, y: 52 },
      { t: 'encoder', x: 175, y: 52, r: 15 },
      { t: 'encoder', x: 232, y: 52, r: 15 },
      { t: 'display', x: 400, y: 52, w: 170, h: 48 },
      { t: 'display', x: 590, y: 52, w: 170, h: 48 },
      { t: 'encoder', x: 722, y: 52, r: 15 },
      { t: 'encoder', x: 779, y: 52, r: 15 },
      { t: 'mesh', x: 870, y: 52, w: 60, h: 42 },
    ], labels: [
      { text: 'Arcadia', x: 400, y: 94, size: 7, ls: .4, anchor: 'middle' },
    ] } },

  // ---------------------------------------------------------------- Furman ---
  // The rear outlets are drawn as Schuko because that is what a UK/EU rack has;
  // the US models ship with NEMA, which this library has no primitive for. The
  // COUNT is the part that matters for planning and that is right either way.
  { id: 'furman-pl8c', brand: 'Furman', model: 'PL-8C', category: 'power',
    ru: 1, depth: 267, weight: 5.4, approx: true,
    src: 'https://furmanpower.com/products/pl-8c',
    front: { elements: [
      { t: 'button', x: 110, y: 52, w: 30, h: 26 },
      { t: 'knob', x: 170, y: 52, r: 14 },
      { t: 'bar', x: 430, y: 52, w: 60, h: 20, rx: 4 },
      { t: 'bar', x: 620, y: 52, w: 60, h: 20, rx: 4 },
      { t: 'socket_thru', x: 850, y: 52 },
    ], labels: [
      { text: 'FURMAN', x: 220, y: 44, size: 11, ls: 1 },
      { text: 'PL-8C', x: 220, y: 68, size: 9, ls: .5 },
    ] },
    rear: { auto: [{ t: 'socket_thru', n: 8 }, { t: 'bnc', n: 1 }] } },

  { id: 'furman-plpro-dmc', brand: 'Furman', model: 'PL-PRO DMC', category: 'power',
    ru: 1, depth: 267, weight: 5.4, approx: true,
    src: 'https://furmanpower.com/products/pl-pro-dmc',
    front: { elements: [
      { t: 'button', x: 105, y: 52, w: 28, h: 26 },
      { t: 'display', x: 250, y: 52, w: 140, h: 40 },
      { t: 'button', x: 352, y: 52, w: 24, h: 20 },
      { t: 'bar', x: 480, y: 52, w: 60, h: 20, rx: 4 },
      { t: 'bar', x: 640, y: 52, w: 60, h: 20, rx: 4 },
      { t: 'socket_thru', x: 790, y: 52 },
      { t: 'usba', x: 890, y: 52 },
    ], labels: [
      { text: 'FURMAN  PL-PRO DMC', x: 105, y: 20, size: 8, ls: .5 },
    ] },
    rear: { auto: [{ t: 'socket_thru', n: 8 }, { t: 'bnc', n: 1 }] } },

  // ---------------------------------------------------------------- Riedel ---
  // Drawn from the dimensioned line elevations in Riedel's own manuals and
  // datasheets. The Artist frames are card-based: the card slot count and the PSU
  // arrangement are what you actually need off a rack drawing, so those are what
  // is drawn, rather than the detail of whichever cards happen to be fitted.
  //
  // Frame wattage figures are PSU ratings, not measured draw, and the frames are
  // dual-PSU for redundancy so the two do not add up.

  { id: 'riedel-artist-1024', brand: 'Riedel', model: 'Artist-1024', category: 'comms',
    ru: 2, depth: 404, weight: 6.3, power: 225, approx: true,
    src: 'https://www.riedel.net/en/products-solutions/intercom/artist',
    front: { elements: [
      // 10 card bays across the full 2U height, then the info display module
      { t: 'vline', x: 141, y: 100, h: 184, n: 9, gap: 78.8 },
      { t: 'sfp', x: 101, y: 46, n: 10, gap: 78.8 },
      { t: 'sfp', x: 101, y: 84, n: 10, gap: 78.8 },
      { t: 'rj45', x: 101, y: 128, n: 10, gap: 78.8 },
      { t: 'usbc', x: 101, y: 168, n: 10, gap: 78.8 },
      { t: 'vline', x: 850, y: 100, h: 188 },
      { t: 'display', x: 890, y: 96, w: 70, h: 44 },
      { t: 'knob', x: 890, y: 158, r: 15 },
    ], labels: [
      { text: 'RIEDEL', x: 890, y: 44, size: 9, ls: .6, anchor: 'middle' },
      { text: 'ARTIST-1024', x: 890, y: 192, size: 6.5, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'iec_in', n: 2 }, { t: 'fan', n: 2 }] } },

  { id: 'riedel-artist-128', brand: 'Riedel', model: 'Artist 128', category: 'comms',
    ru: 6, depth: 380, weight: 11.8, power: 400, approx: true,
    // 11.8 kg is the frame with both PSUs and the fan tray; cards add to that.
    src: 'https://www.riedel.net/fileadmin/user_upload/800-downloads/06.0-Manuals-Intercom/Artist_Installation-Guide_v6_1.pdf',
    front: { elements: [
      // upper zone: 20 card slots, including the two redundant CPU bays
      { t: 'vline', x: 106, y: 148, h: 276, n: 19, gap: 43.8 },
      { t: 'rj45', x: 84, y: 106, n: 20, gap: 43.8 },
      { t: 'led', x: 84, y: 196, n: 20, gap: 43.8 },
      { t: 'line', x: 500, y: 296, w: 876 },
      // lower zone: two PSU bricks, four fans and three status LEDs each
      { t: 'fan', x: 140, y: 384, n: 4, gap: 96, r: 34 },
      { t: 'fan', x: 578, y: 384, n: 4, gap: 96, r: 34 },
      { t: 'vline', x: 500, y: 446, h: 280 },
      { t: 'led', x: 120, y: 476, n: 3, gap: 24 },
      { t: 'led', x: 558, y: 476, n: 3, gap: 24 },
    ], labels: [
      { text: 'PSU 2', x: 120, y: 512, size: 9, ls: .5 },
      { text: 'PSU 1', x: 558, y: 512, size: 9, ls: .5 },
      { text: 'RIEDEL', x: 120, y: 556, size: 14, ls: 1.2 },
      { text: 'ARTIST 128', x: 120, y: 580, size: 11, ls: .6 },
    ] },
    rear: { auto: [{ t: 'rj45', n: 20 }, { t: 'dsub', n: 2 }] } },

  { id: 'riedel-artist-64', brand: 'Riedel', model: 'Artist 64', category: 'comms',
    ru: 3, depth: 380, weight: 5.6, power: 250, approx: true,
    src: 'https://www.riedel.net/fileadmin/user_upload/800-downloads/06.0-Manuals-Intercom/Artist_Installation-Guide_v6_1.pdf',
    front: { elements: [
      // fan module left, 8 card bays plus 2 CPU bays centre, 2 PSUs right
      { t: 'fan', x: 114, y: 90, r: 38 },
      { t: 'fan', x: 114, y: 210, r: 38 },
      { t: 'vline', x: 167, y: 150, h: 280 },
      { t: 'vline', x: 789, y: 150, h: 280 },
      { t: 'bar', x: 322, y: 30, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'bar', x: 322, y: 90, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'bar', x: 322, y: 150, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'bar', x: 322, y: 210, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'bar', x: 322, y: 270, n: 2, gap: 311, w: 280, h: 46, rx: 3 },
      { t: 'rj45', x: 220, y: 30, n: 2, gap: 311 },
      { t: 'rj45', x: 220, y: 90, n: 2, gap: 311 },
      { t: 'rj45', x: 220, y: 150, n: 2, gap: 311 },
      { t: 'rj45', x: 220, y: 210, n: 2, gap: 311 },
      { t: 'rj45', x: 220, y: 270, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 30, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 90, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 150, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 210, n: 2, gap: 311 },
      { t: 'led', x: 430, y: 270, n: 2, gap: 311 },
      { t: 'bar', x: 863, y: 90, w: 130, h: 118, rx: 3 },
      { t: 'bar', x: 863, y: 220, w: 130, h: 118, rx: 3 },
      { t: 'led', x: 841, y: 90, n: 3, gap: 22 },
      { t: 'led', x: 841, y: 220, n: 3, gap: 22 },
    ], labels: [
      { text: 'RIEDEL', x: 863, y: 20, size: 8, ls: .6, anchor: 'middle' },
      { text: 'ARTIST 64', x: 863, y: 296, size: 7, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'rj45', n: 10 }, { t: 'dsub', n: 2 }] } },

  { id: 'riedel-artist-32', brand: 'Riedel', model: 'Artist 32', category: 'comms',
    ru: 2, depth: 380, weight: 5.15, power: 200, approx: true,
    src: 'https://www.riedel.net/fileadmin/user_upload/800-downloads/06.0-Manuals-Intercom/Artist_Installation-Guide_v6_1.pdf',
    front: { elements: [
      { t: 'fan', x: 92, y: 100, n: 3, gap: 35, r: 16 },
      { t: 'vline', x: 193, y: 100, h: 184 },
      { t: 'vline', x: 807, y: 100, h: 184 },
      { t: 'bar', x: 346, y: 34, n: 2, gap: 307, w: 276, h: 48, rx: 3 },
      { t: 'bar', x: 346, y: 100, n: 2, gap: 307, w: 276, h: 48, rx: 3 },
      { t: 'bar', x: 346, y: 166, n: 2, gap: 307, w: 276, h: 48, rx: 3 },
      { t: 'rj45', x: 250, y: 34, n: 2, gap: 307 },
      { t: 'rj45', x: 250, y: 100, n: 2, gap: 307 },
      { t: 'rj45', x: 250, y: 166, n: 2, gap: 307 },
      { t: 'led', x: 450, y: 34, n: 2, gap: 307 },
      { t: 'led', x: 450, y: 100, n: 2, gap: 307 },
      { t: 'led', x: 450, y: 166, n: 2, gap: 307 },
      { t: 'bar', x: 872, y: 55, w: 124, h: 76, rx: 3 },
      { t: 'bar', x: 872, y: 145, w: 124, h: 76, rx: 3 },
      { t: 'led', x: 852, y: 78, n: 3, gap: 20 },
      { t: 'led', x: 852, y: 168, n: 3, gap: 20 },
    ], labels: [
      { text: 'RIEDEL', x: 127, y: 42, size: 9, ls: .6, anchor: 'middle' },
      { text: 'ARTIST 32', x: 127, y: 168, size: 8, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'rj45', n: 6 }, { t: 'dsub', n: 2 }] } },

  // Half-width stagebox. The rack kit (RMK-001) is a separate carrier frame, so
  // this is NOT an eared unit — it wants the kit or a shelf.
  { id: 'riedel-nsa-002a', brand: 'Riedel', model: 'NSA-002A', category: 'comms',
    half: true, ru: 1, depth: 276, weight: 1.77, power: 25,
    src: 'https://www.riedel.net/fileadmin/user_upload/11-products_neu/intercom/NSA/NSA-002A/NSA-002A_Datasheet_A10_.20230731135233420.pdf',
    front: { elements: [
      { t: 'xlrf', x: 34, y: 56, n: 4, gap: 52 },
      { t: 'xlrm', x: 242, y: 56, n: 4, gap: 52 },
    ], labels: [
      { text: 'NSA-002A', x: 10, y: 16, size: 7, ls: .4 },
      { text: 'IN 1-4', x: 139, y: 16, size: 8, ls: .4, anchor: 'middle' },
      { text: 'OUT 1-4', x: 347, y: 16, size: 8, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'rj45', n: 2 },
      { t: 'dsub', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  // The 1U carrier that holds one or two NSA-002A. Modelled as a shelf so the
  // app's half-rack tray rule applies to it.
  { id: 'riedel-rmk-001', brand: 'Riedel', model: 'RMK-001 rack kit', category: 'comms',
    shelf: true, ru: 1, depth: 280, weight: 0.8, power: 0, approx: true,
    // Riedel publishes no dimensioned drawing for the bracket itself.
    src: 'https://www.riedel.net/en/products-solutions/intercom/bolero-wireless-intercom',
    front: { elements: [
      { t: 'line', x: 500, y: 72, w: 840 },
      { t: 'vline', x: 500, y: 50, h: 44 },
    ] } },

  // ------------------------------------------------------------- charging ---
  // 4U slide-out drawer carrying two 5-bay Bolero chargers, so ten bays face
  // front. Dimensioned front/side drawings are in the Bolero 3.1 manual.
  { id: 'riedel-bolero-drawer', brand: 'Riedel', model: 'Bolero charger drawer (10 bay)',
    category: 'charging', ru: 4, depth: 400, weight: 7.2, power: 120, approx: true,
    // 4.9 kg empty + 2 x 1.14 kg chargers; 2 x 60 W while charging ten packs.
    src: 'https://www.riedel.net/en/products-solutions/intercom/bolero-wireless-intercom',
    front: { elements: [
      { t: 'line', x: 500, y: 10, w: 856 },
      { t: 'usbc', x: 150, y: 100 },
      { t: 'usba', x: 195, y: 100 },
      { t: 'bar', x: 290, y: 100, n: 5, gap: 140, w: 108, h: 78, rx: 6 },
      { t: 'led', x: 290, y: 126, n: 5, gap: 140 },
      { t: 'usbc', x: 150, y: 300 },
      { t: 'usba', x: 195, y: 300 },
      { t: 'bar', x: 290, y: 300, n: 5, gap: 140, w: 108, h: 78, rx: 6 },
      { t: 'led', x: 290, y: 326, n: 5, gap: 140 },
      { t: 'line', x: 500, y: 390, w: 856 },
    ], labels: [
      { text: 'RIEDEL  BOLERO', x: 500, y: 196, size: 16, ls: 1.4, anchor: 'middle' },
      { text: 'CHARGER DRAWER  10 BAY', x: 500, y: 220, size: 9, ls: .6, anchor: 'middle' },
    ] } },

  { id: 'riedel-rsp-1216hl', brand: 'Riedel', model: 'SmartPanel RSP-1216HL',
    category: 'comms', ru: 1, depth: 138, weight: 2.3, power: 15,
    src: 'https://www.riedel.net/fileadmin/user_upload/800-downloads/03.0-DataSheets-Intercom/1200_SmartPanels/RSP-1216HL_Datasheet.pdf',
    front: { elements: [
      { t: 'xlrf', x: 92, y: 52 },
      { t: 'xlrf', x: 146, y: 52 },
      { t: 'display', x: 320, y: 30, w: 256, h: 26 },
      { t: 'display', x: 600, y: 30, w: 276, h: 26 },
      // 16 hybrid lever keys, each with its own rotary encoder
      { t: 'button', x: 200, y: 72, n: 16, gap: 35, w: 26, h: 22 },
      { t: 'bar', x: 752, y: 38, w: 14, h: 14, rx: 3 },
      { t: 'led', x: 752, y: 74 },
      { t: 'display', x: 800, y: 32, w: 56, h: 24 },
      { t: 'mesh', x: 800, y: 74, w: 56, h: 22 },
      { t: 'knob', x: 858, y: 32, r: 11 },
      { t: 'usba', x: 858, y: 76 },
      { t: 'knob', x: 902, y: 54, r: 13 },
    ], labels: [
      { text: 'RSP-1216HL', x: 186, y: 96, size: 7, ls: .4 },
    ] } },

  // Brand-agnostic front antenna panels. Every distro in this library lands its
  // BNCs on the rear, so this is how the antennas reach the front of the rack.
  { id: 'bnc-front-1u-2', brand: 'Generic', model: 'Antenna front panel 1U (2 BNC)',
    category: 'wireless', ru: 1, depth: 40, weight: 0.5, power: 0, approx: true,
    front: { elements: [{ t: 'bnc', x: 430, y: 54, n: 2, gap: 140 }],
      labels: [
        { text: 'ANT A', x: 430, y: 88, size: 9, ls: .4, anchor: 'middle' },
        { text: 'ANT B', x: 570, y: 88, size: 9, ls: .4, anchor: 'middle' },
      ] },
    rear: { auto: [{ t: 'bnc', n: 2 }] } },
  { id: 'bnc-front-1u-4', brand: 'Generic', model: 'Antenna front panel 1U (4 BNC)',
    category: 'wireless', ru: 1, depth: 40, weight: 0.6, power: 0, approx: true,
    front: { elements: [{ t: 'bnc', x: 290, y: 54, n: 4, gap: 140 }],
      labels: [
        { text: '1A', x: 290, y: 88, size: 9, ls: .4, anchor: 'middle' },
        { text: '1B', x: 430, y: 88, size: 9, ls: .4, anchor: 'middle' },
        { text: '2A', x: 570, y: 88, size: 9, ls: .4, anchor: 'middle' },
        { text: '2B', x: 710, y: 88, size: 9, ls: .4, anchor: 'middle' },
      ] },
    rear: { auto: [{ t: 'bnc', n: 4 }] } },

  // ----------------------------------------------------- Martin Audio amps ---
  // The iKON and VIA amps share one 2U chassis (482 x 88 x 441, powerCON 32A);
  // rack ears are the optional RACKKITC rather than standard fit.
  //
  // The VIA and DX front panels ARE described concretely by Martin Audio — level
  // controls with signal/clip/protect metering, mute buttons per channel — so
  // those are drawn from that text. The iKON pages say only "intuitive front
  // panel interface", so its arrangement is inferred. No orthographic view was
  // obtained for any of them.
  //
  // Amps carry no mains draw: Martin Audio publish output power only, and their
  // datasheet PDFs are vector art with no extractable text. The DX processors DO
  // publish 30 W nominal, which is used.

  { id: 'martin-ik42', brand: 'Martin Audio', model: 'iKON iK42', category: 'audio',
    ru: 2, depth: 441, weight: 12.5, approx: true,
    src: 'https://martin-audio.com/products/electronics/ik42',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 280, h: 110 },
      { t: 'encoder', x: 520, y: 100, r: 20 },
      { t: 'button', x: 600, y: 70, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 600, y: 130, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'iKON iK42', x: 90, y: 90, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 5 }, { t: 'xlrm', n: 5 }, { t: 'nl4', n: 4 },
      { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'martin-ik41', brand: 'Martin Audio', model: 'iKON iK41', category: 'audio',
    ru: 2, depth: 441, weight: 12.5, approx: true,
    src: 'https://martin-audio.com/products/electronics/ik41',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 280, h: 110 },
      { t: 'encoder', x: 520, y: 100, r: 20 },
      { t: 'button', x: 600, y: 70, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 600, y: 130, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'iKON iK41', x: 90, y: 90, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 5 }, { t: 'xlrm', n: 5 }, { t: 'nl4', n: 4 },
      { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  // 8 output channels over 4 NL4 — an NL4 carries two channels, which is how the
  // "8-channel amp with 4 speakON" reading resolves rather than being an error.
  { id: 'martin-ik81', brand: 'Martin Audio', model: 'iKON iK81', category: 'audio',
    ru: 2, depth: 441, weight: 12.5, approx: true,
    src: 'https://martin-audio.com/products/electronics/ik81',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 280, h: 110 },
      { t: 'encoder', x: 520, y: 100, r: 20 },
      { t: 'button', x: 600, y: 70, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 600, y: 130, n: 3, gap: 45, w: 36, h: 22 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'iKON iK81', x: 90, y: 90, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 5 }, { t: 'xlrm', n: 5 }, { t: 'nl4', n: 4 },
      { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  // VIA fronts follow Martin Audio's own description: a mains switch and one
  // level control per channel, each with signal / clip / protect metering.
  { id: 'martin-via2004', brand: 'Martin Audio', model: 'VIA2004', category: 'audio',
    ru: 2, depth: 441, weight: 8, approx: true,
    src: 'https://martin-audio.com/products/electronics/via2004',
    front: { elements: [
      { t: 'knob', x: 280, y: 80, n: 4, gap: 150, r: 24 },
      { t: 'led', x: 280, y: 134, n: 4, gap: 150 },
      { t: 'led', x: 280, y: 158, n: 4, gap: 150 },
      { t: 'led', x: 280, y: 182, n: 4, gap: 150 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'VIA2004', x: 90, y: 90, size: 12, ls: .6 },
      { text: 'SIG', x: 240, y: 138, size: 8, ls: .3, anchor: 'end' },
      { text: 'CLIP', x: 240, y: 162, size: 8, ls: .3, anchor: 'end' },
      { text: 'PROT', x: 240, y: 186, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'nl4', n: 4 },
      { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'martin-via5004', brand: 'Martin Audio', model: 'VIA5004', category: 'audio',
    ru: 2, depth: 441, weight: 10, approx: true,
    src: 'https://martin-audio.com/products/electronics/via5004',
    front: { elements: [
      { t: 'knob', x: 280, y: 80, n: 4, gap: 150, r: 24 },
      { t: 'led', x: 280, y: 134, n: 4, gap: 150 },
      { t: 'led', x: 280, y: 158, n: 4, gap: 150 },
      { t: 'led', x: 280, y: 182, n: 4, gap: 150 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'VIA5004', x: 90, y: 90, size: 12, ls: .6 },
      { text: 'SIG', x: 240, y: 138, size: 8, ls: .3, anchor: 'end' },
      { text: 'CLIP', x: 240, y: 162, size: 8, ls: .3, anchor: 'end' },
      { text: 'PROT', x: 240, y: 186, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'nl4', n: 4 },
      { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'martin-via2502', brand: 'Martin Audio', model: 'VIA2502', category: 'audio',
    ru: 2, depth: 441, weight: 8, approx: true,
    src: 'https://martin-audio.com/products/electronics/via2502',
    front: { elements: [
      { t: 'knob', x: 380, y: 80, n: 2, gap: 200, r: 24 },
      { t: 'led', x: 380, y: 134, n: 2, gap: 200 },
      { t: 'led', x: 380, y: 158, n: 2, gap: 200 },
      { t: 'led', x: 380, y: 182, n: 2, gap: 200 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'VIA2502', x: 90, y: 90, size: 12, ls: .6 },
      { text: 'SIG', x: 340, y: 138, size: 8, ls: .3, anchor: 'end' },
      { text: 'CLIP', x: 340, y: 162, size: 8, ls: .3, anchor: 'end' },
      { text: 'PROT', x: 340, y: 186, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'nl4', n: 2 },
      { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'martin-via5002', brand: 'Martin Audio', model: 'VIA5002', category: 'audio',
    ru: 2, depth: 441, weight: 10, approx: true,
    src: 'https://martin-audio.com/products/electronics/via5002',
    front: { elements: [
      { t: 'knob', x: 380, y: 80, n: 2, gap: 200, r: 24 },
      { t: 'led', x: 380, y: 134, n: 2, gap: 200 },
      { t: 'led', x: 380, y: 158, n: 2, gap: 200 },
      { t: 'led', x: 380, y: 182, n: 2, gap: 200 },
      { t: 'button', x: 880, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 90, y: 60, size: 14, ls: 1 },
      { text: 'VIA5002', x: 90, y: 90, size: 12, ls: .6 },
      { text: 'SIG', x: 340, y: 138, size: 8, ls: .3, anchor: 'end' },
      { text: 'CLIP', x: 340, y: 162, size: 8, ls: .3, anchor: 'end' },
      { text: 'PROT', x: 340, y: 186, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 2 }, { t: 'nl4', n: 2 },
      { t: 'powercon_in', n: 1 },
    ] } },

  // DX processors — 30 W nominal is published, so these carry a real figure.
  { id: 'martin-dx04', brand: 'Martin Audio', model: 'DX0.4', category: 'audio',
    ru: 1, depth: 230, weight: 3.0, power: 30,
    src: 'https://martin-audio.com/products/electronics/dx0.4',
    front: { elements: [
      { t: 'display', x: 240, y: 50, w: 170, h: 42 },
      { t: 'encoder', x: 360, y: 50, r: 16 },
      { t: 'button', x: 420, y: 50, n: 6, gap: 40, w: 30, h: 20 },
      { t: 'meter', x: 700, y: 50, n: 6, h: 42 },
      { t: 'meter', x: 730, y: 50, n: 6, h: 42 },
      { t: 'meter', x: 760, y: 50, n: 6, h: 42 },
      { t: 'usbb', x: 880, y: 50 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 80, y: 40, size: 9, ls: .6 },
      { text: 'DX0.4', x: 80, y: 62, size: 8, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 4 }, { t: 'rj45', n: 3 },
      { t: 'iec_in', n: 1 },
    ] } },

  { id: 'martin-dx06', brand: 'Martin Audio', model: 'DX0.6', category: 'audio',
    ru: 1, depth: 230, weight: 3.0, power: 30,
    src: 'https://martin-audio.com/products/electronics/dx0.6',
    front: { elements: [
      { t: 'display', x: 240, y: 50, w: 170, h: 42 },
      { t: 'encoder', x: 360, y: 50, r: 16 },
      { t: 'button', x: 420, y: 50, n: 8, gap: 40, w: 30, h: 20 },
      { t: 'meter', x: 760, y: 50, n: 6, h: 42 },
      { t: 'meter', x: 790, y: 50, n: 6, h: 42 },
      { t: 'usbb', x: 880, y: 50 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 80, y: 40, size: 9, ls: .6 },
      { text: 'DX0.6', x: 80, y: 62, size: 8, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 2 }, { t: 'xlrm', n: 6 }, { t: 'rj45', n: 3 },
      { t: 'iec_in', n: 1 },
    ] } },

  { id: 'martin-dx40', brand: 'Martin Audio', model: 'DX4.0', category: 'audio',
    ru: 1, depth: 184, weight: 2.7, power: 30,
    src: 'https://martin-audio.com/products/electronics/dx4.0',
    front: { elements: [
      { t: 'display', x: 240, y: 50, w: 170, h: 42 },
      { t: 'encoder', x: 360, y: 50, r: 16 },
      { t: 'button', x: 430, y: 50, n: 4, gap: 44, w: 34, h: 20 },
      { t: 'meter', x: 700, y: 50, n: 6, h: 42 },
      { t: 'meter', x: 730, y: 50, n: 6, h: 42 },
      { t: 'usbb', x: 880, y: 50 },
    ], labels: [
      { text: 'MARTIN AUDIO', x: 80, y: 40, size: 9, ls: .6 },
      { text: 'DX4.0', x: 80, y: 62, size: 8, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 8 }, { t: 'rj45', n: 4 },
      { t: 'iec_in', n: 1 },
    ] } },

  // -------------------------------------------------- L-Acoustics amps ---
  // RU heights, depths and weights were confirmed separately — L-Acoustics
  // render their spec tables client-side and their PDFs are vector art, so none
  // of it came from the product pages directly.
  //
  // --- QSC PLD ------------------------------------------------------------
  // The best-documented amplifiers in the library, and the only ones whose rear
  // panel ORDER is verified rather than schematic: QSC's user manual numbers the
  // rear callouts left to right, so the declaration below is the panel. Front
  // panel is likewise from the manual's own numbered front-panel figure — the
  // metering and mute/select cluster on the left, LCD centre, navigation and the
  // MASTER CONTROL knob on the right — not the family grammar the d&b and
  // L-Acoustics fronts fall back on.
  //
  // Note the four XLR-M line OUTPUTS: the PLD loops its inputs through, which
  // the retail listings all omit. Six NL4, not four — the last two are the
  // bridged pair.
  //
  // No `power`, for the same reason as every other amp here: QSC publish heat
  // loss (BTU/hr at idle, 1/8, 1/3 and full power), not mains draw. That is more
  // than d&b, L-Acoustics or Martin give, and wall draw is recoverable from it
  // as output + heat loss — but it is a calculation, not a published figure, so
  // it is not asserted. The "AC Current: 7.2 A" seen in the manual is a mocked-up
  // LCD screenshot, not a rating.
  { id: 'qsc-pld4-2', brand: 'QSC', model: 'PLD4.2', category: 'audio',
    ru: 2, depth: 305, weight: 8.4,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/pld/q_amp_pld_specs.pdf',
    front: pldFront('PLD4.2'), rear: pldRear() },

  { id: 'qsc-pld4-3', brand: 'QSC', model: 'PLD4.3', category: 'audio',
    ru: 2, depth: 406, weight: 9.5,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/pld/q_amp_pld_specs.pdf',
    front: pldFront('PLD4.3'), rear: pldRear() },

  { id: 'qsc-pld4-5', brand: 'QSC', model: 'PLD4.5', category: 'audio',
    ru: 2, depth: 406, weight: 10.0,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/pld/q_amp_pld_specs.pdf',
    front: pldFront('PLD4.5'), rear: pldRear() },

  // --- QSC PLX / PLX2 / RMX -------------------------------------------------
  // These are the ONLY amplifiers in the library with a real mains figure.
  // QSC publish AC line current at 1/8 power pink noise into 4 ohms, which is
  // their own stated stand-in for typical maximum level, and that is what
  // `power` carries here (amps x 120 V, the voltage the tables are quoted at).
  //
  // Two things to know before trusting it. The RMX sheet also gives a "severe,
  // 1/3 power" row that is 1.5-2x higher — size a breaker from that, not from
  // this. And the figures are not monotonic with output power: the PLX1602
  // draws 10 A while the bigger PLX2402 draws 8 A, because 2402 and up are
  // Class H. That is QSC's own data, not a transcription error.
  //
  // The mains INLET type is not stated on any of the three spec sheets. C14 is
  // assumed. Note the RMX5050 ships with a NEMA 5-20 plug, so a plain 10 A C14
  // is unlikely on that one — see TODO.

  { id: 'qsc-plx1202', brand: 'QSC', model: 'PLX1202', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 720,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX1202'), rear: qscAmpRear() },
  { id: 'qsc-plx1602', brand: 'QSC', model: 'PLX1602', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 1200,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX1602'), rear: qscAmpRear() },
  { id: 'qsc-plx2402', brand: 'QSC', model: 'PLX2402', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 960,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX2402'), rear: qscAmpRear() },
  { id: 'qsc-plx3002', brand: 'QSC', model: 'PLX3002', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 1200,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX3002'), rear: qscAmpRear() },
  { id: 'qsc-plx3402', brand: 'QSC', model: 'PLX3402', category: 'audio',
    ru: 2, depth: 337, weight: 9.5, power: 1440,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/plx/q_amp_plxspec_specs.pdf',
    front: qscLegacyFront(2, 'PLX3402'), rear: qscAmpRear() },

  // PLX2. The "04" pair is the short, light chassis (227 mm, 5.9 kg); the "02"
  // models are 326 mm and 9.5 kg. Only the 02s reach 2 ohms and add binding
  // posts alongside the speakON.
  { id: 'qsc-plx1104', brand: 'QSC', model: 'PLX1104', category: 'audio',
    ru: 2, depth: 227, weight: 5.9, power: 960,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX1104'), rear: qscAmpRear() },
  { id: 'qsc-plx1804', brand: 'QSC', model: 'PLX1804', category: 'audio',
    ru: 2, depth: 227, weight: 5.9, power: 1128,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX1804'), rear: qscAmpRear() },
  { id: 'qsc-plx1802', brand: 'QSC', model: 'PLX1802', category: 'audio',
    ru: 2, depth: 326, weight: 9.5, power: 1044,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX1802'), rear: qscAmpRear() },
  { id: 'qsc-plx2502', brand: 'QSC', model: 'PLX2502', category: 'audio',
    ru: 2, depth: 326, weight: 9.5, power: 900,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX2502'), rear: qscAmpRear() },
  { id: 'qsc-plx3102', brand: 'QSC', model: 'PLX3102', category: 'audio',
    ru: 2, depth: 326, weight: 9.5, power: 1140,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX3102'), rear: qscAmpRear() },
  { id: 'qsc-plx3602', brand: 'QSC', model: 'PLX3602', category: 'audio',
    ru: 2, depth: 326, weight: 9.5, power: 1380,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/plx2/q_amp_plx2_specs.pdf',
    front: qscLegacyFront(2, 'PLX3602'), rear: qscAmpRear() },

  // RMX. Four 2U models and two 3U. Depth is the weak figure — QSC only say
  // "less than 16 inches", never a number, so 400 mm is a ceiling not a
  // measurement. The HD models add a protect LED per channel.
  { id: 'qsc-rmx850', brand: 'QSC', model: 'RMX850', category: 'audio',
    ru: 2, depth: 400, weight: 15.9, power: 540, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(2, 'RMX850'), rear: qscAmpRear(true) },
  { id: 'qsc-rmx1450', brand: 'QSC', model: 'RMX1450', category: 'audio',
    ru: 2, depth: 400, weight: 18.2, power: 720, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(2, 'RMX1450'), rear: qscAmpRear(true) },
  { id: 'qsc-rmx1850hd', brand: 'QSC', model: 'RMX1850HD', category: 'audio',
    ru: 2, depth: 400, weight: 20.2, power: 732, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(2, 'RMX1850HD', true), rear: qscAmpRear(true) },
  { id: 'qsc-rmx2450', brand: 'QSC', model: 'RMX2450', category: 'audio',
    ru: 2, depth: 400, weight: 20.2, power: 756, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(2, 'RMX2450'), rear: qscAmpRear(true) },
  { id: 'qsc-rmx4050hd', brand: 'QSC', model: 'RMX4050HD', category: 'audio',
    ru: 3, depth: 400, weight: 30.8, power: 1200, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(3, 'RMX4050HD', true), rear: qscAmpRear(true) },
  { id: 'qsc-rmx5050', brand: 'QSC', model: 'RMX5050', category: 'audio',
    ru: 3, depth: 400, weight: 33.1, power: 1668, approx: true,
    src: 'https://www.qscaudio.com/resource-files/productresources/amp/discontinued/rmx/q_amp_rmx_series_specs.pdf',
    front: qscLegacyFront(3, 'RMX5050', true), rear: qscAmpRear(true) },

  // FRONT PANELS ARE NOT CONFIRMED for the amplified controllers. They are drawn
  // to the family grammar — display, encoder, per-channel LEDs, power — and
  // should be treated as indicative. The LS10's front IS from L-Acoustics' own
  // text: five etherCON, status LEDs and a recessed reset.
  //
  // No mains draw figure is published for any amplified controller; the output
  // ratings (LA12X 4x3300 W etc.) are output power and are deliberately NOT used.

  { id: 'lacoustics-la12x', brand: 'L-Acoustics', model: 'LA12X', category: 'audio',
    ru: 2, depth: 455, weight: 14.5, approx: true,
    src: 'https://www.l-acoustics.com/products/la12x/',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 250, h: 100 },
      { t: 'encoder', x: 500, y: 100, r: 20 },
      { t: 'button', x: 580, y: 70, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'button', x: 580, y: 130, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'led', x: 700, y: 76, n: 4, gap: 40 },
      { t: 'led', x: 700, y: 124, n: 4, gap: 40 },
      { t: 'button', x: 890, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 90, y: 62, size: 14, ls: 1 },
      { text: 'LA12X', x: 90, y: 92, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  { id: 'lacoustics-la4x', brand: 'L-Acoustics', model: 'LA4X', category: 'audio',
    ru: 2, depth: 398, weight: 11.3, approx: true,
    src: 'https://www.l-acoustics.com/products/la4x/',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 250, h: 100 },
      { t: 'encoder', x: 500, y: 100, r: 20 },
      { t: 'button', x: 580, y: 70, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'button', x: 580, y: 130, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'led', x: 700, y: 76, n: 4, gap: 40 },
      { t: 'led', x: 700, y: 124, n: 4, gap: 40 },
      { t: 'button', x: 890, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 90, y: 62, size: 14, ls: 1 },
      { text: 'LA4X', x: 90, y: 92, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'xlrm', n: 4 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  // 16 output channels over 8 NL4 — two channels per connector.
  { id: 'lacoustics-la716', brand: 'L-Acoustics', model: 'LA7.16', category: 'audio',
    ru: 2, depth: 465, weight: 17.5, approx: true,
    src: 'https://www.l-acoustics.com/products/la7-16/',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 250, h: 100 },
      { t: 'encoder', x: 500, y: 100, r: 20 },
      { t: 'button', x: 580, y: 70, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'button', x: 580, y: 130, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'led', x: 690, y: 76, n: 8, gap: 26 },
      { t: 'led', x: 690, y: 124, n: 8, gap: 26 },
      { t: 'button', x: 890, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 90, y: 62, size: 14, ls: 1 },
      { text: 'LA7.16', x: 90, y: 92, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 4 }, { t: 'nl4', n: 8 }, { t: 'ethercon', n: 2 },
      { t: 'true1_in', n: 1 },
    ] } },

  { id: 'lacoustics-la716i', brand: 'L-Acoustics', model: 'LA7.16i', category: 'audio',
    ru: 2, depth: 465, weight: 17.5, approx: true,
    src: 'https://www.l-acoustics.com/products/la7-16i/',
    front: { elements: [
      { t: 'display', x: 300, y: 90, w: 250, h: 100 },
      { t: 'encoder', x: 500, y: 100, r: 20 },
      { t: 'button', x: 580, y: 70, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'button', x: 580, y: 130, n: 2, gap: 46, w: 36, h: 22 },
      { t: 'led', x: 690, y: 76, n: 8, gap: 26 },
      { t: 'led', x: 690, y: 124, n: 8, gap: 26 },
      { t: 'button', x: 890, y: 100, w: 24, h: 30 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 90, y: 62, size: 14, ls: 1 },
      { text: 'LA7.16i', x: 90, y: 92, size: 12, ls: .6 },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 10 }, { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  { id: 'lacoustics-la2xi', brand: 'L-Acoustics', model: 'LA2Xi', category: 'audio',
    ru: 1, depth: 398, weight: 4.4, approx: true,
    src: 'https://www.l-acoustics.com/products/la2xi/',
    front: { elements: [
      { t: 'display', x: 300, y: 50, w: 180, h: 44 },
      { t: 'encoder', x: 430, y: 50, r: 16 },
      { t: 'led', x: 520, y: 38, n: 4, gap: 34 },
      { t: 'led', x: 520, y: 64, n: 4, gap: 34 },
      { t: 'button', x: 880, y: 50, w: 22, h: 26 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 82, y: 44, size: 10, ls: .8 },
      { text: 'LA2Xi', x: 82, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 8 }, { t: 'ethercon', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'lacoustics-p1', brand: 'L-Acoustics', model: 'P1', category: 'audio',
    ru: 1, depth: 300, weight: 4, approx: true,
    src: 'https://www.l-acoustics.com/products/p1/',
    front: { elements: [
      { t: 'display', x: 320, y: 50, w: 200, h: 44 },
      { t: 'encoder', x: 450, y: 50, r: 16 },
      { t: 'trs', x: 520, y: 50 },
      { t: 'knob', x: 580, y: 50, r: 13 },
      { t: 'button', x: 880, y: 50, w: 22, h: 26 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 82, y: 44, size: 10, ls: .8 },
      { text: 'P1', x: 82, y: 66, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 8 }, { t: 'xlrm', n: 4 }, { t: 'ethercon', n: 2 },
      { t: 'iec_in', n: 1 },
    ] } },

  // Half-rack Milan/AVB switch. Front elements are from L-Acoustics' own text:
  // five etherCON, power and fault LEDs, per-port link LEDs, recessed reset.
  { id: 'lacoustics-ls10', brand: 'L-Acoustics', model: 'LS10', category: 'network',
    half: true, ears: true, ru: 1, depth: 250, weight: 1.5, power: 20, approx: true,
    src: 'https://www.l-acoustics.com/products/ls10/',
    front: { elements: [
      { t: 'ethercon', x: 120, y: 54, n: 5, gap: 56 },
      { t: 'led', x: 400, y: 34 },
      { t: 'led', x: 400, y: 70 },
      { t: 'button', x: 424, y: 54, w: 12, h: 12 },
    ], labels: [
      { text: 'L-ACOUSTICS', x: 24, y: 30, size: 8, ls: .5 },
      { text: 'LS10', x: 24, y: 50, size: 8, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 3 }, { t: 'sfp', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  // ------------------------------------------------ d&b audiotechnik amps ---
  // Physical specs, mains connector and rear I/O are from d&b's own product
  // pages. Front panels are NOT — d&b publish no orthographic front view, so
  // these follow the house grammar of the D20 above, which WAS drawn from their
  // orthographic view: display upper left, a recessed step across the panel, the
  // encoder on it, and the power control far right.
  //
  // NO d&b AMPLIFIER HAS A MAINS DRAW FIGURE. d&b publish output power but not
  // consumption, and their brochure PDFs are image-only. Every one of these
  // therefore counts toward the summary's "publish no power figure" tally rather
  // than carrying a made-up number — which matters, because in an amp rack these
  // are the whole electrical load. See TODO.

  // --- d&b D90, D12, D6 ----------------------------------------------------
  // All three from d&b's own hardware manuals, which — unlike the D20's — do
  // extract. That matters twice over: the connector lists are stated rather
  // than inferred from the house grammar, AND every one carries a real mains
  // figure, because d&b publish a power balance table (input power against
  // crest factor) that nobody else in the amplifier section does.
  //
  // `power` takes the realistic-programme row so it is comparable with the QSC
  // amps' 1/8-power figure: CF 4.0 for the D6, CF 3.5 for the D12, and d&b's
  // own CF 12 dB reference for the D90. Drive any of them into heavy clipping
  // and the draw is 2-3x that — the manuals give those rows too.
  //
  // Note the D12 is THREE rack units. Retail listings routinely say two.

  // 2 RU x 19" x 465 mm, 18.8 kg. 4 x 2700 W into 8 ohm.
  // Mains: powerCON-HC, a 32 A connector the library has no primitive for —
  // drawn as a standard powerCON, which is the closest honest thing.
  { id: 'db-d90', brand: 'd&b audiotechnik', model: 'D90', category: 'audio',
    ru: 2, depth: 465, weight: 18.8, power: 1775,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/d90/',
    front: { elements: [
      { t: 'display', x: 250, y: 100, w: 200, h: 92 },
      { t: 'encoder', x: 380, y: 100, r: 22 },
      { t: 'button', x: 560, y: 62, w: 40, h: 20, n: 4, gap: 58 },
      { t: 'button', x: 560, y: 138, w: 40, h: 20, n: 4, gap: 58 },
      { t: 'led', x: 560, y: 100, n: 4, gap: 58 },
      { t: 'button', x: 880, y: 100, w: 30, h: 30 },
    ], labels: [
      { text: 'D90', x: 90, y: 88, size: 22, ls: 1 },
      { text: 'd&b audiotechnik', x: 90, y: 120, size: 9, ls: .4 },
      { text: 'A     B     C     D', x: 647, y: 182, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'powercon_in', n: 1, lbl: 'MAINS' },
      { t: 'ethercon', n: 2, lbl: 'NETWORK' },
      { t: 'xlrf', n: 4, lbl: 'IN A' },
      { t: 'xlrm', n: 4, lbl: 'LINK A' },
      { t: 'xlrf', n: 2, sig: 'aes3', lbl: ['IN D1/2', 'IN D3/4'] },
      { t: 'xlrm', n: 2, sig: 'aes3', lbl: ['OUT D1/2', 'OUT D3/4'] },
      { t: 'nl4', n: 4, lbl: 'OUT' },
      { t: 'nl4', n: 2, lbl: ['MIX A/B', 'MIX C/D'] },
    ] } },

  // 3 RU x 19" x 353 mm, 13 kg. Two channels. Speaker outputs ship as EP5, NL4
  // or NL8 depending on the loudspeaker — NL4 is drawn as the common case.
  { id: 'db-d12', brand: 'd&b audiotechnik', model: 'D12', category: 'audio',
    ru: 3, depth: 353, weight: 13, power: 640,
    src: 'https://www.dbaudio.com/global/en/products/heritage/d12/',
    front: { elements: [
      { t: 'display', x: 300, y: 150, w: 160, h: 60 },
      { t: 'encoder', x: 420, y: 150, r: 20 },
      { t: 'button', x: 560, y: 120, w: 44, h: 22, n: 2, gap: 74 },
      { t: 'led', x: 560, y: 176, n: 2, gap: 74 },
      { t: 'led', x: 596, y: 176, n: 2, gap: 74 },
      { t: 'button', x: 880, y: 150, w: 30, h: 30 },
    ], labels: [
      { text: 'D12', x: 90, y: 138, size: 22, ls: 1 },
      { text: 'd&b audiotechnik', x: 90, y: 170, size: 9, ls: .4 },
      { text: 'A          B', x: 597, y: 208, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'powercon_in', n: 1, lbl: 'MAINS' },
      { t: 'rj45', n: 2, lbl: 'REMOTE' },
      { t: 'xlrf', n: 2, lbl: ['IN A', 'IN B'] },
      { t: 'xlrm', n: 2, lbl: ['LINK A', 'LINK B'] },
      { t: 'xlrf', n: 1, sig: 'aes3', lbl: 'AES3 IN' },
      { t: 'xlrm', n: 1, sig: 'aes3', lbl: 'AES3 LINK' },
      { t: 'nl4', n: 2, lbl: ['OUT A', 'OUT B'] },
    ] } },

  // 2 RU x 19" x 351 mm, 8 kg. Two channels, the small one of the family.
  { id: 'db-d6', brand: 'd&b audiotechnik', model: 'D6', category: 'audio',
    ru: 2, depth: 351, weight: 8, power: 215,
    src: 'https://www.dbaudio.com/assets/products/downloads/manuals-documentation/electronics/dbaudio-manual-hardware-d6-1.9-en.pdf',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 150, h: 52 },
      { t: 'encoder', x: 410, y: 100, r: 20 },
      { t: 'button', x: 560, y: 74, w: 44, h: 22, n: 2, gap: 74 },
      { t: 'led', x: 560, y: 128, n: 2, gap: 74 },
      { t: 'led', x: 596, y: 128, n: 2, gap: 74 },
      { t: 'button', x: 880, y: 100, w: 30, h: 30 },
    ], labels: [
      { text: 'D6', x: 90, y: 88, size: 22, ls: 1 },
      { text: 'd&b audiotechnik', x: 90, y: 120, size: 9, ls: .4 },
      { text: 'A          B', x: 597, y: 160, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'powercon_in', n: 1, lbl: 'MAINS' },
      { t: 'rj45', n: 2, lbl: 'REMOTE' },
      { t: 'xlrf', n: 2, lbl: ['IN A', 'IN B'] },
      { t: 'xlrm', n: 2, lbl: ['LINK A', 'LINK B'] },
      { t: 'xlrf', n: 1, sig: 'aes3', lbl: 'AES3 IN' },
      { t: 'xlrm', n: 1, sig: 'aes3', lbl: 'AES3 LINK' },
      { t: 'nl4', n: 2, lbl: ['OUT A', 'OUT B'] },
    ] } },

  { id: 'db-d80', brand: 'd&b audiotechnik', model: 'D80', category: 'audio',
    ru: 2, depth: 530, weight: 19, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/d80/',
    front: { elements: [
      { t: 'display', x: 200, y: 85, w: 190, h: 120 },
      { t: 'line', x: 615, y: 140, w: 630 },
      { t: 'encoder', x: 440, y: 170, r: 19 },
      { t: 'knob', x: 889, y: 170, r: 17 },
    ], labels: [
      { text: 'D80', x: 310, y: 52, size: 27, ls: 1 },
      { text: 'SCROLL', x: 470, y: 165, size: 10, ls: .5 },
      { text: 'EDIT', x: 470, y: 177, size: 10, ls: .5 },
      { text: 'POWER', x: 843, y: 175, size: 10, ls: .5, anchor: 'end' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 6 }, { t: 'nl8', n: 1 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'rj45', n: 2 }, { t: 'powercon_in', n: 1 },
    ] } },

  { id: 'db-d40', brand: 'd&b audiotechnik', model: 'D40', category: 'audio',
    ru: 2, depth: 512, weight: 13.8, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/d40/',
    front: { elements: [
      { t: 'display', x: 210, y: 85, w: 210, h: 120 },
      { t: 'line', x: 615, y: 140, w: 630 },
      { t: 'encoder', x: 450, y: 170, r: 19 },
      { t: 'knob', x: 889, y: 170, r: 17 },
    ], labels: [
      { text: 'D40', x: 330, y: 52, size: 27, ls: 1 },
      { text: 'SCROLL', x: 480, y: 165, size: 10, ls: .5 },
      { text: 'EDIT', x: 480, y: 177, size: 10, ls: .5 },
      { text: 'POWER', x: 843, y: 175, size: 10, ls: .5, anchor: 'end' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 6 }, { t: 'xlrm', n: 3 }, { t: 'nl4', n: 4 },
      { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  // The xD install amps use Euroblock throughout rather than XLR and speakON —
  // worth knowing before you plan a loom off one of these.
  { id: 'db-40d', brand: 'd&b audiotechnik', model: '40D', category: 'audio',
    ru: 2, depth: 465, weight: 13.3, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/40d/',
    front: { elements: [
      { t: 'display', x: 220, y: 100, w: 210, h: 110 },
      { t: 'led', x: 400, y: 100, n: 4, gap: 30 },
      { t: 'knob', x: 889, y: 100, r: 17 },
    ], labels: [
      { text: '40D', x: 100, y: 60, size: 22, ls: 1 },
      { text: 'POWER', x: 843, y: 105, size: 10, ls: .5, anchor: 'end' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 10 }, { t: 'ethercon', n: 2 }, { t: 'true1_in', n: 1 },
    ] } },

  { id: 'db-30d', brand: 'd&b audiotechnik', model: '30D', category: 'audio',
    ru: 2, depth: 435, weight: 10.6, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/30d/',
    front: { elements: [
      { t: 'led', x: 250, y: 84, n: 4, gap: 140 },
      { t: 'led', x: 250, y: 114, n: 4, gap: 140 },
      { t: 'led', x: 250, y: 144, n: 4, gap: 140 },
      { t: 'led', x: 880, y: 114 },
    ], labels: [
      { text: '30D', x: 96, y: 60, size: 22, ls: 1 },
      { text: 'ISP', x: 210, y: 88, size: 9, ls: .4, anchor: 'end' },
      { text: 'GR', x: 210, y: 118, size: 9, ls: .4, anchor: 'end' },
      { text: 'OVL', x: 210, y: 148, size: 9, ls: .4, anchor: 'end' },
      { text: 'A', x: 250, y: 62, size: 10, anchor: 'middle' },
      { text: 'B', x: 390, y: 62, size: 10, anchor: 'middle' },
      { text: 'C', x: 530, y: 62, size: 10, anchor: 'middle' },
      { text: 'D', x: 670, y: 62, size: 10, anchor: 'middle' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 10 }, { t: 'rj45', n: 4 }, { t: 'powercon_in', n: 1 },
    ] } },

  // Same chassis as the 30D — d&b publish identical dimensions and weight for
  // the pair; they differ in output power, not in the box.
  { id: 'db-10d', brand: 'd&b audiotechnik', model: '10D', category: 'audio',
    ru: 2, depth: 435, weight: 10.6, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/10d/',
    front: { elements: [
      { t: 'led', x: 250, y: 84, n: 4, gap: 140 },
      { t: 'led', x: 250, y: 114, n: 4, gap: 140 },
      { t: 'led', x: 250, y: 144, n: 4, gap: 140 },
      { t: 'led', x: 880, y: 114 },
    ], labels: [
      { text: '10D', x: 96, y: 60, size: 22, ls: 1 },
      { text: 'ISP', x: 210, y: 88, size: 9, ls: .4, anchor: 'end' },
      { text: 'GR', x: 210, y: 118, size: 9, ls: .4, anchor: 'end' },
      { text: 'OVL', x: 210, y: 148, size: 9, ls: .4, anchor: 'end' },
      { text: 'A', x: 250, y: 62, size: 10, anchor: 'middle' },
      { text: 'B', x: 390, y: 62, size: 10, anchor: 'middle' },
      { text: 'C', x: 530, y: 62, size: 10, anchor: 'middle' },
      { text: 'D', x: 670, y: 62, size: 10, anchor: 'middle' },
      { text: 'd&b audiotechnik', x: 926, y: 50, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 10 }, { t: 'rj45', n: 4 }, { t: 'powercon_in', n: 1 },
    ] } },

  // 241 mm wide — half the full 483 mm panel, so it bolts rail-to-centre with
  // its own ears rather than needing a tray. IEC mains, unlike the rest of d&b.
  { id: 'db-5d', brand: 'd&b audiotechnik', model: '5D', category: 'audio',
    half: true, ears: true, ru: 1, depth: 435, weight: 4.6, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/amplifiers/5d/',
    front: { elements: [
      { t: 'led', x: 150, y: 36, n: 4, gap: 62 },
      { t: 'led', x: 150, y: 68, n: 4, gap: 62 },
      { t: 'led', x: 410, y: 52 },
    ], labels: [
      { text: '5D', x: 26, y: 44, size: 15, ls: 1 },
      { text: 'd&b', x: 26, y: 68, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'euroblock', n: 5 }, { t: 'rj45', n: 2 }, { t: 'iec_in', n: 1 },
    ] } },

  // Dante-to-AES3 bridge. Its published I/O is quoted in CHANNELS, not
  // connectors — AES3 carries two channels per XLR, so 4 in / 16 out is 2 and 8
  // sockets. Sixteen XLRs would be 384 mm of connector and could not fit a 1U
  // face at all, which is how the discrepancy showed up.
  { id: 'db-ds10', brand: 'd&b audiotechnik', model: 'DS10', category: 'audio',
    ru: 1, depth: 232, weight: 3.75, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/processing-and-matrix/ds10/',
    front: { elements: [
      { t: 'button', x: 220, y: 50, w: 30, h: 24 },
      { t: 'led', x: 320, y: 50, n: 6, gap: 40 },
    ], labels: [
      { text: 'DS10', x: 90, y: 44, size: 14, ls: 1 },
      { text: 'BYPASS', x: 220, y: 82, size: 7, ls: .4, anchor: 'middle' },
      { text: 'd&b audiotechnik', x: 920, y: 56, size: 10, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      // `sig: 'aes3'` — these XLRs carry AES3, not analogue. The connector
      // cannot say so on its own, which is exactly what `sig` is for.
      { t: 'xlrf', n: 2, sig: 'aes3', lbl: 'AES3 IN' },
      { t: 'xlrm', n: 8, sig: 'aes3', lbl: 'AES3 OUT' },
      { t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] },
      { t: 'powercon_in', n: 1 },
    ] } },

  // Soundscape engine. All audio is on Dante — there is no analogue I/O — and
  // the front face was never confirmed, so it is drawn as vents and lettering.
  { id: 'db-ds100', brand: 'd&b audiotechnik', model: 'DS100', category: 'audio',
    ru: 3, depth: 481, weight: 11.2, approx: true,
    src: 'https://www.dbaudio.com/global/en/products/processing-and-matrix/ds100/',
    front: { elements: [
      { t: 'mesh', x: 250, y: 150, w: 320, h: 220 },
      { t: 'mesh', x: 750, y: 150, w: 320, h: 220 },
    ], labels: [
      { text: 'd&b audiotechnik', x: 500, y: 142, size: 18, ls: 1, anchor: 'middle' },
      { text: 'DS100', x: 500, y: 174, size: 15, ls: .8, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'rj45', n: 3 }, { t: 'iec_in', n: 1 }] } },

  // ------------------------------------------------------------ stageboxes ---
  // Which FACE the connectors are on varies by product and is the thing that
  // matters most here, so it is recorded per device rather than assumed:
  //
  //   Yamaha Rio / Tio   inputs and outputs on the front, Dante + mains rear
  //   DiGiCo             EVERYTHING on the front, including mains; rear is a
  //                      plain vented panel with no connectors at all
  //   Midas DL16 / DL32  XLR I/O on the front, AES50 + mains rear
  //   Midas DL152/153/251  the opposite — ALL I/O on the REAR, front is just
  //                      an LCD and status LEDs
  //
  // The Rio input layout (rows of 8, each channel with +48V / SIG / PEAK above
  // its XLR) was read off Yamaha's own front-view photograph.

  // 5U, 32 in / 16 out. D2 generation is discontinued; D3 is current and adds a
  // front headphone jack. Two AC cords — the PSU is redundant.
  { id: 'yamaha-rio3224-d3', brand: 'Yamaha', model: 'Rio3224-D3', category: 'audio',
    ru: 5, depth: 370, weight: 13.2, power: 100,
    src: 'https://usa.yamaha.com/products/proaudio/interfaces/r_series_adda_3/specs.html',
    front: { elements: [
      { t: 'xlrf', x: 116, y: 70, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 180, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 290, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 400, n: 8, gap: 52 },
      { t: 'vline', x: 522, y: 250, h: 440 },
      { t: 'display', x: 700, y: 90, w: 190, h: 76 },
      { t: 'knob', x: 852, y: 90, r: 19 },
      { t: 'trs', x: 852, y: 180 },
      { t: 'xlrm', x: 570, y: 290, n: 8, gap: 46 },
      { t: 'xlrm', x: 570, y: 400, n: 8, gap: 46 },
    ], labels: [
      { text: 'YAMAHA', x: 90, y: 34, size: 15, ls: 1 },
      { text: 'INPUT  1-32', x: 300, y: 34, size: 12, ls: 1 },
      { text: 'OUTPUT  1-16', x: 570, y: 246, size: 11, ls: .8 },
      { text: 'Rio3224-D3', x: 906, y: 34, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] }, { t: 'iec_in', n: 2 }] } },

  { id: 'yamaha-rio1608-d3', brand: 'Yamaha', model: 'Rio1608-D3', category: 'audio',
    ru: 3, depth: 370, weight: 9.4, power: 60,
    src: 'https://usa.yamaha.com/products/proaudio/interfaces/r_series_adda_3/specs.html',
    front: { elements: [
      { t: 'xlrf', x: 116, y: 100, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 210, n: 8, gap: 52 },
      { t: 'vline', x: 522, y: 150, h: 250 },
      { t: 'display', x: 700, y: 96, w: 190, h: 70 },
      { t: 'knob', x: 852, y: 96, r: 18 },
      { t: 'trs', x: 852, y: 210 },
      { t: 'xlrm', x: 570, y: 210, n: 8, gap: 46 },
    ], labels: [
      { text: 'YAMAHA', x: 90, y: 42, size: 15, ls: 1 },
      { text: 'INPUT  1-16', x: 300, y: 42, size: 12, ls: 1 },
      { text: 'OUTPUT  1-8', x: 570, y: 166, size: 11, ls: .8 },
      { text: 'Rio1608-D3', x: 906, y: 42, size: 13, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] }, { t: 'iec_in', n: 2 }] } },

  // 2U, 16 combo in / 8 out. Connector face is moderately confident rather than
  // confirmed — Yamaha's manual PDF would not extract.
  { id: 'yamaha-tio1608-d2', brand: 'Yamaha', model: 'Tio1608-D2', category: 'audio',
    ru: 2, depth: 364, weight: 5.7, power: 50, approx: true,
    src: 'https://usa.yamaha.com/products/proaudio/interfaces/tio1608-d2/specs.html',
    front: { elements: [
      { t: 'combo', x: 116, y: 62, n: 8, gap: 52 },
      { t: 'combo', x: 116, y: 148, n: 8, gap: 52 },
      { t: 'vline', x: 522, y: 100, h: 170 },
      { t: 'xlrm', x: 570, y: 148, n: 8, gap: 46 },
      { t: 'knob', x: 620, y: 56, r: 16 },
      { t: 'led', x: 700, y: 56, n: 4, gap: 26 },
    ], labels: [
      { text: 'YAMAHA', x: 90, y: 30, size: 12, ls: 1 },
      { text: 'Tio1608-D2', x: 906, y: 30, size: 12, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] }, { t: 'iec_in', n: 1 }] } },

  // 6U, 48 mic in / 24 out. The one entry here backed by genuine straight-on
  // front AND rear photographs in DiGiCo's datasheet: outputs in the top two
  // rows, inputs in the four below, and the Dante ports and BOTH mains inlets
  // on the front. Its rear really is a blank vented panel.
  { id: 'digico-dq-rack', brand: 'DiGiCo', model: 'DQ-Rack', category: 'audio',
    ru: 6, depth: 400, weight: 20, approx: true,
    src: 'https://digico.biz/racks/dq-rack/',
    front: { elements: [
      { t: 'display', x: 118, y: 80, w: 100, h: 64 },
      { t: 'button', x: 95, y: 150, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'button', x: 95, y: 190, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'encoder', x: 118, y: 260, r: 18 },
      { t: 'ethercon', x: 200, y: 360 },
      { t: 'ethercon', x: 200, y: 440 },
      { t: 'iec_in', x: 286, y: 360 },
      { t: 'iec_in', x: 286, y: 440 },
      { t: 'xlrm', x: 350, y: 70, n: 12, gap: 51 },
      { t: 'xlrm', x: 350, y: 160, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 250, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 340, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 430, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 520, n: 12, gap: 51 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 34, size: 15, ls: 1 },
      { text: 'DQ-Rack', x: 82, y: 320, size: 11, ls: .6 },
      { text: 'OUTPUT', x: 350, y: 24, size: 10, ls: .8, anchor: 'middle' },
      { text: 'INPUT', x: 350, y: 204, size: 10, ls: .8, anchor: 'middle' },
    ] },
    // Rear is a plain vented panel — no connectors at all.
    rear: { elements: [
      { t: 'mesh', x: 500, y: 300, w: 760, h: 480 },
    ], labels: [
      { text: 'DiGiCo', x: 500, y: 290, size: 20, ls: 1.4, anchor: 'middle' },
    ] } },

  // 10U card frame: 14 slots of 8 XLR, with the two hot-swap PSU modules and
  // the MADI pod across the top. Rear is fans and vents only.
  { id: 'digico-sd-rack', brand: 'DiGiCo', model: 'SD-Rack', category: 'audio',
    ru: 10, depth: 450, weight: 32, approx: true,
    src: 'https://digico.biz/racks/sd-rack/',
    front: { elements: [
      { t: 'iec_in', x: 120, y: 120 },
      { t: 'button', x: 190, y: 120, w: 26, h: 22 },
      { t: 'display', x: 480, y: 110, w: 180, h: 80 },
      { t: 'bnc', x: 600, y: 200, n: 4, gap: 48 },
      { t: 'usbb', x: 800, y: 200 },
      { t: 'iec_in', x: 830, y: 120 },
      { t: 'button', x: 890, y: 120, w: 26, h: 22 },
      { t: 'line', x: 500, y: 300, w: 856 },
      { t: 'xlrf', x: 100, y: 360, n: 14, gap: 62 },
      { t: 'xlrf', x: 100, y: 443, n: 14, gap: 62 },
      { t: 'xlrf', x: 100, y: 526, n: 14, gap: 62 },
      { t: 'xlrf', x: 100, y: 609, n: 14, gap: 62 },
      { t: 'xlrm', x: 100, y: 692, n: 14, gap: 62 },
      { t: 'xlrm', x: 100, y: 775, n: 14, gap: 62 },
      { t: 'xlrm', x: 100, y: 858, n: 14, gap: 62 },
      { t: 'xlrm', x: 100, y: 941, n: 14, gap: 62 },
    ], labels: [
      { text: 'DiGiCo', x: 300, y: 60, size: 18, ls: 1.2 },
      { text: 'SD-Rack', x: 300, y: 90, size: 13, ls: .6 },
      { text: 'PSU A', x: 120, y: 170, size: 9, ls: .5, anchor: 'middle' },
      { text: 'PSU B', x: 830, y: 170, size: 9, ls: .5, anchor: 'middle' },
    ] },
    rear: { elements: [
      { t: 'fan', x: 250, y: 500, n: 3, gap: 250, r: 90 },
    ], labels: [
      { text: 'SD-Rack', x: 500, y: 940, size: 16, ls: 1, anchor: 'middle' },
    ] } },

  // The MADI twin of the DQ-Rack — same 6U chassis and same 48 in / 24 out, with
  // MADI BNCs where the DQ has Dante etherCON. Layout follows the DQ-Rack, whose
  // front and rear WERE confirmed photographically.
  { id: 'digico-mq-rack', brand: 'DiGiCo', model: 'MQ-Rack', category: 'audio',
    ru: 6, depth: 400, weight: 20, approx: true,
    src: 'https://digico.biz/racks/mq-rack/',
    front: { elements: [
      { t: 'display', x: 118, y: 80, w: 100, h: 64 },
      { t: 'button', x: 95, y: 150, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'button', x: 95, y: 190, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'encoder', x: 118, y: 260, r: 18 },
      { t: 'bnc', x: 190, y: 350 },
      { t: 'bnc', x: 250, y: 350 },
      { t: 'bnc', x: 190, y: 420 },
      { t: 'bnc', x: 250, y: 420 },
      { t: 'iec_in', x: 220, y: 520 },
      { t: 'xlrm', x: 350, y: 70, n: 12, gap: 51 },
      { t: 'xlrm', x: 350, y: 160, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 250, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 340, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 430, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 520, n: 12, gap: 51 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 34, size: 15, ls: 1 },
      { text: 'MQ-Rack', x: 82, y: 320, size: 11, ls: .6 },
      { text: 'MADI', x: 220, y: 470, size: 8, ls: .5, anchor: 'middle' },
      { text: 'OUTPUT', x: 350, y: 24, size: 10, ls: .8, anchor: 'middle' },
      { text: 'INPUT', x: 350, y: 204, size: 10, ls: .8, anchor: 'middle' },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 300, w: 760, h: 480 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 290, size: 20, ls: 1.4, anchor: 'middle' }] } },

  // 9U, 48 in / 16 out, expandable to 32 out via two spare 8-channel slots.
  { id: 'digico-d2-rack', brand: 'DiGiCo', model: 'D2-Rack', category: 'audio',
    ru: 9, depth: 400, weight: 28, approx: true,
    src: 'https://digico.biz/racks/d2-rack/',
    front: { elements: [
      { t: 'display', x: 118, y: 90, w: 100, h: 64 },
      { t: 'button', x: 95, y: 170, n: 2, gap: 46, w: 34, h: 20 },
      { t: 'encoder', x: 118, y: 250, r: 18 },
      { t: 'bnc', x: 190, y: 350 },
      { t: 'bnc', x: 250, y: 350 },
      { t: 'bnc', x: 190, y: 420 },
      { t: 'bnc', x: 250, y: 420 },
      { t: 'iec_in', x: 190, y: 540 },
      { t: 'iec_in', x: 190, y: 630 },
      { t: 'xlrm', x: 350, y: 90, n: 8, gap: 51 },
      { t: 'xlrm', x: 350, y: 200, n: 8, gap: 51 },
      { t: 'xlrf', x: 350, y: 310, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 420, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 530, n: 12, gap: 51 },
      { t: 'xlrf', x: 350, y: 640, n: 12, gap: 51 },
      // the two spare 8-channel output slots
      { t: 'bar', x: 480, y: 790, w: 250, h: 110, rx: 4 },
      { t: 'bar', x: 760, y: 790, w: 250, h: 110, rx: 4 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 40, size: 15, ls: 1 },
      { text: 'D2-Rack', x: 82, y: 310, size: 11, ls: .6 },
      { text: 'MADI', x: 220, y: 470, size: 8, ls: .5, anchor: 'middle' },
      { text: 'OUTPUT', x: 350, y: 44, size: 10, ls: .8, anchor: 'middle' },
      { text: 'INPUT', x: 350, y: 264, size: 10, ls: .8, anchor: 'middle' },
      { text: 'SPARE SLOTS', x: 620, y: 872, size: 9, ls: .6, anchor: 'middle' },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 450, w: 760, h: 740 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 440, size: 20, ls: 1.4, anchor: 'middle' }] } },

  // 4U, four card slots, up to 32 I/O. Same card-slot family as the SD-Rack.
  { id: 'digico-sd-mini-rack', brand: 'DiGiCo', model: 'SD-MiNi Rack', category: 'audio',
    ru: 4, depth: 380, weight: 14, approx: true,
    src: 'https://digico.biz/racks/sd-mini-rack/',
    front: { elements: [
      { t: 'display', x: 140, y: 80, w: 100, h: 56 },
      { t: 'button', x: 118, y: 150, n: 2, gap: 44, w: 32, h: 20 },
      { t: 'bnc', x: 130, y: 240 },
      { t: 'bnc', x: 190, y: 240 },
      { t: 'usbb', x: 150, y: 320 },
      { t: 'iec_in', x: 250, y: 320 },
      { t: 'xlrf', x: 350, y: 65, n: 8, gap: 52 },
      { t: 'xlrf', x: 350, y: 155, n: 8, gap: 52 },
      { t: 'xlrm', x: 350, y: 245, n: 8, gap: 52 },
      { t: 'xlrm', x: 350, y: 335, n: 8, gap: 52 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 34, size: 13, ls: 1 },
      { text: 'SD-MiNi Rack', x: 82, y: 210, size: 10, ls: .5 },
      { text: 'MADI', x: 160, y: 282, size: 8, ls: .5, anchor: 'middle' },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 200, w: 760, h: 300 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 190, size: 18, ls: 1.2, anchor: 'middle' }] } },

  // 2U, two card slots, up to 16 I/O — the smallest of the SD family.
  { id: 'digico-sd-nano-rack', brand: 'DiGiCo', model: 'SD-NANO Rack', category: 'audio',
    ru: 2, depth: 340, weight: 8, approx: true,
    src: 'https://digico.biz/racks/sd-nano-rack/',
    front: { elements: [
      { t: 'display', x: 140, y: 60, w: 90, h: 46 },
      { t: 'bnc', x: 130, y: 145 },
      { t: 'bnc', x: 190, y: 145 },
      { t: 'xlrf', x: 320, y: 62, n: 4, gap: 52 },
      { t: 'xlrf', x: 320, y: 148, n: 4, gap: 52 },
      { t: 'xlrm', x: 600, y: 62, n: 4, gap: 52 },
      { t: 'xlrm', x: 600, y: 148, n: 4, gap: 52 },
      { t: 'iec_in', x: 880, y: 62 },
      { t: 'iec_in', x: 880, y: 148 },
    ], labels: [
      { text: 'DiGiCo  SD-NANO', x: 82, y: 26, size: 10, ls: .6 },
      { text: 'MADI', x: 160, y: 186, size: 7, ls: .4, anchor: 'middle' },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 100, w: 760, h: 140 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 92, size: 14, ls: 1, anchor: 'middle' }] } },

  // 7U, 32 in / 8 out plus 8 optional modular outs. Tall and shallow — it is a
  // floor stagebox at heart (483 x 179 x 310 mm) and the 7U rack ears are an
  // option, not standard fit.
  { id: 'digico-d-rack', brand: 'DiGiCo', model: 'D-Rack', category: 'audio',
    ru: 7, depth: 179, weight: 14, approx: true,
    src: 'https://digico.biz/racks/d-rack/',
    front: { elements: [
      { t: 'xlrf', x: 180, y: 100, n: 8, gap: 80 },
      { t: 'xlrf', x: 180, y: 200, n: 8, gap: 80 },
      { t: 'xlrf', x: 180, y: 300, n: 8, gap: 80 },
      { t: 'xlrf', x: 180, y: 400, n: 8, gap: 80 },
      { t: 'xlrm', x: 180, y: 530, n: 8, gap: 80 },
      { t: 'display', x: 862, y: 100, w: 80, h: 50 },
      { t: 'ethercon', x: 862, y: 210 },
      { t: 'ethercon', x: 862, y: 300 },
      { t: 'iec_in', x: 862, y: 420 },
      { t: 'iec_in', x: 862, y: 530 },
    ], labels: [
      { text: 'DiGiCo', x: 82, y: 44, size: 15, ls: 1 },
      { text: 'D-Rack', x: 82, y: 620, size: 12, ls: .6 },
      { text: 'MIC INPUT  1-32', x: 180, y: 62, size: 10, ls: .8 },
      { text: 'LINE OUT  1-8', x: 180, y: 486, size: 10, ls: .8 },
    ] },
    rear: { elements: [{ t: 'mesh', x: 500, y: 350, w: 760, h: 560 }],
      labels: [{ text: 'DiGiCo', x: 500, y: 340, size: 18, ls: 1.2, anchor: 'middle' }] } },

  // 2U DMI format converter. Dimensioned CAD drawing in the datasheet: two card
  // slots, wordclock and USB on the front, both PSUs on the REAR.
  { id: 'digico-orange-box', brand: 'DiGiCo', model: 'Orange Box', category: 'audio',
    ru: 2, depth: 263, weight: 5, approx: true,
    src: 'https://digico.biz/racks/orange-box/',
    front: { elements: [
      { t: 'bar', x: 240, y: 120, w: 240, h: 90, rx: 4 },
      { t: 'bnc', x: 430, y: 95 },
      { t: 'bnc', x: 430, y: 148 },
      { t: 'usbb', x: 510, y: 120 },
      { t: 'bar', x: 740, y: 120, w: 240, h: 90, rx: 4 },
    ], labels: [
      { text: 'DiGiCo  Orange Box', x: 500, y: 36, size: 15, ls: 1, anchor: 'middle' },
      { text: 'DMI 1', x: 240, y: 184, size: 9, ls: .5, anchor: 'middle' },
      { text: 'DMI 2', x: 740, y: 184, size: 9, ls: .5, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'iec_in', n: 2 }] } },

  // Midas front-connector stageboxes.
  { id: 'midas-dl16', brand: 'Midas', model: 'DL16', category: 'audio',
    ru: 2, depth: 225, weight: 4.7, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-ACJ',
    front: { elements: [
      { t: 'xlrf', x: 110, y: 58, n: 8, gap: 50 },
      { t: 'xlrf', x: 110, y: 145, n: 8, gap: 50 },
      { t: 'vline', x: 500, y: 100, h: 170 },
      { t: 'xlrm', x: 545, y: 58, n: 4, gap: 55 },
      { t: 'xlrm', x: 545, y: 145, n: 4, gap: 55 },
      { t: 'display', x: 792, y: 58, w: 58, h: 34 },
      { t: 'encoder', x: 792, y: 145, r: 16 },
      { t: 'trs', x: 872, y: 100 },
    ], labels: [
      { text: 'MIDAS', x: 84, y: 24, size: 11, ls: 1 },
      { text: 'DL16', x: 906, y: 24, size: 11, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'ethercon', n: 2 }, { t: 'toslink', n: 2 }, { t: 'rj45', n: 1 },
      { t: 'iec_in', n: 1 },
    ] } },

  { id: 'midas-dl32', brand: 'Midas', model: 'DL32', category: 'audio',
    ru: 3, depth: 300, weight: 5.7, power: 55, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-ACR',
    front: { elements: [
      { t: 'xlrf', x: 110, y: 50, n: 8, gap: 50 },
      { t: 'xlrf', x: 110, y: 118, n: 8, gap: 50 },
      { t: 'xlrf', x: 110, y: 186, n: 8, gap: 50 },
      { t: 'xlrf', x: 110, y: 254, n: 8, gap: 50 },
      { t: 'vline', x: 500, y: 150, h: 260 },
      { t: 'xlrm', x: 545, y: 50, n: 4, gap: 55 },
      { t: 'xlrm', x: 545, y: 118, n: 4, gap: 55 },
      { t: 'xlrm', x: 545, y: 186, n: 4, gap: 55 },
      { t: 'xlrm', x: 545, y: 254, n: 4, gap: 55 },
      { t: 'button', x: 820, y: 100, w: 44, h: 24 },
      { t: 'led', x: 820, y: 180, n: 2, gap: 30 },
    ], labels: [
      { text: 'MIDAS  DL32', x: 800, y: 40, size: 11, ls: .6, anchor: 'middle' },
      { text: 'MUTE ALL', x: 820, y: 140, size: 8, ls: .4, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'iec_in', n: 1 }] } },

  // Midas REAR-connector I/O racks: the front carries only an LCD and status
  // LEDs, which is why these look so bare next to the DL16/DL32 above.
  { id: 'midas-dl251', brand: 'Midas', model: 'DL251', category: 'audio',
    ru: 5, depth: 414, weight: 10, power: 110, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-AAU',
    front: { elements: [
      { t: 'button', x: 200, y: 200, n: 6, gap: 60, w: 40, h: 26 },
      { t: 'led', x: 620, y: 200, n: 6, gap: 34 },
      { t: 'mesh', x: 500, y: 380, w: 760, h: 150 },
    ], labels: [
      { text: 'MIDAS', x: 90, y: 90, size: 18, ls: 1.2 },
      { text: 'DL251', x: 90, y: 124, size: 13, ls: .6 },
      { text: 'All I/O on rear panel', x: 906, y: 124, size: 9, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 48 }, { t: 'xlrm', n: 16 }, { t: 'ethercon', n: 3 },
      { t: 'iec_in', n: 2 },
    ] } },

  { id: 'midas-dl153', brand: 'Midas', model: 'DL153', category: 'audio',
    ru: 2, depth: 416, weight: 6.9, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-ABQ',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 190, h: 60 },
      { t: 'button', x: 440, y: 100, n: 3, gap: 46, w: 34, h: 22 },
      { t: 'led', x: 640, y: 100, n: 6, gap: 30 },
    ], labels: [
      { text: 'MIDAS', x: 90, y: 80, size: 14, ls: 1 },
      { text: 'DL153', x: 90, y: 118, size: 11, ls: .5 },
      { text: 'All I/O on rear panel', x: 906, y: 118, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrf', n: 16 }, { t: 'xlrm', n: 8 }, { t: 'ethercon', n: 2 },
      { t: 'dsub', n: 1 }, { t: 'iec_in', n: 1 },
    ] } },

  { id: 'midas-dl152', brand: 'Midas', model: 'DL152', category: 'audio',
    ru: 2, depth: 416, weight: 6.9, approx: true,
    src: 'https://www.midasconsoles.com/en/products/0606-ABP',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 190, h: 60 },
      { t: 'button', x: 440, y: 100, n: 3, gap: 46, w: 34, h: 22 },
      { t: 'led', x: 640, y: 100, n: 6, gap: 30 },
    ], labels: [
      { text: 'MIDAS', x: 90, y: 80, size: 14, ls: 1 },
      { text: 'DL152', x: 90, y: 118, size: 11, ls: .5 },
      { text: 'All I/O on rear panel', x: 906, y: 118, size: 8, ls: .3, anchor: 'end' },
    ] },
    rear: { auto: [
      { t: 'xlrm', n: 24 }, { t: 'ethercon', n: 3 }, { t: 'iec_in', n: 1 },
    ] } },

  // ------------------------------------------------- Allen & Heath racks ---
  // SQ / Avantis / dLive / AHM only. The AudioRack family shares one grammar,
  // confirmed against A&H's own product photography: mic inputs in rows of 8 on
  // the left, line outputs in rows of 4 on the right, split by a divider, with
  // the model lettering along the top. The AR2412 below was read off that photo
  // directly; the 4U units follow the DX168 already in this library, which was
  // drawn from A&H's orthographic front view.

  // 1U, 8 in / 4 out. A 1U face is 44.45 mm and an XLR is 31 mm tall, so a
  // single row is the only thing that physically fits.
  { id: 'ah-ar84', brand: 'Allen & Heath', model: 'AR84', category: 'audio',
    ru: 1, depth: 180, weight: 2.6, power: 25, approx: true,
    src: 'https://www.allen-heath.com/hardware/everything-i-o/ar84/',
    front: { elements: [
      { t: 'xlrf', x: 110, y: 54, n: 8, gap: 52 },
      { t: 'vline', x: 505, y: 54, h: 64 },
      { t: 'xlrm', x: 560, y: 54, n: 4, gap: 60 },
      { t: 'led', x: 800, y: 54 },
    ], labels: [
      { text: 'ALLEN&HEATH  AR84', x: 96, y: 16, size: 8, ls: .5 },
      { text: 'Line out', x: 620, y: 16, size: 7, ls: .4 },
      { text: 'Ready', x: 826, y: 58, size: 7, ls: .3 },
    ] } },

  // 3U, 24 in / 12 out. Layout read directly off Allen & Heath's own product
  // photograph: three rows of eight inputs, three rows of four outputs.
  { id: 'ah-ar2412', brand: 'Allen & Heath', model: 'AR2412', category: 'audio',
    ru: 3, depth: 200, weight: 6.2, power: 60, approx: true,
    src: 'https://www.allen-heath.com/hardware/everything-i-o/ar2412/',
    front: { elements: [
      { t: 'xlrf', x: 116, y: 76, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 158, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 240, n: 8, gap: 52 },
      { t: 'vline', x: 530, y: 158, h: 250 },
      { t: 'xlrm', x: 590, y: 76, n: 4, gap: 60 },
      { t: 'xlrm', x: 590, y: 158, n: 4, gap: 60 },
      { t: 'xlrm', x: 590, y: 240, n: 4, gap: 60 },
      { t: 'led', x: 845, y: 272 },
    ], labels: [
      { text: 'ALLEN&HEATH', x: 90, y: 30, size: 13, ls: 1 },
      { text: 'AR2412  AudioRack', x: 250, y: 30, size: 12, ls: .6 },
      { text: 'Mic/Line in', x: 505, y: 30, size: 10, ls: .5, anchor: 'end' },
      { text: 'Line out', x: 800, y: 30, size: 10, ls: .5, anchor: 'end' },
      { text: 'Ready', x: 866, y: 276, size: 8, ls: .3 },
    ] } },

  // 4U, 16 in / 8 out — the same chassis and I/O count as the DX168, so the same
  // face. Needs the AB168-RK19 kit to rack, hence no ears.
  { id: 'ah-ab168', brand: 'Allen & Heath', model: 'AB168', category: 'audio',
    ru: 4, depth: 189, weight: 4.8, power: 35, approx: true,
    src: 'https://www.allen-heath.com/hardware/everything-i-o/ab168/',
    front: { elements: [
      { t: 'xlrf', x: 120, y: 176, n: 8, gap: 58 },
      { t: 'xlrf', x: 120, y: 286, n: 8, gap: 58 },
      { t: 'led', x: 583, y: 176 },
      { t: 'led', x: 583, y: 286 },
      { t: 'vline', x: 612, y: 231, h: 190 },
      { t: 'xlrm', x: 668, y: 176, n: 4, gap: 72 },
      { t: 'xlrm', x: 668, y: 286, n: 4, gap: 72 },
    ], labels: [
      { text: 'ALLEN&HEATH', x: 96, y: 62, size: 15, ls: 1 },
      { text: 'INPUTS  1-16', x: 312, y: 118, size: 15, ls: 1.5, anchor: 'middle' },
      { text: 'Power', x: 566, y: 158, size: 9, ls: .5, anchor: 'end' },
      { text: 'Ready', x: 566, y: 268, size: 9, ls: .5, anchor: 'end' },
      { text: 'OUTPUTS  1-8', x: 770, y: 118, size: 15, ls: 1.5, anchor: 'middle' },
      { text: 'AB168  AudioRack', x: 906, y: 62, size: 14, ls: .5, anchor: 'end' },
    ] },
    // The expander port's face was not confirmed, so it is drawn on the rear.
    rear: { auto: [{ t: 'ethercon', n: 1 }, { t: 'iec_in', n: 1 }] } },

  // 4U Dante version of the same box. Rack kit is optional, so no ears.
  { id: 'ah-dt168', brand: 'Allen & Heath', model: 'DT168', category: 'audio',
    ru: 4, depth: 189, weight: 4.8, power: 35, approx: true,
    src: 'https://www.allen-heath.com/hardware/everything-i-o/dt168/',
    front: { elements: [
      { t: 'xlrf', x: 120, y: 176, n: 8, gap: 58 },
      { t: 'xlrf', x: 120, y: 286, n: 8, gap: 58 },
      { t: 'led', x: 583, y: 176 },
      { t: 'led', x: 583, y: 286 },
      { t: 'vline', x: 612, y: 231, h: 190 },
      { t: 'xlrm', x: 668, y: 176, n: 4, gap: 72 },
      { t: 'xlrm', x: 668, y: 286, n: 4, gap: 72 },
    ], labels: [
      { text: 'ALLEN&HEATH', x: 96, y: 62, size: 15, ls: 1 },
      { text: 'INPUTS  1-16', x: 312, y: 118, size: 15, ls: 1.5, anchor: 'middle' },
      { text: 'Power', x: 566, y: 158, size: 9, ls: .5, anchor: 'end' },
      { text: 'Ready', x: 566, y: 268, size: 9, ls: .5, anchor: 'end' },
      { text: 'OUTPUTS  1-8', x: 770, y: 118, size: 15, ls: 1.5, anchor: 'middle' },
      { text: 'DT168  Dante', x: 906, y: 62, size: 14, ls: .5, anchor: 'end' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'iec_in', n: 1 }] } },

  // 4U, four independent 8-channel card slots. What goes in them varies
  // (PRIME/analogue/AES, in or out), so the slots are drawn empty rather than
  // guessing a fit.
  { id: 'ah-dx32', brand: 'Allen & Heath', model: 'DX32', category: 'audio',
    ru: 4, depth: 250, weight: 7.5, power: 80, approx: true,
    src: 'https://www.allen-heath.com/hardware/everything-i-o/dx32/',
    front: { elements: [
      { t: 'bar', x: 175, y: 212, w: 168, h: 292, rx: 4 },
      { t: 'bar', x: 355, y: 212, w: 168, h: 292, rx: 4 },
      { t: 'bar', x: 535, y: 212, w: 168, h: 292, rx: 4 },
      { t: 'bar', x: 715, y: 212, w: 168, h: 292, rx: 4 },
      { t: 'led', x: 862, y: 130 },
      { t: 'led', x: 862, y: 180 },
    ], labels: [
      { text: 'ALLEN&HEATH  DX32', x: 90, y: 40, size: 13, ls: .8 },
      { text: 'SLOT 1', x: 175, y: 386, size: 9, ls: .5, anchor: 'middle' },
      { text: 'SLOT 2', x: 355, y: 386, size: 9, ls: .5, anchor: 'middle' },
      { text: 'SLOT 3', x: 535, y: 386, size: 9, ls: .5, anchor: 'middle' },
      { text: 'SLOT 4', x: 715, y: 386, size: 9, ls: .5, anchor: 'middle' },
      { text: '8 ch each', x: 862, y: 226, size: 8, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'iec_in', n: 2 }] } },

  // dLive MixRacks. These have NO front-panel controls — mixing happens at the
  // Surface or Director — and every source for the front face was secondary, so
  // the front is left as a labelled block. The REAR is drawn, because the I/O
  // counts are confirmed from A&H's own copy and are what you actually plan for.
  // The most compact MixRack: 4U with NO local analogue I/O at all — hence the
  // 0. You bring channels in over DX expanders or option cards, so the rear is
  // just the network and the redundant PSU inlets.
  { id: 'ah-dm0', brand: 'Allen & Heath', model: 'dLive DM0', category: 'audio',
    ru: 4, depth: 356, weight: 12, power: 90, approx: true,
    src: 'https://www.allen-heath.com/hardware/dlive-series/dlive-mixracks/',
    front: mixrackFront(4, 'dLive DM0'),
    rear: { auto: [{ t: 'ethercon', n: 2 }, { t: 'iec_in', n: 2 }] } },

  { id: 'ah-dm32', brand: 'Allen & Heath', model: 'dLive DM32', category: 'audio',
    ru: 7, depth: 350, weight: 15, approx: true,
    src: 'https://www.allen-heath.com/hardware/dlive-series/dlive-mixracks/',
    front: mixrackFront(7, 'dLive DM32'),
    // 3 I/O Ports, 128x128 channels each, per A&H's DM MixRack guide. The CDM
    // MixRacks below have ONE, which is worth not assuming from the family name.
    slots: [
      { id: 'io1', name: 'I/O Port 1', short: 'IO1', fmt: 'ah-dl-io' },
      { id: 'io2', name: 'I/O Port 2', short: 'IO2', fmt: 'ah-dl-io' },
      { id: 'io3', name: 'I/O Port 3', short: 'IO3', fmt: 'ah-dl-io' },
    ],
    rear: { auto: [
      { t: 'xlrf', n: 32 }, { t: 'xlrm', n: 16 }, { t: 'ethercon', n: 2 },
      { t: 'iec_in', n: 2 },
      { t: 'slot', slot: 'io1' }, { t: 'slot', slot: 'io2' },
      { t: 'slot', slot: 'io3' },
    ] } },
  { id: 'ah-dm48', brand: 'Allen & Heath', model: 'dLive DM48', category: 'audio',
    ru: 8, depth: 350, weight: 18, approx: true,
    src: 'https://www.allen-heath.com/hardware/dlive-series/dlive-mixracks/',
    front: mixrackFront(8, 'dLive DM48'),
    // 3 I/O Ports, 128x128 channels each, per A&H's DM MixRack guide. The CDM
    // MixRacks below have ONE, which is worth not assuming from the family name.
    slots: [
      { id: 'io1', name: 'I/O Port 1', short: 'IO1', fmt: 'ah-dl-io' },
      { id: 'io2', name: 'I/O Port 2', short: 'IO2', fmt: 'ah-dl-io' },
      { id: 'io3', name: 'I/O Port 3', short: 'IO3', fmt: 'ah-dl-io' },
    ],
    rear: { auto: [
      { t: 'xlrf', n: 48 }, { t: 'xlrm', n: 24 }, { t: 'ethercon', n: 2 },
      { t: 'iec_in', n: 2 },
      { t: 'slot', slot: 'io1' }, { t: 'slot', slot: 'io2' },
      { t: 'slot', slot: 'io3' },
    ] } },
  { id: 'ah-dm64', brand: 'Allen & Heath', model: 'dLive DM64', category: 'audio',
    ru: 10, depth: 350, weight: 22, approx: true,
    src: 'https://www.allen-heath.com/hardware/dlive-series/dlive-mixracks/',
    front: mixrackFront(10, 'dLive DM64'),
    // 3 I/O Ports, 128x128 channels each, per A&H's DM MixRack guide. The CDM
    // MixRacks below have ONE, which is worth not assuming from the family name.
    slots: [
      { id: 'io1', name: 'I/O Port 1', short: 'IO1', fmt: 'ah-dl-io' },
      { id: 'io2', name: 'I/O Port 2', short: 'IO2', fmt: 'ah-dl-io' },
      { id: 'io3', name: 'I/O Port 3', short: 'IO3', fmt: 'ah-dl-io' },
    ],
    rear: { auto: [
      { t: 'xlrf', n: 64 }, { t: 'xlrm', n: 32 }, { t: 'ethercon', n: 2 },
      { t: 'iec_in', n: 2 },
      { t: 'slot', slot: 'io1' }, { t: 'slot', slot: 'io2' },
      { t: 'slot', slot: 'io3' },
    ] } },
  // C Class: single PSU, one option slot, lighter.
  { id: 'ah-cdm32', brand: 'Allen & Heath', model: 'dLive CDM32', category: 'audio',
    ru: 5, depth: 310, weight: 10, approx: true,
    src: 'https://www.allen-heath.com/hardware/dlive-series/dlive-mixracks/',
    front: mixrackFront(5, 'dLive CDM32'),
    slots: [{ id: 'io', name: 'I/O Port', short: 'I/O', fmt: 'ah-dl-io' }],
    rear: { auto: [
      { t: 'xlrf', n: 32 }, { t: 'xlrm', n: 16 }, { t: 'ethercon', n: 2 },
      { t: 'iec_in', n: 1 },
      { t: 'slot', slot: 'io' },
    ] } },
  { id: 'ah-cdm48', brand: 'Allen & Heath', model: 'dLive CDM48', category: 'audio',
    ru: 7, depth: 310, weight: 12, approx: true,
    src: 'https://www.allen-heath.com/hardware/dlive-series/dlive-mixracks/',
    front: mixrackFront(7, 'dLive CDM48'),
    slots: [{ id: 'io', name: 'I/O Port', short: 'I/O', fmt: 'ah-dl-io' }],
    rear: { auto: [
      { t: 'xlrf', n: 48 }, { t: 'xlrm', n: 24 }, { t: 'ethercon', n: 2 },
      { t: 'iec_in', n: 1 },
      { t: 'slot', slot: 'io' },
    ] } },
  { id: 'ah-cdm64', brand: 'Allen & Heath', model: 'dLive CDM64', category: 'audio',
    ru: 8, depth: 309, weight: 20.9, approx: true,
    src: 'https://www.allen-heath.com/hardware/dlive-series/dlive-mixracks/',
    front: mixrackFront(8, 'dLive CDM64'),
    slots: [{ id: 'io', name: 'I/O Port', short: 'I/O', fmt: 'ah-dl-io' }],
    rear: { auto: [
      { t: 'xlrf', n: 64 }, { t: 'xlrm', n: 32 }, { t: 'ethercon', n: 2 },
      { t: 'iec_in', n: 1 },
      { t: 'slot', slot: 'io' },
    ] } },

  // 5U, 48 in / 16 out, laid out on the AudioRack grammar: inputs in rows of 8,
  // outputs in rows of 4. Six input rows and four output rows are what the 5U
  // face takes at a 31 mm connector height, and 6x8 = 48 with 4x4 = 16 exactly.
  // The arrangement follows the confirmed AR2412; it was not seen directly.
  { id: 'ah-gx4816', brand: 'Allen & Heath', model: 'GX4816', category: 'audio',
    ru: 5, depth: 250, weight: 11, approx: true,
    src: 'https://www.allen-heath.com/hardware/everything-i-o/gx4816/',
    front: { elements: [
      { t: 'xlrf', x: 116, y: 55, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 137, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 219, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 301, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 383, n: 8, gap: 52 },
      { t: 'xlrf', x: 116, y: 465, n: 8, gap: 52 },
      { t: 'vline', x: 512, y: 250, h: 470 },
      { t: 'xlrm', x: 570, y: 55, n: 4, gap: 60 },
      { t: 'xlrm', x: 570, y: 137, n: 4, gap: 60 },
      { t: 'xlrm', x: 570, y: 219, n: 4, gap: 60 },
      { t: 'xlrm', x: 570, y: 301, n: 4, gap: 60 },
      { t: 'led', x: 566, y: 470 },
    ], labels: [
      { text: 'ALLEN&HEATH', x: 560, y: 386, size: 16, ls: 1 },
      { text: 'GX4816', x: 560, y: 414, size: 14, ls: .8 },
      { text: 'Mic/Line in  1-48', x: 560, y: 440, size: 9, ls: .4 },
      { text: 'Ready', x: 588, y: 474, size: 8, ls: .3 },
    ] },
    rear: { auto: [{ t: 'ethercon', n: 3 }, { t: 'iec_in', n: 1 }] } },

  // AHM install processors. All audio I/O is on the REAR on Euroblock — the
  // front carries only the display, navigation cluster and four SoftKeys, which
  // is confirmed from A&H's product photography.
  { id: 'ah-ahm16', brand: 'Allen & Heath', model: 'AHM-16', category: 'audio',
    ru: 1, depth: 270, weight: 3.8, power: 65, approx: true,
    src: 'https://www.allen-heath.com/hardware/ahm/ahm-16/',
    front: { elements: [
      { t: 'mesh', x: 104, y: 50, w: 44, h: 46 },
      { t: 'display', x: 649, y: 50, w: 88, h: 46 },
      { t: 'button', x: 712, y: 30, w: 20, h: 15 },
      { t: 'button', x: 712, y: 70, w: 20, h: 15 },
      { t: 'button', x: 744, y: 50, w: 22, h: 18 },
      { t: 'button', x: 790, y: 50, n: 4, gap: 35, w: 28, h: 22 },
    ], labels: [
      { text: 'ALLEN&HEATH', x: 146, y: 44, size: 10, ls: .8 },
      { text: 'AHM-16', x: 146, y: 66, size: 9, ls: .5 },
    ] },
    slots: [{ id: 'io', name: 'I/O Port', short: 'I/O', fmt: 'ah-sq-io' }],
    rear: { auto: [
      { t: 'euroblock', n: 16 }, { t: 'rj45', n: 2 }, { t: 'iec_in', n: 1 },
      { t: 'slot', slot: 'io' },
    ] } },
  { id: 'ah-ahm32', brand: 'Allen & Heath', model: 'AHM-32', category: 'audio',
    ru: 1, depth: 270, weight: 4.0, power: 70, approx: true,
    src: 'https://www.allen-heath.com/hardware/ahm/ahm-32/',
    front: { elements: [
      { t: 'mesh', x: 104, y: 50, w: 44, h: 46 },
      { t: 'display', x: 649, y: 50, w: 88, h: 46 },
      { t: 'button', x: 712, y: 30, w: 20, h: 15 },
      { t: 'button', x: 712, y: 70, w: 20, h: 15 },
      { t: 'button', x: 744, y: 50, w: 22, h: 18 },
      { t: 'button', x: 790, y: 50, n: 4, gap: 35, w: 28, h: 22 },
    ], labels: [
      { text: 'ALLEN&HEATH', x: 146, y: 44, size: 10, ls: .8 },
      { text: 'AHM-32', x: 146, y: 66, size: 9, ls: .5 },
    ] },
    slots: [{ id: 'io', name: 'I/O Port', short: 'I/O', fmt: 'ah-sq-io' }],
    rear: { auto: [
      { t: 'euroblock', n: 24 }, { t: 'rj45', n: 2 }, { t: 'iec_in', n: 1 },
      { t: 'slot', slot: 'io' },
    ] } },
  { id: 'ah-ahm64', brand: 'Allen & Heath', model: 'AHM-64', category: 'audio',
    ru: 2, depth: 363, weight: 7.0, power: 70, approx: true,
    src: 'https://www.allen-heath.com/hardware/ahm/ahm-64/',
    front: { elements: [
      { t: 'mesh', x: 104, y: 100, w: 44, h: 90 },
      { t: 'display', x: 649, y: 100, w: 110, h: 68 },
      { t: 'button', x: 730, y: 74, w: 22, h: 18 },
      { t: 'button', x: 730, y: 126, w: 22, h: 18 },
      { t: 'button', x: 766, y: 100, w: 24, h: 20 },
      { t: 'button', x: 820, y: 100, n: 4, gap: 30, w: 24, h: 24 },
    ], labels: [
      { text: 'ALLEN&HEATH', x: 146, y: 88, size: 13, ls: 1 },
      { text: 'AHM-64', x: 146, y: 116, size: 11, ls: .6 },
    ] },
    slots: [{ id: 'io', name: 'I/O Port', short: 'I/O', fmt: 'ah-sq-io' }],
    rear: { auto: [
      { t: 'euroblock', n: 24 }, { t: 'rj45', n: 2 }, { t: 'iec_in', n: 1 },
      { t: 'slot', slot: 'io' },
    ] } },

  // ------------------------------------------------------------- computing ---
  // Physical specs from the NetBox devicetype-library (CC0-1.0). Their YAML
  // gives U height, weight and the power/console/interface lists exactly, but
  // says nothing about panel layout, so the faces below are drawn from what
  // these classes of device actually look like rather than from a drawing.

  { id: 'sonnet-rackmac-mini', brand: 'Sonnet', model: 'RackMac mini',
    category: 'computing', ru: 1, depth: 300, weight: 4.5, approx: true,
    src: 'https://www.sonnettech.com/product/rackmac-mini.html',
    front: { elements: [
      { t: 'bar', x: 330, y: 50, w: 300, h: 74, rx: 6 },
      { t: 'bar', x: 680, y: 50, w: 300, h: 74, rx: 6 },
      { t: 'mesh', x: 880, y: 50, w: 70, h: 60 },
    ], labels: [
      { text: 'SONNET', x: 80, y: 42, size: 10, ls: .8 },
      { text: 'RackMac mini', x: 80, y: 66, size: 8, ls: .4 },
    ] } },

  // 1U pull-out console: LCD and keyboard live inside, so the closed face is a
  // drawer front with a pull handle.
  { id: 'aten-cl1308', brand: 'ATEN', model: 'CL1308 KVM console',
    category: 'computing', ru: 1, depth: 480, weight: 12.6, power: 30, approx: true,
    src: 'https://www.aten.com/',
    front: { elements: [
      { t: 'line', x: 500, y: 20, w: 830 },
      { t: 'line', x: 500, y: 82, w: 830 },
      { t: 'bar', x: 500, y: 50, w: 180, h: 26, rx: 6 },
      { t: 'led', x: 820, y: 50, n: 3, gap: 24 },
    ], labels: [
      { text: 'ATEN  CL1308', x: 120, y: 56, size: 9, ls: .5 },
    ] },
    rear: { auto: [{ t: 'rj45', n: 8 }, { t: 'iec_in', n: 1 }] } },

  { id: 'aten-cs1308', brand: 'ATEN', model: 'CS1308 KVM switch',
    category: 'computing', ru: 1, depth: 200, weight: 1.9, approx: true,
    src: 'https://www.aten.com/',
    front: { elements: [
      { t: 'led', x: 250, y: 22, n: 8, gap: 60 },
      { t: 'button', x: 250, y: 56, n: 8, gap: 60, w: 34, h: 24 },
      { t: 'button', x: 800, y: 56, w: 30, h: 24 },
    ], labels: [
      { text: 'ATEN', x: 90, y: 40, size: 11, ls: .8 },
      { text: 'CS1308', x: 90, y: 64, size: 9, ls: .5 },
      { text: 'RESET', x: 800, y: 26, size: 7, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [{ t: 'dsub', n: 8 }, { t: 'iec_in', n: 1 }] } },

  { id: 'dell-poweredge-r650', brand: 'Dell', model: 'PowerEdge R650',
    category: 'computing', ru: 1, depth: 450, weight: 21, approx: true,
    src: 'https://www.dell.com/',
    front: { elements: [
      { t: 'bar', x: 330, y: 50, n: 10, gap: 42, w: 32, h: 64, rx: 2 },
      { t: 'usba', x: 800, y: 50 },
      { t: 'led', x: 848, y: 50 },
      { t: 'button', x: 890, y: 50, w: 20, h: 26 },
    ], labels: [
      { text: 'DELL', x: 90, y: 44, size: 12, ls: 1 },
      { text: 'PowerEdge R650', x: 90, y: 68, size: 7, ls: .3 },
    ] },
    rear: { auto: [
      { t: 'rj45', n: 3 }, { t: 'dsub', n: 1 }, { t: 'iec_in', n: 2 },
    ] } },

  // ----------------------------------------------------------------- power ---
  // Rack UPS: the front is a status display and buttons, the outlets are all on
  // the rear. Outlet counts and inlet types are exact, from the NetBox YAML.

  { id: 'apc-smt3000rmi2u', brand: 'APC', model: 'Smart-UPS SMT3000RMI2U',
    category: 'power', ru: 2, depth: 660, weight: 45, approx: true,
    src: 'https://www.apc.com/',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 200, h: 90 },
      { t: 'button', x: 480, y: 70, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'button', x: 480, y: 130, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'led', x: 640, y: 100, n: 4, gap: 28 },
      { t: 'mesh', x: 830, y: 100, w: 120, h: 130 },
    ], labels: [
      { text: 'APC', x: 100, y: 84, size: 18, ls: 1.2 },
      { text: 'Smart-UPS 3000', x: 100, y: 116, size: 10, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'iec_thru', n: 8 }, { t: 'iec_in', n: 1 }, { t: 'rj45', n: 1 },
    ] } },

  // Riello are a common UK rack UPS. 2U, 30.5 kg, C20 in / 8x C13 + 1x C19 out.
  { id: 'riello-sdh2200', brand: 'Riello', model: 'Sentinel Dual SDH 2200',
    category: 'power', ru: 2, depth: 600, weight: 30.5, approx: true,
    src: 'https://www.riello-ups.co.uk/',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 200, h: 90 },
      { t: 'button', x: 480, y: 70, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'button', x: 480, y: 130, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'led', x: 640, y: 100, n: 4, gap: 28 },
      { t: 'mesh', x: 830, y: 100, w: 120, h: 130 },
    ], labels: [
      { text: 'RIELLO', x: 100, y: 84, size: 16, ls: 1.2 },
      { text: 'SDH 2200', x: 100, y: 116, size: 10, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'iec_thru', n: 9 }, { t: 'iec_in', n: 1 }, { t: 'rj45', n: 1 },
    ] } },

  { id: 'eaton-5px3000irt2u', brand: 'Eaton', model: '5PX3000iRT2U',
    category: 'power', ru: 2, depth: 600, weight: 38, approx: true,
    src: 'https://www.eaton.com/',
    front: { elements: [
      { t: 'display', x: 300, y: 100, w: 200, h: 90 },
      { t: 'button', x: 480, y: 70, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'button', x: 480, y: 130, n: 2, gap: 50, w: 36, h: 24 },
      { t: 'led', x: 640, y: 100, n: 4, gap: 28 },
      { t: 'mesh', x: 830, y: 100, w: 120, h: 130 },
    ], labels: [
      { text: 'EATON', x: 100, y: 84, size: 16, ls: 1.2 },
      { text: '5PX3000iRT2U', x: 100, y: 116, size: 9, ls: .5 },
    ] },
    rear: { auto: [
      { t: 'iec_thru', n: 9 }, { t: 'iec_in', n: 1 }, { t: 'rj45', n: 1 },
    ] } },

  // 1U metered rack PDU — unlike the UPS above, a horizontal PDU carries its
  // outlets on the same face as the display.
  { id: 'apc-ap7821', brand: 'APC', model: 'Rack PDU AP7821', category: 'power',
    ru: 1, depth: 250, weight: 3.5, approx: true,
    src: 'https://www.apc.com/',
    front: { elements: [
      { t: 'display', x: 170, y: 50, w: 80, h: 40 },
      { t: 'iec_thru', x: 320, y: 50, n: 8, gap: 66 },
      { t: 'rj45', x: 862, y: 50 },
    ], labels: [
      { text: 'APC', x: 80, y: 34, size: 10, ls: .8 },
      { text: 'AP7821', x: 80, y: 74, size: 7, ls: .3 },
    ] },
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  // --------------------------------------------------------------- network ---
  // Imported from the NetBox devicetype-library (CC0-1.0) with
  // tools/netbox-import.py. Port counts, weights and maximum power draw come
  // straight from their YAML and are exact; DEPTH does not — the schema only
  // records full-depth as a boolean, so it comes out as a 250/450 mm bracket.
  // Panels are re-drawn by switchFront() at true connector pitch rather than
  // using the library's elevation photographs, which are raster and would not
  // sit with the rest of the line art.
  //
  // Ports are assumed to be on the FRONT, which is right for access switches;
  // a data-centre switch with rear ports would need that flipped by hand.

  { id: 'netgear-m4250-26g4xf-poe-gsm4230p', brand: 'Netgear',
    model: 'M4250-26G4XF-PoE+ (GSM4230P)', category: 'network',
    ru: 1, depth: 250, weight: 6.8, power: 556, approx: true,
    front: switchFront({ rj45: 26, sfp: 4, brand: 'Netgear', model: 'M4250-26G4XF-PoE+ (GSM4230P)' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'netgear-m4350-24g4xf', brand: 'Netgear',
    model: 'M4350-24G4XF', category: 'network',
    ru: 1, depth: 250, weight: 6.41, approx: true,
    front: switchFront({ rj45: 24, sfp: 4, mgmt: 1, brand: 'Netgear', model: 'M4350-24G4XF' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'netgear-m4300-12x12f', brand: 'Netgear',
    model: 'M4300-12X12F', category: 'network',
    ru: 1, depth: 250, power: 250, approx: true,
    front: switchFront({ rj45: 12, sfp: 12, brand: 'Netgear', model: 'M4300-12X12F' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'cisco-catalyst-9200-24p', brand: 'Cisco',
    model: 'Catalyst 9200-24P', category: 'network',
    ru: 1, depth: 250, weight: 5.5, approx: true,
    front: switchFront({ rj45: 24, mgmt: 1, brand: 'Cisco', model: 'Catalyst 9200-24P' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'cisco-catalyst-9200-48p', brand: 'Cisco',
    model: 'Catalyst 9200-48P', category: 'network',
    ru: 1, depth: 250, weight: 5.5, approx: true,
    front: switchFront({ rj45: 48, mgmt: 1, brand: 'Cisco', model: 'Catalyst 9200-48P' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'ubiquiti-edgeswitch-24-250w', brand: 'Ubiquiti',
    model: 'EdgeSwitch 24 250W', category: 'network',
    ru: 1, depth: 250, weight: 4.7, power: 250, approx: true,
    front: switchFront({ rj45: 24, sfp: 2, brand: 'Ubiquiti', model: 'EdgeSwitch 24 250W' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'ubiquiti-edgeswitch-48-500w', brand: 'Ubiquiti',
    model: 'EdgeSwitch 48 500W', category: 'network',
    ru: 1, depth: 250, weight: 6.1, power: 500, approx: true,
    front: switchFront({ rj45: 48, sfp: 4, brand: 'Ubiquiti', model: 'EdgeSwitch 48 500W' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'ubiquiti-edgeswitch-16-150w', brand: 'Ubiquiti',
    model: 'EdgeSwitch 16 150W', category: 'network',
    ru: 1, depth: 250, weight: 2.9, power: 150, approx: true,
    front: switchFront({ rj45: 16, sfp: 2, brand: 'Ubiquiti', model: 'EdgeSwitch 16 150W' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'mikrotik-crs326-24g-2s-rm', brand: 'MikroTik',
    model: 'CRS326-24G-2S+RM', category: 'network',
    ru: 1, depth: 250, weight: 1.08, power: 24, approx: true,
    front: switchFront({ rj45: 24, sfp: 2, brand: 'MikroTik', model: 'CRS326-24G-2S+RM' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'mikrotik-crs317-1g-16s-rm', brand: 'MikroTik',
    model: 'CRS317-1G-16S+RM', category: 'network',
    ru: 1, depth: 250, power: 44, approx: true,
    front: switchFront({ rj45: 1, sfp: 16, brand: 'MikroTik', model: 'CRS317-1G-16S+RM' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },
  { id: 'mikrotik-crs309-1g-8s-in', brand: 'MikroTik',
    model: 'CRS309-1G-8S+IN', category: 'network',
    ru: 1, depth: 250, power: 23, approx: true,
    front: switchFront({ rj45: 1, sfp: 8, brand: 'MikroTik', model: 'CRS309-1G-8S+IN' }),
    rear: { auto: [{ t: 'iec_in', n: 1 }] } },

  // --- Dante / AV network -------------------------------------------------
  // These are the switches Dante actually runs on, as opposed to the IT gear
  // above. Port counts and, more to the point, which panel each port is ON are
  // taken from the manufacturers' own manuals — the retail listings for both
  // the GigaCore and the SWP1 get the placement wrong.
  //
  // Ports are named with `lbl` only where the manufacturer names them — FIBRE,
  // CONSOLE. Neither manual states how the numbered switch ports are numbered
  // across the two panels, so that is left to the F/R + ordinal default rather
  // than invented. On gear that DOES name them, the payoff is real: an S16 rear
  // reads "AES50 A" and a Rio reads "DANTE PRI" instead of "EC 1".

  // 1U, 480 x 362 x 44 mm, 4.2 kg, 16 W. Yamaha's Dante-optimised L2 switch.
  // 8 ports: 4 etherCON on the front, 4 on the rear, plus a front opticalCON
  // and a front option-module slot (a slot, not a socket, so not modelled).
  { id: 'yamaha-swp1-8mmf', brand: 'Yamaha', model: 'SWP1-8MMF', category: 'network',
    ru: 1, depth: 362, weight: 4.2, power: 16, approx: true,
    src: 'https://usa.yamaha.com/products/proaudio/network_switches/swp1/index.html',
    front: { elements: [
      { t: 'ethercon', x: 300, y: 50, n: 4, gap: 62 },
      { t: 'opticalcon', x: 600, y: 50, lbl: 'FIBRE' },
      { t: 'led', x: 660, y: 34 }, { t: 'led', x: 660, y: 66 },
    ], labels: [
      { text: 'YAMAHA', x: 76, y: 44, size: 10, ls: .8 },
      { text: 'SWP1-8MMF', x: 76, y: 64, size: 8, ls: .4 },
      { text: 'OPTION SLOT', x: 800, y: 54, size: 7, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'ethercon', n: 4 },
    ] } },

  // 1U, 480 x 362 x 44 mm, 4.6 kg, 16 W. Sixteen ports: 12 etherCON
  // (4 front / 8 rear) and 4 RJ45 on the rear, plus the front opticalCON.
  { id: 'yamaha-swp1-16mmf', brand: 'Yamaha', model: 'SWP1-16MMF', category: 'network',
    ru: 1, depth: 362, weight: 4.6, power: 16, approx: true,
    src: 'https://usa.yamaha.com/products/proaudio/network_switches/swp1/index.html',
    front: { elements: [
      { t: 'ethercon', x: 300, y: 50, n: 4, gap: 62 },
      { t: 'opticalcon', x: 600, y: 50, lbl: 'FIBRE' },
      { t: 'led', x: 660, y: 34 }, { t: 'led', x: 660, y: 66 },
    ], labels: [
      { text: 'YAMAHA', x: 76, y: 44, size: 10, ls: .8 },
      { text: 'SWP1-16MMF', x: 76, y: 64, size: 8, ls: .4 },
      { text: 'OPTION SLOT', x: 800, y: 54, size: 7, ls: .3, anchor: 'middle' },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'rj45', n: 4 },
      { t: 'ethercon', n: 8 },
    ] } },

  // 1U, 482 x 204 x 44 mm, 2.5 kg. 30 W, or up to 180 W with the PoE option.
  // Fourteen ports: 10 etherCON on the FRONT (it is a touring switch), 2
  // etherCON and 2 SFP cages on the rear with the serial console and the IEC.
  // NOT modelled: the two Molex Micro-Fit 6-pin backup power inlets — there is
  // no primitive for them and inventing one would be worse than the omission.
  // Discontinued June 2024 in favour of the GigaCore 18t, still everywhere in
  // UK rental stock.
  { id: 'luminex-gigacore-14r', brand: 'Luminex', model: 'GigaCore 14R',
    category: 'network', ru: 1, depth: 204, weight: 2.5, power: 30, approx: true,
    src: 'https://www.luminex.be/wp-content/uploads/doccenter/GigaCore_14R_User_Manual-rev-2.8.4.pdf',
    front: { elements: [
      { t: 'ethercon', x: 216, y: 50, n: 10, gap: 62 },
    ], labels: [
      { text: 'LUMINEX', x: 76, y: 44, size: 10, ls: .8 },
      { text: 'GigaCore 14R', x: 76, y: 64, size: 8, ls: .4 },
    ] },
    rear: { auto: [
      { t: 'iec_in', n: 1 },
      { t: 'rj45', n: 1, lbl: 'CONSOLE' },
      { t: 'sfp', n: 2 },
      { t: 'ethercon', n: 2 },
    ] } },

  // 1U, 482 x 265 x 45 mm, 3.3 kg. Eight preamps but only TWO combo inputs on
  // the front — the other six are on the rear, which is the thing worth knowing
  // when you plan the loom. The front is the gain and monitoring section.
  { id: 'focusrite-18i20-g2', brand: 'Focusrite', model: 'Scarlett 18i20 2nd gen',
    category: 'audio', ru: 1, depth: 265, weight: 3.3, power: 25, approx: true,
    src: 'https://downloads.focusrite.com/focusrite/scarlett-2nd-gen/scarlett-18i20-2nd-gen',
    front: { elements: [
      { t: 'combo', x: 108, y: 52, n: 2, gap: 58 },
      { t: 'button', x: 214, y: 32, w: 22, h: 14 },
      { t: 'button', x: 214, y: 70, w: 22, h: 14 },
      { t: 'knob', x: 250, y: 50, n: 8, gap: 50, r: 13 },
      { t: 'button', x: 645, y: 32, w: 28, h: 15 },
      { t: 'button', x: 645, y: 70, w: 28, h: 15 },
      { t: 'knob', x: 730, y: 50, r: 22 },
      { t: 'knob', x: 800, y: 28, r: 11 },
      { t: 'knob', x: 860, y: 28, r: 11 },
      { t: 'trs', x: 800, y: 72 },
      { t: 'trs', x: 860, y: 72 },
      { t: 'button', x: 910, y: 50, w: 18, h: 24 },
    ], labels: [
      { text: 'focusrite', x: 246, y: 16, size: 9, ls: .5 },
      { text: 'Scarlett 18i20', x: 246, y: 94, size: 7, ls: .3 },
      { text: '48V', x: 645, y: 94, size: 6, ls: .3, anchor: 'middle' },
      { text: 'MONITOR', x: 730, y: 94, size: 6, ls: .3, anchor: 'middle' },
    ] },
    // Ordered mains-first, which is the end the IEC and USB actually sit on;
    // the six combo inputs are at the far end. autoLayout lays the list out
    // left to right AS SEEN FROM BEHIND, so declaration order is the panel order.
    // The ten line-output jacks sit two rows deep, as on the real unit.
    rear: { auto: [
      { t: 'iec_in', n: 1 }, { t: 'usbb', n: 1 }, { t: 'midi', n: 2 },
      { t: 'rca', n: 2 }, { t: 'toslink', n: 4 }, { t: 'bnc', n: 1 },
      { t: 'trs', n: 10, stack: 2 }, { t: 'combo', n: 6 },
    ] } },

  // ------------------------------------------------------------ half rack ---
  // Half-width devices are NOT rack-mounted: they sit on a shelf, and two of
  // them fit side by side in one U. Coordinates run 0..500 (= 241.3 mm) at the
  // same 2.07 units/mm as a full panel.

  { id: 'focusrite-18i8-g3', brand: 'Focusrite', model: 'Scarlett 18i8 3rd gen',
    category: 'audio', half: true,
    ru: 1, depth: 185, weight: 1.3, power: 10, approx: true,
    front: { elements: [
      { t: 'combo', x: 58, y: 52 },
      { t: 'combo', x: 116, y: 52 },
      { t: 'knob', x: 170, y: 30, r: 12 },
      { t: 'knob', x: 214, y: 30, r: 12 },
      { t: 'button', x: 256, y: 30, w: 22, h: 12 },
      { t: 'knob', x: 306, y: 50, r: 17 },
      { t: 'trs', x: 360, y: 56 },
      { t: 'trs', x: 400, y: 56 },
    ], labels: [
      { text: '18i8', x: 170, y: 76, size: 12, ls: 1 },
      { text: 'PHONES', x: 380, y: 24, size: 8, ls: .5, anchor: 'middle' },
    ] } },

  { id: 'router-half-1u', brand: 'Generic', model: 'Router (half rack)',
    category: 'network', half: true,
    ru: 1, depth: 160, weight: 0.9, power: 18, approx: true,
    front: { elements: [
      { t: 'rj45', x: 56, y: 54 },
      { t: 'vline', x: 90, y: 54, h: 52 },
      { t: 'rj45', x: 130, y: 54, n: 4, gap: 44 },
      { t: 'led', x: 308, y: 54, n: 3, gap: 18 },
      { t: 'iec_in', x: 392, y: 54 },
    ], labels: [
      { text: 'WAN', x: 56, y: 22, size: 9, ls: .5, anchor: 'middle' },
      { text: 'LAN 1-4', x: 196, y: 22, size: 9, ls: .5, anchor: 'middle' },
    ] } },

  // ------------------------------------------------------------ accessories --
  // Brand-agnostic, so "accurate" here means standard 19" geometry rather than a
  // specific product. Horizontal scale is 2.07 units/mm (1000 units = 482.6 mm);
  // connector sizes and centres below are set from real panel hardware.
  // D-series (XLR / etherCON) flange is 24 mm -> scale 1.18, 35 mm centres.

  { id: 'blank-1u', brand: 'Generic', model: 'Blank panel 1U', category: 'accessory',
    ru: 1, depth: 10, weight: 0.35, power: 0, front: { elements: [] } },
  { id: 'blank-2u', brand: 'Generic', model: 'Blank panel 2U', category: 'accessory',
    ru: 2, depth: 10, weight: 0.7, power: 0, front: { elements: [] } },
  { id: 'blank-3u', brand: 'Generic', model: 'Blank panel 3U', category: 'accessory',
    ru: 3, depth: 10, weight: 1.0, power: 0, front: { elements: [] } },
  { id: 'blank-4u', brand: 'Generic', model: 'Blank panel 4U', category: 'accessory',
    ru: 4, depth: 10, weight: 1.3, power: 0, front: { elements: [] } },

  { id: 'vent-1u', brand: 'Generic', model: 'Vented blank 1U', category: 'accessory',
    ru: 1, depth: 10, weight: 0.35, power: 0,
    front: { elements: [{ t: 'vent', x: 500, y: 50, w: 800, h: 46, pitch: 14 }] } },
  { id: 'vent-2u', brand: 'Generic', model: 'Vented blank 2U', category: 'accessory',
    ru: 2, depth: 10, weight: 0.65, power: 0,
    front: { elements: [{ t: 'vent', x: 500, y: 100, w: 800, h: 130, pitch: 14 }] } },
  { id: 'mesh-1u', brand: 'Generic', model: 'Perforated vent 1U', category: 'accessory',
    ru: 1, depth: 10, weight: 0.4, power: 0,
    front: { elements: [{ t: 'mesh', x: 500, y: 50, w: 800, h: 50 }] } },
  { id: 'brush-1u', brand: 'Generic', model: 'Brush panel 1U', category: 'accessory',
    ru: 1, depth: 15, weight: 0.4, power: 0,
    front: { elements: [{ t: 'brush', x: 500, y: 50, w: 800, h: 34 }] } },

  { id: 'fan-1u', brand: 'Generic', model: 'Fan tray 1U', category: 'accessory',
    ru: 1, depth: 120, weight: 1.8, power: 15, approx: true,
    front: { elements: [{ t: 'fan', x: 171, y: 50, n: 4, gap: 219, r: 42 }] } },

  { id: 'drawer-2u', brand: 'Generic', model: 'Drawer 2U', category: 'accessory',
    ru: 2, depth: 300, weight: 3.5, power: 0, approx: true,
    front: { elements: [
      { t: 'line', x: 500, y: 26, w: 830 },
      { t: 'line', x: 500, y: 174, w: 830 },
      { t: 'bar', x: 500, y: 100, w: 180, h: 30, rx: 6 },
      { t: 'line', x: 500, y: 100, w: 150 },
      { t: 'screw', x: 740, y: 100 },
    ] } },
  { id: 'drawer-3u', brand: 'Generic', model: 'Drawer 3U', category: 'accessory',
    ru: 3, depth: 350, weight: 4.5, power: 0, approx: true,
    front: { elements: [
      { t: 'line', x: 500, y: 26, w: 830 },
      { t: 'line', x: 500, y: 274, w: 830 },
      { t: 'bar', x: 500, y: 150, w: 200, h: 34, rx: 7 },
      { t: 'line', x: 500, y: 150, w: 168 },
      { t: 'screw', x: 760, y: 150 },
    ] } },
  { id: 'shelf-1u', brand: 'Generic', model: 'Shelf 1U', category: 'accessory',
    shelf: true,
    ru: 1, depth: 250, weight: 1.2, power: 0, approx: true,
    front: { elements: [{ t: 'line', x: 500, y: 72, w: 840 }] } },
  { id: 'lacing-1u', brand: 'Generic', model: 'Lacing bar 1U', category: 'accessory',
    ru: 1, depth: 80, weight: 0.5, power: 0, approx: true,
    front: { elements: [
      { t: 'line', x: 500, y: 50, w: 840 },
      { t: 'vline', x: 180, y: 50, h: 26, n: 6, gap: 128 },
    ] } },

  // patch panels — D-series at 35 mm centres, 12 per U
  { id: 'patch-xlr-1u', brand: 'Generic', model: 'XLR patch 1U (12)', category: 'accessory',
    ru: 1, depth: 55, weight: 1.0, power: 0, approx: true,
    front: { elements: [{ t: 'xlrf', x: 113, y: 50, n: 12, gap: 70 }] } },
  { id: 'patch-xlr-2u', brand: 'Generic', model: 'XLR patch 2U (12 in / 12 out)',
    category: 'accessory', ru: 2, depth: 55, weight: 1.9, power: 0, approx: true,
    front: { elements: [
      { t: 'xlrf', x: 113, y: 52, n: 12, gap: 70 },
      { t: 'xlrm', x: 113, y: 150, n: 12, gap: 70 },
    ] } },
  { id: 'patch-ethercon-1u', brand: 'Generic', model: 'etherCON patch 1U (12)',
    category: 'accessory', ru: 1, depth: 55, weight: 1.1, power: 0, approx: true,
    front: { elements: [{ t: 'ethercon', x: 113, y: 50, n: 12, gap: 70 }] } },
  { id: 'patch-bnc-1u', brand: 'Generic', model: 'BNC patch 1U (16)', category: 'accessory',
    ru: 1, depth: 55, weight: 0.8, power: 0, approx: true,
    front: { elements: [{ t: 'bnc', x: 104, y: 50, n: 16, gap: 52 }] } },
  { id: 'patch-jack-1u', brand: 'Generic', model: '1/4" jack patch 1U (24)',
    category: 'accessory', ru: 1, depth: 55, weight: 0.9, power: 0, approx: true,
    front: { elements: [{ t: 'trs', x: 96, y: 50, n: 24, gap: 35 }] } },

  // outlet strips — C13 27 x 20 mm, Schuko module 45 mm, BS1363 face 50 mm
  //
  // Every one of these carries a C14 INLET at the left-hand end. Without it a
  // strip is a row of outlets with no way to get power into it — nothing to
  // patch a feed to in the flow view, and a drawing of a thing that cannot
  // work. C14 because that is what a rack strip is fed with; a 13 A strip on a
  // captive lead is the other common build and has no inlet connector at all,
  // so if that is what you have, delete the inlet rather than trust this.
  //
  // The inlet is on the same face as the outlets, so the spacing had to come in
  // to make room. The 8-way 13 A strip is the tight one: eight BS1363 faces are
  // 368 mm of a 407 mm usable face, and the C14 takes it to 395 mm.
  { id: 'iec-strip-1u', brand: 'Generic', model: 'IEC C13 strip 1U (8)', category: 'power',
    ru: 1, depth: 60, weight: 1.5, power: 0, approx: true,
    front: { elements: [
      { t: 'iec_in', x: 125, y: 50, lbl: 'MAINS IN' },
      { t: 'iec_thru', x: 219, y: 50, n: 8, gap: 94 },
    ] } },
  { id: 'schuko-strip-1u', brand: 'Generic', model: 'Schuko strip 1U (6)', category: 'power',
    ru: 1, depth: 70, weight: 1.8, power: 0, approx: true,
    front: { elements: [
      { t: 'iec_in', x: 120, y: 50, lbl: 'MAINS IN' },
      { t: 'socket_thru', x: 210, y: 50, n: 6, gap: 130 },
    ] } },

  // UK 13 A. A BS1363 face is ~50 mm square, so six fit across a 1U panel and
  // the socket fills the panel height — that is genuinely how these are built.
  { id: 'uk13a-strip-1u', brand: 'Generic', model: '13A strip 1U (6)', category: 'power',
    ru: 1, depth: 70, weight: 1.9, power: 0, approx: true,
    front: { elements: [
      { t: 'iec_in', x: 118, y: 50, lbl: 'MAINS IN' },
      { t: 'bs13a_thru', x: 214, y: 50, n: 6, gap: 130 },
    ] } },
  { id: 'uk13a-strip-1u-8', brand: 'Generic', model: '13A strip 1U (8)', category: 'power',
    ru: 1, depth: 70, weight: 2.2, power: 0, approx: true,
    front: { elements: [
      { t: 'iec_in', x: 108, y: 50, lbl: 'MAINS IN' },
      { t: 'bs13a_thru', x: 187, y: 50, n: 8, gap: 97 },
    ] } },
  // --- Penn Elcom rack power distribution ------------------------------------
  // From Penn Elcom's own product pages: socket inventory, circuit structure,
  // weights and the 2U height are all stated there, and the front layouts are
  // drawn from their product photography.
  //
  // DEPTH is the soft figure. Penn Elcom quote "Case Size" with the three
  // numbers in a different order on almost every page — 140x98x430, 88x140x430,
  // 87x98x430 — where 430 is plainly the body width (483 over the ears) and
  // 87/88 is the 2U height. That leaves 98 and 140 both claiming to be depth.
  // 140 is used throughout because understating a depth is the direction that
  // puts a device in a rack it does not fit; all are marked approx.
  //
  // Power draw is 0: a PDU dissipates nothing worth counting, and its job in a
  // rack total is to be the thing everything else is plugged into.
  { id: 'penn-pdu16-uk', brand: 'Penn Elcom', model: 'PDU16-UK', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-16-amp-rack-mount-pdu-with-power-monitor-pair-of-c-form-sockets-pdu16-uk',
    front: pdu16Front({ inlet: 'cee16_in', link: 'cee16_thru', socket: 'bs13a_thru', model: 'PDU16' }),
    rear: pdu16Rear('bs13a_thru') },
  { id: 'penn-pdu16-uk32', brand: 'Penn Elcom', model: 'PDU16-UK32', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32-amp-ac-rack-mount-pdu-with-8-x-uk-sockets-pdu16-uk32',
    front: pdu16Front({ inlet: 'cee32_1_in', link: 'cee16_thru', socket: 'bs13a_thru', model: 'PDU16' }),
    rear: pdu16Rear('bs13a_thru') },
  { id: 'penn-pdu16-eu', brand: 'Penn Elcom', model: 'PDU16-EU', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-16amp-rack-mount-pdu-with-power-monitor-pair-of-c-form-sockets-pdu16-eu',
    front: pdu16Front({ inlet: 'cee16_in', link: 'cee16_thru', socket: 'socket_thru', model: 'PDU16' }),
    rear: pdu16Rear('socket_thru') },
  { id: 'penn-pdu16-eu32', brand: 'Penn Elcom', model: 'PDU16-EU32', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32a-ac-pdu-with-8-x-schuko-sockets-overload-protection-and-power-monitoring-pdu16-eu32',
    front: pdu16Front({ inlet: 'cee32_1_in', link: 'cee16_thru', socket: 'socket_thru', model: 'PDU16' }),
    rear: pdu16Rear('socket_thru') },
  { id: 'penn-pdu16-pc', brand: 'Penn Elcom', model: 'PDU16-PC', category: 'power',
    ru: 2, depth: 140, weight: 2.0, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-16amp-rack-mount-pdu-with-power-monitor-pair-of-c-form-sockets-pdu16-pc',
    front: pdu16Front({ inlet: 'cee16_in', link: 'cee16_thru', socket: 'powercon_thru', model: 'PDU16' }),
    rear: pdu16Rear('powercon_thru') },
  { id: 'penn-pdu16-pc32', brand: 'Penn Elcom', model: 'PDU16-PC32', category: 'power',
    ru: 2, depth: 140, weight: 2.5, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32-amp-ac-rack-mount-pdu-with-8-x-neutrik-powercon-sockets-pdu16-pc32',
    front: pdu16Front({ inlet: 'cee32_1_in', link: 'cee16_thru', socket: 'powercon_thru', model: 'PDU16' }),
    rear: pdu16Rear('powercon_thru') },
  // The one Penn Elcom spell out: "One at front, seven on the back panel."
  { id: 'penn-pdu16-uk-tr1', brand: 'Penn Elcom', model: 'PDU16-UK-TR1', category: 'power',
    ru: 2, depth: 140, weight: 2.8, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-16-amp-rack-mount-pdu-with-overload-protection-and-power-monitoring-tru1-pdu16-uk-tr1',
    front: pdu16Front({ inlet: 'true1_in', link: 'true1_thru', socket: 'bs13a_thru', model: 'PDU16' }),
    rear: pdu16Rear('bs13a_thru') },

  // Two-channel 32 A: one inlet, two banks of four, nothing on the front but
  // the inlet, the two bank trips and the monitor.
  { id: 'penn-pdu32-cf', brand: 'Penn Elcom', model: 'PDU32-CF', category: 'power',
    ru: 2, depth: 140, weight: 2.69, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32amp-two-channel-rack-mount-pdu-with-power-monitoring-c-form-socket-input-pdu32-cf',
    front: pdu32Front('cee32_1_in'),
    rear: { auto: [
      { t: 'powercon_thru', n: 4, lbl: ['A1', 'A2', 'A3', 'A4'] },
      { t: 'powercon_thru', n: 4, lbl: ['B1', 'B2', 'B3', 'B4'] },
    ] } },
  { id: 'penn-pdu32-ctr1', brand: 'Penn Elcom', model: 'PDU32-CTR1', category: 'power',
    ru: 2, depth: 140, weight: 2.69, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32amp-two-channel-rack-mount-pdu-with-power-monitoring-c-form-socket-input-powercon-tru1-output-pdu32-ctr1',
    front: pdu32Front('cee32_1_in'),
    rear: { auto: [
      { t: 'true1_thru', n: 4, lbl: ['A1', 'A2', 'A3', 'A4'] },
      { t: 'true1_thru', n: 4, lbl: ['B1', 'B2', 'B3', 'B4'] },
    ] } },
  // Fed on powerCON rather than C-Form: Neutrik NAC3MP-HC, the 32 A one.
  { id: 'penn-pdu32-pc', brand: 'Penn Elcom', model: 'PDU32-PC', category: 'power',
    ru: 2, depth: 140, weight: 2.69, power: 0, approx: true,
    src: 'https://www.penn-elcom.com/2u-32amp-two-channel-rack-mount-pdu-with-power-monitoring-powercon-input-pdu32-pc',
    front: pdu32Front('powercon_in'),
    rear: { auto: [
      { t: 'powercon_thru', n: 4, lbl: ['A1', 'A2', 'A3', 'A4'] },
      { t: 'powercon_thru', n: 4, lbl: ['B1', 'B2', 'B3', 'B4'] },
    ] } },

  { id: 'uk13a-strip-2u', brand: 'Generic', model: '13A strip 2U (12)', category: 'power',
    ru: 2, depth: 70, weight: 3.6, power: 0, approx: true,
    front: { elements: [
      { t: 'iec_in', x: 108, y: 50, lbl: 'MAINS IN' },
      { t: 'bs13a_thru', x: 200, y: 50, n: 6, gap: 130 },
      { t: 'bs13a_thru', x: 148, y: 150, n: 6, gap: 140 },
    ] } },

  // Blank patch panels. `patch: true` means the punched holes are stored on the
  // rack item, not here, so every instance can be laid out differently.
  { id: 'patch-blank-1u', brand: 'Generic', model: 'Patch panel 1U (blank)',
    category: 'accessory', patch: true, cols: 12,
    ru: 1, depth: 55, weight: 0.9, power: 0, approx: true },
  { id: 'patch-blank-2u', brand: 'Generic', model: 'Patch panel 2U (blank)',
    category: 'accessory', patch: true, cols: 12,
    ru: 2, depth: 55, weight: 1.6, power: 0, approx: true },
  { id: 'patch-blank-3u', brand: 'Generic', model: 'Patch panel 3U (blank)',
    category: 'accessory', patch: true, cols: 12,
    ru: 3, depth: 55, weight: 2.3, power: 0, approx: true },
  { id: 'patch-blank-4u', brand: 'Generic', model: 'Patch panel 4U (blank)',
    category: 'accessory', patch: true, cols: 12,
    ru: 4, depth: 55, weight: 3.0, power: 0, approx: true },
];

export const SEED_DEVICES = D;

// ---------------------------------------------------------------------------
// Option cards
// ---------------------------------------------------------------------------
// A card is a faceplate that fits a slot aperture, carrying its own connectors.
// It is NOT a rack item: it has no rack units and cannot be dragged into a bay.
// It is fitted to one device instance from the inspector, and from then on its
// sockets are that instance's sockets — they draw on the panel and they patch
// in the flow view like any other.
//
// `fmt` is the aperture standard, matching a device's `slots[].fmt`. That is
// the whole of the compatibility model: any card fits any slot of its format,
// which is exactly how the real ranges work — the five A&H cards below fit the
// SQ-Rack, the SQ-5/6/7, the SQ+ consoles and the AHM processors alike.
//
// No weight or power figures: A&H publish none per card, and the host's own
// consumption already covers a fitted card in practice. Inventing one would put
// a made-up number into a power total that gets used for real.
const CARDS = [
  // 1 x etherCON. A&H product photography of the card fitted to an SQ I/O Port.
  { id: 'ah-sq-slink', brand: 'Allen & Heath', model: 'SQ SLink', fmt: 'ah-sq-io',
    note: '128x128 @ 96kHz — gigaACE / GX / DX / dSnake',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-slink/',
    auto: [{ t: 'ethercon', n: 1, lbl: 'SLINK' }] },

  // "Two ports with redundant and switch modes ... Locking Ethercon connectors".
  //
  // These are the current products. A&H's AHM guides warn to use the M-SQ-DANT32
  // or M-SQ-DANT64 (SQ Dante V2) card in an AHM rather than the original
  // M-SQ-DANTE, and the 64x64 card's V1 revision is SQ-only. The library holds
  // one entry per product, not per board revision, so that caveat is recorded
  // here rather than modelled — a second-hand V1 card will not work in an AHM.
  { id: 'ah-sq-dante32', brand: 'Allen & Heath', model: 'SQ Dante 32x32', fmt: 'ah-sq-io',
    note: '32x32 @ 48/96kHz, AES67',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-dante-32/',
    auto: [{ t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] }] },
  { id: 'ah-sq-dante64', brand: 'Allen & Heath', model: 'SQ Dante 64x64', fmt: 'ah-sq-io',
    note: '64x64 @ 48/96kHz, AES67',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-dante-64/',
    auto: [{ t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] }] },

  // 2 x etherCON, faceplate lettered 'SoundGrid 1' and 'SoundGrid 2'.
  { id: 'ah-sq-waves', brand: 'Allen & Heath', model: 'SQ Waves', fmt: 'ah-sq-io',
    note: '64x64 @ 48/96kHz Waves SoundGrid',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-waves/',
    auto: [{ t: 'ethercon', n: 2, lbl: ['SOUNDGRID 1', 'SOUNDGRID 2'] }] },

  // Five BNC: two out over two in, then the switchable in/out word clock.
  // The stacked pairs are how the faceplate is actually arranged.
  { id: 'ah-sq-madi', brand: 'Allen & Heath', model: 'SQ MADI', fmt: 'ah-sq-io',
    note: '64x64 @ 48kHz / 32x32 @ 96kHz per pair',
    src: 'https://www.allen-heath.com/hardware/audio-networking/sq-madi/',
    auto: [
      { t: 'bnc', n: 4, stack: 2, lbl: ['MADI 1 OUT', 'MADI 1 IN', 'MADI 2 OUT', 'MADI 2 IN'] },
      { t: 'bnc', n: 1, lbl: 'SYNC' },
    ] },

  // --- Allen & Heath dLive / Avantis ---------------------------------------
  // Every one from A&H's own fitting note for that card. They all fit the same
  // I/O Port, which the dLive MixRacks, the dLive Surfaces and Avantis share —
  // the fitting notes say "an Allen & Heath Avantis or dLive I/O Port" verbatim.
  //
  // Not included: M-DL-ADAPT, the 'letter-box' adapter. It is a slot inside a
  // slot — it puts an iLive/GLD aperture inside a dLive one to host M-Dante,
  // M-Waves, M-ES-V2, M-ACE or M-MADI — and modelling it as a card with no
  // connectors would draw it as a blank plate, which is exactly what it is not.
  { id: 'ah-dl-dant64', brand: 'Allen & Heath', model: 'Dante 64x64 (M-DL-DANT64)',
    fmt: 'ah-dl-io', note: '64x64 Dante, Primary / Secondary, redundant or switched',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40487771409937',
    auto: [{ t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] }] },
  { id: 'ah-dl-dant128', brand: 'Allen & Heath', model: 'Dante 128x128 (M-DL-DANT128)',
    fmt: 'ah-dl-io', note: '128x128 Dante, Primary / Secondary, redundant or switched',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40487771409937',
    auto: [{ t: 'ethercon', n: 2, lbl: ['DANTE PRI', 'DANTE SEC'] }] },

  // 4 ports, each 32x32 @ 96kHz, parallel or redundant in pairs.
  { id: 'ah-dl-dxlink', brand: 'Allen & Heath', model: 'DX Link (M-DL-DXLINK)',
    fmt: 'ah-dl-io', note: '4 x DX Link, 32x32 @ 96kHz each',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40490513360785',
    auto: [{ t: 'ethercon', n: 4, lbl: 'DX LINK' }] },

  { id: 'ah-dl-gace', brand: 'Allen & Heath', model: 'gigaACE (M-DL-GACE)',
    fmt: 'ah-dl-io', note: '128x128 @ 96kHz point-to-point to another dLive / Avantis',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40496737174801',
    auto: [{ t: 'ethercon', n: 1, lbl: 'GIGAACE A' }] },

  // One logical port A on two physical connectors — fibre or copper, by mode.
  { id: 'ah-dl-gopt', brand: 'Allen & Heath', model: 'fibreACE (M-DL-GOPT)',
    fmt: 'ah-dl-io', note: '128x128 @ 96kHz over fibre or copper, opticalCON Duo',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40495217801233',
    auto: [
      { t: 'opticalcon', n: 1, lbl: 'PORT A OPTICAL' },
      { t: 'ethercon', n: 1, lbl: 'PORT A COPPER' },
    ] },

  // "A built-in Gigabit switch with 3 locking EtherCon ports" — three, not two.
  { id: 'ah-dl-waves3', brand: 'Allen & Heath', model: 'Waves V3 (M-DL-WAVES3)',
    fmt: 'ah-dl-io', note: '128x128 @ 48/96kHz Waves SoundGrid, 3-port switch',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40488232359569',
    auto: [{ t: 'ethercon', n: 3, lbl: 'SOUNDGRID' }] },

  // Links 1-4 on BNC, links 5-8 on SFP cages for fibre.
  { id: 'ah-dl-smadi', brand: 'Allen & Heath', model: 'superMADI (M-DL-SMADI)',
    fmt: 'ah-dl-io', note: '128x128 @ 48/96kHz AES10 MADI, coax and optional fibre',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40502416581905',
    auto: [
      { t: 'bnc', n: 4, lbl: 'LINK' },
      { t: 'sfp', n: 4, lbl: ['LINK 5', 'LINK 6', 'LINK 7', 'LINK 8'] },
    ] },

  // Four AES3 variants on one faceplate: five XLR every time, split by model
  // name. The numbers in the name are CHANNELS and each XLR carries a stereo
  // pair, so 6I4O is three in and two out — confirmed against A&H's faceplate
  // drawing, which brackets the first three sockets separately from the last
  // two. All four are 10 channels in total.
  { id: 'ah-dl-aes10o', brand: 'Allen & Heath', model: 'AES3 10 out (M-DL-AES10O)',
    fmt: 'ah-dl-io', note: '5 stereo AES3 outputs',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40489352616977',
    auto: [{ t: 'xlrm', n: 5, sig: 'aes3', lbl: 'AES OUT' }] },
  { id: 'ah-dl-aes2i8o', brand: 'Allen & Heath', model: 'AES3 2 in / 8 out (M-DL-AES2I8O)',
    fmt: 'ah-dl-io', note: '1 stereo AES3 input, 4 stereo outputs',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40489352616977',
    auto: [
      { t: 'xlrf', n: 1, sig: 'aes3', lbl: 'AES IN' },
      { t: 'xlrm', n: 4, sig: 'aes3', lbl: 'AES OUT' },
    ] },
  { id: 'ah-dl-aes4i6o', brand: 'Allen & Heath', model: 'AES3 4 in / 6 out (M-DL-AES4I6O)',
    fmt: 'ah-dl-io', note: '2 stereo AES3 inputs, 3 stereo outputs',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40489352616977',
    auto: [
      { t: 'xlrf', n: 2, sig: 'aes3', lbl: 'AES IN' },
      { t: 'xlrm', n: 3, sig: 'aes3', lbl: 'AES OUT' },
    ] },
  { id: 'ah-dl-aes6i4o', brand: 'Allen & Heath', model: 'AES3 6 in / 4 out (M-DL-AES6I4O)',
    fmt: 'ah-dl-io', note: '3 stereo AES3 inputs, 2 stereo outputs',
    src: 'https://support.allen-heath.com/hc/en-gb/articles/40489352616977',
    auto: [
      { t: 'xlrf', n: 3, sig: 'aes3', lbl: 'AES IN' },
      { t: 'xlrm', n: 2, sig: 'aes3', lbl: 'AES OUT' },
    ] },
];

export const OPTION_CARDS = CARDS;
registerCards(CARDS);

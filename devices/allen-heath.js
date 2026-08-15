// Allen & Heath — 18 devices

// Socket names for a bank that counts DOWN as the panel runs left to right —
// which is most rears, because the numbering is chosen to read correctly from
// the front. Auto-layout places declarations left to right as seen from BEHIND
// the rack, so a plain `lbl: 'IN'` would number these backwards.
const countDown = (prefix, n, last = {}) =>
  Array.from({ length: n }, (_, i) => `${prefix} ${last[n - i] || n - i}`);

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

export const ALLEN_HEATH = [
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
      { t: 'ethercon', n: 1, sig: 'slink', lbl: 'SLINK' },
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
];

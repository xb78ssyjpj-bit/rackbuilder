// Generic — 30 devices

export const GENERIC = [
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

// Yamaha — 5 devices

export const YAMAHA = [
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
    rear: { auto: [{ t: 'ethercon', n: 2, sig: 'dante', lbl: ['DANTE PRI', 'DANTE SEC'] }, { t: 'iec_in', n: 2 }] } },

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
    rear: { auto: [{ t: 'ethercon', n: 2, sig: 'dante', lbl: ['DANTE PRI', 'DANTE SEC'] }, { t: 'iec_in', n: 2 }] } },

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
    rear: { auto: [{ t: 'ethercon', n: 2, sig: 'dante', lbl: ['DANTE PRI', 'DANTE SEC'] }, { t: 'iec_in', n: 1 }] } },

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
];
